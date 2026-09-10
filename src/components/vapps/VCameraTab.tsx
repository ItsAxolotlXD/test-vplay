import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RotateCcw,
  Sparkles,
  Download,
  Check,
  Clock,
  Sliders,
  Image as ImageIcon,
  Zap,
  ZapOff,
  Video,
  Monitor,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  FolderDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Web Audio sound generator for camera shutter & timer beeps
class CameraAudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playShutterClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Mechanical shutter double click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Second latch click
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          const t2 = ctx.currentTime;
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(300, t2);
          osc2.frequency.exponentialRampToValueAtTime(80, t2 + 0.06);
          gain2.gain.setValueAtTime(0.15, t2);
          gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.07);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(t2);
          osc2.stop(t2 + 0.07);
        } catch {}
      }, 95);
    } catch {}
  }

  playBeep(freq = 880) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }
}

const camAudio = new CameraAudioEngine();

export type FilterType = 'normal' | 'vintage' | 'cyberpunk' | 'noir' | 'vivid' | 'crt_tv';

export const VCameraTab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // Filter and settings
  const [activeFilter, setActiveFilter] = useState<FilterType>('normal');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [timerDuration, setTimerDuration] = useState<number>(0); // 0 = off, 3, 5, 10
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(true);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Captured photo
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isSavedToGallery, setIsSavedToGallery] = useState<boolean>(false);

  // Start webcam
  const startWebcam = async () => {
    try {
      setPermissionDenied(false);
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(media);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setPermissionDenied(true);
      setIsCameraActive(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  // Filter CSS styles mapping
  const getFilterStyle = (f: FilterType): React.CSSProperties => {
    switch (f) {
      case 'vintage':
        return { filter: 'sepia(0.55) contrast(1.15) brightness(0.95) saturate(1.2)' };
      case 'cyberpunk':
        return { filter: 'hue-rotate(185deg) contrast(1.3) saturate(1.6)' };
      case 'noir':
        return { filter: 'grayscale(1) contrast(1.4) brightness(0.95)' };
      case 'vivid':
        return { filter: 'saturate(1.8) contrast(1.1) brightness(1.05)' };
      case 'crt_tv':
        return { filter: 'contrast(1.25) brightness(1.05)' };
      default:
        return {};
    }
  };

  // Capture execution
  const executeCapture = () => {
    // Flash animation
    if (flashEnabled) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);
    }

    camAudio.playShutterClick();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth = 1280;
    let targetHeight = 720;
    if (aspectRatio === '4:3') {
      targetWidth = 960;
      targetHeight = 720;
    } else if (aspectRatio === '1:1') {
      targetWidth = 720;
      targetHeight = 720;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Apply filter to 2D context
    if (activeFilter === 'vintage') {
      ctx.filter = 'sepia(0.55) contrast(1.15) brightness(0.95) saturate(1.2)';
    } else if (activeFilter === 'cyberpunk') {
      ctx.filter = 'hue-rotate(185deg) contrast(1.3) saturate(1.6)';
    } else if (activeFilter === 'noir') {
      ctx.filter = 'grayscale(1) contrast(1.4) brightness(0.95)';
    } else if (activeFilter === 'vivid') {
      ctx.filter = 'saturate(1.8) contrast(1.1) brightness(1.05)';
    } else {
      ctx.filter = 'none';
    }

    if (video && isCameraActive && video.videoWidth > 0) {
      // Draw frame from live video
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    } else {
      // Draw high-quality studio backdrop simulated photo
      ctx.fillStyle = '#1A0B2E';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Gradient circles
      const grad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      grad.addColorStop(0, '#FF007A');
      grad.addColorStop(0.5, '#7B2CBF');
      grad.addColorStop(1, '#00F0FF');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(targetWidth / 2, targetHeight / 2, targetHeight / 3, 0, Math.PI * 2);
      ctx.fill();

      // Text label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('V-PLAY STUDIO 360', targetWidth / 2, targetHeight / 2);
      ctx.font = '20px sans-serif';
      ctx.fillText(new Date().toLocaleString('vi-VN'), targetWidth / 2, targetHeight / 2 + 40);
    }

    // CRT TV Scanlines overlay
    if (activeFilter === 'crt_tv') {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < targetHeight; y += 4) {
        ctx.fillRect(0, y, targetWidth, 2);
      }
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setLastPhoto(dataUrl);
    setCapturedPhotos((prev) => [dataUrl, ...prev]);
    setIsSavedToGallery(false);

    // Save automatically to localStorage for V-Gallery
    try {
      const savedExisting = localStorage.getItem('v_camera_captured_photos');
      const list = savedExisting ? JSON.parse(savedExisting) : [];
      const newGalleryPhoto = {
        id: `cam-${Date.now()}`,
        url: dataUrl,
        title: `Ảnh Chụp V-Camera #${list.length + 1}`,
        album: 'Camera',
        date: new Date().toLocaleDateString('vi-VN'),
        resolution: `${targetWidth} x ${targetHeight}`,
        description: `Chụp với bộ lọc ${activeFilter.toUpperCase()} lúc ${new Date().toLocaleTimeString('vi-VN')}`,
      };
      localStorage.setItem('v_camera_captured_photos', JSON.stringify([newGalleryPhoto, ...list].slice(0, 20)));
      setIsSavedToGallery(true);
    } catch {}
  };

  // Trigger capture with timer
  const handleSnapClick = () => {
    if (timerDuration === 0) {
      executeCapture();
    } else {
      let count = timerDuration;
      setCountdown(count);
      camAudio.playBeep(660);

      const interval = window.setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          camAudio.playBeep(660);
        } else {
          clearInterval(interval);
          setCountdown(null);
          executeCapture();
        }
      }, 1000);
    }
  };

  return (
    <div id="v-camera-app" className="w-full text-white selection:bg-rose-500/30">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#200A18] via-[#2F1024] to-[#160710] border border-rose-500/25 rounded-3xl p-5 sm:p-6 mb-6 shadow-[0_10px_35px_rgba(244,63,94,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#170814] rounded-[14px] flex items-center justify-center">
              <Camera className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Máy Ảnh V-Camera 360</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                Live Shutter
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Chụp ảnh camera trực tiếp • Bộ lọc nghệ thuật Vintage, Cyberpunk, TV Scanlines • Tự động đồng bộ V-Gallery
            </p>
          </div>
        </div>

        {/* Quick Viewfinder Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFlashEnabled((f) => !f)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              flashEnabled
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title="Đèn flash chớp sáng"
          >
            {flashEnabled ? <Zap className="w-4 h-4 fill-amber-300" /> : <ZapOff className="w-4 h-4" />}
            <span className="text-[11px]">{flashEnabled ? 'Flash Bật' : 'Flash Tắt'}</span>
          </button>

          <button
            onClick={() => setTimerDuration((t) => (t === 0 ? 3 : t === 3 ? 5 : t === 5 ? 10 : 0))}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              timerDuration > 0
                ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title="Hẹn giờ đếm ngược"
          >
            <Clock className="w-4 h-4" />
            <span className="text-[11px]">{timerDuration === 0 ? 'Hẹn giờ: Tắt' : `${timerDuration}s`}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Viewfinder Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full bg-[#120717] border border-rose-500/30 rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
            {/* Flash Overlay Effect */}
            <div
              className={`absolute inset-0 bg-white z-40 transition-opacity duration-200 pointer-events-none ${
                isFlashing ? 'opacity-90' : 'opacity-0'
              }`}
            />

            {/* Countdown Overlay */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute z-30 flex items-center justify-center w-28 h-28 rounded-full bg-rose-600/90 text-white font-black text-6xl shadow-2xl backdrop-blur-md"
                >
                  {countdown}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video or Studio Simulator Frame */}
            <div
              className={`w-full overflow-hidden rounded-2xl relative flex items-center justify-center bg-black transition-all ${
                aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-square max-w-md'
              }`}
            >
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={getFilterStyle(activeFilter)}
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
              />

              {/* CRT TV Filter Scanline Overlay */}
              {activeFilter === 'crt_tv' && (
                <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_2px,transparent_2px,transparent_4px)] z-20" />
              )}

              {/* Virtual Studio Mockup if camera is not granted or disabled */}
              {!isCameraActive && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-[#1B0A26] via-[#2A0E3A] to-[#12061C] relative">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                    <Monitor className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">Chế Độ Giả Lập Camera Studio 360</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {permissionDenied
                      ? 'Trình duyệt chưa được cấp quyền webcam hoặc đang ở chế độ bảo mật. Bạn vẫn có thể chụp ảnh giả lập và dùng mọi bộ lọc màu.'
                      : 'Đang kết nối ống kính camera...'}
                  </p>

                  <button
                    onClick={startWebcam}
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Kết Nối Lại Camera</span>
                  </button>
                </div>
              )}

              {/* Viewfinder HUD Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white/70 drop-shadow">
                  <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>VPLAY 4K 60FPS</span>
                  </div>
                  <div className="bg-black/40 px-2.5 py-1 rounded-lg">
                    <span>{aspectRatio} • {activeFilter.toUpperCase()}</span>
                  </div>
                </div>

                {/* Viewfinder crosshairs */}
                <div className="self-center w-12 h-12 border border-white/30 rounded-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                </div>

                <div className="text-[10px] font-mono text-white/60 text-center drop-shadow">
                  AUTO FOCUS [●] • ISO 200 • 1/250s
                </div>
              </div>
            </div>

            {/* Bottom Shutter Controls */}
            <div className="w-full mt-5 flex items-center justify-between px-4">
              {/* Aspect ratio buttons */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              {/* Shutter Button */}
              <button
                onClick={handleSnapClick}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 p-1.5 shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                title="Bấm chụp ảnh"
              >
                <div className="w-full h-full rounded-full border-2 border-white/60 flex items-center justify-center bg-rose-600">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              </button>

              {/* Last photo thumbnail */}
              {lastPhoto ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-rose-400/50 shadow-md">
                  <img src={lastPhoto} alt="Last Snap" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Filter & Preview Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-time Color Filter Presets */}
          <div className="bg-[#14081A] border border-white/10 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Bộ Lọc Màu Nghệ Thuật</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'normal', name: 'Tiêu Chuẩn', desc: 'Màu tự nhiên sắc nét' },
                { id: 'vintage', name: 'Vintage 90s', desc: 'Tone hoài niệm cổ điển' },
                { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon tím & xanh tương lai' },
                { id: 'noir', name: 'Đen Trắng B&W', desc: 'Đơn sắc điện ảnh' },
                { id: 'vivid', name: 'Tươi Sáng', desc: 'Tăng cường độ bão hòa' },
                { id: 'crt_tv', name: 'TV Scanlines', desc: 'Hiệu ứng truyền hình xưa' },
              ].map((filt) => (
                <button
                  key={filt.id}
                  onClick={() => setActiveFilter(filt.id as FilterType)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeFilter === filt.id
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-md'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{filt.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{filt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Last Photo Action Card */}
          {lastPhoto && (
            <div className="bg-[#14081A] border border-rose-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Ảnh Vừa Chụp Xong</span>
                </h4>
                {isSavedToGallery && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Đã lưu vào V-Gallery
                  </span>
                )}
              </div>

              <img
                src={lastPhoto}
                alt="Captured"
                className="w-full h-44 object-cover rounded-2xl mb-4 border border-white/10 shadow-md"
              />

              <div className="flex items-center gap-2">
                <a
                  href={lastPhoto}
                  download={`V-Camera-${Date.now()}.jpg`}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về Máy</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
