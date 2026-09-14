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
