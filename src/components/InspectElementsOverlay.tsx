import React, { useState, useEffect, useRef } from 'react';
import { MousePointerClick, X, Code, Terminal, Eye, Copy, Check, ChevronRight, RefreshCw, Sparkles, Layers } from 'lucide-react';

interface InspectElementsOverlayProps {
  enabled: boolean;
  onDisable: () => void;
}

interface InspectedElementInfo {
  tagName: string;
  id: string;
  classList: string[];
  rect: DOMRect;
  outerHTML: string;
  innerText: string;
  computedStyles: Record<string, string>;
  parents: string[];
}

export const InspectElementsOverlay: React.FC<InspectElementsOverlayProps> = ({
  enabled,
  onDisable,
}) => {
  const [isPicking, setIsPicking] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string>('');
  const [inspectedElement, setInspectedElement] = useState<InspectedElementInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [erudaActive, setErudaActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'styles' | 'html' | 'metrics'>('styles');

  const hoveredTargetRef = useRef<HTMLElement | null>(null);

  // Initialize Eruda if requested
  const toggleEruda = () => {
    if ((window as any).eruda) {
      if (erudaActive) {
        (window as any).eruda.hide();
        setErudaActive(false);
      } else {
        (window as any).eruda.show();
        setErudaActive(true);
      }
      return;
    }

    // Load Eruda script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.onload = () => {
      if ((window as any).eruda) {
        (window as any).eruda.init();
        (window as any).eruda.show();
        setErudaActive(true);
      }
    };
    document.body.appendChild(script);
  };

  // Inspect mode hover & click listeners
  useEffect(() => {
    if (!enabled || !isPicking) {
      setHoveredRect(null);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      // Find element under pointer
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const target = elements.find((el) => {
        // Skip inspect overlay UI itself
        return !el.closest('#inspect-elements-root') && el !== document.documentElement && el !== document.body;
      }) as HTMLElement | undefined;

      if (target) {
        hoveredTargetRef.current = target;
        const rect = target.getBoundingClientRect();
        setHoveredRect(rect);
        const tag = target.tagName.toLowerCase();
        const id = target.id ? `#${target.id}` : '';
        const classes = Array.from(target.classList).slice(0, 3).map((c) => `.${c}`).join('');
        setHoveredLabel(`${tag}${id}${classes} (${Math.round(rect.width)} × ${Math.round(rect.height)})`);
      } else {
        setHoveredRect(null);
        hoveredTargetRef.current = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = hoveredTargetRef.current;
      if (!target) return;

      // Don't trigger inspect on inspector UI itself
      if ((e.target as HTMLElement)?.closest('#inspect-elements-root')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Extract details
      const rect = target.getBoundingClientRect();
      const computed = window.getComputedStyle(target);
      const stylesObj: Record<string, string> = {
        'display': computed.display,
        'position': computed.position,
        'width': `${Math.round(rect.width)}px`,
        'height': `${Math.round(rect.height)}px`,
        'font-family': computed.fontFamily,
        'font-size': computed.fontSize,
        'font-weight': computed.fontWeight,
        'color': computed.color,
        'background-color': computed.backgroundColor,
        'margin': `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`,
        'padding': `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
        'border-radius': computed.borderRadius,
        'opacity': computed.opacity,
        'z-index': computed.zIndex,
      };

      // Parents hierarchy
      const parents: string[] = [];
      let curr: HTMLElement | null = target.parentElement;
      while (curr && curr !== document.documentElement && parents.length < 5) {
        const pId = curr.id ? `#${curr.id}` : '';
        const pTag = curr.tagName.toLowerCase();
        parents.unshift(`${pTag}${pId}`);
        curr = curr.parentElement;
      }

      setInspectedElement({
        tagName: target.tagName.toLowerCase(),
        id: target.id || '',
        classList: Array.from(target.classList),
        rect,
        outerHTML: target.outerHTML,
        innerText: target.innerText?.slice(0, 200) || '',
        computedStyles: stylesObj,
        parents,
      });

      setIsDrawerOpen(true);
      setIsPicking(false);
      setHoveredRect(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { capture: true });
    window.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, { capture: true });
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, [enabled, isPicking]);

  if (!enabled) return null;

  return (
    <div id="inspect-elements-root" className="pointer-events-none select-none z-[9999] fixed inset-0">
      {/* 1. Element Hover Highlight Box in Pick Mode */}
      {isPicking && hoveredRect && (
        <div
          style={{
            top: `${hoveredRect.top}px`,
            left: `${hoveredRect.left}px`,
            width: `${hoveredRect.width}px`,
            height: `${hoveredRect.height}px`,
          }}
          className="fixed border-2 border-[#007AFF] bg-[#007AFF]/15 pointer-events-none transition-all duration-75 z-[9998] shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
        >
          {/* Label Tooltip */}
          <div
            style={{
              transform: hoveredRect.top < 30 ? 'translateY(100%)' : 'translateY(-100%)',
            }}
            className="absolute top-0 left-0 px-2 py-0.5 rounded bg-[#007AFF] text-white font-mono text-[11px] font-semibold whitespace-nowrap shadow-lg flex items-center gap-1.5 pointer-events-none max-w-[280px] truncate"
          >
            <span>{hoveredLabel}</span>
          </div>
        </div>
      )}

      {/* 2. Floating Dev Pill (Controls Toolbar) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 pointer-events-auto z-[9999] flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#1C1C1E]/90 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/50 text-white text-xs">
          {/* Pick Element Button */}
          <button
            onClick={() => {
              setIsPicking(!isPicking);
              if (isDrawerOpen) setIsDrawerOpen(false);
            }}
            title={isPicking ? 'Hủy soi phần tử' : 'Soi phần tử trên trang'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              isPicking
                ? 'bg-[#007AFF] text-white shadow-md animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">
              {isPicking ? 'Đang soi...' : 'Soi phần tử'}
            </span>
          </button>

          {/* DevTools / Eruda Button */}
          <button
            onClick={toggleEruda}
            title="Mở DevTools (Console, Elements, Network)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              erudaActive
                ? 'bg-[#34C759] text-white'
                : 'bg-white/10 hover:bg-white/20 text-zinc-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[11px]">DevTools</span>
          </button>

          {/* Close / Hide inspector tool */}
          <button
            onClick={onDisable}
            title="Tắt Inspect Elements"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Inspected Element Drawer / Modal */}
      {isDrawerOpen && inspectedElement && (
        <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[460px] max-h-[80vh] rounded-3xl bg-[#1C1C1E]/95 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/70 text-white pointer-events-auto flex flex-col z-[10000] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <Code className="w-4 h-4 text-[#007AFF] shrink-0" />
              <div className="min-w-0 font-mono text-xs truncate">
                <span className="text-[#FF453A] font-bold">&lt;{inspectedElement.tagName}&gt;</span>
                {inspectedElement.id && <span className="text-[#30D158]"> #{inspectedElement.id}</span>}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setIsPicking(true);
                  setIsDrawerOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <MousePointerClick className="w-3 h-3" />
                <span>Soi tiếp</span>
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Breadcrumb path */}
          {inspectedElement.parents.length > 0 && (
            <div className="px-4 py-1.5 bg-black/30 border-b border-white/5 flex items-center gap-1 text-[10px] font-mono text-zinc-400 overflow-x-auto whitespace-nowrap scrollbar-none">
              {inspectedElement.parents.map((p, idx) => (
                <React.Fragment key={idx}>
                  <span>{p}</span>
                  <ChevronRight className="w-2.5 h-2.5 shrink-0 opacity-40" />
                </React.Fragment>
              ))}
              <span className="text-[#007AFF] font-bold">&lt;{inspectedElement.tagName}&gt;</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-white/5 text-xs font-semibold px-4 pt-1 gap-2">
            <button
              onClick={() => setActiveTab('styles')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'styles'
                  ? 'border-[#007AFF] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Styles (CSS)
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'html'
                  ? 'border-[#007AFF] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              HTML Source
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'metrics'
                  ? 'border-[#007AFF] text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Kích thước & Box Model
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 overflow-y-auto max-h-[360px] space-y-3 font-mono text-xs">
            {activeTab === 'styles' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[11px] text-zinc-400 font-sans">
                  <span>Thuộc tính CSS Computed</span>
                  <span className="text-[10px] text-zinc-500">{Object.keys(inspectedElement.computedStyles).length} properties</span>
                </div>
                {Object.entries(inspectedElement.computedStyles).map(([prop, val]) => (
                  <div
                    key={prop}
                    className="p-1.5 rounded-lg hover:bg-white/5 flex items-baseline justify-between gap-2 transition-colors text-[11px]"
                  >
                    <span className="text-[#9CA3AF] shrink-0">{prop}:</span>
                    <span className="text-[#38BDF8] truncate max-w-[260px] text-right font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'html' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                  <span>Mã outerHTML</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inspectedElement.outerHTML);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="flex items-center gap-1 text-[#007AFF] hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép HTML'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-[10px] leading-relaxed text-zinc-300 overflow-x-auto whitespace-pre-wrap max-h-56">
                  {inspectedElement.outerHTML}
                </pre>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-3 font-sans">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Box Dimensions</div>
                  <div className="text-2xl font-bold font-mono text-[#38BDF8]">
                    {Math.round(inspectedElement.rect.width)} × {Math.round(inspectedElement.rect.height)} px
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Tọa độ: Top {Math.round(inspectedElement.rect.top)}px, Left {Math.round(inspectedElement.rect.left)}px
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block text-[10px]">Margin</span>
                    <span className="font-mono text-white text-xs">{inspectedElement.computedStyles['margin'] || '0px'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block text-[10px]">Padding</span>
                    <span className="font-mono text-white text-xs">{inspectedElement.computedStyles['padding'] || '0px'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
