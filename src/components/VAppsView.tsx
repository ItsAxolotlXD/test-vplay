import React, { useState, useMemo } from 'react';
import { useTabSearch } from '../context/TabSearchContext';
import { playPopSound } from '../utils/sound';
import {
  Compass,
  Sparkles,
  Gamepad2,
  Folder,
  MapPin,
  Tv,
  GraduationCap,
  Calculator,
  Bell,
  Clock,
  Phone,
  Globe,
  CalendarDays,
  Image as ImageIcon,
  Camera,
  Ticket,
  CloudSun,
  StickyNote,
  Box,
  Radio,
  MessageSquare,
  Search,
  X,
  ArrowRight,
  TrendingUp,
  Activity,
  UtensilsCrossed,
  LucideIcon
} from 'lucide-react';

export type VAppId =
  | 'v_arcade'
  | 'v_xplore'
  | 'explore_vietnam'
  | 'v_maps'
  | 'v_box'
  | 'v_learn'
  | 'v_calc'
  | 'v_clock'
  | 'v_phone'
  | 'v_browser'
  | 'v_calendar'
  | 'v_gallery'
  | 'v_camera'
  | 'v_ticket'
  | 'v_weather'
  | 'v_reminders'
  | 'v_notes'
  | 'v_minecraft'
  | 'v_flow'
  | 'v_chat'
  | 'v_stock'
  | 'v_health'
  | 'cookbook';

export interface VAppDefinition {
  id: VAppId;
  name: string;
  tagline: string;
  description: string;
  category: 'Trò chơi (Arcade)' | 'Tiện ích & Tệp tin' | 'Học tập & Văn hóa' | 'Giải trí & Media';
  badge: string;
  gradientBg: string;
  borderClass: string;
  glowClass: string;
  icon: LucideIcon;
  tags: string[];
}

