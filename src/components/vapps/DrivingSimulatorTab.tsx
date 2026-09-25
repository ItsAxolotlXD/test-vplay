import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  CloudRain, 
  Sparkles, 
  Radio, 
  Navigation, 
  Zap, 
  ArrowLeft, 
  Gauge, 
  Flame, 
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';

interface DrivingSimulatorTabProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

export const DrivingSimulatorTab: React.FC<DrivingSimulatorTabProps> = ({ onBack, navigate }) => {
  // Engine & Movement State
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [gear, setGear] = useState<'P' | 'R' | 'N' | 'D' | 'S'>('P');
  const [speed, setSpeed] = useState(0); // km/h
  const [rpm, setRpm] = useState(0); // x 1000
  const [steeringAngle, setSteeringAngle] = useState(0); // degrees -45 to +45
  const [isGasPressed, setIsGasPressed] = useState(false);
  const [isBrakePressed, setIsBrakePressed] = useState(false);
  const [handbrake, setHandbrake] = useState(true);

  // Indicators & Lights
  const [turnSignal, setTurnSignal] = useState<'none' | 'left' | 'right' | 'hazard'>('none');
  const [isHeadlightsOn, setIsHeadlightsOn] = useState(false);
  const [isHighBeam, setIsHighBeam] = useState(false);
  const [isWipersOn, setIsWipersOn] = useState(false);
  const [wiperAngle, setWiperAngle] = useState(0);

  // Environment & Weather
  const [weather, setWeather] = useState<'day' | 'sunset' | 'night' | 'rain'>('sunset');
  const [radioChannel, setRadioChannel] = useState('Lo-fi Highway 98.5 FM');
  const [isRadioPlaying, setIsRadioPlaying] = useState(true);

  // Road animation offset
  const [roadOffset, setRoadOffset] = useState(0);
  const [carXPosition, setCarXPosition] = useState(0); // lane offset

  // Audio Synthesizer reference using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator
  const playHonkSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc2.frequency.setValueAtTime(370, ctx.currentTime); // F#4
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 'W', 'ArrowUp'].includes(e.key)) {
        setIsGasPressed(true);
      } else if (['s', 'S', 'ArrowDown', ' '].includes(e.key)) {
        setIsBrakePressed(true);
      } else if (['a', 'A', 'ArrowLeft'].includes(e.key)) {
        setSteeringAngle((prev) => Math.max(-50, prev - 12));
      } else if (['d', 'D', 'ArrowRight'].includes(e.key)) {
        setSteeringAngle((prev) => Math.min(50, prev + 12));
      } else if (e.key === 'h' || e.key === 'H') {
        playHonkSound();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['w', 'W', 'ArrowUp'].includes(e.key)) {
        setIsGasPressed(false);
      } else if (['s', 'S', 'ArrowDown', ' '].includes(e.key)) {
        setIsBrakePressed(false);
      } else if (['a', 'A', 'ArrowLeft', 'd', 'D', 'ArrowRight'].includes(e.key)) {
        setSteeringAngle(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Physics & Dashboard Loop (60 FPS)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (!isEngineOn) {
        setSpeed((prev) => Math.max(0, prev - 2));
        setRpm(0);
      } else {
        // Engine is ON
        if (handbrake || gear === 'P' || gear === 'N') {
          // In Park or Neutral: can rev engine, but speed stays 0
          if (isGasPressed) {
            setRpm((prev) => Math.min(6500, prev + 250));
          } else {
            setRpm((prev) => Math.max(800, prev - 150));
          }
          setSpeed(0);
        } else {
          // Gear is in D (Drive), S (Sport), or R (Reverse)
          const maxSpeed = gear === 'S' ? 220 : gear === 'R' ? 35 : 160;
          const accelRate = gear === 'S' ? 2.4 : 1.4;

          if (isBrakePressed) {
            setSpeed((prev) => Math.max(0, prev - 4.5));
            setRpm((prev) => Math.max(800, prev - 250));
          } else if (isGasPressed) {
            setSpeed((prev) => Math.min(maxSpeed, prev + accelRate));
            setRpm((prev) => Math.min(7000, 1000 + (speed / maxSpeed) * 5500 + Math.random() * 80));
          } else {
            // Coasting
            setSpeed((prev) => Math.max(0, prev - 0.5));
            setRpm((prev) => Math.max(800, prev - 100));
          }
        }
      }

      // Road moving animation speed
      if (speed > 0) {
        setRoadOffset((prev) => (prev + speed * 0.45) % 100);
        // Steering lateral drift
        setCarXPosition((prev) => {
          const target = prev + (steeringAngle * 0.04 * (speed / 80));
          return Math.max(-140, Math.min(140, target));
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isEngineOn, gear, isGasPressed, isBrakePressed, handbrake, speed, steeringAngle]);

  // Turn signal ticking sound & blinking
  useEffect(() => {
    if (turnSignal === 'none') return;
    const interval = setInterval(() => {
      playClickSound();
    }, 550);
    return () => clearInterval(interval);
  }, [turnSignal]);

  // Wiper motion animation when rain & wipers ON
  useEffect(() => {
    if (!isWipersOn && weather !== 'rain') {
      setWiperAngle(0);
      return;
    }
    const interval = setInterval(() => {
      setWiperAngle((prev) => (prev === 0 ? 60 : 0));
    }, 800);
    return () => clearInterval(interval);
  }, [isWipersOn, weather]);

  const toggleEngine = () => {
    playPopSound();
    setIsEngineOn((prev) => {
      const next = !prev;
      if (!next) {
        setGear('P');
        setHandbrake(true);
      } else {
        setHandbrake(false);
        setGear('D');
      }
      return next;
    });
  };

  const handleGearSelect = (nextGear: 'P' | 'R' | 'N' | 'D' | 'S') => {
    playClickSound();
    setGear(nextGear);
    if (nextGear === 'P') setHandbrake(true);
    else setHandbrake(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 pb-20 select-none animate-in fade-in">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Driving Simulator • Khoang Lái Ghế Lái 3D
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                COCKPIT
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Trải nghiệm mô phỏng ngồi sau tay lái: vô lăng, bàn đạp ga/phanh, cần số, táp-lô
            </p>
          </div>
        </div>

        {/* Weather / Time Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-800/80 border border-white/10">
          <button
            onClick={() => setWeather('day')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              weather === 'day' ? 'bg-amber-400 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
            title="Ban ngày"
          >
            <Sun className="w-3.5 h-3.5 inline mr-1" /> Ngày
          </button>
          <button
            onClick={() => setWeather('sunset')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              weather === 'sunset' ? 'bg-orange-500 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
            title="Hoàng hôn"
          >
            🌅 Chiều
          </button>
          <button
            onClick={() => setWeather('night')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              weather === 'night' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
            title="Ban đêm"
          >
            <Moon className="w-3.5 h-3.5 inline mr-1" /> Đêm
          </button>
          <button
            onClick={() => {
              setWeather('rain');
              setIsWipersOn(true);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              weather === 'rain' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
            title="Trời mưa"
          >
            <CloudRain className="w-3.5 h-3.5 inline mr-1" /> Mưa
          </button>
        </div>
      </div>

      {/* COCKPIT CHÍNH (Windshield + Mirrors + Dashboard + Steering Wheel + Pedals) */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl flex flex-col">
        {/* ============================================================== */}
        {/* 1. KÍNH CHẮN GIÓ (WINDSHIELD) NHÌN RA ĐƯỜNG CAO TỐC            */}
        {/* ============================================================== */}
        <div className={`relative w-full h-[280px] sm:h-[350px] overflow-hidden transition-colors duration-1000 ${
          weather === 'day' 
            ? 'bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100' 
            : weather === 'sunset'
              ? 'bg-gradient-to-b from-purple-900 via-orange-600 to-amber-400'
              : weather === 'night'
                ? 'bg-gradient-to-b from-zinc-950 via-slate-950 to-zinc-900'
                : 'bg-gradient-to-b from-slate-800 via-slate-700 to-zinc-800'
        }`}>
          {/* Mountains & City Skyline Silhouette */}
          <div className="absolute bottom-[100px] inset-x-0 h-28 opacity-40 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-current text-zinc-900">
              <path d="M0,120 L0,80 L120,40 L240,75 L380,20 L500,60 L680,15 L820,65 L960,30 L1100,70 L1200,45 L1200,120 Z" />
            </svg>
          </div>

          {/* Sun / Moon */}
          {weather === 'sunset' && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 blur-sm opacity-80 pointer-events-none" />
          )}
          {weather === 'night' && (
            <div className="absolute top-8 right-32 w-16 h-16 rounded-full bg-amber-100 shadow-[0_0_30px_rgba(254,243,199,0.8)] pointer-events-none" />
          )}

          {/* Rain animation overlay */}
          {weather === 'rain' && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent animate-pulse"
              style={{
                backgroundImage: 'repeating-linear-gradient(105deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 2px, transparent 2px, transparent 30px)'
              }}
            />
          )}

          {/* 3D Road Highway Canvas / Perspective Lines */}
          <div 
            className="absolute bottom-0 inset-x-0 h-[170px] sm:h-[190px] overflow-hidden"
            style={{
              perspective: '350px',
              perspectiveOrigin: '50% 10%'
            }}
          >
            {/* Road Surface */}
            <div 
              className="w-full h-full bg-[#1b1c20] relative origin-bottom"
              style={{
                transform: `rotateX(58deg) translateX(${-carXPosition}px)`
              }}
            >
              {/* Left & Right Guardrail Lines */}
              <div className="absolute top-0 bottom-0 left-[18%] w-2 bg-zinc-400" />
              <div className="absolute top-0 bottom-0 right-[18%] w-2 bg-zinc-400" />

              {/* Road Center Dashed Lines (animated moving forward) */}
              <div 
                className="absolute top-0 bottom-0 left-[49.5%] w-3 bg-amber-400"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #f59e0b 60%, transparent 40%)',
                  backgroundSize: '100% 80px',
                  backgroundPositionY: `${roadOffset}%`
                }}
              />
              <div 
                className="absolute top-0 bottom-0 left-[34%] w-1.5 bg-white/70"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #ffffff 50%, transparent 50%)',
                  backgroundSize: '100% 60px',
                  backgroundPositionY: `${roadOffset}%`
                }}
              />
              <div 
                className="absolute top-0 bottom-0 right-[34%] w-1.5 bg-white/70"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #ffffff 50%, transparent 50%)',
                  backgroundSize: '100% 60px',
                  backgroundPositionY: `${roadOffset}%`
                }}
              />
            </div>
          </div>

          {/* Headlights illumination cone onto road at night */}
          {isHeadlightsOn && (
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-amber-100/25 via-amber-100/10 to-transparent pointer-events-none blur-xl" />
          )}

          {/* GƯƠNG CHIẾU HẬU TRUNG TÂM (REARVIEW MIRROR) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-12 rounded-2xl border-2 border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center z-20">
            <div className="w-full h-full bg-gradient-to-b from-sky-900/60 to-zinc-900/90 flex items-center justify-center text-[10px] text-zinc-300 font-medium">
              <span>Gương chiếu hậu • Đường vắng</span>
            </div>
          </div>

          {/* CẦN GẠT NƯỚC (WINDSHIELD WIPERS) */}
          <div 
            className="absolute bottom-0 left-1/3 w-2 h-44 bg-zinc-800 rounded-t-full origin-bottom transition-transform duration-700 ease-in-out pointer-events-none z-10"
            style={{
              transform: `rotate(${wiperAngle - 30}deg)`
            }}
          />
          <div 
            className="absolute bottom-0 left-2/3 w-2 h-44 bg-zinc-800 rounded-t-full origin-bottom transition-transform duration-700 ease-in-out pointer-events-none z-10"
            style={{
              transform: `rotate(${wiperAngle - 30}deg)`
            }}
          />

          {/* HUD Speed projection on glass */}
          <div className="absolute top-16 left-8 font-mono text-cyan-300/80 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none select-none">
            <div className="text-3xl font-black">{Math.round(speed)}</div>
            <div className="text-[10px] tracking-wider uppercase">KM/H HUD</div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. BẢNG TÁP-LÔ & ĐỒNG HỒ XE (DASHBOARD CLUSTER)                 */}
        {/* ============================================================== */}
        <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-t-4 border-zinc-800 p-4 sm:p-6 space-y-6">
          {/* Leather Stitching Line Decoration */}
          <div className="w-full h-0.5 border-b border-dashed border-zinc-700/60" />

          {/* Main Gauges & Center Screen */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Đồng hồ vòng tua RPM (Left) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-inner">
              <div className="relative w-36 h-36 rounded-full border-4 border-zinc-700/80 bg-zinc-950 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-[10px] font-bold text-zinc-400">RPM x1000</span>
                <span className="text-3xl font-black text-amber-400 font-mono tracking-tighter">
                  {(rpm / 1000).toFixed(1)}
                </span>
                <span className="text-[9px] text-zinc-500 font-semibold">Tachometer</span>

                {/* RPM Needle */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
                  style={{ transform: `rotate(${-120 + (rpm / 8000) * 240}deg)` }}
                >
                  <div className="w-1 h-14 bg-gradient-to-t from-red-500 to-amber-400 rounded-t-full -translate-y-7 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </div>
              </div>
            </div>

            {/* Màn hình giải trí trung tâm & GPS Navigation (Center) */}
            <div className="md:col-span-6 p-4 rounded-3xl bg-zinc-900/95 border border-white/10 shadow-2xl space-y-3">
              {/* Infotainment Header */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">VPlay Navi GPS</span>
                </div>
                {/* Warning lights cluster */}
                <div className="flex items-center gap-2 text-xs">
                  {turnSignal === 'left' && <span className="text-emerald-400 font-black animate-ping">⬅</span>}
                  {isHighBeam && <span className="text-blue-400 font-bold">🔆</span>}
                  {handbrake && <span className="text-red-400 font-bold">[P] Phanh tay</span>}
                  {turnSignal === 'right' && <span className="text-emerald-400 font-black animate-ping">➡</span>}
                </div>
              </div>

              {/* Navigation Instruction & Route */}
              <div className="p-3 rounded-2xl bg-zinc-800/80 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-cyan-300 border border-blue-500/40 flex items-center justify-center font-bold text-sm">
                    ➔
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Sau 450m rẽ phải vào Cao Tốc</div>
                    <div className="text-[10px] text-zinc-400">Dự kiến đến trong 18 phút (12.4 km)</div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-xs text-emerald-400">
                  GPS OK
                </div>
              </div>

              {/* Radio Player Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-pink-400" />
                  <span className="font-medium text-zinc-200">{radioChannel}</span>
                </div>
                <button
                  onClick={() => setIsRadioPlaying(!isRadioPlaying)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  {isRadioPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
                </button>
              </div>

              {/* Quick Car Function Toggles */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <button
                  onClick={() => setTurnSignal(turnSignal === 'left' ? 'none' : 'left')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    turnSignal === 'left' ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-zinc-800 text-zinc-300 border-white/5'
                  }`}
                >
                  ⬅ Xi-nhan L
                </button>
                <button
                  onClick={() => setIsHeadlightsOn(!isHeadlightsOn)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isHeadlightsOn ? 'bg-amber-400 text-black border-amber-300' : 'bg-zinc-800 text-zinc-300 border-white/5'
                  }`}
                >
                  💡 Đèn pha
                </button>
                <button
                  onClick={() => setTurnSignal(turnSignal === 'hazard' ? 'none' : 'hazard')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    turnSignal === 'hazard' ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-300 border-white/5'
                  }`}
                >
                  ⚠️ Khẩn cấp
                </button>
                <button
                  onClick={() => setTurnSignal(turnSignal === 'right' ? 'none' : 'right')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    turnSignal === 'right' ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-zinc-800 text-zinc-300 border-white/5'
                  }`}
                >
                  Xi-nhan R ➡
                </button>
              </div>
            </div>

            {/* Đồng hồ Tốc độ SPEEDOMETER (Right) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-inner">
              <div className="relative w-36 h-36 rounded-full border-4 border-zinc-700/80 bg-zinc-950 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-[10px] font-bold text-zinc-400">KM / H</span>
                <span className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">
                  {Math.round(speed)}
                </span>
                <span className="text-[9px] text-zinc-500 font-semibold">Speedometer</span>

                {/* Speed Needle */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
                  style={{ transform: `rotate(${-120 + (speed / 240) * 240}deg)` }}
                >
                  <div className="w-1 h-14 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t-full -translate-y-7 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. VÔ LĂNG, CẦN SỐ VÀ BÀN ĐẠP (STEERING, SHIFTER, PEDALS)      */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            {/* CẦN SỐ & NÚT ENGINE (Left col-span-3) */}
            <div className="md:col-span-4 p-4 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Cần số tự động:</span>
                {/* NÚT START/STOP ENGINE */}
                <button
                  onClick={toggleEngine}
                  className={`w-12 h-12 rounded-full border-2 font-bold text-[9px] uppercase tracking-wider shadow-lg flex items-center justify-center transition-all cursor-pointer ${
                    isEngineOn
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-black border-emerald-300 shadow-emerald-500/40 animate-pulse'
                      : 'bg-gradient-to-tr from-red-600 to-rose-700 text-white border-red-400 shadow-red-500/40 hover:scale-105'
                  }`}
                  title="Bấm để khởi động hoặc tắt máy"
                >
                  {isEngineOn ? 'STOP' : 'START'}
                </button>
              </div>

              {/* Shifter PRNDS Buttons */}
              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-white/10">
                {(['P', 'R', 'N', 'D', 'S'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGearSelect(g)}
                    className={`py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                      gear === g
                        ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-black shadow-lg scale-105'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-400">Trạng thái:</span>
                <span className={`font-bold ${isEngineOn ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {isEngineOn ? 'Động cơ đang nổ' : 'Động cơ đã tắt'}
                </span>
              </div>
            </div>

            {/* VÔ LĂNG XE TƯƠNG TÁC (Center col-span-4) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
              <div 
                className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-8 border-zinc-800 bg-zinc-950 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-100 select-none group"
                style={{
                  transform: `rotate(${steeringAngle}deg)`
                }}
              >
                {/* 3 Spokes of Steering Wheel */}
                <div className="absolute w-full h-3 bg-zinc-800 top-1/2 -translate-y-1/2" />
                <div className="absolute w-3 h-1/2 bg-zinc-800 bottom-0 left-1/2 -translate-x-1/2" />

                {/* Central Horn Button (Còi xe) */}
                <button
                  onClick={playHonkSound}
                  className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-700 border-2 border-zinc-600 flex flex-col items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Bấm còi xe (Phím H)"
                >
                  <span className="text-[10px] font-black tracking-widest text-amber-400">VPLAY</span>
                  <span className="text-[8px] font-bold text-zinc-400">HORN</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button 
                  onClick={() => setSteeringAngle((a) => Math.max(-45, a - 15))}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  ⟵ Trái (A)
                </button>
                <button 
                  onClick={() => setSteeringAngle(0)}
                  className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[11px]"
                >
                  Thẳng
                </button>
                <button 
                  onClick={() => setSteeringAngle((a) => Math.min(45, a + 15))}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  Phải (D) ⟶
                </button>
              </div>
            </div>

            {/* BÀN ĐẠP PHANH & BÀN ĐẠP GA (Right col-span-4) */}
            <div className="md:col-span-4 p-4 rounded-3xl bg-zinc-900/80 border border-white/10 flex items-center justify-around">
              {/* Bàn đạp Phanh (Brake) */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onMouseDown={() => setIsBrakePressed(true)}
                  onMouseUp={() => setIsBrakePressed(false)}
                  onTouchStart={() => setIsBrakePressed(true)}
                  onTouchEnd={() => setIsBrakePressed(false)}
                  className={`w-16 h-28 rounded-2xl border-4 font-black text-xs flex flex-col items-center justify-between p-2 shadow-2xl transition-all cursor-pointer ${
                    isBrakePressed
                      ? 'bg-red-600 border-red-400 text-white scale-95 shadow-red-500/50'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  <span className="text-[10px] text-zinc-400">BRAKE</span>
                  <div className="space-y-1 w-full">
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                  </div>
                  <span className="text-xs font-black">PHANH</span>
                </button>
                <span className="text-[10px] text-zinc-400 font-mono">(S / Space)</span>
              </div>

              {/* Bàn đạp Ga (Accelerator / Gas) */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onMouseDown={() => setIsGasPressed(true)}
                  onMouseUp={() => setIsGasPressed(false)}
                  onTouchStart={() => setIsGasPressed(true)}
                  onTouchEnd={() => setIsGasPressed(false)}
                  className={`w-12 h-36 rounded-2xl border-4 font-black text-xs flex flex-col items-center justify-between p-2 shadow-2xl transition-all cursor-pointer ${
                    isGasPressed
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-500 border-emerald-300 text-white scale-95 shadow-emerald-500/50'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  <span className="text-[10px] text-zinc-400">GAS</span>
                  <div className="space-y-1 w-full">
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                    <div className="w-full h-1 bg-zinc-600 rounded" />
                  </div>
                  <span className="text-xs font-black">GA</span>
                </button>
                <span className="text-[10px] text-zinc-400 font-mono">(W / Up)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
