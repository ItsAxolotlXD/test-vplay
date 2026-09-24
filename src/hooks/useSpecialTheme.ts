import { useState, useEffect, useCallback } from 'react';
import { SpecialThemeId, SPECIAL_THEMES, SpecialTheme } from '../data/specialThemesData';

const STORAGE_KEY_ACTIVE = 'vplay_active_special_theme';
const STORAGE_KEY_INSTALLED = 'vplay_installed_themes';
const THEME_CHANGE_EVENT = 'vplay_special_theme_change';

// Apply DOM side-effects for active theme
export function applySpecialThemeToDOM(themeId: SpecialThemeId) {
  if (typeof document === 'undefined') return;

  const allThemeClasses = [
    'theme-new-year',
    'theme-lunar-new-year',
    'theme-christmas',
    'theme-patriotic',
  ];

  // Remove existing special theme classes
  allThemeClasses.forEach((cls) => {
    document.documentElement.classList.remove(cls);
    document.body.classList.remove(cls);
  });

  if (themeId === 'default' || !themeId) {
    document.documentElement.removeAttribute('data-special-theme');
    document.documentElement.style.removeProperty('--vplay-special-dominant');
    document.documentElement.style.removeProperty('--vplay-special-accent');
    document.documentElement.style.removeProperty('--vplay-special-glow');
    return;
  }

  const themeObj = SPECIAL_THEMES.find((t) => t.id === themeId);
  if (!themeObj) return;

  // Add specific class
  const targetClass = `theme-${themeId}`;
  document.documentElement.classList.add(targetClass);
  document.body.classList.add(targetClass);
  document.documentElement.setAttribute('data-special-theme', themeId);

  // Set CSS custom properties
  document.documentElement.style.setProperty('--vplay-special-dominant', themeObj.dominantColor);
  document.documentElement.style.setProperty('--vplay-special-accent', themeObj.accentColor);
  document.documentElement.style.setProperty('--vplay-special-glow', themeObj.primaryGlow);
}

export function useSpecialTheme() {
  const [activeTheme, setActiveTheme] = useState<SpecialThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE) as SpecialThemeId;
      if (saved && (saved === 'default' || SPECIAL_THEMES.some((t) => t.id === saved))) {
        return saved;
      }
    } catch {}
    return 'default';
  });

  const [installedThemes, setInstalledThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSTALLED);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Mặc định sẵn sàng cài đặt
    return ['new-year', 'lunar-new-year', 'christmas', 'patriotic'];
  });

  // Apply DOM side-effects whenever activeTheme changes
  useEffect(() => {
    applySpecialThemeToDOM(activeTheme);
  }, [activeTheme]);

  // Listen to cross-component sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = (localStorage.getItem(STORAGE_KEY_ACTIVE) as SpecialThemeId) || 'default';
        setActiveTheme(saved);
      } catch {}
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const setSpecialTheme = useCallback((themeId: SpecialThemeId) => {
    setActiveTheme(themeId);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, themeId);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {}
    applySpecialThemeToDOM(themeId);
  }, []);

  const resetToDefault = useCallback(() => {
    setSpecialTheme('default');
  }, [setSpecialTheme]);

  const currentThemeData = SPECIAL_THEMES.find((t) => t.id === activeTheme) || null;

  return {
    activeTheme,
    currentThemeData,
    installedThemes,
    setSpecialTheme,
    resetToDefault,
    isSpecialActive: activeTheme !== 'default',
  };
}
