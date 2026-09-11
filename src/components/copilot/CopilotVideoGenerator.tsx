import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  Film,
  Camera,
  Clapperboard,
  Sliders,
  ChevronRight,
  ListVideo
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface VideoScene {
  sceneNumber: number;
  title: string;
  duration: number;
  cameraMovement: string;
  subtitles: string;
  visualEffect: string;
  audioMood: string;
  prompt: string;
  imageUrl: string;
}

export interface VideoProject {
  id: string;
  title: string;
  logline: string;
  aspectRatio: string;
  duration: number;
  scenes: VideoScene[];
  soundtrack?: {
    bpm: number;
    key: string;
    chords: string[];
  };
  prompt: string;
  style: string;
  createdAt: number;
}

interface CopilotVideoGeneratorProps {
  onBackToChat?: () => void;
}

const STORAGE_VIDEOS_KEY = "vplay_copilot_generated_videos";

export const CopilotVideoGenerator: React.FC<CopilotVideoGeneratorProps> = ({ onBackToChat }) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Project & Playback
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // History state
  const [savedVideos, setSavedVideos] = useState<VideoProject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_VIDEOS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Preload scene images
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const styleList = [
    { id: "cinematic", label: "Điện Ảnh Hollywood", desc: "Màu sắc cinematic 2.39:1, flare ánh sáng" },
    { id: "motion_graphics", label: "Motion Graphics VTV", desc: "Đồ họa chuyển động TV 3D hiện đại" },
    { id: "anime", label: "Anime Makoto Shinkai", desc: "Hoạt hình cảm xúc, hiệu ứng ánh sáng mộng mơ" },
    { id: "3d_cgi", label: "3D Pixar Animation", desc: "Hoạt họa 3D sống động, biểu cảm phong phú" },
    { id: "documentary", label: "Phóng Sự Tài Liệu", desc: "Góc quay chân thực, slow-motion sắc nét" }
  ];

  const presets = [
    "Trailer giới thiệu kênh Vplay 2026 với đồ họa không gian ba chiều rực rỡ",
    "Phim ngắn cảnh Hà Nội về đêm dưới mưa với ánh đèn lồng phố cổ lung linh",
    "Hành trình tàu thám hiểm không gian Việt Nam tiến vào quỹ đạo sao Hỏa",
    "Intro chương trình Tin tức VTV bản tin đặc biệt phong cách tương lai"
  ];

  // Preload images whenever project changes
  useEffect(() => {
    if (!currentProject?.scenes) return;
    currentProject.scenes.forEach((scene) => {
      if (scene.imageUrl && !loadedImagesRef.current.has(scene.imageUrl)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = scene.imageUrl;
        img.onload = () => {
          loadedImagesRef.current.set(scene.imageUrl, img);
        };
      }
    });
  }, [currentProject]);

  // Audio Context synthesizer for soundtrack
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playBackgroundTone = (freq: number, duration: number) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || !currentProject) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const totalSec = currentProject.duration || 10;
    const intervalMs = 100;

    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= totalSec) {
          setIsPlaying(false);
          return 0;
        }

        // Determine current scene
        let accumulated = 0;
        for (let i = 0; i < currentProject.scenes.length; i++) {
          accumulated += currentProject.scenes[i].duration;
          if (next <= accumulated) {
            setCurrentSceneIndex(i);
            break;
          }
        }

        // Ambient background tone on beat
        if (Math.floor(next * 10) % 20 === 0) {
          const tones = [220, 261.63, 329.63, 392.0];
          const t = tones[Math.floor(next / 2) % tones.length];
          playBackgroundTone(t, 1.8);
        }

        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentProject, isMuted]);

  // 60FPS Canvas Video Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentProject) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    const render = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Current scene
      const scene = currentProject.scenes[currentSceneIndex] || currentProject.scenes[0];
      const sceneImg = scene ? loadedImagesRef.current.get(scene.imageUrl) : null;

      // Calculate camera transform based on movement
      const sceneProgress = (currentTime % (scene?.duration || 3)) / (scene?.duration || 3);

      ctx.save();

      let scale = 1.0;
      let transX = 0;
      let transY = 0;

      if (scene?.cameraMovement === "zoom_in") {
        scale = 1.0 + sceneProgress * 0.15;
      } else if (scene?.cameraMovement === "zoom_out") {
        scale = 1.15 - sceneProgress * 0.15;
      } else if (scene?.cameraMovement === "pan_right") {
        scale = 1.08;
        transX = -sceneProgress * (width * 0.08);
      } else if (scene?.cameraMovement === "pan_left") {
        scale = 1.08;
        transX = (1 - sceneProgress) * (width * 0.08);
      } else {
        scale = 1.05 + Math.sin(time * 0.002) * 0.03;
      }

      ctx.translate(width / 2 + transX, height / 2 + transY);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);

      if (sceneImg) {
        ctx.drawImage(sceneImg, 0, 0, width, height);
      } else {
        // Fallback procedural background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#0F172A");
        grad.addColorStop(0.5, "#1E1B4B");
        grad.addColorStop(1, "#311042");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Animated particles
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let i = 0; i < 20; i++) {
          const px = (i * 73 + time * 0.05) % width;
          const py = (i * 37 + time * 0.03) % height;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Film Grain / Visual Effect overlay
      if (scene?.visualEffect === "lens_flare") {
        const flareX = width * 0.3 + Math.sin(time * 0.001) * 60;
        const flareY = height * 0.3;
        const flareGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, width * 0.4);
        flareGrad.addColorStop(0, "rgba(255, 220, 150, 0.25)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (scene?.visualEffect === "cyberpunk_glitch") {
        if (Math.random() > 0.92) {
          ctx.fillStyle = "rgba(0, 220, 255, 0.15)";
          ctx.fillRect(0, Math.random() * height, width, 8);
        }
      }

      // Cinematic Letterbox Bars (Top & Bottom Cinema Black Bars)
      const letterboxHeight = height * 0.08;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, letterboxHeight);
      ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);

      // Overlay Subtitles
      if (scene?.subtitles) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.font = "bold 16px sans-serif";
        const textWidth = ctx.measureText(scene.subtitles).width;
        ctx.roundRect(width / 2 - textWidth / 2 - 16, height - letterboxHeight - 40, textWidth + 32, 32, [8]);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(scene.subtitles, width / 2, height - letterboxHeight - 18);
      }

      // Watermark Badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`VPLAY COPILOT VIDEO ENGINE • 60 FPS • SCENE ${currentSceneIndex + 1}/${currentProject.scenes.length}`, 16, letterboxHeight - 8);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentProject, currentSceneIndex, currentTime]);

  // Generate Video
  const handleGenerate = async () => {
    const textToGen = prompt.trim() || presets[0];
    setIsGenerating(true);
    try {
      const response = await fetch("/api/copilot/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToGen,
          style,
          duration,
          aspectRatio
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        const newProj: VideoProject = json.data;
        setCurrentProject(newProj);
        setCurrentTime(0);
        setCurrentSceneIndex(0);
        setIsPlaying(true);

        const updated = [newProj, ...savedVideos.filter((v) => v.id !== newProj.id)].slice(0, 12);
        setSavedVideos(updated);
        localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Failed to generate video:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export video as downloadable WebM recording from Canvas
  const handleExportVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentProject) return;

    try {
      setIsRecording(true);
      recordedChunksRef.current = [];

      const stream = canvas.captureStream(30); // 30 FPS stream
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vplay_video_${currentProject.title.replace(/\s+/g, "_")}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start();
      setCurrentTime(0);
      setIsPlaying(true);

      // Record for project duration
      setTimeout(() => {
        recorder.stop();
      }, (currentProject.duration || 10) * 1000);
    } catch (err) {
      console.error("Recording error:", err);
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto space-y-6 p-2 sm:p-4 text-slate-900 dark:text-white">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-sky-300" />
                Vplay Copilot Cinema Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/30 text-[11px] font-semibold">
                Multi-Scene Storyboard & Motion
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-montserrat">
              AI Video Generator
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Sản xuất video clip ngắn, intro chương trình TV hoặc trailer điện ảnh với đạo diễn kịch bản AI, hiệu ứng camera zoom/pan mượt mà và nhạc nền đồng bộ.
            </p>
          </div>

          {onBackToChat && (
            <button
              onClick={onBackToChat}
              className="px-4 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-semibold backdrop-blur-md transition-all self-start md:self-auto cursor-pointer"
            >
              ← Quay lại Trò chuyện
            </button>
          )}
        </div>
      </div>

      {/* Preset Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Ý tưởng video mẫu:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shrink-0 transition-all cursor-pointer truncate max-w-xs hover:border-blue-500/40 active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Ý tưởng kịch bản hoặc phân cảnh video:
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="VD: Đoạn phim giới thiệu thành phố tương lai 2026 với tàu đệm từ và màn hình neon khổng lồ..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        {/* Style & Duration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Phong cách đạo diễn:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {styleList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Thời lượng: <span className="text-blue-500 font-bold">{duration} Giây</span>
            </label>
            <div className="flex items-center gap-2">
              {[6, 10, 15].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    duration === d
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Tỉ lệ khung hình:</label>
            <div className="flex items-center gap-2">
              {["16:9", "9:16"].map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === ar
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {ar === "16:9" ? "16:9 Ngang" : "9:16 Dọc"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            * Tự động dàn dựng 3-4 phân cảnh với chuyển động camera và âm hưởng đồng bộ
          </span>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Clapperboard className="w-4 h-4 animate-spin" />
                <span>Đang chỉ đạo kịch bản & dựng phim...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tạo video AI ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Video Player & Canvas */}
      {currentProject && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/15 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase">
                  {currentProject.style}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• {currentProject.duration}s</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• {currentProject.scenes?.length} phân cảnh</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {currentProject.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{currentProject.logline}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-blue-500 transition-colors cursor-pointer"
                title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleExportVideo}
                disabled={isRecording}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isRecording ? "Đang xuất WebM..." : "Xuất Video Clip"}</span>
              </button>
            </div>
          </div>

          {/* Video Canvas Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video max-h-[520px] flex items-center justify-center">
            <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full object-contain" />

            {/* Over-canvas Play overlay toggle */}
            {!isPlaying && (
              <div
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/50 hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Timeline Scrubber & Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{currentTime.toFixed(1)}s</span>
              <span className="font-semibold text-blue-500">
                Phân cảnh {currentSceneIndex + 1}: {currentProject.scenes[currentSceneIndex]?.title}
              </span>
              <span>{currentProject.duration}s</span>
            </div>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(pos * currentProject.duration);
              }}
              className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / currentProject.duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCurrentTime(0)}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Phát lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Storyboard Scenes Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-blue-500" />
              Bảng phân cảnh Storyboard ({currentProject.scenes?.length}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentProject.scenes?.map((sc, idx) => {
                const isActive = idx === currentSceneIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      // Seek to this scene's start time
                      let start = 0;
                      for (let i = 0; i < idx; i++) {
                        start += currentProject.scenes[i].duration;
                      }
                      setCurrentTime(start);
                      setCurrentSceneIndex(idx);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600/10 border-blue-600 shadow-md scale-[1.01]"
                        : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-blue-500/30"
                    }`}
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-2 bg-black/40">
                      <img
                        src={sc.imageUrl}
                        alt={sc.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-blue-500">Cảnh {sc.sceneNumber} ({sc.duration}s)</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{sc.cameraMovement}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{sc.title}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">"{sc.subtitles}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Video History Gallery */}
      {savedVideos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ListVideo className="w-3.5 h-3.5 text-blue-500" />
              Video đã tạo gần đây ({savedVideos.length}):
            </h4>
            <button
              onClick={() => {
                setSavedVideos([]);
                localStorage.removeItem(STORAGE_VIDEOS_KEY);
              }}
              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Xóa lịch sử
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  setCurrentProject(vid);
                  setCurrentTime(0);
                  setCurrentSceneIndex(0);
                  setIsPlaying(true);
                }}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/10 text-blue-600">
                    {vid.style}
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                    {vid.title}
                  </h5>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(vid.createdAt).toLocaleDateString("vi-VN")} • {vid.duration}s
                  </span>
                </div>

                <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 transition-all">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
