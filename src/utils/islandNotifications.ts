export interface IslandNotification {
  id?: string;
  title: string;
  message?: string;
  icon?: 'bell' | 'check' | 'tv' | 'music' | 'flag' | 'settings' | 'copy' | 'sparkles' | 'info';
  duration?: number;
}

/**
 * Dispatches an interactive notification to be displayed directly on the Dynamic Island.
 * The Dynamic Island pill will automatically stretch to fit the notification content length.
 */
export const showIslandNotification = (notif: IslandNotification | string) => {
  if (typeof window === 'undefined') return;
  const detail: IslandNotification =
    typeof notif === 'string'
      ? { title: notif, duration: 3500 }
      : { duration: 3500, ...notif };

  window.dispatchEvent(new CustomEvent('vplay:island_notification', { detail }));
};

// Global helper for convenient console or quick triggers
if (typeof window !== 'undefined') {
  (window as any).vplayNotify = showIslandNotification;
}
