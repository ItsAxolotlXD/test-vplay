import { Channel } from '../types';

export interface TvWatchRecord {
  id: string;
  channelName: string;
  channelNumber: string;
  logoUrl: string;
  category: string;
  watchedAt: string;
  timestamp: number;
}

export interface Space360AppRecord {
  id: string;
  appId: string;
  appName: string;
  category: string;
  route: string;
  icon: string;
  launchCount: number;
  lastUsedAt: string;
  timestamp: number;
}

const TV_WATCH_KEY = 'vplay_tv_watch_history';
const SPACE360_KEY = 'vplay_space360_app_history';

// Default initial TV watch records if empty
const SEED_TV_WATCH: TvWatchRecord[] = [
  {
    id: 'ch-vtv1',
    channelName: 'VTV1 HD - Thời sự & Chính luận',
    channelNumber: '001',
    logoUrl: 'https://static.wikia.nocookie.net/ep-deo/images/2/23/VTV1_2013_logo.png/revision/latest?cb=20240902120000',
    category: 'Thời sự',
    watchedAt: 'Hôm nay, 19:00',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'ch-vtv3',
    channelName: 'VTV3 HD - Giải trí & Thể thao',
    channelNumber: '003',
    logoUrl: 'https://static.wikia.nocookie.net/ep-deo/images/4/47/VTV3_2013_logo.png/revision/latest?cb=20240902120000',
    category: 'Giải trí',
    watchedAt: 'Hôm nay, 14:30',
    timestamp: Date.now() - 18000000,
  },
  {
    id: 'ch-vtvct',
    channelName: 'VTV Cần Thơ HD - Miền Tây',
    channelNumber: '006',
    logoUrl: 'https://static.wikia.nocookie.net/ep-deo/images/6/69/VTV_Can_Tho_2022_logo.png/revision/latest?cb=20240902120000',
    category: 'Văn hóa',
    watchedAt: 'Hôm qua, 20:15',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'ch-thvl1',
    channelName: 'THVL1 HD - Đài PT-TH Vĩnh Long',
    channelNumber: '031',
    logoUrl: 'https://static.wikia.nocookie.net/ep-deo/images/9/91/THVL1_2017_logo.png/revision/latest?cb=20240902120000',
    category: 'Phim truyện',
    watchedAt: '2 ngày trước',
    timestamp: Date.now() - 172800000,
  }
];

// Default initial Space 360 App usage records if empty
const SEED_SPACE360_APPS: Space360AppRecord[] = [
  {
    id: 'app-driving',
    appId: 'driving-simulator',
    appName: 'Mô phỏng Lái xe 3D',
    category: 'Trò chơi / Mô phỏng',
    route: '/app/driving',
    icon: 'Car',
    launchCount: 14,
    lastUsedAt: 'Hôm nay, 16:45',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'app-mspaint',
    appId: 'ms-paint',
    appName: 'MS Paint Cổ điển',
    category: 'Sáng tạo & Đồ họa',
    route: '/app/mspaint',
    icon: 'Palette',
    launchCount: 9,
    lastUsedAt: 'Hôm nay, 11:20',
    timestamp: Date.now() - 25200000,
  },
  {
    id: 'app-weather',
    appId: 'v-weather',
    appName: 'V-Weather 360 Thời tiết',
    category: 'Tiện ích Không gian',
    route: '/app/weather',
    icon: 'CloudSun',
    launchCount: 22,
    lastUsedAt: 'Hôm qua, 09:10',
    timestamp: Date.now() - 93600000,
  },
  {
    id: 'app-notes',
    appId: 'v-notes',
    appName: 'V-Notes Ghi chú Không gian',
    category: 'Năng suất',
    route: '/v-notes',
    icon: 'FileText',
    launchCount: 31,
    lastUsedAt: '2 ngày trước',
    timestamp: Date.now() - 180000000,
  },
  {
    id: 'app-calc',
    appId: 'v-calc',
    appName: 'V-Calculator Máy tính Khoa học',
    category: 'Tiện ích',
    route: '/app/calculator',
    icon: 'Calculator',
    launchCount: 18,
    lastUsedAt: '3 ngày trước',
    timestamp: Date.now() - 260000000,
  }
];

