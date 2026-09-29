import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Maximize2, Loader2, ArrowRight } from 'lucide-react';

interface IntermissionIntroVideoProps {
  onFinish: () => void;
  onSkip?: () => void;
}

// Local ultra-fast video stream first, then API endpoint, then Wikia proxy
const VIDEO_SOURCES = [
  '/intro_screen.mp4',
  '/api/intermission-video',
  `/api/video-proxy?url=${encodeURIComponent('https://static.wikia.nocookie.net/ep-deo/images/5/51/Intro_screen.mp4/revision/latest?cb=20260929101702')}`,
];

export const IntermissionIntroVideo: React.FC<IntermissionIntroVideoProps> = ({
  onFinish,
  onSkip
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // Fallback safety timeout: if video cannot load or play within 5 seconds, auto-proceed to Intermission
  useEffect(() => {
    const timer = setTimeout(() => {
      const v = videoRef.current;
      if (!v || (v.paused && v.currentTime === 0)) {
        console.warn('Intro video did not play in time, transitioning to Intermission Screen');
        onFinish();
      }
    }, 5500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // Attempt autoplay on mount (with sound, if blocked by browser retry muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try playing with sound
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn('Autoplay with audio blocked by browser policy, fallback to muted autoplay:', error);
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {
            setIsPlaying(false);
          });
        });
    }
  }, [sourceIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
      if (videoRef.current.currentTime > 0) {
        setIsLoading(false);
      }
    }
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasUserInteracted(true);
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasUserInteracted(true);
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSkip) onSkip();
    else onFinish();
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleError = () => {
    console.warn(`Video source ${sourceIndex} failed: ${VIDEO_SOURCES[sourceIndex]}`);
    if (sourceIndex < VIDEO_SOURCES.length - 1) {
      setSourceIndex((prev) => prev + 1);
    } else {
      // If all video sources failed, proceed directly to Intermission Screen so user is never blocked!
      onFinish();
    }
  };

  return (
    <motion.div
      id="intermission-intro-video-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[100002] bg-black flex items-center justify-center select-none overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={handleTogglePlay}
    >
      {/* Background cinematic vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none z-10" />

      {/* Main Video Element */}
      <video
        ref={videoRef}
        key={VIDEO_SOURCES[sourceIndex]}
        src={VIDEO_SOURCES[sourceIndex]}
        playsInline
        autoPlay
        muted={isMuted}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onCanPlay={() => {
          setIsLoading(false);
          videoRef.current?.play().catch(() => {});
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onFinish}
        onError={handleError}
        className="w-full h-full object-contain pointer-events-auto"
      />

      {/* Unmute prompt banner if browser muted autoplay */}
      {isMuted && !hasUserInteracted && (
        <div
          className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto cursor-pointer animate-bounce"
          onClick={handleToggleMute}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold shadow-xl border border-white/20 backdrop-blur-md transition-all">
            <VolumeX className="w-4 h-4 text-amber-300" />
            <span>Nhấn để bật âm thanh (Unmute)</span>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60 pointer-events-none">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
          <p className="text-white text-xs font-medium tracking-wide">Đang phát video giới thiệu...</p>
        </div>
      )}

      {/* Floating Skip / Continue to Intermission Button Top-Right */}
      <div
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 pointer-events-auto flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/25 text-xs font-semibold backdrop-blur-md transition-all shadow-xl active:scale-95 cursor-pointer"
          title="Bỏ qua video và vào ngay Intermission Screen"
        >
          <span>Vào Intermission Screen</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Floating Bottom Control Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto"
          >
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-white shadow-2xl">
              {/* Play / Pause button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {/* Progress bar */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume / Mute button */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Fullscreen button */}
              <button
                type="button"
                onClick={handleFullscreen}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Quick skip icon */}
              <button
                type="button"
                onClick={handleSkip}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                title="Bỏ qua"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default IntermissionIntroVideo;
