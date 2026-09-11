import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  Radio,
  FileText,
  Clock,
  Trash2,
  Disc3,
  Flame,
  ListMusic
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface GeneratedSong {
  id: string;
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  key: string;
  summary: string;
  chordProgression: string[];
  melodyNotes: number[];
  bassNotes: number[];
  lyrics: { time: number; text: string }[];
  prompt: string;
  createdAt: number;
}

interface CopilotMusicGeneratorProps {
  onBackToChat?: () => void;
}

const STORAGE_SONGS_KEY = "vplay_copilot_generated_songs";

export const CopilotMusicGenerator: React.FC<CopilotMusicGeneratorProps> = ({ onBackToChat }) => {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("lofi");
  const [mood, setMood] = useState("relaxed");
  const [tempo, setTempo] = useState(85);
  const [instrumental, setInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Playback state
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  // History state
  const [savedSongs, setSavedSongs] = useState<GeneratedSong[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SONGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Audio Context & Nodes Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Presets
  const presets = [
    { label: "☕ Lofi Hà Nội Mưa", genre: "lofi", mood: "relaxed", bpm: 82, prompt: "Giai điệu Lofi ấm áp trong buổi chiều mưa Hà Nội bên tách cà phê trứng" },
    { label: "⚡ Cyberpunk 2026", genre: "edm", mood: "energetic", bpm: 128, prompt: "Nhạc điện tử Cyberpunk Synthwave bùng nổ năng lượng tương lai Vplay" },
    { label: "🎸 Acoustic Tình Ca", genre: "pop", mood: "romantic", bpm: 95, prompt: "Khúc tình ca acoustic lãng mạn mộc mạc với tiếng đàn guitar nhẹ nhàng" },
    { label: "🏖️ Chillhop Hoàng Hôn", genre: "chillhop", mood: "chill", bpm: 90, prompt: "Chillhop thư giãn ngắm hoàng hôn buông trên bãi biển êm đềm" },
    { label: "🎋 Dân Gian Đương Đại", genre: "traditional", mood: "epic", bpm: 86, prompt: "Hòa tấu sáo trúc và đàn tranh ngũ cung phong cách EDM hiện đại" }
  ];

  // Initialize Web Audio Context on first interaction
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

  // Convert MIDI note number to frequency
  const midiToFreq = (midi: number) => {
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  // Play a note with Web Audio API synthesizer
  const playSynthesizedNote = (freq: number, type: OscillatorType, duration: number, gainValue = 0.15, timeOffset = 0) => {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);

    // Warm envelope
    const now = ctx.currentTime + timeOffset;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  };

  // Play a drum kick/snare/hihat using synthetic noise / pitch drops
  const playDrumBeat = (type: "kick" | "snare" | "hihat", timeOffset = 0) => {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime + timeOffset;

    if (type === "kick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "snare") {
      const noise = ctx.createOscillator();
      const gain = ctx.createGain();
      noise.type = "triangle";
      noise.frequency.setValueAtTime(180, now);
      noise.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.16);
    } else if (type === "hihat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(8000, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  };

  // Main playback loop
  useEffect(() => {
    if (!isPlaying || !currentSong) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepIntervalMs = 500; // 0.5s per step
    const bpm = currentSong.bpm || 85;
    const beatSec = 60 / bpm;

    timerRef.current = window.setInterval(() => {
      setPlaybackTime((prev) => {
        const next = prev + 0.5;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }

        // Trigger musical notes corresponding to current step
        const melody = currentSong.melodyNotes || [69, 72, 76, 79];
        const bass = currentSong.bassNotes || [45, 41, 48, 43];

        const step = Math.floor(next * 2); // 2 steps per second
        const melodyIdx = step % melody.length;
        const bassIdx = Math.floor(step / 2) % bass.length;

        const melodyNote = melody[melodyIdx];
        const bassNote = bass[bassIdx];

        // Synthesize chord & lead melody
        playSynthesizedNote(midiToFreq(melodyNote), "sine", beatSec * 0.8, 0.12);
        playSynthesizedNote(midiToFreq(melodyNote + 12), "triangle", beatSec * 0.4, 0.06);

        // Bass on strong beats
        if (step % 2 === 0) {
          playSynthesizedNote(midiToFreq(bassNote), "triangle", beatSec * 1.5, 0.22);
          playDrumBeat("kick");
        } else {
          playDrumBeat("hihat");
        }

        // Snare on 2nd and 4th beats
        if (step % 4 === 2) {
          playDrumBeat("snare");
        }

        return next;
      });
    }, stepIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSong, totalDuration, isMuted]);

  // Visualizer Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const numBars = 36;
      const barWidth = width / numBars - 2;

      phase += isPlaying ? 0.08 : 0.02;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 8;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.25);
          const wave2 = Math.cos(phase * 1.3 - i * 0.15);
          const amp = Math.abs(wave1 * wave2);
          barHeight = 12 + amp * (height * 0.75);
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient from rose to indigo/cyan
        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, "#E6005A");
        grad.addColorStop(0.5, "#9333EA");
        grad.addColorStop(1, "#3B82F6");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Handle generating new song
  const handleGenerate = async () => {
    if (!prompt.trim() && !genre) {
      setPrompt("Nhạc Lofi thư giãn buổi đêm");
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/copilot/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim() || "Nhạc thư giãn nhẹ nhàng",
          genre,
          mood,
          tempo,
          instrumental
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        const newSong: GeneratedSong = json.data;
        setCurrentSong(newSong);
        setPlaybackTime(0);
        setIsPlaying(true);

        // Save to local storage
        const updated = [newSong, ...savedSongs.filter((s) => s.id !== newSong.id)].slice(0, 15);
        setSavedSongs(updated);
        localStorage.setItem(STORAGE_SONGS_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Failed to generate music:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLyrics = () => {
    if (!currentSong) return;
    const text = `Bài hát: ${currentSong.title}\nThể loại: ${currentSong.genre} | ${currentSong.bpm} BPM | Khóa: ${currentSong.key}\nHợp âm: ${currentSong.chordProgression?.join(" - ")}\n\nLời bài hát:\n${currentSong.lyrics?.map((l) => l.text).join("\n")}`;
    navigator.clipboard?.writeText(text);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Find active lyric line based on current playbackTime
  const activeLyricIndex = currentSong?.lyrics
    ? currentSong.lyrics.reduce((activeIdx, line, idx) => {
        return playbackTime >= line.time ? idx : activeIdx;
      }, 0)
    : -1;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto space-y-6 p-2 sm:p-4 text-slate-900 dark:text-white">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#E6005A] via-purple-600 to-indigo-600 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-pink-300" />
                Vplay Copilot Audio Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 text-[11px] font-semibold">
                Web Audio Synthesizer
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-montserrat">
              AI Music Generator
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Tạo bài hát, nhạc nền Lofi, EDM Cyberpunk, Acoustic và ca từ với âm thanh nhạc cụ tổng hợp thời gian thực ngay trong trình duyệt.
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

      {/* Preset Quick Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E6005A]" />
          Gợi ý phong cách nhanh:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.prompt);
                setGenre(p.genre);
                setMood(p.mood);
                setTempo(p.bpm);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shrink-0 transition-all cursor-pointer hover:border-[#E6005A]/40 active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Control Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Ý tưởng bài hát hoặc mô tả âm nhạc:
          </label>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Bản nhạc Lofi chill mưa đêm trên phố cổ Hà Nội, tiếng electric piano dịu dàng..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E6005A]"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Thể loại:</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="lofi">Lofi Hip-Hop & Chill</option>
              <option value="edm">Cyberpunk / Synthwave</option>
              <option value="pop">Pop Ballad Việt Nam</option>
              <option value="chillhop">Chillhop Mùa Hè</option>
              <option value="traditional">Dân Gian Đương Đại</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Tâm trạng:</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="relaxed">Thư giãn, nhẹ nhàng</option>
              <option value="energetic">Sôi động, hào hứng</option>
              <option value="romantic">Lãng mạn, ngọt ngào</option>
              <option value="melancholic">Hoài niệm, trầm lắng</option>
              <option value="epic">Hào hùng, mạnh mẽ</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Nhịp độ: <span className="text-[#E6005A] font-bold">{tempo} BPM</span>
            </label>
            <input
              type="range"
              min={60}
              max={150}
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-full accent-[#E6005A] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="inst-check"
              checked={instrumental}
              onChange={(e) => setInstrumental(e.target.checked)}
              className="accent-[#E6005A] w-4 h-4 rounded"
            />
            <label htmlFor="inst-check" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Không lời (Instrumental)
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            * Copilot sẽ tự động phối khí hợp âm, dải nốt giai điệu và ca từ tương ứng
          </span>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E6005A] to-purple-600 hover:from-[#c7004d] hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Disc3 className="w-4 h-4 animate-spin" />
                <span>Đang sáng tác nhạc...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sáng tác bài hát ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Song Player View */}
      {currentSong && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-[#1E1C27] dark:to-[#14131B] border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E6005A] to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Disc3 className={`w-8 h-8 ${isPlaying ? "animate-spin" : ""}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#E6005A]/15 text-[#E6005A] font-bold text-[10px] uppercase">
                    {currentSong.genre}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">• {currentSong.bpm} BPM</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">• Khóa: {currentSong.key}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentSong.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{currentSong.summary}</p>
              </div>
            </div>

            {/* Top Player Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#E6005A] transition-colors cursor-pointer"
                title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyLyrics}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-[#E6005A] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Sao chép lời và hợp âm"
              >
                {copiedLyrics ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="hidden md:inline">{copiedLyrics ? "Đã chép" : "Chép ca từ"}</span>
              </button>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="w-full h-24 rounded-2xl bg-slate-900 overflow-hidden relative shadow-inner flex items-center justify-center p-2">
            <canvas ref={canvasRef} width={600} height={96} className="w-full h-full object-contain" />
            <div className="absolute top-2 left-3 text-[10px] font-mono text-white/50">
              SYNTHESIZER OSCILLATORS: 44.1kHz • 16-BIT AUDIO
            </div>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setPlaybackTime(pos * totalDuration);
              }}
              className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-gradient-to-r from-[#E6005A] to-purple-600 rounded-full transition-all duration-100"
                style={{ width: `${(playbackTime / totalDuration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-3">
              <button
                onClick={() => setPlaybackTime(0)}
                className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Phát lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-12 h-12 rounded-full bg-[#E6005A] hover:bg-[#c7004d] text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-all transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              {/* Chords Badge List */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-xs sm:max-w-md">
                {currentSong.chordProgression?.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-xs font-mono font-bold text-slate-700 dark:text-pink-300 border border-slate-200 dark:border-white/5 shrink-0"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Karaoke Lyrics Display */}
          {currentSong.lyrics && currentSong.lyrics.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#E6005A]" />
                Lời bài hát (Đồng bộ theo thời gian):
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {currentSong.lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  return (
                    <div
                      key={idx}
                      className={`text-sm py-1 px-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#E6005A]/15 text-[#E6005A] dark:text-pink-300 font-bold scale-[1.01] pl-3 border-l-2 border-[#E6005A]"
                          : "text-slate-600 dark:text-slate-400 font-normal"
                      }`}
                    >
                      {line.text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History of Generated Songs */}
      {savedSongs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ListMusic className="w-3.5 h-3.5 text-[#E6005A]" />
              Bài hát đã tạo gần đây ({savedSongs.length}):
            </h4>
            <button
              onClick={() => {
                setSavedSongs([]);
                localStorage.removeItem(STORAGE_SONGS_KEY);
              }}
              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Xóa lịch sử
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => {
                  setCurrentSong(song);
                  setPlaybackTime(0);
                  setIsPlaying(true);
                }}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 hover:border-[#E6005A]/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E6005A]/10 text-[#E6005A]">
                    {song.genre}
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#E6005A] transition-colors">
                    {song.title}
                  </h5>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(song.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-[#E6005A] group-hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 transition-all">
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