export const VAPPS_LIST: VAppDefinition[] = [
  // Hàng 1 (4 ứng dụng)
  {
    id: 'v_arcade',
    name: 'Games',
    tagline: 'Vòng Quay & Mini Games',
    description: 'Vòng Quay May Mắn Wheels of Fortune, Cờ Caro XO, Oẳn Tù Tì đối kháng, Nối Từ TV & EN, Đếm Số và Rắn Săn Mồi cổ điển.',
    category: 'Trò chơi (Arcade)',
    badge: 'Hot',
    gradientBg: 'bg-gradient-to-br from-[#FF4500] via-[#FF007A] to-[#7B2CBF]',
    borderClass: 'border-[#FF5E7E]/50 group-hover:border-[#FF5E7E]',
    glowClass: 'shadow-[0_10px_30px_rgba(255,0,122,0.35)]',
    icon: Gamepad2,
    tags: ['Wheels of Fortune', 'Vòng Quay May Mắn', 'Caro XO', 'Rắn Săn Mồi', 'Games', 'Arcade'],
  },
  {
    id: 'v_xplore',
    name: 'Files',
    tagline: 'Quản Lý Tệp Ore UI',
    description: 'Quản lý tệp đa năng phong cách Windows Explorer, xem trước media, phát danh sách phát M3U8 và sao lưu dữ liệu đám mây Cloud.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Tệp Tin',
    gradientBg: 'bg-gradient-to-br from-[#6A11CB] via-[#4338CA] to-[#2575FC]',
    borderClass: 'border-[#818CF8]/50 group-hover:border-[#818CF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(67,56,202,0.35)]',
    icon: Folder,
    tags: ['File Manager', 'M3U8 Playlists', 'Cloud Backup', 'Files', 'Explorer'],
  },
  {
    id: 'explore_vietnam',
    name: 'Explore Vietnam',
    tagline: 'Khám Phá 63 Tỉnh Thành',
    description: 'Bản đồ tương tác 63 tỉnh thành Việt Nam, tra cứu danh lam thắng cảnh, ẩm thực đặc sản, văn hóa truyền thống và thông tin địa lý.',
    category: 'Học tập & Văn hóa',
    badge: 'Bản Sắc',
    gradientBg: 'bg-gradient-to-br from-[#DC2626] via-[#E11D48] to-[#991B1B]',
    borderClass: 'border-[#FB7185]/50 group-hover:border-[#FB7185]',
    glowClass: 'shadow-[0_10px_30px_rgba(225,29,72,0.35)]',
    icon: MapPin,
    tags: ['63 Tỉnh Thành', 'Ẩm Thực', 'Danh Lam Thắng Cảnh', 'Explore Vietnam'],
  },
  {
    id: 'v_maps',
    name: 'Maps',
    tagline: 'Bản Đồ Không Gian 360° & Vệ Tinh',
    description: 'Bản đồ không gian 360 độ toàn cảnh, khám phá vệ tinh Trái Đất độ phân giải cao, danh lam thắng cảnh 360° Việt Nam và trạm vũ trụ ISS.',
    category: 'Học tập & Văn hóa',
    badge: 'Space 360',
    gradientBg: 'bg-gradient-to-br from-[#0EA5E9] via-[#2563EB] to-[#1D4ED8]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(14,165,233,0.35)]',
    icon: Globe,
    tags: ['Space 360', 'Maps', 'Bản Đồ Vệ Tinh', 'Toàn Cảnh 360', 'Street View', 'ISS Orbit', 'Bản Đồ Không Gian'],
  },
  {
    id: 'v_box',
    name: 'Box',
    tagline: 'Kho Video & Truyền Hình',
    description: 'Bộ sưu tập video giải trí đặc sắc, các clip phát lại chất lượng cao, luồng phát sóng chọn lọc và tin tức tổng hợp.',
    category: 'Giải trí & Media',
    badge: 'Media',
    gradientBg: 'bg-gradient-to-br from-[#F59E0B] via-[#EA580C] to-[#C2410C]',
    borderClass: 'border-[#FBBF24]/50 group-hover:border-[#FBBF24]',
    glowClass: 'shadow-[0_10px_30px_rgba(245,158,11,0.35)]',
    icon: Tv,
    tags: ['Video Clip', 'Phát Lại', 'Giải Trí HD', 'Box'],
  },

  // Hàng 2 (4 ứng dụng)
  {
    id: 'v_learn',
    name: 'Study',
    tagline: 'Flashcard & Tập Trung',
    description: 'Công cụ hỗ trợ học tập đắc lực: Đồng hồ đếm ngược Pomodoro tập trung sâu, quản lý bộ thẻ Flashcard và theo dõi tiến độ mục tiêu.',
    category: 'Học tập & Văn hóa',
    badge: 'Học Tập',
    gradientBg: 'bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#1D4ED8]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(2,132,199,0.35)]',
    icon: GraduationCap,
    tags: ['Pomodoro', 'Flashcards', 'Ghi Nhớ', 'Study'],
  },
  {
    id: 'v_calc',
    name: 'Calc',
    tagline: 'Máy Tính Biểu Thức',
    description: 'Máy tính bỏ túi khoa học hỗ trợ tính toán biểu thức phức tạp, lưu lịch sử phép tính và quy đổi đơn vị đo lường linh hoạt.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Khoa Học',
    gradientBg: 'bg-gradient-to-br from-[#0D9488] via-[#0891B2] to-[#0369A1]',
    borderClass: 'border-[#2DD4BF]/50 group-hover:border-[#2DD4BF]',
    glowClass: 'shadow-[0_10px_30px_rgba(13,148,136,0.35)]',
    icon: Calculator,
    tags: ['Khoa Học', 'Biểu Thức', 'Quy Đổi Đơn Vị', 'Calc'],
  },
  {
    id: 'v_clock',
    name: 'Clock',
    tagline: 'Báo Thức • Đếm Giờ • Giờ Quốc Tế',
    description: 'Báo thức thông minh đa năng, bấm giờ thể thao từng vòng, hẹn giờ đếm ngược và tra cứu giờ chuẩn quốc tế hơn 30 quốc gia.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Đồng Hồ',
    gradientBg: 'bg-gradient-to-br from-[#06B6D4] via-[#0284C7] to-[#4F46E5]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(6,182,212,0.35)]',
    icon: Clock,
    tags: ['Clock', 'Đồng Hồ', 'Báo Thức', 'Đếm Giờ', 'Bấm Giờ', 'Giờ Quốc Tế', 'World Clock', 'Timer'],
  },
  {
    id: 'v_phone',
    name: 'Phone',
    tagline: 'Bàn Phím & Danh Bạ',
    description: 'Bàn phím gọi số với hiệu ứng âm thanh DTMF chân thực, danh bạ liên hệ cá nhân và các đầu số cứu hộ khẩn cấp quốc gia 113, 114, 115.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Điện Thoại',
    gradientBg: 'bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337]',
    borderClass: 'border-[#FB7185]/50 group-hover:border-[#FB7185]',
    glowClass: 'shadow-[0_10px_30px_rgba(225,29,72,0.35)]',
    icon: Phone,
    tags: ['Điện Thoại', 'Bàn Phím', 'Danh Bạ', 'Khẩn Cấp', 'DTMF', 'Hotline', 'Phone'],
  },
  {
    id: 'v_browser',
    name: 'Browser',
    tagline: 'Duyệt Web & Tin Tức',
    description: 'Trình duyệt web tích hợp đa tab, điểm báo điện tử 24/7, tra cứu bách khoa toàn thư Wikipedia và cổng tin tức truyền hình.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Trình Duyệt',
    gradientBg: 'bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(2,132,199,0.35)]',
    icon: Globe,
    tags: ['Trình Duyệt', 'Browser', 'Duyệt Web', 'Wikipedia', 'Tin Tức', 'VnExpress', 'VTV'],
  },
  {
    id: 'v_calendar',
    name: 'Lịch Vạn Niên',
    tagline: 'Âm Dương Lịch & Sự Kiện',
    description: 'Lịch Vạn Niên song song Âm - Dương lịch, tra cứu ngày hoàng đạo, các ngày Lễ Tết truyền thống Việt Nam và quản lý sự kiện.',
    category: 'Học tập & Văn hóa',
    badge: 'Lịch',
    gradientBg: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#065F46]',
    borderClass: 'border-[#34D399]/50 group-hover:border-[#34D399]',
    glowClass: 'shadow-[0_10px_30px_rgba(5,150,105,0.35)]',
    icon: CalendarDays,
    tags: ['Lịch', 'Âm Lịch', 'Dương Lịch', 'Lịch Vạn Niên', 'Sự Kiện', 'Lễ Tết', 'Calendar'],
  },
  {
    id: 'v_gallery',
    name: 'Gallery',
    tagline: 'Kho Ảnh 4K & Album',
    description: 'Bộ sưu tập ảnh danh thắng Việt Nam, hậu trường trường quay truyền hình, trình chiếu slideshow toàn màn hình và lưu trữ ảnh cá nhân.',
    category: 'Giải trí & Media',
    badge: 'Thư Viện',
    gradientBg: 'bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]',
    borderClass: 'border-[#A78BFA]/50 group-hover:border-[#A78BFA]',
    glowClass: 'shadow-[0_10px_30px_rgba(124,58,237,0.35)]',
    icon: ImageIcon,
    tags: ['Thư Viện', 'Kho Ảnh', 'Album', 'Danh Thắng', 'Gallery', 'Hậu Trường', '4K'],
  },
  {
    id: 'v_camera',
    name: 'Camera',
    tagline: 'Chụp Ảnh & Bộ Lọc',
    description: 'Chụp ảnh trực tiếp từ webcam hoặc trường quay ảo, bộ lọc nghệ thuật Vintage, Cyberpunk, TV Scanlines và hẹn giờ tự động.',
    category: 'Giải trí & Media',
    badge: 'Camera',
    gradientBg: 'bg-gradient-to-br from-[#E11D48] via-[#C026D3] to-[#7E22CE]',
    borderClass: 'border-[#F472B6]/50 group-hover:border-[#F472B6]',
    glowClass: 'shadow-[0_10px_30px_rgba(192,38,211,0.35)]',
    icon: Camera,
    tags: ['Camera', 'Máy Ảnh', 'Chụp Ảnh', 'Bộ Lọc', 'Webcam', 'Vintage', 'Scanlines'],
  },
  {
    id: 'v_ticket',
    name: 'Ticket',
    tagline: 'Vé Phim, Concert & TV',
    description: 'Hệ thống đặt vé xem phim chiếu rạp, đại nhạc hội Liveshow, vé khán giả trường quay VTV và vé tàu du lịch với mã QR điện tử.',
    category: 'Giải trí & Media',
    badge: 'Đặt Vé',
    gradientBg: 'bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#78350F]',
    borderClass: 'border-[#FBBF24]/50 group-hover:border-[#FBBF24]',
    glowClass: 'shadow-[0_10px_30px_rgba(217,119,6,0.35)]',
    icon: Ticket,
    tags: ['Đặt Vé', 'Vé Xem Phim', 'Concert', 'Liveshow', 'Vé TV Show', 'QR Code', 'Ticket'],
  },
  {
    id: 'v_weather',
    name: 'Weather',
    tagline: 'Dự Báo & Khí Tượng 360',
    description: 'Dự báo thời tiết chi tiết 63 tỉnh thành Việt Nam, nhiệt độ theo giờ, chất lượng không khí AQI, chỉ số UV và dự báo 7 ngày.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Thời Tiết',
    gradientBg: 'bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#06B6D4]',
    borderClass: 'border-[#38BDF8]/50 group-hover:border-[#38BDF8]',
    glowClass: 'shadow-[0_10px_30px_rgba(14,165,233,0.35)]',
    icon: CloudSun,
    tags: ['Thời Tiết', 'Dự Báo', 'Khí Tượng', 'Nhiệt Độ', 'AQI', 'Tia UV', 'Weather'],
  },
  {
    id: 'v_reminders',
    name: 'Reminders',
    tagline: 'Nhắc Việc & Hẹn Giờ',
    description: 'Lên lịch nhắc nhở đón xem chương trình truyền hình yêu thích, các công việc quan trọng kèm chuông báo âm thanh cảnh báo sống động.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Báo Thức',
    gradientBg: 'bg-gradient-to-br from-[#EA580C] via-[#DC2626] to-[#991B1B]',
    borderClass: 'border-[#FB923C]/50 group-hover:border-[#FB923C]',
    glowClass: 'shadow-[0_10px_30px_rgba(234,88,12,0.35)]',
    icon: Bell,
    tags: ['Chuông Báo', 'Lịch Xem TV', 'Task Alert', 'Reminders'],
  },
  {
    id: 'v_notes',
    name: 'Notes',
    tagline: 'Sticky Notes Thông Minh',
    description: 'Soạn thảo văn bản ghi chú với hệ thống dán nhãn màu sắc phong phú, quản lý dạng thẻ Sticky Notes và tìm kiếm thông minh.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Ghi Chép',
    gradientBg: 'bg-gradient-to-br from-[#EAB308] via-[#CA8A04] to-[#A16207]',
    borderClass: 'border-[#FDE047]/50 group-hover:border-[#FDE047]',
    glowClass: 'shadow-[0_10px_30px_rgba(234,179,8,0.35)]',
    icon: StickyNote,
    tags: ['Ghi Chú Nhanh', 'Sticky Notes', 'Đồng Bộ', 'Notes'],
  },

  // Hàng 3 (4 ứng dụng)
  {
    id: 'v_minecraft',
    name: 'Minecraft',
    tagline: 'Mô Phỏng Rương Đồ Pixel Art',
    description: 'Trải nghiệm rương chứa đồ Chest, Double Chest, Ender Chest, Shulker Box, Hopper và Lò nung với âm thanh Web Audio chân thực.',
    category: 'Trò chơi (Arcade)',
    badge: 'Sandbox',
    gradientBg: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#064E3B]',
    borderClass: 'border-[#34D399]/50 group-hover:border-[#34D399]',
    glowClass: 'shadow-[0_10px_30px_rgba(5,150,105,0.35)]',
    icon: Box,
    tags: ['Minecraft Chest', 'Container GUI', 'Pixel Art', 'Inventory', 'Minecraft'],
  },
  {
    id: 'v_flow',
    name: 'Flow',
    tagline: 'Mạng Xã Hội & Radio Live',
    description: 'Không gian tương tác trực tiếp cộng đồng Vplay, phát thanh radio, chia sẻ cảm nghĩ và dòng thời gian cập nhật liên tục.',
    category: 'Giải trí & Media',
    badge: 'Kết Nối',
    gradientBg: 'bg-gradient-to-br from-[#3B82F6] via-[#1D4ED8] to-[#4338CA]',
    borderClass: 'border-[#60A5FA]/50 group-hover:border-[#60A5FA]',
    glowClass: 'shadow-[0_10px_30px_rgba(59,130,246,0.35)]',
    icon: Radio,
    tags: ['Flow', 'Mạng Xã Hội', 'Radio Live', 'Tương Tác'],
  },
  {
    id: 'v_chat',
    name: 'Chat',
    tagline: 'Phòng Chat Trực Tiếp',
    description: 'Phòng trò chuyện trực tuyến, giao lưu kết nối bạn bè xem truyền hình trên toàn quốc với biểu tượng cảm xúc phong phú.',
    category: 'Giải trí & Media',
    badge: 'Cộng Đồng',
    gradientBg: 'bg-gradient-to-br from-[#DB2777] via-[#9333EA] to-[#7C3AED]',
    borderClass: 'border-[#F472B6]/50 group-hover:border-[#F472B6]',
    glowClass: 'shadow-[0_10px_30px_rgba(219,39,119,0.35)]',
    icon: MessageSquare,
    tags: ['Chat', 'Phòng Chat', 'Cộng Đồng', 'Kết Nối'],
  },
  {
    id: 'v_stock',
    name: 'Stock',
    tagline: 'Chứng Khoán & Đầu Tư',
    description: 'Bảng giá chứng khoán trực tuyến VN-Index, HNX, UPCoM, biểu đồ kỹ thuật hình nến, phân tích kỹ thuật và quản lý danh mục đầu tư.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Tài Chính',
    gradientBg: 'bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857]',
    borderClass: 'border-[#34D399]/50 group-hover:border-[#34D399]',
    glowClass: 'shadow-[0_10px_30px_rgba(16,185,129,0.35)]',
    icon: TrendingUp,
    tags: ['Stock', 'Chứng Khoán', 'VN-Index', 'Tài Chính', 'Cổ Phiếu', 'Đầu Tư'],
  },
  {
    id: 'v_health',
    name: 'Health',
    tagline: 'Sức Khỏe & Thể Chất',
    description: 'Theo dõi chỉ số sức khỏe BMI, huyết áp, nhịp tim, nhắc nhở uống nước, vận động thể chất và thư viện bài tập thể dục tại nhà.',
    category: 'Tiện ích & Tệp tin',
    badge: 'Sức Khỏe',
    gradientBg: 'bg-gradient-to-br from-[#EC4899] via-[#E11D48] to-[#BE123C]',
    borderClass: 'border-[#FB7185]/50 group-hover:border-[#FB7185]',
    glowClass: 'shadow-[0_10px_30px_rgba(236,72,153,0.35)]',
    icon: Activity,
    tags: ['Health', 'Sức Khỏe', 'BMI', 'Nhịp Tim', 'Uống Nước', 'Y Tế'],
  },
  {
    id: 'cookbook',
    name: 'Cookbook',
    tagline: 'Cẩm Nang Ẩm Thực Ba Miền',
    description: 'Khám phá công thức nấu ăn 3 miền chuẩn vị, định lượng nguyên liệu chi tiết, mẹo vặt của bếp trưởng và đồng hồ bấm giờ nấu ăn tiện lợi.',
    category: 'Học tập & Văn hóa',
    badge: 'Ẩm Thực',
    gradientBg: 'bg-gradient-to-br from-[#EA580C] via-[#D97706] to-[#B45309]',
    borderClass: 'border-[#F97316]/50 group-hover:border-[#F97316]',
    glowClass: 'shadow-[0_10px_30px_rgba(234,88,12,0.35)]',
    icon: UtensilsCrossed,
    tags: ['Cookbook', 'Nấu Ăn', 'Ẩm Thực', 'Công Thức', 'Món Ngon', 'Phở Bò', 'Bún Chả', 'Cơm Tấm'],
  },
];

