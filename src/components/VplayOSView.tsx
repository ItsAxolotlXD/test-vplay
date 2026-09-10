import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Globe,
  CalendarDays,
  Image as ImageIcon,
  Camera,
  Ticket,
  CloudSun,
  Clock,
  Compass,
  GraduationCap,
  StickyNote,
  Box,
  Tv,
  Smartphone,
  Newspaper,
  LayoutGrid,
  Radio,
  MessageSquare,
  Sparkles,
  Coins,
  Users,
  Settings as SettingsIcon,
  Bot,
  Search,
  BookOpen,
  Info,
  Sliders,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  Wifi,
  Battery,
  Sun,
  Moon,
  Gamepad2,
  Folder,
  Calculator,
  Bell,
  Armchair,
  Check,
  RotateCcw,
  Layers,
  Lock,
  Unlock,
  Shield,
  Palette,
  Flame,
  Award,
  Play,
  Pause,
  Music,
  Headphones,
  Mic,
  QrCode,
  SlidersHorizontal,
  Home as HomeIcon,
  LogOut,
  Zap,
  Activity,
  Cpu,
  HardDrive,
  Copy,
  CheckCircle2,
  Share2,
  VolumeX,
  BatteryCharging
} from 'lucide-react';

// Sub-components & pages imported for full in-OS execution (NO jumping to external tabs)
import {
  VPhoneTab,
  VBrowserTab,
  VCalendarTab,
  VGalleryTab,
  VCameraTab,
  VTicketTab,
  VWeatherTab,
  VClockTab,
  VArcadeTab,
  VCalcTab,
  VRemindersTab,
  VXploreTab,
  VFurnitureTab
} from './vapps';
import { VNotesView } from './VNotesView';
import VStudyTab from './VStudyTab';
import VplayVBoxTab from './VplayVBoxTab';
import ExploreVietnamTab from './ExploreVietnamTab';
import { MinecraftContainerEmulator } from './minecraft/MinecraftContainerEmulator';
import { VAppsView } from './VAppsView';
import { VFlowTab } from './vflow/VFlowTab';
import { ChatRoomView } from './chat/ChatRoomView';
import { CopilotTab } from './CopilotTab';
import { VPremiumView } from './VPremiumView';
import VplayVertical from './VplayVertical';
import { LiveTV } from '../pages/LiveTV';
import { News } from '../pages/News';
import { Channels } from '../pages/Channels';
import { Favorites } from '../pages/Favorites';
import { FriendsAndPeople } from '../pages/FriendsAndPeople';
import { LoyaltyPage } from '../pages/LoyaltyPage';
import { Settings } from '../pages/Settings';
import { About } from '../pages/About';
import { FeatureFlags } from '../pages/FeatureFlags';
import { Home } from '../pages/Home';

import { Channel } from '../types';

interface VplayOSViewProps {
  navigate: (path: string, state?: any) => void;
  onSelectChannel?: (channel: Channel) => void;
  channels?: Channel[];
}

export interface OSAppItem {
  id: string;
  name: string;
  category: 'space360' | 'portal' | 'more' | 'system';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string; // Tailwind gradient
  badge?: string;
  badgeColor?: string;
}

// OS Wallpaper URL as explicitly requested by user
const OFFICIAL_OS_WALLPAPER =
  'https://www.iclarified.com/files/ios/iClarified-iPhone-Duo-Wallpaper/iClarified-iPhone-Duo-Wallpaper-Inner-Dark.jpg';

// Backup wallpapers for theme switching
const ALL_WALLPAPERS = [
  {
    id: 'duo_dark',
    name: 'Apple Duo Wallpaper (Dark Inner)',
    url: OFFICIAL_OS_WALLPAPER,
  },
  {
    id: 'liquid_flame',
    name: 'Liquid Flame Nebula',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2160&auto=format&fit=crop',
  },
  {
    id: 'deep_cosmic',
    name: 'Deep Cosmic Indigo',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2160&auto=format&fit=crop',
  },
];

// =========================================================================
// 3 PAGES OF APPS (EACH PAGE HAS EXACTLY 5 ROWS × 4 APPS = 20 APPS)
// =========================================================================

// PAGE 1: 20 Apps (Space 360 Core & Main Media)
const PAGE_1_APPS: OSAppItem[] = [
  // Row 1
  {
    id: 'v_phone',
    name: 'Điện Thoại',
    category: 'space360',
    icon: Phone,
    iconBg: 'from-emerald-500 to-green-600',
  },
  {
    id: 'v_browser',
    name: 'Trình Duyệt',
    category: 'space360',
    icon: Globe,
    iconBg: 'from-sky-400 via-blue-500 to-indigo-600',
  },
  {
    id: 'v_calendar',
    name: 'Lịch 360',
    category: 'space360',
    icon: CalendarDays,
    iconBg: 'from-rose-500 to-red-600',
    badge: 'Âm Lịch',
    badgeColor: 'bg-red-500 text-white',
  },
  {
    id: 'v_gallery',
    name: 'Thư Viện Ảnh',
    category: 'space360',
    icon: ImageIcon,
    iconBg: 'from-amber-400 via-pink-500 to-purple-600',
  },

  // Row 2
  {
    id: 'v_camera',
    name: 'Máy Ảnh',
    category: 'space360',
    icon: Camera,
    iconBg: 'from-slate-700 to-slate-900',
  },
  {
    id: 'v_ticket',
    name: 'Đặt Vé',
    category: 'space360',
    icon: Ticket,
    iconBg: 'from-amber-500 to-orange-600',
    badge: 'Mới',
    badgeColor: 'bg-amber-400 text-black',
  },
  {
    id: 'v_weather',
    name: 'Thời Tiết',
    category: 'space360',
    icon: CloudSun,
    iconBg: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'v_clock',
    name: 'Đồng Hồ',
    category: 'space360',
    icon: Clock,
    iconBg: 'from-zinc-800 to-zinc-950',
  },

  // Row 3
  {
    id: 'space_360',
    name: 'Cổng Space 360',
    category: 'space360',
    icon: Compass,
    iconBg: 'from-emerald-500 via-teal-500 to-cyan-600',
    badge: '17 Apps',
    badgeColor: 'bg-emerald-400 text-black',
  },
  {
    id: 'v_study',
    name: 'V-Study',
    category: 'space360',
    icon: GraduationCap,
    iconBg: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'v_notes',
    name: 'V-Notes',
    category: 'space360',
    icon: StickyNote,
    iconBg: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'v_box',
    name: 'Vplay V-Box',
    category: 'space360',
    icon: Box,
    iconBg: 'from-purple-600 to-indigo-800',
  },

  // Row 4
  {
    id: 'live_tv',
    name: 'Truyền Hình',
    category: 'portal',
    icon: Tv,
    iconBg: 'from-red-600 to-rose-700',
    badge: 'Trực Tiếp',
    badgeColor: 'bg-red-500 text-white',
  },
  {
    id: 'vertical',
    name: 'Vplay Shorts',
    category: 'portal',
    icon: Smartphone,
    iconBg: 'from-rose-500 via-purple-600 to-orange-500',
  },
  {
    id: 'news',
    name: 'Cổng Tin Tức',
    category: 'portal',
    icon: Newspaper,
    iconBg: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'channels',
    name: 'Cổng Nội Dung',
    category: 'portal',
    icon: LayoutGrid,
    iconBg: 'from-indigo-500 to-purple-600',
  },

  // Row 5
  {
    id: 'v_flow',
    name: 'Mạng V-Flow',
    category: 'portal',
    icon: Radio,
    iconBg: 'from-pink-600 to-rose-700',
    badge: 'Feed',
    badgeColor: 'bg-pink-400 text-black',
  },
  {
    id: 'v_chat',
    name: 'V-Chat Voice',
    category: 'portal',
    icon: MessageSquare,
    iconBg: 'from-sky-500 to-blue-600',
  },
  {
    id: 'v_minecraft',
    name: 'Minecraft 360',
    category: 'space360',
    icon: Box,
    iconBg: 'from-emerald-600 to-teal-800',
    badge: 'MC',
    badgeColor: 'bg-emerald-400 text-black',
  },
  {
    id: 'explore_vn',
    name: 'Bản Đồ VN 360',
    category: 'space360',
    icon: Compass,
    iconBg: 'from-rose-500 to-orange-600',
  },
];

