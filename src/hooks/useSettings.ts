import { useState, useEffect } from 'react';

export type FontFamilyOption = 'integer' | 'alata';

export type NavigationMode = 'sidebar' | 'topbar' | 'tabview';

export type VBoardSkin = 'default' | 'ios' | 'google' | 'butterfly' | 'physical';

export interface VBoardSkinOption {
  id: VBoardSkin;
  name: string;
  description: string;
  badge: string;
  previewBg: string;
  previewKeyBg: string;
  previewTextColor: string;
}

export const VBOARD_SKIN_OPTIONS: VBoardSkinOption[] = [
  {
    id: 'default',
    name: 'Default V-Board',
    description: 'Giao diện V-board kính tối mờ thanh lịch với hiệu ứng Spatial Glass',
    badge: 'Mặc định',
    previewBg: '#1E1D24',
    previewKeyBg: '#525257',
    previewTextColor: '#FFFFFF',
  },
  {
    id: 'ios',
    name: 'iOS (hình 1)',
    description: 'Mô phỏng chuẩn bàn phím iOS với phím trắng bo góc, bóng đổ mềm và nền xám thanh lịch',
    badge: 'Apple iOS',
    previewBg: '#D0D3D9',
    previewKeyBg: '#FFFFFF',
    previewTextColor: '#000000',
  },
  {
    id: 'google',
    name: 'Google (hình 2)',
    description: 'Mô phỏng Gboard với thanh tiện ích, số phụ góc trên và nút Enter xanh nổi bật',
    badge: 'Gboard',
    previewBg: '#ECEFF4',
    previewKeyBg: '#FFFFFF',
    previewTextColor: '#1F1F1F',
  },
  {
    id: 'butterfly',
    name: 'Butterfly keyboard (mô phỏng giống bàn phím trên Macbook)',
    description: 'Mô phỏng bàn phím MacBook với các phím chiclet đen mờ, hành trình phím siêu mỏng và đèn nền',
    badge: 'MacBook',
    previewBg: '#202125',
    previewKeyBg: '#121215',
    previewTextColor: '#FFFFFF',
  },
  {
    id: 'physical',
    name: 'Physical keyboard (mô phỏng giống bàn phím thực tế, các keys dạng 3D)',
    description: 'Mô phỏng bàn phím thực tế với các phím 3D nổi khối, độ sâu xúc giác và hiệu ứng ấn phím vật lý',
    badge: '3D Mechanical',
    previewBg: '#18191E',
    previewKeyBg: '#2D2F36',
    previewTextColor: '#FFFFFF',
  },
];

export interface SystemSettings {
  userName: string;
  theme: 'light' | 'dark';
  dockToSidebar: boolean;
  navigationMode: NavigationMode;
  floatyBar: boolean;
  vboardSkin: VBoardSkin;
  fontFamily: FontFamilyOption;
  fontScale: number; // 0: 85%, 1: 100%, 2: 115%, 3: 130%
  appBackground: string; // 'default' | 'duo-light' | 'duo-dark' | string url
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
  inspectElements: boolean;
  shinyOutline: boolean;
  spatialGlassBlur: number; // 0 to 50px
  spatialGlassOpacity: number; // 5 to 100 percent
  liquidDistortion?: boolean; // Biến dạng giọt nước / khối thủy tinh lỏng cho Spatial Glass
  vcursorEnabled: boolean; // Bật / Tắt con trỏ V-Cursor
  vcursorColor: string; // Màu thân con trỏ (mặc định đen #000000)
  vcursorBorderColor: string; // Màu viền con trỏ (mặc định trắng #FFFFFF)
  vcursorSize: number; // Kích thước con trỏ (mặc định 24px)
  vcursorGlow: boolean; // Hiệu ứng phát sáng nhẹ
}

export interface VCursorPreset {
  id: string;
  name: string;
  fill: string;
  border: string;
  desc: string;
}

