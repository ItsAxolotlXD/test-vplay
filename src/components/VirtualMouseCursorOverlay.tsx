import React, { useState, useEffect, useRef } from 'react';

interface VirtualMouseCursorOverlayProps {
  useMouseCursor?: boolean;
  useArrowKeysCursor?: boolean;
}

export const VirtualMouseCursorOverlay: React.FC<VirtualMouseCursorOverlayProps> = ({
  useMouseCursor,
  useArrowKeysCursor,
}) => {
  const isActive = !!(useMouseCursor || useArrowKeysCursor);

  const [cursorPos, setCursorPos] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 300,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
  });
  const [isClicking, setIsClicking] = useState(false);
  const [lastClickPos, setLastClickPos] = useState<{ x: number; y: number } | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [imgSrc, setImgSrc] = useState('https://www.pngarts.com/files/2/Cursor-PNG-Picture.png');

  const prevTouchRef = useRef<{ x: number; y: number } | null>(null);
  const prevMouseRef = useRef<{ x: number; y: number } | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const lastTapTimeRef = useRef<number>(0);
  const cursorPosRef = useRef(cursorPos);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animFrameRef = useRef<number | null>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);

  // Sync ref with state
  useEffect(() => {
    cursorPosRef.current = cursorPos;
  }, [cursorPos]);

  // Unmount / inactive cleanup
  useEffect(() => {
    if (!isActive) {
      document.querySelectorAll('.virtual-hover-active').forEach((el) => {
        el.classList.remove('virtual-hover-active');
      });
      if (hoveredElRef.current) {
        const oldEl = hoveredElRef.current;
        const leaveOpts = { bubbles: true, cancelable: true, view: window, clientX: 0, clientY: 0 };
        oldEl.dispatchEvent(new MouseEvent('mouseleave', leaveOpts));
        oldEl.dispatchEvent(new MouseEvent('mouseout', leaveOpts));
        oldEl.dispatchEvent(new PointerEvent('pointerleave', leaveOpts));
        oldEl.dispatchEvent(new PointerEvent('pointerout', leaveOpts));
        hoveredElRef.current = null;
      }
    }
  }, [isActive]);

  // Handle Hover State on underlying DOM elements when cursor position changes
  useEffect(() => {
    if (!isActive) return;

    const interceptor = document.getElementById('virtual-mouse-touch-interceptor');
    if (interceptor) interceptor.style.pointerEvents = 'none';

    const x = cursorPos.x;
    const y = cursorPos.y;
    const target = document.elementFromPoint(x, y) as HTMLElement | null;

    if (interceptor) interceptor.style.pointerEvents = 'auto';

    const prevEl = hoveredElRef.current;

    if (target !== prevEl) {
      // 1. Leave previous element
      if (prevEl) {
        prevEl.classList.remove('virtual-hover-active');
        const closestPrevClickable = prevEl.closest('button, a, [role="button"], input, select, textarea');
        if (closestPrevClickable) closestPrevClickable.classList.remove('virtual-hover-active');

        const leaveOpts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
        prevEl.dispatchEvent(new MouseEvent('mouseleave', leaveOpts));
        prevEl.dispatchEvent(new MouseEvent('mouseout', leaveOpts));
        prevEl.dispatchEvent(new PointerEvent('pointerleave', leaveOpts));
        prevEl.dispatchEvent(new PointerEvent('pointerout', leaveOpts));
      }

      // Remove class from all elements except current target and its parents
      document.querySelectorAll('.virtual-hover-active').forEach((el) => {
        if (el !== target && !el.contains(target)) {
          el.classList.remove('virtual-hover-active');
        }
      });

      // 2. Enter new element
      hoveredElRef.current = target;

      if (target) {
        target.classList.add('virtual-hover-active');

        const closestClickable = target.closest('button, a, [role="button"], input, select, textarea') as HTMLElement | null;
        if (closestClickable) {
          closestClickable.classList.add('virtual-hover-active');
        }

        const enterOpts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
        target.dispatchEvent(new MouseEvent('mouseenter', enterOpts));
        target.dispatchEvent(new MouseEvent('mouseover', enterOpts));
        target.dispatchEvent(new PointerEvent('pointerenter', enterOpts));
        target.dispatchEvent(new PointerEvent('pointerover', enterOpts));
      }
    } else if (target) {
      const moveOpts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
      target.dispatchEvent(new MouseEvent('mousemove', moveOpts));
      target.dispatchEvent(new PointerEvent('pointermove', moveOpts));
    }
  }, [cursorPos.x, cursorPos.y, isActive]);

  // Click trigger helper
  const triggerClickAt = (x: number, y: number) => {
    setIsClicking(true);
    setLastClickPos({ x, y });
    setTimeout(() => setIsClicking(false), 300);

    const interceptor = document.getElementById('virtual-mouse-touch-interceptor');
    if (interceptor) interceptor.style.pointerEvents = 'none';

    const target = document.elementFromPoint(x, y) as HTMLElement;

    if (interceptor) interceptor.style.pointerEvents = 'auto';

    if (target) {
      const opts = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        button: 0,
      };

      target.dispatchEvent(new PointerEvent('pointerdown', opts));
      target.dispatchEvent(new MouseEvent('mousedown', opts));
      target.dispatchEvent(new PointerEvent('pointerup', opts));
      target.dispatchEvent(new MouseEvent('mouseup', opts));
      target.dispatchEvent(new MouseEvent('click', opts));

      if (typeof target.focus === 'function') {
        target.focus();
      }
    }
  };

  // Keyboard Arrow Keys Listener & Motion Loop
  useEffect(() => {
    if (!useArrowKeysCursor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift', 'Enter', ' '].includes(e.key)) {
        keysPressedRef.current[e.key] = true;
        if (e.key === 'Shift') setIsShiftPressed(true);

        // Enter or Space triggers click
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerClickAt(cursorPosRef.current.x, cursorPosRef.current.y);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift', 'Enter', ' '].includes(e.key)) {
        keysPressedRef.current[e.key] = false;
        if (e.key === 'Shift') setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Continuous smooth motion loop for holding down arrow keys
    const updateMotion = () => {
      const keys = keysPressedRef.current;
      const speed = keys['Shift'] ? 18 : 6;
      let dx = 0;
      let dy = 0;

      if (keys['ArrowLeft']) dx -= speed;
      if (keys['ArrowRight']) dx += speed;
      if (keys['ArrowUp']) dy -= speed;
      if (keys['ArrowDown']) dy += speed;

      if (dx !== 0 || dy !== 0) {
        setCursorPos((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - 5, prev.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 5, prev.y + dy)),
        }));
      }

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [useArrowKeysCursor]);

  // Touch & Mouse Drag / Double-click Interceptor
  useEffect(() => {
    if (!isActive) return;

    // --- TOUCH EVENTS ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        prevTouchRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (useMouseCursor && e.touches.length > 0 && prevTouchRef.current) {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - prevTouchRef.current.x;
        const dy = touch.clientY - prevTouchRef.current.y;

        setCursorPos((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - 5, prev.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 5, prev.y + dy)),
        }));

        prevTouchRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      const timeDiff = now - lastTapTimeRef.current;
      const currentCursor = cursorPosRef.current;

      if (timeDiff < 350 && timeDiff > 40) {
        e.preventDefault();
        triggerClickAt(currentCursor.x, currentCursor.y);
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
      }

      prevTouchRef.current = null;
    };

    // --- MOUSE DESKTOP EVENTS (Hold & Drag, Double Click) ---
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      isMouseDownRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      const timeDiff = now - lastTapTimeRef.current;
      if (timeDiff < 350 && timeDiff > 40) {
        e.preventDefault();
        triggerClickAt(cursorPosRef.current.x, cursorPosRef.current.y);
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (useMouseCursor && isMouseDownRef.current && prevMouseRef.current) {
        e.preventDefault();
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;

        setCursorPos((prev) => ({
          x: Math.max(0, Math.min(window.innerWidth - 5, prev.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 5, prev.y + dy)),
        }));

        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      prevMouseRef.current = null;
    };

    const handleDblClick = (e: MouseEvent) => {
      e.preventDefault();
      triggerClickAt(cursorPosRef.current.x, cursorPosRef.current.y);
    };

    const interceptor = document.getElementById('virtual-mouse-touch-interceptor');
    if (interceptor) {
      // Touch
      interceptor.addEventListener('touchstart', handleTouchStart, { passive: false });
      interceptor.addEventListener('touchmove', handleTouchMove, { passive: false });
      interceptor.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Desktop Mouse
      interceptor.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      interceptor.addEventListener('dblclick', handleDblClick);
    }

    return () => {
      if (interceptor) {
        interceptor.removeEventListener('touchstart', handleTouchStart);
        interceptor.removeEventListener('touchmove', handleTouchMove);
        interceptor.removeEventListener('touchend', handleTouchEnd);

        interceptor.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        interceptor.removeEventListener('dblclick', handleDblClick);
      }
    };
  }, [isActive, useMouseCursor]);

  // D-Pad movement step helper for on-screen buttons
  const moveCursorBy = (dx: number, dy: number) => {
    const multiplier = isShiftPressed ? 3.5 : 1;
    setCursorPos((prev) => ({
      x: Math.max(0, Math.min(window.innerWidth - 5, prev.x + dx * multiplier)),
      y: Math.max(0, Math.min(window.innerHeight - 5, prev.y + dy * multiplier)),
    }));
  };

  if (!isActive) return null;

  return (
    <>
      <style>{`
        .virtual-hover-active {
          filter: brightness(1.2) contrast(1.05) !important;
          outline: 2px solid rgba(52, 211, 153, 0.7) !important;
          outline-offset: -1px !important;
          transition: filter 0.1s ease, outline 0.1s ease !important;
        }
      `}</style>

      {/* Touch & Mouse interceptor layer covering entire screen to disable direct touch/clicks */}
      <div
        id="virtual-mouse-touch-interceptor"
        className="fixed inset-0 z-[999990] touch-none bg-transparent cursor-crosshair select-none"
        style={{ touchAction: 'none' }}
      />

      {/* Floating Info Banner */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[999998] bg-black/85 backdrop-blur-md text-amber-300 border border-amber-500/50 px-3 py-1.5 text-[11px] font-mono rounded shadow-lg pointer-events-none flex items-center gap-2 animate-in fade-in max-w-[90vw] text-center">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        {useArrowKeysCursor ? (
          <span>
            ARROW KEYS MODE: Use Arrow keys to move • Hold SHIFT to speed up ({isShiftPressed ? 'BOOST FAST ⚡' : 'Normal'}) • Double-tap / Double-click / ENTER to click
          </span>
        ) : (
          <span>VIRTUAL MOUSE: Hold & drag to move cursor • Double-click / Double-tap screen to click</span>
        )}
      </div>

      {/* On-screen D-Pad Controls for Arrow Keys Mode */}
      {useArrowKeysCursor && (
        <div className="fixed bottom-6 right-6 z-[999998] flex flex-col items-center gap-1.5 p-2 bg-black/70 backdrop-blur-md border border-zinc-700/60 rounded-xl shadow-2xl select-none">
          <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">Arrow Controls</div>
          {/* UP */}
          <button
            type="button"
            onClick={() => moveCursorBy(0, -25)}
            className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center border border-zinc-600 shadow"
          >
            ▲
          </button>
          {/* LEFT - CLICK - RIGHT */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => moveCursorBy(-25, 0)}
              className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center border border-zinc-600 shadow"
            >
              ◄
            </button>

            {/* CLICK BUTTON */}
            <button
              type="button"
              onClick={() => triggerClickAt(cursorPos.x, cursorPos.y)}
              className="w-11 h-10 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center border border-emerald-400 shadow uppercase"
            >
              CLICK
            </button>

            <button
              type="button"
              onClick={() => moveCursorBy(25, 0)}
              className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center border border-zinc-600 shadow"
            >
              ►
            </button>
          </div>
          {/* DOWN */}
          <button
            type="button"
            onClick={() => moveCursorBy(0, 25)}
            className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-amber-600 text-white font-bold rounded-lg flex items-center justify-center border border-zinc-600 shadow"
          >
            ▼
          </button>

          {/* BOOST SPEED SHIFT TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setIsShiftPressed(!isShiftPressed)}
            className={`w-full py-1 text-[10px] font-bold font-mono rounded border transition-colors ${
              isShiftPressed
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            {isShiftPressed ? 'SHIFT: ON ⚡' : 'SHIFT: OFF'}
          </button>
        </div>
      )}

      {/* Virtual Mouse Cursor Icon */}
      <div
        className="fixed pointer-events-none z-[999999] transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-1px, -1px) ${isClicking ? 'scale(0.85)' : 'scale(1)'}`,
        }}
      >
        <img
          src={imgSrc}
          alt="Virtual Mouse Cursor"
          className="w-7 h-7 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] object-contain"
          onError={() => {
            setImgSrc('https://www.freeiconspng.com/uploads/mouse-cursor-icon-png-2.png');
          }}
        />

        {/* Click ripple animation */}
        {isClicking && lastClickPos && (
          <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-400/30 animate-ping pointer-events-none" />
        )}
      </div>
    </>
  );
};
