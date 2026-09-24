import { useState, useEffect } from 'react';

export type FlagCategory = 'ai' | 'ui' | 'features' | 'player' | 'developer';
export type FlagBadge = 'PREVIEW' | 'BETA' | 'STABLE' | 'EXPERIMENTAL';

export interface FeatureFlagItem {
  id: string;
  name: string;
  key: string;
  description: string;
  category: FlagCategory;
  badge: FlagBadge;
  defaultValue: boolean;
  requiresReload?: boolean;
}

export const FEATURE_FLAGS_DEFINITIONS: FeatureFlagItem[] = [
  {
    id: 'flag_animation_test',
    key: 'animation_test',
    name: 'Animation Test',
    description: 'Thêm thật nhiều animation và motion mượt mà vào toàn bộ ứng dụng: hiệu ứng chuyển trang đàn hồi (Page Transitions), các khối sáng lơ lửng chuyển động nền (Ambient Orbs), tương tác spring phóng to thu nhỏ trên thẻ & nút bấm, macOS dock magnification, và bảng điều khiển Motion Sandbox trực tiếp.',
    category: 'ui',
    badge: 'EXPERIMENTAL',
    defaultValue: false,
  },
  {
    id: 'flag_experimental_vboard',
    key: 'experimental_vboard',
    name: 'Experimental V-board',
    description: 'Bàn phím ảo độc quyền V-board mang phong cách iOS dark mode khi tương tác với thanh tìm kiếm (Search box) và ô nhập văn bản (Input box), vô hiệu hóa bàn phím mặc định của thiết bị (không trigger bàn phím device).',
    category: 'ui',
    badge: 'EXPERIMENTAL',
    defaultValue: true,
  },
  {
    id: 'flag_voice_search_integration',
    key: 'voice_search_integration',
    name: 'Voice Search Integration',
    description: 'Adding microphone and allows ability to search with your voice inside a search box.',
    category: 'features',
    badge: 'BETA',
    defaultValue: true,
  },
  {
    id: 'flag_status_bar',
    key: 'status_bar',
    name: 'Vertical Status Bar (Dọc bên phải)',
    description: 'Hiển thị thanh trạng thái và Dynamic Island đặt dọc ở góc trên bên phải màn hình: Camera/Island, Đồng hồ 9:41, Vòng cung Pin & Wi-Fi & chấm sóng, Nút quay lại (<).',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_dynamic_island',
    key: 'dynamic_island',
    name: 'Dynamic Island',
    description: 'Kích hoạt camera punch-hole và khả năng mở rộng tương tác cho Dynamic Island khi chạm vào ở góc trên bên phải.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_shiny_outline',
    key: 'shiny_outline',
    name: 'Shiny Outline',
    description: 'Viền sáng bóng 2 cạnh trên dưới phản chiếu kính mờ (Specular rim highlights) cho toàn bộ elements trong ứng dụng (ô kênh, menus, buttons, toggles, nền danh mục, khối thẻ, banner, search boxes, input boxes...).',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_settings_drawer',
    key: 'settings_drawer',
    name: 'Settings drawer',
    description: 'Settings open in a drawer on the right instead of a tab page',
    category: 'ui',
    badge: 'BETA',
    defaultValue: false,
  }
];

const STORAGE_KEY = 'vplay_feature_flags';

export const getStoredFlags = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Prune old flags and keep only currently defined flags
      const merged: Record<string, boolean> = {};
      FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
        merged[item.key] = typeof parsed[item.key] === 'boolean' ? parsed[item.key] : item.defaultValue;
      });

      // Migration: Ensure animation_test is OFF by default as requested
      const appliedMigration = localStorage.getItem('vplay_flags_v2_migration');
      if (!appliedMigration) {
        merged['animation_test'] = false;
        localStorage.setItem('vplay_flags_v2_migration', 'true');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }

      // Migration v3: Enable vertical status_bar & dynamic_island by default
      const appliedMigrationV3 = localStorage.getItem('vplay_flags_v3_vertical_status');
      if (!appliedMigrationV3) {
        merged['status_bar'] = true;
        merged['dynamic_island'] = true;
        localStorage.setItem('vplay_flags_v3_vertical_status', 'true');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }

      // Migration v4: Enforce status_bar is DEFAULT ON
      const appliedMigrationV4 = localStorage.getItem('vplay_flags_v4_status_bar_default');
      if (!appliedMigrationV4) {
        merged['status_bar'] = true;
        localStorage.setItem('vplay_flags_v4_status_bar_default', 'true');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }

      return merged;
    }
  } catch (err) {
    console.error('Failed to parse feature flags from localStorage:', err);
  }

  // Return initial defaults
  const defaults: Record<string, boolean> = {};
  FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
    defaults[item.key] = item.defaultValue;
  });
  return defaults;
};

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Record<string, boolean>>(() => getStoredFlags());

  // Keep state synced across tabs / components
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setFlags(JSON.parse(e.newValue));
        } catch {}
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        setFlags(custom.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('vplay:flags_updated', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('vplay:flags_updated', handleCustom);
    };
  }, []);

  const saveFlags = (newFlags: Record<string, boolean>) => {
    setFlags(newFlags);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlags));
      // Dispatch custom event for immediate same-window listeners
      window.dispatchEvent(new CustomEvent('vplay:flags_updated', { detail: newFlags }));

      // Sync with system settings if shiny_outline is modified
      if (typeof newFlags['shiny_outline'] === 'boolean') {
        const rawSettings = localStorage.getItem('waves_system_settings');
        const settingsObj = rawSettings ? JSON.parse(rawSettings) : {};
        if (settingsObj.shinyOutline !== newFlags['shiny_outline']) {
          settingsObj.shinyOutline = newFlags['shiny_outline'];
          localStorage.setItem('waves_system_settings', JSON.stringify(settingsObj));
          window.dispatchEvent(new Event('waves_settings_change'));
        }
      }
    } catch (err) {
      console.error('Failed to save feature flags to localStorage:', err);
    }
  };

  const toggleFlag = (key: string) => {
    const nextVal = !flags[key];
    const updated = { ...flags, [key]: nextVal };
    saveFlags(updated);
    return nextVal;
  };

  const setFlag = (key: string, value: boolean) => {
    const updated = { ...flags, [key]: value };
    saveFlags(updated);
  };

  const resetToDefaults = () => {
    const defaults: Record<string, boolean> = {};
    FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
      defaults[item.key] = item.defaultValue;
    });
    saveFlags(defaults);
  };

  const enableAll = () => {
    const allOn: Record<string, boolean> = {};
    FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
      allOn[item.key] = true;
    });
    saveFlags(allOn);
  };

  const disableAll = () => {
    const allOff: Record<string, boolean> = {};
    FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
      allOff[item.key] = false;
    });
    saveFlags(allOff);
  };

  const isEnabled = (key: string): boolean => {
    return !!flags[key];
  };

  return {
    flags,
    toggleFlag,
    setFlag,
    resetToDefaults,
    enableAll,
    disableAll,
    isEnabled,
  };
};