export const VCURSOR_PRESETS: VCursorPreset[] = [
  {
    id: 'macos-dark',
    name: 'macOS Mặc định',
    fill: '#000000',
    border: '#FFFFFF',
    desc: 'Đen viền trắng chuẩn macOS',
  },
  {
    id: 'macos-light',
    name: 'macOS Trắng',
    fill: '#FFFFFF',
    border: '#000000',
    desc: 'Trắng viền đen sắc nét',
  },
  {
    id: 'vplay-crimson',
    name: 'VPlay Crimson',
    fill: '#E6005A',
    border: '#FFFFFF',
    desc: 'Đỏ hồng thương hiệu VPlay',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    fill: '#00E5FF',
    border: '#000000',
    desc: 'Xanh neon rực sáng công nghệ',
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    fill: '#10B981',
    border: '#FFFFFF',
    desc: 'Xanh ngọc lục bảo tươi mát',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    fill: '#F59E0B',
    border: '#000000',
    desc: 'Vàng cam hổ phách ấm áp',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    fill: '#8B5CF6',
    border: '#FFFFFF',
    desc: 'Tím không gian huyền bí',
  },
  {
    id: 'pure-gold',
    name: 'Champagne Gold',
    fill: '#EAB308',
    border: '#FFFFFF',
    desc: 'Vàng ánh kim rạng rỡ',
  },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  userName: 'User',
  theme: 'dark',
  dockToSidebar: true,
  navigationMode: 'topbar',
  floatyBar: false,
  vboardSkin: 'default',
  fontFamily: 'integer',
  fontScale: 1,
  appBackground: 'default',
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
  inspectElements: false,
  shinyOutline: true,
  spatialGlassBlur: 20,
  spatialGlassOpacity: 65,
  liquidDistortion: false,
  vcursorEnabled: false,
  vcursorColor: '#000000',
  vcursorBorderColor: '#FFFFFF',
  vcursorSize: 24,
  vcursorGlow: false,
};

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  previewUrl: string;
  subtext: string;
  type: 'solid' | 'image';
}

export const WALLPAPER_PRESETS: WallpaperOption[] = [
  {
    id: 'default',
    name: 'Mặc định (Solid Dark)',
    url: '',
    previewUrl: '',
    subtext: 'Màu nền tối #181818 tiêu chuẩn',
    type: 'solid',
  },
  {
    id: 'duo-light',
    name: 'Duo Light',
    url: 'https://www.iclarified.com/files/ios/iClarified-iPhone-Duo-Wallpaper/iClarified-iPhone-Duo-Wallpaper-Inner-Light.jpg',
    previewUrl: 'https://www.iclarified.com/files/ios/iClarified-iPhone-Duo-Wallpaper/iClarified-iPhone-Duo-Wallpaper-Inner-Light.jpg',
    subtext: 'Hình nền Duo Light phong cách iOS rực rỡ và tươi sáng',
    type: 'image',
  },
  {
    id: 'duo-dark',
    name: 'Duo Dark',
    url: 'https://www.iclarified.com/files/ios/iClarified-iPhone-Duo-Wallpaper/iClarified-iPhone-Duo-Wallpaper-Inner-Dark.jpg',
    previewUrl: 'https://www.iclarified.com/files/ios/iClarified-iPhone-Duo-Wallpaper/iClarified-iPhone-Duo-Wallpaper-Inner-Dark.jpg',
    subtext: 'Hình nền Duo Dark sang trọng với các vệt màu neon sâu thẳm',
    type: 'image',
  },
];

export interface FontFamilyItem {
  id: FontFamilyOption;
  name: string;
  subtext: string;
  cssFamily: string;
  badge?: string;
}