// 1. TV Watch History Functions
export function getTvWatchHistory(): TvWatchRecord[] {
  try {
    const raw = localStorage.getItem(TV_WATCH_KEY);
    if (!raw) {
      localStorage.setItem(TV_WATCH_KEY, JSON.stringify(SEED_TV_WATCH));
      return SEED_TV_WATCH;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_TV_WATCH;
  } catch {
    return SEED_TV_WATCH;
  }
}

export function recordTvWatch(channel: Partial<Channel> & { name?: string; number?: string; logo?: string; category?: string }): void {
  if (!channel || (!channel.name && !channel.number)) return;
  try {
    const list = getTvWatchHistory();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const timeFormatted = `Hôm nay, ${hours}:${mins} (${day}/${month})`;

    const recordId = `ch-${channel.number || channel.name}`;
    const filtered = list.filter(item => item.channelNumber !== channel.number && item.channelName !== channel.name);

    const newRecord: TvWatchRecord = {
      id: recordId,
      channelName: channel.name || 'Kênh truyền hình',
      channelNumber: channel.number || '000',
      logoUrl: channel.logo || '',
      category: channel.category || 'Tổng hợp',
      watchedAt: timeFormatted,
      timestamp: Date.now(),
    };

    const updated = [newRecord, ...filtered].slice(0, 30);
    localStorage.setItem(TV_WATCH_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vplay:tv_watch_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to record TV watch history:', err);
  }
}

export function clearTvWatchHistory(): void {
  try {
    localStorage.setItem(TV_WATCH_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('vplay:tv_watch_updated', { detail: [] }));
  } catch {}
}

// 2. Space 360 App Usage History Functions
export function getSpace360History(): Space360AppRecord[] {
  try {
    const raw = localStorage.getItem(SPACE360_KEY);
    if (!raw) {
      localStorage.setItem(SPACE360_KEY, JSON.stringify(SEED_SPACE360_APPS));
      return SEED_SPACE360_APPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_SPACE360_APPS;
  } catch {
    return SEED_SPACE360_APPS;
  }
}

export function recordSpace360Launch(app: {
  id: string;
  name: string;
  category?: string;
  route: string;
  icon?: string;
}): void {
  try {
    const list = getSpace360History();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const timeFormatted = `Hôm nay, ${hours}:${mins}`;

    const existingIndex = list.findIndex(item => item.appId === app.id || item.route === app.route);
    let updated: Space360AppRecord[];

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      const newRec: Space360AppRecord = {
        ...existing,
        appName: app.name || existing.appName,
        category: app.category || existing.category,
        launchCount: (existing.launchCount || 0) + 1,
        lastUsedAt: timeFormatted,
        timestamp: Date.now(),
      };
      updated = [newRec, ...list.filter((_, idx) => idx !== existingIndex)];
    } else {
      const newRec: Space360AppRecord = {
        id: `app-${app.id}`,
        appId: app.id,
        appName: app.name,
        category: app.category || 'Ứng dụng Space 360',
        route: app.route,
        icon: app.icon || 'Box',
        launchCount: 1,
        lastUsedAt: timeFormatted,
        timestamp: Date.now(),
      };
      updated = [newRec, ...list];
    }

    const trimmed = updated.slice(0, 30);
    localStorage.setItem(SPACE360_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('vplay:space360_updated', { detail: trimmed }));
  } catch (err) {
    console.error('Failed to record Space 360 app usage:', err);
  }
}

export function clearSpace360History(): void {
  try {
    localStorage.setItem(SPACE360_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('vplay:space360_updated', { detail: [] }));
  } catch {}
}

// 3. Redeems History Functions
export interface RedeemHistoryRecord {
  code: string;
  rewardName: string;
  rewardType: string;
  orbs?: number;
  redeemedAt: string;
}

const REDEEM_KEY = 'vplay_redeemed_gift_codes';

const SEED_REDEEMS: RedeemHistoryRecord[] = [
  {
    code: 'AURORA-2026',
    rewardName: 'Trang phục Minecraft Aurora Hoodie & Cape',
    rewardType: 'SKIN_COSMETIC',
    orbs: 500,
    redeemedAt: '01/10/2026 21:15',
  },
  {
    code: 'VPLAY-VIP-PASS',
    rewardName: 'Thẻ Vplay VIP Pass 30 Ngày',
    rewardType: 'VIP_PASS',
    orbs: 1000,
    redeemedAt: '28/09/2026 15:40',
  }
];

export function getRedeemHistory(): RedeemHistoryRecord[] {
  try {
    const raw = localStorage.getItem(REDEEM_KEY);
    if (!raw) {
      localStorage.setItem(REDEEM_KEY, JSON.stringify(SEED_REDEEMS));
      return SEED_REDEEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_REDEEMS;
  } catch {
    return SEED_REDEEMS;
  }
}

export function clearRedeemHistory(): void {
  try {
    localStorage.setItem(REDEEM_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('vplay:redeem_updated', { detail: [] }));
  } catch {}
}
