import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Search, 
  Radio, 
  Sparkles, 
  Clock, 
  Check, 
  Disc3, 
  ListMusic,
  SkipForward,
  SkipBack,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TV_MUSIC_TRACKS, TvMusicTrack, getAudioProxyUrl } from '../data/tvMusicData';

interface MusicTabProps {
  navigate?: (route: string) => void;
}

export const MusicTab: React.FC<MusicTabProps> = ({ navigate }) => {
  const [tracks] = useState<TvMusicTrack[]>(TV_MUSIC_TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState<string>(TV_MUSIC_TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  // Initialize or update audio src
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    
    // Set proxy URL for reliable streaming
    audio.src = getAudioProxyUrl(currentTrack.audioUrl);
    audio.loop = isLooping;
    audio.volume = isMuted ? 0 : volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (!isLooping) {
        handleNextTrack();
      }
    };
    const onError = () => {
      // Fallback directly to original URL
      if (audio.src !== currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
        if (isPlaying) {
          audio.play().catch(() => setIsPlaying(false));
        }
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [currentTrackId]);

  // Volume & Mute listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Loop toggle listener
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlayPause = (track?: TvMusicTrack) => {
    if (!audioRef.current) return;

    if (track && track.id !== currentTrackId) {
      setCurrentTrackId(track.id);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
    }
  };

  const handleNextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrackId(tracks[nextIndex].id);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackId(tracks[prevIndex].id);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleCopyLink = (track: TvMusicTrack) => {
    navigator.clipboard.writeText(track.audioUrl);
    setCopiedId(track.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered tracks by search
  const filteredTracks = tracks.filter((t) => {
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.era.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#200B1A] via-[#2A1024] to-[#160814] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#E6005A]/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 rounded-full bg-[#8000FF]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6005A]/20 border border-[#E6005A]/30 text-[#FF4C93] text-xs font-bold tracking-wider uppercase">
              <Music className="w-3.5 h-3.5" />
              <span>VNRT Online Music • Kho Nhạc Truyền Hình</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Nhạc hiệu & Nhận diện kênh truyền hình
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Kho lưu trữ toàn bộ âm thanh nhận diện, nhạc nền truyền hình qua các thời kỳ.
            </p>
          </div>

          {/* Quick Counter Card */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E6005A] to-[#8000FF] flex items-center justify-center text-white shadow-lg">
              <Disc3 className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{tracks.length}</div>
              <div className="text-xs text-zinc-400 font-medium">Bản ghi âm thanh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Music Player Card */}
      <div className="rounded-3xl bg-[#1A0E17]/95 border border-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Vinyl / Cover Disk Graphic */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#2D1626] to-[#0F070D] border-4 border-white/15 p-3 flex items-center justify-center shadow-2xl relative ${isPlaying ? 'shadow-[0_0_30px_rgba(230,0,90,0.4)]' : ''}`}>
              {/* Vinyl grooves */}
              <div className="absolute inset-2 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-6 rounded-full border border-white/5" />

              {/* Center Channel Logo Badge */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#180C15] border-2 border-white/20 flex items-center justify-center p-2.5 overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                <img
                  src={currentTrack.channelLogo || 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png'}
                  alt={currentTrack.channel}
                  className="w-full h-full object-contain filter drop-shadow"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Playing equalizer bars indicator */}
            {isPlaying && (
              <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-[#E6005A] text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                <span className="w-1 h-3 bg-white animate-pulse" />
                <span className="w-1 h-4 bg-white animate-pulse delay-75" />
                <span className="w-1 h-2 bg-white animate-pulse delay-150" />
                <span>ĐANG PHÁT</span>
              </div>
            )}
          </div>

          {/* Current Track Info & Interactive Player Controls */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-400">
                    {currentTrack.era}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
                  {currentTrack.title}
                </h2>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(currentTrack)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Sao chép liên kết audio"
                >
                  {copiedId === currentTrack.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={currentTrack.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Tải về file MP3"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Time progress bar slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#E6005A]"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Buttons Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              {/* Playback playback buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevTrack}
                  className="p-2.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Bài trước"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => togglePlayPause()}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E6005A] to-[#FF2E79] hover:brightness-110 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                  title={isPlaying ? "Tạm dừng" : "Phát"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Bài kế tiếp"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isLooping 
                      ? 'bg-[#E6005A]/25 text-[#FF4C93]' 
                      : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                  title={isLooping ? "Lặp lại: BẬT" : "Lặp lại: TẮT"}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 sm:w-28 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E6005A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar (bỏ phân loại, căn trái) */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md h-[44px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0 mr-auto">
          <Search className="w-4.5 h-4.5 text-white stroke-[2.4] shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài nhạc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate border-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs text-zinc-400 shrink-0 font-medium">
          Hiển thị <span className="text-white font-bold">{filteredTracks.length}</span> bài
        </div>
      </div>

      {/* Track List Grid (bỏ phân loại, bỏ description) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">#</span>
            <span>Tên bản nhạc</span>
          </div>
          <div className="flex items-center gap-8 sm:gap-12">
            <span>Giai đoạn</span>
            <span className="w-20 text-center">Thao tác</span>
          </div>
        </div>

        {filteredTracks.map((track, index) => {
          const isCurrent = track.id === currentTrackId;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => togglePlayPause(track)}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-[#291322] border-[#E6005A]/40 shadow-lg shadow-pink-950/20'
                  : 'bg-[#180E16]/80 hover:bg-[#20131E] border-white/5 hover:border-white/15'
              }`}
            >
              {/* Left Column: Number/Play, Logo, Name (bỏ description) */}
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
                <div className="w-8 flex items-center justify-center shrink-0">
                  {isCurrentPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-[#E6005A] animate-pulse h-full" />
                      <span className="w-1 bg-[#E6005A] animate-pulse h-2.5" />
                      <span className="w-1 bg-[#E6005A] animate-pulse h-3.5" />
                    </div>
                  ) : (
                    <span className={`text-xs font-bold ${isCurrent ? 'text-[#FF4C93]' : 'text-zinc-400'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Channel icon badge */}
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  <img
                    src={track.channelLogo || 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png'}
                    alt={track.channel}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Title (bỏ description) */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-bold truncate ${isCurrent ? 'text-white' : 'text-zinc-100'}`}>
                      {track.title}
                    </h3>
                    {track.badge && (
                      <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#E6005A]/20 text-[#FF4C93] border border-[#E6005A]/30">
                        {track.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Era, Actions (bỏ phân loại) */}
              <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
                  {track.era}
                </span>

                <div className="flex items-center gap-1.5 w-20 justify-end" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => togglePlayPause(track)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isCurrentPlaying
                        ? 'bg-[#E6005A] text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isCurrentPlaying ? "Tạm dừng" : "Phát"}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCopyLink(track)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Sao chép link"
                  >
                    {copiedId === track.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