export const FONT_FAMILY_CONFIG: FontFamilyItem[] = [
  {
    id: 'integer',
    name: 'Integer',
    subtext: 'Phông chữ hiện đại, hình khối sắc nét chuẩn giao diện số (Integer Bold / Inter)',
    cssFamily: "'Integer', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: 'alata',
    name: 'Alata',
    subtext: 'Phông chữ phong cách hình học độc đáo, dứt khoát và ấn tượng',
    cssFamily: "'Alata', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
      let navMode: NavigationMode = fallbackNavMode;
      if (parsed.navigationMode === 'sidebar' || parsed.navigationMode === 'topbar' || parsed.navigationMode === 'tabview') {
        navMode = parsed.navigationMode;
      } else if (parsed.floatyBar === true) {
        navMode = 'tabview';
      } else if (parsed.dockToSidebar === false) {
        navMode = 'sidebar';
      }
      const isFloaty = navMode === 'tabview' || Boolean(parsed.floatyBar);
      let font: FontFamilyOption = 'integer';
      if (parsed.fontFamily && ['alata', 'integer'].includes(parsed.fontFamily)) {
        font = parsed.fontFamily;
      }
      // Check shinyOutline with feature flag fallback
      let isShiny = true;
      if (typeof parsed.shinyOutline === 'boolean') {
        isShiny = parsed.shinyOutline;
      } else {
        try {
          const rawFlags = localStorage.getItem('vplay_feature_flags');
          if (rawFlags) {
            const parsedFlags = JSON.parse(rawFlags);
            if (typeof parsedFlags.shiny_outline === 'boolean') {
              isShiny = parsedFlags.shiny_outline;
            }
          }
        } catch {}
      }

      const glassBlur = typeof parsed.spatialGlassBlur === 'number' && !isNaN(parsed.spatialGlassBlur)
        ? Math.max(0, Math.min(50, parsed.spatialGlassBlur))
        : 20;
      const glassOpacity = typeof parsed.spatialGlassOpacity === 'number' && !isNaN(parsed.spatialGlassOpacity)
        ? Math.max(5, Math.min(100, parsed.spatialGlassOpacity))
        : 65;

      const vcursorEnabled = typeof parsed.vcursorEnabled === 'boolean' ? parsed.vcursorEnabled : false;
      const vcursorColor = typeof parsed.vcursorColor === 'string' && parsed.vcursorColor.trim() ? parsed.vcursorColor : '#000000';
      const vcursorBorderColor = typeof parsed.vcursorBorderColor === 'string' && parsed.vcursorBorderColor.trim() ? parsed.vcursorBorderColor : '#FFFFFF';
      const vcursorSize = typeof parsed.vcursorSize === 'number' && !isNaN(parsed.vcursorSize) ? Math.max(16, Math.min(48, parsed.vcursorSize)) : 24;
      const vcursorGlow = typeof parsed.vcursorGlow === 'boolean' ? parsed.vcursorGlow : false;

      return { 
        ...base, 
        ...parsed,
        shinyOutline: isShiny,
        fontFamily: font,
        navigationMode: navMode,
        spatialGlassBlur: glassBlur,
        spatialGlassOpacity: glassOpacity,
        liquidDistortion: typeof parsed.liquidDistortion === 'boolean' ? parsed.liquidDistortion : false,
        appBackground: parsed.appBackground || 'default',
        floatyBar: isFloaty,
        vboardSkin: ['default', 'ios', 'google', 'butterfly', 'physical'].includes(parsed.vboardSkin) ? parsed.vboardSkin : 'default',
        userName: parsed.userName || legacyUser || 'User',
        theme: 'dark',
        vcursorEnabled,
        vcursorColor,
        vcursorBorderColor,
        vcursorSize,
        vcursorGlow,
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

// Apply side-effects (theme class, font-scale property, font-family, background wallpaper, custom cursor)
export const applySystemSettings = (settings: SystemSettings) => {
  if (typeof document === 'undefined') return;

  // App is dark mode only
  document.documentElement.classList.remove('light-mode');
  document.documentElement.classList.add('dark');

  // Apply V-Cursor active class to html
  if (settings.vcursorEnabled !== false) {
    document.documentElement.classList.add('vplay-custom-cursor-active');
  } else {
    document.documentElement.classList.remove('vplay-custom-cursor-active');
  }

  // Apply font scale
  const scaleVal = FONT_SCALE_CONFIG[settings.fontScale]?.scale || '1';
  document.documentElement.style.setProperty('--waves-font-scale', scaleVal);

  // Apply font family
  const selectedFont = FONT_FAMILY_CONFIG.find(f => f.id === settings.fontFamily) || FONT_FAMILY_CONFIG[0];
  document.documentElement.style.setProperty('--waves-font-family', selectedFont.cssFamily);
  document.body.style.fontFamily = selectedFont.cssFamily;

  // Apply background wallpaper
  const bgPreset = WALLPAPER_PRESETS.find(w => w.id === settings.appBackground);
  const bgUrl = bgPreset ? bgPreset.url : (settings.appBackground && settings.appBackground !== 'default' ? settings.appBackground : '');

  if (bgUrl) {
    document.documentElement.classList.add('has-custom-wallpaper');
    document.body.classList.add('has-custom-wallpaper');
    document.documentElement.style.setProperty('--waves-custom-bg', `url("${bgUrl}")`);
    document.body.style.backgroundImage = `url("${bgUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  } else {
    document.documentElement.classList.remove('has-custom-wallpaper');
    document.body.classList.remove('has-custom-wallpaper');
    document.documentElement.style.setProperty('--waves-custom-bg', 'none');
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#181818';
  }

  // Apply Spatial Glass blur & opacity CSS variables
  const glassBlur = typeof settings.spatialGlassBlur === 'number' && !isNaN(settings.spatialGlassBlur)
    ? Math.max(0, Math.min(50, settings.spatialGlassBlur))
    : 20;
  const glassOpacity = typeof settings.spatialGlassOpacity === 'number' && !isNaN(settings.spatialGlassOpacity)
    ? Math.max(5, Math.min(100, settings.spatialGlassOpacity))
    : 65;
  const opacityFraction = (glassOpacity / 100).toFixed(2);

  document.documentElement.style.setProperty('--spatial-glass-blur', `${glassBlur}px`);
  document.documentElement.style.setProperty('--spatial-glass-opacity', opacityFraction);
  document.documentElement.style.setProperty('--spatial-glass-bg', `rgba(28, 27, 36, ${opacityFraction})`);
  document.documentElement.style.setProperty('--spatial-glass-card-bg', `rgba(255, 255, 255, ${(glassOpacity * 0.0012).toFixed(3)})`);
  document.documentElement.style.setProperty('--spatial-glass-border', `rgba(255, 255, 255, ${(glassOpacity * 0.0025).toFixed(3)})`);

  // Apply Shiny outline (Specular 2-edge top & bottom rim highlight)
  const isShinyActive = settings.shinyOutline !== false;
  if (isShinyActive) {
    document.documentElement.classList.add('has-shiny-outline');
    document.body.classList.add('has-shiny-outline');
  } else {
    document.documentElement.classList.remove('has-shiny-outline');
    document.body.classList.remove('has-shiny-outline');
  }

  // Apply Liquid Distortion for Spatial Glass
  const isLiquidActive = Boolean(settings.liquidDistortion);
  if (isLiquidActive) {
    document.documentElement.classList.add('has-liquid-distortion');
    document.body.classList.add('has-liquid-distortion');
  } else {
    document.documentElement.classList.remove('has-liquid-distortion');
    document.body.classList.remove('has-liquid-distortion');
  }
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
        if (key === 'shinyOutline') {
          try {
            const rawFlags = localStorage.getItem('vplay_feature_flags');
            const flagsObj = rawFlags ? JSON.parse(rawFlags) : {};
            flagsObj.shiny_outline = Boolean(value);
            localStorage.setItem('vplay_feature_flags', JSON.stringify(flagsObj));
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
