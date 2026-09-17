import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playWinSound } from '../../utils/sound';

interface MotionEffectsLayerProps {
  isEnabled: boolean;
  onToggle?: () => void;
  navigate?: (route: string) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
}

export const MotionEffectsLayer: React.FC<MotionEffectsLayerProps> = ({
  isEnabled
}) => {
  const [motionIntensity] = useState<'smooth' | 'bouncy' | 'extreme'>('bouncy');
  const [particles, setParticles] = useState<Particle[]>([]);

  // Trigger floating particle burst
  const triggerParticleBurst = (originX?: number, originY?: number) => {
    playWinSound();
    const colors = ['#FF267A', '#C83DFF', '#00F0FF', '#FFB800', '#10B981', '#E6005A'];
    const count = 24;
    const startX = originX ?? (window.innerWidth / 2);
    const startY = originY ?? (window.innerHeight / 2);

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 4 + Math.random() * 8;
      return {
        id: Date.now() + i,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 10) + 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });

    setParticles((prev) => [...prev.slice(-30), ...newParticles]);

    // Auto cleanup particles after 1.5s
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  // Click on screen particle ripple (gentle effect)
  useEffect(() => {
    if (!isEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if clicked inside the HUD or buttons
      const target = e.target as HTMLElement;
      if (target.closest('#motion-hud-panel') || target.closest('button') || target.closest('input')) {
        return;
      }

      // Small gentle 4-particle sparkle on background click
      const colors = ['#FF267A', '#00F0FF', '#FFB800', '#C83DFF'];
      const microParticles: Particle[] = Array.from({ length: 4 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 4;
        return {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: colors[i % colors.length],
          size: 6,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
        };
      });

      setParticles((prev) => [...prev.slice(-20), ...microParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !microParticles.some((mp) => mp.id === p.id)));
      }, 800);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isEnabled]);

  return (
    <>
      {/* 1. FLOATING AMBIENT GLOWING ORBS (Active when animation_test is enabled) */}
      {isEnabled && (
        <div 
          className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
          aria-hidden="true"
        >
          {/* Top Left Rose Glow Orb */}
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.25, 0.9, 1],
              opacity: [0.18, 0.28, 0.15, 0.18],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 7 : 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#E6005A] via-[#FF267A] to-transparent blur-3xl"
          />

          {/* Top Right Cyan Glow Orb */}
          <motion.div
            animate={{
              x: [0, -50, 20, 0],
              y: [0, 40, -40, 0],
              scale: [1, 0.85, 1.2, 1],
              opacity: [0.12, 0.22, 0.14, 0.12],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 9 : 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute top-1/4 -right-28 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-500 via-blue-600 to-transparent blur-3xl"
          />

          {/* Bottom Left Purple Glow Orb */}
          <motion.div
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -30, 50, 0],
              scale: [0.95, 1.15, 0.85, 0.95],
              opacity: [0.14, 0.24, 0.16, 0.14],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 8 : 16,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-10 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-transparent blur-3xl"
          />

          {/* Center Amber Accent Orb */}
          <motion.div
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 60, -30, 0],
              scale: [0.8, 1.1, 0.9, 0.8],
              opacity: [0.08, 0.16, 0.1, 0.08],
            }}
            transition={{
              duration: motionIntensity === 'extreme' ? 10 : 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
            className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-transparent blur-3xl"
          />
        </div>
      )}

      {/* 2. DYNAMIC PARTICLE BURST OVERLAY */}
      {isEnabled && particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: p.x,
                y: p.y,
                scale: 0.2,
                opacity: 1,
              }}
              animate={{
                x: p.x + p.vx * 15,
                y: p.y + p.vy * 15 + 40, // gravity fall
                scale: [0.2, 1.2, 0],
                opacity: [1, 0.8, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
              }}
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                boxShadow: `0 0 12px ${p.color}`,
              }}
              className="absolute rounded-full"
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MotionEffectsLayer;
