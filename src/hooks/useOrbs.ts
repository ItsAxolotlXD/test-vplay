import { useState, useEffect, useCallback } from 'react';

const ORBS_KEY = 'vplay_orbs';
const LEGACY_VCOINS_KEY = 'vplay_vcoins';
const DEFAULT_ORBS = 150000;

export function getStoredOrbs(): number {
  try {
    const savedOrbs = localStorage.getItem(ORBS_KEY);
    if (savedOrbs !== null) {
      const val = parseInt(savedOrbs, 10);
      if (!isNaN(val)) return val;
    }
    const savedCoins = localStorage.getItem(LEGACY_VCOINS_KEY);
    if (savedCoins !== null) {
      const val = parseInt(savedCoins, 10);
      if (!isNaN(val)) return val;
    }
  } catch {}
  return DEFAULT_ORBS;
}

export function saveStoredOrbs(val: number): void {
  try {
    const normalized = Math.max(0, Math.floor(val));
    localStorage.setItem(ORBS_KEY, normalized.toString());
    localStorage.setItem(LEGACY_VCOINS_KEY, normalized.toString());
    window.dispatchEvent(new CustomEvent('vplay_orbs_changed', { detail: normalized }));
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

export function useOrbs() {
  const [orbs, setOrbsState] = useState<number>(() => getStoredOrbs());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORBS_KEY || e.key === LEGACY_VCOINS_KEY) {
        setOrbsState(getStoredOrbs());
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        setOrbsState(customEvent.detail);
      } else {
        setOrbsState(getStoredOrbs());
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('vplay_orbs_changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('vplay_orbs_changed', handleCustomEvent);
    };
  }, []);

  const setOrbs = useCallback((valOrUpdater: number | ((prev: number) => number)) => {
    setOrbsState((prev) => {
      const next = typeof valOrUpdater === 'function' ? valOrUpdater(prev) : valOrUpdater;
      saveStoredOrbs(next);
      return next;
    });
  }, []);

  const addOrbs = useCallback((amount: number) => {
    setOrbs((prev) => prev + amount);
  }, [setOrbs]);

  const spendOrbs = useCallback((amount: number): boolean => {
    const current = getStoredOrbs();
    if (current >= amount) {
      setOrbs(current - amount);
      return true;
    }
    return false;
  }, [setOrbs]);

  return {
    orbs,
    setOrbs,
    addOrbs,
    spendOrbs,
  };
}
