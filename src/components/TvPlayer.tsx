import React, { useState, useEffect, useRef } from 'react';
import { TvChannel, UserSettings } from '../types';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySlider } from './ui/VplaySlider';
import { Volume2, VolumeX, Maximize2, Heart, PlusCircle } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import Hls from 'hls.js';

interface TvPlayerProps {
  channel: TvChannel;
  onSelectChannel: (channel: TvChannel) => void;
  channels: TvChannel[];
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onCreateCustomChannel?: () => void;
}

export const TvPlayer: React.FC<TvPlayerProps> = ({
  channel,
  onSelectChannel,
  channels,
  settings,
  onUpdateSettings,
  onCreateCustomChannel,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(settings.soundVolume || 7);
  const [quality, setQuality] = useState(settings.qualityOption || '1080p');
  const [isFavorite, setIsFavorite] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Sync fullscreen state from document/video element
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isVideoFS = document.fullscreenElement === videoRef.current || !!(document as any).webkitFullscreenElement;
      setIsFullscreen(isVideoFS);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Initialize HLS stream when channel changes
  useEffect(() => {
    setStreamError(false);
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (channel.streamUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(channel.streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) {
            video.play().catch(() => {
              // Auto-play was prevented or CORS blocked
            });
          }
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setStreamError(true);
          }
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channel.streamUrl;
        if (isPlaying) video.play().catch(() => {});
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.id, channel.streamUrl]);

  // Update volume / muted on video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 10;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  const togglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (videoRef.current) {
      if (nextPlay) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Fullscreen specifically for video element (luồng m3u8 đang xem)
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* GRID CONTAINER: PLAYER ON LEFT, CONTROLS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* LEFT COLUMN: CHANNEL PLAYER (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* TV SCREEN / VIDEO PLAYER FRAME */}
          <div className="relative bg-[#0d0e0f] border-4 border-[#141414] shadow-2xl overflow-hidden w-full aspect-video max-h-[380px] sm:max-h-[420px]">
            {/* Background Stream Player */}
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
              {/* HTML5 Video element with HLS */}
              <video
                ref={videoRef}
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  !streamError ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              />

              {/* Fallback image when stream errors out or url is missing */}
              {(streamError || !channel.streamUrl) && (
                <img
                  src={channel.videoBg}
                  alt={channel.name}
                  className="w-full h-full object-cover opacity-100"
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROL PANEL (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-1.5 font-montserrat">
            
            {/* 1. VOLUME SLIDER */}
            <div className="w-full flex items-center gap-2 py-0.5">
              <button
                onClick={() => {
                  playPopSound();
                  setIsMuted(!isMuted);
                }}
                className="p-1 hover:bg-white/10 text-white active:translate-y-[1px] cursor-pointer flex-shrink-0 rounded-none"
                title="Tắt/Mở tiếng"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-[#89dc69]" />}
              </button>

              <div className="flex-1 min-w-0">
                <VplaySlider
                  label=""
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={10}
                  onChange={(v) => {
                    setVolume(v);
                    if (v > 0) setIsMuted(false);
                  }}
                  noBackground
                  className="!p-0"
                />
              </div>
            </div>

            {/* 2. PLAY / PAUSE */}
            <div className="w-full">
              <VplayHeroButton
                onClick={() => {
                  playPopSound();
                  togglePlay();
                }}
                className="w-full text-center justify-center py-2"
              >
                {isPlaying ? '⏸ TẠM DỪNG' : '▶ PHÁT'}
              </VplayHeroButton>
            </div>

            {/* 3. FULL SCREEN */}
            <div className="w-full">
              <VplaySecondaryButton
                onClick={() => {
                  playPopSound();
                  toggleFullscreen();
                }}
                fullWidth
                className="w-full justify-center"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c1d1f] flex-shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#1c1d1f]">
                  {isFullscreen ? 'THOÁT TOÀN MÀN HÌNH' : 'PHÓNG TO MÀN HÌNH'}
                </span>
              </VplaySecondaryButton>
            </div>

            {/* 4. YÊU THÍCH (SECONDARY BUTTON) */}
            <div className="w-full">
              <VplaySecondaryButton
                onClick={() => {
                  playPopSound();
                  setIsFavorite(!isFavorite);
                }}
                fullWidth
                className="w-full justify-center"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isFavorite ? 'text-red-600 fill-red-600' : 'text-[#1c1d1f]'}`} />
                <span className="font-bold text-xs uppercase tracking-wider text-[#1c1d1f]">
                  {isFavorite ? 'ĐÃ YÊU THÍCH' : 'YÊU THÍCH'}
                </span>
              </VplaySecondaryButton>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
