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
  // 1. AI & Copilot
  {
    id: 'flag_copilot_assistant',
    key: 'copilot_assistant',
    name: 'Copilot AI Companion',
    description: 'Bật trợ lý trí tuệ nhân tạo Copilot cho Vplay, menu Windows Flyout và điều khiển bằng giọng nói/văn bản.',
    category: 'ai',
    badge: 'PREVIEW',
    defaultValue: true,
  },
  {
    id: 'flag_ai_smart_recap',
    key: 'ai_smart_recap',
    name: 'AI Smart Recap & Tóm tắt phát sóng',
    description: 'Tự động phân tích và tóm tắt diễn biến chương trình truyền hình đang phát sóng bằng mô hình AI thế hệ mới.',
    category: 'ai',
    badge: 'BETA',
    defaultValue: true,
  },
  {
    id: 'flag_copilot_slash_commands',
    key: 'copilot_slash_commands',
    name: 'Copilot Slash Commands (Gợi ý lệnh /)',
    description: 'Hiển thị danh sách câu lệnh nhanh khi gõ ký tự "/" trong khung nhập liệu Copilot.',
    category: 'ai',
    badge: 'STABLE',
    defaultValue: true,
  },

  // 2. Giao diện & Trải nghiệm (UI & Experience)
  {
    id: 'flag_top_bar',
    key: 'top_bar',
    name: 'Top bar (Thanh điều hướng trên cùng)',
    description: 'Chuyển đổi thanh Sidebar thành thanh điều hướng Top bar phong cách VTVgo với Logo Vplay, Home, Truyền hình, Video Ngắn, Tin tức, V-Flow, Phòng Chat, Sàn cược và menu Xem thêm chứa các ứng dụng khác.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_home_banner_slider',
    key: 'home_banner_slider',
    name: 'Trượt tự động Banner Trang Chủ',
    description: 'Cho phép băng chuyền Carousel nổi bật trên trang chủ tự động chuyển đổi slide sau mỗi 6 giây.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_dock_bottom_nav',
    key: 'dock_bottom_nav',
    name: 'Dock điều hướng nổi (Floating Bottom Dock)',
    description: 'Hỗ trợ thanh điều hướng dạng dock nổi ở cạnh dưới màn hình khi tắt chế độ gắn vào Sidebar.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_spotlight_search',
    key: 'spotlight_search',
    name: 'Spotlight Quick Search (⌘K / Ctrl+K)',
    description: 'Kích hoạt hộp thoại tìm kiếm nhanh thông minh trên toàn ứng dụng bằng tổ hợp phím tắt.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_spring_animations',
    key: 'spring_animations',
    name: 'Hiệu ứng chuyển động Spring động học',
    description: 'Áp dụng hệ số vật lý lò xo (motion physics) cho các popup, modal và chuyển cảnh tab.',
    category: 'ui',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_high_contrast',
    key: 'high_contrast',
    name: 'Chế độ tương phản cao (High Contrast)',
    description: 'Tăng cường độ tương phản viền, văn bản và các nút bấm nhằm nâng cao khả năng tiếp cận người dùng.',
    category: 'ui',
    badge: 'BETA',
    defaultValue: false,
  },

  // 3. Tính năng & Tiện ích (Features & Utilities)
  {
    id: 'flag_orbs_bet_arena',
    key: 'orbs_bet_arena',
    name: 'Sàn cược Orbs VIP & Mini Games',
    description: 'Kích hoạt sàn trò chơi giải trí mô phỏng (Bầu Cua, Lật Xu, Bài Cào 3 Lá, Tài Xỉu) sử dụng tiền thưởng Orbs.',
    category: 'features',
    badge: 'BETA',
    defaultValue: true,
  },
  {
    id: 'flag_vplay_vertical',
    key: 'vplay_vertical',
    name: 'Vplay Vertical (Shorts TV Feed)',
    description: 'Chế độ xem video truyền hình dọc dạng lướt ngón tay tương tự TikTok/Shorts với âm thanh sống động.',
    category: 'features',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_minecraft_gui',
    key: 'minecraft_gui',
    name: 'Minecraft Container & Chest GUI',
    description: 'Giao diện hộp rương Minecraft 27 ô tương tác, âm thanh mở rương và kiểm tra độ trễ mạng.',
    category: 'features',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_space_360_apps',
    key: 'space_360_apps',
    name: 'V-Apps & Space 360 Mini Arcade',
    description: 'Khu vực trò chơi arcade retro cổ điển (Pac-Man, Flappy Bird, Snake, 2048, VStudy).',
    category: 'features',
    badge: 'STABLE',
    defaultValue: true,
  },
  {
    id: 'flag_waves_premium_suite',
    key: 'waves_premium_suite',
    name: 'Waves Premium & VBank Services',
    description: 'Bộ tiện ích tài chính ảo VBank, gói dịch vụ VIP Waves+, chuyển khoản Orbs và thẻ thành viên.',
    category: 'features',
    badge: 'STABLE',
    defaultValue: true,
  },

  // 4. Phát sóng & Trình phát video (Player Tech)
  {
    id: 'flag_stats_for_nerds',
    key: 'stats_for_nerds',
    name: 'Stats for Nerds (Thông số kỹ thuật video)',
    description: 'Hiển thị lớp phủ chi tiết về Bitrate, Frame Rate, Video Codec, Buffer Health và Dropped Frames.',
    category: 'player',
    badge: 'EXPERIMENTAL',
    defaultValue: false,
  },
  {
    id: 'flag_low_latency_hls',
    key: 'low_latency_hls',
    name: 'Low-Latency HLS (Phát sóng độ trễ thấp)',
    description: 'Rút ngắn bộ đệm cache luồng stream HLS để giảm độ trễ theo thời gian thực xuống dưới 3 giây.',
    category: 'player',
    badge: 'BETA',
    defaultValue: true,
  },
  {
    id: 'flag_pip_auto_trigger',
    key: 'pip_auto_trigger',
    name: 'Tự động Picture-in-Picture khi rời tab',
    description: 'Tự động kích hoạt cửa sổ video thu nhỏ nổi khi người dùng chuyển sang ứng dụng hoặc tab khác.',
    category: 'player',
    badge: 'BETA',
    defaultValue: false,
  },

  // 5. Kỹ thuật & Gỡ lỗi (Developer & Telemetry)
  {
    id: 'flag_debug_console_logs',
    key: 'debug_console_logs',
    name: 'Nhật ký chẩn đoán (Debug Console Logs)',
    description: 'In chi tiết nhật ký mạng, sự kiện phát sóng HLS và luồng tin nhắn Copilot vào Console trình duyệt.',
    category: 'developer',
    badge: 'EXPERIMENTAL',
    defaultValue: false,
  },
  {
    id: 'flag_strict_sandbox_mode',
    key: 'strict_sandbox_mode',
    name: 'Chế độ Sandbox bảo vệ luồng dữ liệu',
    description: 'Chặn các script bên thứ ba tự ý tải quảng cáo hoặc theo dõi hành vi người dùng.',
    category: 'developer',
    badge: 'STABLE',
    defaultValue: true,
  }
];

const STORAGE_KEY = 'vplay_feature_flags';

export const getStoredFlags = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults in case new flags were added
      const merged: Record<string, boolean> = {};
      FEATURE_FLAGS_DEFINITIONS.forEach((item) => {
        merged[item.key] = typeof parsed[item.key] === 'boolean' ? parsed[item.key] : item.defaultValue;
      });
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
      if ('top_bar' in newFlags) {
        try {
          const raw = localStorage.getItem('waves_system_settings');
          const current = raw ? JSON.parse(raw) : {};
          current.navigationMode = newFlags.top_bar ? 'topbar' : 'sidebar';
          localStorage.setItem('waves_system_settings', JSON.stringify(current));
          window.dispatchEvent(new Event('waves_settings_change'));
        } catch {}
      }
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