interface VAppsViewProps {
  initialAppId?: VAppId;
  selectedGameId?: string | null;
  navigate?: (route: string, state?: any) => void;
}

export const VAppsView: React.FC<VAppsViewProps> = ({
  initialAppId = 'v_arcade',
  selectedGameId = null,
  navigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const { searchQuery, setSearchQuery } = useTabSearch();

  const categories = [
    'Tất cả',
    'Trò chơi (Arcade)',
    'Tiện ích & Tệp tin',
    'Học tập & Văn hóa',
    'Giải trí & Media'
  ];

  const handleOpenDedicatedTab = (appId: VAppId) => {
    if (!navigate) return;
    switch (appId) {
      case 'v_arcade':
        navigate('/v-arcade', { appId: 'v_arcade', gameId: selectedGameId });
        break;
      case 'v_xplore':
        navigate('/v-files', { appId: 'v_xplore' });
        break;
      case 'explore_vietnam':
        navigate('/explore-vietnam', { appId: 'explore_vietnam' });
        break;
      case 'v_maps':
        navigate('/v-maps', { appId: 'v_maps' });
        break;
      case 'v_box':
        navigate('/v-box', { appId: 'v_box' });
        break;
      case 'v_learn':
        navigate('/v-study', { appId: 'v_learn' });
        break;
      case 'v_calc':
        navigate('/v-calc', { appId: 'v_calc' });
        break;
      case 'v_clock':
        navigate('/v-clock', { appId: 'v_clock' });
        break;
      case 'v_phone':
        navigate('/v-phone', { appId: 'v_phone' });
        break;
      case 'v_browser':
        navigate('/v-browser', { appId: 'v_browser' });
        break;
      case 'v_calendar':
        navigate('/v-calendar', { appId: 'v_calendar' });
        break;
      case 'v_gallery':
        navigate('/v-gallery', { appId: 'v_gallery' });
        break;
      case 'v_camera':
        navigate('/v-camera', { appId: 'v_camera' });
        break;
      case 'v_ticket':
        navigate('/v-ticket', { appId: 'v_ticket' });
        break;
      case 'v_weather':
        navigate('/v-weather', { appId: 'v_weather' });
        break;
      case 'v_reminders':
        navigate('/v-reminders', { appId: 'v_reminders' });
        break;
      case 'v_notes':
        navigate('/v-notes', { appId: 'v_notes' });
        break;
      case 'v_minecraft':
        navigate('/minecraft', { appId: 'v_minecraft' });
        break;
      case 'v_flow':
        navigate('/v-flow', { appId: 'v_flow' });
        break;
      case 'v_chat':
        navigate('/chat', { appId: 'v_chat' });
        break;
      case 'v_stock':
        navigate('/v-stock', { appId: 'v_stock' });
        break;
      case 'v_health':
        navigate('/v-health', { appId: 'v_health' });
        break;
      case 'cookbook':
        navigate('/cookbook', { appId: 'cookbook' });
        break;
      default:
        navigate('/space-360');
    }
  };

  const handleSelectApp = (appId: VAppId) => {
    playPopSound();
    handleOpenDedicatedTab(appId);
  };

  const filteredApps = useMemo(() => {
    return VAPPS_LIST.filter((app) => {
      let matchCat = true;
      if (selectedCategory !== 'Tất cả') {
        matchCat = app.category === selectedCategory;
      }

      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div id="waves-vapps-view" className="w-full max-w-5xl mx-auto pb-16 text-left select-none animate-in fade-in duration-300">
      
      {/* 1. CATEGORY PILLS */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-6">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playPopSound();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-0 ${
                  isSelected
                    ? 'bg-[#E6005A] text-white shadow-md font-bold'
                    : 'bg-[#1E1E24] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A34]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Cổng không gian (Space 360)</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6005A]/20 text-[#FF4D8B]">
                {VAPPS_LIST.length} Ứng dụng
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Hệ sinh thái ứng dụng và tiện ích tương tác: V-Games, V-Files, Explore Vietnam, V-Study, Minecraft...
            </p>
          </div>
        </div>

        {/* Search capsule input */}
        <div className="relative w-full sm:w-72 h-[42px] flex items-center px-4 rounded-full bg-[#16151D] text-xs transition-all border-0 shadow-inner shrink-0">
          <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm ứng dụng Space 360..."
            className="w-full bg-transparent text-xs text-white placeholder-[#8E8E93] focus:outline-none font-medium truncate"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. BẢNG BANNER TRÒN CỦA SPACE 360: MỖI DÒNG 4 ỨNG DỤNG */}
      <div className="py-2 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-9 sm:gap-y-12 gap-x-4 sm:gap-x-8 max-w-5xl mx-auto">
          {filteredApps.map((app) => {
            const AppIcon = app.icon;

            return (
              <button
                key={app.id}
                id={`space-app-circular-${app.id}`}
                onClick={() => handleSelectApp(app.id)}
                className="flex flex-col items-center group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              >
                {/* Circular Banner: tròn, có viền, màu gradient và iconography của ứng dụng */}
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full relative flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-108 group-active:scale-95 ${app.gradientBg} border-2 sm:border-[3px] ${app.borderClass} ${app.glowClass}`}
                >
                  {/* Subtle glossy top sheen reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/35 pointer-events-none" />

                  {/* Concentric inner radial halo for depth */}
                  <div className="absolute w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/10 blur-sm pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                  {/* Iconography of the application */}
                  <div className="relative z-10 flex items-center justify-center text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    <AppIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 stroke-[1.8]" />
                  </div>

                  {/* Subtle inner hover glow */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 pointer-events-none" />

                  {/* App Badge at top-right */}
                  {app.badge && (
                    <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-lg pointer-events-none z-20">
                      {app.badge}
                    </span>
                  )}

                  {/* Launch indicator on hover */}
                  <div className="absolute bottom-2.5 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-20">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-zinc-900 shadow-md flex items-center gap-1">
                      <span>Mở tab</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

                {/* Title underneath */}
                <span
                  className="mt-3 sm:mt-4 text-sm sm:text-base font-bold transition-colors text-center tracking-tight text-white/90 group-hover:text-[#FF4081]"
                >
                  {app.name}
                </span>

                {/* Tagline underneath */}
                <span className="text-[11px] text-zinc-400 text-center line-clamp-1 mt-0.5 font-medium max-w-[150px]">
                  {app.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-sm">Không tìm thấy ứng dụng phù hợp với từ khóa "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#E6005A] text-white text-xs font-bold cursor-pointer"
            >
              Xem tất cả ứng dụng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

