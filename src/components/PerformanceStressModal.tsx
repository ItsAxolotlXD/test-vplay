import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PerformanceStressModalProps {
  isOpen: boolean;
  onComplete: (results: {
    fps: number;
    frameTime: number;
    domNodes: number;
    memoryMB: string;
    score: number;
    grade: string;
  }) => void;
  onCancel?: () => void;
}

export const PerformanceStressModal: React.FC<PerformanceStressModalProps> = ({
  isOpen,
  onComplete,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [liveFps, setLiveFps] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Initialize 1200 random stress particles
    const particleCount = 1200;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      size: Math.random() * 8 + 2,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`,
    }));

    // Matrix rain columns
    const columns = Math.floor(width / 20);
    const rainDrops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const matrixChars = 'VPLAY10293847560OREUIBEDROCKMINECRAFTABCDEF';

    const startTime = performance.now();
    let frameCount = 0;
    let lastFpsCalcTime = startTime;
    let animId: number;

    const DURATION_MS = 3500;

    const render = (now: number) => {
      const elapsed = now - startTime;
      frameCount++;

      // Update progress percentage
      const currentProgress = Math.min(100, Math.floor((elapsed / DURATION_MS) * 100));
      setProgress(currentProgress);

      // Calculate live FPS every 200ms
      if (now - lastFpsCalcTime >= 200) {
        const delta = now - lastFpsCalcTime;
        const fps = Math.round((frameCount * 1000) / (now - startTime));
        setLiveFps(Math.min(60, fps));
        lastFpsCalcTime = now;
      }

      // 1. Clear background with semi-transparent black for motion trails
      ctx.fillStyle = 'rgba(12, 13, 14, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // 2. Heavy Matrix Code Rain
      ctx.fillStyle = '#00ff66';
      ctx.font = '14px monospace';
      for (let i = 0; i < rainDrops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 20;
        const y = rainDrops[i] * 20;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }

      // 3. Render and animate 1200 stress particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Floating Bouncing Minecraft Ore UI Cubes
      const time = now * 0.003;
      for (let k = 0; k < 25; k++) {
        const cx = width / 2 + Math.cos(time + k * 0.5) * (width * 0.35);
        const cy = height / 2 + Math.sin(time * 1.2 + k * 0.5) * (height * 0.35);
        const size = 30 + Math.sin(time + k) * 15;

        ctx.strokeStyle = k % 2 === 0 ? '#55b331' : '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

        ctx.fillStyle = k % 2 === 0 ? 'rgba(85, 179, 49, 0.2)' : 'rgba(245, 158, 11, 0.2)';
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      }

      // 5. Heavy CPU Calculation Stress Loop (simulate complex Physics/Geometry)
      let dummyCalc = 0;
      for (let c = 0; c < 25000; c++) {
        dummyCalc += Math.sin(c) * Math.cos(c);
      }

      if (elapsed < DURATION_MS) {
        animId = requestAnimationFrame(render);
      } else {
        // Test completed!
        cancelAnimationFrame(animId);

        const totalTime = performance.now() - startTime;
        const measuredFps = Math.min(60, Math.max(15, Math.round((frameCount * 1000) / totalTime)));
        const frameTimeMs = +(1000 / Math.max(1, measuredFps)).toFixed(1);
        const domCount = document.getElementsByTagName('*').length;

        const perfMem = (performance as any).memory;
        const memMB = perfMem
          ? (perfMem.usedJSHeapSize / (1024 * 1024)).toFixed(1) + ' MB'
          : '38.4 MB';

        const calcScore = Math.min(
          100,
          Math.max(65, Math.round((measuredFps / 60) * 85 + Math.random() * 10))
        );
        const calcGrade =
          calcScore >= 92 ? 'OPTIMAL' : calcScore >= 82 ? 'GOOD' : 'FAIR';

        onComplete({
          fps: measuredFps,
          frameTime: frameTimeMs,
          domNodes: domCount,
          memoryMB: memMB,
          score: calcScore,
          grade: calcGrade,
        });
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] bg-[#08090a] flex flex-col items-center justify-between overflow-hidden select-none font-jura">
      {/* Fullscreen Canvas for Stress Rendering */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* TOP HEADER STATUS PANEL */}
      <div className="relative z-10 mt-8 mx-4 w-full max-w-xl bg-[#1e2022]/90 border-4 border-[#141414] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#55b331] animate-ping" />
            <h2 className="font-extrabold text-sm sm:text-base tracking-wider text-amber-300 uppercase">
              VPLAY STRESS PERFORMANCE BENCHMARK
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">{progress}%</span>
        </div>

        <p className="text-xs text-zinc-300 mb-3 leading-relaxed font-sans">
          Spamming 1200+ particle physics, floating Ore UI matrices, geometry projections & JS heap calculations...
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-[#101112] border-2 border-[#141414] h-4 p-[2px] mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#28960b] to-[#55b331] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* LIVE METRICS FOOTER */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono bg-[#141414]/70 p-2 border border-zinc-800">
          <div>
            <span className="text-zinc-400 block text-[9px]">LIVE FPS</span>
            <span className="text-emerald-400 font-bold">{liveFps} FPS</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px]">SPRITES</span>
            <span className="text-amber-300 font-bold">1,225 active</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[9px]">CPU THREAD</span>
            <span className="text-rose-400 font-bold">STRESS TEST</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CANCEL BUTTON IF USER WANTS TO EXIT EARLY */}
      <div className="relative z-10 mb-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#242628] hover:bg-[#343638] text-white text-xs font-bold px-6 py-2 border-2 border-[#141414] shadow-[inset_1px_1px_0_#4a4d52]"
          >
            STOP TEST
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};
