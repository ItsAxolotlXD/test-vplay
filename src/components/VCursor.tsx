import React, { useEffect, useRef, useState } from 'react';

interface VCursorProps {
  enabled?: boolean;
  color?: string;
  borderColor?: string;
  size?: number;
  glow?: boolean;
}

export const VCursor: React.FC<VCursorProps> = ({
  enabled = true,
  color = '#000000',
  borderColor = '#FFFFFF',
  size = 24,
  glow = false,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    let rafId: number;
    let mouseX = -100;
    let mouseY = -100;

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      rafId = requestAnimationFrame(updateCursorPosition);
    };

    rafId = requestAnimationFrame(updateCursorPosition);

    const handlePointerMove = (e: PointerEvent) => {
      // Discard pure touch events so on phones/tablets it doesn't leave an orphan cursor
      if (e.pointerType === 'touch') {
        setIsVisible(false);
        return;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering interactive element
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], [role="link"], .cursor-pointer, [data-clickable="true"]'
        );
        setIsPointer(!!interactive);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsPressed(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 500);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        mouseX = e.clientX;
        mouseY = e.clientY;
        setIsVisible(true);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) {
    return null;
  }

  // Hotspot offset: tip of macOS arrow is at (1.5, 1.5)
  // When isPointer (hand), hotspot is at fingertip (9.5, 2)
  const hotspotX = isPointer ? -(size * 0.4) : -1.5;
  const hotspotY = isPointer ? -2 : -1.5;

  return (
    <>
      {/* Click ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="fixed pointer-events-none z-[999998] rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: r.x,
            top: r.y,
            width: `${size * 1.5}px`,
            height: `${size * 1.5}px`,
            border: `2px solid ${borderColor}`,
            opacity: 0.6,
            animationDuration: '450ms',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          }}
        />
      ))}

      {/* Main Cursor Element */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform select-none transition-opacity duration-150"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="transition-transform duration-100 ease-out origin-top-left"
          style={{
            transform: `translate(${hotspotX}px, ${hotspotY}px) scale(${isPressed ? 0.88 : isPointer ? 1.05 : 1})`,
          }}
        >
          {isPointer ? (
            /* macOS Hand Pointer */
            <svg
              width={size * 1.15}
              height={size * 1.15}
              viewBox="0 0 24 24"
              className="overflow-visible select-none"
              style={{
                filter: glow
                  ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 2px 6px rgba(0,0,0,0.55))`
                  : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
              }}
            >
              <path
                d="M 9.5 2 C 8.7 2 8 2.7 8 3.5 L 8 11.2 L 6.8 9.8 C 6 8.9 4.6 8.9 3.8 9.8 C 3 10.6 3 11.9 3.8 12.8 L 8 17.5 C 9.5 19 11.2 20 13.5 20 L 17 20 C 19.5 20 21.5 18 21.5 15.5 L 21.5 9.5 C 21.5 8.7 20.8 8 20 8 C 19.5 8 19.1 8.2 18.8 8.6 C 18.5 7.8 17.8 7.3 17 7.3 C 16.5 7.3 16 7.5 15.7 7.8 C 15.4 7 14.7 6.5 13.8 6.5 C 13.4 6.5 13 6.6 12.7 6.9 L 12.7 3.5 C 12.7 2.7 12 2 11.1 2 Z"
                fill={color}
                stroke={borderColor}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* macOS Standard Arrow (Đen viền trắng mặc định) */
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className="overflow-visible select-none"
              style={{
                filter: glow
                  ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 2px 6px rgba(0,0,0,0.55))`
                  : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
              }}
            >
              <path
                d="M 1.5 1.5 L 1.5 19.5 L 6.5 15.2 L 10.8 23.2 L 13.8 21.6 L 9.6 13.8 L 16 13.8 Z"
                fill={color}
                stroke={borderColor}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
    </>
  );
};