// PAGE 2: 20 Apps (Chuyên trang & Menu Xem Thêm)
const PAGE_2_APPS: OSAppItem[] = [
  // Row 1
  {
    id: 'copilot',
    name: 'Copilot AI',
    category: 'more',
    icon: Bot,
    iconBg: 'from-indigo-500 via-purple-500 to-pink-500',
    badge: 'AI',
    badgeColor: 'bg-indigo-300 text-black',
  },
  {
    id: 'v_premium',
    name: 'Vplay VIP',
    category: 'portal',
    icon: Award,
    iconBg: 'from-amber-400 via-yellow-500 to-amber-600',
    badge: 'PRO',
    badgeColor: 'bg-amber-300 text-black',
  },
  {
    id: 'loyalty',
    name: 'Sàn Cược Orbs',
    category: 'portal',
    icon: Coins,
    iconBg: 'from-purple-600 to-indigo-900',
    badge: 'VIP',
    badgeColor: 'bg-purple-300 text-black',
  },
  {
    id: 'friends',
    name: 'Bạn Bè',
    category: 'portal',
    icon: Users,
    iconBg: 'from-teal-500 to-emerald-600',
  },

  // Row 2
  {
    id: 'favorites',
    name: 'Kênh Đã Lưu',
    category: 'portal',
    icon: Flame,
    iconBg: 'from-red-500 to-orange-600',
  },
  {
    id: 'v_calc',
    name: 'Máy Tính V-Calc',
    category: 'space360',
    icon: Calculator,
    iconBg: 'from-orange-500 to-amber-600',
  },
  {
    id: 'v_files',
    name: 'Tệp VXplore',
    category: 'space360',
    icon: Folder,
    iconBg: 'from-sky-600 to-blue-700',
  },
  {
    id: 'v_reminders',
    name: 'Nhắc Nhở',
    category: 'space360',
    icon: Bell,
    iconBg: 'from-indigo-600 to-purple-700',
  },

  // Row 3
  {
    id: 'v_arcade',
    name: 'V-Arcade',
    category: 'space360',
    icon: Gamepad2,
    iconBg: 'from-pink-600 to-rose-700',
  },
  {
    id: 'v_furniture',
    name: '3D Furniture',
    category: 'space360',
    icon: Armchair,
    iconBg: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'vplay_users',
    name: 'Thành Viên',
    category: 'space360',
    icon: Users,
    iconBg: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'ore_settings',
    name: 'Khoáng Vật Ore',
    category: 'space360',
    icon: Coins,
    iconBg: 'from-amber-500 to-yellow-600',
  },

  // Row 4
  {
    id: 'activation_code',
    name: 'Mã Kích Hoạt',
    category: 'more',
    icon: Ticket,
    iconBg: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'spotlight_search',
    name: 'Tìm Kiếm ⌘K',
    category: 'more',
    icon: Search,
    iconBg: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'fandom_logos',
    name: 'Fandom Logos',
    category: 'more',
    icon: Sparkles,
    iconBg: 'from-pink-500 to-rose-600',
  },
  {
    id: 'notifications_app',
    name: 'Thông Báo',
    category: 'system',
    icon: Bell,
    iconBg: 'from-red-600 to-rose-800',
    badge: '3',
    badgeColor: 'bg-red-400 text-white',
  },

  // Row 5
  {
    id: 'about_vplay',
    name: 'Giới Thiệu',
    category: 'more',
    icon: Info,
    iconBg: 'from-sky-500 to-blue-700',
  },
  {
    id: 'join_discord',
    name: 'Waves Discord',
    category: 'more',
    icon: MessageSquare,
    iconBg: 'from-[#5865F2] to-[#404EED]',
    badge: 'Cộng đồng',
    badgeColor: 'bg-indigo-300 text-black',
  },
  {
    id: 'feature_flags',
    name: 'Tính Năng Labs',
    category: 'system',
    icon: Sliders,
    iconBg: 'from-purple-500 to-pink-600',
    badge: 'Beta',
    badgeColor: 'bg-purple-300 text-black',
  },
  {
    id: 'settings',
    name: 'Cài Đặt',
    category: 'system',
    icon: SettingsIcon,
    iconBg: 'from-zinc-600 to-zinc-800',
  },
];

