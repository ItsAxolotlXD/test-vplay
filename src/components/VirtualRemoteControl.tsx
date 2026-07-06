import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, Power, Monitor, ListCollapse } from "lucide-react";

interface VirtualRemoteControlProps {
  isActive: boolean;
  onDisable: () => void;
  channels?: any[];
  onSelectChannel?: (channel: any) => void;
}

export default function VirtualRemoteControl({ isActive, onDisable, channels = [], onSelectChannel }: VirtualRemoteControlProps) {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [highlighterStyle, setHighlighterStyle] = useState<React.CSSProperties>({ display: "none" });
  const [enteredDigits, setEnteredDigits] = useState<string>("");

  // Get all visible navigable elements in the DOM
  const getNavigableElements = useCallback(() => {
    // Candidates are standard form tags, interactive roles, or elements styled as cursor-pointer
    const selector = 'button, input, select, textarea, a, [role="button"], [role="tab"], .cursor-pointer';
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

    const visible = elements.filter(el => {
      // Exclude virtual remote control container and highlighter itself
      const remote = document.getElementById("virtual-remote-control");
      const highlighter = document.getElementById("remote-highlighter");
      if (remote && (remote === el || remote.contains(el))) return false;
      if (highlighter && (highlighter === el || highlighter.contains(el))) return false;

      // Exclude hidden elements
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
      if (style.pointerEvents === "none") return false;

      // Filter out small spacers
      if (rect.width < 6 || rect.height < 6) return false;

      return true;
    });

    // Deduplicate overlapping bounding boxes (nested components)
    const finalElements: HTMLElement[] = [];
    visible.forEach(el => {
      const rect = el.getBoundingClientRect();
      const duplicate = finalElements.find(other => {
        const otherRect = other.getBoundingClientRect();
        return Math.abs(rect.top - otherRect.top) < 3 &&
               Math.abs(rect.left - otherRect.left) < 3 &&
               Math.abs(rect.width - otherRect.width) < 3 &&
               Math.abs(rect.height - otherRect.height) < 3;
      });
      if (!duplicate) {
        finalElements.push(el);
      }
    });

    return finalElements;
  }, []);

  // Spatial 2D Navigation Engine
  const navigateSpatial = useCallback((direction: "up" | "down" | "left" | "right") => {
    const candidates = getNavigableElements();
    if (candidates.length === 0) return;

    if (!focusedElement) {
      // Focus first element (top-left-most)
      const sorted = [...candidates].sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        if (Math.abs(rectA.top - rectB.top) < 10) {
          return rectA.left - rectB.left;
        }
        return rectA.top - rectB.top;
      });
      if (sorted[0]) {
        setFocusedElement(sorted[0]);
        sorted[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
      return;
    }

    const currentRect = focusedElement.getBoundingClientRect();
    const isValid = candidates.includes(focusedElement) && currentRect.width > 0 && currentRect.height > 0;

    let activeElement = focusedElement;
    let activeRect = currentRect;

    if (!isValid) {
      // Find nearest element to the stale focus point
      let bestDist = Infinity;
      let bestCandidate = candidates[0];
      const lastX = currentRect.left + currentRect.width / 2;
      const lastY = currentRect.top + currentRect.height / 2;

      candidates.forEach(cand => {
        const r = cand.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(cx - lastX, cy - lastY);
        if (dist < bestDist) {
          bestDist = dist;
          bestCandidate = cand;
        }
      });
      setFocusedElement(bestCandidate);
      return;
    }

    const currentCenterX = activeRect.left + activeRect.width / 2;
    const currentCenterY = activeRect.top + activeRect.height / 2;

    let bestCandidate: HTMLElement | null = null;
    let bestScore = Infinity;

    candidates.forEach(candidate => {
      if (candidate === activeElement) return;

      const r = candidate.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = cx - currentCenterX;
      const dy = cy - currentCenterY;

      let isCorrectDirection = false;
      let score = Infinity;

      // Threshold coordinates to decide direction and penalize diagonal variance
      if (direction === "down") {
        if (r.top > activeRect.top + 2) {
          isCorrectDirection = true;
          score = Math.abs(dx) * 2.5 + dy;
        }
      } else if (direction === "up") {
        if (r.bottom < activeRect.bottom - 2) {
          isCorrectDirection = true;
          score = Math.abs(dx) * 2.5 + (-dy);
        }
      } else if (direction === "right") {
        if (r.left > activeRect.left + 2) {
          isCorrectDirection = true;
          score = dx + Math.abs(dy) * 2.5;
        }
      } else if (direction === "left") {
        if (r.right < activeRect.right - 2) {
          isCorrectDirection = true;
          score = (-dx) + Math.abs(dy) * 2.5;
        }
      }

      if (isCorrectDirection && score < bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    });

    if (bestCandidate) {
      setFocusedElement(bestCandidate);
      bestCandidate.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [focusedElement, getNavigableElements]);

  // Click simulation on focused element
  const triggerSelect = useCallback(() => {
    if (!focusedElement) return;
    focusedElement.focus();
    // Enable programmatic bypass in click blocker
    (window as any).__isSimulatingRemoteClick = true;
    focusedElement.click();
    (window as any).__isSimulatingRemoteClick = false;
  }, [focusedElement]);

  // Back button trigger
  const triggerBack = useCallback(() => {
    const backBtn = document.querySelector('[title="Back"], [aria-label="Back"], [title="Close"], .back-btn, button[class*="back"]');
    if (backBtn) {
      (window as any).__isSimulatingRemoteClick = true;
      (backBtn as HTMLElement).click();
      (window as any).__isSimulatingRemoteClick = false;
      return;
    }
    // Default fallback: go home or click home tab if any
    const homeTab = document.querySelector('[id="home"], [data-tab-id="home"]');
    if (homeTab) {
      (window as any).__isSimulatingRemoteClick = true;
      (homeTab as HTMLElement).click();
      (window as any).__isSimulatingRemoteClick = false;
    }
  }, []);

  // Number input and confirmation logic
  const handleNumberInput = useCallback((digit: string) => {
    setEnteredDigits(prev => {
      const next = prev + digit;
      if (next.length > 3) return prev;
      return next;
    });
  }, []);

  const handleClearNumberInput = useCallback(() => {
    setEnteredDigits("");
  }, []);

  const handleNumberOk = useCallback(() => {
    if (enteredDigits.length > 0 && channels && onSelectChannel) {
      const targetNum = enteredDigits.padStart(3, "0");
      const ch = channels.find((c: any) => c.channelNumber === targetNum);
      if (ch) {
        onSelectChannel(ch);
      }
      setEnteredDigits("");
    } else {
      triggerSelect();
    }
  }, [enteredDigits, channels, onSelectChannel, triggerSelect]);

  // Auto-switch channel when 3 digits are fully entered
  useEffect(() => {
    if (enteredDigits.length === 3 && channels && onSelectChannel) {
      const ch = channels.find((c: any) => c.channelNumber === enteredDigits);
      if (ch) {
        onSelectChannel(ch);
      }
      setEnteredDigits("");
    }
  }, [enteredDigits, channels, onSelectChannel]);

  // Auto-clear digits input after 3 seconds of inactivity
  useEffect(() => {
    if (enteredDigits.length > 0) {
      const timer = setTimeout(() => {
        setEnteredDigits("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [enteredDigits]);

  // Find channel matching current input digits for live HUD
  const matchedChannel = React.useMemo(() => {
    if (!enteredDigits || !channels) return null;
    const targetNum = enteredDigits.padStart(3, "0");
    return channels.find((ch: any) => ch.channelNumber === targetNum);
  }, [enteredDigits, channels]);

  // Block all non-remote mouse, cursor and touch interactions
  useEffect(() => {
    if (!isActive) return;

    const handleBlockInteractions = (e: MouseEvent | TouchEvent | PointerEvent) => {
      // Allow if simulated programmatic click
      if ((window as any).__isSimulatingRemoteClick || !e.isTrusted) {
        return;
      }

      const remoteContainer = document.getElementById("virtual-remote-control");
      if (remoteContainer && remoteContainer.contains(e.target as Node)) {
        // Allow actions inside the remote control panel
        return;
      }
      e.stopPropagation();
      e.preventDefault();
    };

    window.addEventListener("mousedown", handleBlockInteractions, true);
    window.addEventListener("mouseup", handleBlockInteractions, true);
    window.addEventListener("click", handleBlockInteractions, true);
    window.addEventListener("touchstart", handleBlockInteractions, true);
    window.addEventListener("touchend", handleBlockInteractions, true);
    window.addEventListener("touchmove", handleBlockInteractions, true);
    window.addEventListener("pointerdown", handleBlockInteractions, true);
    window.addEventListener("pointerup", handleBlockInteractions, true);

    return () => {
      window.removeEventListener("mousedown", handleBlockInteractions, true);
      window.removeEventListener("mouseup", handleBlockInteractions, true);
      window.removeEventListener("click", handleBlockInteractions, true);
      window.removeEventListener("touchstart", handleBlockInteractions, true);
      window.removeEventListener("touchend", handleBlockInteractions, true);
      window.removeEventListener("touchmove", handleBlockInteractions, true);
      window.removeEventListener("pointerdown", handleBlockInteractions, true);
      window.removeEventListener("pointerup", handleBlockInteractions, true);
    };
  }, [isActive]);

  // Map physical keyboard Arrow keys & numbers to remote control navigation and dialing
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateSpatial("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateSpatial("down");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateSpatial("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateSpatial("right");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (enteredDigits.length > 0) {
          handleNumberOk();
        } else {
          triggerSelect();
        }
      } else if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleNumberInput(e.key);
      } else if (e.key === "Escape" || e.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        if (enteredDigits.length > 0) {
          setEnteredDigits(prev => prev.slice(0, -1));
        } else {
          triggerBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, navigateSpatial, triggerSelect, triggerBack, enteredDigits, handleNumberInput, handleNumberOk]);

  // Keep highlighter box strictly synchronized with focused element rect and style
  useEffect(() => {
    if (!focusedElement) {
      setHighlighterStyle({ display: "none" });
      return;
    }

    const updateHighlighter = () => {
      const rect = focusedElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setHighlighterStyle({ display: "none" });
        return;
      }

      const computed = window.getComputedStyle(focusedElement);
      const borderRadius = computed.borderRadius || "8px";

      setHighlighterStyle({
        position: "absolute",
        left: `${rect.left + window.scrollX}px`,
        top: `${rect.top + window.scrollY}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: borderRadius,
        pointerEvents: "none",
        zIndex: 9999,
        border: "3px solid #d0bcff",
        boxShadow: "0 0 15px rgba(208, 188, 255, 0.7), inset 0 0 6px rgba(208, 188, 255, 0.3)",
        transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        backgroundColor: "rgba(208, 188, 255, 0.04)"
      });
    };

    updateHighlighter();

    window.addEventListener("scroll", updateHighlighter, { passive: true });
    window.addEventListener("resize", updateHighlighter);

    const checkInterval = setInterval(updateHighlighter, 120);

    return () => {
      window.removeEventListener("scroll", updateHighlighter);
      window.removeEventListener("resize", updateHighlighter);
      clearInterval(checkInterval);
    };
  }, [focusedElement]);

  // Focus the first available element upon mounting if none active
  useEffect(() => {
    if (isActive && !focusedElement) {
      // Find and focus the initial element
      const candidates = getNavigableElements();
      if (candidates.length > 0) {
        const sorted = [...candidates].sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();
          if (Math.abs(rectA.top - rectB.top) < 10) {
            return rectA.left - rectB.left;
          }
          return rectA.top - rectB.top;
        });
        if (sorted[0]) {
          setFocusedElement(sorted[0]);
        }
      }
    }
  }, [isActive, focusedElement, getNavigableElements]);

  if (!isActive) return null;

  return (
    <>
      {/* Floating Focus Highlighter over the page */}
      <div id="remote-highlighter" style={highlighterStyle} />

      {/* Floating Channel Number Dialing HUD Overlay */}
      {enteredDigits.length > 0 && (
        <div className="fixed top-28 right-6 z-[10001] bg-black/95 backdrop-blur-md border border-[#d0bcff]/40 text-[#d0bcff] font-mono px-5 py-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in min-w-[150px]">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans font-bold">KÊNH ĐANG NHẬP</span>
          <span className="text-4xl font-black tracking-widest mt-1.5 text-white">
            {enteredDigits.padEnd(3, "_")}
          </span>
          {matchedChannel ? (
            <span className="text-xs text-emerald-400 font-sans font-semibold mt-2 truncate max-w-[140px]">
              {matchedChannel.name}
            </span>
          ) : (
            <span className="text-[10px] text-red-400/80 font-sans mt-2">
              Chưa khớp kênh...
            </span>
          )}
        </div>
      )}

      {/* Sleek physical-looking Floating Remote Control Panel */}
      <div
        id="virtual-remote-control"
        className="fixed bottom-6 right-6 z-[10000] w-52 bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 flex flex-col items-center select-none animate-fade-in font-sans"
      >
        {/* Remote Header / Status Indicator */}
        <div className="w-full flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">REMOTE ACTIVE</span>
          </div>
          <button
            onClick={onDisable}
            className="p-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Tắt Điều Khiển / Turn Off Remote"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Circular D-Pad Layout */}
        <div className="relative w-36 h-36 bg-[#18181b] rounded-full border border-white/5 shadow-inner flex items-center justify-center mb-4">
          
          {/* UP Button */}
          <button
            onClick={() => navigateSpatial("up")}
            className="absolute top-1 w-10 h-8 flex items-center justify-center rounded-t-full text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
            title="Up"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          {/* DOWN Button */}
          <button
            onClick={() => navigateSpatial("down")}
            className="absolute bottom-1 w-10 h-8 flex items-center justify-center rounded-b-full text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
            title="Down"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* LEFT Button */}
          <button
            onClick={() => navigateSpatial("left")}
            className="absolute left-1 w-8 h-10 flex items-center justify-center rounded-l-full text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
            title="Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* RIGHT Button */}
          <button
            onClick={() => navigateSpatial("right")}
            className="absolute right-1 w-8 h-10 flex items-center justify-center rounded-r-full text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
            title="Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Central OK / SELECT Button */}
          <button
            onClick={triggerSelect}
            className="w-16 h-16 rounded-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold text-xs uppercase tracking-widest border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 active:shadow-inner transition-all cursor-pointer font-sans"
            title="OK / Select"
          >
            <span className="text-[10px] opacity-90 font-black">OK</span>
          </button>
        </div>

        {/* Secondary controls row */}
        <div className="w-full grid grid-cols-2 gap-2">
          {/* Back Button */}
          <button
            onClick={triggerBack}
            className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="Quay Lại"
          >
            <CornerDownLeft className="w-3 h-3" />
            BACK
          </button>

          {/* Quick Find Button */}
          <button
            onClick={() => {
              const elements = getNavigableElements();
              if (elements.length > 0) {
                setFocusedElement(elements[0]);
                elements[0].scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="Định vị lại Focus"
          >
            <Monitor className="w-3 h-3" />
            FOCUS
          </button>
        </div>

        {/* Numeric Keypad Grid */}
        <div className="w-full grid grid-cols-3 gap-1.5 mt-4 pt-4 border-t border-white/5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(String(num))}
              className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white hover:text-white font-mono font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClearNumberInput}
            className="py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 text-red-400 hover:text-red-300 font-bold text-[8.5px] uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Xóa"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleNumberInput("0")}
            className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white hover:text-white font-mono font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleNumberOk}
            className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-bold text-[8.5px] uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Đồng ý chuyển kênh"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
