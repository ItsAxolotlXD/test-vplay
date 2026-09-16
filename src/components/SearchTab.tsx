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
  MessageSquare,
  Globe,
  ShoppingBag,
  Music,
  BookOpen,
  Dices,
  Gift,
  Award,
  CheckCircle2
} from 'lucide-react';
import { Channel } from '../data/channels';
import { NEWS_LIST } from './NewsView';
import { playPopSound } from '../utils/sound';
import { useSettings } from '../hooks/useSettings';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { SearchPortalsView } from './SearchPortalsView';
import { V_SHOP_PRODUCTS, VShopProduct } from '../data/vShopData';
import { TV_MUSIC_TRACKS, TvMusicTrack } from '../data/tvMusicData';
import { VAPPS_LIST, VAppDefinition } from './VAppsView';

// Route resolver for Space 360 apps
const getSpace360Route = (appId: string) => {
  switch (appId) {
    case 'v_arcade': return '/v-arcade';
    case 'v_xplore': return '/v-files';
    case 'explore_vietnam': return '/explore-vietnam';
    case 'v_maps': return '/v-maps';
    case 'v_box': return '/v-box';
    case 'v_learn': return '/v-study';
    case 'v_calc': return '/v-calc';
    case 'v_clock': return '/v-clock';
    case 'v_phone': return '/v-phone';
    case 'v_browser': return '/v-browser';
    case 'v_calendar': return '/v-calendar';
    case 'v_gallery': return '/v-gallery';
    case 'v_camera': return '/v-camera';
    case 'v_ticket': return '/v-ticket';
    case 'v_weather': return '/v-weather';
    case 'v_reminders': return '/v-reminders';
    case 'v_notes': return '/v-notes';
    case 'v_minecraft': return '/minecraft';
    case 'v_flow': return '/v-flow';
    case 'v_chat': return '/chat';
    case 'v_stock': return '/v-stock';
    case 'v_health': return '/v-health';
    case 'cookbook': return '/cookbook';
    default: return '/v-space';
  }
};

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
  const [searchScope, setSearchScope] = useState<'all' | 'channels' | 'shop' | 'music' | 'loyalty' | 'space360'>('all');
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
        id: 'sidebar_vshop',
        name: 'Cửa Hàng (V-Shop)',
        tagline: 'Tab Sidebar • Mua sắm Thực phẩm, Đồ công nghệ - Điện tử & Đồ gia dụng tích lũy Orbs',
        route: '/v-shop',
        icon: <ShoppingBag className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['shop', 'v-shop', 'cửa hàng', 'mua sắm', 'orbs', 'thực phẩm', 'công nghệ', 'điện tử', 'gia dụng']
      },
      {
        id: 'sidebar_music',
        name: 'Kho Nhạc Truyền Hình (Music)',
        tagline: 'Tab Sidebar • Nhạc nền phát sóng, ident, bản tin & nhạc hiệu truyền hình',
        route: '/music',
        icon: <Music className="w-4.5 h-4.5 text-emerald-400" />,
        tags: ['music', 'kho nhạc', 'nhạc truyền hình', 'ident', 'schedule', 'vtv1', 'nhạc nền', 'âm nhạc']
      },
      {
        id: 'sidebar_loyalty',
        name: 'Hội Viên Loyalty (Loyalty Club)',
        tagline: 'Tab Sidebar • Đặc quyền tích lũy Orbs, đổi voucher ưu đãi & xếp hạng hội viên',
        route: '/loyalty',
        icon: <Coins className="w-4.5 h-4.5 text-yellow-400" />,
        tags: ['loyalty', 'hội viên', 'orbs', 'tích điểm', 'voucher', 'đổi quà', 'điểm danh', 'vip']
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
        name: 'Mạng Xã Hội Flow (Social)',
        tagline: 'Tab Sidebar • Mạng xã hội Vplay, chia sẻ khoảnh khắc, bài viết & story',
        route: '/v-flow',
        icon: <Waves className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['flow', 'v-flow', 'mạng xã hội', 'social', 'cộng đồng', 'bài viết', 'story', 'post']
      },
      {
        id: 'sidebar_vspace',
        name: 'Space 360 / Kho Ứng Dụng Hub',
        tagline: 'Tab Sidebar • Trung tâm kho ứng dụng đa tiện ích và không gian trải nghiệm',
        route: '/v-space',
        icon: <Layers className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['space 360', 'v-space', 'kho ứng dụng', 'tiện ích', 'hệ sinh thái', 'apps']
      },
      {
        id: 'sidebar_cookbook',
        name: 'Sổ Tay Nấu Ăn (Cookbook)',
        tagline: 'Tab Sidebar • Công thức nấu ăn 3 miền, món ngon hằng ngày & hướng dẫn',
        route: '/cookbook',
        state: { appId: 'cookbook' },
        icon: <BookOpen className="w-4.5 h-4.5 text-amber-400" />,
        tags: ['cookbook', 'nấu ăn', 'ẩm thực', 'công thức', 'món ngon', 'space 360']
      },
      {
        id: 'sidebar_arcade',
        name: 'Kho Trò Chơi (Games & Arcade)',
        tagline: 'Tab Sidebar • Minigame HTML5 Caro XO, Vòng Quay, Xếp Gạch, Flappy Bird',
        route: '/v-arcade',
        state: { appId: 'v_arcade' },
        icon: <Gamepad2 className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['arcade', 'games', 'chơi game', 'trò chơi', 'game', 'caro', 'vòng quay', 'mini game']
      },
      {
        id: 'sidebar_files',
        name: 'Trình Quản Lý Tệp (Files)',
        tagline: 'Tab Sidebar • Quản lý tệp tin, xem tài liệu và lưu trữ đám mây',
        route: '/v-files',
        state: { appId: 'v_xplore' },
        icon: <Folder className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['files', 'quản lý tệp', 'file', 'explorer', 'lưu trữ', 'drive']
      },
      {
        id: 'sidebar_explore_vn',
        name: 'Khám Phá Việt Nam (Explore Vietnam)',
        tagline: 'Tab Sidebar • Bản đồ du lịch 63 tỉnh thành & danh lam thắng cảnh',
        route: '/explore-vietnam',
        state: { appId: 'explore_vietnam' },
        icon: <MapPin className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['explore vietnam', 'việt nam', 'bản đồ', 'du lịch', '63 tỉnh thành', 'địa danh']
      },
      {
        id: 'sidebar_v_maps',
        name: 'Space 360 Maps',
        tagline: 'Tab Sidebar • Bản đồ không gian 360°, vệ tinh toàn cầu & địa danh',
        route: '/v-maps',
        state: { appId: 'v_maps' },
        icon: <Globe className="w-4.5 h-4.5 text-cyan-400" />,
        tags: ['maps', 'space 360', 'bản đồ', 'vệ tinh', 'street view', '360', 'toàn cảnh']
      },
      {
        id: 'sidebar_vbox',
        name: 'Box 3D',
        tagline: 'Tab Sidebar • Không gian làm việc mô phỏng 3D tương tác',
        route: '/v-box',
        state: { appId: 'v_box' },
        icon: <Box className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['box', 'hộp 3d', 'không gian 3d', 'workspace', 'mô hình']
      },
      {
        id: 'sidebar_vstudy',
        name: 'Học Tập (Study)',
        tagline: 'Tab Sidebar • Không gian học tập tập trung kết hợp đồng hồ Pomodoro',
        route: '/v-study',
        state: { appId: 'v_learn' },
        icon: <GraduationCap className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['study', 'pomodoro', 'học tập', 'đồng hồ', 'tập trung']
      },
      {
        id: 'sidebar_vcalc',
        name: 'Máy Tính (Calculator)',
        tagline: 'Tab Sidebar • Máy tính khoa học, đại số và quy đổi đơn vị đo lường',
        route: '/v-calc',
        state: { appId: 'v_calc' },
        icon: <Calculator className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['calculator', 'máy tính', 'tính toán', 'đổi đơn vị', 'toán']
      },
      {
        id: 'sidebar_vreminders',
        name: 'Nhắc Việc (Reminders)',
        tagline: 'Tab Sidebar • Quản lý công việc cần làm, nhắc nhở và chuông báo',
        route: '/v-reminders',
        state: { appId: 'v_reminders' },
        icon: <Bell className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['reminders', 'nhắc việc', 'báo thức', 'todo', 'lịch hẹn', 'chuông']
      },
      {
        id: 'sidebar_vnotes',
        name: 'Ghi Chú (Notes)',
        tagline: 'Tab Sidebar • Ghi chú tức thì, lưu ý tưởng và tự động đồng bộ',
        route: '/v-notes',
        state: { appId: 'v_notes' },
        icon: <StickyNote className="w-4.5 h-4.5 text-[#FF4D8D]" />,
        tags: ['notes', 'ghi chú', 'sổ tay', 'lưu trữ nhanh']
      },
      {
        id: 'sidebar_minecraft',
        name: 'Minecraft',
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
        name: 'Phòng Chat (Chat & Voice)',
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
        icon: <Coins className="w-4.5 h-4.5 text-yellow-400" />,
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

  // 2. Space 360 Apps Dataset (All apps without V- prefix, including Cookbook)
  const space360AppsList = useMemo(() => {
    return VAPPS_LIST.map((app) => ({
      id: app.id,
      name: app.name,
      description: app.description,
      category: app.category,
      route: getSpace360Route(app.id),
      icon: <app.icon className="w-4.5 h-4.5 text-cyan-400" />,
      tags: [app.name, app.category, app.description, ...(app.tags || [])]
    }));
  }, []);

  // 3. Loyalty & Orbs Dataset
  const loyaltyItemsList = useMemo(
    () => [
      {
        id: 'loyalty_daily',
        title: 'Điểm Danh Hằng Ngày (+50 Orbs & +50 V-Points)',
        subtitle: 'Nhận 50 Orbs vàng miễn phí mỗi ngày vào ví Vplay',
        route: '/loyalty',
        icon: <Sparkles className="w-4.5 h-4.5 text-yellow-400" />,
        tags: ['điểm danh', 'orbs', 'daily', 'v-points', 'thưởng', 'miễn phí']
      },
      {
        id: 'loyalty_tiers',
        title: 'Hạng Hội Viên Vàng & Kim Cương Loyalty',
        subtitle: 'Nhân x1.5 và x2 Orbs thưởng phát sóng & mở khóa 4K HDR',
        route: '/loyalty',
        icon: <Award className="w-4.5 h-4.5 text-amber-400" />,
        tags: ['hạng hội viên', 'tiers', 'vàng', 'kim cương', 'đặc quyền', 'vip', 'orbs']
      },
      {
        id: 'loyalty_voucher_50k',
        title: 'Đổi Voucher V-Shop 50.000đ',
        subtitle: 'Sử dụng điểm tích lũy và Orbs để nhận ưu đãi mua sắm thực tế',
        route: '/loyalty',
        icon: <Gift className="w-4.5 h-4.5 text-pink-400" />,
        tags: ['voucher', 'v-shop', 'đổi quà', '50k', 'mua sắm', 'giảm giá', 'orbs']
      },
      {
        id: 'loyalty_voucher_100k',
        title: 'Đổi Voucher V-Shop 100.000đ',
        subtitle: 'Mã giảm giá trực tiếp cho đơn hàng Thực phẩm & Gia dụng',
        route: '/loyalty',
        icon: <Gift className="w-4.5 h-4.5 text-purple-400" />,
        tags: ['voucher', 'v-shop', 'đổi quà', '100k', 'mua sắm', 'orbs']
      },
      {
        id: 'bet_baucua',
        title: 'Bầu Cua Tôm Cá 3D (Sàn Cược Orbs)',
        subtitle: 'Sàn cược Orbs trực tiếp với 6 linh vật truyền thống & x3 cược',
        route: '/bet-arena',
        icon: <Dices className="w-4.5 h-4.5 text-amber-400" />,
        tags: ['bầu cua', 'tôm cá', 'cược orbs', 'casino', 'bet arena', 'xúc xắc 3d']
      },
      {
        id: 'bet_latxu',
        title: 'Lật Xu Sấp Ngửa 3D (Sàn Cược Orbs)',
        subtitle: 'Cược Orbs tỷ lệ x1.98 siêu tốc 5 giây Provably Fair',
        route: '/bet-arena',
        icon: <Coins className="w-4.5 h-4.5 text-yellow-300" />,
        tags: ['lật xu', 'sấp ngửa', 'cược orbs', '50/50', 'bet arena']
      },
      {
        id: 'bet_danhbai',
        title: 'Bài Cào 3 Cây PvP (Sàn Cược Orbs)',
        subtitle: 'Đấu trí cược Orbs 3 lá Tây kịch tính đếm nút',
        route: '/bet-arena',
        icon: <Swords className="w-4.5 h-4.5 text-rose-400" />,
        tags: ['bài cào', '3 cây', 'cược orbs', 'pvp', 'đối kháng', 'bet arena']
      },
      {
        id: 'bet_xucxac',
        title: 'Xúc Xắc Tài Xỉu Sicbo (Sàn Cược Orbs)',
        subtitle: 'Cược Orbs Tài / Xỉu nổ bão x30 phần thưởng',
        route: '/bet-arena',
        icon: <Flame className="w-4.5 h-4.5 text-purple-400" />,
        tags: ['tài xỉu', 'sicbo', 'cược orbs', 'xúc xắc', 'bet arena']
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
        icon: <Settings className="w-4.5 h-4.5 text-indigo-400" />
      },
      {
        id: 'sidebar',
        title: 'Thanh điều hướng Sidebar / Dock',
        category: 'Cài đặt',
        route: '/settings',
        icon: <LayoutGrid className="w-4.5 h-4.5 text-cyan-400" />
      },
      {
        id: 'copilot',
        title: 'Hợp nhất Spotlight với Copilot',
        category: 'Cài đặt',
        route: '/settings',
        icon: <Sparkles className="w-4.5 h-4.5 text-purple-400" />
      },
      {
        id: 'feature-flags',
        title: 'Feature Flags (Cờ tính năng)',
        category: 'Cài đặt',
        route: '/feature-flags',
        icon: <Flag className="w-4.5 h-4.5 text-cyan-400" />
      }
    ],
    []
  );

  // Search query
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
      .slice(0, 5);
  }, [sidebarTabsList, q]);

  // Matched Channels (Tab Truyền hình)
  const matchedChannels = useMemo(() => {
    if (!q) {
      if (searchScope === 'channels') return channels.slice(0, 16);
      return [];
    }
    return channels
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.channelNumber && c.channelNumber.toString().includes(q))
      )
      .slice(0, 12);
  }, [channels, q, searchScope]);

  // Matched Shop Products (Tab Shop)
  const matchedShopProducts = useMemo(() => {
    if (!q) {
      if (searchScope === 'shop') return V_SHOP_PRODUCTS.slice(0, 15);
      return [];
    }
    return V_SHOP_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [q, searchScope]);

  // Matched Music Tracks (Tab Music)
  const matchedMusicTracks = useMemo(() => {
    if (!q) {
      if (searchScope === 'music') return TV_MUSIC_TRACKS.slice(0, 15);
      return [];
    }
    return TV_MUSIC_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.channel.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q) ||
        t.era.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [q, searchScope]);

  // Matched Loyalty & Casino Items
  const matchedLoyalty = useMemo(() => {
    if (!q) {
      if (searchScope === 'loyalty') return loyaltyItemsList;
      return [];
    }
    return loyaltyItemsList
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [loyaltyItemsList, q, searchScope]);

  // Matched Space 360 Apps
  const matchedSpace360Apps = useMemo(() => {
    if (!q) {
      if (searchScope === 'space360') return space360AppsList;
      return [];
    }
    return space360AppsList
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [space360AppsList, q, searchScope]);

  // Matched News
  const matchedNews = useMemo(() => {
    if (!q || searchScope !== 'all') return [];
    return NEWS_LIST.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [q, searchScope]);

  // Matched Settings
  const matchedSettings = useMemo(() => {
    if (!q || searchScope !== 'all') return [];
    return settingsList
      .filter((s) => s.title.toLowerCase().includes(q))
      .slice(0, 3);
  }, [settingsList, q, searchScope]);

  // Unified list of flat results for keyboard navigation & live search display
  const flatResults = useMemo(() => {
    const list: {
      type: 'sidebar' | 'channel' | 'shop' | 'music' | 'loyalty' | 'space360' | 'news' | 'setting';
      title: string;
      subtitle?: React.ReactNode;
      icon: React.ReactNode;
      badgeText: string;
      badgeStyle: string;
      action: () => void;
    }[] = [];

    // Filter by searchScope
    const showSidebar = searchScope === 'all';
    const showChannels = searchScope === 'all' || searchScope === 'channels';
    const showShop = searchScope === 'all' || searchScope === 'shop';
    const showMusic = searchScope === 'all' || searchScope === 'music';
    const showLoyalty = searchScope === 'all' || searchScope === 'loyalty';
    const showSpace360 = searchScope === 'all' || searchScope === 'space360';

    // 1. Sidebar Tabs (when in 'all' mode and user searched)
    if (showSidebar) {
      matchedSidebarTabs.forEach((tab) => {
        list.push({
          type: 'sidebar',
          title: tab.name,
          subtitle: tab.tagline,
          icon: tab.icon,
          badgeText: 'Sidebar',
          badgeStyle: 'bg-[#FF4D8D]/20 text-[#FF4D8D] border-[#FF4D8D]/40',
          action: () => {
            playPopSound();
            navigate(tab.route, tab.state);
          }
        });
      });
    }

    // 2. TV Channels
    if (showChannels) {
      matchedChannels.forEach((ch) => {
        list.push({
          type: 'channel',
          title: ch.name,
          subtitle: `${ch.category || 'Kênh truyền hình'} ${ch.channelNumber ? `• Kênh ${ch.channelNumber}` : ''} • HD trực tiếp`,
          icon: <Tv className="w-4.5 h-4.5 text-cyan-400" />,
          badgeText: 'Truyền hình',
          badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          action: () => {
            playPopSound();
            onSelectChannel(ch);
            navigate(`/live-tv?channel=${ch.slug}`);
          }
        });
      });
    }

    // 3. Shop Products
    if (showShop) {
      matchedShopProducts.forEach((p) => {
        list.push({
          type: 'shop',
          title: p.name,
          subtitle: (
            <span className="flex items-center gap-1.5 truncate">
              <span className="text-yellow-400 font-bold">{p.priceOrbs.toLocaleString()} Orbs</span>
              <span className="text-zinc-400">• {p.priceFormatted} • {p.category}</span>
            </span>
          ),
          icon: <ShoppingBag className="w-4.5 h-4.5 text-[#FF4D8D]" />,
          badgeText: 'V-Shop',
          badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          action: () => {
            playPopSound();
            navigate('/v-shop');
          }
        });
      });
    }

    // 4. Music Tracks
    if (showMusic) {
      matchedMusicTracks.forEach((t) => {
        list.push({
          type: 'music',
          title: t.title,
          subtitle: `${t.channel} • ${t.categoryLabel} (${t.era})`,
          icon: <Music className="w-4.5 h-4.5 text-emerald-400" />,
          badgeText: 'Kho Nhạc',
          badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          action: () => {
            playPopSound();
            navigate('/music', { trackId: t.id });
          }
        });
      });
    }

    // 5. Loyalty & Orbs Items
    if (showLoyalty) {
      matchedLoyalty.forEach((item) => {
        list.push({
          type: 'loyalty',
          title: item.title,
          subtitle: (
            <span className="text-zinc-300">
              {item.subtitle.includes('Orbs') ? (
                <>
                  {item.subtitle.split('Orbs').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-yellow-400 font-bold">Orbs</span>}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                item.subtitle
              )}
            </span>
          ),
          icon: item.icon,
          badgeText: 'Loyalty',
          badgeStyle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          action: () => {
            playPopSound();
            navigate(item.route);
          }
        });
      });
    }

    // 6. Space 360 Apps
    if (showSpace360) {
      matchedSpace360Apps.forEach((app) => {
        list.push({
          type: 'space360',
          title: app.name,
          subtitle: `Space 360 • ${app.description}`,
          icon: app.icon,
          badgeText: 'Space 360',
          badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          action: () => {
            playPopSound();
            if (app.route) {
              navigate(app.route, { appId: app.id });
            } else {
              navigate('/v-space', { appId: app.id });
            }
          }
        });
      });
    }

    // 7. News & Settings (when in 'all')
    if (showSidebar) {
      matchedNews.forEach((n) => {
        list.push({
          type: 'news',
          title: n.title,
          subtitle: 'Tin tức & Thời sự Vplay',
          icon: <Megaphone className="w-4.5 h-4.5 text-amber-400" />,
          badgeText: 'Tin tức',
          badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
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
          badgeText: 'Cài đặt',
          badgeStyle: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
          action: () => {
            playPopSound();
            navigate(s.route);
          }
        });
      });
    }

    return list;
  }, [
    searchScope,
    matchedSidebarTabs,
    matchedChannels,
    matchedShopProducts,
    matchedMusicTracks,
    matchedLoyalty,
    matchedSpace360Apps,
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
      setSearchScope('all');
    }
  };

  const showDropdown = q.length > 0 || searchScope !== 'all';

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-start pt-6 sm:pt-10 md:pt-12 pb-16 px-4 select-none animate-in fade-in duration-200">
      {/* Top Search Bar Container */}
      <div className="w-full max-w-2xl relative">
        {/* THE SINGLE SEARCH BAR AT TOP */}
        <div className="relative flex items-center w-full h-14 sm:h-15 rounded-2xl bg-[#1C1B23] border border-transparent focus-within:border-zinc-500 transition-all px-4 shadow-lg">
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
            placeholder={
              searchScope === 'channels'
                ? 'Tìm kênh truyền hình (VTV1, HTV, K+ Thể Thao...)'
                : searchScope === 'shop'
                ? 'Tìm sản phẩm V-Shop (Thực phẩm, Đồ công nghệ, Gia dụng...)'
                : searchScope === 'music'
                ? 'Tìm nhạc truyền hình (VTV1 ident, nhạc nền, schedule...)'
                : searchScope === 'loyalty'
                ? 'Tìm đặc quyền Loyalty, Voucher & Sàn cược Orbs...'
                : searchScope === 'space360'
                ? 'Tìm ứng dụng Space 360 (Cookbook, Notes, Clock, Maps...)'
                : 'Find and search (Kênh TV, V-Shop, Kho Nhạc, Loyalty, Space 360...)'
            }
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

        {/* Category Scope Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'Tất cả', icon: <Search className="w-3.5 h-3.5" /> },
            { id: 'channels', label: 'Truyền hình', icon: <Tv className="w-3.5 h-3.5" /> },
            { id: 'shop', label: 'V-Shop', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: 'music', label: 'Kho Nhạc', icon: <Music className="w-3.5 h-3.5" /> },
            { id: 'loyalty', label: 'Loyalty & Orbs', icon: <Coins className="w-3.5 h-3.5 text-yellow-400" /> },
            { id: 'space360', label: 'Space 360', icon: <Layers className="w-3.5 h-3.5" /> }
          ].map((chip) => {
            const isActive = searchScope === chip.id;
            return (
              <button
                key={chip.id}
                id={`search-scope-${chip.id}`}
                onClick={() => {
                  playPopSound();
                  setSearchScope(chip.id as any);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#E6005A] text-white shadow-md shadow-[#E6005A]/30 ring-1 ring-white/20'
                    : 'bg-[#181720] text-zinc-400 hover:text-white hover:bg-[#23222E] border border-white/5'
                }`}
              >
                {chip.icon}
                <span className={chip.id === 'loyalty' ? 'text-yellow-400' : ''}>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Voice recognition status toast */}
        {voiceToast && (
          <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-[#2A1520] border border-[#E6005A]/40 text-[#FF6699] text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{voiceToast}</span>
          </div>
        )}

        {/* LIVE RESULTS DROPDOWN */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2.5 rounded-2xl bg-[#18171F] border border-[#333240] shadow-2xl overflow-hidden z-50 max-h-[64vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header info bar when filter is active */}
            {searchScope !== 'all' && (
              <div className="px-3.5 py-2 bg-[#201F2B] border-b border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">
                  {searchScope === 'channels' && 'Kênh Truyền Hình Trực Tuyến'}
                  {searchScope === 'shop' && 'Sản Phẩm Cửa Hàng V-Shop'}
                  {searchScope === 'music' && 'Kho Nhạc Phát Sóng Truyền Hình'}
                  {searchScope === 'loyalty' && (
                    <span>
                      Đặc Quyền Loyalty & Sàn Cược <span className="text-yellow-400 font-bold">Orbs</span>
                    </span>
                  )}
                  {searchScope === 'space360' && 'Kho Ứng Dụng Space 360'}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {flatResults.length} kết quả
                </span>
              </div>
            )}

            {flatResults.length > 0 ? (
              <div className="p-2 space-y-1">
                {flatResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={idx}
                      id={`search-result-item-${idx}`}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#272532] border-2 border-[#E6005A] text-white shadow-md shadow-[#E6005A]/15'
                          : 'hover:bg-[#201F2A] text-zinc-300 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#121118] border border-white/5 flex items-center justify-center shrink-0">
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
                            <div className="text-xs text-zinc-400 truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${item.badgeStyle}`}
                        >
                          {item.badgeText}
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
                  Hãy thử tìm tên kênh TV (VTV, HTV), sản phẩm V-Shop, bài hát truyền hình, đặc quyền Loyalty hoặc ứng dụng Space 360.
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

