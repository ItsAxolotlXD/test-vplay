import { HeroSlide } from '../types';

export interface VShopProduct {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  priceOrbs: number; // 10.000 VND = 10 ORBS => Math.round(price / 1000)
  image: string;
  category: 'Thực phẩm' | 'Đồ công nghệ - Điện tử' | 'Đồ gia dụng';
  badge?: string;
  description: string;
}

export const SHOP_CATEGORIES = [
  'Thực phẩm',
  'Đồ công nghệ - Điện tử',
  'Đồ gia dụng'
] as const;

export type ShopCategory = typeof SHOP_CATEGORIES[number];

// Thẻ banner trượt ở tab Shop (3 banner theo yêu cầu)
export const SHOP_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'shop-banner-0',
    title: 'Vplay Shop - Ưu Đãi Mua Sắm',
    description: '',
    category: 'V-SHOPPING',
    quality: 'HD',
    badge: 'HOT DEAL',
    channelId: '',
    backgroundImage: '/banners/shop/banner_shop_0.webp',
    ctaText: 'Mua ngay',
    themeColor: '#EC4899', // Hot deal vibrant pink glow
    isAd: false
  },
  {
    id: 'shop-banner-1',
    title: 'Siêu Sale Đồ Công Nghệ & Tiện Ích',
    description: '',
    category: 'CÔNG NGHỆ',
    quality: 'HD',
    badge: 'SIÊU SALE',
    channelId: '',
    backgroundImage: '/banners/shop/banner_shop_1.webp',
    ctaText: 'Khám phá',
    themeColor: '#3B82F6', // Tech neon blue glow
    isAd: false
  },
  {
    id: 'shop-banner-2',
    title: 'Gia Dụng Hiện Đại & Thực Phẩm Tươi',
    description: '',
    category: 'GIA DỤNG',
    quality: 'HD',
    badge: 'GIẢM GIÁ',
    channelId: '',
    backgroundImage: '/banners/shop/banner_shop_2.webp',
    ctaText: 'Xem thêm',
    themeColor: '#10B981', // Fresh green / emerald glow
    isAd: false
  }
];

