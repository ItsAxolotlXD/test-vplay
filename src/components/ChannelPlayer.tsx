import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Tv, 
  Radio, 
  AlertCircle, 
  Info, 
  Maximize,
  ExternalLink,
  Settings,
  Flame,
  Clock,
  Menu,
  SkipBack,
  SkipForward,
  RefreshCw,
  Heart,
  ThumbsUp
} from "lucide-react";
import { Channel } from "../data/channels";

interface ChannelPlayerProps {
  channel: Channel;
  volume: number;
  onVolumeChange: (vol: number) => void;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onPlaybackError?: (error: boolean, isTimeout?: boolean) => void;
  isMaterialDesignActive?: boolean;
}

export default function ChannelPlayer({
  channel,
  volume,
  onVolumeChange,
  muted,
  onMutedChange,
  onPrevChannel,
  onNextChannel,
  isFavorite = false,
  onToggleFavorite,
  onPlaybackError,
  isMaterialDesignActive = false,
}: ChannelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullHD, setIsFullHD] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // AudioContext for 1kHz beep
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [testcardTime, setTestcardTime] = useState<string>("");

  const isTestcard = channel.url === "#testcard" || channel.id === "vtv6_test" || channel.id.startsWith("vtvgo_");

  const stopBeep = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    gainRef.current = null;
  };

  const startBeep = () => {
    if (muted || !isPlaying) {
      stopBeep();
      return;
    }
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (!oscRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1kHz beep
        
        // set volume - keep it mild (volume * 0.1)
        gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        
        oscRef.current = osc;
        gainRef.current = gain;
      } else if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(volume * 0.1, audioCtxRef.current.currentTime);
      }
    } catch (err) {
      console.warn("Could not start 1kHz beep:", err);
    }
  };

  useEffect(() => {
    if ((isTestcard || hasError) && isPlaying && !muted) {
      startBeep();
    } else {
      stopBeep();
    }
    return () => {
      stopBeep();
    };
  }, [isTestcard, hasError, isPlaying, muted, volume]);

  useEffect(() => {
    if (!isTestcard && !hasError) return;
    
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTestcardTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isTestcard, hasError]);

  // Dynamic show details mock program info
  const [programInfo, setProgramInfo] = useState<{
    current: string;
    next: string;
    progress: number;
    time: string;
  }>({
    current: "Chương trình thời sự trực tiếp",
    next: "Phim truyện đặc sắc giờ vàng",
    progress: 45,
    time: "19:00 - 20:00"
  });

  // Calculate random program mock info relative to channel and search
  useEffect(() => {
    const programs = [
      { current: "Tin tức & Sự kiện 24/7", next: "Ký sự truyền hình Việt Nam", progress: 65, time: "18:30 - 19:15" },
      { current: "Chương trình Thời Sự trực tiếp", next: "Bản tin Tài chính Kinh doanh", progress: 40, time: "19:00 - 20:00" },
      { current: "Phim truyền hình Việt Nam đặc sắc", next: "Thế giới thể thao tối", progress: 20, time: "20:00 - 21:00" },
      { current: "Gương mặt thân quen âm nhạc", next: "Review điện ảnh tuần qua", progress: 85, time: "18:00 - 19:30" },
      { current: "Giải trí tổng hợp cuối ngày", next: "Dự báo thời tiết & Tin đêm", progress: 50, time: "19:15 - 20:15" },
      { current: "Kinh tế - Xã hội đầu tuần", next: "Toạ đàm văn hoá nghệ thuật", progress: 10, time: "19:00 - 19:45" },
    ];
    
    const radioPrograms = [
      { current: "Thời sự phát thanh sáng", next: "Giai điệu bình yên", progress: 70, time: "18:00 - 19:00" },
      { current: "Nhịp sống Sài Gòn trực tiếp", next: "Quà tặng âm nhạc số 45", progress: 35, time: "19:00 - 20:30" },
      { current: "Bản tin an toàn giao thông đô thị", next: "Kịch truyền thanh đêm khuya", progress: 55, time: "18:30 - 19:15" },
    ];

    const list = channel.isRadio ? radioPrograms : programs;
    // Simple deterministic pick based on channel id string length
    const idx = (channel.id.length + (channel.name ? channel.name.length : 0)) % list.length;
    
    // Set simulated current progress bar
    setProgramInfo({
      ...list[idx],
      progress: Math.floor(Math.random() * 60) + 15
    });
  }, [channel]);

  useEffect(() => {
    if (onPlaybackError) {
      onPlaybackError(hasError, false);
    }
  }, [hasError, onPlaybackError]);

  useEffect(() => {
    let timer: any = null;
    if (isLoading) {
      timer = setTimeout(() => {
        if (onPlaybackError) {
          onPlaybackError(true, true);
        }
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, onPlaybackError]);

  // Clean, initialize and play stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isTestcard) {
      setIsLoading(false);
      setHasError(false);
      setErrorMessage("");
      setIsPlaying(true);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    setIsPlaying(true);

    // Destroy existing instance of hls player
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const playVideo = () => {
      video.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn("Autoplay block or playback interrupted:", err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    };

    // Check if the source is video format or an absolute m3u8 url
    if (channel.url.endsWith(".m3u8") || hlsRef.current === null) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxBufferSize: 30 * 1000 * 1000, // 30MB
        });

        hlsRef.current = hls;
        hls.loadSource(channel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          playVideo();
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.error("HLS error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("Fatal network error encountered, attempting to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Fatal media error encountered, attempting to recover...");
                hls.recoverMediaError();
                break;
              default:
                console.error("Fatal unrecoverable HLS error");
                setHasError(true);
                setErrorMessage(
                  "Lỗi nhà mạng hoặc luồng phát tạm thời gián đoạn. Link m3u8 bảo mật hoặc chặn CORS tại quốc gia của bạn."
                );
                setIsLoading(false);
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (e.g. Safari)
        video.src = channel.url;
        video.addEventListener("loadedmetadata", () => {
          playVideo();
        });
        video.addEventListener("error", () => {
          setHasError(true);
          setErrorMessage("Thiết bị không hỗ trợ định dạng trực tiếp hoặc lỗi CORS kết nối.");
          setIsLoading(false);
        });
      } else {
        setHasError(true);
        setErrorMessage("Trình duyệt không hỗ trợ HLS Player để phát luồng m3u8.");
        setIsLoading(false);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url, channel.id]);

  // Handle Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Handle volume change
  const handleVolumeChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    onVolumeChange(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const newMuted = !muted;
    onMutedChange(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  // Handle Fullscreen
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen(); // Safari
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen(); // IE11
    }
  };

  // Handle Mouse Move over Player for Controls fade in/out
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying && !hasError && !isLoading) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);

  // Dynamic status badges
  const isVtv = channel.group?.toUpperCase().includes("VTV") || false;
  const isCab = channel.group?.toUpperCase().includes("VTVCAB") || channel.group?.toUpperCase().includes("SCTV") || false;

  return (
    <div id="channel-player-container font-sans" className="w-full max-w-5xl mx-auto mb-8 animate-fade-in">
      {/* Player Frame without color tint or ambient blue */}
      <div 
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && !hasError && !isLoading && setShowControls(false)}
      >
        {/* Real Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black cursor-default"
          onClick={togglePlay}
          playsInline
          autoPlay
          muted={muted}
        />

        {/* Testcard or Stream Error EBU Colorbars View */}
        {((isTestcard && !isLoading) || (hasError && !isLoading)) && (
          <div className="absolute inset-0 flex flex-col z-20 select-none bg-black overflow-hidden">
            {/* Background EBU Colorbars Image */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/EBU_Colorbars_HD.svg/960px-EBU_Colorbars_HD.svg.png?_=20220810032923" 
              alt="EBU Colorbars"
              className="absolute inset-0 w-full h-full object-cover z-0"
              referrerPolicy="no-referrer"
            />
            
            {/* Retro Analog/Digital scanline effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-10 pointer-events-none z-10" />

            {/* If it's a regular testcard channel */}
            {isTestcard && !hasError && null}

            {/* If it's an active stream loading error */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 p-4 font-sans">
                <div className="w-full max-w-lg bg-black/85 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center animate-fade-in">
                  {/* Alert Icon flashing */}
                  <div className="p-3.5 bg-red-500/10 rounded-full border border-red-500/30 text-red-400 mb-3.5 animate-pulse">
                    <AlertCircle className="w-9 h-9" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase mb-3 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    MẤT TÍN HIỆU / NO SIGNAL
                  </div>

                  <h3 className="text-white text-base sm:text-lg font-bold mb-1.5">
                    Không thể phát {channel.name}
                  </h3>
                  
                  <p className="text-white/60 text-xs leading-relaxed mb-5 max-w-md">
                    {errorMessage}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                        if (videoRef.current) {
                          const currentSrc = videoRef.current.src;
                          videoRef.current.src = "";
                          videoRef.current.src = currentSrc;
                          videoRef.current.load();
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-semibold border border-white/10 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Thử kết nối lại
                    </button>
                    
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                      Mở link gốc trực tiếp <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/35 max-w-md leading-relaxed">
                    Mẹo: Một số trình duyệt có thể chặn CORS của luồng trực tiếp. Hãy thử sử dụng Safari, tiện ích CORS Unblock, hoặc mở xem bằng các ứng dụng hỗ trợ VLC/PotPlayer.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
            <svg className="animate-spin h-14 w-14 text-white" viewBox="0 0 50 50">
              <circle
                className="opacity-100"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="40 150"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* Visual representation fallback for Radio / Audio Only channels */}
        {channel.isRadio && !isLoading && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/90 to-rose-950/80 backdrop-blur-lg flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="relative">
              {/* Dynamic waveform visualizer animation wrapper */}
              <div className="absolute -inset-10 bg-white/5 rounded-full animate-ping opacity-25"></div>
              <div className="w-24 h-24 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-white p-4">
                <Radio className="w-12 h-12 text-pink-400 animate-pulse" />
              </div>
            </div>
            <p className="mt-5 text-white text-lg font-bold tracking-wide">{channel.name}</p>
            <p className="text-xs text-white/65 mt-1 tracking-wider uppercase">Phát Thanh Audio Chất Lượng Cao</p>
            
            {/* Wave lines simulation */}
            <div className="flex gap-1.5 mt-6 h-6 items-end">
              {[...Array(14)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-pink-400 rounded-full transition-all duration-300"
                  style={{ 
                    height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : '4px',
                    animation: isPlaying ? `pulse 1.3s ease-in-out infinite alternate` : undefined,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Frosted Glass Bottom Overlay Controls */}
        <div className={`absolute bottom-0 inset-x-0 p-4 transition-all duration-300 flex flex-col gap-3.5 z-15 ${showControls || !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
          
          {/* Progressive blur background for premium translucent control base */}
          <div className="progressive-blur-player" />

          {/* Interactive controls content wrapper above blur */}
          <div className="relative z-10 flex flex-col gap-3.5 w-full">
            {/* 1. Horizontal Progress timeline/slider from mock */}
            <div className="w-full flex items-center mt-1 px-1 relative group/slider">
              <div 
                className="w-full h-1 bg-white/20 rounded-full relative cursor-default"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = Math.min(100, Math.max(0, Math.round((clickX / rect.width) * 100)));
                  setProgramInfo(prev => ({ ...prev, progress: pct }));
                }}
              >
                {/* Active slider track filled with beautiful vibrant blue */}
                <div 
                  className="h-full bg-[#0084ff] rounded-full relative" 
                  style={{ width: `${programInfo.progress}%` }}
                >
                  {/* Thumb dot - Horizontal Pill Shape Capsule (interactive glassy spring scaling on hover/drag - transparent glassy bubble) */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[32px] sm:w-[40px] h-[16px] sm:h-[20px] bg-white rounded-full shadow-lg border border-white/60 transition-all duration-300 ease-[cubic-bezier(0.175,1.85,0.35,1.45)] group-hover/slider:scale-135 group-hover/slider:bg-transparent group-hover/slider:border-white/95 group-active/slider:scale-175 group-active/slider:bg-transparent group-active/slider:border-white"></div>
                </div>
              </div>
            </div>

          {/* 2. Controls and Buttons row */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Left Utility: Volume Controls with 10% opacity & 10% blur */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-[1.5px] border border-white/10 pl-2 pr-2.5 py-1.5 rounded-full group/vol bouncy-btn shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)]">
              <button onClick={toggleMute} className="text-white/80 hover:text-white p-0.5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-120 active:scale-135">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChangeLocal}
                className="w-12 sm:w-16 h-1 rounded-lg appearance-none cursor-default transition-all range-slider-pill outline-none"
                style={{
                  background: `linear-gradient(to right, #0084ff ${(muted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(muted ? 0 : volume) * 100}%)`
                }}
              />
            </div>

            {/* Centered 5 Glassmorphic Buttons exactly as required by mock */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3.5">
              {/* Button 1: Dynamic Heart Favorite button */}
              <button 
                onClick={onToggleFavorite}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-[1.5px] border border-white/10 bouncy-btn flex items-center justify-center text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-default group"
                title={isFavorite ? "Bỏ yêu thích" : "Yêu thích kênh"}
              >
                {isMaterialDesignActive ? (
                  <ThumbsUp className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${isFavorite ? "text-[#d0bcff] fill-[#d0bcff] scale-110" : "text-white/80 group-hover:text-[#d0bcff] group-hover:scale-110"}`} />
                ) : (
                  <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${isFavorite ? "text-red-500 fill-red-500 scale-110" : "text-white/80 group-hover:text-red-400 group-hover:scale-110"}`} />
                )}
              </button>

              {/* Button 2: Skip back */}
              <button 
                onClick={onPrevChannel}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-[1.5px] border border-white/10 bouncy-btn flex items-center justify-center text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-default"
                title="Kênh trước"
              >
                <SkipBack className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </button>

              {/* Button 3: Main center Play/Pause button (Larger size) */}
              <button 
                onClick={togglePlay}
                className="w-11 h-11 xs:w-12 xs:h-12 sm:w-15 sm:h-15 rounded-full bg-white/10 backdrop-blur-[1.5px] border border-white/10 bouncy-btn flex items-center justify-center text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3),0_12px_24px_rgba(0,0,0,0.3)] cursor-default"
                title={isPlaying ? "Tạm Dừng" : "Phát"}
              >
                {isPlaying ? (
                  <Pause className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-white text-white" />
                ) : (
                  <Play className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-white text-white translate-x-0.5" />
                )}
              </button>

              {/* Button 4: Skip forward */}
              <button 
                onClick={onNextChannel}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-[1.5px] border border-white/10 bouncy-btn flex items-center justify-center text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-default"
                title="Kênh sau"
              >
                <SkipForward className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </button>

              {/* Button 5: Loop context / reload button */}
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-[1.5px] border border-white/10 bouncy-btn flex items-center justify-center text-white shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-default"
                title="Tải lại luồng"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-once" />
              </button>
            </div>

            {/* Right Utility: Fullscreen scale config */}
            <button 
              onClick={handleFullscreen}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 backdrop-blur-[1.5px] bouncy-btn text-white/70 hover:text-white border border-white/10 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.65),inset_-0.5px_-0.5px_0px_rgba(255,255,255,0.3)] cursor-default flex items-center justify-center shrink-0"
              title="Toàn màn hình"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
