import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Bell,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Globe2,
  Volume2,
  VolumeX,
  Check,
  X,
  Search,
  Flag,
  Sun,
  Moon,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Coffee,
  Flame,
  Zap,
  Radio,
  Sliders,
  Calendar,
  History as LapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  clockAudio,
  CustomAlarmSound,
  ALARM_TONE_PRESETS
} from './clockAudio';
import { AlarmSoundModal } from './AlarmSoundModal';

const audio = clockAudio;

// ==================== WORLD TIMEZONE DATA ====================
export interface WorldCity {
  id: string;
  name: string;
  country: string;
  flag: string;
  timeZone: string;
  offsetHours: number; // approximate default or relative to UTC
}

const DEFAULT_WORLD_CITIES: WorldCity[] = [
  { id: 'tokyo', name: 'Tokyo', country: 'Nhật Bản', flag: '🇯🇵', timeZone: 'Asia/Tokyo', offsetHours: 9 },
  { id: 'seoul', name: 'Seoul', country: 'Hàn Quốc', flag: '🇰🇷', timeZone: 'Asia/Seoul', offsetHours: 9 },
  { id: 'london', name: 'London', country: 'Vương quốc Anh', flag: '🇬🇧', timeZone: 'Europe/London', offsetHours: 0 },
  { id: 'new_york', name: 'New York', country: 'Hoa Kỳ', flag: '🇺🇸', timeZone: 'America/New_York', offsetHours: -5 },
  { id: 'paris', name: 'Paris', country: 'Pháp', flag: '🇫🇷', timeZone: 'Europe/Paris', offsetHours: 1 },
  { id: 'sydney', name: 'Sydney', country: 'Úc', flag: '🇦🇺', timeZone: 'Australia/Sydney', offsetHours: 11 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', timeZone: 'Asia/Singapore', offsetHours: 8 },
  { id: 'dubai', name: 'Dubai', country: 'UAE', flag: '🇦🇪', timeZone: 'Asia/Dubai', offsetHours: 4 },
];

const AVAILABLE_ADD_CITIES: WorldCity[] = [
  { id: 'bangkok', name: 'Bangkok', country: 'Thái Lan', flag: '🇹🇭', timeZone: 'Asia/Bangkok', offsetHours: 7 },
  { id: 'beijing', name: 'Bắc Kinh', country: 'Trung Quốc', flag: '🇨🇳', timeZone: 'Asia/Shanghai', offsetHours: 8 },
  { id: 'berlin', name: 'Berlin', country: 'Đức', flag: '🇩🇪', timeZone: 'Europe/Berlin', offsetHours: 1 },
  { id: 'cairo', name: 'Cairo', country: 'Ai Cập', flag: '🇪🇬', timeZone: 'Africa/Cairo', offsetHours: 2 },
  { id: 'hong_kong', name: 'Hong Kong', country: 'Hồng Kông', flag: '🇭🇰', timeZone: 'Asia/Hong_Kong', offsetHours: 8 },
  { id: 'los_angeles', name: 'Los Angeles', country: 'Hoa Kỳ', flag: '🇺🇸', timeZone: 'America/Los_Angeles', offsetHours: -8 },
  { id: 'madrid', name: 'Madrid', country: 'Tây Ban Nha', flag: '🇪🇸', timeZone: 'Europe/Madrid', offsetHours: 1 },
  { id: 'moscow', name: 'Moscow', country: 'Nga', flag: '🇷🇺', timeZone: 'Europe/Moscow', offsetHours: 3 },
  { id: 'mumbai', name: 'Mumbai', country: 'Ấn Độ', flag: '🇮🇳', timeZone: 'Asia/Kolkata', offsetHours: 5.5 },
  { id: 'rome', name: 'Roma', country: 'Ý', flag: '🇮🇹', timeZone: 'Europe/Rome', offsetHours: 1 },
  { id: 'sao_paulo', name: 'São Paulo', country: 'Brazil', flag: '🇧🇷', timeZone: 'America/Sao_Paulo', offsetHours: -3 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', flag: '🇨🇦', timeZone: 'America/Toronto', offsetHours: -5 },
  { id: 'zurich', name: 'Zurich', country: 'Thụy Sĩ', flag: '🇨🇭', timeZone: 'Europe/Zurich', offsetHours: 1 },
];

// ==================== ALARM DATA ====================
export interface AlarmItem {
  id: string;
  time: string; // "HH:mm"
  label: string;
  enabled: boolean;
  days: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat, empty = once
  soundTone?: string;
}

const DEFAULT_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    time: '06:30',
    label: 'Thức dậy & Tập thể dục buổi sáng',
    enabled: true,
    days: [1, 2, 3, 4, 5],
    soundTone: 'chime',
  },
  {
    id: 'alarm-2',
    time: '12:00',
    label: 'Ăn trưa & Nghỉ ngơi',
    enabled: true,
    days: [1, 2, 3, 4, 5],
    soundTone: 'digital',
  },
  {
    id: 'alarm-3',
    time: '20:00',
    label: 'Xem truyền hình trực tiếp V-Play',
    enabled: false,
    days: [0, 6],
    soundTone: 'chime',
  },
];

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ==================== STOPWATCH LAP ====================
interface LapRecord {
  lapNumber: number;
  lapTime: number; // ms
  totalTime: number; // ms
}