export const V_SHOP_PRODUCTS: VShopProduct[] = [
  // 1. Thực phẩm
  {
    id: 'lava-cake',
    name: 'Bánh Trung Thu LAVA Tan Chảy',
    price: 119000,
    priceFormatted: '119.000 VND',
    priceOrbs: 119,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPBvzdQqBcnrnpTrsVbItitLEKH6s39Dy68u3xChe0Kq97b90vyyISjWdyJ_njhKrf8pPV4Z5ep3A1R4Va7BiwRf0QFOfZlU0Qky-nAMWKBAuP2bgJC9dy6w',
    category: 'Thực phẩm',
    badge: 'HOT DEAL',
    description: 'Bánh trung thu nhân trứng muối lava tan chảy béo ngậy, vỏ bánh nướng vàng óng thơm ngon.'
  },
  {
    id: 'dua-tuoi-datafa',
    name: 'Nước Dừa Tươi Datafa',
    price: 28000,
    priceFormatted: '28.000 VND',
    priceOrbs: 28,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQoln4U7Xt5wo9rm1H2XrXjrGCBqKl_6_r8f94w9vnFTuKJ3HEqgTk9bV5Ivv6nHoPHDjlGJ9mk0GXdvGM16Zn4MXKcVXyK',
    category: 'Thực phẩm',
    badge: 'TƯƠI MÁT',
    description: 'Nước dừa tươi nguyên chất Datafa thanh mát tự nhiên, giải nhiệt sảng khoái bổ sung khoáng chất.'
  },
  {
    id: 'tra-sua-latte-kirin',
    name: 'Trà sữa Latte KIRIN',
    price: 15000,
    priceFormatted: '15.000 VND',
    priceOrbs: 15,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSUCJKbvLZPhzYkjHsZVvSy4UWCXK9LmD0Ju2pajdie1yZK7MHONhrR8329P-8fT9N69UbsvJtRGk91inD86S-O5po0cvS2ko2ExNYNNGSunPlXa-heXq0U',
    category: 'Thực phẩm',
    badge: 'BESTSELLER',
    description: 'Trà sữa Latte Kirin công nghệ Nhật Bản, hương vị trà hòa quyện sữa tươi thơm ngon.'
  },
  {
    id: 'vinamilk-super-nut',
    name: 'Vinamilk Super Nut - Siêu hạt 4 lốc',
    price: 36000,
    priceFormatted: '36.000 VND',
    priceOrbs: 36,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTOz5FpuspFgq8RVtTfaveq2Wa0I6xn67b3vF2qCLBE9NvmyrLNf8Jdq6vyAXeW2AG-NjkmEQpOk8rRaNUEG1t0Qvcg6L2HEk7Lt6ER_0YPHSBcjpBxKFm6-w',
    category: 'Thực phẩm',
    badge: 'DINH DƯỠNG',
    description: 'Sữa 9 loại hạt Vinamilk Super Nut thơm béo, bổ sung năng lượng và dưỡng chất.'
  },
  {
    id: 'snack-lays-wavy-texas',
    name: 'Snack Khoai Tây: Lays Wavy (vị Than Bò Nướng Texas)',
    price: 41000,
    priceFormatted: '41.000 VND',
    priceOrbs: 41,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQELX1B_EsWnbjs6_Idu6Vaf1q1yZE4K3LMmkHYWMrCKyHcffaCENXcQ7K79cRC7SK_s0KVkb_oHAO_fH0JMx3HUMb3Q6pqCHZ1QUFWvkCMUsfTjzVEcLBt',
    category: 'Thực phẩm',
    badge: 'GIÒN RỤM',
    description: 'Khoai tây lát lượn sóng Lay\'s Wavy vị than bò nướng Texas đậm đà, thơm lừng giòn tan.'
  },

  // 2. Đồ công nghệ - Điện tử
  {
    id: 'airpods-pro-2',
    name: 'Tai nghe Apple AirPods Pro 2 (USB-C)',
    price: 5490000,
    priceFormatted: '5.490.000 VND',
    priceOrbs: 5490,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'CHÍNH HÃNG',
    description: 'Tai nghe chống ồn chủ động đỉnh cao Active Noise Cancellation, chip H2, âm thanh không gian Spatial Audio.'
  },
  {
    id: 'jbl-charge-5',
    name: 'Loa Bluetooth JBL Charge 5 (IP67)',
    price: 3290000,
    priceFormatted: '3.290.000 VND',
    priceOrbs: 3290,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'ÂM THANH BASS',
    description: 'Loa di động âm thanh Original Pro Sound uy lực, chống bụi chống nước IP67, pin bền bỉ tới 20 giờ.'
  },
  {
    id: 'logitech-mx-master-3s',
    name: 'Chuột không dây Logitech MX Master 3S',
    price: 2190000,
    priceFormatted: '2.190.000 VND',
    priceOrbs: 2190,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'CÔNG THÁI HỌC',
    description: 'Chuột công thái học cao cấp cho dân đồ họa & văn phòng, bánh lăn MagSpeed siêu nhanh, cú click êm ái.'
  },
  {
    id: 'keychron-k2-pro',
    name: 'Bàn phím cơ không dây Keychron K2 Pro',
    price: 2450000,
    priceFormatted: '2.450.000 VND',
    priceOrbs: 2450,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'BÀN PHÍM CƠ',
    description: 'Bàn phím cơ layout 75% gọn gàng, tùy biến QMK/VIA mượt mà, hỗ trợ kết nối 3 thiết bị cùng lúc.'
  },
  {
    id: 'anker-gan-65w',
    name: 'Củ sạc nhanh Anker GaNPrime 65W 3 Cổng',
    price: 890000,
    priceFormatted: '890.000 VND',
    priceOrbs: 890,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'SẠC NHANH',
    description: 'Công nghệ GaNPrime tối ưu nhiệt lượng, sạc siêu tốc cho laptop, máy tính bảng và điện thoại.'
  },
  {
    id: 'apple-watch-s9',
    name: 'Đồng hồ thông minh Apple Watch Series 9 GPS',
    price: 8990000,
    priceFormatted: '8.990.000 VND',
    priceOrbs: 8990,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ công nghệ - Điện tử',
    badge: 'CAO CẤP',
    description: 'Chip S9 SiP mạnh mẽ, thao tác chạm hai lần Double Tap kỳ diệu, theo dõi sức khỏe và giấc ngủ chuẩn xác.'
  },

  // 3. Đồ gia dụng
  {
    id: 'philips-airfryer-xl',
    name: 'Nồi chiên không dầu Philips XL 6.2L Rapid Air',
    price: 2490000,
    priceFormatted: '2.490.000 VND',
    priceOrbs: 2490,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'BÁN CHẠY',
    description: 'Dung tích 6.2 lít cho cả gia đình, công nghệ Rapid Air giảm đến 90% lượng dầu mỡ, món ăn giòn ngon đậm vị.'
  },
  {
    id: 'xiaomi-air-purifier',
    name: 'Máy lọc không khí Xiaomi Smart Air Purifier 4 Pro',
    price: 3890000,
    priceFormatted: '3.890.000 VND',
    priceOrbs: 3890,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'KHÔNG KHÍ SẠCH',
    description: 'Bộ lọc HEPA 3 trong 1 khử mùi và phấn hoa, lọc sạch phòng 60m² chỉ trong 15 phút, kết nối thông minh qua App.'
  },
  {
    id: 'dyson-v12-slim',
    name: 'Máy hút bụi không dây Dyson V12 Detect Slim Fluffy',
    price: 14990000,
    priceFormatted: '14.990.000 VND',
    priceOrbs: 14990,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'THÔNG MINH',
    description: 'Tia laser phát hiện hạt bụi siêu mịn vô hình trên sàn nhà, lực hút mạnh mẽ, thiết kế công thái học nhẹ tênh.'
  },
  {
    id: 'tefal-rice-cooker',
    name: 'Nồi cơm điện tử cao tần Tefal Delirice Pro 1.8L',
    price: 1890000,
    priceFormatted: '1.890.000 VND',
    priceOrbs: 1890,
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'TIỆN ÍCH',
    description: 'Lòng nồi niêu chống dính 6 lớp giữ nhiệt lâu, công nghệ gia nhiệt cảm ứng IH giúp hạt cơm chín đều thơm ngọt.'
  },
  {
    id: 'lock-lock-kettle',
    name: 'Ấm đun siêu tốc thủy tinh Lock&Lock 1.8L',
    price: 450000,
    priceFormatted: '450.000 VND',
    priceOrbs: 450,
    image: 'https://images.unsplash.com/photo-1594213114663-ddf4f240f124?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'TIẾT KIỆM',
    description: 'Thân bình thủy tinh chịu nhiệt cao cấp sang trọng, đèn LED xanh dương bắt mắt khi đun, tự động ngắt an toàn.'
  },
  {
    id: 'steam-iron-philips',
    name: 'Bàn ủi hơi nước cầm tay Philips Series 3000',
    price: 890000,
    priceFormatted: '890.000 VND',
    priceOrbs: 890,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    category: 'Đồ gia dụng',
    badge: 'GỌN NHẸ',
    description: 'Thiết kế gấp gọn tiện lợi mang đi du lịch hay công tác, ủi phẳng nếp nhăn nhanh chóng không cần bàn ủi.'
  }
];
