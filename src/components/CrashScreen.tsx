import React, { useEffect } from 'react';
import { Skull, AlertOctagon, RefreshCw, Radio, Terminal } from 'lucide-react';

interface CrashScreenProps {
  reason: string;
}

export const CrashScreen: React.FC<CrashScreenProps> = ({ reason }) => {
  useEffect(() => {
    // Attempt to synthesize a subtle glitch tone on crash
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}

    // Alter document title to indicate crashed state
    document.title = 'SYSTEM CRASHED - WAVES KERNEL PANIC';
  }, []);

  const handleReboot = () => {
    window.location.reload();
  };

  return (
    <div
      id="system-crash-overlay"
      className="fixed inset-0 z-99999 bg-[#050005] text-[#FF2020] font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Glitch Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-70" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#000000]/60 to-[#000000] pointer-events-none z-10" />

      <div className="max-w-2xl w-full bg-[#0A0508] border-2 border-[#FF2020]/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(255,32,32,0.4)] relative z-20">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#FF2020]/40 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF2020]/20 border border-[#FF2020] flex items-center justify-center text-[#FF2020] animate-pulse">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white flex items-center gap-2">
                CRITICAL_SYSTEM_CRASH
              </h1>
              <p className="text-xs text-[#FF6060]">KERNEL_PANIC // EXECUTION_HALTED</p>
            </div>
          </div>
          <AlertOctagon className="w-8 h-8 text-[#FF2020] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Diagnostic Memory Dump Output */}
        <div className="bg-[#040103] border border-[#FF2020]/30 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-[#FF8080] mb-6 space-y-2 font-mono">
          <p className="text-white font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FF2020]" />
            FATAL REASON: {reason}
          </p>
          <div className="opacity-80 leading-relaxed text-[11px] sm:text-xs">
            <p>&gt; MEMORY_DUMP: 0x0000DEAD 0x190926FA 0x00000000 0xFFFFFFFF</p>
            <p>&gt; STACK_TRACE: WavesKernel.sys at 0x7FFF9200 (Access Denied)</p>
            <p>&gt; BROADCAST ENGINE: Signal aborted by client security subsystem.</p>
            <p>&gt; PROCESS: ReactRenderer thread killed. Connection unrecoverable.</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#D0A0A0] mb-6 leading-relaxed font-sans">
          The application execution was forcefully terminated due to unauthorized access or explicit shutdown request. All network sockets and rendering buffers have been destroyed.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            id="btn-reboot-app"
            onClick={handleReboot}
            className="w-full sm:w-auto py-3 px-6 rounded-full font-bold text-black bg-[#FF2020] hover:bg-[#FF4040] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,32,32,0.5)]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reboot Application</span>
          </button>
          <span className="text-[11px] text-[#805050] font-sans flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#FF4040]" />
            Waves Broadcast Station // Terminal Status: Offline
          </span>
        </div>
      </div>
    </div>
  );
};
