export interface VplayArchiveVersion {
  id: string;
  version: string;
  versionNumber: number;
  name: string;
  url: string;
  codename: string;
  era: 'Khởi nguyên' | 'Thử nghiệm Beta' | 'Canary & Dev' | 'VNRT Group' | 'OreUI & Waves';
  releaseYear: string;
  description: string;
  highlights: string[];
  badgeColor: string;
}

export const VPLAY_ARCHIVE_VERSIONS: VplayArchiveVersion[] = [
  {
    id: 'vplay-1-0',
    version: '1.0',
    versionNumber: 1.0,
    name: 'Vplay 1.0 (Google Sites Classic)',
    url: 'https://sites.google.com/view/vplaybyota/',
    codename: 'Genesis OTA',
    era: 'Khởi nguyên',
    releaseYear: '2023',
    description: 'Phiên bản khởi nguyên đầu tiên của Vplay được xây dựng trên nền tảng Google Sites, đặt nền móng cho hệ thống truyền hình trực tuyến.',
    highlights: ['Nền tảng Google Sites', 'Giao diện danh sách kênh cổ điển', 'Player phát sóng ban sơ'],
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'vplay-2-0',
    version: '2.0',
    versionNumber: 2.0,
    name: 'Vplay 2.0 (Season 2 Early Preview)',
    url: 'https://v-play-s2ep.vercel.app/',
    codename: 'Season 2 EP',
    era: 'Khởi nguyên',
    releaseYear: '2023 - 2024',
    description: 'Bước chuyển mình đầu tiên sang nền tảng web hiện đại Vercel với trải nghiệm streaming được nâng cấp vượt bậc.',
    highlights: ['Chuyển dịch sang Vercel', 'Season 2 Early Preview', 'Cải thiện tốc độ tải luồng HLS'],
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  {
    id: 'vplay-3-0',
    version: '3.0',
    versionNumber: 3.0,
    name: 'Vplay 3.0 (Seven Edition)',
    url: 'https://vplay-seven.vercel.app/',
    codename: 'Seven Core',
    era: 'Khởi nguyên',
    releaseYear: '2024',
    description: 'Bản phát hành Seven đột phá mang đến ngôn ngữ thiết kế mới với thanh điều hướng và player tối ưu hơn.',
    highlights: ['Giao diện Vplay Seven', 'Hỗ trợ đa kênh VTV, HTV', 'Tối ưu hóa bộ nhớ đệm'],
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'vplay-4-0',
    version: '4.0',
    versionNumber: 4.0,
    name: 'Vplay 4.0 (OTA Web Edition)',
    url: 'https://vplaybyota.vercel.app/',
    codename: 'OTA Online',
    era: 'Khởi nguyên',
    releaseYear: '2024',
    description: 'Phiên bản hoàn thiện của nhánh OTA với giao diện trực quan, kết nối trực tiếp cộng đồng người theo dõi truyền hình.',
    highlights: ['Thương hiệu Vplay by OTA', 'Danh mục kênh phân loại rõ ràng', 'Hỗ trợ thiết bị di động'],
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    id: 'vplay-5-0',
    version: '5.0',
    versionNumber: 5.0,
    name: 'Vplay 5.0 (V2 Modern)',
    url: 'https://vplayv2.vercel.app/',
    codename: 'V2 Generation',
    era: 'Khởi nguyên',
    releaseYear: '2024',
    description: 'Thế hệ V2 giới thiệu giao diện dark mode hiện đại, tích hợp công cụ tra cứu kênh nhanh và danh sách yêu thích.',
    highlights: ['Giao diện V2 Dark Mode', 'Tra cứu kênh trực quan', 'Trình phát video ổn định cao'],
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'vplay-6-0',
    version: '6.0',
    versionNumber: 6.0,
    name: 'Vplay 6.0 (Beta Channel)',
    url: 'https://vplaybeta.vercel.app/',
    codename: 'Beta Channel',
    era: 'Thử nghiệm Beta',
    releaseYear: '2024',
    description: 'Kênh thử nghiệm công khai các tính năng mới trước khi đưa vào bản chính thức, thu hút đông đảo tester đóng góp ý kiến.',
    highlights: ['Kênh Beta công khai', 'Thử nghiệm tính năng xem trước', 'Thu thập phản hồi cộng đồng'],
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'vplay-7-0',
    version: '7.0',
    versionNumber: 7.0,
    name: 'Vplay 7.0 (Beta FA8K Edition)',
    url: 'https://vplaybeta-fa8k.vercel.app/',
    codename: 'FA8K Special',
    era: 'Thử nghiệm Beta',
    releaseYear: '2024',
    description: 'Nhánh thử nghiệm chuyên sâu FA8K tối ưu hóa phân giải siêu cao và khả năng giải mã video mượt mà trên nhiều thiết bị.',
    highlights: ['Tối ưu chuẩn FA8K', 'Giải mã luồng tốc độ cao', 'Cải thiện giao diện điều khiển'],
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  {
    id: 'vplay-8-0',
    version: '8.0',
    versionNumber: 8.0,
    name: 'Vplay 8.0 (Vplay-D Stage)',
    url: 'https://vplayd.vercel.app/',
    codename: 'Delta Stage',
    era: 'Thử nghiệm Beta',
    releaseYear: '2024 - 2025',
    description: 'Phiên bản Vplay-D (Delta) thử nghiệm các bố cục khung hình mới và nâng cao trải nghiệm xem truyền hình không gián đoạn.',
    highlights: ['Kiến trúc Delta Stage', 'Giảm độ trễ phát sóng', 'Thiết kế nút bấm nổi bật'],
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  },
  {
    id: 'vplay-9-0',
    version: '9.0',
    versionNumber: 9.0,
    name: 'Vplay 9.0 (Dev Branch Preview)',
    url: 'https://vplay-dev.vercel.app/',
    codename: 'Dev Branch',
    era: 'Canary & Dev',
    releaseYear: '2025',
    description: 'Nhánh phát triển của các lập trình viên Vplay nhằm kiểm thử các API streaming mới và tích hợp danh mục đa tiện ích.',
    highlights: ['Nhánh phát triển Dev Branch', 'Tích hợp API streaming tiên tiến', 'Giao diện nhà phát triển'],
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  {
    id: 'vplay-10-0',
    version: '10.0',
    versionNumber: 10.0,
    name: 'Vplay 10.0 (Dev Unified)',
    url: 'https://vplaydev.vercel.app/',
    codename: 'Unified Dev',
    era: 'Canary & Dev',
    releaseYear: '2025',
    description: 'Bản hợp nhất của các nhánh Dev, chuẩn hóa mã nguồn và cấu trúc phân phối nội dung truyền thông trực tuyến.',
    highlights: ['Chuẩn hóa mã nguồn', 'Thanh tìm kiếm nâng cấp', 'Thư viện kênh đồng bộ'],
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40'
  },
  {
    id: 'vplay-11-0',
    version: '11.0',
    versionNumber: 11.0,
    name: 'Vplay 11.0 (Canary Experimental)',
    url: 'https://vplaycanary.vercel.app/',
    codename: 'Canary Flight',
    era: 'Canary & Dev',
    releaseYear: '2025',
    description: 'Kênh phát hành Canary cập nhật liên tục từng ngày các thử nghiệm UI/UX mới nhất, bao gồm hệ thống cửa sổ ứng dụng.',
    highlights: ['Kênh phát hành Canary', 'Thử nghiệm tính năng hàng ngày', 'Cửa sổ ứng dụng tương tác'],
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
  },
  {
    id: 'vplay-12-0',
    version: '12.0',
    versionNumber: 12.0,
    name: 'Vplay 12.0 (Canary Continuous)',
    url: 'https://vplay-canary.vercel.app/',
    codename: 'Canary Continuous',
    era: 'Canary & Dev',
    releaseYear: '2025',
    description: 'Phiên bản Canary mở rộng với tính năng Speak For Me (Text to Speech), mô phỏng widget và hiệu ứng chuyển trang mượt mà.',
    highlights: ['Tích hợp Speak For Me TTS', 'Giao diện desktop app', 'Tối ưu hóa hiệu năng render'],
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40'
  },
  {
    id: 'vplay-13-0',
    version: '13.0',
    versionNumber: 13.0,
    name: 'Vplay 13.0 (VNRT App Transition)',
    url: 'https://vnrtapp.vercel.app/',
    codename: 'VNRT Genesis',
    era: 'VNRT Group',
    releaseYear: '2025',
    description: 'Cột mốc chuyển giao thương hiệu sang hệ sinh thái VNRT Media với cổng thông tin, tin tức thời sự và sự kiện cộng đồng.',
    highlights: ['Chuyển giao thương hiệu VNRT', 'Cổng tin tức trực tuyến', 'Tích hợp tài khoản cộng đồng'],
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40'
  },
  {
    id: 'vplay-14-0',
    version: '14.0',
    versionNumber: 14.0,
    name: 'Vplay 14.0 (VNRT App Production)',
    url: 'https://vnrt-app.vercel.app/',
    codename: 'VNRT Release',
    era: 'VNRT Group',
    releaseYear: '2025',
    description: 'Bản phát hành chính thức của VNRT App với độ ổn định cao, hệ thống xác thực người dùng và bảng điều khiển trực quan.',
    highlights: ['Bản ổn định VNRT App', 'Hệ thống xác thực bảo mật', 'Bảng điều khiển trực quan'],
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'vplay-15-0',
    version: '15.0',
    versionNumber: 15.0,
    name: 'Vplay 15.0 (Dev by VNRT Group)',
    url: 'https://vplaydevbyvnrt.vercel.app/',
    codename: 'VNRT Dev Suite',
    era: 'VNRT Group',
    releaseYear: '2025 - 2026',
    description: 'Bộ phát triển chuyên sâu do VNRT Group dẫn dắt, tích hợp các bộ công cụ phát sóng chuyên dụng và sandbox thử nghiệm.',
    highlights: ['Dẫn dắt bởi VNRT Group', 'Bộ công cụ phát sóng chuyên dụng', 'Kho tài nguyên mở rộng'],
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  },
  {
    id: 'vplay-16-0',
    version: '16.0',
    versionNumber: 16.0,
    name: 'Vplay 16.0 (OreUI Design System)',
    url: 'https://oreui-pi.vercel.app/',
    codename: 'OreUI Pi',
    era: 'OreUI & Waves',
    releaseYear: '2026',
    description: 'Tiên phong áp dụng ngôn ngữ thiết kế OreUI đậm chất Minecraft kết hợp kính thủy tinh Spatial Glass huyền ảo.',
    highlights: ['Ngôn ngữ thiết kế OreUI', 'Góc vuông 0% radius đặc trưng', 'Hiệu ứng pixel Minecraft'],
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40'
  },
  {
    id: 'vplay-17-0',
    version: '17.0',
    versionNumber: 17.0,
    name: 'Vplay 17.0 (Vplay Native Engine)',
    url: 'https://vplay-native.vercel.app/',
    codename: 'Native Core',
    era: 'OreUI & Waves',
    releaseYear: '2026',
    description: 'Tái cấu trúc toàn diện với trải nghiệm Native siêu tốc độ, giảm tải CPU và tăng tốc phần cứng tối đa.',
    highlights: ['Kiến trúc Native siêu tốc', 'Tăng tốc phần cứng tối đa', 'Đồng bộ hóa âm thanh hình ảnh'],
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'vplay-18-0',
    version: '18.0',
    versionNumber: 18.0,
    name: 'Vplay 18.0 (Visual Refresh)',
    url: 'https://vplay-refresh.vercel.app/',
    codename: 'Visual Refresh',
    era: 'OreUI & Waves',
    releaseYear: '2026',
    description: 'Lột xác thị giác hoàn toàn mới với Liquid Glass, Dynamic Island, âm thanh tương tác và các siêu ứng dụng Space 360.',
    highlights: ['Thiết kế Liquid Glass', 'Đảo thông minh Dynamic Island', 'Hệ thống tương tác âm thanh sống động'],
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
  },
  {
    id: 'vplay-19-0',
    version: '19.0',
    versionNumber: 19.0,
    name: 'Vplay 19.0 (Waves Community Hub)',
    url: 'https://waves-community.vercel.app/',
    codename: 'Waves Hub',
    era: 'OreUI & Waves',
    releaseYear: '2026 - Tương lai',
    description: 'Đỉnh cao tích hợp đưa Vplay trở thành trung tâm kết nối cộng đồng Waves, V-Flow, Bet Arena, Minecraft Container và AI Copilot.',
    highlights: ['Trung tâm cộng đồng Waves', 'Mạng xã hội V-Flow', 'Sàn cược Orbs & AI Copilot'],
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
  }
];
