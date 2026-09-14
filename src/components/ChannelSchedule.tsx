import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Radio, AlertCircle, X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChannelScheduleProps {
  channel: {
    id: string;
    name: string;
    logo?: string;
  };
  variant?: 'sidebar' | 'modal' | 'drawer';
  isOpen?: boolean;
  onClose?: () => void;
}

export const ChannelSchedule: React.FC<ChannelScheduleProps> = ({
  channel,
  variant = 'sidebar',
  isOpen = true,
  onClose,
}) => {
  const currentHour = new Date().getHours();
  const currentSlotRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Generate 24 slots: 0h -> 23h (no filters, strictly 24 continuous hours)
  const scheduleSlots = Array.from({ length: 24 }, (_, h) => {
    const startHourStr = String(h).padStart(2, '0') + ':00';
    const nextHour = (h + 1) % 24;
    const endHourStr = nextHour === 0 ? '23:59' : String(nextHour).padStart(2, '0') + ':00';
    const isCurrent = h === currentHour;

    return {
      hour: h,
      timeRange: `${startHourStr} - ${endHourStr}`,
      startHour: startHourStr,
      endHour: endHourStr,
      isCurrent,
      title: 'Chưa có lịch phát sóng',
      note: isCurrent ? 'Khung giờ hiện tại' : 'Chưa có thông tin phát sóng',
    };
  });

  // Auto-scroll to current slot on initial mount or channel switch or drawer open
  useEffect(() => {
    if (currentSlotRef.current && scrollContainerRef.current) {
      const timer = setTimeout(() => {
        currentSlotRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [channel.id, isOpen]);

  // Handle ESC key to close drawer/modal
  useEffect(() => {
    if (variant === 'sidebar' || !onClose || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [variant, isOpen, onClose]);

  const activeSlot = scheduleSlots.find((s) => s.isCurrent);

  const content = (
    <div
      className={`w-full flex flex-col h-full max-h-full min-h-0 border-white/10 shadow-2xl overflow-hidden ${
        variant === 'sidebar'
          ? 'bg-[#1F121C]/95 backdrop-blur-xl rounded-2xl border p-3.5 sm:p-4'
          : 'bg-[#180D15] p-4 sm:p-5'
      }`}
    >
      {/* Header bar (no filters) */}
      <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/25 to-[#C83DFF]/25 border border-red-500/30 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4 text-red-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                Lịch phát sóng 24h
              </h3>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-600/30 border border-red-500/40 text-red-300 rounded-md shrink-0 flex items-center gap-1">
                <Radio className="w-2 h-2 animate-pulse text-red-400" />
                {channel.name}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              Giờ hiện tại:{' '}
              <span className="text-amber-300 font-semibold font-mono">
                {activeSlot?.timeRange || `${String(currentHour).padStart(2, '0')}:00`}
              </span>
            </p>
          </div>
        </div>

        {(variant === 'modal' || variant === 'drawer') && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 active:scale-90 text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
            title="Đóng lịch phát sóng"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable list of 24 timeframes (0h - 23h) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 select-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent',
        }}
      >
        {scheduleSlots.map((slot) => {
          const isCurr = slot.isCurrent;
          return (
            <div
              key={slot.hour}
              ref={isCurr ? currentSlotRef : null}
              id={`schedule-slot-${slot.hour}`}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1 ${
                isCurr
                  ? 'bg-gradient-to-r from-red-950/60 via-[#361528] to-[#25121D] border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/40'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {/* Time header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock
                    className={`w-3.5 h-3.5 ${
                      isCurr ? 'text-red-400 animate-pulse' : 'text-amber-400/80'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono font-bold tracking-tight ${
                      isCurr ? 'text-red-300' : 'text-amber-300'
                    }`}
                  >
                    {slot.timeRange}
                  </span>
                </div>

                {isCurr ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Đang phát
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {slot.startHour}
                  </span>
                )}
              </div>

              {/* Program title & details */}
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p
                  className={`text-xs sm:text-[13px] font-semibold tracking-wide truncate ${
                    isCurr ? 'text-white' : 'text-zinc-200'
                  }`}
                >
                  {slot.title}
                </p>
                {isCurr && (
                  <Sparkles className="w-3 h-3 text-amber-300/80 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400">
                <AlertCircle className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="truncate">{slot.note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Mobile drawer: Slides smoothly from the right edge, portalled to document.body
  // to ensure it renders above TopBar progressive blur, Floaty bar, and page overlays
  if (variant === 'modal' || variant === 'drawer') {
    const drawerPortal = (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="schedule-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999999] bg-black/80 flex justify-end"
            onClick={onClose}
          >
            <motion.div
              key="schedule-drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 w-[88vw] max-w-sm sm:max-w-md h-full bg-[#180D15] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );

    if (typeof document !== 'undefined') {
      return createPortal(drawerPortal, document.body);
    }
    return drawerPortal;
  }

  return content;
};

export default ChannelSchedule;
