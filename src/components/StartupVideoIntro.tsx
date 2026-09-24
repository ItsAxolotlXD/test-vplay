import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, FastForward, Play, Loader2, Sparkles } from 'lucide-react';
import { AdVideoItem, getRandomAdVideo } from '../data/adsData';

interface StartupVideoIntroProps {
  adVideo?: AdVideoItem;
  onFinish: () => void;
}

export const StartupVideoIntro: React.FC<StartupVideoIntroProps> = ({
  adVideo,
  onFinish,
}) => {
  // Randomly select 1 ad video each time the component is mounted
  const [currentAd] = useState<AdVideoItem>(() => adVideo || getRandomAdVideo());

  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleComplete = () => {
    if (isFinished) return;
    setIsFinished(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onFinish();
  };

  // Keyboard shortcut listener (Esc / Space / Enter to skip or start)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (showPlayOverlay) {
          handleManualStart();
        } else {
          handleComplete();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayOverlay]);

  // Attempt autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    const attemptPlay = async () => {
      try {
        // Try unmuted first
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
        setIsBuffering(false);
      } catch (audioErr) {
        // Autoplay with audio blocked by browser policy, fallback to muted play
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
          setIsBuffering(false);
        } catch (strictErr) {
          // Both blocked: show play button overlay
          console.warn('Autoplay blocked completely, showing manual play prompt:', strictErr);
          setIsBuffering(false);
          setShowPlayOverlay(true);
        }
      }
    };

    attemptPlay();

    // Safety timeout: proceed to splash screen after 30s max if stuck
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 30000);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [currentAd]);

  const handleManualStart = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = false;
      setIsMuted(false);
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
    } catch {
      try {
        video.muted = true;
        setIsMuted(true);
        await video.play();
        setIsPlaying(true);
        setShowPlayOverlay(false);
      } catch (err) {
        console.error('Manual start failed:', err);
        handleComplete();
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          id="startup-video-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: 'blur(10px)',
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black select-none overflow-hidden"
        >
          {/* Main Video Player */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            preload="auto"
            muted={isMuted}
            className="w-full h-full object-contain max-h-screen"
            onTimeUpdate={() => {
              if (videoRef.current) {
                const cur = videoRef.current.currentTime;
                const dur = videoRef.current.duration || 0;
                setCurrentTime(cur);
                setDuration(dur);
                if (dur > 0) {
                  setProgress((cur / dur) * 100);
                }
              }
            }}
            onPlaying={() => {
              setIsPlaying(true);
              setIsBuffering(false);
              setShowPlayOverlay(false);
            }}
            onWaiting={() => setIsBuffering(true)}
            onEnded={() => {
              // Video ad finished naturally -> proceed to splash screen
              handleComplete();
            }}
            onError={(e) => {
              console.warn('Video source error encountered:', e);
              const v = videoRef.current;
              if (v && v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
                handleComplete();
              }
            }}
          >
            {/* 1. Fast local streaming from Express */}
            <source src={currentAd.localUrl} type="video/mp4" />
            {/* 2. Express API streaming chunk route */}
            <source src={`/api${currentAd.localUrl}`} type="video/mp4" />
            {/* 3. Server Video Proxy with Hotlink Referer Bypass */}
            <source
              src={`/api/video-proxy?url=${encodeURIComponent(currentAd.remoteUrl)}`}
              type="video/mp4"
            />
            {/* 4. Direct Remote CDN link */}
            <source src={currentAd.remoteUrl} type="video/mp4" />
          </video>

          {/* Buffering Indicator */}
          {isBuffering && !showPlayOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Đang tải VNRT Ads...</span>
              </div>
            </div>
          )}

          {/* Fallback Play Button Overlay if browser blocked autoplay */}
          {showPlayOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 gap-4 p-4 text-center"
            >
              <button
                type="button"
                onClick={handleManualStart}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#E6005A] via-[#FF2020] to-[#FF8C00] flex items-center justify-center text-white shadow-2xl shadow-red-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                title="Bắt đầu phát VNRT Ads"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white text-white drop-shadow" />
              </button>
              <div className="space-y-1">
                <p className="text-white text-base sm:text-lg font-bold tracking-tight">
                  Nhấn để phát VNRT Ads
                </p>
                <p className="text-white/60 text-xs">
                  (Hoặc nhấn Bỏ qua để vào thẳng ứng dụng)
                </p>
              </div>
            </motion.div>
          )}

          {/* Top Controls: Sound Toggle & Skip Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2.5 pointer-events-auto">
            {/* Unmute / Mute Button */}
            {isMuted ? (
              <button
                type="button"
                onClick={handleToggleMute}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 active:scale-95 text-white/95 backdrop-blur-md border border-amber-400/40 text-xs font-semibold shadow-lg transition-all cursor-pointer animate-pulse"
                title="Bật âm thanh quảng cáo"
              >
                <VolumeX className="w-4 h-4 text-amber-400" />
                <span>Bật âm thanh</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 active:scale-95 text-white/80 hover:text-white backdrop-blur-md border border-white/15 text-xs font-medium transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                title="Tắt âm thanh"
              >
                <Volume2 className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-xs">Tắt âm</span>
              </button>
            )}

            {/* Skip Button */}
            <button
              type="button"
              id="btn-skip-intro-video"
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md border border-white/25 text-xs font-bold tracking-wide transition-all shadow-2xl cursor-pointer"
              title="Bỏ qua và vào Splash Screen"
            >
              <span>Bỏ qua</span>
              <FastForward className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>

          {/* Bottom Bar: Progress Indicator, Time & VNRT Ads branding */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-30 pointer-events-none flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-white/70 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF2020]/25 text-[#FF6B6B] border border-[#FF2020]/30 font-bold uppercase text-[10px] tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  VNRT Ads
                </span>
                <span className="text-[11px] text-white/50 truncate max-w-[200px] sm:max-w-md hidden xs:inline">
                  {currentAd.name}
                </span>
              </div>
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Progress line */}
            <div className="w-full h-1 sm:h-1.5 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#E6005A] via-[#FF2020] to-[#FF8C00] rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(255,32,32,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupVideoIntro;
