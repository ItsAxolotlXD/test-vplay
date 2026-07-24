import React, { useState, useMemo } from "react";
import {
  Book,
  BookOpen,
  Bookmark,
  Search,
  ChevronLeft,
  ChevronRight,
  Volume2
} from "lucide-react";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  totalPages: number; // 100 - 500 pages
  cover: string;
  rating: number;
  description: string;
  chapters: { title: string; startPage: number }[];
}

const BOOK_CATEGORIES = [
  "Viễn Tưởng Vũ Trụ",
  "Huyền Thuyết & Giả Tưởng",
  "Triết Học Tương Lai",
  "Tình Yêu & Ký Ức",
  "Khoa Học Bí Ẩn",
  "Kỳ Ảo Đa Vũ Trụ",
  "Cuộc Phiêu Lưu Vô Tận",
  "Tâm Thức & Thời Gian"
];

const COVERS = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80"
];

// 100 ORIGINAL CREATIVE FICTIONAL BOOKS (100-500 PAGES)
const RAW_FICTION_BOOKS: { title: string; author: string; category: string; pages: number }[] = [
  // Viễn Tưởng Vũ Trụ (1-13)
  { title: "Tiếng Thầm Từ Những Tinh Cầu Cổ", author: "Vũ Phong Hải", category: "Viễn Tưởng Vũ Trụ", pages: 340 },
  { title: "Ngọn Hải Đăng Ở Ranh Giới Hư Không", author: "Lâm Ngân Hà", category: "Viễn Tưởng Vũ Trụ", pages: 420 },
  { title: "Nhật Ký Người Giữ Trạm Không Gian 09", author: "Trần Minh Khuê", category: "Viễn Tưởng Vũ Trụ", pages: 280 },
  { title: "Chuyến Tàu Đêm Qua Dải Ngân Hà", author: "Nguyễn Hoàng Nam", category: "Viễn Tưởng Vũ Trụ", pages: 310 },
  { title: "Hạt Bụi Cuối Cùng Của Hệ Mặt Trời", author: "Lê Nhật Quang", category: "Viễn Tưởng Vũ Trụ", pages: 490 },
  { title: "Bản Tình Ca Giữa Hai Lỗ Đen", author: "Đặng Thu Thảo", category: "Viễn Tưởng Vũ Trụ", pages: 230 },
  { title: "Thành Phố Sương Trên Hành Tinh Băng", author: "Hoàng Khánh Linh", category: "Viễn Tưởng Vũ Trụ", pages: 380 },
  { title: "Sứ Giả Của Những Vì Sao Tuyệt Diệt", author: "Phạm Quốc Bảo", category: "Viễn Tưởng Vũ Trụ", pages: 460 },
  { title: "Mật Mã Di Cốt Ngân Hà", author: "Vũ Đức Huy", category: "Viễn Tưởng Vũ Trụ", pages: 500 },
  { title: "Trái Đất Thứ Hai: Bình Minh Mới", author: "Ninh Thái Sơn", category: "Viễn Tưởng Vũ Trụ", pages: 410 },
  { title: "Bóng Đêm Chiếu Sáng Chòm Sao Thiên Nga", author: "Bùi Mẫn Nhi", category: "Viễn Tưởng Vũ Trụ", pages: 295 },
  { title: "Trạm Dừng Chân Tại Vòng Tròn Saturn", author: "Đỗ Anh Tuấn", category: "Viễn Tưởng Vũ Trụ", pages: 180 },
  { title: "Kẻ Hành Hương Qua Cổng Wormhole", author: "Tô Vũ Khang", category: "Viễn Tưởng Vũ Trụ", pages: 360 },

  // Huyền Thuyết & Giả Tưởng (14-26)
  { title: "Long Mạch Bên Dưới Lòng Đất Cổ", author: "Nguyễn Thanh Phong", category: "Huyền Thuyết & Giả Tưởng", pages: 450 },
  { title: "Bí Mật Của Cây Cổ Thụ Ngàn Năm", author: "Đoàn Mộc Trà", category: "Huyền Thuyết & Giả Tưởng", pages: 260 },
  { title: "Thuyền Trưởng Của Linh Hồn Mất Tích", author: "Trịnh Đông Quân", category: "Huyền Thuyết & Giả Tưởng", pages: 480 },
  { title: "Truyền Thuyết Vương Quốc Trong Mây", author: "Hà Vân Chi", category: "Huyền Thuyết & Giả Tưởng", pages: 330 },
  { title: "Nguyện Cầu Dưới Mưa Tuyết Băng Giá", author: "Lương Tuyết Mai", category: "Huyền Thuyết & Giả Tưởng", pages: 210 },
  { title: "Hoàng Tử Của Những Giấc Mơ Tàn", author: "Trương Quốc Huy", category: "Huyền Thuyết & Giả Tưởng", pages: 390 },
  { title: "Mặt Nạ Ngọc Bích Và Lời Nguyền Cổ", author: "Phan Nhật Tiến", category: "Huyền Thuyết & Giả Tưởng", pages: 430 },
  { title: "Phù Thủy Cuối Cùng Ở Rừng Bạc", author: "Lê Cẩm Tú", category: "Huyền Thuyết & Giả Tưởng", pages: 275 },
  { title: "Thành Phố Dưới Đáy Biển Cổ Đại", author: "Ngô Quang Vinh", category: "Huyền Thuyết & Giả Tưởng", pages: 490 },
  { title: "Cánh Cửa Mở Ra Thế Giới Linh Thú", author: "Phùng Bảo Châu", category: "Huyền Thuyết & Giả Tưởng", pages: 320 },
  { title: "Thánh Điện Tuyết Và Rồng Thiêng", author: "Nguyễn Hải Dương", category: "Huyền Thuyết & Giả Tưởng", pages: 440 },
  { title: "Thợ Săn Bóng Đêm Trong Thung Lũng", author: "Đỗ Gia Bảo", category: "Huyền Thuyết & Giả Tưởng", pages: 310 },
  { title: "Chiếc Nhẫn Đồng Và Tiếng Gọi Cổ Nữ", author: "Hoàng Mộng Tuyền", category: "Huyền Thuyết & Giả Tưởng", pages: 240 },

  // Triết Học Tương Lai (27-39)
  { title: "Tâm Thức Của Máy Móc Năm 2150", author: "ThS. Nguyễn Hoàng Anh", category: "Triết Học Tương Lai", pages: 350 },
  { title: "Sống Giữa Hai Tầng Thực Tái A.I", author: "Đinh Trường Giang", category: "Triết Học Tương Lai", pages: 410 },
  { title: "Hành Trình Tìm Lại Bản Thể Kỹ Thuật Số", author: "Lê Hoài An", category: "Triết Học Tương Lai", pages: 290 },
  { title: "Bàn Về Tự Do Trong Thế Giới Thuật Toán", author: "Vũ Tiến Dũng", category: "Triết Học Tương Lai", pages: 470 },
  { title: "Linh Hồn Trong Lõi Silicon", author: "Trần Viết Cường", category: "Triết Học Tương Lai", pages: 380 },
  { title: "Giao Thoa Giữa Cảm Xúc Và Mã Code", author: "Đoàn Phương Thảo", category: "Triết Học Tương Lai", pages: 220 },
  { title: "Định Luật Của Những Trái Tim Nhân Tạo", author: "Nguyễn Văn Hùng", category: "Triết Học Tương Lai", pages: 330 },
  { title: "Bình Mới Rượu Cũ: Đạo Đức Tương Lai", author: "Lâm Tuệ Mẫn", category: "Triết Học Tương Lai", pages: 450 },
  { title: "Thượng Đế Của Những Dòng Lệnh", author: "Phan Văn Trung", category: "Triết Học Tương Lai", pages: 490 },
  { title: "Tương Lai Của Nỗi Cô Đơn Loài Người", author: "Hoàng Bích Phương", category: "Triết Học Tương Lai", pages: 260 },
  { title: "Khi Ý Thức Được Sao Chép Lên Cloud", author: "Trịnh Minh Đạt", category: "Triết Học Tương Lai", pages: 370 },
  { title: "Triết Lý Của Khoảnh Khắc Hiện Tại 4.0", author: "Bùi Kim Ngân", category: "Triết Học Tương Lai", pages: 300 },
  { title: "Đế Chế Của Sự Im Lặng Điện Tử", author: "Đỗ Minh Khang", category: "Triết Học Tương Lai", pages: 420 },

  // Tình Yêu & Ký Ức (40-52)
  { title: "Gửi Anh Ở Chuyến Tàu Năm 1998", author: "Nguyễn Hà My", category: "Tình Yêu & Ký Ức", pages: 280 },
  { title: "Nơi Thời Gian Trôi Sóng Đôi", author: "Trần Mộc Mẫn", category: "Tình Yêu & Ký Ức", pages: 320 },
  { title: "Thư Tình Trong Hộp Thư Số 07", author: "Lê Nhật Hạ", category: "Tình Yêu & Ký Ức", pages: 195 },
  { title: "Quán Cà Phê Mưa Ở Góc Phố Cổ", author: "Đặng An Nhiên", category: "Tình Yêu & Ký Ức", pages: 240 },
  { title: "Ký Ức Đã Tắm Trong Sương Sớm", author: "Phạm Quỳnh Anh", category: "Tình Yêu & Ký Ức", pages: 310 },
  { title: "Mùa Hè Năm Đó Chúng Ta 18 Tuổi", author: "Vũ Bảo Nam", category: "Tình Yêu & Ký Ức", pages: 360 },
  { title: "Gió Thoảng Hương Hoa Nhài Mùa Thu", author: "Hoàng Yến Trinh", category: "Tình Yêu & Ký Ức", pages: 220 },
  { title: "Lỡ Một Nhịp Đập Chiều Hoàng Hôn", author: "Bùi Đức Mạnh", category: "Tình Yêu & Ký Ức", pages: 290 },
  { title: "Những Ngón Tay Đan Giữa Ngày Mưa", author: "Ninh Bảo Ngọc", category: "Tình Yêu & Ký Ức", pages: 250 },
  { title: "Dưới Ánh Đèn Đường Thành Phố Cũ", author: "Tô Minh Huy", category: "Tình Yêu & Ký Ức", pages: 340 },
  { title: "Cuốn Sổ Tay Bìa Đỏ Của Mẹ", author: "Trịnh Thảo Nguyên", category: "Tình Yêu & Ký Ức", pages: 210 },
  { title: "Gặp Lại Em Ở Hành Tinh Khác", author: "Đỗ Tuấn Kiệt", category: "Tình Yêu & Ký Ức", pages: 400 },
  { title: "Cánh Hoa Anh Đào Trong Sương Mù", author: "Lương Phương Chi", category: "Tình Yêu & Ký Ức", pages: 270 },

  // Khoa Học Bí Ẩn (53-65)
  { title: "Mật Mã Di Cốt Trong Hang Động Cổ", author: "GS. Phạm Văn Vinh", category: "Khoa Học Bí Ẩn", pages: 480 },
  { title: "Tần Số Âm Thanh Bị Bỏ Quên 432Hz", author: "Nguyễn Đức Trí", category: "Khoa Học Bí Ẩn", pages: 360 },
  { title: "Bản Thiết Kế Trọng Lực Nhân Tạo", author: "Hoàng Tấn Phát", category: "Khoa Học Bí Ẩn", pages: 430 },
  { title: "Sóng Não Và Những Khả Năng Ẩn Dấu", author: "Trần Bảo Lâm", category: "Khoa Học Bí Ẩn", pages: 310 },
  { title: "Hành Trình Tìm Khái Niệm Thời Gian", author: "Lê Minh Trí", category: "Khoa Học Bí Ẩn", pages: 490 },
  { title: "Phương Trình Cân Bằng Năng Lượng Tối", author: "Vũ Hoàng Gia", category: "Khoa Học Bí Ẩn", pages: 450 },
  { title: "Bí Ẩn Của Những Tinh Thể Băng Cổ", author: "Đặng Việt Hoàng", category: "Khoa Học Bí Ẩn", pages: 370 },
  { title: "Hiện Tượng Vướng Mắc Lượng Tử", author: "Trịnh Minh Vương", category: "Khoa Học Bí Ẩn", pages: 280 },
  { title: "Từ Trường Trái Đất Và Sự Biến Đổi", author: "Bùi Văn Thành", category: "Khoa Học Bí Ẩn", pages: 390 },
  { title: "Cấu Trúc Của Trường Sinh Học", author: "Ninh Công Danh", category: "Khoa Học Bí Ẩn", pages: 420 },
  { title: "Những Vì Sao Phát Sáng Kỳ Lạ", author: "Đỗ Hoàng Long", category: "Khoa Học Bí Ẩn", pages: 330 },
  { title: "Dữ Liệu ADN Của Văn Minh Đã Mất", author: "Lương Tiến Đạt", category: "Khoa Học Bí Ẩn", pages: 470 },
  { title: "Thế Giới Bị Ẩn Bên Trong Nguyên Tử", author: "Phan Văn Nam", category: "Khoa Học Bí Ẩn", pages: 350 },

  // Kỳ Ảo Đa Vũ Trụ (66-77)
  { title: "Nhật Ký Của Kẻ Xuyên Qua Đa Vũ Trụ", author: "Vũ Minh Khôi", category: "Kỳ Ảo Đa Vũ Trụ", pages: 500 },
  { title: "Nơi Mọi Lựa Chọn Đều Tồn Tại", author: "Trần Anh Quân", category: "Kỳ Ảo Đa Vũ Trụ", pages: 440 },
  { title: "Thành Phố Phản Chiếu Trong Gương", author: "Lê Yến Nhi", category: "Kỳ Ảo Đa Vũ Trụ", pages: 310 },
  { title: "Kế Hoạch Cứu Vãn Thực Tại Thứ 04", author: "Hoàng Minh Trí", category: "Kỳ Ảo Đa Vũ Trụ", pages: 480 },
  { title: "Người Đội Mũ Rơm Giữa Hai Đảo Chiều", author: "Nguyễn Hải Đăng", category: "Kỳ Ảo Đa Vũ Trụ", pages: 390 },
  { title: "Chiếc Đồng Hồ Của Kẻ Săn Vũ Trụ", author: "Đặng Quang Minh", category: "Kỳ Ảo Đa Vũ Trụ", pages: 420 },
  { title: "Tầng Lớp Bị Lên Ứng Ứng Xâm Nhập", author: "Phạm Hoàng Sơn", category: "Kỳ Ảo Đa Vũ Trụ", pages: 360 },
  { title: "Cây Cầu Bằng Ánh Sáng Nối Hai Thế Giới", author: "Trịnh Khánh Vy", category: "Kỳ Ảo Đa Vũ Trụ", pages: 270 },
  { title: "Mùa Thu Không Bao Giờ Tàn Ở Không Gian X", author: "Bùi Mỹ Duyên", category: "Kỳ Ảo Đa Vũ Trụ", pages: 330 },
  { title: "Sóng Chiều Thứ Tư Và Kẻ Du Hành", author: "Đỗ Quốc Việt", category: "Kỳ Ảo Đa Vũ Trụ", pages: 460 },
  { title: "Bức Thư Gửi Bản Thể Ở Tương Lai", author: "Lương Bảo Kim", category: "Kỳ Ảo Đa Vũ Trụ", pages: 290 },
  { title: "Cánh Cửa Mở Vào Vô Tận", author: "Phan Nhật Anh", category: "Kỳ Ảo Đa Vũ Trụ", pages: 380 },

  // Cuộc Phiêu Lưu Vô Tận (78-88)
  { title: "Chinh Phục Đỉnh Nối Cao Nhất Trái Đất", author: "Nguyễn Văn Cường", category: "Cuộc Phiêu Lưu Vô Tận", pages: 410 },
  { title: "Băng Qua Sa Mạc Lớn Nhất Châu Phi", author: "Lê Văn Hùng", category: "Cuộc Phiêu Lưu Vô Tận", pages: 350 },
  { title: "Hành Trình Chèo Thuyền Đơn Độc Qua Thái Bình Dương", author: "Trần Hoàng Long", category: "Cuộc Phiêu Lưu Vô Tận", pages: 470 },
  { title: "Bí Mật Rừng Già Amazon Và Kẻ Tìm Báu Vật", author: "Hoàng Đức Anh", category: "Cuộc Phiêu Lưu Vô Tận", pages: 390 },
  { title: "Dưới Lòng Đất Của Núi Lửa Băng Giá", author: "Đặng Văn Lâm", category: "Cuộc Phiêu Lưu Vô Tận", pages: 320 },
  { title: "Bản Đồ Mất Tích Của Bộ Tộc Cổ", author: "Phạm Minh Hoàng", category: "Cuộc Phiêu Lưu Vô Tận", pages: 440 },
  { title: "Đi Tìm Đảo Ngọc Ở Ranh Giới Biển Nam", author: "Vũ Bảo Quốc", category: "Cuộc Phiêu Lưu Vô Tận", pages: 280 },
  { title: "Chuyến Đi Không Có Ngày Trở Về", author: "Đỗ Gia Hưng", category: "Cuộc Phiêu Lưu Vô Tận", pages: 490 },
  { title: "Theo Dấu Chân Báo Tuyết Himalayas", author: "Trịnh Anh Dũng", category: "Cuộc Phiêu Lưu Vô Tận", pages: 360 },
  { title: "Con Đường Tơ Lụa Mới Đột Phá", author: "Bùi Tiến Dũng", category: "Cuộc Phiêu Lưu Vô Tận", pages: 430 },
  { title: "Cạn Ly Ở Tận Cùng Thế Giới Patagonia", author: "Ninh Văn Hải", category: "Cuộc Phiêu Lưu Vô Tận", pages: 300 },

  // Tâm Thức & Thời Gian (89-100)
  { title: "Nhật Ký Của Người Giữ Thời Gian", author: "Trần An Yên", category: "Tâm Thức & Thời Gian", pages: 320 },
  { title: "Tiếng Chuông Trong Sương Ngân Chiều", author: "Thích Giác Minh", category: "Tâm Thức & Thời Gian", pages: 250 },
  { title: "Nghệ Thuật Lắng Nghe Tiếng Nói Bên Trong", author: "Nguyễn Khánh An", category: "Tâm Thức & Thời Gian", pages: 290 },
  { title: "Sức Mạnh Của Sự Bình Yên Trong Tâm", author: "Lê Hoài Thu", category: "Tâm Thức & Thời Gian", pages: 220 },
  { title: "Trải Nghiệm Cận Tử Và Sự Thức Tỉnh", author: "Hoàng Văn Nam", category: "Tâm Thức & Thời Gian", pages: 380 },
  { title: "Bước Chân Trên Con Đường Chữa Lành", author: "Đặng Mỹ Tâm", category: "Tâm Thức & Thời Gian", pages: 270 },
  { title: "Vũ Điệu Của Những Ý Ký Ức Tuổi Trẻ", author: "Phạm Thu Hương", category: "Tâm Thức & Thời Gian", pages: 310 },
  { title: "Tâm Trí Nhẹ Nhàng Như Mây Trắng", author: "Vũ Tuệ Lâm", category: "Tâm Thức & Thời Gian", pages: 240 },
  { title: "Bí Mật Của Giấc Mơ Sáng Suốt (Lucid)", author: "Đỗ Hoàng Nam", category: "Tâm Thức & Thời Gian", pages: 360 },
  { title: "Thả Trôi Nỗi Buồn Theo Dòng Sông Cổ", author: "Trịnh Thanh Nhàn", category: "Tâm Thức & Thời Gian", pages: 210 },
  { title: "Hơi Thở Đầu Tiên Giữa Bình Minh", author: "Bùi Ánh Tuyết", category: "Tâm Thức & Thời Gian", pages: 280 },
  { title: "Hành Trình Trở Về Nguyên Bản", author: "Lương Minh Đạt", category: "Tâm Thức & Thời Gian", pages: 410 }
];

