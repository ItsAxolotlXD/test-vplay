import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Tv, 
  X, 
  LayoutGrid, 
  Layers, 
  RotateCcw, 
  ChevronDown, 
  Check, 
  Sparkles,
  SlidersHorizontal,
  Plus,
  Minus
} from 'lucide-react';
import Hls from 'hls.js';

export interface MultiviewChannelItem {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category?: string;
  isVtv2?: boolean;
}

interface MultiviewPlayerProps {
  allChannels: MultiviewChannelItem[];
  currentChannel: MultiviewChannelItem;
  onSelectSingleChannel: (channel: MultiviewChannelItem) => void;
  onExitMultiview: () => void;
  aspectRatio?: '16:9' | '4:3';
}

// Single Video Slot Component for high performance & clean lifecycle
interface VideoSlotProps {
  channel: MultiviewChannelItem;
  slotIndex: number;
  isActiveAudio: boolean;
  isMutedOverall: boolean;
  onAudioSelect: () => void;
  onMaximizeChannel: () => void;
  onChangeChannel: (newChannel: MultiviewChannelItem) => void;
  allChannels: MultiviewChannelItem[];
  aspectRatio: '16:9' | '4:3';
  totalSlots: number;
}

const VideoSlot: React.FC<VideoSlotProps> = ({
  channel,
  slotIndex,
  isActiveAudio,
  isMutedOverall,
  onAudioSelect,
  onMaximizeChannel,
  onChangeChannel,
  allChannels,
  aspectRatio,
  totalSlots,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowChannelPicker(false);
      }
    };
    if (showChannelPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChannelPicker]);

  // HLS stream loader
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!channel.streamUrl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        manifestLoadingTimeOut: 6000,
        manifestLoadingMaxRetry: 2,
      });

      hlsRef.current = hls;
      hls.loadSource(channel.streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setIsLoading(false);
              hls.destroy();
              hlsRef.current = null;
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setHasError(true);
        setIsLoading(false);
      });
    } else {
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.id, channel.streamUrl]);

  // Synchronize audio state: only play audio if this slot is active audio AND not muted overall
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !(isActiveAudio && !isMutedOverall);
    }
  }, [isActiveAudio, isMutedOverall]);

  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return allChannels;
    const q = searchQuery.toLowerCase();
    return allChannels.filter(c => c.name.toLowerCase().includes(q));
  }, [allChannels, searchQuery]);

  // Dynamic sizing classes based on totalSlots
  const isMini = totalSlots >= 10;
  const isCompact = totalSlots >= 6;

  return (
    <div 
      className={`relative w-full h-full bg-black rounded-lg overflow-hidden group flex items-center justify-center transition-all ${
        isActiveAudio && !isMutedOverall 
          ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)] z-10' 
          : 'ring-1 ring-white/10 hover:ring-white/30'
      }`}
      onClick={(e) => {
        // Clicking tile switches audio focus
        if (!showChannelPicker) {
          onAudioSelect();
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted={!(isActiveAudio && !isMutedOverall)}
        className="w-full h-full object-fill bg-black cursor-pointer"
        style={{
          objectFit: 'fill',
          aspectRatio: aspectRatio === '4:3' ? '4 / 3' : '16 / 9'
        }}
      />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-900/90 flex flex-col items-center justify-center p-2 text-center">
          <Tv className="w-6 h-6 text-zinc-500 mb-1" />
          <span className="text-[11px] text-zinc-400 font-medium">Kênh không có luồng</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowChannelPicker(true);
            }}
            className="mt-1.5 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold"
          >
            Đổi kênh khác
          </button>
        </div>
      )}

      {/* Top Header Badge (Channel Name + Slot Number) */}
      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-white border border-white/10 max-w-[80%]">
          <span className="text-[10px] font-mono font-bold text-red-400">#{slotIndex + 1}</span>
          <img 
            src={channel.logo} 
            alt={channel.name} 
            className="w-3.5 h-3.5 object-contain shrink-0" 
            referrerPolicy="no-referrer"
          />
          <span className="text-[11px] font-bold truncate">{channel.name}</span>
        </div>

        {/* Audio Indicator Badge */}
        {isActiveAudio && !isMutedOverall ? (
          <div className="flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold animate-pulse shadow-md">
            <Volume2 className="w-3 h-3" />
            {!isMini && <span>Âm thanh</span>}
          </div>
        ) : (
          <div className="bg-black/60 px-1.5 py-0.5 rounded-md text-zinc-400 text-[10px]">
            <VolumeX className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Hover Control Action Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 sm:p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div className="flex items-center gap-1">
          {/* Audio Switch Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAudioSelect();
            }}
            className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
              isActiveAudio && !isMutedOverall
                ? 'bg-red-600 text-white'
                : 'bg-black/60 hover:bg-white/20 text-white'
            }`}
            title={isActiveAudio && !isMutedOverall ? 'Kênh đang phát âm thanh' : 'Bật tiếng cho kênh này'}
          >
            {isActiveAudio && !isMutedOverall ? (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
            )}
            {!isCompact && (
              <span className="text-[10px]">
                {isActiveAudio && !isMutedOverall ? 'Đang nghe' : 'Nghe kênh này'}
              </span>
            )}
          </button>

          {/* Change Channel Dropdown Button */}
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowChannelPicker(!showChannelPicker);
              }}
              className="p-1.5 rounded-md bg-black/60 hover:bg-white/20 text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer"
              title="Đổi kênh truyền hình trong ô này"
            >
              <span>Đổi kênh</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Quick Channel Picker Dropdown */}
            {showChannelPicker && (
              <div 
                className="absolute bottom-full left-0 mb-1 w-60 max-h-56 bg-zinc-900/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl p-2 z-50 flex flex-col pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[11px] font-bold text-white mb-1.5 px-1 flex items-center justify-between">
                  <span>Chọn kênh cho Ô #{slotIndex + 1}</span>
                  <button 
                    onClick={() => setShowChannelPicker(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kênh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 mb-1.5 text-xs bg-black/50 border border-white/10 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
                />
                <div className="overflow-y-auto flex-1 space-y-1 max-h-40 [scrollbar-width:thin]">
                  {filteredChannels.map((c) => {
                    const isSelected = c.id === channel.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onChangeChannel(c);
                          setShowChannelPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer ${
                          isSelected ? 'bg-red-600/30 text-red-200 font-bold' : 'hover:bg-white/10 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img 
                            src={c.logo} 
                            alt={c.name} 
                            className="w-4 h-4 object-contain shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate">{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Maximize to Single View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMaximizeChannel();
          }}
          className="p-1.5 rounded-md bg-black/60 hover:bg-red-600 text-white transition-all cursor-pointer flex items-center gap-1"
          title="Phóng to kênh này ra chế độ đơn kênh"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {!isCompact && <span className="text-[10px] font-bold">Xem riêng</span>}
        </button>
      </div>
    </div>
  );
};

export const MultiviewPlayer: React.FC<MultiviewPlayerProps> = ({
  allChannels,
  currentChannel,
  onSelectSingleChannel,
  onExitMultiview,
  aspectRatio = '16:9',
}) => {
  // Configurable channel count between 2 and 15
  const [channelCount, setChannelCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vplay_multiview_count');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 2 && parsed <= 15) return parsed;
      }
    } catch {}
    return 4; // Default to 4 channels (2x2 grid)
  });

  // Multiview channel slot assignment
  const [slotChannels, setSlotChannels] = useState<MultiviewChannelItem[]>(() => {
    // Generate initial unique channel list starting with currentChannel
    const selected: MultiviewChannelItem[] = [currentChannel];
    const pool = allChannels.filter(c => c.id !== currentChannel.id);
    for (let i = 0; i < 14 && i < pool.length; i++) {
      selected.push(pool[i]);
    }
    return selected;
  });

  // Active audio slot index (0 to channelCount - 1)
  const [activeAudioIndex, setActiveAudioIndex] = useState<number>(0);
  const [isMutedOverall, setIsMutedOverall] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Save channel count preference
  const handleSetCount = (count: number) => {
    const clamped = Math.max(2, Math.min(15, count));
    setChannelCount(clamped);
    try {
      localStorage.setItem('vplay_multiview_count', clamped.toString());
    } catch {}

    // Make sure we have enough distinct channels in slotChannels
    setSlotChannels((prev) => {
      if (prev.length >= clamped) return prev;
      const currentIds = new Set(prev.map(c => c.id));
      const needed = clamped - prev.length;
      const candidates = allChannels.filter(c => !currentIds.has(c.id));
      const added = candidates.slice(0, needed);
      // If we run out of unique channels, loop through allChannels
      while (added.length < needed) {
        added.push(allChannels[added.length % allChannels.length]);
      }
      return [...prev, ...added];
    });

    if (activeAudioIndex >= clamped) {
      setActiveAudioIndex(0);
    }
  };

  const handleUpdateSlotChannel = (index: number, newChannel: MultiviewChannelItem) => {
    setSlotChannels((prev) => {
      const next = [...prev];
      next[index] = newChannel;
      return next;
    });
  };

  const handleShuffleTopChannels = () => {
    // Auto-populate with top popular channels
    const top = allChannels.slice(0, channelCount);
    setSlotChannels(top);
    setActiveAudioIndex(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Compute CSS grid columns & rows based on channelCount (2 to 15)
  const gridLayoutClass = useMemo(() => {
    switch (channelCount) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 grid-rows-1';
      case 3:
        return 'grid-cols-1 sm:grid-cols-3 grid-rows-1';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 5:
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 grid-rows-2';
      case 7:
      case 8:
        return 'grid-cols-2 sm:grid-cols-4 grid-rows-2';
      case 9:
        return 'grid-cols-3 grid-rows-3';
      case 10:
      case 11:
      case 12:
        return 'grid-cols-3 sm:grid-cols-4 grid-rows-3';
      case 13:
      case 14:
      case 15:
      default:
        return 'grid-cols-3 sm:grid-cols-5 grid-rows-3';
    }
  }, [channelCount]);

  const activeSlots = useMemo(() => {
    return slotChannels.slice(0, channelCount);
  }, [slotChannels, channelCount]);

  return (
    <div 
      ref={containerRef}
      id="vplay-multiview-container"
      className="w-full bg-[#0E0E12] rounded-2xl border border-white/15 p-2 sm:p-3 space-y-3 shadow-2xl flex flex-col"
    >
      {/* Multiview Top Controller Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-white/10 px-1">
        {/* Left: Mode Title + Channel Count Stepper */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-1.5">
                  <span>Multiview Truyền Hình</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">
                    {channelCount} Kênh
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Xem đồng thời từ 2 đến 15 kênh chương trình cùng lúc
              </p>
            </div>
          </div>

          {/* Stepper (- / +) to select 2 - 15 channels */}
          <div className="flex items-center bg-zinc-900 border border-white/15 rounded-full p-0.5 shadow-inner">
            <button
              type="button"
              disabled={channelCount <= 2}
              onClick={() => handleSetCount(channelCount - 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              title="Giảm số kênh"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-white select-none">
              {channelCount}
            </span>
            <button
              type="button"
              disabled={channelCount >= 15}
              onClick={() => handleSetCount(channelCount + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              title="Tăng số kênh"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Quick Channel Presets (2, 4, 6, 9, 12, 15) */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 [scrollbar-width:none]">
          {[2, 4, 6, 9, 12, 15].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSetCount(preset)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                channelCount === preset
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white'
              }`}
            >
              {preset} Kênh
            </button>
          ))}
        </div>

        {/* Right Actions: Auto-populate, Mute All, Fullscreen, Return to Single View */}
        <div className="flex items-center gap-2">
          {/* Auto shuffle / Fill Top Channels */}
          <button
            type="button"
            onClick={handleShuffleTopChannels}
            className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Tự động xếp các kênh phổ biến nhất"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Top kênh</span>
          </button>

          {/* Mute All Toggle */}
          <button
            type="button"
            onClick={() => setIsMutedOverall(!isMutedOverall)}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
              isMutedOverall
                ? 'bg-red-600/30 border-red-500/50 text-red-300'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
            }`}
            title={isMutedOverall ? 'Bật lại âm thanh' : 'Tắt tiếng tất cả các kênh'}
          >
            {isMutedOverall ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình Multiview'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Return to Single View Button (Radius corner 30px) */}
          <button
            type="button"
            onClick={onExitMultiview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[30px] bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            title="Quay lại chế độ xem 1 kênh truyền hình"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Đơn kênh</span>
          </button>
        </div>
      </div>

      {/* Multiview Dynamic Video Grid Container */}
      <div 
        className={`w-full grid gap-2 sm:gap-2.5 transition-all flex-1 min-h-[360px] sm:min-h-[480px] lg:min-h-[580px] ${gridLayoutClass}`}
        style={{
          aspectRatio: isFullscreen ? 'auto' : '16 / 9',
        }}
      >
        {activeSlots.map((slotChannel, idx) => (
          <VideoSlot
            key={`slot-${idx}-${slotChannel.id}`}
            channel={slotChannel}
            slotIndex={idx}
            isActiveAudio={activeAudioIndex === idx}
            isMutedOverall={isMutedOverall}
            onAudioSelect={() => setActiveAudioIndex(idx)}
            onMaximizeChannel={() => onSelectSingleChannel(slotChannel)}
            onChangeChannel={(newChannel) => handleUpdateSlotChannel(idx, newChannel)}
            allChannels={allChannels}
            aspectRatio={aspectRatio}
            totalSlots={channelCount}
          />
        ))}
      </div>

      {/* Multiview Help & Audio Focus Tip Footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 px-2 pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>
            Bấm vào bất kỳ ô video nào để <strong>nghe tiếng kênh đó</strong> (Kênh #{activeAudioIndex + 1}: {slotChannels[activeAudioIndex]?.name || ''}).
          </span>
        </div>
        <span className="text-zinc-500">
          Chạm vào biểu tượng phóng to trên mỗi ô để xem toàn màn hình kênh đó.
        </span>
      </div>
    </div>
  );
};
