// ========================================================
// CLOCK AUDIO ENGINE & AUDIO EXTRACTION UTILITIES
// Supports Presets Synthesizer & MP3/WAV/Video Audio Extraction
// ========================================================

export interface CustomAlarmSound {
  id: string;
  name: string;
  sourceType: 'audio' | 'video_extracted';
  dataUrl: string;
  duration: number; // in seconds
  createdAt: number;
  originalFileName?: string;
  fileSizeText?: string;
}

export interface AlarmTonePreset {
  id: string;
  name: string;
  description: string;
  tag: string;
}

export const ALARM_TONE_PRESETS: AlarmTonePreset[] = [
  {
    id: 'chime',
    name: 'Giai Điệu Vplay (Melody Chime)',
    description: 'Hợp âm chuông trong trẻo, du dương khởi đầu ngày mới',
    tag: 'Mặc định'
  },
  {
    id: 'digital',
    name: 'Kỹ Thuật Số (Digital Beep)',
    description: 'Tiếng bíp xung điện tử kinh điển, dứt khoát',
    tag: 'Cổ điển'
  },
  {
    id: 'scifi',
    name: 'Xung Nhịp Vũ Trụ (Cosmic Sci-Fi)',
    description: 'Tần số quét không gian tương lai đa tầng',
    tag: 'Khoa học'
  },
  {
    id: 'zen',
    name: 'Chuông Thiền (Zen Peaceful Gong)',
    description: 'Âm chuông đồng sâu lắng thanh lọc tâm trí',
    tag: 'Thư giãn'
  },
  {
    id: 'siren',
    name: 'Còi Báo Động (High Alert Siren)',
    description: 'Âm thanh cấp thiết độ lớn cao, đánh thức tức thì',
    tag: 'Khẩn cấp'
  },
  {
    id: 'synth',
    name: 'Cyber Synth Arpeggio',
    description: 'Riff nhạc điện tử Synthwave hiện đại tràn đầy năng lượng',
    tag: 'Năng động'
  },
];

// Encodes an AudioBuffer to standard 16-bit PCM WAV Blob
export function audioBufferToWavBlob(buffer: AudioBuffer, maxDurationSeconds = 60): Blob {
  const duration = Math.min(buffer.duration, maxDurationSeconds);
  const sampleRate = Math.min(buffer.sampleRate, 44100);
  const numChannels = Math.min(buffer.numberOfChannels, 2);
  const numSamples = Math.floor(duration * sampleRate);
  
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = numSamples * blockAlign;
  const bufferLength = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16-bit samples

  // data chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // PCM Interleaved Quantization
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  const ratio = buffer.sampleRate / sampleRate;
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const srcIndex = Math.floor(i * ratio);
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][srcIndex] || 0));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Extracts audio from Audio (MP3/WAV/OGG/AAC) or Video (MP4/WebM/MOV/MKV)
export async function extractAudioFromFile(file: File): Promise<{
  dataUrl: string;
  duration: number;
  sourceType: 'audio' | 'video_extracted';
  name: string;
  fileSizeText: string;
}> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);
  const sourceType = isVideo ? 'video_extracted' : 'audio';
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const fileSizeText = `${sizeMb} MB`;
  const cleanName = file.name.replace(/\.[^/.]+$/, '');

  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) {
    const directDataUrl = await blobToDataUrl(file);
    return {
      dataUrl: directDataUrl,
      duration: 10,
      sourceType,
      name: cleanName,
      fileSizeText
    };
  }

  // 1. Web Audio decoding (Native support for video containers & audio codecs)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tempCtx = new AudioCtxClass();
    const decodedBuffer = await tempCtx.decodeAudioData(arrayBuffer.slice(0));
    const wavBlob = audioBufferToWavBlob(decodedBuffer, 60);
    const dataUrl = await blobToDataUrl(wavBlob);
    try { tempCtx.close(); } catch {}

    return {
      dataUrl,
      duration: Math.min(decodedBuffer.duration, 60),
      sourceType,
      name: cleanName,
      fileSizeText
    };
  } catch (decodeErr) {
    console.warn('Direct decodeAudioData attempt failed, applying direct DataURL fallback:', decodeErr);
  }

  // 2. Fallback to direct file data URL
  const dataUrl = await blobToDataUrl(file);
  return {
    dataUrl,
    duration: 15,
    sourceType,
    name: cleanName,
    fileSizeText
  };
}

