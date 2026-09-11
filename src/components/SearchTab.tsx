import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Mic,
  Home,
  Tv,
  Film,
  Megaphone,
  Waves,
  Layers,
  Gamepad2,
  Folder,
  MapPin,
  GraduationCap,
  Calculator,
  Bell,
  StickyNote,
  Armchair,
  Box,
  Crown,
  Users,
  Coins,
  Heart,
  Sliders,
  Info,
  Flag,
  Settings,
  Sparkles,
  ArrowRight,
  Radio,
  Swords,
  Flame,
  LayoutGrid,
  MessageSquare
} from 'lucide-react';
import { Channel } from '../data/channels';
import { NEWS_LIST } from './NewsView';
import { playPopSound } from '../utils/sound';
import { useSettings } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { SearchPortalsView } from './SearchPortalsView';

interface SearchTabProps {
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
  routeState?: any;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  navigate,
  onSelectChannel,
  channels,
  routeState
}) => {
  const { settings } = useSettings();
  const { flags } = useFeatureFlags();
  const showVoiceSearch = flags.voice_search_integration !== false;
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 1. Sidebar Tabs Dataset - Full coverage of all Sidebar navigation tabs & sub-sections
  const sidebarTabsList = useMemo(
    () => [
      {
        id: 'sidebar_home',
        name: 'Trang Chủ (Home)',
        tagline: 'Tab Sidebar • Kênh thịnh hành, tiếp tục xem & đề xuất đặc sắc',
        route: '/',
        icon: <Home className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['home', 'trang chủ', 'chính', 'menu', 'tổng quan', 'bảng tin', 'mặc định']
      },
      {
        id: 'sidebar_copilot',
        name: 'Copilot for Vplay',
        tagline: 'Tab Sidebar • Trợ lý AI thông minh giải đáp câu hỏi và gợi ý phim, kênh',
        route: '/copilot',
        icon: <Sparkles className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['copilot', 'ai', 'trợ lý', 'gemini', 'chat', 'hỏi đáp', 'tìm kiếm ai']
      },
      {
        id: 'sidebar_livetv',
        name: 'Truyền Hình Trực Tiếp (Live TV)',
        tagline: 'Tab Sidebar • Hàng trăm kênh truyền hình trực tuyến HD trong và ngoài nước',
        route: '/live-tv',
        icon: <Tv className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['live tv', 'truyền hình', 'kênh tv', 'trực tiếp', 'vtv', 'htv', 'thể thao', 'xem tivi']
      },
      {
        id: 'sidebar_shorts',
        name: 'Video Ngắn (V-Play Shorts)',
        tagline: 'Tab Sidebar • Video ngắn dạng đứng lướt dọc mượt mà, nội dung giải trí',
        route: '/vertical',
        icon: <Film className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['shorts', 'vertical', 'video ngắn', 'tiktok', 'reels', 'lướt video', 'clip']
      },
      {
        id: 'sidebar_news',
        name: 'Bản Tin & Thời Sự (News)',
        tagline: 'Tab Sidebar • Điểm tin thời sự, văn hóa, thể thao cập nhật 24/7',
        route: '/news',
        icon: <Megaphone className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['news', 'bản tin', 'tin tức', 'thời sự', 'báo chí', 'thế giới', 'nóng']
      },
      {
        id: 'sidebar_vflow',
        name: 'Mạng Xã Hội V-Flow (Social)',
        tagline: 'Tab Sidebar • Mạng xã hội Vplay, chia sẻ khoảnh khắc, bài viết & story',
        route: '/v-flow',
        icon: <Waves className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-flow', 'vflow', 'mạng xã hội', 'social', 'cộng đồng', 'bài viết', 'story', 'post']
      },
      {
        id: 'sidebar_vspace',
        name: 'Space 360 / V-Apps Hub',
        tagline: 'Tab Sidebar • Trung tâm kho ứng dụng đa tiện ích và không gian trải nghiệm',
        route: '/v-space',
        icon: <Layers className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['space 360', 'v-space', 'v-apps', 'kho ứng dụng', 'tiện ích', 'hệ sinh thái']
      },
      {
        id: 'sidebar_arcade',
        name: 'Kho Trò Chơi (V-Games & Arcade)',
        tagline: 'Tab Sidebar • Minigame HTML5 Caro XO, Vòng Quay, Xếp Gạch, Flappy Bird',
        route: '/v-arcade',
        state: { appId: 'v_arcade' },
        icon: <Gamepad2 className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-arcade', 'v-games', 'chơi game', 'trò chơi', 'game', 'caro', 'vòng quay', 'mini game']
      },
      {
        id: 'sidebar_files',
        name: 'Trình Quản Lý Tệp (V-Files Explorer)',
        tagline: 'Tab Sidebar • Quản lý tệp tin, xem tài liệu và lưu trữ đám mây',
        route: '/v-files',
        state: { appId: 'v_xplore' },
        icon: <Folder className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-files', 'v-xplore', 'quản lý tệp', 'file', 'explorer', 'lưu trữ', 'drive']
      },
      {
        id: 'sidebar_explore_vn',
        name: 'Khám Phá Việt Nam (Explore Vietnam 360)',
        tagline: 'Tab Sidebar • Bản đồ du lịch 63 tỉnh thành & danh lam thắng cảnh',
        route: '/explore-vietnam',
        state: { appId: 'explore_vietnam' },
        icon: <MapPin className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['explore vietnam', 'việt nam', 'bản đồ', 'du lịch', '63 tỉnh thành', 'địa danh']
      },
      {
        id: 'sidebar_vbox',
        name: 'V-Box 3D Workspace',
        tagline: 'Tab Sidebar • Không gian làm việc mô phỏng 3D tương tác',
        route: '/v-box',
        state: { appId: 'v_box' },
        icon: <Box className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-box', 'hộp 3d', 'không gian 3d', 'workspace', 'mô hình']
      },
      {
        id: 'sidebar_vstudy',
        name: 'Không Gian Học Tập (V-Study Pomodoro)',
        tagline: 'Tab Sidebar • Không gian học tập tập trung kết hợp đồng hồ Pomodoro',
        route: '/v-study',
        state: { appId: 'v_learn' },
        icon: <GraduationCap className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-study', 'v-learn', 'pomodoro', 'học tập', 'đồng hồ', 'tập trung', 'study']
      },
      {
        id: 'sidebar_vcalc',
        name: 'Máy Tính Đa Năng (V-Calc Express)',
        tagline: 'Tab Sidebar • Máy tính khoa học, đại số và quy đổi đơn vị đo lường',
        route: '/v-calc',
        state: { appId: 'v_calc' },
        icon: <Calculator className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-calc', 'máy tính', 'calculator', 'tính toán', 'đổi đơn vị', 'toán']
      },
      {
        id: 'sidebar_vreminders',
        name: 'Nhắc Việc & Lịch Hẹn (V-Reminders)',
        tagline: 'Tab Sidebar • Quản lý công việc cần làm, nhắc nhở và chuông báo',
        route: '/v-reminders',
        state: { appId: 'v_reminders' },
        icon: <Bell className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-reminders', 'nhắc việc', 'báo thức', 'todo', 'lịch hẹn', 'chuông']
      },
      {
        id: 'sidebar_vnotes',
        name: 'Sổ Ghi Chú Nhanh (V-Notes)',
        tagline: 'Tab Sidebar • Ghi chú tức thì, lưu ý tưởng và tự động đồng bộ',
        route: '/v-notes',
        state: { appId: 'v_notes' },
        icon: <StickyNote className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-notes', 'ghi chú', 'notes', 'sổ tay', 'lưu trữ nhanh']
      },
      {
        id: 'sidebar_vfurniture',
        name: 'Nội Thất & Decor 3D (V-Furniture)',
        tagline: 'Tab Sidebar • Bố trí sắp xếp nội thất phòng và không gian sống 3D',
        route: '/v-furniture',
        state: { appId: 'v_furniture' },
        icon: <Armchair className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['v-furniture', 'nội thất', 'decor', '3d', 'phòng ốc', 'thiết kế']
      },
      {
        id: 'sidebar_minecraft',
        name: 'Minecraft Container GUI (1.19 / 1.20)',
        tagline: 'Tab Sidebar • Rương đồ mô phỏng The Wild 1.19, Warden, Sculk & Crafting',
        route: '/minecraft',
        icon: <Box className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['minecraft', 'rương đồ', 'container gui', '1.19', 'the wild', 'warden', 'sculk', 'chế tạo', 'crafting table']
      },
      {
        id: 'sidebar_premium',
        name: 'Vplay VIP Premium',
        tagline: 'Tab Sidebar • Quyền lợi thành viên VIP, xem không quảng cáo, mở khóa tính năng',
        route: '/v-premium',
        icon: <Crown className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['premium', 'vip', 'gói cước', 'nâng cấp', 'đặc quyền', 'vplay premium']
      },
      {
        id: 'sidebar_chat',
        name: 'Phòng Chat Discord (Chat & Voice)',
        tagline: 'Tab Sidebar • Kênh chat văn bản & kênh thoại đàm thoại trực tiếp phong cách Discord',
        route: '/chat',
        icon: <MessageSquare className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['phòng chat', 'chat', 'discord', 'kênh thoại', 'voice', 'kênh chat', 'trò chuyện', 'đàm thoại', 'voice call']
      },
      {
        id: 'sidebar_friends',
        name: 'Bạn Bè & Kết Nối (Friends)',
        tagline: 'Tab Sidebar • Danh sách bạn bè, tương tác và trò chuyện cùng nhau',
        route: '/friends',
        icon: <Users className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['friends', 'bạn bè', 'kết nối', 'người quen', 'chat', 'danh bạ']
      },
      {
        id: 'sidebar_bet_arena',
        name: 'Sàn Cược Orbs (Bet Arena)',
        tagline: 'Tab Sidebar • Đặt cược Orbs: Bầu Cua Tôm Cá, Lật Xu, Bài Cào & Tài Xỉu',
        route: '/bet-arena',
        icon: <Coins className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['bet arena', 'sàn cược', 'bầu cua', 'lật xu', 'bài cào', 'tài xỉu', 'orbs', 'casino']
      },
      {
        id: 'sidebar_favorites',
        name: 'Kênh Yêu Thích (Favorites)',
        tagline: 'Tab Sidebar • Danh sách các kênh truyền hình bạn đã lưu và thường xem',
        route: '/favorites',
        icon: <Heart className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['favorites', 'yêu thích', 'kênh yêu thích', 'đã lưu', 'đánh dấu', 'bookmark']
      },
      {
        id: 'sidebar_toolbox',
        name: 'Hộp Công Cụ Kỹ Thuật (Toolbox)',
        tagline: 'Tab Sidebar • Bộ công cụ phát sóng Safe Area, Color Bars, M3U Tester, Timecode',
        route: '/toolbox',
        icon: <Sliders className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['toolbox', 'hộp công cụ', 'tiện ích', 'safe area', 'color bars', 'm3u tester', 'timecode']
      },
      {
        id: 'sidebar_about',
        name: 'Giới Thiệu Vplay (About)',
        tagline: 'Tab Sidebar • Thông tin phiên bản, bản quyền và đội ngũ sáng lập Vplay',
        route: '/about',
        icon: <Info className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['about', 'giới thiệu', 'thông tin', 'phiên bản', 'vplay info', 'liên hệ']
      },
      {
        id: 'sidebar_flags',
        name: 'Cờ Tính Năng (Feature Flags)',
        tagline: 'Tab Sidebar • Trình quản lý bật / tắt các tính năng thử nghiệm chuyên sâu',
        route: '/feature-flags',
        icon: <Flag className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['feature flags', 'flags', 'cờ tính năng', 'thử nghiệm', 'tính năng mới', 'lab']
      },
      {
        id: 'sidebar_settings',
        name: 'Cài Đặt Hệ Thống (Settings)',
        tagline: 'Tab Sidebar • Tùy biến giao diện, kiểu thanh dock/sidebar, âm thanh & hiệu ứng',
        route: '/settings',
        icon: <Settings className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['settings', 'cài đặt', 'giao diện', 'tùy chọn', 'âm thanh', 'cấu hình', 'sidebar']
      }
    ],
    []
  );

  // 2. Built-in Apps Dataset
  const appsList = useMemo(
    () => [
      {
        id: 'v_flow',
        name: 'V-Flow Social',
        tagline: 'Mạng Xã Hội Giải Trí, Khoảnh Khắc & Thảo Luận Vplay',
        category: 'Mạng xã hội',
        route: '/v-flow',
        appId: 'v_flow',
        icon: <Radio className="w-4 h-4 text-rose-400" />,
        tags: ['V-Flow', 'Mạng Xã Hội', 'Social', 'Bài Viết', 'Story', 'Cộng Đồng']
      },
      {
        id: 'v_arcade',
        name: 'V-Games & Arcade Hub',
        tagline: 'Kho Trò Chơi Mini HTML5 Đổi Thưởng Orbs',
        category: 'Trò chơi',
        route: '/v-arcade',
        appId: 'v_arcade',
        icon: <Gamepad2 className="w-4 h-4 text-amber-400" />,
        tags: ['Vòng Quay May Mắn', 'Caro XO', 'Rắn Săn Mồi', 'Xếp Gạch', 'Flappy Bird']
      },
      {
        id: 'v_xplore',
        name: 'V-Files Explorer',
        tagline: 'Trình Quản Lý Tệp Tin & Lưu Trữ Đám Mây',
        category: 'Tiện ích',
        route: '/v-files',
        appId: 'v_xplore',
        icon: <Folder className="w-4 h-4 text-purple-400" />,
        tags: ['Quản Lý Tệp', 'V-Files', 'Explorer', 'Cloud Drive']
      },
      {
        id: 'explore_vietnam',
        name: 'Explore Vietnam 360',
        tagline: 'Bản Đồ 63 Tỉnh Thành & Danh Lam Thắng Cảnh',
        category: 'Du lịch',
        route: '/explore-vietnam',
        appId: 'explore_vietnam',
        icon: <MapPin className="w-4 h-4 text-rose-400" />,
        tags: ['Bản Đồ', 'Việt Nam', '63 Tỉnh Thành', 'Du Lịch']
      },
      {
        id: 'v_learn',
        name: 'V-Study Pomodoro',
        tagline: 'Không Gian Học Tập Tập Trung & Đồng Hồ Pomodoro',
        category: 'Giáo dục',
        route: '/v-study',
        appId: 'v_learn',
        icon: <GraduationCap className="w-4 h-4 text-sky-400" />,
        tags: ['Pomodoro', 'Học Tập', 'Study', 'Đồng Hồ']
      },
      {
        id: 'v_calc',
        name: 'V-Calc Express',
        tagline: 'Máy Tính Khoa Học Đa Năng & Đổi Đơn Vị',
        category: 'Tiện ích',
        route: '/v-calc',
        appId: 'v_calc',
        icon: <Calculator className="w-4 h-4 text-cyan-400" />,
        tags: ['Máy Tính', 'Calculator', 'Toán Học']
      },
      {
        id: 'v_minecraft',
        name: 'Minecraft Container GUI',
        tagline: 'Bộ Rương Đồ Tương Tác 1.19 & 1.20 Pixel Art',
        category: 'Tiện ích',
        route: '/minecraft',
        appId: 'v_minecraft',
        icon: <Box className="w-4 h-4 text-emerald-400" />,
        tags: ['Minecraft Chest', 'Container GUI', 'Rương Đồ', 'The Wild Update 1.19', '1.20']
      }
    ],
    []
  );

  // 3. Casino Minigames Dataset
  const betGamesList = useMemo(
    () => [
      {
        id: 'baucua',
        title: 'Bầu Cua Tôm Cá 3D',
        category: 'Sàn cược Orbs',
        route: '/bet-arena',
        icon: <Flame className="w-4 h-4 text-amber-400" />,
        tags: ['Bầu Cua', 'Tôm Cá', 'Cược Orbs']
      },
      {
        id: 'latxu',
        title: 'Lật Xu Sấp Ngửa 3D',
        category: 'Sàn cược Orbs',
        route: '/bet-arena',
        icon: <Coins className="w-4 h-4 text-yellow-300" />,
        tags: ['Lật Xu', 'Sấp Ngửa', '50/50']
      },
      {
        id: 'danhbai',
        title: 'Bài Cào 3 Cây PvP',
        category: 'Sàn cược Orbs',
        route: '/bet-arena',
        icon: <Swords className="w-4 h-4 text-rose-400" />,
        tags: ['Bài Cào', '3 Cây', 'Đối Kháng']
      },
      {
        id: 'xucxac',
        title: 'Xúc Xắc Tài Xỉu (Sicbo)',
        category: 'Sàn cược Orbs',
        route: '/bet-arena',
        icon: <Flame className="w-4 h-4 text-purple-400" />,
        tags: ['Tài Xỉu', 'Sicbo', 'Xúc Xắc']
      }
    ],
    []
  );

  // 4. Settings Shortcuts Dataset
  const settingsList = useMemo(
    () => [
      {
        id: 'theme',
        title: 'Chủ đề Giao diện (Sáng / Tối)',
        category: 'Cài đặt',
        route: '/settings',
        icon: <Settings className="w-4 h-4 text-indigo-400" />
      },
      {
        id: 'sidebar',
        title: 'Thanh điều hướng Sidebar / Dock',
        category: 'Cài đặt',
        route: '/settings',
        icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />
      },
      {
        id: 'copilot',
        title: 'Hợp nhất Spotlight với Copilot',
        category: 'Cài đặt',
        route: '/settings',
        icon: <Sparkles className="w-4 h-4 text-purple-400" />
      },
      {
        id: 'feature-flags',
        title: 'Feature Flags (Cờ tính năng)',
        category: 'Cài đặt',
        route: '/feature-flags',
        icon: <Flag className="w-4 h-4 text-cyan-400" />
      }
    ],
    []
  );

  // Search matches calculation
  const q = query.trim().toLowerCase();

  // Matched Sidebar Tabs
  const matchedSidebarTabs = useMemo(() => {
    if (!q) return [];
    return sidebarTabsList
      .filter(
        (tab) =>
          tab.name.toLowerCase().includes(q) ||
          tab.tagline.toLowerCase().includes(q) ||
          tab.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [sidebarTabsList, q]);

  const matchedChannels = useMemo(() => {
    if (!q) return [];
    return channels
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.channelNumber && c.channelNumber.toString().includes(q))
      )
      .slice(0, 6);
  }, [channels, q]);

  const matchedApps = useMemo(() => {
    if (!q) return [];
    return appsList
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [appsList, q]);

  const matchedBetGames = useMemo(() => {
    if (!q) return [];
    return betGamesList
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 3);
  }, [betGamesList, q]);

  const matchedNews = useMemo(() => {
    if (!q) return [];
    return NEWS_LIST.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [q]);

  const matchedSettings = useMemo(() => {
    if (!q) return [];
    return settingsList
      .filter((s) => s.title.toLowerCase().includes(q))
      .slice(0, 3);
  }, [settingsList, q]);

  // Unified list of flat results for keyboard navigation & live search dropdown
  const flatResults = useMemo(() => {
    const list: {
      type: 'sidebar' | 'channel' | 'app' | 'bet' | 'news' | 'setting';
      title: string;
      subtitle?: string;
      icon: React.ReactNode;
      action: () => void;
    }[] = [];

    // Prioritize matched sidebar tabs first!
    matchedSidebarTabs.forEach((tab) => {
      list.push({
        type: 'sidebar',
        title: tab.name,
        subtitle: tab.tagline,
        icon: tab.icon,
        action: () => {
          playPopSound();
          navigate(tab.route, tab.state);
        }
      });
    });

    matchedChannels.forEach((ch) => {
      list.push({
        type: 'channel',
        title: ch.name,
        subtitle: ch.category || 'Kênh truyền hình HD',
        icon: <Tv className="w-4.5 h-4.5 text-cyan-400" />,
        action: () => {
          playPopSound();
          onSelectChannel(ch);
          navigate(`/live-tv?channel=${ch.slug}`);
        }
      });
    });

    matchedApps.forEach((app) => {
      list.push({
        type: 'app',
        title: app.name,
        subtitle: app.tagline,
        icon: app.icon,
        action: () => {
          playPopSound();
          navigate(app.route, { appId: app.appId });
        }
      });
    });

    matchedBetGames.forEach((g) => {
      list.push({
        type: 'bet',
        title: g.title,
        subtitle: g.category,
        icon: g.icon,
        action: () => {
          playPopSound();
          navigate(g.route);
        }
      });
    });

    matchedNews.forEach((n) => {
      list.push({
        type: 'news',
        title: n.title,
        subtitle: 'Tin tức & Thời sự',
        icon: <Megaphone className="w-4.5 h-4.5 text-amber-400" />,
        action: () => {
          playPopSound();
          navigate('/news');
        }
      });
    });

    matchedSettings.forEach((s) => {
      list.push({
        type: 'setting',
        title: s.title,
        subtitle: s.category,
        icon: s.icon,
        action: () => {
          playPopSound();
          navigate(s.route);
        }
      });
    });

    return list;
  }, [
    matchedSidebarTabs,
    matchedChannels,
    matchedApps,
    matchedBetGames,
    matchedNews,
    matchedSettings,
    navigate,
    onSelectChannel
  ]);

  // Handle Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceToast('Trình duyệt không hỗ trợ nhận diện giọng nói');
      setTimeout(() => setVoiceToast(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast('Đang lắng nghe giọng nói của bạn...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setVoiceToast(`Đã nhận diện: "${transcript}"`);
        setTimeout(() => setVoiceToast(null), 3000);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setVoiceToast('Không thể nhận diện giọng nói. Vui lòng thử lại!');
        setTimeout(() => setVoiceToast(null), 3000);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setVoiceToast('Lỗi micro hoặc quyền truy cập mic bị từ chối');
      setTimeout(() => setVoiceToast(null), 3000);
      setIsListening(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(1, flatResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults.length > 0) {
        const target = flatResults[selectedIndex] || flatResults[0];
        target.action();
      }
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-start pt-6 sm:pt-10 md:pt-12 pb-16 px-4 select-none animate-in fade-in duration-200">
      {/* Top Search Bar Container */}
      <div className="w-full max-w-2xl relative">
        {/* THE SINGLE SEARCH BAR AT TOP */}
        <div className="relative flex items-center w-full h-14 sm:h-15 rounded-2xl bg-[#1C1B23] border border-transparent focus-within:border-zinc-500 transition-all px-4">
          <Search className="w-5 h-5 text-gray-400 stroke-[1.4] shrink-0 mr-3 pointer-events-none" strokeWidth={1.4} />

          <input
            ref={inputRef}
            id="standalone-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Find and search"
            className="flex-1 bg-transparent text-white text-base placeholder-[#8A8A93] focus:outline-none font-medium truncate"
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors mr-1 cursor-pointer"
              title="Xóa tìm kiếm (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Button */}
          {showVoiceSearch && (
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-[#E6005A] text-white animate-pulse shadow-md shadow-[#E6005A]/50'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Tìm kiếm bằng giọng nói"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Voice recognition status toast */}
        {voiceToast && (
          <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-[#2A1520] border border-[#E6005A]/40 text-[#FF6699] text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{voiceToast}</span>
          </div>
        )}

        {/* LIVE RESULTS DROPDOWN: Only shown when typing */}
        {q.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2.5 rounded-2xl bg-[#18171F] border border-[#333240] shadow-2xl overflow-hidden z-50 max-h-[64vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
            {flatResults.length > 0 ? (
              <div className="p-2 space-y-1">
                {flatResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={idx}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#272532] border-2 border-[#E6005A] text-white shadow-md shadow-[#E6005A]/15'
                          : 'hover:bg-[#201F2A] text-zinc-300 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8.5 h-8.5 rounded-lg bg-[#121118] border border-white/5 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-white truncate flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.type === 'sidebar' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E6005A] text-white tracking-wide">
                                SIDEBAR
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-zinc-400 truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                            item.type === 'sidebar'
                              ? 'bg-[#E6005A]/20 text-[#FF4D8D] border border-[#E6005A]/40'
                              : 'bg-white/5 text-zinc-400'
                          }`}
                        >
                          {item.type === 'sidebar'
                            ? 'Tab Sidebar'
                            : item.type === 'channel'
                            ? 'Kênh TV'
                            : item.type === 'app'
                            ? 'Ứng dụng'
                            : item.type === 'bet'
                            ? 'Sàn cược'
                            : item.type === 'news'
                            ? 'Tin tức'
                            : 'Cài đặt'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-400 space-y-1">
                <p className="text-sm font-semibold text-zinc-300">
                  Không tìm thấy kết quả cho "{query}"
                </p>
                <p className="text-xs text-zinc-500">
                  Hãy thử tìm tên tab trên Sidebar (Trang chủ, Live TV, V-Flow, Kho Game, Minecraft, Cài đặt), kênh TV hoặc tiện ích.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SPECIAL CIRCULAR PORTALS SECTION & DEDICATED TABS */}
      <SearchPortalsView
        channels={channels}
        onSelectChannel={onSelectChannel}
        navigate={navigate}
        initialPortal={routeState?.portal}
      />
    </div>
  );
};

export default SearchTab;

