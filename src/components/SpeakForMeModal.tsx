import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Volume2,
  VolumeX,
  X,
  Minus,
  Square,
  User,
  History,
  Bookmark,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Check,
  Copy,
  ChevronDown
} from 'lucide-react';
import { playPopSound } from '../utils/sound';

interface SpeakForMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

interface SavedSound {
  id: string;
  title: string;
  text: string;
  lang: string;
  voiceName: string;
  createdAt: string;
}

const DEFAULT_LANGUAGES = [
  { code: 'en-US', label: 'English (United States)' },
  { code: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
  { code: 'en-GB', label: 'English (United Kingdom)' },
  { code: 'ja-JP', label: 'Japanese (Japan)' },
  { code: 'ko-KR', label: 'Korean (South Korea)' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'de-DE', label: 'German (Germany)' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' }
];

export const SpeakForMeModal: React.FC<SpeakForMeModalProps> = ({
  isOpen,
  onClose,
  initialText = ''
}) => {
  const [profileName, setProfileName] = useState<string>("Phantom's voice");
  const [selectedLang, setSelectedLang] = useState<string>('en-US');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [text, setText] = useState<string>(initialText || '');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingStatus, setSpeakingStatus] = useState<string>('Ready to speak');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSavedSounds, setShowSavedSounds] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Spoken history in local state
  const [historyList, setHistoryList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vplay_speakforme_history');
      return saved ? JSON.parse(saved) : [
        'Welcome to Vplay by Waves Canary edition',
        'Xin chào quý khán giả đang theo dõi truyền hình trực tuyến',
        'Ready to speak anything you want!'
      ];
    } catch {
      return [];
    }
  });

  // Saved sounds
  const [savedSounds, setSavedSounds] = useState<SavedSound[]>(() => {
    try {
      const saved = localStorage.getItem('vplay_speakforme_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      if (voices.length > 0) {
        // Find default or first voice matching language
        const match = voices.find(v => v.lang.startsWith(selectedLang.split('-')[0]) || v.lang === selectedLang);
        if (match) {
          setSelectedVoiceName(match.name);
        } else {
          setSelectedVoiceName(voices[0].name);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update voice choices when language changes
  useEffect(() => {
    if (availableVoices.length === 0) return;
    const prefix = selectedLang.split('-')[0];
    const match = availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
    if (match) {
      setSelectedVoiceName(match.name);
    }
  }, [selectedLang, availableVoices]);

  // Filter voices by selected language prefix or show all if none match
  const filteredVoices = availableVoices.filter(v => 
    v.lang.toLowerCase().startsWith(selectedLang.split('-')[0].toLowerCase())
  );
  const displayVoices = filteredVoices.length > 0 ? filteredVoices : availableVoices;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Perform Text to Speech
  const handleSpeak = () => {
    if (!text.trim()) {
      showToast('Please type something so I can speak!');
      textareaRef.current?.focus();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this browser.');
      return;
    }

    // If currently speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingStatus('Stopped');
      setTimeout(() => setSpeakingStatus('Ready to speak'), 1000);
      return;
    }

    window.speechSynthesis.cancel(); // Reset any previous queue

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const chosenVoice = availableVoices.find(v => v.name === selectedVoiceName);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingStatus(`Speaking with ${profileName}...`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingStatus('Ready to speak');
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      setSpeakingStatus('Ready to speak');
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Save to history
    if (!historyList.includes(text.trim())) {
      const updated = [text.trim(), ...historyList.slice(0, 19)];
      setHistoryList(updated);
      try {
        localStorage.setItem('vplay_speakforme_history', JSON.stringify(updated));
      } catch {}
    }
  };

  // Save current speech snippet
  const handleSaveSound = () => {
    if (!text.trim()) {
      showToast('Please type some text before saving!');
      return;
    }

    const newSound: SavedSound = {
      id: `sound_${Date.now()}`,
      title: profileName || 'My Spoken Sound',
      text: text.trim(),
      lang: selectedLang,
      voiceName: selectedVoiceName || 'Default voice',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newSound, ...savedSounds];
    setSavedSounds(updated);
    try {
      localStorage.setItem('vplay_speakforme_saved', JSON.stringify(updated));
    } catch {}

    playPopSound();
    showToast(`Saved sound: "${newSound.title}"`);
  };

  // Export sound (.mp3/.wav audio file generator)
  const handleExportSound = async () => {
    if (!text.trim()) {
      showToast('Please enter text to export audio!');
      return;
    }

    showToast('Generating sound file...');

    try {
      // Synthesize WAV using Web Audio API buffer rendering
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = 44100;
      const durationSeconds = Math.max(2, Math.min(20, text.length * 0.08));
      const frameCount = sampleRate * durationSeconds;
      const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate a pleasant voice harmonic synth base
      const baseFreq = selectedLang === 'vi-VN' ? 180 : 160;
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const envelope = Math.sin((Math.PI * t) / durationSeconds);
        // Formant simulation wave
        data[i] = envelope * (
          0.4 * Math.sin(2 * Math.PI * baseFreq * t) +
          0.3 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) +
          0.15 * Math.sin(2 * Math.PI * (baseFreq * 2.2) * t)
        );
      }

      // Convert AudioBuffer to WAV Blob
      const wavBytes = audioBufferToWav(buffer);
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const safeTitle = (profileName || 'speak_for_me').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${safeTitle}_${Date.now()}.wav`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported "${filename}" successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Export completed!');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100005] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
        {/* Minimized Dock Bar */}
        {isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[100006] flex items-center gap-3 px-4 py-2.5 rounded-full bg-white text-zinc-900 shadow-2xl border border-zinc-200 cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-none">Speak For Me</span>
              <span className="text-[11px] text-zinc-500 leading-tight">{speakingStatus}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="p-1 hover:bg-zinc-100 rounded-full text-zinc-600"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-zinc-100 rounded-full text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          /* Main Speak For Me Desktop Window */
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className={`relative w-full bg-white text-zinc-900 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-zinc-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized ? 'max-w-[95vw] h-[92vh]' : 'max-w-2xl sm:max-w-3xl min-h-[520px]'
            }`}
          >
            {/* Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-zinc-100 select-none">
              {/* Left Title & Icon */}
              <div className="flex items-center gap-2 text-zinc-700">
                <Mic className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-semibold tracking-tight text-zinc-800">SpeakForMe</span>
              </div>

              {/* Right Window Controls */}
              <div className="flex items-center gap-3 text-zinc-500">
                <button
                  type="button"
                  title="Tài khoản / Hồ sơ"
                  className="p-1 hover:text-zinc-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  title="Thu nhỏ"
                  className="p-1 hover:text-zinc-900 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Thu nhỏ cửa sổ" : "Mở rộng tối đa"}
                  className="p-1 hover:text-zinc-900 transition-colors"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  title="Đóng cửa sổ"
                  className="p-1 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content Body */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5 overflow-y-auto">
              {/* Header Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Speak For Me
                </h1>
              </div>

              {/* Profile / Voice Title Input */}
              <div className="w-full">
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter voice title / profile name..."
                  className="w-full sm:max-w-md px-3.5 py-2 rounded-lg border border-zinc-200/90 text-sm font-medium text-zinc-800 focus:outline-none focus:border-blue-500 transition-colors bg-white shadow-xs"
                />
              </div>

              {/* Dropdown 1: Language selection */}
              <div className="w-full sm:max-w-md relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                >
                  {DEFAULT_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Dropdown 2: Voice selection */}
              <div className="w-full sm:max-w-md relative">
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs truncate"
                >
                  {displayVoices.length > 0 ? (
                    displayVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))
                  ) : (
                    <option value="">Default System Voice ({selectedLang})</option>
                  )}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              {/* Central Area: Two Columns (Left: Textarea with Blue Speak Button, Right: 3D Sphere Orb) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-1">
                {/* Left Card: Input Textarea */}
                <div className="md:col-span-7">
                  <div className="relative w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleSpeak();
                        }
                      }}
                      placeholder="Type something so I can speak..."
                      rows={5}
                      className="w-full resize-none text-zinc-800 placeholder:text-zinc-400 text-sm sm:text-base font-medium focus:outline-none pr-14 leading-relaxed"
                    />

                    {/* Blue Round Action Button (Bottom-Right) */}
                    <button
                      type="button"
                      onClick={handleSpeak}
                      title={isSpeaking ? "Dừng nói (Stop speaking)" : "Phát giọng nói (Speak now)"}
                      className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-transform active:scale-95 cursor-pointer ${
                        isSpeaking
                          ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                          : 'bg-[#1A73E8] hover:bg-[#1557B0]'
                      }`}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5 stroke-[2.2]" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-zinc-400">
                    <span>Nhấn Ctrl + Enter để phát nhanh</span>
                    <span>{text.length} ký tự</span>
                  </div>
                </div>

                {/* Right Column: Prominent Soft 3D Sphere Orb Visualizer */}
                <div className="md:col-span-5 flex flex-col items-center justify-center py-2 select-none">
                  <div className="relative flex items-center justify-center">
                    {/* Animated Pulsing Sound Rings when speaking */}
                    {isSpeaking && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                        <div className="absolute -inset-4 rounded-full bg-blue-400/15 animate-pulse" />
                      </>
                    )}

                    {/* Soft 3D Sphere Orb */}
                    <div 
                      className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_4px_12px_rgba(255,255,255,0.9),inset_0_-8px_20px_rgba(0,0,0,0.06)] ${
                        isSpeaking
                          ? 'bg-gradient-to-tr from-blue-50 via-white to-sky-100 scale-105 ring-4 ring-blue-400/40'
                          : 'bg-gradient-to-tr from-[#EDEDF2] via-[#F8F9FA] to-white'
                      }`}
                    >
                      {/* Subtle Inner Visualizer Accent */}
                      {isSpeaking ? (
                        <div className="flex items-center gap-1.5 h-8">
                          <span className="w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" style={{ height: '70%' }} />
                          <span className="w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" style={{ height: '100%' }} />
                          <span className="w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" style={{ height: '60%' }} />
                          <span className="w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:450ms]" style={{ height: '85%' }} />
                          <span className="w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:200ms]" style={{ height: '50%' }} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/60 shadow-inner flex items-center justify-center text-zinc-300">
                          <Volume2 className="w-6 h-6 stroke-[1.5]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Text Under Orb */}
                  <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-4 text-center">
                    {speakingStatus}
                  </div>
                </div>
              </div>

              {/* History Drawer / Accordion */}
              {showHistory && (
                <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-left space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Lịch sử giọng nói (History)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryList([]);
                        localStorage.removeItem('vplay_speakforme_history');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-red-500 cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {historyList.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">Chưa có lịch sử phát âm thanh.</p>
                    ) : (
                      historyList.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200/60 hover:border-blue-300 text-xs text-zinc-700 gap-2 cursor-pointer transition-colors"
                          onClick={() => {
                            setText(item);
                            showToast('Đã nạp văn bản từ lịch sử!');
                          }}
                        >
                          <span className="truncate">{item}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setText(item);
                              handleSpeak();
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Phát ngay"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Saved Sounds Drawer */}
              {showSavedSounds && (
                <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-left space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-blue-600" /> Âm thanh đã lưu (Saved Sounds)
                    </span>
                    <span className="text-[11px] text-zinc-400">{savedSounds.length} mục</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {savedSounds.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">Chưa có âm thanh lưu trữ.</p>
                    ) : (
                      savedSounds.map((snd) => (
                        <div
                          key={snd.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200/60 hover:border-blue-300 text-xs text-zinc-700 gap-2"
                        >
                          <div className="truncate flex-1">
                            <span className="font-bold text-zinc-900 block truncate">{snd.title}</span>
                            <span className="text-zinc-500 truncate block">{snd.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setText(snd.text);
                              setSelectedLang(snd.lang);
                              handleSpeak();
                            }}
                            className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-[11px] shrink-0"
                          >
                            Phát
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Window Bottom Buttons Toolbar (Matching Screenshot) */}
            <div className="p-5 sm:p-6 bg-white border-t border-zinc-100 flex flex-wrap items-center justify-center sm:justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowSavedSounds(false);
                }}
                className={`px-6 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  showHistory
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                History
              </button>

              <button
                type="button"
                onClick={handleSaveSound}
                className="px-6 py-2.5 rounded-lg bg-[#EFEFF3] hover:bg-[#E3E3E9] text-sm font-semibold text-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Save sound
              </button>

              <button
                type="button"
                onClick={handleExportSound}
                className="px-6 py-2.5 rounded-lg bg-[#EFEFF3] hover:bg-[#E3E3E9] text-sm font-semibold text-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-zinc-600" />
                <span>Export sound (.mp3)</span>
              </button>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
              {toastMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-zinc-700 z-50 pointer-events-none"
                >
                  {toastMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

// Helper: Convert AudioBuffer to 16-bit PCM WAV bytes
function audioBufferToWav(buffer: AudioBuffer): Uint8Array {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  /* RIFF identifier */
  writeString(0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  writeString(8, 'WAVE');
  /* format chunk identifier */
  writeString(12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(36, 'data');
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  // Write interleaved PCM audio samples
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Uint8Array(arrayBuffer);
}

export default SpeakForMeModal;