const ALL_BOOKS_100: BookItem[] = RAW_FICTION_BOOKS.map((b, idx) => {
  const coverImg = COVERS[idx % COVERS.length];
  const pages = b.pages;
  const c1 = Math.floor(pages * 0.25);
  const c2 = Math.floor(pages * 0.5);
  const c3 = Math.floor(pages * 0.75);

  return {
    id: `vbook-${idx + 1}`,
    title: b.title,
    author: b.author,
    category: b.category,
    totalPages: pages,
    cover: coverImg,
    rating: Number((4.7 + (idx % 4) * 0.08).toFixed(1)),
    description: `Tác phẩm viễn tưởng - tâm tưởng hấp dẫn "${b.title}" sáng tạo bởi tác giả ${b.author}, dài ${pages} trang. Một câu chuyện đong đầy cảm xúc, ý nghĩa sâu sắc và khám phá giới hạn con người.`,
    chapters: [
      { title: `Phần 1: Khởi Đầu & Khai Mở (Trang 1 - ${c1})`, startPage: 1 },
      { title: `Phần 2: Biến Cố & Hành Trình Vô Tận (Trang ${c1 + 1} - ${c2})`, startPage: c1 + 1 },
      { title: `Phần 3: Cao Trào & Thức Tỉnh (Trang ${c2 + 1} - ${c3})`, startPage: c2 + 1 },
      { title: `Phần 4: Đọng Lại Ký Ức & Kết Luận (Trang ${c3 + 1} - ${pages})`, startPage: c3 + 1 }
    ]
  };
});

