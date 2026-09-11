import { useState, useEffect } from 'react';

export type FontFamilyOption = 'integer' | 'alata' | 'google-sans' | 'montserrat';

export interface SystemSettings {
  userName: string;
  theme: 'light' | 'dark';
  dockToSidebar: boolean;
  navigationMode: 'sidebar' | 'topbar';
  floatyBar: boolean;
  fontFamily: FontFamilyOption;
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
  theme: 'dark',
  dockToSidebar: true,
  navigationMode: 'topbar',
  floatyBar: false,
  fontFamily: 'alata',
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

export interface FontFamilyItem {
  id: FontFamilyOption;
  name: string;
  subtext: string;
  cssFamily: string;
  badge?: string;
}

export const FONT_FAMILY_CONFIG: FontFamilyItem[] = [
  {
    id: 'alata',
    name: 'Alata',
    subtext: 'Phông chữ phong cách hình học độc đáo, dứt khoát và ấn tượng',
    cssFamily: "'Alata', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    badge: 'Mặc định',
  },
  {
    id: 'integer',
    name: 'Integer',
    subtext: 'Phông chữ hiện đại, hình khối sắc nét chuẩn giao diện số (Inter / Integer)',
    cssFamily: "'Inter', 'Integer', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'google-sans',
    name: 'Google Sans',
    subtext: 'Phông chữ mềm mại, thân thiện phong cách Material Design của Google',
    cssFamily: "'Google Sans', 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    subtext: 'Phông chữ hình học cân đối, thanh lịch và độ nét cao trên mọi màn hình',
    cssFamily: "'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
];

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

    // Determine initial navigationMode if not saved yet
    let fallbackNavMode: 'sidebar' | 'topbar' = 'topbar';
    try {
      const rawFlags = localStorage.getItem('waves_feature_flags');
      if (rawFlags) {
        const parsedFlags = JSON.parse(rawFlags);
        if (parsedFlags.top_bar === false) {
          fallbackNavMode = 'sidebar';
        }
      }
    } catch {}
    base.navigationMode = fallbackNavMode;

    if (saved) {
      const parsed = JSON.parse(saved);
      const navMode = parsed.navigationMode || (parsed.dockToSidebar === false ? 'sidebar' : fallbackNavMode);
      let font: FontFamilyOption = 'alata';
      if (parsed.fontFamily && ['alata', 'integer', 'google-sans', 'montserrat'].includes(parsed.fontFamily)) {
        // If it was previous integer default, migrate to Alata
        font = parsed.fontFamily === 'integer' ? 'alata' : parsed.fontFamily;
      }
      return { 
        ...base, 
        ...parsed,
        fontFamily: font,
        navigationMode: navMode,
        floatyBar: typeof parsed.floatyBar === 'boolean' ? parsed.floatyBar : false,
        userName: parsed.userName || legacyUser || 'User',
        theme: 'dark'
      };
    } else if (legacyTheme || legacyUser) {
      return {
        ...base,
        userName: legacyUser || 'User',
        theme: 'dark'
      };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

// Apply side-effects (theme class, font-scale property, font-family)
export const applySystemSettings = (settings: SystemSettings) => {
  if (typeof document === 'undefined') return;

  // App is dark mode only
  document.documentElement.classList.remove('light-mode');
  document.documentElement.classList.add('dark');

  // Apply font scale
  const scaleVal = FONT_SCALE_CONFIG[settings.fontScale]?.scale || '1';
  document.documentElement.style.setProperty('--waves-font-scale', scaleVal);

  // Apply font family
  const selectedFont = FONT_FAMILY_CONFIG.find(f => f.id === settings.fontFamily) || FONT_FAMILY_CONFIG[0];
  document.documentElement.style.setProperty('--waves-font-family', selectedFont.cssFamily);
  document.body.style.fontFamily = selectedFont.cssFamily;
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
        if (key === 'navigationMode') {
          try {
            const rawFlags = localStorage.getItem('waves_feature_flags');
            const flagsObj = rawFlags ? JSON.parse(rawFlags) : {};
            flagsObj.top_bar = (value === 'topbar');
            localStorage.setItem('waves_feature_flags', JSON.stringify(flagsObj));
            window.dispatchEvent(new CustomEvent('vplay:flags_updated', { detail: flagsObj }));
          } catch {}
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