// ==================== COMPONENT: MINI ANALOG CLOCK ====================
const MiniAnalogClock: React.FC<{ date: Date; size?: number }> = ({ date, size = 52 }) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  const radius = size / 2;

  return (
    <div
      className="relative rounded-full border border-white/20 bg-gradient-to-br from-slate-900 via-[#141522] to-black shadow-inner flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Clock Face Ticks */}
      <div className="absolute inset-0.5 rounded-full border border-white/5" />
      <div className="absolute w-1 h-1 bg-white/40 top-1 rounded-full" />
      <div className="absolute w-1 h-1 bg-white/40 bottom-1 rounded-full" />
      <div className="absolute w-1 h-1 bg-white/40 left-1 rounded-full" />
      <div className="absolute w-1 h-1 bg-white/40 right-1 rounded-full" />

      {/* Hour Hand */}
      <div
        className="absolute bg-white/90 rounded-full origin-bottom"
        style={{
          width: 2.2,
          height: radius * 0.45,
          bottom: radius,
          left: `calc(50% - 1.1px)`,
          transform: `rotate(${hourAngle}deg)`,
        }}
      />

      {/* Minute Hand */}
      <div
        className="absolute bg-sky-300 rounded-full origin-bottom"
        style={{
          width: 1.6,
          height: radius * 0.65,
          bottom: radius,
          left: `calc(50% - 0.8px)`,
          transform: `rotate(${minAngle}deg)`,
        }}
      />

      {/* Second Hand */}
      <div
        className="absolute bg-pink-500 rounded-full origin-bottom shadow-[0_0_4px_#ec4899]"
        style={{
          width: 1,
          height: radius * 0.75,
          bottom: radius,
          left: `calc(50% - 0.5px)`,
          transform: `rotate(${secAngle}deg)`,
        }}
      />

      {/* Center Pin */}
      <div className="absolute w-2 h-2 rounded-full bg-white ring-2 ring-pink-500/50 z-10" />
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export const VClockTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('world');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [use24Hour, setUse24Hour] = useState<boolean>(true);

  // ---------- WORLD CLOCK STATE ----------
  const [worldCities, setWorldCities] = useState<WorldCity[]>(() => {
    try {
      const saved = localStorage.getItem('v_clock_cities');
      return saved ? JSON.parse(saved) : DEFAULT_WORLD_CITIES;
    } catch {
      return DEFAULT_WORLD_CITIES;
    }
  });
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // ---------- ALARM STATE ----------
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('v_clock_alarms');
      return saved ? JSON.parse(saved) : DEFAULT_ALARMS;
    } catch {
      return DEFAULT_ALARMS;
    }
  });
  const [isAddAlarmOpen, setIsAddAlarmOpen] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('07:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('Báo thức V-Play');
  const [newAlarmDays, setNewAlarmDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<AlarmItem | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  // ---------- CUSTOM ALARM SOUNDS STATE ----------
  const [customSounds, setCustomSounds] = useState<CustomAlarmSound[]>(() => {
    try {
      const saved = localStorage.getItem('v_clock_custom_sounds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [defaultAlarmTone, setDefaultAlarmTone] = useState<string>(() => {
    try {
      return localStorage.getItem('v_clock_default_tone') || 'chime';
    } catch {
      return 'chime';
    }
  });
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false);
  const [soundModalTargetAlarmId, setSoundModalTargetAlarmId] = useState<string | null>(null);
  const [newAlarmSoundTone, setNewAlarmSoundTone] = useState<string>('chime');
  const [previewingAlarmId, setPreviewingAlarmId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('v_clock_custom_sounds', JSON.stringify(customSounds));
    } catch {}
  }, [customSounds]);

  useEffect(() => {
    try {
      localStorage.setItem('v_clock_default_tone', defaultAlarmTone);
    } catch {}
  }, [defaultAlarmTone]);

  const getSoundInfo = (toneId?: string) => {
    const id = toneId || defaultAlarmTone;
    const custom = customSounds.find((s) => s.id === id);
    if (custom) {
      return {
        id,
        name: custom.name,
        isVideo: custom.sourceType === 'video_extracted',
        badge: custom.sourceType === 'video_extracted' ? '🎬 Video' : '🎵 Âm thanh',
        isCustom: true
      };
    }
    const preset = ALARM_TONE_PRESETS.find((p) => p.id === id);
    if (preset) {
      return {
        id,
        name: preset.name,
        isVideo: false,
        badge: preset.tag,
        isCustom: false
      };
    }
    return { id: 'chime', name: 'Giai Điệu Vplay', isVideo: false, badge: 'Mặc định', isCustom: false };
  };

  // ---------- STOPWATCH STATE ----------
  const [stopwatchTime, setStopwatchTime] = useState<number>(0); // ms
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const stopwatchIntervalRef = useRef<number | null>(null);
  const stopwatchStartTimeRef = useRef<number>(0);

  // ---------- TIMER (COUNTDOWN) STATE ----------
  const [timerDuration, setTimerDuration] = useState<number>(300); // 5 mins in sec
  const [timerRemaining, setTimerRemaining] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerFinished, setIsTimerFinished] = useState<boolean>(false);
  const [timerHours, setTimerHours] = useState<number>(0);
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save cities & alarms
  useEffect(() => {
    try {
      localStorage.setItem('v_clock_cities', JSON.stringify(worldCities));
    } catch {}
  }, [worldCities]);

  useEffect(() => {
    try {
      localStorage.setItem('v_clock_alarms', JSON.stringify(alarms));
    } catch {}
  }, [alarms]);

  // Check alarms every second
  useEffect(() => {
    const now = currentTime;
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${currentHours}:${currentMinutes}`;
    const currentDay = now.getDay(); // 0 to 6

    if (timeString !== lastTriggeredMinuteRef.current) {
      // Find matching enabled alarm
      const match = alarms.find((a) => {
        if (!a.enabled) return false;
        if (a.time !== timeString) return false;
        if (a.days.length === 0) return true; // once
        return a.days.includes(currentDay);
      });

      if (match && !activeRingingAlarm) {
        lastTriggeredMinuteRef.current = timeString;
        setActiveRingingAlarm(match);
        if (soundEnabled) {
          audio.startAlarmRinging(match.soundTone || defaultAlarmTone, customSounds);
        }
      }
    }
  }, [currentTime, alarms, activeRingingAlarm, soundEnabled, defaultAlarmTone, customSounds]);

  // Handle Stopwatch
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchStartTimeRef.current = Date.now() - stopwatchTime;
      stopwatchIntervalRef.current = window.setInterval(() => {
        setStopwatchTime(Date.now() - stopwatchStartTimeRef.current);
      }, 10);
    } else {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isStopwatchRunning]);

  // Handle Timer Countdown
  useEffect(() => {
    if (isTimerRunning && timerRemaining > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimerFinished(true);
            if (soundEnabled) {
              audio.playTimerComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerRemaining, soundEnabled]);

  // ---------- STOPWATCH ACTIONS ----------
  const handleToggleStopwatch = () => {
    if (soundEnabled) audio.playBeep(isStopwatchRunning ? 600 : 900);
    setIsStopwatchRunning((prev) => !prev);
  };

  const handleResetStopwatch = () => {
    if (soundEnabled) audio.playBeep(440);
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const handleAddLap = () => {
    if (soundEnabled) audio.playBeep(1200);
    const lastTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const currentLapTime = stopwatchTime - lastTotal;
    const newLap: LapRecord = {
      lapNumber: laps.length + 1,
      lapTime: currentLapTime,
      totalTime: stopwatchTime,
    };
    setLaps([newLap, ...laps]);
  };

  // Format Stopwatch time: mm:ss.cc
  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      centiseconds: String(centiseconds).padStart(2, '0'),
    };
  };

  // Format Lap time: mm:ss.cc
  const formatLapTime = (ms: number) => {
    const { minutes, seconds, centiseconds } = formatStopwatch(ms);
    return `${minutes}:${seconds}.${centiseconds}`;
  };

  // Find min/max lap times for color highlight
  const { fastestLap, slowestLap } = useMemo(() => {
    if (laps.length < 2) return { fastestLap: null, slowestLap: null };
    let min = laps[0].lapTime;
    let max = laps[0].lapTime;
    laps.forEach((l) => {
      if (l.lapTime < min) min = l.lapTime;
      if (l.lapTime > max) max = l.lapTime;
    });
    return { fastestLap: min, slowestLap: max };
  }, [laps]);

  // ---------- TIMER ACTIONS ----------
  const handleApplyCustomTimer = () => {
    const total = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    if (total > 0) {
      setTimerDuration(total);
      setTimerRemaining(total);
      setIsTimerRunning(true);
      setIsTimerFinished(false);
      if (soundEnabled) audio.playBeep(880);
    }
  };

  const handleSetPresetTimer = (minutes: number) => {
    const total = minutes * 60;
    setTimerHours(Math.floor(minutes / 60));
    setTimerMinutes(minutes % 60);
    setTimerSeconds(0);
    setTimerDuration(total);
    setTimerRemaining(total);
    setIsTimerRunning(true);
    setIsTimerFinished(false);
    if (soundEnabled) audio.playBeep(880);
  };

  const handleToggleTimer = () => {
    if (soundEnabled) audio.playBeep(isTimerRunning ? 600 : 900);
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    if (soundEnabled) audio.playBeep(440);
    setIsTimerRunning(false);
    setIsTimerFinished(false);
    setTimerRemaining(timerDuration);
  };

  const handleAddOneMinute = () => {
    if (soundEnabled) audio.playBeep(1100);
    setTimerRemaining((prev) => prev + 60);
    setTimerDuration((prev) => prev + 60);
  };

  // ---------- ALARM ACTIONS ----------
  const handleToggleAlarm = (id: string) => {
    if (soundEnabled) audio.playBeep(750);
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    if (soundEnabled) audio.playBeep(400);
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveNewAlarm = () => {
    if (!newAlarmTime) return;
    const newAlarm: AlarmItem = {
      id: `alarm-${Date.now()}`,
      time: newAlarmTime,
      label: newAlarmLabel.trim() || 'Báo thức',
      enabled: true,
      days: newAlarmDays,
      soundTone: newAlarmSoundTone || defaultAlarmTone,
    };
    setAlarms((prev) => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAddAlarmOpen(false);
    if (soundEnabled) audio.playBeep(1000);
  };

  const handleOpenSoundModalForAlarm = (alarmId: string | null) => {
    setSoundModalTargetAlarmId(alarmId);
    setIsSoundModalOpen(true);
  };

  const handleSelectSoundTone = (toneId: string) => {
    if (soundModalTargetAlarmId) {
      setAlarms((prev) =>
        prev.map((a) => (a.id === soundModalTargetAlarmId ? { ...a, soundTone: toneId } : a))
      );
    } else {
      setDefaultAlarmTone(toneId);
      setNewAlarmSoundTone(toneId);
    }
  };

  const handleTogglePreviewAlarm = (alarm: AlarmItem) => {
    if (previewingAlarmId === alarm.id) {
      audio.stopAlarmRinging();
      audio.stopPreview();
      setPreviewingAlarmId(null);
      return;
    }

    setPreviewingAlarmId(alarm.id);
    audio.previewSound(alarm.soundTone || defaultAlarmTone, customSounds, () => {
      setPreviewingAlarmId(null);
    });
  };

  const handleDismissAlarm = () => {
    audio.stopAlarmRinging();
    setActiveRingingAlarm(null);
  };

  const handleSnoozeAlarm = () => {
    audio.stopAlarmRinging();
    if (activeRingingAlarm) {
      // Snooze 5 minutes
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      const snoozeTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const snoozedItem: AlarmItem = {
        id: `snooze-${Date.now()}`,
        time: snoozeTime,
        label: `[Báo lại 5p] ${activeRingingAlarm.label}`,
        enabled: true,
        days: [],
        soundTone: activeRingingAlarm.soundTone,
      };
      setAlarms((prev) => [...prev, snoozedItem]);
    }
    setActiveRingingAlarm(null);
  };

  // ---------- WORLD CLOCK ACTIONS ----------
  const handleAddCity = (city: WorldCity) => {
    if (worldCities.some((c) => c.id === city.id)) return;
    setWorldCities((prev) => [...prev, city]);
    setIsAddCityOpen(false);
    if (soundEnabled) audio.playBeep(900);
  };

  const handleRemoveCity = (id: string) => {
    if (soundEnabled) audio.playBeep(400);
    setWorldCities((prev) => prev.filter((c) => c.id !== id));
  };

  // Helper to format city time
  const getCityTimeInfo = (timeZone: string) => {
    try {
      const cityDate = new Date(
        currentTime.toLocaleString('en-US', { timeZone })
      );
      const hours = cityDate.getHours();
      const minutes = cityDate.getMinutes();
      const seconds = cityDate.getSeconds();
      const isDay = hours >= 6 && hours < 18;

      let formattedTime = '';
      if (use24Hour) {
        formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      } else {
        const h12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'CH' : 'SÁ';
        formattedTime = `${h12}:${String(minutes).padStart(2, '0')} ${ampm}`;
      }

      // Difference relative to Vietnam (GMT+7)
      const vnDate = new Date(
        currentTime.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
      );
      const diffHours = Math.round((cityDate.getTime() - vnDate.getTime()) / (1000 * 60 * 60));

      let diffText = 'Cùng giờ';
      if (diffHours > 0) diffText = `Trước ${diffHours} giờ`;
      else if (diffHours < 0) diffText = `Sau ${Math.abs(diffHours)} giờ`;

      return {
        date: cityDate,
        timeStr: formattedTime,
        secondsStr: String(seconds).padStart(2, '0'),
        isDay,
        diffText,
      };
    } catch {
      return {
        date: currentTime,
        timeStr: '--:--',
        secondsStr: '00',
        isDay: true,
        diffText: '',
      };
    }
  };

  // Remaining time to next alarm helper
  const getRemainingTimeText = (timeStr: string) => {
    const [targetH, targetM] = timeStr.split(':').map(Number);
    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();

    let diffMinutes = (targetH - nowH) * 60 + (targetM - nowM);
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    if (h === 0) return `Sau ${m} phút nữa`;
    return `Sau ${h} giờ ${m} phút`;
  };

  const filteredAvailableCities = useMemo(() => {
    const currentIds = new Set(worldCities.map((c) => c.id));
    return AVAILABLE_ADD_CITIES.filter((c) => {
      if (currentIds.has(c.id)) return false;
      if (!citySearchQuery.trim()) return true;
      const q = citySearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.timeZone.toLowerCase().includes(q)
      );
    });
  }, [worldCities, citySearchQuery]);

  const sw = formatStopwatch(stopwatchTime);

  // Timer calculation
  const timerPerc = timerDuration > 0 ? (timerRemaining / timerDuration) * 100 : 0;
  const timerH = Math.floor(timerRemaining / 3600);
  const timerM = Math.floor((timerRemaining % 3600) / 60);
  const timerS = timerRemaining % 60;

  return (
    <div id="v-clock-app" className="w-full text-white">
      {/* 1. APP HEADER & NAVIGATION TABS - V-Flow Style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  V-Clock • Thời Gian & Báo Thức
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Đồng hồ chuẩn
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Báo thức thông minh • Bấm giờ thể thao • Hẹn giờ đếm ngược • Giờ quốc tế
              </p>
            </div>
          </div>

          {/* Quick Settings: 12/24H & Sound Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#18171E] p-1.5 rounded-xl border border-[#2D2D38]">
            <button
              id="vclock-toggle-24h"
              onClick={() => setUse24Hour((p) => !p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                use24Hour
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              title="Chuyển chế độ 24 giờ / 12 giờ"
            >
              {use24Hour ? '24 Giờ' : '12 Giờ (AM/PM)'}
            </button>

            <button
              id="vclock-toggle-sound"
              onClick={() => setSoundEnabled((p) => !p)}
              className={`p-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-[#2A2933] text-amber-400 border border-[#3E3D4D]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              title={soundEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đã tắt'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4 Feature Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#2D2D38] pt-4">
          <button
            id="vclock-tab-world"
            onClick={() => {
              setActiveSubTab('world');
              if (soundEnabled) audio.playBeep(800);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              activeSubTab === 'world'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Giờ Quốc Tế</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#18171E] font-mono border border-[#2D2D38]">
              {worldCities.length}
            </span>
          </button>

          <button
            id="vclock-tab-alarm"
            onClick={() => {
              setActiveSubTab('alarm');
              if (soundEnabled) audio.playBeep(800);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              activeSubTab === 'alarm'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Báo Thức</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#18171E] font-mono border border-[#2D2D38]">
              {alarms.filter((a) => a.enabled).length}/{alarms.length}
            </span>
          </button>

          <button
            id="vclock-tab-stopwatch"
            onClick={() => {
              setActiveSubTab('stopwatch');
              if (soundEnabled) audio.playBeep(800);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              activeSubTab === 'stopwatch'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Bấm Giờ</span>
            {isStopwatchRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            id="vclock-tab-timer"
            onClick={() => {
              setActiveSubTab('timer');
              if (soundEnabled) audio.playBeep(800);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              activeSubTab === 'timer'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md'
                : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Đếm Ngược</span>
            {isTimerRunning && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB CONTENT: GIỜ QUỐC TẾ (WORLD CLOCK)                */}
      {/* ======================================================== */}
      {activeSubTab === 'world' && (
        <div className="space-y-6">
          {/* Main Local Clock Hero Banner */}
          <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <MiniAnalogClock date={currentTime} size={110} />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xl">🇻🇳</span>
                  <h2 className="text-lg font-bold text-white">Giờ Địa Phương (Việt Nam)</h2>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    GMT+7 Hà Nội / TP.HCM
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white flex items-baseline justify-center sm:justify-start gap-2">
                  <span>
                    {use24Hour
                      ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
                      : currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="text-xl sm:text-2xl text-amber-400">
                    :{String(currentTime.getSeconds()).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 capitalize">
                  {currentTime.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Quick action button to add a city */}
            <button
              id="vclock-btn-open-add-city"
              onClick={() => setIsAddCityOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Thành Phố</span>
            </button>
          </div>

          {/* World Cities Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Các Múi Giờ Quốc Tế Đã Lưu ({worldCities.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {worldCities.map((city) => {
                const info = getCityTimeInfo(city.timeZone);
                return (
                  <div
                    key={city.id}
                    className="bg-[#181B28] hover:bg-[#1E2235] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-200 group flex flex-col justify-between shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{city.flag}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm leading-tight">{city.name}</h4>
                          <p className="text-[11px] text-slate-400">{city.country}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCity(city.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="my-4 flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black font-mono text-cyan-300">
                          {info.timeStr}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {info.isDay ? (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                              <Sun className="w-3 h-3 text-amber-400" />
                              Ban ngày
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                              <Moon className="w-3 h-3 text-indigo-400" />
                              Ban đêm
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {info.diffText}
                          </span>
                        </div>
                      </div>

                      <MiniAnalogClock date={info.date} size={48} />
                    </div>

                    <div className="border-t border-white/5 pt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                      <span>{city.timeZone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADD CITY MODAL */}
          {isAddCityOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-[#1B1F30] border border-cyan-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white text-base">Thêm Thành Phố Thế Giới</h3>
                  </div>
                  <button
                    onClick={() => setIsAddCityOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder="Tìm theo tên thành phố, quốc gia..."
                    className="w-full bg-[#111422] border border-white/15 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Cities List */}
                <div className="mt-4 max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {filteredAvailableCities.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Không tìm thấy thành phố nào khả dụng hoặc tất cả đã được thêm.
                    </div>
                  ) : (
                    filteredAvailableCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleAddCity(city)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-cyan-500/15 hover:border-cyan-500/40 border border-transparent transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{city.flag}</span>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                              {city.name}
                            </div>
                            <div className="text-xs text-slate-400">{city.country}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{city.timeZone}</span>
                          <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB CONTENT: BÁO THỨC (ALARM)                         */}
      {/* ======================================================== */}
      {activeSubTab === 'alarm' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] border border-cyan-500/30 rounded-3xl p-6 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <span>Quản Lý Báo Thức Thông Minh</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Đặt chuông nhắc nhở công việc, học tập và xem các chương trình trực tiếp trên V-Play
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                id="vclock-btn-open-sound-modal"
                onClick={() => handleOpenSoundModalForAlarm(null)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1A1F33] hover:bg-[#202742] text-cyan-300 hover:text-white border border-cyan-500/40 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
                title="Cài đặt và tải file âm thanh MP3/WAV hoặc trích xuất từ video"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Đổi Âm Thanh Báo Thức</span>
                {customSounds.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black">
                    {customSounds.length}
                  </span>
                )}
              </button>

              <button
                id="vclock-btn-open-add-alarm"
                onClick={() => setIsAddAlarmOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Thêm Báo Thức Mới</span>
              </button>
            </div>
          </div>

          {/* Alarm Cards List */}
          <div className="space-y-3">
            {alarms.map((alarm) => {
              const remaining = alarm.enabled ? getRemainingTimeText(alarm.time) : 'Đang tắt';
              const soundMeta = getSoundInfo(alarm.soundTone);
              const isPreviewing = previewingAlarmId === alarm.id;

              return (
                <div
                  key={alarm.id}
                  className={`border rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    alarm.enabled
                      ? 'bg-[#181C2C] border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.1)]'
                      : 'bg-[#12141E] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Big Digital Alarm Time */}
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                      <span>{alarm.time}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{alarm.label}</span>
                        {alarm.enabled && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                            {remaining}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Repeat Days Chips */}
                        <div className="flex flex-wrap gap-1">
                          {DAY_NAMES.map((dayName, idx) => {
                            const isSelected = alarm.days.includes(idx);
                            return (
                              <span
                                key={dayName}
                                className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
                                    : 'text-slate-500'
                                }`}
                              >
                                {dayName}
                              </span>
                            );
                          })}
                        </div>

                        {/* Sound badge with quick change */}
                        <button
                          type="button"
                          onClick={() => handleOpenSoundModalForAlarm(alarm.id)}
                          className="text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          title="Nhấp để đổi âm thanh cho báo thức này"
                        >
                          <Volume2 className="w-3 h-3 text-cyan-400" />
                          <span className="max-w-[130px] truncate">{soundMeta.name}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-200">
                            {soundMeta.badge}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Test Tone, Delete, Toggle On/Off */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={() => handleTogglePreviewAlarm(alarm)}
                      className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                        isPreviewing
                          ? 'bg-cyan-400 text-slate-950 font-bold animate-pulse shadow-md shadow-cyan-400/40'
                          : 'text-slate-400 hover:text-cyan-300 hover:bg-white/10'
                      }`}
                      title={isPreviewing ? 'Dừng phát' : 'Nghe thử chuông báo này'}
                    >
                      {isPreviewing ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span className="text-[11px]">Đang thử...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[11px] hidden sm:inline">Thử chuông</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Xóa báo thức"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* iOS / Cyber style Toggle Switch */}
                    <button
                      onClick={() => handleToggleAlarm(alarm.id)}
                      className={`w-13 h-7 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        alarm.enabled ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 'bg-slate-700'
                      }`}
                      title={alarm.enabled ? 'Tắt báo thức' : 'Bật báo thức'}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                          alarm.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD ALARM MODAL */}
          {isAddAlarmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-[#1B1F30] border border-cyan-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white text-base">Thêm Báo Thức Mới</h3>
                  </div>
                  <button
                    onClick={() => setIsAddAlarmOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Time picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Giờ Báo Thức (HH:mm)
                    </label>
                    <input
                      type="time"
                      value={newAlarmTime}
                      onChange={(e) => setNewAlarmTime(e.target.value)}
                      className="w-full bg-[#111422] border border-white/15 focus:border-cyan-400 rounded-2xl px-4 py-3 text-2xl font-mono font-bold text-cyan-300 text-center focus:outline-none"
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Tên Nhắc Nhở
                    </label>
                    <input
                      type="text"
                      value={newAlarmLabel}
                      onChange={(e) => setNewAlarmLabel(e.target.value)}
                      placeholder="Ví dụ: Thức dậy, Uống nước, Xem bóng đá..."
                      className="w-full bg-[#111422] border border-white/15 focus:border-cyan-400 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>

                  {/* Repeat Days */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Lặp Lại Các Thứ Trong Tuần
                    </label>
                    <div className="grid grid-cols-7 gap-1.5">
                      {DAY_NAMES.map((name, idx) => {
                        const isSelected = newAlarmDays.includes(idx);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewAlarmDays((prev) => prev.filter((d) => d !== idx));
                              } else {
                                setNewAlarmDays((prev) => [...prev, idx]);
                              }
                            }}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500 text-black shadow-md font-black'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sound Tone Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Âm Thanh Chuông Báo</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSoundModalTargetAlarmId(null);
                          setIsSoundModalOpen(true);
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
                      >
                        Quản lý / Tải file
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={newAlarmSoundTone}
                        onChange={(e) => setNewAlarmSoundTone(e.target.value)}
                        className="flex-1 bg-[#111422] border border-white/15 focus:border-cyan-400 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
                      >
                        <optgroup label="Giai điệu tích hợp (Presets)">
                          {ALARM_TONE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.tag})
                            </option>
                          ))}
                        </optgroup>
                        {customSounds.length > 0 && (
                          <optgroup label="Âm thanh tự tải / trích xuất">
                            {customSounds.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.sourceType === 'video_extracted' ? '🎬' : '🎵'} {s.name} (~{s.duration}s)
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          audio.previewSound(newAlarmSoundTone || defaultAlarmTone, customSounds);
                        }}
                        className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                        title="Nghe thử âm thanh đang chọn"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Thử</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setIsAddAlarmOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveNewAlarm}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    Lưu Báo Thức
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE RINGING ALARM OVERLAY MODAL */}
          {activeRingingAlarm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in zoom-in-95 duration-200">
              <div className="bg-[#1A182E] border-2 border-cyan-400 rounded-3xl max-w-sm w-full p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.6)] relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 animate-bounce">
                  <Bell className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black font-mono text-cyan-300 mb-1">
                  {activeRingingAlarm.time}
                </h3>
                <p className="text-base font-bold text-white mb-2">
                  {activeRingingAlarm.label}
                </p>

                {/* Ringing Sound Indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold mb-6">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="truncate max-w-[200px]">
                    Chuông: {getSoundInfo(activeRingingAlarm.soundTone).name}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleDismissAlarm}
                    className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm shadow-lg cursor-pointer"
                  >
                    Tắt Báo Thức
                  </button>
                  <button
                    onClick={handleSnoozeAlarm}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                  >
                    Báo Lại Sau 5 Phút (Snooze)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sound Management & Extraction Modal */}
          <AlarmSoundModal
            isOpen={isSoundModalOpen}
            onClose={() => {
              setIsSoundModalOpen(false);
              setSoundModalTargetAlarmId(null);
            }}
            selectedToneId={
              soundModalTargetAlarmId
                ? (alarms.find((a) => a.id === soundModalTargetAlarmId)?.soundTone || defaultAlarmTone)
                : defaultAlarmTone
            }
            onSelectTone={handleSelectSoundTone}
            customSounds={customSounds}
            onUpdateCustomSounds={setCustomSounds}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB CONTENT: BẤM GIỜ THỂ THAO (STOPWATCH)             */}
      {/* ======================================================== */}
      {activeSubTab === 'stopwatch' && (
        <div className="space-y-6">
          <div className="bg-[#141824] border border-cyan-500/30 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Stopwatch Pulse Ring */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-white/10 flex flex-col items-center justify-center my-4 bg-gradient-to-b from-[#181B2B] to-[#0D101C] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Rotating outer dash or ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-cyan-500/20"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-cyan-400 transition-all duration-100"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="800"
                  strokeDashoffset={800 - ((stopwatchTime % 60000) / 60000) * 800}
                />
              </svg>

              <div className="text-center z-10">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-baseline justify-center">
                  <span>{sw.minutes}</span>
                  <span className="text-cyan-400 mx-1">:</span>
                  <span>{sw.seconds}</span>
                  <span className="text-lg sm:text-xl text-cyan-400 font-mono ml-1">
                    .{sw.centiseconds}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mt-2">
                  Phút : Giây . Phần Trăm
                </p>
              </div>
            </div>

            {/* Stopwatch Control Buttons */}
            <div className="flex items-center gap-4 mt-2">
              <button
                id="vclock-stopwatch-reset"
                onClick={handleResetStopwatch}
                disabled={stopwatchTime === 0}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer"
                title="Đặt lại (Reset)"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                id="vclock-stopwatch-start"
                onClick={handleToggleStopwatch}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                  isStopwatchRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30 hover:scale-105'
                }`}
                title={isStopwatchRunning ? 'Tạm dừng' : 'Bắt đầu'}
              >
                {isStopwatchRunning ? (
                  <Pause className="w-8 h-8 fill-black" />
                ) : (
                  <Play className="w-8 h-8 fill-black translate-x-0.5" />
                )}
              </button>

              <button
                id="vclock-stopwatch-lap"
                onClick={handleAddLap}
                disabled={!isStopwatchRunning}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-400 flex items-center justify-center transition-all cursor-pointer"
                title="Ghi vòng (Lap)"
              >
                <LapIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="bg-[#141824] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LapIcon className="w-4 h-4 text-cyan-400" />
                  <span>Danh Sách Vòng Chạy ({laps.length})</span>
                </h3>
                <button
                  onClick={() => setLaps([])}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Xóa lịch sử
                </button>
              </div>

              <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-1">
                {laps.map((lap) => {
                  const isFastest = fastestLap !== null && lap.lapTime === fastestLap;
                  const isSlowest = slowestLap !== null && lap.lapTime === slowestLap;
                  return (
                    <div
                      key={lap.lapNumber}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-mono ${
                        isFastest
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : isSlowest
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-white/5 border-transparent text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#{String(lap.lapNumber).padStart(2, '0')}</span>
                        {isFastest && (
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Nhanh nhất
                          </span>
                        )}
                        {isSlowest && (
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            Chậm nhất
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold">+{formatLapTime(lap.lapTime)}</span>
                        <span className="text-slate-400 text-xs">{formatLapTime(lap.totalTime)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB CONTENT: ĐẾM NGƯỢC (COUNTDOWN TIMER)              */}
      {/* ======================================================== */}
      {activeSubTab === 'timer' && (
        <div className="space-y-6">
          <div className="bg-[#141824] border border-cyan-500/30 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Circular Countdown Display */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-white/10 flex flex-col items-center justify-center my-4 bg-gradient-to-b from-[#181B2B] to-[#0D101C] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-cyan-500/15"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-cyan-400 transition-all duration-300"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="800"
                  strokeDashoffset={800 - (timerPerc / 100) * 800}
                />
              </svg>

              <div className="text-center z-10">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-baseline justify-center">
                  {timerH > 0 && (
                    <>
                      <span>{String(timerH).padStart(2, '0')}</span>
                      <span className="text-cyan-400 mx-1">:</span>
                    </>
                  )}
                  <span>{String(timerM).padStart(2, '0')}</span>
                  <span className="text-cyan-400 mx-1">:</span>
                  <span>{String(timerS).padStart(2, '0')}</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mt-2">
                  {isTimerRunning ? 'Đang Đếm Ngược' : isTimerFinished ? 'Đã Hết Giờ!' : 'Sẵn Sàng'}
                </p>
              </div>
            </div>

            {/* Timer Actions */}
            <div className="flex items-center gap-3 mt-2">
              <button
                id="vclock-timer-reset"
                onClick={handleResetTimer}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Đặt lại"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt Lại</span>
              </button>

              <button
                id="vclock-timer-toggle"
                onClick={handleToggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30 hover:scale-105'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-black" />
                    <span>Tạm Dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                    <span>Bắt Đầu</span>
                  </>
                )}
              </button>

              <button
                id="vclock-timer-add1m"
                onClick={handleAddOneMinute}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cộng thêm 1 phút"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Phút</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Section */}
          <div className="bg-[#141824] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Cài Đặt Nhanh Các Mốc Thời Gian</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { m: 1, label: '1 Phút', sub: 'Chớp mắt' },
                { m: 3, label: '3 Phút', sub: 'Nấu mì tôm' },
                { m: 5, label: '5 Phút', sub: 'Nghỉ giải lao' },
                { m: 10, label: '10 Phút', sub: 'Thiền định' },
                { m: 15, label: '15 Phút', sub: 'Trà chiều' },
                { m: 25, label: '25 Phút', sub: 'Pomodoro' },
                { m: 30, label: '30 Phút', sub: 'Tập thể dục' },
                { m: 60, label: '60 Phút', sub: '1 Tiếng sâu' },
              ].map((preset) => (
                <button
                  key={preset.m}
                  onClick={() => handleSetPresetTimer(preset.m)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-slate-400">{preset.sub}</div>
                </button>
              ))}
            </div>

            {/* Custom Timer Input */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Tùy chỉnh:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={timerHours}
                    onChange={(e) => setTimerHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 bg-black/40 border border-white/15 focus:border-cyan-400 rounded-xl px-2 py-1.5 text-center font-mono text-sm text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">Giờ</span>

                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 bg-black/40 border border-white/15 focus:border-cyan-400 rounded-xl px-2 py-1.5 text-center font-mono text-sm text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">Phút</span>

                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 bg-black/40 border border-white/15 focus:border-cyan-400 rounded-xl px-2 py-1.5 text-center font-mono text-sm text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">Giây</span>
                </div>
              </div>

              <button
                onClick={handleApplyCustomTimer}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md cursor-pointer"
              >
                Áp Dụng & Bắt Đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
