import React, { useEffect, useState, memo } from "react";

interface DigitalClockProps {
  variant?: "full" | "time-only" | "compact" | "sidebar";
  className?: string;
}

const formatDateVietnamese = (date: Date): string => {
  const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  const dayName = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dayName}, ${dd}/${mm}/${yyyy}`;
};

const formatTime = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const DigitalClock = memo(function DigitalClock({
  variant = "full",
  className = ""
}: DigitalClockProps) {
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (variant === "sidebar") {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <span className="font-bold text-white tracking-tight text-[18px] sm:text-[20px] font-google">
          {formatTime(time)}
        </span>
        <span className="text-[11px] text-white/50 whitespace-nowrap font-medium font-google">
          {formatDateVietnamese(time)}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-col items-end justify-center select-none ${className}`}>
        <span className="text-[13px] sm:text-sm font-bold text-white tracking-wider font-mono">
          {formatTime(time)}
        </span>
        <span className="text-[10px] text-white/50 whitespace-nowrap font-sans">
          {formatDateVietnamese(time)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className="text-sm font-bold text-white tracking-wider font-mono">
        {formatTime(time)}
      </span>
      <span className="text-xs text-white/60">
        {formatDateVietnamese(time)}
      </span>
    </div>
  );
});

export default DigitalClock;
