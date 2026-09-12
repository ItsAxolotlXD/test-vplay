import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  User,
  Users,
  Search,
  Plus,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Star,
  Voicemail,
  X,
  Check,
  Sparkles,
  ShieldAlert,
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// DTMF audio synthesis for realistic telephone keypad sounds
class PhoneAudioEngine {
  private ctx: AudioContext | null = null;
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: number | null = null;

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

  // DTMF Standard Frequencies
  // Rows: 123 (697Hz), 456 (770Hz), 789 (852Hz), *0# (941Hz)
  // Cols: 147* (1209Hz), 2580 (1336Hz), 369# (1477Hz)
  playDtmfTone(digit: string) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
      };

      const [f1, f2] = freqs[digit] || [700, 1200];
      const now = ctx.currentTime;
      const duration = 0.12;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(f1, now);
      osc2.frequency.setValueAtTime(f2, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {}
  }

  // Ringback tone (đang đổ chuông)
  startRingback() {
    this.stopRingback();
    const playBurst = () => {
      try {
        const ctx = this.getContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // 440Hz + 480Hz US ringback tone standard
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.08, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.3);
        osc2.stop(now + 1.3);
      } catch {}
    };

    playBurst();
    this.ringInterval = window.setInterval(playBurst, 3200);
  }

  stopRingback() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  playCallEnd() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(425, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }
}

const phoneAudio = new PhoneAudioEngine();

export interface Contact {
  id: string;
  name: string;
  phone: string;
  category: 'Cá nhân' | 'Tổng đài' | 'Khẩn cấp' | 'V-Play';
  avatarBg: string;
  isFavorite?: boolean;
}

export interface CallRecord {
  id: string;
  name: string;
  phone: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
}

const DEFAULT_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Tổng đài CSKH Vplay 360', phone: '1900 6868', category: 'V-Play', avatarBg: 'from-pink-500 to-rose-600', isFavorite: true },
  { id: 'c2', name: 'Cảnh Sát Phản Ứng Nhanh', phone: '113', category: 'Khẩn cấp', avatarBg: 'from-red-600 to-red-800', isFavorite: true },
  { id: 'c3', name: 'Cứu Hỏa & Cứu Nạn', phone: '114', category: 'Khẩn cấp', avatarBg: 'from-amber-600 to-orange-700', isFavorite: true },
  { id: 'c4', name: 'Cấp Cứu Y Tế 115', phone: '115', category: 'Khẩn cấp', avatarBg: 'from-emerald-600 to-teal-800', isFavorite: true },
  { id: 'c5', name: 'Đài Truyền Hình Việt Nam (VTV)', phone: '024 3835 5931', category: 'Tổng đài', avatarBg: 'from-blue-600 to-indigo-700', isFavorite: true },
  { id: 'c6', name: 'Nguyễn Văn Minh (Biên tập viên)', phone: '0988 123 456', category: 'Cá nhân', avatarBg: 'from-purple-500 to-indigo-600' },
  { id: 'c7', name: 'Trần Thị Thu Thảo (Kỹ thuật)', phone: '0912 345 678', category: 'Cá nhân', avatarBg: 'from-cyan-500 to-blue-600' },
  { id: 'c8', name: 'Phòng Thu Sóng 360 Studio', phone: '028 7300 8888', category: 'V-Play', avatarBg: 'from-fuchsia-600 to-pink-600' },
];

const DEFAULT_CALLS: CallRecord[] = [
  { id: 'rec-1', name: 'Tổng đài CSKH Vplay 360', phone: '1900 6868', type: 'outgoing', time: 'Hôm nay, 10:15', duration: '02:45' },
  { id: 'rec-2', name: 'Nguyễn Văn Minh', phone: '0988 123 456', type: 'incoming', time: 'Hôm qua, 18:30', duration: '05:12' },
  { id: 'rec-3', name: '0903 888 999', phone: '0903 888 999', type: 'missed', time: '08/09/2026', duration: '00:00' },
  { id: 'rec-4', name: 'Đài Truyền Hình Việt Nam', phone: '024 3835 5931', type: 'outgoing', time: '07/09/2026', duration: '01:10' },
];

