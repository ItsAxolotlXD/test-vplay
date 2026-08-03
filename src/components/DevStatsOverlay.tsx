import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DevStatsOverlayProps {
  showFps?: boolean;
  showFrameLatency?: boolean;
}

export const DevStatsOverlay: React.FC<DevStatsOverlayProps> = ({
  showFps,
  showFrameLatency,
}) => {
  const [fps, setFps] = useState<number>(60);
  const [latency, setLatency] = useState<number>(16.7);

  useEffect(() => {
    if (!showFps && !showFrameLatency) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 300) {
        const measuredFps = Math.min(60, Math.max(1, Math.round((frameCount * 1000) / delta)));
        const measuredLatency = +(1000 / measuredFps).toFixed(1);
        setFps(measuredFps);
        setLatency(measuredLatency);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showFps, showFrameLatency]);

  if (!showFps && !showFrameLatency) return null;

  return createPortal(
    <div className="fixed top-3 left-3 z-[9999999] pointer-events-none select-none flex flex-col gap-1.5 font-mono text-xs">
      {showFps && (
        <div className="bg-[#121416]/90 text-white border-2 border-[#141414] px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#55b331] animate-pulse" />
          <span className="text-zinc-400 text-[10px] font-bold">FPS:</span>
          <span className="text-[#55b331] font-extrabold text-xs">{fps} FPS</span>
        </div>
      )}

      {showFrameLatency && (
        <div className="bg-[#121416]/90 text-white border-2 border-[#141414] px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-400 text-[10px] font-bold">FRAME LATENCY:</span>
          <span className="text-cyan-400 font-extrabold text-xs">{latency} ms</span>
        </div>
      )}
    </div>,
    document.body
  );
};
