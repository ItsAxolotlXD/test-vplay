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
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isPointerRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      isVisibleRef.current = false;
      document.documentElement.classList.remove('vplay-custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('vplay-custom-cursor-active');

    let rafId: number | null = null;
    let latestX = -100;
    let latestY = -100;

    const renderPosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
      }
      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Discard pure touch events on phones/tablets
      if (e.pointerType === 'touch') {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
        return;
      }

      latestX = e.clientX;
      latestY = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Schedule transform update on animation frame without blocking
      if (rafId === null) {
        rafId = requestAnimationFrame(renderPosition);
      }

      // Efficiently check if hovering interactive element using event target directly
      // Avoids expensive document.elementFromPoint layout reflows!
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest?.(
            'button, a, input, select, textarea, [role="button"], [role="link"], .cursor-pointer, [data-clickable="true"]'
          )
        );
        if (interactive !== isPointerRef.current) {
          isPointerRef.current = interactive;
          setIsPointer(interactive);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handlePointerLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        latestX = e.clientX;
        latestY = e.clientY;
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        if (rafId === null) {
          rafId = requestAnimationFrame(renderPosition);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      document.documentElement.classList.remove('vplay-custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [enabled]);

  if (!enabled || !isVisible) {
    return null;
  }

  // Hotspot offset: tip of macOS arrow is at (1.5, 1.5)
  // When isPointer (hand), hotspot is at fingertip (9.5, 2)
  const hotspotX = isPointer ? -(size * 0.4) : -1.5;
  const hotspotY = isPointer ? -2 : -1.5;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <div
        className="transition-transform duration-75 ease-out origin-top-left"
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
                ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 1px 3px rgba(0,0,0,0.5))`
                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
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
                ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 1px 3px rgba(0,0,0,0.5))`
                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
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
  );
};