// PAGE 3: 20 Apps (Tiện ích hệ thống & Trang mở rộng)
const PAGE_3_APPS: OSAppItem[] = [
  // Row 1
  {
    id: 'home_page',
    name: 'Trang Chủ',
    category: 'portal',
    icon: HomeIcon,
    iconBg: 'from-rose-600 to-pink-700',
  },
  {
    id: 'design_system',
    name: 'Giao Diện UI',
    category: 'more',
    icon: Palette,
    iconBg: 'from-fuchsia-600 to-purple-800',
  },
  {
    id: 'performance_stress',
    name: 'Thử Tải Trọng',
    category: 'more',
    icon: Shield,
    iconBg: 'from-red-600 to-amber-700',
  },
  {
    id: 'control_center',
    name: 'Control Center',
    category: 'system',
    icon: SlidersHorizontal,
    iconBg: 'from-slate-600 to-slate-800',
  },

  // Row 2
  {
    id: 'change_wallpaper',
    name: 'Đổi Hình Nền',
    category: 'system',
    icon: ImageIcon,
    iconBg: 'from-cyan-600 to-blue-800',
  },
  {
    id: 'lock_screen',
    name: 'Khóa Màn Hình',
    category: 'system',
    icon: Lock,
    iconBg: 'from-zinc-700 to-zinc-900',
  },
  {
    id: 'help_center',
    name: 'Trợ Giúp',
    category: 'more',
    icon: BookOpen,
    iconBg: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'spatial_audio',
    name: 'Âm Thanh V-Audio',
    category: 'system',
    icon: Headphones,
    iconBg: 'from-teal-600 to-emerald-700',
  },

  // Row 3
  {
    id: 'voice_recorder',
    name: 'Ghi Âm 360',
    category: 'space360',
    icon: Mic,
    iconBg: 'from-red-500 to-rose-700',
  },
  {
    id: 'qr_scanner',
    name: 'Quét Mã QR',
    category: 'system',
    icon: QrCode,
    iconBg: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'battery_manager',
    name: 'Pin & Năng Lượng',
    category: 'system',
    icon: Battery,
    iconBg: 'from-green-600 to-emerald-800',
  },
  {
    id: 'network_stats',
    name: 'Mạng & Wi-Fi',
    category: 'system',
    icon: Wifi,
    iconBg: 'from-blue-600 to-sky-700',
  },

  // Row 4
  {
    id: 'music_flow',
    name: 'Nhạc Không Dây',
    category: 'portal',
    icon: Music,
    iconBg: 'from-pink-500 to-purple-700',
  },
  {
    id: 'security_shield',
    name: 'Bảo Mật Vplay',
    category: 'system',
    icon: Shield,
    iconBg: 'from-indigo-600 to-blue-900',
  },
  {
    id: 'focus_mode',
    name: 'Tập Trung',
    category: 'system',
    icon: Moon,
    iconBg: 'from-purple-700 to-indigo-900',
  },
  {
    id: 'brightness_adjust',
    name: 'Độ Sáng',
    category: 'system',
    icon: Sun,
    iconBg: 'from-yellow-500 to-amber-600',
  },

  // Row 5
  {
    id: 'v_speed',
    name: 'Tối Ưu Máy',
    category: 'system',
    icon: RotateCcw,
    iconBg: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'v_widgets',
    name: 'Widgets Màn Hình',
    category: 'system',
    icon: Layers,
    iconBg: 'from-orange-500 to-rose-600',
  },
  {
    id: 'full_spotlight',
    name: 'Tìm Nhanh',
    category: 'more',
    icon: Search,
    iconBg: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'system_info',
    name: 'Về VplayOS',
    category: 'system',
    icon: Info,
    iconBg: 'from-zinc-700 to-slate-900',
    badge: 'v2.8',
    badgeColor: 'bg-cyan-500 text-black',
  },
];

const PAGES_DATA = [PAGE_1_APPS, PAGE_2_APPS, PAGE_3_APPS];