export const VPhoneTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dialer' | 'contacts' | 'recents' | 'emergency'>('dialer');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Call in-progress state
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [currentCallContact, setCurrentCallContact] = useState<{ name: string; phone: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('v_phone_contacts');
      return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  });
  const [contactSearch, setContactSearch] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCat, setNewContactCat] = useState<'Cá nhân' | 'Tổng đài' | 'Khẩn cấp' | 'V-Play'>('Cá nhân');

  // Recents State
  const [callHistory, setCallHistory] = useState<CallRecord[]>(() => {
    try {
      const saved = localStorage.getItem('v_phone_recents');
      return saved ? JSON.parse(saved) : DEFAULT_CALLS;
    } catch {
      return DEFAULT_CALLS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('v_phone_contacts', JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('v_phone_recents', JSON.stringify(callHistory));
    } catch {}
  }, [callHistory]);

  // Call timer effect
  useEffect(() => {
    let interval: number | null = null;
    let connectTimeout: number | null = null;

    if (isCalling) {
      phoneAudio.startRingback();
      setCallStatus('ringing');
      setCallDuration(0);

      // Simulate contact answering after 2.5s
      connectTimeout = window.setTimeout(() => {
        phoneAudio.stopRingback();
        setCallStatus('connected');
        interval = window.setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }, 2600);
    } else {
      phoneAudio.stopRingback();
    }

    return () => {
      phoneAudio.stopRingback();
      if (connectTimeout) clearTimeout(connectTimeout);
      if (interval) clearInterval(interval);
    };
  }, [isCalling]);

  // Handle number input
  const handleDigitPress = (digit: string) => {
    phoneAudio.playDtmfTone(digit);
    setPhoneNumber((prev) => (prev.length < 15 ? prev + digit : prev));
  };

  const handleDeleteDigit = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  // Start call
  const startCall = (numberToCall: string, name?: string) => {
    const trimmed = numberToCall.trim();
    if (!trimmed) return;

    let contactName = name;
    if (!contactName) {
      const found = contacts.find((c) => c.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, ''));
      contactName = found ? found.name : 'Số chưa lưu';
    }

    setCurrentCallContact({ name: contactName, phone: trimmed });
    setIsCalling(true);

    // Add to history
    const newRecord: CallRecord = {
      id: `call-${Date.now()}`,
      name: contactName,
      phone: trimmed,
      type: 'outgoing',
      time: 'Vừa xong',
      duration: '00:00',
    };
    setCallHistory((prev) => [newRecord, ...prev]);
  };

  const endCall = () => {
    phoneAudio.stopRingback();
    phoneAudio.playCallEnd();
    setIsCalling(false);
    setIsMuted(false);
    setIsSpeaker(false);
  };

  // Add Contact
  const handleSaveContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newC: Contact = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      category: newContactCat,
      avatarBg: 'from-cyan-500 to-indigo-600',
    };
    setContacts((prev) => [newC, ...prev]);
    setIsAddContactOpen(false);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.replace(/\s+/g, '').includes(contactSearch.replace(/\s+/g, ''))
  );

  return (
    <div id="v-phone-app" className="w-full text-white">
      {/* Header Banner - V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Phone • Điện Thoại & Danh Bạ
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                VoIP & Cứu hộ
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Bàn phím số DTMF • Danh bạ thông minh • Đường dây nóng V-Play & Cứu hộ khẩn cấp
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-[#18171E] p-1.5 rounded-xl border border-[#2D2D38] self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('dialer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'dialer'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Bàn Phím</span>
          </button>
          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'contacts'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Danh Bạ ({contacts.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('recents')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'recents'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Gần Đây</span>
          </button>
          <button
            onClick={() => setActiveSubTab('emergency')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'emergency'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Khẩn Cấp</span>
          </button>
        </div>
      </div>

      {/* ACTIVE CALL MODAL SCREEN */}
      <AnimatePresence>
        {isCalling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            <div className="w-full max-w-sm bg-gradient-to-b from-[#1C0F2D] via-[#150A24] to-[#0A0512] border border-rose-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between min-h-[520px] shadow-[0_0_50px_rgba(244,63,94,0.3)] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />

              {/* Call recipient details */}
              <div className="mt-4 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 p-1 shadow-[0_0_30px_rgba(244,63,94,0.4)] mb-4">
                  <div className="w-full h-full bg-[#160B24] rounded-full flex items-center justify-center text-3xl font-black text-rose-300">
                    {currentCallContact?.name.charAt(0) || 'V'}
                  </div>
                </div>
                <h3 className="text-xl font-black text-white">{currentCallContact?.name}</h3>
                <p className="text-sm font-mono text-rose-300 mt-1">{currentCallContact?.phone}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-medium text-slate-300">
                    {callStatus === 'ringing' ? 'Đang đổ chuông...' : `Đang kết nối: ${formatSeconds(callDuration)}`}
                  </span>
                </div>
              </div>

              {/* In-Call controls */}
              <div className="grid grid-cols-3 gap-4 my-6 w-full max-w-[260px]">
                <button
                  onClick={() => setIsMuted((p) => !p)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[10px] font-semibold">Tắt mic</span>
                </button>

                <button
                  onClick={() => setIsSpeaker((p) => !p)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSpeaker ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="text-[10px] font-semibold">Loa ngoài</span>
                </button>

                <button
                  onClick={() => phoneAudio.playDtmfTone('5')}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span className="text-[10px] font-semibold">Bàn phím</span>
                </button>
              </div>

              {/* End call button */}
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-transform hover:scale-110 cursor-pointer mb-2"
                title="Kết thúc cuộc gọi"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. DIALER TAB */}
      {activeSubTab === 'dialer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Keypad Column */}
          <div className="lg:col-span-6 bg-[#160B24] border border-rose-500/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl">
            {/* Number display */}
            <div className="w-full max-w-sm mb-6 flex items-center justify-between border-b border-white/10 pb-4 min-h-[60px]">
              <span className="text-2xl sm:text-3xl font-mono font-black text-rose-300 tracking-wider truncate">
                {phoneNumber || <span className="text-slate-500 text-lg font-normal">Nhập số điện thoại...</span>}
              </span>
              {phoneNumber && (
                <button
                  onClick={handleDeleteDigit}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Xóa chữ số"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 3x4 Matrix Dial Pad */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
              {[
                { digit: '1', sub: '' },
                { digit: '2', sub: 'ABC' },
                { digit: '3', sub: 'DEF' },
                { digit: '4', sub: 'GHI' },
                { digit: '5', sub: 'JKL' },
                { digit: '6', sub: 'MNO' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: '' },
                { digit: '0', sub: '+' },
                { digit: '#', sub: '' },
              ].map((btn) => (
                <button
                  key={btn.digit}
                  onClick={() => handleDigitPress(btn.digit)}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/50 flex flex-col items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer shadow-sm mx-auto"
                >
                  <span className="text-2xl font-bold font-mono text-white">{btn.digit}</span>
                  {btn.sub && <span className="text-[9px] font-bold text-slate-400 tracking-widest">{btn.sub}</span>}
                </button>
              ))}
            </div>

            {/* Call action button */}
            <div className="mt-7 flex items-center gap-4">
              <button
                onClick={() => startCall(phoneNumber)}
                disabled={!phoneNumber}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer ${
                  phoneNumber
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/40 hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
                title="Bấm gọi"
              >
                <Phone className="w-7 h-7 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Quick Speed-Dial Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#160B24] border border-white/10 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Số Gọi Nhanh & Tổng Đài Yêu Thích</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contacts.slice(0, 6).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => startCall(c.phone, c.name)}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-rose-500/15 border border-white/5 hover:border-rose-400/30 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {c.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white group-hover:text-rose-300 truncate">{c.name}</h4>
                        <p className="text-[11px] font-mono text-slate-400">{c.phone}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Voicemail / Info Card */}
            <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900/60 border border-rose-500/20 rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
                  <Voicemail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Hộp Thư Thoại & Tín Hiệu Vplay</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Hệ thống thoại hỗ trợ chuẩn âm thanh DTMF tần số kép. Bạn có thể lưu thêm danh bạ các biên tập viên, nhà đài hoặc sử dụng số khẩn cấp trên toàn lãnh thổ Việt Nam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACTS TAB */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#160B24] border border-white/10 rounded-2xl p-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Tìm danh bạ theo tên hoặc số..."
                className="w-full bg-[#0E0617] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              onClick={() => setIsAddContactOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Liên Hệ Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className="bg-[#160B24] hover:bg-[#1E0F32] border border-white/10 hover:border-rose-500/30 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center text-white font-black text-base shrink-0 shadow-md`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-rose-300">{c.name}</h4>
                    <p className="text-xs font-mono text-slate-400">{c.phone}</p>
                    <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                      {c.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFavorite(c.id)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      c.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title="Yêu thích"
                  >
                    <Star className={`w-4 h-4 ${c.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => startCall(c.phone, c.name)}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Gọi ngay"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Xóa liên hệ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Contact Modal */}
          {isAddContactOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <div className="bg-[#1C0F2D] border border-rose-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-rose-400" />
                    <span>Thêm Liên Hệ Danh Bạ</span>
                  </h3>
                  <button
                    onClick={() => setIsAddContactOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">Họ & Tên</label>
                    <input
                      type="text"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Minh Trí"
                      className="w-full bg-[#11071F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="Ví dụ: 0988 777 666"
                      className="w-full bg-[#11071F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">Phân Loại</label>
                    <select
                      value={newContactCat}
                      onChange={(e) => setNewContactCat(e.target.value as any)}
                      className="w-full bg-[#11071F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
                    >
                      <option value="Cá nhân">Cá nhân</option>
                      <option value="Tổng đài">Tổng đài</option>
                      <option value="V-Play">V-Play</option>
                      <option value="Khẩn cấp">Khẩn cấp</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddContactOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleSaveContact}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      Lưu Liên Hệ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RECENTS TAB */}
      {activeSubTab === 'recents' && (
        <div className="bg-[#160B24] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Nhật Ký Cuộc Gọi Gần Đây</span>
            </h3>
            <button
              onClick={() => setCallHistory([])}
              className="text-xs text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Xóa lịch sử
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {callHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">Chưa có nhật ký cuộc gọi nào.</div>
            ) : (
              callHistory.map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between gap-3 hover:bg-white/5 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">
                      {rec.type === 'outgoing' && <PhoneOutgoing className="w-4 h-4 text-emerald-400" />}
                      {rec.type === 'incoming' && <PhoneIncoming className="w-4 h-4 text-blue-400" />}
                      {rec.type === 'missed' && <PhoneMissed className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rec.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{rec.phone} • {rec.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {rec.duration && <span className="text-xs font-mono text-slate-500">{rec.duration}</span>}
                    <button
                      onClick={() => startCall(rec.phone, rec.name)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
                      title="Gọi lại"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. EMERGENCY TAB */}
      {activeSubTab === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-950/60 via-rose-950/40 to-slate-900 border border-red-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
              <h2 className="text-lg font-black text-white">Đường Dây Nóng Khẩn Cấp Việt Nam</h2>
            </div>
            <p className="text-xs text-slate-300">
              Các đầu số dịch vụ cứu hộ, hỗ trợ khẩn cấp quốc gia miễn phí cước gọi và phản ứng tức thì 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { num: '113', name: 'Cảnh Sát Phản Ứng Nhanh', desc: 'An ninh, trật tự xã hội & tai nạn', color: 'from-red-600 to-red-800' },
              { num: '114', name: 'Phòng Cháy & Cứu Nạn', desc: 'Hỏa hoạn, sập đổ, cứu nạn cứu hộ', color: 'from-amber-600 to-orange-700' },
              { num: '115', name: 'Cấp Cứu Y Tế Toàn Quốc', desc: 'Cứu thương, tai nạn thương tích, bệnh viện', color: 'from-emerald-600 to-teal-800' },
              { num: '111', name: 'Bảo Vệ Trẻ Em Quốc Gia', desc: 'Tổng đài quốc gia bảo vệ trẻ em 24/7', color: 'from-blue-600 to-indigo-700' },
              { num: '112', name: 'Cứu Nạn Thiên Tai & Bão Lũ', desc: 'Yêu cầu cứu trợ khẩn cấp khi gặp bão lụt', color: 'from-cyan-600 to-sky-800' },
              { num: '1900 6868', name: 'CSKH Kỹ Thuật V-Play 360', desc: 'Hỗ trợ sự cố truyền hình & kết nối Studio', color: 'from-pink-600 to-rose-700' },
            ].map((em) => (
              <div
                key={em.num}
                className="bg-[#160B24] border border-white/10 hover:border-red-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
              >
                <div>
                  <div className="text-2xl font-black font-mono text-red-400">{em.num}</div>
                  <h4 className="text-sm font-bold text-white mt-1">{em.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{em.desc}</p>
                </div>
                <button
                  onClick={() => startCall(em.num, em.name)}
                  className={`mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r ${em.color} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 cursor-pointer`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Ngay {em.num}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
