import { useState, useEffect } from 'react';

// Mục tiêu: 00h00 ngày 16/10/2026 (Tháng 10 trong JavaScript là index 9)
export const TRANSITION_TARGET_DATE = new Date(2026, 9, 16, 0, 0, 0);

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  formattedText: string;
}

export function calculateTimeRemaining(target: Date = TRANSITION_TARGET_DATE): CountdownState {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCompleted: true,
      formattedText: '0 ngày 0 giờ 0 phút 0 giây',
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isCompleted: false,
    formattedText: `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`,
  };
}

export function useCountdown(target: Date = TRANSITION_TARGET_DATE) {
  const [countdown, setCountdown] = useState<CountdownState>(() => calculateTimeRemaining(target));

  useEffect(() => {
    // Cập nhật ngay lập tức
    setCountdown(calculateTimeRemaining(target));

    const interval = setInterval(() => {
      setCountdown(calculateTimeRemaining(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return countdown;
}