export const VplayOSView: React.FC<VplayOSViewProps> = ({
  navigate,
  onSelectChannel,
  channels = [],
}) => {
  // Page index (0, 1, 2)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [activeApp, setActiveApp] = useState<OSAppItem | null>(null);

  // App launch zoom animation origin coordinates
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);

  // Dynamic Island States
  const [isIslandExpanded, setIsIslandExpanded] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; subtitle: string }>({
    title: 'VTV3 HD - Trực Tiếp',
    subtitle: 'Vplay Stream Live • 1080p 60fps',
  });

  // Other OS Overlays
  const [showWidgets, setShowWidgets] = useState<boolean>(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wallpaperIndex, setWallpaperIndex] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Gesture status indicator (visual feedback for swipes)
  const [gestureNotice, setGestureNotice] = useState<string | null>(null);
  const gestureNoticeTimeout = useRef<any>(null);

  const showGestureFeedback = (text: string) => {
    setGestureNotice(text);
    if (gestureNoticeTimeout.current) clearTimeout(gestureNoticeTimeout.current);
    gestureNoticeTimeout.current = setTimeout(() => {
      setGestureNotice(null);
    }, 1200);
  };

  // Status Bar Real-time Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Control Center Sliders
  const [brightness, setBrightness] = useState<number>(95);
  const [volume, setVolume] = useState<number>(85);
  const [wifiEnabled, setWifiEnabled] = useState<boolean>(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(true);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);

      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = now.getMonth() + 1;
      setCurrentDate(`${dayName}, ${day} thg ${month}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeApp) {
          setActiveApp(null);
          showGestureFeedback('Đã thoát về màn hình chính');
        } else if (isIslandExpanded) {
          setIsIslandExpanded(false);
        } else if (isSpotlightOpen) {
          setIsSpotlightOpen(false);
        } else if (isControlCenterOpen) {
          setIsControlCenterOpen(false);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (!activeApp && !isSpotlightOpen) {
        if (e.key === 'ArrowRight') {
          setCurrentPage((prev) => Math.min(prev + 1, PAGES_DATA.length - 1));
        } else if (e.key === 'ArrowLeft') {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp, isIslandExpanded, isSpotlightOpen, isControlCenterOpen]);

  // Handle opening an app with zoom coordinate extraction
  const handleLaunchApp = (app: OSAppItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setZoomOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setZoomOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    // Direct system quick-actions
    if (app.id === 'spotlight_search' || app.id === 'full_spotlight') {
      setIsSpotlightOpen(true);
      return;
    }
    if (app.id === 'control_center') {
      setIsControlCenterOpen(true);
      return;
    }
    if (app.id === 'lock_screen') {
      setIsLocked(true);
      return;
    }
    if (app.id === 'change_wallpaper') {
      setWallpaperIndex((prev) => (prev + 1) % ALL_WALLPAPERS.length);
      showGestureFeedback('Đã đổi hình nền OS');
      return;
    }

    // ALL APPS OPEN FULL SCREEN IN-OS (NO WINDOW, NO TAB JUMPING)
    setActiveApp(app);
  };

  // Search filter across all pages
  const allApps = useMemo(() => [...PAGE_1_APPS, ...PAGE_2_APPS, ...PAGE_3_APPS], []);
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return allApps.slice(0, 10);
    const q = searchQuery.toLowerCase().trim();
    return allApps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.badge && a.badge.toLowerCase().includes(q))
    );
  }, [allApps, searchQuery]);

  // Current active channel or default
  const activeChannel = channels[0] || {
    id: 'vtv3',
    slug: 'vtv3-hd',
    name: 'VTV3 HD',
    category: 'VTV',
    streamUrl: 'https://vtv3.example.com/stream.m3u8',
  };

  // Render ANY app in 100% full screen
  const renderRunningApp = () => {
    if (!activeApp) return null;

    switch (activeApp.id) {
      // Space 360 Core
      case 'v_phone':
        return <VPhoneTab />;
      case 'v_browser':
        return <VBrowserTab />;
      case 'v_calendar':
        return <VCalendarTab />;
      case 'v_gallery':
        return <VGalleryTab />;
      case 'v_camera':
        return <VCameraTab />;
      case 'v_ticket':
        return <VTicketTab />;
      case 'v_weather':
        return <VWeatherTab />;
      case 'v_clock':
        return <VClockTab />;
      case 'space_360':
        return <VAppsView navigate={(p) => {}} initialAppId="v_arcade" />;
      case 'v_study':
        return <VStudyTab />;
      case 'v_notes':
        return <VNotesView />;
      case 'v_box':
        return <VplayVBoxTab />;
      case 'v_calc':
        return <VCalcTab />;
      case 'v_files':
        return <VXploreTab />;
      case 'v_reminders':
        return <VRemindersTab />;
      case 'v_arcade':
        return <VArcadeTab />;
      case 'v_furniture':
        return <VFurnitureTab />;
      case 'v_minecraft':
        return <MinecraftContainerEmulator />;
      case 'explore_vn':
        return <ExploreVietnamTab />;

      // Portal & Media Apps
      case 'live_tv':
        return (
          <LiveTV
            currentChannel={activeChannel as any}
            onSelectChannel={onSelectChannel || (() => {})}
            channels={channels}
            onOpenCustomStreamModal={() => {}}
          />
        );
      case 'vertical':
        return <VplayVertical channels={channels} onBack={() => setActiveApp(null)} />;
      case 'news':
        return <News navigate={(p) => {}} />;
      case 'channels':
        return (
          <Channels
            channels={channels}
            onSelectChannel={onSelectChannel || (() => {})}
            navigate={(p) => {}}
            onOpenCustomStreamModal={() => {}}
          />
        );
      case 'v_flow':
        return <VFlowTab navigate={(p) => {}} />;
      case 'v_chat':
        return <ChatRoomView />;
      case 'copilot':
        return <CopilotTab onBack={() => setActiveApp(null)} navigate={(p) => {}} />;
      case 'v_premium':
        return <VPremiumView initialSubTab="vbank" />;
      case 'loyalty':
        return <LoyaltyPage navigate={(p) => {}} />;
      case 'friends':
      case 'vplay_users':
        return <FriendsAndPeople navigate={(p) => {}} />;
      case 'favorites':
        return (
          <Favorites
            channels={channels}
            onSelectChannel={onSelectChannel || (() => {})}
            navigate={(p) => {}}
          />
        );
      case 'home_page':
        return (
          <Home
            navigate={(p) => {}}
            onSelectChannel={onSelectChannel || (() => {})}
            channels={channels}
          />
        );

      // System & Tools Apps
      case 'settings':
        return <Settings navigate={(p) => {}} />;
      case 'about_vplay':
      case 'system_info':
      case 'help_center':
        return <About />;
      case 'feature_flags':
        return <FeatureFlags />;

      // In-OS Dedicated Special App Views
      case 'activation_code':
        return (
          <div className="max-w-xl mx-auto py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-5 shadow-xl">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Trung Tâm Kích Hoạt Vplay VIP</h2>
            <p className="text-sm text-slate-400 mb-6">
              Nhập mã quà tặng hoặc mã khuyến mãi của bạn để mở khóa đặc quyền truyền hình 4K HDR.
            </p>
            <div className="flex gap-2 max-w-md mx-auto mb-4">
              <input
                type="text"
                placeholder="Nhập mã: VPLAY-VIP-XXXX"
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 font-mono text-center tracking-wider"
              />
              <button
                onClick={() => showGestureFeedback('Mã kích hoạt hợp lệ! Đã nạp 500 Orbs')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg cursor-pointer hover:opacity-95"
              >
                Kích Hoạt
              </button>
            </div>
          </div>
        );

      case 'fandom_logos':
        return (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-7 h-7 text-pink-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Bộ Sưu Tập Fandom & Motion Idents</h2>
                <p className="text-xs text-slate-400">Biểu tượng đồ họa truyền hình Việt Nam qua các thời kỳ</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {['VTV1 1996', 'VTV3 1996 Tam Giác', 'HTV9 Cánh Buồm', 'VTC Digital 2004', 'VTV6 Cầu Vồng', 'BTV Bình Dương', 'VTV2 Công Nghệ', 'SCTV Cáp'].map((name, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/30 to-purple-600/30 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Tv className="w-8 h-8 text-rose-300" />
                  </div>
                  <span className="text-xs font-bold text-white">{name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Motion Ident Vector</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications_app':
        return (
          <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-rose-400" />
              Trung Tâm Thông Báo
            </h2>
            {[
              { title: 'VTV3 HD: Trực tiếp V-League 2026', time: '5 phút trước', desc: 'Trận cầu tâm điểm giữa Hà Nội FC và Nam Định đang phát sóng.' },
              { title: 'VplayOS 2.8 Đã Sẵn Sàng', time: '1 giờ trước', desc: 'Toàn bộ ứng dụng đã hỗ trợ trải nghiệm full screen và cử chỉ vuốt chạm.' },
              { title: 'Nhận thưởng 150 Orbs hằng ngày', time: 'Hôm nay', desc: 'Bạn đã đăng nhập Vplay liên tiếp 5 ngày. Nhận ngay huy hiệu Fan Cứng!' },
            ].map((n, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[11px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300">{n.desc}</p>
              </div>
            ))}
          </div>
        );

      case 'join_discord':
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#5865F2] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Waves Discord Community</h2>
            <p className="text-sm text-slate-300 mb-6">
              Giao lưu cùng 25,000+ thành viên đam mê truyền hình, stream và thiết kế Motion Graphics.
            </p>
            <button
              onClick={() => showGestureFeedback('Đang kết nối Discord server...')}
              className="w-full py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] font-bold text-white shadow-xl cursor-pointer transition-colors"
            >
              Tham Gia Ngay
            </button>
          </div>
        );

      case 'spatial_audio':
      case 'music_flow':
        return (
          <div className="max-w-xl mx-auto py-12 px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <Headphones className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Âm Thanh Không Gian V-Spatial</h2>
            <p className="text-xs text-emerald-300 font-mono mb-6">DOLBY ATMOS • LOSSLESS 24-BIT / 96KHZ</p>
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-300 font-bold">Vplay Live Soundtrack</span>
                <span className="text-xs text-emerald-400 font-mono">Đang Bật</span>
              </div>
              <div className="flex items-end justify-center gap-1.5 h-16 mb-4">
                {[40, 70, 90, 60, 85, 95, 50, 80, 100, 65, 45, 80, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-2 rounded-full bg-gradient-to-t from-teal-500 to-cyan-300 animate-pulse"
                  />
                ))}
              </div>
              <button
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="px-8 py-3 rounded-2xl bg-white text-black font-bold flex items-center gap-2 mx-auto cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                {isPlayingMusic ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlayingMusic ? 'Tạm Dừng' : 'Phát Nhạc'}</span>
              </button>
            </div>
          </div>
        );

      case 'voice_recorder':
        return (
          <div className="max-w-md mx-auto py-12 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Mic className="w-10 h-10 text-white animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ghi Âm Giọng Nói 360</h2>
            <p className="text-xs text-slate-400 mb-8">Chất lượng thu âm Stereo Studio với chống ồn AI</p>
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 mb-6">
              <div className="text-4xl font-mono font-black text-rose-400 mb-4">00:04:28</div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => showGestureFeedback('Đã dừng bản ghi âm')}
                  className="px-6 py-2.5 rounded-2xl bg-red-600 font-bold text-white cursor-pointer hover:bg-red-700"
                >
                  Dừng
                </button>
                <button
                  onClick={() => showGestureFeedback('Đã lưu vào V-Files')}
                  className="px-6 py-2.5 rounded-2xl bg-white/20 font-bold text-white cursor-pointer hover:bg-white/30"
                >
                  Lưu Tệp
                </button>
              </div>
            </div>
          </div>
        );

      case 'qr_scanner':
        return (
          <div className="max-w-md mx-auto py-12 px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Máy Quét QR Vplay</h2>
            <p className="text-xs text-slate-400 mb-6">Hướng camera về phía mã QR để kết nối luồng phát</p>
            <div className="relative w-64 h-64 mx-auto rounded-3xl border-2 border-dashed border-cyan-400 flex items-center justify-center bg-black/40 overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_1.5s_infinite]" />
              <QrCode className="w-32 h-32 text-white/30" />
            </div>
            <button
              onClick={() => showGestureFeedback('Đã quét: Luồng VTV Cần Thơ HD')}
              className="px-6 py-3 rounded-2xl bg-cyan-500 font-bold text-black cursor-pointer hover:bg-cyan-400"
            >
              Mô Phỏng Quét QR
            </button>
          </div>
        );

      case 'battery_manager':
        return (
          <div className="max-w-lg mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BatteryCharging className="w-6 h-6 text-emerald-400" />
              Tình Trạng Pin & Tiết Kiệm Điện
            </h2>
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-300">Dung lượng hiện tại</span>
                <span className="text-2xl font-black text-emerald-400">100%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden mb-4">
                <div className="w-full h-full bg-emerald-400 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400">Tình trạng pin</div>
                  <div className="text-sm font-bold text-white mt-0.5">Xuất sắc (100%)</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400">Thời gian xem TV</div>
                  <div className="text-sm font-bold text-white mt-0.5">Còn ~14.5 Giờ</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'network_stats':
        return (
          <div className="max-w-lg mx-auto py-10 px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Đo Tốc Độ Mạng V-Speed</h2>
            <p className="text-xs text-slate-400 mb-6">Kiểm tra độ trễ luồng truyền hình trực tiếp</p>
            <div className="p-8 rounded-3xl bg-white/10 border border-white/15 mb-6">
              <div className="text-5xl font-mono font-black text-cyan-400 mb-2">285.4</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider mb-6">Mbps Download • 5G Wi-Fi 6</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5">
                  <div className="text-slate-400">Ping</div>
                  <div className="font-bold text-emerald-400 mt-1">4 ms</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5">
                  <div className="text-slate-400">Upload</div>
                  <div className="font-bold text-blue-400 mt-1">98.2 Mbps</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5">
                  <div className="text-slate-400">Jitter</div>
                  <div className="font-bold text-amber-400 mt-1">0.8 ms</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security_shield':
        return (
          <div className="max-w-lg mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              Bảo Mật & Quyền Riêng Tư
            </h2>
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 space-y-3">
              {[
                { title: 'Sandbox Cách Ly An Toàn', desc: 'Tất cả ứng dụng chạy trong vùng chứa an toàn' },
                { title: 'Chống Theo Dõi Trình Duyệt', desc: 'Bảo vệ Cookie và ngăn chặn mã quảng cáo độc hại' },
                { title: 'Mã Hóa Kết Nối SSL 256-bit', desc: 'Luồng truyền hình trực tiếp bảo mật tuyệt đối' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-xl mx-auto py-16 px-4 text-center text-white">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${activeApp.iconBg} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
              <activeApp.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{activeApp.name}</h3>
            <p className="text-sm text-slate-400 mb-6">
              Ứng dụng đang hoạt động ở chế độ toàn màn hình trong VplayOS.
            </p>
            <button
              onClick={() => setActiveApp(null)}
              className="px-6 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold cursor-pointer"
            >
              Về Màn Hình Chính
            </button>
          </div>
        );
    }
  };

  // Dock items
  const dockApps = [
    PAGE_1_APPS.find((a) => a.id === 'v_phone')!,
    PAGE_1_APPS.find((a) => a.id === 'v_browser')!,
    PAGE_1_APPS.find((a) => a.id === 'live_tv')!,
    PAGE_1_APPS.find((a) => a.id === 'v_flow')!,
    PAGE_1_APPS.find((a) => a.id === 'v_gallery')!,
    PAGE_1_APPS.find((a) => a.id === 'v_ticket')!,
    PAGE_1_APPS.find((a) => a.id === 'v_notes')!,
    PAGE_2_APPS.find((a) => a.id === 'settings')!,
  ];

  return (
    <div
      id="vplayos-fullscreen-root"
      onDoubleClick={() => {
        setIsControlCenterOpen((prev) => !prev);
        showGestureFeedback('Chạm đúp: Mở Trung Tâm Điều Khiển');
      }}
      style={{
        backgroundImage: `url("${ALL_WALLPAPERS[wallpaperIndex].url}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: `brightness(${brightness}%)`,
      }}
      className="fixed inset-0 w-screen h-screen overflow-hidden text-white flex flex-col justify-between select-none z-[100]"
    >
      {/* Dark tint overlay with smooth gradient */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none -z-10" />

      {/* Touch Gesture Notice Toast (Floating HUD) */}
      <AnimatePresence>
        {gestureNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full bg-black/80 backdrop-blur-2xl border border-white/20 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{gestureNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          1. DYNAMIC ISLAND (TOP CENTER INTERACTIVE PILL)
         ========================================================================= */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
        <motion.div
          layout
          initial={false}
          animate={{
            width: isIslandExpanded ? 390 : 210,
            height: isIslandExpanded ? 160 : 36,
            borderRadius: isIslandExpanded ? 34 : 9999,
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
          }}
          onClick={() => {
            setIsIslandExpanded(!isIslandExpanded);
            showGestureFeedback(isIslandExpanded ? 'Đã thu nhỏ Đảo Động' : 'Đã mở rộng Đảo Động');
          }}
          className="bg-black/90 backdrop-blur-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.85)] px-3.5 py-1.5 flex flex-col justify-between overflow-hidden cursor-pointer group"
        >
          {/* COMPACT DYNAMIC ISLAND STATE */}
          {!isIslandExpanded && (
            <div className="w-full h-full flex items-center justify-between gap-3 text-white text-xs font-semibold">
              {/* Left: Music Note or Mini Live Waveform */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-sm">
                  <Music className="w-2.5 h-2.5 text-white animate-pulse" />
                </div>
                <span className="text-[11px] font-bold text-white/90 truncate max-w-[75px]">
                  {activeApp ? activeApp.name : 'Vplay Live'}
                </span>
              </div>

              {/* Right: Audio Waveform Bars */}
              <div className="flex items-center gap-1">
                <div className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                <div className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.1s]" />
                <div className="w-0.5 h-4 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                <div className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s]" />
              </div>
            </div>
          )}

          {/* EXPANDED DYNAMIC ISLAND STATE */}
          {isIslandExpanded && (
            <div
              className="w-full h-full flex flex-col justify-between p-1 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header row with Track Info and Close button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md">
                    <Tv className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {currentTrack.title}
                    </h4>
                    <p className="text-[10px] text-white/60 leading-tight">
                      {currentTrack.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsIslandExpanded(false)}
                  className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Waveform Scrubber bar */}
              <div className="w-full flex items-center gap-2 my-1">
                <span className="text-[9px] font-mono text-white/50">LIVE</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden flex items-center">
                  <div className="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-rose-500 rounded-full" />
                </div>
                <span className="text-[9px] font-mono text-emerald-400">1080p 60fps</span>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsIslandExpanded(false);
                      handleLaunchApp(PAGE_1_APPS.find((a) => a.id === 'live_tv')!);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold flex items-center gap-1.5 text-slate-200 cursor-pointer transition-all"
                  >
                    <Tv className="w-3 h-3 text-cyan-400" />
                    <span>Mở Live TV</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsIslandExpanded(false);
                      setIsControlCenterOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold flex items-center gap-1.5 text-slate-200 cursor-pointer transition-all"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>Điều Khiển</span>
                  </button>
                </div>

                {/* Media Play/Pause */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="w-8 h-8 rounded-full bg-white text-black hover:scale-105 flex items-center justify-center cursor-pointer transition-all shadow-md"
                  >
                    {isPlayingMusic ? (
                      <Pause className="w-3.5 h-3.5 fill-black" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* =========================================================================
          2. TOP STATUS BAR (APPLE IPADOS STYLE) WITH GESTURE ZONES
         ========================================================================= */}
      <header
        id="vplayos-status-bar"
        className="w-full px-6 sm:px-10 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-white/95 z-30 select-none"
      >
        {/* Left: Clock & Date */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tracking-tight text-white drop-shadow-md">
            {currentTime || '9:41'}
          </span>
          <span className="text-xs font-medium text-white/80 hidden sm:inline drop-shadow-md">
            {currentDate}
          </span>
        </div>

        {/* Right: Quick actions & Gestures */}
        <div className="flex items-center gap-3">
          {/* Spotlight Search Trigger */}
          <button
            id="vplayos-spotlight-btn"
            onClick={() => setIsSpotlightOpen(true)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer"
            title="Tìm kiếm ứng dụng Spotlight (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Widgets Toggle */}
          <button
            onClick={() => setShowWidgets((prev) => !prev)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              showWidgets ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white/80'
            }`}
            title="Bật/Tắt Today View Widgets"
          >
            <Layers className="w-4 h-4 text-amber-300" />
          </button>

          {/* Wi-Fi Icon */}
          <Wifi className="w-4 h-4 text-white/90" />

          {/* Control Center Pill (Swipe down gesture zone) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y > 30 || velocity.y > 150) {
                setIsControlCenterOpen(true);
                showGestureFeedback('Vuốt góc phải: Mở Control Center');
              }
            }}
            onClick={() => setIsControlCenterOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 hover:bg-black/55 border border-white/15 backdrop-blur-md cursor-pointer transition-all shadow-md"
            title="Chạm hoặc Vuốt xuống để mở Trung Tâm Điều Khiển"
          >
            <span className="text-[11px] font-mono font-bold">100%</span>
            <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* =========================================================================
          3. MAIN DESKTOP AREA: 5 ROWS × 4 APPS WITH HORIZONTAL SWIPE & SPOTLIGHT DRAG
         ========================================================================= */}
      <main className="flex-1 w-full relative flex items-center justify-center px-4 sm:px-8 md:px-12 py-2 overflow-hidden">
        {/* Left Today View Widgets */}
        {showWidgets && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="hidden xl:flex flex-col gap-4 w-72 shrink-0 py-4 mr-6 z-20"
          >
            <div className="p-4 rounded-[26px] bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl text-white">
              <div className="text-3xl font-black tracking-tight">{currentTime || '09:41'}</div>
              <div className="text-xs text-rose-300 font-medium mt-0.5">{currentDate}</div>
              <div className="mt-3 text-[11px] text-white/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                VplayOS Full Screen Active
              </div>
            </div>

            <div
              onClick={() => handleLaunchApp(PAGE_1_APPS.find((a) => a.id === 'v_weather')!)}
              className="p-4 rounded-[26px] bg-gradient-to-br from-blue-600/40 via-cyan-600/30 to-black/50 backdrop-blur-3xl border border-white/20 shadow-2xl text-white cursor-pointer hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-200">Việt Nam</span>
                <CloudSun className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black">32°</span>
                <span className="text-xs text-white/80">Nắng ráo • AQI 38 Tốt</span>
              </div>
            </div>

            <div className="p-4 rounded-[26px] bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl text-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Phím Tắt Nhanh
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLaunchApp(PAGE_1_APPS.find((a) => a.id === 'v_phone')!)}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer truncate"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="truncate">Gọi Điện</span>
                </button>
                <button
                  onClick={() => handleLaunchApp(PAGE_1_APPS.find((a) => a.id === 'v_ticket')!)}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer truncate"
                >
                  <Ticket className="w-4 h-4 shrink-0" />
                  <span className="truncate">Đặt Vé</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Chevrons */}
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="absolute left-2 sm:left-4 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
            title="Trang trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentPage < PAGES_DATA.length - 1 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, PAGES_DATA.length - 1))}
            className="absolute right-2 sm:right-4 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
            title="Trang tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* SWIPABLE HORIZONTAL PAGES CONTAINER (5 ROWS × 4 APPS) */}
        <div className="flex-1 max-w-4xl h-full flex flex-col justify-center py-2 relative">
          <motion.div
            key={`page-container-${currentPage}`}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset, velocity }) => {
              // Vertical drag down from center -> Spotlight
              if (offset.y > 60 || velocity.y > 300) {
                setIsSpotlightOpen(true);
                showGestureFeedback('Vuốt xuống: Tìm kiếm Spotlight');
                return;
              }
              // Horizontal swipe -> Pages
              const swipe = offset.x;
              if (swipe < -60 || velocity.x < -300) {
                if (currentPage < PAGES_DATA.length - 1) {
                  setCurrentPage((prev) => prev + 1);
                  showGestureFeedback(`Đã chuyển sang Trang ${currentPage + 2}`);
                }
              } else if (swipe > 60 || velocity.x > 300) {
                if (currentPage > 0) {
                  setCurrentPage((prev) => prev - 1);
                  showGestureFeedback(`Đã chuyển sang Trang ${currentPage}`);
                }
              }
            }}
            initial={{ opacity: 0, x: currentPage === 0 ? -60 : 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentPage === 0 ? 60 : -60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            {/* THE 5 ROWS × 4 COLUMNS GRID = 20 APPS PER PAGE */}
            <div className="grid grid-cols-4 grid-rows-5 gap-x-6 sm:gap-x-12 md:gap-x-16 gap-y-3 sm:gap-y-4 md:gap-y-5 items-center justify-items-center w-full">
              {PAGES_DATA[currentPage].map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    id={`vplayos-app-${app.id}`}
                    onClick={(e) => handleLaunchApp(app, e)}
                    className="group flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-90 focus:outline-none w-[72px] sm:w-[84px]"
                    title={app.name}
                  >
                    {/* App Squircle Icon */}
                    <div className="relative">
                      <div
                        className={`w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-[18px] sm:rounded-[22px] bg-gradient-to-tr ${app.iconBg} flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.45)] border border-white/25 group-hover:scale-108 group-hover:shadow-[0_12px_30px_rgba(255,255,255,0.25)] transition-all duration-200`}
                      >
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
                      </div>

                      {/* App Badge */}
                      {app.badge && (
                        <span
                          className={`absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full shadow-lg border border-white/30 whitespace-nowrap ${
                            app.badgeColor || 'bg-red-500 text-white'
                          }`}
                        >
                          {app.badge}
                        </span>
                      )}
                    </div>

                    {/* App Label */}
                    <span className="mt-1.5 text-xs sm:text-[13px] font-medium text-white/95 text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] max-w-full truncate group-hover:text-white transition-colors">
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            TRUE FULL SCREEN APP VIEW (EDGE-TO-EDGE, NO WINDOW, NO EXTERNAL TAB JUMP)
           ========================================================================= */}
        <AnimatePresence>
          {activeApp && (
            <motion.div
              key={`fullscreen-app-${activeApp.id}`}
              initial={{
                opacity: 0,
                scale: 0.15,
                x: zoomOrigin ? zoomOrigin.x - window.innerWidth / 2 : 0,
                y: zoomOrigin ? zoomOrigin.y - window.innerHeight / 2 : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.15,
                x: zoomOrigin ? zoomOrigin.x - window.innerWidth / 2 : 0,
                y: zoomOrigin ? zoomOrigin.y - window.innerHeight / 2 : 0,
                transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
              }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 280,
              }}
              className="fixed inset-0 z-40 bg-[#0E0614] text-white flex flex-col overflow-hidden w-screen h-screen"
            >
              {/* Sleek Top App Header */}
              <div className="w-full px-4 sm:px-6 py-2.5 bg-[#170C1E]/95 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between select-none z-10 shrink-0">
                {/* Left: App Icon & Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${activeApp.iconBg} flex items-center justify-center shadow-md`}
                  >
                    <activeApp.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white truncate">{activeApp.name}</span>
                  {activeApp.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        activeApp.badgeColor || 'bg-white/20 text-white'
                      }`}
                    >
                      {activeApp.badge}
                    </span>
                  )}
                </div>

                {/* Center: Apple 3-dot Multitasking Bar */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  title="Tùy chọn đa nhiệm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>

                {/* Right: Close App Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveApp(null);
                      showGestureFeedback('Đã đóng ứng dụng');
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-white/80 transition-all cursor-pointer shadow-sm"
                    title="Đóng ứng dụng (Vuốt thanh dưới lên để thoát)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edge-to-edge App Body */}
              <div className="flex-1 w-full overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
                {renderRunningApp()}
              </div>

              {/* Bottom In-App Swipe-up Home Bar with Touch/Drag Gesture */}
              <div className="w-full py-2 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl border-t border-white/5 shrink-0 select-none">
                <motion.div
                  drag="y"
                  dragConstraints={{ top: -120, bottom: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (offset.y < -35 || velocity.y < -180) {
                      setActiveApp(null);
                      showGestureFeedback('Vuốt lên: Đã thoát về màn hình chính');
                    }
                  }}
                  onClick={() => {
                    setActiveApp(null);
                    showGestureFeedback('Đã về màn hình chính');
                  }}
                  className="w-44 h-1.5 rounded-full bg-white/70 hover:bg-white cursor-pointer transition-all hover:scale-105 shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
                  title="Vuốt lên hoặc Chạm để về Màn hình chính"
                />
                <span className="text-[10px] text-white/40 mt-1 font-mono tracking-wider">
                  VUỐT LÊN ĐỂ VỀ HOME
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =========================================================================
          4. BOTTOM AREA: PAGE INDICATOR DOTS & FLOATING FROSTED DOCK
         ========================================================================= */}
      <footer className="w-full flex flex-col items-center justify-end pb-3 pt-1 z-30 select-none">
        {/* Pagination Dots ([•  ○  ○]) */}
        <div className="flex items-center justify-center gap-2.5 py-2">
          {PAGES_DATA.map((_, idx) => (
            <button
              key={`page-dot-${idx}`}
              onClick={() => {
                setCurrentPage(idx);
                showGestureFeedback(`Trang ${idx + 1}`);
              }}
              className={`transition-all duration-200 cursor-pointer ${
                currentPage === idx
                  ? 'w-7 h-2 rounded-full bg-white shadow-lg'
                  : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/75'
              }`}
              title={`Trang ${idx + 1}`}
            />
          ))}
        </div>

        {/* Floating Apple Dock with Frosted Glass */}
        <div className="flex items-center gap-2.5 sm:gap-4 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[26px] sm:rounded-[30px] bg-white/20 dark:bg-black/40 backdrop-blur-3xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {dockApps.map((dockApp) => {
            const DockIcon = dockApp.icon;
            return (
              <button
                key={`dock-${dockApp.id}`}
                onClick={(e) => handleLaunchApp(dockApp, e)}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-90"
                title={dockApp.name}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[15px] sm:rounded-[18px] bg-gradient-to-tr ${dockApp.iconBg} flex items-center justify-center shadow-lg border border-white/25 group-hover:scale-110 transition-transform`}
                >
                  <DockIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
                </div>
                {activeApp?.id === dockApp.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-md mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Apple Home Indicator Bar (Swipe-up home gesture on home screen) */}
        <motion.div
          id="vplayos-home-indicator"
          drag="y"
          dragConstraints={{ top: -60, bottom: 0 }}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.y < -30 || velocity.y < -150) {
              setCurrentPage(0);
              showGestureFeedback('Đã trở về Trang 1');
            }
          }}
          onClick={() => {
            setCurrentPage(0);
            showGestureFeedback('Trang 1');
          }}
          className="w-36 sm:w-48 h-1 rounded-full bg-white/70 hover:bg-white transition-all mt-3 mb-1 cursor-pointer shadow-md hover:scale-105"
          title="Chạm hoặc Vuốt lên để về Trang 1"
        />
      </footer>

      {/* =========================================================================
          5. CONTROL CENTER OVERLAY (PULLED FROM TOP RIGHT)
         ========================================================================= */}
      <AnimatePresence>
        {isControlCenterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed top-12 right-4 sm:right-8 w-88 p-4 rounded-[28px] bg-[#1A1024]/95 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white z-50 select-none"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Trung Tâm Điều Khiển
              </span>
              <button
                onClick={() => setIsControlCenterOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2x2 Network Toggle Box */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  setWifiEnabled(!wifiEnabled);
                  showGestureFeedback(wifiEnabled ? 'Đã tắt Wi-Fi' : 'Đã bật Wi-Fi');
                }}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  wifiEnabled ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-slate-400'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>Wi-Fi</span>
              </button>
              <button
                onClick={() => {
                  setBluetoothEnabled(!bluetoothEnabled);
                  showGestureFeedback(bluetoothEnabled ? 'Đã tắt Bluetooth' : 'Đã bật Bluetooth');
                }}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  bluetoothEnabled ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-slate-400'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Bluetooth</span>
              </button>
            </div>

            {/* Sliders: Brightness & Volume */}
            <div className="space-y-3 mb-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Độ sáng màn hình
                  </span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Âm lượng
                  </span>
                  <span>{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => {
                  setWallpaperIndex((prev) => (prev + 1) % ALL_WALLPAPERS.length);
                  showGestureFeedback('Đổi hình nền');
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors"
              >
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Hình Nền</span>
              </button>
              <button
                onClick={() => {
                  setShowWidgets((prev) => !prev);
                  showGestureFeedback(showWidgets ? 'Ẩn Widgets' : 'Hiện Widgets');
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Widgets</span>
              </button>
              <button
                onClick={() => {
                  setIsIslandExpanded((prev) => !prev);
                  showGestureFeedback('Bật Đảo Động');
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors"
              >
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Đảo Động</span>
              </button>
            </div>

            {/* Exit to Vplay Web Button */}
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-600/30 to-rose-600/30 border border-red-500/30 hover:bg-red-600/40 text-xs font-bold text-red-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Thoát về Vplay Web</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6. SPOTLIGHT SEARCH OVERLAY (COMMAND+K / SWIPE DOWN)
         ========================================================================= */}
      <AnimatePresence>
        {isSpotlightOpen && (
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-start justify-center pt-20 z-50 p-4"
            onClick={() => setIsSpotlightOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[28px] bg-[#1B1126]/95 backdrop-blur-3xl border border-white/20 shadow-2xl p-4 text-white"
            >
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/10 mb-3">
                <Search className="w-4 h-4 text-white/70" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm ứng dụng trong VplayOS..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/50 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-white/60 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtered Apps */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 [scrollbar-width:thin]">
                {filteredApps.map((app) => {
                  const AppIcon = app.icon;
                  return (
                    <div
                      key={`search-${app.id}`}
                      onClick={(e) => {
                        setIsSpotlightOpen(false);
                        handleLaunchApp(app, e);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center shadow-sm`}
                        >
                          <AppIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                          {app.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">{app.category}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          7. LOCK SCREEN OVERLAY
         ========================================================================= */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-center z-50 text-white select-none"
          >
            <div className="flex flex-col items-center mb-8">
              <Lock className="w-10 h-10 text-white/80 mb-4 animate-bounce" />
              <div className="text-6xl sm:text-7xl font-black tracking-tight">
                {currentTime || '09:41'}
              </div>
              <div className="text-lg font-medium text-white/80 mt-2">{currentDate}</div>
            </div>

            <button
              onClick={() => {
                setIsLocked(false);
                showGestureFeedback('Đã mở khóa VplayOS');
              }}
              className="px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-sm font-bold flex items-center gap-2.5 cursor-pointer transition-all shadow-xl active:scale-95"
            >
              <Unlock className="w-5 h-5 text-emerald-400" />
              <span>Chạm để Mở Khóa VplayOS</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VplayOSView;