export const VBooksTab: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readerTheme, setReaderTheme] = useState<"dark" | "sepia" | "light" | "emerald">("dark");
  const [fontSize, setFontSize] = useState(16);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isTTSActive, setIsTTSActive] = useState(false);

  const filteredBooks = useMemo(() => {
    return ALL_BOOKS_100.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "all" || b.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const currentChapter = useMemo(() => {
    if (!selectedBook) return null;
    let ch = selectedBook.chapters[0];
    for (const c of selectedBook.chapters) {
      if (currentPage >= c.startPage) ch = c;
    }
    return ch;
  }, [selectedBook, currentPage]);

  const toggleBookmark = (page: number) => {
    setBookmarks((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const generatePageText = (book: BookItem, page: number) => {
    return `TRANG ${page} / ${book.totalPages}\n\n` +
      `Chương: ${currentChapter?.title || "Nội dung hư cấu"}\n\n` +
      `Trích đoạn tác phẩm viễn tưởng "${book.title}" - Tác giả ${book.author}:\n\n` +
      `1. Trong khoảng không lặng im của thế giới, những gợn sóng cảm xúc khẽ rung lên giữa khoảng cách ngàn năm ánh sáng.\n` +
      `2. Trang ${page}: Nhân vật chính đứng trước lựa chọn định mệnh — bước tiếp vào hư vô hay lưu giữ chút ký Ức đẹp đẽ cuối cùng.\n` +
      `3. Dưới ánh sáng diệu kỳ của những tinh cầu cổ đại, tri thức không chỉ nằm trong trí tuệ mà nằm trong sự thấu hiểu nồng nàn dành cho vạn vật.\n\n` +
      `"Mỗi trang sách mở ra là một hành trình thức tỉnh tâm trí, nơi trí tưởng tượng chắp cánh cho những ước mơ xa xôi nhất."`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-black border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl shadow-lg shadow-purple-500/20 text-white font-black">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-purple-300 uppercase">
                V-Books Fictional Library
              </h1>
              <span className="text-[10px] px-3 py-0.5 rounded-full bg-purple-600 text-white font-black uppercase tracking-wider">
                100 Tác Phẩm Viễn Tưởng Độc Quyền (100 - 500 Trang)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Thư viện 100 cuốn sách viễn tưởng & triệt học đong đầy cảm xúc do hệ thống sáng tác độc quyền. Đảm bảo bản quyền sáng tạo 100%.
            </p>
          </div>
        </div>

        {selectedBook && (
          <button
            onClick={() => setSelectedBook(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-2xl border border-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại thư viện
          </button>
        )}
      </div>

      {/* Mode 1: Detailed Reader Mode */}
      {selectedBook ? (
        <div
          className={`rounded-3xl p-6 shadow-2xl border transition-all ${
            readerTheme === "dark"
              ? "bg-[#121216] border-white/10 text-zinc-200"
              : readerTheme === "sepia"
              ? "bg-[#fbf0d9] border-amber-900/20 text-[#5f4b32]"
              : readerTheme === "emerald"
              ? "bg-[#06211a] border-emerald-500/30 text-emerald-100"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          {/* Reader Toolbar Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6 opacity-90 border-current/10">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">{selectedBook.title}</h2>
              <span className="text-xs opacity-70">Tác giả: {selectedBook.author} • Thể loại: {selectedBook.category} • Tổng: {selectedBook.totalPages} trang</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Font Controls */}
              <div className="flex items-center gap-1 p-1 bg-current/10 rounded-xl">
                <button
                  onClick={() => setFontSize((f) => Math.max(12, f - 2))}
                  className="px-2.5 py-1 text-xs font-bold rounded hover:bg-current/10 cursor-pointer"
                >
                  A-
                </button>
                <span className="text-xs font-mono px-1 font-bold">{fontSize}px</span>
                <button
                  onClick={() => setFontSize((f) => Math.min(32, f + 2))}
                  className="px-2.5 py-1 text-xs font-bold rounded hover:bg-current/10 cursor-pointer"
                >
                  A+
                </button>
              </div>

              {/* Reader Theme Switcher */}
              <div className="flex items-center gap-1 p-1 bg-current/10 rounded-xl">
                {(["dark", "sepia", "emerald", "light"] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => setReaderTheme(th)}
                    className={`px-2.5 py-1 text-xs font-bold rounded capitalize cursor-pointer ${
                      readerTheme === th ? "bg-purple-600 text-white shadow-sm" : ""
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(currentPage)}
                className={`p-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  bookmarks.includes(currentPage)
                    ? "bg-amber-500 text-black font-extrabold"
                    : "bg-current/10 hover:bg-current/20"
                }`}
                title="Đánh dấu trang"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {/* Audio TTS Simulator */}
              <button
                onClick={() => setIsTTSActive(!isTTSActive)}
                className={`p-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  isTTSActive ? "bg-purple-500 text-white animate-pulse" : "bg-current/10 hover:bg-current/20"
                }`}
                title="Đọc phát âm"
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">{isTTSActive ? "Đang đọc..." : "Đọc giọng nói"}</span>
              </button>
            </div>
          </div>

          {/* Chapters & TOC Quick Selector */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none opacity-80 text-xs">
            <span className="font-bold shrink-0">Mục lục:</span>
            {selectedBook.chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(ch.startPage)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  currentPage >= ch.startPage && (idx === selectedBook.chapters.length - 1 || currentPage < selectedBook.chapters[idx + 1].startPage)
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-current/10 hover:bg-current/20"
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>

          {/* Book Page Body */}
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="leading-relaxed whitespace-pre-line font-serif min-h-[400px] max-w-4xl mx-auto py-6 border-y border-current/10 my-4"
          >
            {generatePageText(selectedBook, currentPage)}
          </div>

          {/* Page Navigation & Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-current/10 hover:bg-current/20 disabled:opacity-30 rounded-2xl text-xs font-black transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Trang Trước
              </button>

              <div className="flex items-center gap-2 font-mono text-xs font-black">
                <span>Trang</span>
                <input
                  type="number"
                  min={1}
                  max={selectedBook.totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= selectedBook.totalPages) {
                      setCurrentPage(val);
                    }
                  }}
                  className="w-16 px-2 py-1 bg-current/10 rounded-lg text-center font-bold focus:outline-none"
                />
                <span>/ {selectedBook.totalPages}</span>
              </div>

              <button
                disabled={currentPage === selectedBook.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(selectedBook.totalPages, p + 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-current/10 hover:bg-current/20 disabled:opacity-30 rounded-2xl text-xs font-black transition-all cursor-pointer"
              >
                Trang Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Range Slider for fast jumping */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-60">Trang 1</span>
              <input
                type="range"
                min={1}
                max={selectedBook.totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                className="w-full h-2 bg-current/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-[10px] font-mono opacity-60">Trang {selectedBook.totalPages}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Bookshelf Catalog (100 Books) */
        <div className="space-y-6">
          {/* Search & Category Filtering */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#16151c] border border-white/10 rounded-3xl p-4 shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên sách, tác giả trong 100 tác phẩm viễn tưởng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Tất Cả ({ALL_BOOKS_100.length})
              </button>
              {BOOK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setCurrentPage(1);
                }}
                className="bg-[#18181c] border border-white/10 hover:border-purple-500/50 rounded-3xl p-4 flex flex-col justify-between shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden mb-3 relative bg-zinc-900">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-extrabold text-purple-300 border border-purple-500/40">
                    {book.category}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold">
                    {book.totalPages} Trang
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">{book.author}</p>

                  <button className="w-full py-2.5 bg-purple-600/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-purple-500/30 flex items-center justify-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> ĐỌC SÁCH ({book.totalPages} TRANG)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
