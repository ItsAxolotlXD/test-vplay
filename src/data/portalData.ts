export interface PortalCategory {
  id: 'tin-tuc' | 'the-thao' | 'am-thuc' | 'chinh-tri' | 'van-hoa' | 'giai-tri';
  title: string;
  badge: string;
  image: string;
  accentGradient: string;
  themeColor: string;
  channelKeywords: string[];
}

export type { PortalArticle } from './portalArticlesData';
import { ALL_PORTAL_ARTICLES } from './portalArticlesData';
export const PORTAL_ARTICLES = ALL_PORTAL_ARTICLES;

export const PORTAL_CATEGORIES: PortalCategory[] = [
  // --- DÒNG 1: Tin tức, Thể thao, Ẩm thực ---
  {
    id: 'tin-tuc',
    title: 'Tin tức',
    badge: 'Tin nóng',
    image: 'https://static.wikia.nocookie.net/ep-deo/images/6/67/Vtv_news.png/revision/latest?cb=20260909114003',
    accentGradient: 'from-rose-600 via-red-600 to-amber-500',
    themeColor: '#E6005A',
    channelKeywords: ['vtv1', 'vtv4', 'vnews', 'thoi-su', 'truyen-hinh']
  },
  {
    id: 'the-thao',
    title: 'Thể thao',
    badge: 'Trực tiếp',
    image: 'https://static.wikia.nocookie.net/ep-deo/images/2/25/Vtv_sports.png/revision/latest?cb=20260909113940',
    accentGradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    themeColor: '#10B981',
    channelKeywords: ['vtv5', 'vtv6', 'on-sports', 'the-thao', 'k-plus']
  },
  {
    id: 'am-thuc',
    title: 'Ẩm thực',
    badge: 'Mỹ vị',
    image: 'https://static.wikia.nocookie.net/ep-deo/images/f/f3/Vtv_cuisine.png/revision/latest?cb=20260909114043',
    accentGradient: 'from-amber-500 via-orange-600 to-red-500',
    themeColor: '#F97316',
    channelKeywords: ['vtv3', 'vtv-can-tho', 'am-thuc', 'mon-ngon']
  },

  // --- DÒNG 2: Chính trị, Văn hóa, Giải trí ---
  {
    id: 'chinh-tri',
    title: 'Chính trị',
    badge: 'Chính luận',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&auto=format&fit=crop&q=80',
    accentGradient: 'from-blue-700 via-indigo-600 to-sky-500',
    themeColor: '#3B82F6',
    channelKeywords: ['vtv1', 'quoc-hoi', 'vnews', 'nhan-dan']
  },
  {
    id: 'van-hoa',
    title: 'Văn hóa',
    badge: 'Bản sắc',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&auto=format&fit=crop&q=80',
    accentGradient: 'from-amber-600 via-orange-500 to-rose-500',
    themeColor: '#F59E0B',
    channelKeywords: ['vtv2', 'vtc10', 'van-hoa', 'du-lich']
  },
  {
    id: 'giai-tri',
    title: 'Giải trí',
    badge: 'Xu hướng',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    accentGradient: 'from-fuchsia-600 via-pink-600 to-purple-600',
    themeColor: '#EC4899',
    channelKeywords: ['vtv3', 'htv7', 'today-tv', 'giai-tri']
  }
];
