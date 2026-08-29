import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Layers, 
  Palette, 
  Radio, 
  Film, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Sliders,
  Maximize2,
  Tv
} from 'lucide-react';
import { parseM3UPlaylist, exportToM3U, SAMPLE_M3U_TEMPLATE } from '../utils/m3uParser';
import { Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';

interface ToolboxProps {
  initialTab?: string;
  onSelectChannel?: (channel: Channel) => void;
  navigate?: (route: string) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({
  initialTab = 'safe-area',
  onSelectChannel,
  navigate
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sync tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Tab 1: Aspect Ratio & Safe Area state
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '9:16' | '21:9'>('16:9');
  const [showActionSafe, setShowActionSafe] = useState(true); // 90%
  const [showTitleSafe, setShowTitleSafe] = useState(true);   // 80%
  const [showCenterCross, setShowCenterCross] = useState(true);
  const [showGrid3x3, setShowGrid3x3] = useState(false);

  // Tab 2: SMPTE Color Bars & 1kHz Tone Generator
  const [isTonePlaying, setIsTonePlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleTone = () => {
    if (isTonePlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsTonePlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1000 Hz Standard Reference Tone

        // Set volume to reference calibration level (-20dBFS ~ 0.1 gain)
        gain.gain.setValueAtTime(0.1, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setIsTonePlaying(true);
      } catch (err) {
        console.warn('Audio tone failed', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Tab 3: M3U Parser Tool
  const [m3uInput, setM3uInput] = useState(SAMPLE_M3U_TEMPLATE);
  const [parsedChannels, setParsedChannels] = useState<Partial<Channel>[]>([]);
  const [copiedM3U, setCopiedM3U] = useState(false);

  useEffect(() => {
    try {
      const res = parseM3UPlaylist(m3uInput);
      setParsedChannels(res);
    } catch {
      setParsedChannels([]);
    }
  }, [m3uInput]);

  // Tab 4: Timecode Calculator
  const [fps, setFps] = useState<number>(25); // 25 fps standard for Vietnam PAL
  const [tcHours, setTcHours] = useState<number>(1);
  const [tcMinutes, setTcMinutes] = useState<number>(0);
  const [tcSeconds, setTcSeconds] = useState<number>(0);
  const [tcFrames, setTcFrames] = useState<number>(0);
  const [totalFramesInput, setTotalFramesInput] = useState<number>(90000);

  const calculateTotalFrames = () => {
    return (tcHours * 3600 + tcMinutes * 60 + tcSeconds) * fps + tcFrames;
  };

  const formatTimecode = (totalF: number, currentFps: number) => {
    const totalSecs = Math.floor(totalF / currentFps);
    const frames = totalF % currentFps;
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Tab 5: DVB-T2 Table
  const dvbT2Stations = [
    { province: 'Hà Nội & Miền Bắc', channel: 'Kênh 25 UHF (506 MHz)', provider: 'VTV Broadcom SFN', standards: 'DVB-T2 / 64-QAM', coverage: 'Bắc Bộ' },
    { province: 'Hà Nội', channel: 'Kênh 29, 30 UHF (538 - 546 MHz)', provider: 'VTC Digital', standards: 'DVB-T2 / 256-QAM', coverage: 'Thủ đô & Lân cận' },
    { province: 'TP. Hồ Chí Minh & Nam Bộ', channel: 'Kênh 25 UHF (506 MHz)', provider: 'VTV Broadcom SFN', standards: 'DVB-T2 / 64-QAM', coverage: 'Đông Nam Bộ' },
    { province: 'TP. Hồ Chí Minh', channel: 'Kênh 33, 34 UHF (570 - 578 MHz)', provider: 'SDTV / HTV', standards: 'DVB-T2 / 256-QAM', coverage: 'TP.HCM & Long An' },
    { province: 'Đà Nẵng & Miền Trung', channel: 'Kênh 25 UHF (506 MHz)', provider: 'VTV Broadcom SFN', standards: 'DVB-T2 / 64-QAM', coverage: 'Quảng Nam - Đà Nẵng' },
    { province: 'Cần Thơ & ĐBSCL', channel: 'Kênh 33, 34 UHF (570 - 578 MHz)', provider: 'SDTV Nam Bộ', standards: 'DVB-T2 / 256-QAM', coverage: 'Miền Tây' }
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#00E5FF] font-bold uppercase tracking-wider mb-1">
          <Box className="w-4 h-4" />
          <span>Công cụ Phát thanh Truyền hình</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Toolbox Tiện ích Truyền hình
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
          Bộ công cụ kỹ thuật dành cho cộng đồng phát thanh truyền hình, đồ họa motion và kiểm định luồng phát sóng.
        </p>
      </div>

      {/* Toolbox Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('safe-area')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'safe-area'
              ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
              : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#2E2E36]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#E50914]" />
          <span>Aspect Ratio & Safe Area</span>
        </button>

        <button
          onClick={() => setActiveTab('color-bars')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'color-bars'
              ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
              : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#2E2E36]'
          }`}
        >
          <Palette className="w-4 h-4 text-[#FF2020]" />
          <span>SMPTE Color Bars & 1kHz Tone</span>
        </button>

        <button
          onClick={() => setActiveTab('m3u-tester')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'm3u-tester'
              ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
              : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#2E2E36]'
          }`}
        >
          <Radio className="w-4 h-4 text-[#00E5FF]" />
          <span>M3U Playlist Parser</span>
        </button>

        <button
          onClick={() => setActiveTab('timecode')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'timecode'
              ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
              : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#2E2E36]'
          }`}
        >
          <Film className="w-4 h-4 text-[#FFD600]" />
          <span>Broadcast Timecode (PAL 25fps)</span>
        </button>

        <button
          onClick={() => setActiveTab('dvb-t2')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'dvb-t2'
              ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
              : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#2E2E36]'
          }`}
        >
          <Tv className="w-4 h-4 text-[#5865F2]" />
          <span>Tra cứu Tần số DVB-T2</span>
        </button>
      </div>

      {/* TAB 1: Aspect Ratio & Safe Area Visualizer */}
      {activeTab === 'safe-area' && (
        <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#E50914]" />
                <span>Tiêu chuẩn Vùng An toàn (Broadcast Safe Area EBU/SMPTE)</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Action Safe 90% (vùng hiển thị hành động) và Title Safe 80% (vùng an toàn cho chữ, đồ họa, logo idents và phụ đề).
              </p>
            </div>

            {/* Ratio Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-[#141416] rounded-full border border-[#34343C]">
              {(['16:9', '4:3', '21:9', '9:16'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    aspectRatio === r ? 'bg-[#E50914] text-white' : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center p-4 bg-[#121214] rounded-[24px] border border-[#2D2D35] overflow-hidden min-h-[380px]">
            <div 
              className={`relative bg-[#1A1A20] border-2 border-[#555] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                aspectRatio === '16:9' ? 'w-full aspect-video' :
                aspectRatio === '4:3' ? 'w-3/4 aspect-[4/3]' :
                aspectRatio === '21:9' ? 'w-full aspect-[21/9]' : 'w-1/2 aspect-[9/16]'
              }`}
            >
              {/* Studio Background Image Simulation */}
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80"
                alt="Studio Preview"
                className="w-full h-full object-cover opacity-60 filter brightness-75"
              />

              {/* Action Safe (90%) - Green / Cyan border */}
              {showActionSafe && (
                <div className="absolute inset-[5%] border border-[#00E5FF]/80 pointer-events-none flex items-start justify-start p-1.5">
                  <span className="text-[9px] font-mono font-bold text-[#00E5FF] bg-black/70 px-1 rounded">
                    ACTION SAFE 90% (EBU R95)
                  </span>
                </div>
              )}

              {/* Title Safe (80%) - Yellow border */}
              {showTitleSafe && (
                <div className="absolute inset-[10%] border border-[#FFD600]/90 border-dashed pointer-events-none flex items-start justify-end p-1.5">
                  <span className="text-[9px] font-mono font-bold text-[#FFD600] bg-black/70 px-1 rounded">
                    TITLE SAFE 80% (LOGO & LOWER THIRDS)
                  </span>
                </div>
              )}

              {/* Rule of Thirds 3x3 Grid */}
              {showGrid3x3 && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>
              )}

              {/* Center Crosshair */}
              {showCenterCross && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-6 h-[1px] bg-red-500/80" />
                  <div className="h-6 w-[1px] bg-red-500/80 absolute" />
                </div>
              )}

              {/* Lower Thirds graphic demonstration in title safe */}
              <div className="absolute bottom-[11%] left-[11%] right-[11%] flex items-center justify-between p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FF2020] rounded-sm transform skew-x-[-12deg]" />
                  <div>
                    <div className="text-xs font-bold text-white font-sans">VIETNAM TODAY NEWS</div>
                    <div className="text-[10px] text-[#A1A1AA]">Trường quay thời sự thực tế ảo 4K</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#00E5FF] font-bold">20:16:35</span>
              </div>
            </div>
          </div>

          {/* Controls checkboxes */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#D1D5DB] hover:text-white">
              <input
                type="checkbox"
                checked={showActionSafe}
                onChange={(e) => setShowActionSafe(e.target.checked)}
                className="w-4 h-4 rounded accent-[#00E5FF]"
              />
              <span className="font-semibold text-[#00E5FF]">Action Safe (90%)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#D1D5DB] hover:text-white">
              <input
                type="checkbox"
                checked={showTitleSafe}
                onChange={(e) => setShowTitleSafe(e.target.checked)}
                className="w-4 h-4 rounded accent-[#FFD600]"
              />
              <span className="font-semibold text-[#FFD600]">Title Safe (80%)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#D1D5DB] hover:text-white">
              <input
                type="checkbox"
                checked={showCenterCross}
                onChange={(e) => setShowCenterCross(e.target.checked)}
                className="w-4 h-4 rounded accent-[#FF2020]"
              />
              <span className="font-semibold text-red-400">Tâm khung hình (Center Cross)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#D1D5DB] hover:text-white">
              <input
                type="checkbox"
                checked={showGrid3x3}
                onChange={(e) => setShowGrid3x3(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E50914]"
              />
              <span className="font-semibold text-white">Lưới 1/3 (Rule of Thirds)</span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 2: SMPTE Color Bars & 1kHz Reference Tone */}
      {activeTab === 'color-bars' && (
        <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#FF2020]" />
                <span>Bảng màu SMPTE Color Bars & Âm thanh Chuẩn 1kHz</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Hiệu chuẩn màn hình truyền hình, cân bằng màu sắc (NTSC/PAL) và đồng bộ âm thanh tham chiếu 1000 Hz (-20dBFS).
              </p>
            </div>

            {/* Audio 1kHz Tone Button */}
            <button
              onClick={toggleTone}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all ${
                isTonePlaying
                  ? 'bg-[#FF2020] text-white animate-pulse'
                  : 'bg-gradient-purple-active text-white glow-purple'
              }`}
            >
              {isTonePlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isTonePlaying ? 'Tắt Âm Tone 1kHz' : 'Phát Âm Chuẩn 1kHz Tone'}</span>
            </button>
          </div>

          {/* SMPTE 75% Color Bars Full Visual Canvas */}
          <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border-2 border-[#333] shadow-2xl flex flex-col select-none">
            {/* Top 67% bars: Gray, Yellow, Cyan, Green, Magenta, Red, Blue */}
            <div className="h-[67%] grid grid-cols-7">
              <div className="bg-[#BFBFBF]" title="White / Gray (75%)" />
              <div className="bg-[#BFBF00]" title="Yellow (75%)" />
              <div className="bg-[#00BFBF]" title="Cyan (75%)" />
              <div className="bg-[#00BF00]" title="Green (75%)" />
              <div className="bg-[#BF00BF]" title="Magenta (75%)" />
              <div className="bg-[#BF0000]" title="Red (75%)" />
              <div className="bg-[#0000BF]" title="Blue (75%)" />
            </div>

            {/* Middle 8% cast bars */}
            <div className="h-[8%] grid grid-cols-7">
              <div className="bg-[#0000BF]" />
              <div className="bg-[#131313]" />
              <div className="bg-[#BF00BF]" />
              <div className="bg-[#131313]" />
              <div className="bg-[#00BFBF]" />
              <div className="bg-[#131313]" />
              <div className="bg-[#BFBFBF]" />
            </div>

            {/* Bottom 25% PLUGE and color patches */}
            <div className="h-[25%] grid grid-cols-6">
              <div className="bg-[#084453]" title="I Signal" />
              <div className="bg-[#FFFFFF]" title="100% White" />
              <div className="bg-[#32006A]" title="Q Signal" />
              <div className="bg-[#131313] flex items-center justify-center">
                <div className="w-1/3 h-full bg-[#000000]" />
                <div className="w-1/3 h-full bg-[#131313]" />
                <div className="w-1/3 h-full bg-[#202020]" />
              </div>
              <div className="bg-[#131313]" />
              <div className="bg-[#131313]" />
            </div>

            {/* Center Channel Ident Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-6 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/30 text-center shadow-2xl">
                <div className="text-sm md:text-base font-mono font-black text-white tracking-wider">
                  WAVES COMMUNITY • TEST PATTERN
                </div>
                <div className="text-[10px] font-mono text-[#00E5FF]">
                  SMPTE RP 219 • 1080p50 • 1kHz @ -20dBFS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: M3U Playlist Parser & Tester */}
      {activeTab === 'm3u-tester' && (
        <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#00E5FF]" />
                <span>Trình Phân Tích Playlist M3U / M3U8</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Tự động bóc tách các trường #EXTINF, tvg-id, group-title và liên kết stream.
              </p>
            </div>

            <button
              onClick={() => {
                const jsonStr = JSON.stringify(parsedChannels, null, 2);
                navigator.clipboard.writeText(jsonStr);
                setCopiedM3U(true);
                setTimeout(() => setCopiedM3U(false), 2000);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#28282E] text-xs font-bold text-white hover:bg-[#34343E] border border-[#3E3E48]"
            >
              {copiedM3U ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedM3U ? 'Đã sao chép JSON' : 'Xuất định dạng JSON'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#D1D5DB]">Dán nội dung Playlist M3U vào đây:</label>
              <textarea
                rows={10}
                value={m3uInput}
                onChange={(e) => setM3uInput(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#141416] border border-[#2D2D35] text-xs font-mono text-white focus:outline-none focus:border-[#E50914] resize-none"
              />
            </div>

            {/* Parsed Channels Table */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#D1D5DB]">
                Kết quả bóc tách ({parsedChannels.length} kênh):
              </label>
              <div className="max-h-72 overflow-y-auto space-y-2 bg-[#141416] p-3 rounded-2xl border border-[#2D2D35]">
                {parsedChannels.map((ch, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#1E1E22] border border-[#2A2A30] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{ch.name}</span>
                      <span className="text-[10px] text-[#8E8E93] font-mono truncate max-w-xs block">{ch.streamUrl}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold">
                      {ch.category || 'HD'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Timecode Calculator */}
      {activeTab === 'timecode' && (
        <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#FFD600]" />
              <span>Máy Tính Broadcast Timecode & Frame Rate</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Tính toán độ dài khung hình, chuyển đổi SMPTE Timecode (HH:MM:SS:FF) cho định dạng PAL 25fps và NTSC.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#141416] border border-[#2D2D35] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">Tốc độ khung hình (Frame Rate)</span>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl bg-[#222226] border border-[#34343C] text-xs font-bold text-white focus:outline-none"
                >
                  <option value={25}>25 fps (PAL / Chuẩn Việt Nam)</option>
                  <option value={50}>50 fps (50p Sports HD)</option>
                  <option value={24}>24 fps (Cinema 24p)</option>
                  <option value={30}>30 fps (30p NTSC)</option>
                  <option value={60}>60 fps (60p Ultra HD)</option>
                </select>
              </div>

              {/* Timecode Inputs */}
              <div>
                <span className="text-xs font-bold text-[#A1A1AA] block mb-2">Nhập Timecode (HH:MM:SS:FF):</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-[#8E8E93] block">Giờ</label>
                    <input
                      type="number"
                      min={0}
                      value={tcHours}
                      onChange={(e) => setTcHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#222226] border border-[#34343C] text-sm font-mono text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8E8E93] block">Phút</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={tcMinutes}
                      onChange={(e) => setTcMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#222226] border border-[#34343C] text-sm font-mono text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8E8E93] block">Giây</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={tcSeconds}
                      onChange={(e) => setTcSeconds(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#222226] border border-[#34343C] text-sm font-mono text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8E8E93] block">Frame</label>
                    <input
                      type="number"
                      min={0}
                      max={fps - 1}
                      value={tcFrames}
                      onChange={(e) => setTcFrames(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#222226] border border-[#34343C] text-sm font-mono text-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#24242C] to-[#17171A] border border-[#3A3A44] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FFD600] tracking-wider block">
                  Tổng Số Khung Hình (Total Frames)
                </span>
                <div className="text-4xl font-black text-white font-mono mt-2">
                  {calculateTotalFrames().toLocaleString()} <span className="text-lg text-[#8E8E93]">frames</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#34343C] space-y-1 text-xs text-[#C5C5CE]">
                <div className="flex justify-between">
                  <span>Tổng thời lượng giây:</span>
                  <span className="font-mono text-white font-bold">{(calculateTotalFrames() / fps).toFixed(2)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Định dạng EBU Timecode:</span>
                  <span className="font-mono text-[#00E5FF] font-bold">
                    {formatTimecode(calculateTotalFrames(), fps)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DVB-T2 Frequency Lookup */}
      {activeTab === 'dvb-t2' && (
        <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#5865F2]" />
              <span>Tra Cứu Tần Số Truyền Hình Số Mặt Đất DVB-T2</span>
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Bảng quy hoạch phổ tần số vô tuyến điện phục vụ thu sóng miễn phí bằng ăng-ten mặt đất tại Việt Nam.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#34343C] text-[#8E8E93] uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Khu vực / Tỉnh thành</th>
                  <th className="py-3 px-4">Kênh & Tần số Trung tâm</th>
                  <th className="py-3 px-4">Đơn vị Truyền dẫn</th>
                  <th className="py-3 px-4">Tiêu chuẩn Kỹ thuật</th>
                  <th className="py-3 px-4">Vùng phủ sóng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28282E]">
                {dvbT2Stations.map((st, idx) => (
                  <tr key={idx} className="hover:bg-[#25252C] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{st.province}</td>
                    <td className="py-3 px-4 font-mono text-[#00E5FF] font-semibold">{st.channel}</td>
                    <td className="py-3 px-4 text-[#D1D5DB]">{st.provider}</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{st.standards}</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{st.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
