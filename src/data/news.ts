import { NewsArticle } from '../types';

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-vietnam-today-launch',
    slug: 'vietnam-today-chuyen-doi-so-quoc-te',
    title: 'VIETNAM TODAY: Bước chuyển mình của truyền hình đối ngoại Việt Nam sang kỷ nguyên số 4K',
    subtitle: 'Nâng tầm hình ảnh đất nước với chuẩn hình ảnh Ultra HD và công nghệ phát sóng đa nền tảng',
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80',
    category: 'Thời sự truyền hình',
    publishedAt: '27 Tháng 8, 2026',
    readingTime: '5 phút đọc',
    author: {
      name: 'Nguyễn Thành Long',
      role: 'Biên tập viên Công nghệ Phát thanh Truyền hình',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    excerpt: 'Kênh VTV4 chính thức giới thiệu nhận diện thương hiệu mới của chương trình Vietnam Today cùng trường quay thực tế ảo tăng cường (AR/XR) 4K phục vụ khán giả toàn cầu.',
    content: [
      'Truyền hình đối ngoại luôn đóng vai trò là nhịp cầu văn hóa, thông tin và ngoại giao chiến lược của mỗi quốc gia. Tại Việt Nam, chương trình VIETNAM TODAY trên sóng VTV4 đã không ngừng đổi mới diện mạo và chuẩn mực sản xuất để cạnh tranh trực tiếp với các hãng thông tấn lớn trong khu vực.',
      'Với việc ứng dụng hệ thống trường quay thực tế ảo tăng cường kết hợp màn hình LED cong MicroLED siêu nét, người dẫn chương trình có thể tương tác trực tiếp với các đồ thị 3D không gian thời gian thực, tái hiện các cảnh quan di sản Việt Nam như Vịnh Hạ Long, Động Phong Nha hay Phố cổ Hội An ngay trong khuôn viên trường quay.',
      'Bên cạnh đó, quy trình phát sóng số hóa hoàn toàn từ tiền kỳ bằng camera Cinema 4K 10-bit HDR đến hậu kỳ trên hệ thống mạng SAN tốc độ cao 100Gbps giúp rút ngắn thời gian xử lý tin bài nóng xuống chỉ còn tính bằng phút.',
      'Đại diện Ban Truyền hình Đối ngoại VTV chia sẻ: "Mục tiêu của chúng tôi không chỉ là truyền tải thông tin, mà còn là mang đến trải nghiệm thị giác ấn tượng nhất, chạm vào cảm xúc của kiều bào và bạn bè quốc tế khi dõi theo từng bước chuyển mình của đất nước."'
    ],
    tags: ['VTV4', 'Vietnam Today', 'Truyền hình 4K', 'Thực tế ảo AR', 'Phát sóng số'],
    relatedChannelId: 'vtv4-hd',
    featured: true
  },
  {
    id: 'news-dvb-t2-nationwide',
    slug: 'so-hoa-truyen-hinh-dvb-t2-viet-nam',
    title: 'Tổng quan hệ thống truyền hình số mặt đất DVB-T2 tại Việt Nam và lộ trình phát triển',
    subtitle: 'Hành trình hoàn thành Đề án Số hóa truyền hình và bước chuẩn bị cho chuẩn thế hệ mới DVB-T2 4K',
    coverImage: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&auto=format&fit=crop&q=80',
    category: 'Công nghệ phát sóng',
    publishedAt: '25 Tháng 8, 2026',
    readingTime: '7 phút đọc',
    author: {
      name: 'Vũ Đức Nam',
      role: 'Kỹ sư Vô tuyến & Truyền dẫn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    excerpt: 'Phân tích vùng phủ sóng mạng đơn tần SFN, danh mục kênh truyền hình thiết yếu quốc gia và giải pháp thu sóng DVB-T2 tối ưu cho các hộ gia đình.',
    content: [
      'Đề án số hóa truyền dẫn, phát sóng truyền hình mặt đất đến năm 2020 của Chính phủ đã biến Việt Nam trở thành một trong những quốc gia tiên phong tại Đông Nam Á tắt hoàn toàn sóng truyền hình analog truyền thống.',
      'Hiện nay, mạng truyền hình số mặt đất DVB-T2 do VTV, VTC, SDTV và RTB vận hành phủ sóng trên 90% dân số, mang đến hàng chục kênh truyền hình chuẩn HD miễn phí không cần kết nối internet.',
      'Trong giai đoạn tiếp theo, các trạm phát sóng chính tại Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ đang được nâng cấp thử nghiệm bộ ghép kênh đa luồng HEVC (H.265) để chuẩn bị truyền dẫn các kênh thể thao và sự kiện văn hóa chất lượng 4K UHD trên hạ tầng mặt đất.'
    ],
    tags: ['DVB-T2', 'Số hóa truyền hình', 'VTV Broadcom', 'Mạng đơn tần SFN'],
    relatedChannelId: 'vtv1-hd'
  },
  {
    id: 'news-vtv-idents-history',
    slug: 'lich-su-do-hoa-ident-truyen-hinh-viet-nam',
    title: 'Lịch sử thiết kế đồ hoạ định dạng (Idents) và âm nhạc nhận diện của Đài Truyền hình Việt Nam',
    subtitle: 'Từ những hình hiệu vẽ tay thập niên 80 đến nhận diện 3D chuyển động đa chiều hiện đại',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    category: 'Đồ hoạ & Nhận diện',
    publishedAt: '22 Tháng 8, 2026',
    readingTime: '6 phút đọc',
    author: {
      name: 'Trần Minh Quang',
      role: 'Chuyên gia Motion Design & Thương hiệu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    excerpt: 'Khám phá giai thoại sáng tác giai điệu hình hiệu Thời sự kinh điển của nhạc sĩ Quang Vinh và những biến thể logo cánh buồm ba màu đỏ - xanh lá - xanh dương huyền thoại.',
    content: [
      'Âm điệu hào hùng "Tưng tưng tưng..." của bản tin Thời sự 19h đã in sâu vào tiềm thức của nhiều thế hệ người Việt. Ít ai biết rằng bản nhạc nền nhận diện này đã trải qua nhiều lần phối khí lại để phù hợp với từng giai đoạn phát triển kỹ thuật âm thanh.',
      'Bộ nhận diện logo VTV hình cánh buồm được chính thức áp dụng từ năm 1995 đã tạo nên một chuẩn mực mới về đồ họa nhận diện thương hiệu truyền hình tại Đông Nam Á.',
      'Trong thời đại kỹ thuật số, đồ họa motion graphics của VTV được thiết kế theo nguyên tắc tối giản, thanh lịch, ứng dụng mượt mà trên mọi tỷ lệ khung hình từ TV 16:9 đến màn hình dọc di động 9:16.'
    ],
    tags: ['Idents', 'Hình hiệu VTV', 'Motion Graphic', 'Âm nhạc thời sự']
  },
  {
    id: 'news-virtual-production-led',
    slug: 'phim-truong-ao-virtual-production-truyen-hinh',
    title: 'Phim trường ảo (Virtual Production) với LED Wall & Unreal Engine tại Trung tâm Sản xuất Truyền hình',
    subtitle: 'Cuộc cách mạng kỹ thuật số thay thế phông xanh truyền thống bằng không gian 3D tương tác theo thời gian thực',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
    category: 'Hậu trường & Kỹ thuật',
    publishedAt: '20 Tháng 8, 2026',
    readingTime: '8 phút đọc',
    author: {
      name: 'Lê Hoàng Anh',
      role: 'Đạo diễn Kỹ thuật Phim trường',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    },
    excerpt: 'Công nghệ Volume LED kết hợp Camera Tracking Stype và máy chủ render Unreal Engine đã chính thức vận hành tại các trường quay quy mô lớn tại Việt Nam.',
    content: [
      'Khác với kỹ thuật phông xanh (chroma key) vốn đòi hỏi xử lý hậu kỳ phức tạp và dễ bị ám màu, công nghệ Virtual Production với màn hình LED cong góc nhìn rộng cho phép ánh sáng môi trường tự nhiên phản chiếu trực tiếp lên diễn viên và đạo cụ.',
      'Nhờ hệ thống định vị camera thời gian thực qua sóng hồng ngoại, góc phối cảnh trong không gian 3D Unreal Engine được tính toán và dựng ngay lập tức theo từng chuyển động lia máy của quay phim.',
      'Ứng dụng này giúp các chương trình truyền hình lịch sử, khoa học viễn tưởng và gameshow âm nhạc đạt đến độ chân thực chưa từng có.'
    ],
    tags: ['Virtual Production', 'Unreal Engine', 'LED Wall', 'Trường quay S9']
  }
];
