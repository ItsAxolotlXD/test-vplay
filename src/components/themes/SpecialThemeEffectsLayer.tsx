import React, { useEffect, useRef } from 'react';
import { useSpecialTheme } from '../../hooks/useSpecialTheme';
import { Sparkles, Heart, Star } from 'lucide-react';

export const SpecialThemeEffectsLayer: React.FC = () => {
  const { activeTheme, currentThemeData, isSpecialActive, resetToDefault } = useSpecialTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas animation for dynamic particles (fireworks, falling petals, falling snow, golden stars)
  useEffect(() => {
    if (!isSpecialActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. TẾT DƯƠNG LỊCH: FIREWORKS & SPARKS
    // ==========================================
    interface FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;
    }
    interface FireworkRocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
    }

    let fireworkParticles: FireworkParticle[] = [];
    let fireworkRockets: FireworkRocket[] = [];
    const fwColors = ['#00F0FF', '#FF007A', '#FFD700', '#7000FF', '#00FF66', '#FFFFFF', '#FF3B30'];

    // Twinkling stars for New Year
    interface TwinkleStar {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
    }
    const twinkleStars: TwinkleStar[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      size: Math.random() * 2 + 1,
      alpha: Math.random(),
      speed: 0.02 + Math.random() * 0.03,
    }));

    const launchRocket = () => {
      if (activeTheme !== 'new-year') return;
      fireworkRockets.push({
        x: width * 0.15 + Math.random() * (width * 0.7),
        y: height,
        targetY: height * 0.12 + Math.random() * (height * 0.4),
        vy: -(8 + Math.random() * 6),
        color: fwColors[Math.floor(Math.random() * fwColors.length)],
      });
    };

    const explodeRocket = (x: number, y: number, color: string) => {
      const particleCount = 48 + Math.floor(Math.random() * 24);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.2 - 0.1);
        const speed = 2 + Math.random() * 5.5;
        fireworkParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.015,
          color,
          size: 2.2 + Math.random() * 2,
        });
      }
    };

    // ==========================================
    // 2. TẾT NGUYÊN ĐÁN: MAI & ĐÀO PETALS
    // ==========================================
    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      type: 'mai' | 'dao'; // mai vàng hoặc đào hồng
    }
    const petals: Petal[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 7 + Math.random() * 9,
      speedY: 1 + Math.random() * 1.6,
      speedX: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      type: Math.random() > 0.45 ? 'mai' : 'dao',
    }));

    // ==========================================
    // 3. CHRISTMAS: FALLING SNOW
    // ==========================================
    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
    }
    const snowflakes: Snowflake[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 3.2,
      speedY: 0.8 + Math.random() * 1.8,
      speedX: (Math.random() - 0.5) * 0.8,
      alpha: 0.3 + Math.random() * 0.7,
    }));

    // ==========================================
    // 4. YÊU NƯỚC: FLOATING GOLDEN STARS & EMBERS
    // ==========================================
    interface GoldenSpark {
      x: number;
      y: number;
      size: number;
      vy: number;
      vx: number;
      alpha: number;
      pulseSpeed: number;
    }
    const goldenSparks: GoldenSpark[] = Array.from({ length: 36 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 4,
      vy: -(0.5 + Math.random() * 1.2),
      vx: (Math.random() - 0.5) * 0.6,
      alpha: 0.2 + Math.random() * 0.8,
      pulseSpeed: 0.03 + Math.random() * 0.04,
    }));

    let lastRocketTime = 0;

    // RENDER LOOP
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // --- THEME: NEW YEAR (Tết Dương Lịch) ---
      if (activeTheme === 'new-year') {
        // Twinkling stars
        twinkleStars.forEach((star) => {
          star.alpha += star.speed;
          if (star.alpha > 1 || star.alpha < 0.1) star.speed = -star.speed;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, star.alpha))})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00F0FF';
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Auto launch rockets periodically
        if (time - lastRocketTime > 1400) {
          launchRocket();
          if (Math.random() > 0.5) launchRocket();
          lastRocketTime = time;
        }

        // Draw and update rockets
        for (let i = fireworkRockets.length - 1; i >= 0; i--) {
          const r = fireworkRockets[i];
          r.y += r.vy;

          // Trail
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = r.color;
          ctx.fill();

          if (r.y <= r.targetY) {
            explodeRocket(r.x, r.y, r.color);
            fireworkRockets.splice(i, 1);
          }
        }

        // Draw and update explosion particles
        for (let i = fireworkParticles.length - 1; i >= 0; i--) {
          const p = fireworkParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // gravity
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            fireworkParticles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // --- THEME: LUNAR NEW YEAR (Tết Nguyên Đán) ---
      else if (activeTheme === 'lunar-new-year') {
        petals.forEach((petal) => {
          petal.y += petal.speedY;
          petal.x += Math.sin(petal.y * 0.02) * 1.2 + petal.speedX;
          petal.rotation += petal.rotSpeed;

          if (petal.y > height + 20) {
            petal.y = -20;
            petal.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rotation);

          // Draw blossom petal (oval/heart shape)
          ctx.beginPath();
          ctx.ellipse(0, 0, petal.size, petal.size * 0.65, 0, 0, Math.PI * 2);
          if (petal.type === 'mai') {
            // Mai vàng
            ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#FFB800';
          } else {
            // Đào hồng
            ctx.fillStyle = 'rgba(255, 130, 160, 0.85)';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#FF6B8B';
          }
          ctx.fill();
          ctx.restore();
        });
        ctx.shadowBlur = 0;
      }

      // --- THEME: CHRISTMAS (Giáng Sinh) ---
      else if (activeTheme === 'christmas') {
        snowflakes.forEach((flake) => {
          flake.y += flake.speedY;
          flake.x += Math.sin(flake.y * 0.015) * 0.8 + flake.speedX;

          if (flake.y > height + 10) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(224, 242, 254, 0.8)';
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }

      // --- THEME: PATRIOTIC (Yêu Nước) ---
      else if (activeTheme === 'patriotic') {
        goldenSparks.forEach((spark) => {
          spark.y += spark.vy;
          spark.x += spark.vx;
          spark.alpha += spark.pulseSpeed;
          if (spark.alpha > 0.95 || spark.alpha < 0.2) spark.pulseSpeed = -spark.pulseSpeed;

          if (spark.y < -20) {
            spark.y = height + 20;
            spark.x = Math.random() * width;
          }

          ctx.beginPath();
          // Draw mini 5-point star
          const spikes = 5;
          const outerRadius = spark.size;
          const innerRadius = spark.size / 2;
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / spikes;

          ctx.save();
          ctx.translate(spark.x, spark.y);
          ctx.beginPath();
          ctx.moveTo(0, -outerRadius);
          for (let i = 0; i < spikes; i++) {
            let x = Math.cos(rot) * outerRadius;
            let y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(0, -outerRadius);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 223, 0, ${Math.max(0.15, Math.min(1, spark.alpha))})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFD700';
          ctx.fill();
          ctx.restore();
        });
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTheme, isSpecialActive]);

  if (!isSpecialActive) return null;

  return (
    <div
      id="vplay-special-theme-layer"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none transition-all duration-700"
    >
      {/* 1. Theme-specific atmospheric backdrop gradient overlay */}
      {activeTheme === 'new-year' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B1C]/50 via-transparent to-[#040814]/70" />
      )}
      {activeTheme === 'lunar-new-year' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A0000]/40 via-transparent to-[#330000]/50" />
      )}
      {activeTheme === 'christmas' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2016]/45 via-transparent to-[#1C0505]/40" />
      )}
      {activeTheme === 'patriotic' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#550000]/45 via-transparent to-[#380000]/50" />
      )}

      {/* 2. Real-time Canvas Particles (Fireworks, Petals, Snowflakes, Golden Stars) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 3. TẾT NGUYÊN ĐÁN CORNER ORNAMENTS (Cành đào & Cành mai & Lồng đèn) */}
      {activeTheme === 'lunar-new-year' && (
        <>
          {/* Cành đào hồng Bắc Bộ (Góc trên bên trái) */}
          <div className="absolute -top-4 -left-4 w-44 sm:w-64 md:w-76 pointer-events-none filter drop-shadow-[0_4px_12px_rgba(255,107,139,0.4)] animate-pulse duration-1000">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              {/* Branch */}
              <path
                d="M 5 10 Q 50 40 85 45 T 140 70 T 190 90"
                stroke="#5D3A1A"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 55 42 Q 70 85 110 110"
                stroke="#5D3A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 90 48 Q 120 25 155 35"
                stroke="#5D3A1A"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Peach Blossoms (Hoa đào phai) */}
              {[
                { cx: 35, cy: 30, r: 9 },
                { cx: 65, cy: 45, r: 11 },
                { cx: 88, cy: 38, r: 10 },
                { cx: 115, cy: 62, r: 12 },
                { cx: 140, cy: 72, r: 10 },
                { cx: 175, cy: 88, r: 11 },
                { cx: 80, cy: 85, r: 10 },
                { cx: 105, cy: 108, r: 11 },
                { cx: 130, cy: 32, r: 9 },
                { cx: 155, cy: 36, r: 10 },
              ].map((blossom, i) => (
                <g key={i}>
                  {/* Petals */}
                  <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r} fill="#FF8DA1" opacity="0.95" />
                  <circle cx={blossom.cx - 4} cy={blossom.cy} r={blossom.r * 0.7} fill="#FF5E7E" />
                  <circle cx={blossom.cx + 4} cy={blossom.cy} r={blossom.r * 0.7} fill="#FF5E7E" />
                  <circle cx={blossom.cx} cy={blossom.cy - 4} r={blossom.r * 0.7} fill="#FF708F" />
                  <circle cx={blossom.cx} cy={blossom.cy + 4} r={blossom.r * 0.7} fill="#FF708F" />
                  {/* Stamen (Nhị hoa vàng) */}
                  <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r * 0.3} fill="#FFE600" />
                </g>
              ))}
            </svg>
          </div>

          {/* Cành mai vàng Nam Bộ (Góc trên bên phải) */}
          <div className="absolute -top-4 -right-4 w-44 sm:w-64 md:w-76 pointer-events-none filter drop-shadow-[0_4px_14px_rgba(255,215,0,0.5)]">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              {/* Branch */}
              <path
                d="M 195 10 Q 150 40 115 45 T 60 70 T 10 90"
                stroke="#5D3A1A"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 145 42 Q 130 85 90 110"
                stroke="#5D3A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 110 48 Q 80 25 45 35"
                stroke="#5D3A1A"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Mai Blossoms (Hoa mai vàng 5 cánh) */}
              {[
                { cx: 165, cy: 30, r: 9 },
                { cx: 135, cy: 45, r: 11 },
                { cx: 112, cy: 38, r: 10 },
                { cx: 85, cy: 62, r: 12 },
                { cx: 60, cy: 72, r: 10 },
                { cx: 25, cy: 88, r: 11 },
                { cx: 120, cy: 85, r: 10 },
                { cx: 95, cy: 108, r: 11 },
                { cx: 70, cy: 32, r: 9 },
                { cx: 45, cy: 36, r: 10 },
              ].map((blossom, i) => (
                <g key={i}>
                  <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r} fill="#FFD700" opacity="0.95" />
                  <circle cx={blossom.cx - 4} cy={blossom.cy} r={blossom.r * 0.7} fill="#FFC000" />
                  <circle cx={blossom.cx + 4} cy={blossom.cy} r={blossom.r * 0.7} fill="#FFC000" />
                  <circle cx={blossom.cx} cy={blossom.cy - 4} r={blossom.r * 0.7} fill="#FFB000" />
                  <circle cx={blossom.cx} cy={blossom.cy + 4} r={blossom.r * 0.7} fill="#FFB000" />
                  {/* Nhị hoa đỏ cam */}
                  <circle cx={blossom.cx} cy={blossom.cy} r={blossom.r * 0.3} fill="#FF4500" />
                </g>
              ))}
            </svg>
          </div>

          {/* Lồng đèn đỏ Tết đung đưa */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 pointer-events-none hidden md:block animate-bounce duration-1000">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-10 bg-amber-400" />
              <div className="w-8 h-10 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 border border-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.7)] flex items-center justify-center">
                <span className="text-amber-300 text-[9px] font-bold">XUÂN</span>
              </div>
              <div className="w-1.5 h-4 bg-amber-400 rounded-b" />
            </div>
          </div>
        </>
      )}

      {/* 4. CHRISTMAS: CHRISTMAS LED FAIRY LIGHTS STRING ACROSS TOP */}
      {activeTheme === 'christmas' && (
        <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none overflow-visible">
          <svg className="w-full h-10 overflow-visible" preserveAspectRatio="none">
            <path
              d="M 0 5 Q 100 25 200 5 Q 300 25 400 5 Q 500 25 600 5 Q 700 25 800 5 Q 900 25 1000 5 Q 1100 25 1200 5 Q 1300 25 1400 5 Q 1500 25 1600 5 Q 1700 25 1800 5 Q 1900 25 2000 5"
              fill="none"
              stroke="#1C3829"
              strokeWidth="2"
            />
          </svg>

          {/* Glowing LED Bulbs */}
          <div className="absolute inset-0 flex justify-around items-start px-2">
            {[
              { color: '#EF4444', shadow: '#EF4444', delay: '0s' },
              { color: '#22C55E', shadow: '#22C55E', delay: '0.3s' },
              { color: '#FACC15', shadow: '#FACC15', delay: '0.6s' },
              { color: '#3B82F6', shadow: '#3B82F6', delay: '0.9s' },
              { color: '#EC4899', shadow: '#EC4899', delay: '1.2s' },
              { color: '#06B6D4', shadow: '#06B6D4', delay: '0.4s' },
              { color: '#EF4444', shadow: '#EF4444', delay: '0.7s' },
              { color: '#22C55E', shadow: '#22C55E', delay: '1.0s' },
              { color: '#FACC15', shadow: '#FACC15', delay: '0.2s' },
              { color: '#3B82F6', shadow: '#3B82F6', delay: '0.8s' },
              { color: '#EC4899', shadow: '#EC4899', delay: '1.4s' },
              { color: '#22C55E', shadow: '#22C55E', delay: '0.5s' },
              { color: '#EF4444', shadow: '#EF4444', delay: '1.1s' },
              { color: '#FACC15', shadow: '#FACC15', delay: '0.7s' },
            ].map((bulb, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center"
                style={{
                  animation: `pulse 1.8s infinite ease-in-out ${bulb.delay}`,
                }}
              >
                <div className="w-1 h-2 bg-[#2D4739]" />
                <div
                  className="w-3.5 h-4.5 rounded-full shadow-lg"
                  style={{
                    backgroundColor: bulb.color,
                    boxShadow: `0 0 14px ${bulb.shadow}, 0 0 4px #FFFFFF`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PATRIOTIC (YÊU NƯỚC): CỜ ĐỎ SAO VÀNG & TRỐNG ĐỒNG ĐÔNG SƠN */}
      {activeTheme === 'patriotic' && (
        <>
          {/* Trống Đồng Đông Sơn Watermark (Họa tiết chìm uy nghiêm) */}
          <div className="absolute right-[-120px] bottom-[-120px] md:right-[-60px] md:bottom-[-60px] w-[380px] sm:w-[480px] md:w-[600px] h-[380px] sm:h-[480px] md:h-[600px] opacity-[0.07] pointer-events-none">
            <svg viewBox="0 0 500 500" fill="none" stroke="#FFD700" strokeWidth="2.5" className="w-full h-full animate-[spin_120s_linear_infinite]">
              {/* Sun star at center */}
              <circle cx="250" cy="250" r="30" fill="#FFD700" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="250"
                  y1="250"
                  x2={250 + Math.cos((deg * Math.PI) / 180) * 70}
                  y2={250 + Math.sin((deg * Math.PI) / 180) * 70}
                  strokeWidth="3.5"
                />
              ))}
              <circle cx="250" cy="250" r="80" strokeDasharray="6 6" />
              <circle cx="250" cy="250" r="130" strokeWidth="4" />
              <circle cx="250" cy="250" r="180" strokeDasharray="10 8" />
              <circle cx="250" cy="250" r="230" strokeWidth="5" />
            </svg>
          </div>

          {/* Lá Cờ Đỏ Sao Vàng bay phấp phới tự hào ở góc trên bên phải */}
          <div className="absolute top-2 right-4 sm:right-8 z-40 pointer-events-auto flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-red-700/90 via-red-600/90 to-red-700/90 border border-yellow-400/50 shadow-[0_4px_20px_rgba(220,38,38,0.5)] backdrop-blur-md">
              {/* Vietnam Flag Badge */}
              <div className="w-7 h-5 rounded bg-[#DA251D] border border-yellow-400/80 flex items-center justify-center shadow-md relative overflow-hidden">
                {/* 5-point yellow star */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#FFFF00] filter drop-shadow-[0_0_2px_rgba(0,0,0,0.4)]">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[11px] font-black tracking-wider text-yellow-300 uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Tôi Yêu Việt Nam
                </span>
                <span className="text-[9px] font-bold text-white/90 leading-tight">
                  Tự Hào Tổ Quốc
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Theme Active Indicator with Quick Reset (Bottom right) */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/20 shadow-xl backdrop-blur-md text-xs">
          <div
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: currentThemeData?.accentColor || '#E6005A' }}
          />
          <span className="text-zinc-300 font-medium">
            Theme: <strong className="text-white font-bold">{currentThemeData?.name}</strong>
          </span>
          <button
            type="button"
            onClick={resetToDefault}
            className="ml-1.5 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-zinc-300 hover:text-white font-semibold transition-colors cursor-pointer"
            title="Trở về giao diện gốc Vplay"
          >
            Đổi lại
          </button>
        </div>
      </div>
    </div>
  );
};
