import { useState, useEffect } from 'react';

export interface SystemSettings {
  userName: string;
  theme: 'light' | 'dark';
  dockToSidebar: boolean;
  fontScale: number; // 0: 85%, 1: 100%, 2: 115%, 3: 130%
  autoScrollBanner: boolean;
  autoHideSidebar: boolean;
  mergeSpotlightToCopilot: boolean;
  copilotSlashSuggestions: boolean;
  searchCategories: boolean;
  searchNews: boolean;
  searchTv: boolean;
  searchChannelNumber: boolean;
  searchToolbox: boolean;
  searchSettings: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  userName: 'User',
  theme: 'light',
  dockToSidebar: true,
  fontScale: 1,
  autoScrollBanner: true,
  autoHideSidebar: false,
  mergeSpotlightToCopilot: false,
  copilotSlashSuggestions: true,
  searchCategories: true,
  searchNews: true,
  searchTv: true,
  searchChannelNumber: true,
  searchToolbox: true,
  searchSettings: true,
};

export const FONT_SCALE_CONFIG = [
  { label: 'Nhỏ (85%)', value: 85, badge: 'Nhỏ (85%)', scale: '0.88' },
  { label: 'Mặc định (100%)', value: 100, badge: 'Mặc định (100%)', scale: '1' },
  { label: 'Lớn (115%)', value: 115, badge: 'Lớn (115%)', scale: '1.12' },
  { label: 'Cực lớn (130%)', value: 130, badge: 'Cực lớn (130%)', scale: '1.24' },
];

export const getStoredSettings = (): SystemSettings => {
  try {
    const saved = localStorage.getItem('waves_system_settings');
    const legacyTheme = localStorage.getItem('waves_theme');
    const legacyUser = localStorage.getItem('copilot_username');
    
    let base = { ...DEFAULT_SETTINGS };
    if (legacyUser && legacyUser.trim()) {
      base.userName = legacyUser.trim();
    }

    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...base, 
        ...parsed,
        userName: parsed.userName || legacyUser || 'User',
        theme: parsed.theme || (legacyTheme === 'dark' ? 'dark' : 'light')
      };
    } else if (legacyTheme || legacyUser) {
      return {
        ...base,
        userName: legacyUser || 'User',
        theme: legacyTheme === 'dark' ? 'dark' : 'light'
      };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

// Apply side-effects (theme class, font-scale property)
export const applySystemSettings = (settings: SystemSettings) => {
  if (typeof document === 'undefined') return;

  // Apply theme
  if (settings.theme === 'light') {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark');
  }

  // Apply font scale
  const scaleVal = FONT_SCALE_CONFIG[settings.fontScale]?.scale || '1';
  document.documentElement.style.setProperty('--waves-font-scale', scaleVal);
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const initial = getStoredSettings();
    return initial;
  });

  useEffect(() => {
    applySystemSettings(settings);
  }, [settings]);

  useEffect(() => {
    const handleSettingsChange = () => {
      const updated = getStoredSettings();
      setSettings(updated);
    };

    window.addEventListener('waves_settings_change', handleSettingsChange);
    window.addEventListener('storage', handleSettingsChange);

    return () => {
      window.removeEventListener('waves_settings_change', handleSettingsChange);
      window.removeEventListener('storage', handleSettingsChange);
    };
  }, []);

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('waves_system_settings', JSON.stringify(updated));
        if (key === 'theme') {
          localStorage.setItem('waves_theme', value as string);
        }
        if (key === 'userName') {
          localStorage.setItem('copilot_username', (value as string) || 'User');
        }
      } catch {}
      return updated;
    });

    // Asynchronously dispatch the change event to avoid updating other components during current render/state transition
    setTimeout(() => {
      window.dispatchEvent(new Event('waves_settings_change'));
    }, 0);
  };

  return { settings, updateSetting };
};