export class ClockAudioEngine {
  private ctx: AudioContext | null = null;
  private alarmInterval: number | null = null;
  private previewTimer: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private previewAudio: HTMLAudioElement | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Mechanical tick sound
  playTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.015);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.015);
    } catch {}
  }

  // Clean button / lap beep
  playBeep(freq = 880, duration = 0.08) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  // Timer complete fanfare chime
  playTimerComplete() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch {}
  }

  // Synthesize Tone: Melody Chime
  private playBurstChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chords = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.52);
      });
    } catch {}
  }

  // Synthesize Tone: Digital Beep
  private playBurstDigital() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.14, 0.28, 0.42].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + offset;
        const freq = idx % 2 === 0 ? 880 : 1240;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch {}
  }

  // Synthesize Tone: Cosmic Sci-Fi
  private playBurstScifi() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.35);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
    } catch {}
  }

  // Synthesize Tone: Zen Peaceful Gong
  private playBurstZen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [220, 440, 660, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const volume = idx === 0 ? 0.22 : 0.08 / (idx + 1);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      });
    } catch {}
  }

  // Synthesize Tone: High Alert Siren
  private playBurstSiren() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(1300, now + 0.2);
      osc.frequency.linearRampToValueAtTime(700, now + 0.4);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  }

  // Synthesize Tone: Cyber Synth Arpeggio
  private playBurstSynth() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [349.23, 440.00, 523.25, 659.25, 783.99]; // F4, A4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    } catch {}
  }

  // Plays a single burst of the given preset
  private playToneBurst(toneId: string) {
    switch (toneId) {
      case 'digital':
        this.playBurstDigital();
        break;
      case 'scifi':
        this.playBurstScifi();
        break;
      case 'zen':
        this.playBurstZen();
        break;
      case 'siren':
        this.playBurstSiren();
        break;
      case 'synth':
        this.playBurstSynth();
        break;
      case 'chime':
      default:
        this.playBurstChime();
        break;
    }
  }

  // Main alarm ringing loop: plays custom sound (loop) or synthesized preset
  public startAlarmRinging(toneId = 'chime', customSounds: CustomAlarmSound[] = []) {
    this.stopAlarmRinging();
    this.stopPreview();

    // Check if toneId is a custom sound
    const custom = customSounds.find((s) => s.id === toneId);
    if (custom && custom.dataUrl) {
      try {
        const audio = new Audio(custom.dataUrl);
        audio.loop = true;
        audio.volume = 1.0;
        audio.play().catch((err) => {
          console.warn('Failed to play custom audio file, falling back to preset chime:', err);
          this.playBurstChime();
          this.alarmInterval = window.setInterval(() => this.playBurstChime(), 1400);
        });
        this.customAudio = audio;
        return;
      } catch (err) {
        console.error('Custom audio initiation failed:', err);
      }
    }

    // Otherwise, play preset tone on interval
    this.playToneBurst(toneId);
    const intervalMs = toneId === 'zen' ? 2200 : toneId === 'siren' ? 900 : 1400;
    this.alarmInterval = window.setInterval(() => {
      this.playToneBurst(toneId);
    }, intervalMs);
  }

  // Preview sound for 4 seconds
  public previewSound(toneId: string, customSounds: CustomAlarmSound[] = [], onEnded?: () => void) {
    this.stopPreview();

    const custom = customSounds.find((s) => s.id === toneId);
    if (custom && custom.dataUrl) {
      try {
        const audio = new Audio(custom.dataUrl);
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.play().catch(console.error);
        this.previewAudio = audio;

        this.previewTimer = window.setTimeout(() => {
          this.stopPreview();
          onEnded?.();
        }, 4500);
        return;
      } catch (err) {
        console.error('Failed to preview custom sound:', err);
      }
    }

    // Preset sound preview: play 2 bursts
    this.playToneBurst(toneId);
    const t2 = toneId === 'zen' ? 1800 : 1200;
    setTimeout(() => {
      this.playToneBurst(toneId);
    }, t2);

    this.previewTimer = window.setTimeout(() => {
      this.stopPreview();
      onEnded?.();
    }, 3800);
  }

  public stopPreview() {
    if (this.previewTimer) {
      clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio.currentTime = 0;
      this.previewAudio = null;
    }
  }

  public stopAlarmRinging() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
      this.customAudio = null;
    }
    this.stopPreview();
  }
}

export const clockAudio = new ClockAudioEngine();
