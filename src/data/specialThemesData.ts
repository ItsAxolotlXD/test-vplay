export type SpecialThemeId = 'default' | 'new-year' | 'lunar-new-year' | 'christmas' | 'patriotic';

export interface SpecialTheme {
  id: SpecialThemeId;
  name: string;
  subname: string;
  description: string;
  dominantColor: string; // Mã màu chủ đạo
  dominantColorName: string;
  accentColor: string; // Mã màu nhấn
  accentColorName: string;
  primaryGlow: string;
  previewBg: string; // Tailwind gradient classes
  badge: string;
  tagline: string;
  keyFeatures: string[];
  elementsList: string[];
  priceOrbs: number; // 0 = Miễn phí
}

export const SPECIAL_THEMES: SpecialTheme[] = [
  {
    id: 'new-year',
    name: 'Tết Dương Lịch',
    subname: 'New Year Celebration',
    tagline: 'Chào Đón Năm Mới Rực Rỡ Ánh Sáng',
    description: 'Màu chủ đạo xanh tối huyền bí của bầu trời đêm giao thừa, pháo hoa bắn rực rỡ đa sắc màu và hàng vạn vì sao lấp lánh.',
    dominantColor: '#070E26',
    dominantColorName: 'Xanh tối (Midnight Blue)',
    accentColor: '#00F0FF',
    accentColorName: 'Neon Cyan & Vàng Gold',
    primaryGlow: 'rgba(0, 240, 255, 0.45)',
    previewBg: 'from-[#040817] via-[#0B1536] to-[#0A1A4E]',
    badge: 'NĂM MỚI',
    priceOrbs: 0,
    keyFeatures: [
      'Màu chủ đạo xanh tối huyền bí sâu thẳm',
      'Pháo hoa bắn rực rỡ và chân thực trên bầu trời',
      'Ánh sao và vệt sáng lấp lánh (Sparkling effects)',
      'Họa tiết đếm ngược chào năm mới thịnh vượng'
    ],
    elementsList: ['Pháo hoa nổ', 'Ánh sao lấp lánh', 'Bầu trời đêm xanh tối', 'Viền Neon Cyan']
  },
  {
    id: 'lunar-new-year',
    name: 'Tết Nguyên Đán',
    subname: 'Xuân Cát Tường - Vạn Sự Như Ý',
    tagline: 'Sắc Đỏ May Mắn, Mai Vàng & Đào Thắm',
    description: 'Màu chủ đạo là đỏ gấm rực rỡ mang lại may mắn và tài lộc, cành mai vàng phương Nam và cành đào hồng phương Bắc khoe sắc thắm cùng cánh hoa rơi dịu dàng.',
    dominantColor: '#880808',
    dominantColorName: 'Đỏ gấm truyền thống (Imperial Red)',
    accentColor: '#FFD700',
    accentColorName: 'Vàng Hoàng Kim',
    primaryGlow: 'rgba(255, 215, 0, 0.5)',
    previewBg: 'from-[#4A0000] via-[#850B0B] to-[#3B0000]',
    badge: 'TẾT TRUYỀN THỐNG',
    priceOrbs: 0,
    keyFeatures: [
      'Màu chủ đạo là đỏ may mắn kết hợp vàng kim cát tường',
      'Cành mai vàng nở rộ góc phải màn hình',
      'Cành đào phai hồng thắm rực rỡ góc trái màn hình',
      'Cánh hoa mai & hoa đào lãng đãng rơi theo làn gió xuân',
      'Lồng đèn đỏ đung đưa chúc mừng năm mới'
    ],
    elementsList: ['Cành mai vàng', 'Cành đào hồng', 'Cánh hoa rơi', 'Lồng đèn đỏ', 'Họa tiết mây lành']
  },
  {
    id: 'christmas',
    name: 'Christmas',
    subname: 'Giáng Sinh Diệu Kỳ & Ấm Áp',
    tagline: 'Mùa Đông Tuyết Trắng & Dây Đèn LED Lung Linh',
    description: 'Màu chủ đạo xanh thông tuyết phủ kết hợp đỏ quả châu mùa lễ hội, những bông tuyết trắng rơi lãng mạn và dây đèn LED Giáng sinh nhiều màu nhấp nháy ấm cúng.',
    dominantColor: '#0A2318',
    dominantColorName: 'Xanh lá thông mùa đông & Đỏ Noel',
    accentColor: '#EF4444',
    accentColorName: 'Đỏ Trái Châu & Trắng Tuyết',
    primaryGlow: 'rgba(239, 68, 68, 0.45)',
    previewBg: 'from-[#061710] via-[#0F3022] to-[#2B0909]',
    badge: 'GIÁNG SINH',
    priceOrbs: 0,
    keyFeatures: [
      'Màu chủ đạo xanh thông mùa đông và đỏ tuyết phủ',
      'Tuyết trắng tinh khôi rơi liên tục khắp màn hình',
      'Dây đèn LED Giáng sinh đa sắc nhấp nháy rực rỡ ở cạnh trên',
      'Bông tuyết pha lê và quả châu trang trí lung linh'
    ],
    elementsList: ['Tuyết rơi lãng mạn', 'Dây đèn LED lấp lánh', 'Cây thông tuyết', 'Ánh sáng ấm cúng']
  },
  {
    id: 'patriotic',
    name: 'Yêu Nước',
    subname: 'Tự Hào Cờ Đỏ Sao Vàng',
    tagline: 'Khí Phách Hào Hùng - Dân Tộc Việt Nam',
    description: 'Theme tôn vinh tinh thần yêu nước quật cường với màu chủ đạo là đỏ thắm của lá Cờ Tổ Quốc, lá Cờ Đỏ Sao Vàng tung bay kiêu hãnh, trống đồng Đông Sơn huyền thoại và hào quang ánh sáng rực rỡ.',
    dominantColor: '#950000',
    dominantColorName: 'Đỏ cờ Tổ quốc & Vàng sao năm cánh',
    accentColor: '#FFDF00',
    accentColorName: 'Vàng Ngôi Sao Tổ Quốc',
    primaryGlow: 'rgba(255, 223, 0, 0.55)',
    previewBg: 'from-[#4D0000] via-[#900505] to-[#450000]',
    badge: 'TỰ HÀO VIỆT NAM',
    priceOrbs: 0,
    keyFeatures: [
      'Màu chủ đạo đỏ cờ hào hùng thể hiện tình yêu nước nồng nàn',
      'Lá Cờ Đỏ Sao Vàng thiêng liêng bay phấp phới tự hào',
      'Họa tiết Trống Đồng Đông Sơn dập chìm uy nghiêm',
      'Hào quang sao vàng năm cánh phát sáng rạng ngời',
      'Dòng khẩu hiệu: Tôi Yêu Việt Nam • Tự Hào Đất Nước'
    ],
    elementsList: ['Cờ đỏ sao vàng', 'Trống đồng Đông Sơn', 'Hào quang vàng', 'Khí phách Việt Nam']
  }
];
