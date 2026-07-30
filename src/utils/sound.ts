// Web Audio API pop sound generator for UI button press feedback
let sharedAudioCtx: AudioContext | null = null;
let lastPlayTime = 0;

export const playPopSound = () => {
  try {
    const nowTime = Date.now();
    // Cooldown of 80ms prevents double sound on mousedown + click/mouseup events
    if (nowTime - lastPlayTime < 80) {
      return;
    }
    lastPlayTime = nowTime;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pleasant pop sound frequency drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

    // Quick envelope
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    // Audio Context not allowed or blocked by browser policy until gesture
  }
};
