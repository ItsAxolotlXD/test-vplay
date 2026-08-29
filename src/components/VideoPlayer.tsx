import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Radio, 
  Settings, 
  Tv, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  Heart,
  PictureInPicture2
} from 'lucide-react';
import { Channel } from '../types';
import { useHLS } from '../hooks/useHLS';
import { useFavorites } from '../hooks/useFavorites';

interface VideoPlayerProps {
  channel: Channel;
  onOpenCustomStreamModal?: () => void;
  onSelectAlternativeStream?: () => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  onOpenCustomStreamModal,
  isTheaterMode,
  onToggleTheaterMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();
  const isFav = isChannelFavorite(channel.id);

  const {
    videoRef,
    isPlaying,
    isLoading,
    isBuffering,
    error,
    volume,
    isMuted,
    qualities,
    currentQuality,
    togglePlay,
    changeVolume,
    toggleMute,
    setQuality,
    retry
  } = useHLS(channel.streamUrl, true);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.warn);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.warn);
      setIsFullscreen(false);
    }
  };

  const handlePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP not supported or failed', e);
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      id="waves-video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full rounded-[30px] overflow-hidden bg-black border border-[#2E2E36] shadow-2xl transition-all duration-300 ${
        isTheaterMode ? 'aspect-[21/9] max-h-[75vh]' : 'aspect-video'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-contain bg-black cursor-pointer"
        onClick={togglePlay}
      />

      {/* Ambient background glow when playing */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60 opacity-80" />

      {/* Top Header Overlay: Channel Brand + Live Badge + Viewers */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-20 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E1E22]/90 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
            <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white tracking-tight drop-shadow-md">
                {channel.name}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FF2020] text-white rounded-full uppercase tracking-wider">
                {channel.quality}
              </span>
            </div>
            <p className="text-xs text-[#D1D5DB] line-clamp-1">
              Đang phát: {channel.currentProgram?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Viewers Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#D1D5DB]">
            <Eye className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="font-semibold">{channel.viewers?.toLocaleString() || '14,280'}</span>
            <span className="text-[10px] text-[#9CA3AF]">đang xem</span>
          </div>

          {/* Glowing Live Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2020]/20 border border-[#FF2020]/60 text-[#FF4D4D] text-xs font-bold shadow-[0_0_12px_rgba(255,32,32,0.4)]">
            <span className="w-2 h-2 rounded-full bg-[#FF2020] animate-ping" />
            <span>TRỰC TIẾP</span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavoriteChannel(channel.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isFav 
                ? 'bg-[#FF2020] border-[#FF2020] text-white shadow-lg' 
                : 'bg-black/60 border-white/20 text-white hover:bg-[#FF2020]/20 hover:border-[#FF2020]'
            }`}
            title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Buffering & Loading Spinner */}
      {(isLoading || isBuffering) && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-3 border-[#E50914]/20 border-t-[#E50914] animate-spin mb-3 glow-purple" />
          <span className="text-xs font-medium text-white/90 tracking-wide bg-black/60 px-3 py-1 rounded-full border border-white/10">
            {isLoading ? 'Đang kết nối luồng phát sóng HLS...' : 'Đang nạp bộ đệm (Buffering)...'}
          </span>
        </div>
      )}

      {/* Error Overlay UI if Stream fails */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#17171A]/95 p-6 z-20 text-center animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-[#FF2020]/15 border border-[#FF2020]/30 flex items-center justify-center text-[#FF4D4D] mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-1">
            Không thể phát kênh này
          </h3>
          <p className="text-xs md:text-sm text-[#9CA3AF] max-w-md mb-6 leading-relaxed">
            Luồng trực tiếp của <span className="text-white font-semibold">{channel.name}</span> đang tạm thời bảo trì hoặc địa chỉ M3U8 nguồn thay đổi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={retry}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-purple-active text-white text-xs font-bold hover:scale-105 transition-all shadow-lg glow-purple"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>

            {onOpenCustomStreamModal && (
              <button
                onClick={onOpenCustomStreamModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2A2A30] hover:bg-[#34343E] border border-[#3E3E48] text-white text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Dán URL M3U8 Khác</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Center Big Play Button when paused */}
      {!isPlaying && !isLoading && !error && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-15 cursor-pointer group"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-[#FF2020] to-[#E50914] flex items-center justify-center text-white shadow-2xl glow-purple transform group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col gap-2 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between bg-black/70 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2.5 shadow-xl">
          {/* Left Controls: Play/Pause, Live button, Volume */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Live Indicator Button */}
            <button
              onClick={retry}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF2020]/20 text-[#FF4D4D] border border-[#FF2020]/40 text-xs font-bold hover:bg-[#FF2020]/30 transition-colors"
              title="Nhấp để đồng bộ trực tiếp"
            >
              <Radio className="w-3 h-3" />
              <span>LIVE</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="text-[#D1D5DB] hover:text-white transition-colors"
                aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-[#FF4D4D]" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-[#3A3A42] accent-[#E50914] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls: Quality, PiP, Theater, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#26262C] hover:bg-[#34343E] border border-white/15 text-xs text-white font-medium transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#E50914]" />
                <span>
                  {currentQuality === -1 
                    ? 'Tự động' 
                    : qualities[currentQuality]?.label || 'HD'}
                </span>
              </button>

              {showQualityMenu && qualities.length > 0 && (
                <div className="absolute bottom-full right-0 mb-2 w-36 bg-[#1E1E22] border border-[#3A3A42] rounded-2xl p-1.5 shadow-2xl z-30">
                  <div className="text-[10px] uppercase font-bold text-[#8E8E93] px-2 py-1">
                    Chất lượng phát
                  </div>
                  <button
                    onClick={() => {
                      setQuality(-1);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                      currentQuality === -1 ? 'bg-[#E50914] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#2A2A32]'
                    }`}
                  >
                    <span>Tự động (Auto)</span>
                  </button>
                  {qualities.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setQuality(q.id);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                        currentQuality === q.id ? 'bg-[#E50914] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#2A2A32]'
                      }`}
                    >
                      <span>{q.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            <button
              onClick={handlePiP}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Phát thu nhỏ (Picture-in-Picture)"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Theater Mode */}
            {onToggleTheaterMode && (
              <button
                onClick={onToggleTheaterMode}
                className="hidden sm:flex w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
                title="Chế độ rạp chiếu phim (Theater Mode)"
              >
                <Layers className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={handleFullscreenToggle}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
