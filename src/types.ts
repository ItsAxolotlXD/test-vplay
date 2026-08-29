export type ComponentState = 'default' | 'normal' | 'hover' | 'hovered' | 'active' | 'pressed' | 'focus' | 'disabled';

export interface Category {
  id: string;
  name: string;
  count?: number;
}

export type QualityType = '4K' | 'HD' | 'SD';

export type ChannelCategory = 
  | 'Kênh VTV'
  | 'Kênh VTVcab'
  | 'Kênh HTV'
  | 'Kênh SCTV'
  | 'Kênh thiết yếu'
  | 'Kênh địa phương'
  | 'Kênh quốc tế'
  | 'Kênh phát thanh'
  | string;

export interface Channel {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  logo: string;
  category: ChannelCategory;
  quality: QualityType;
  streamUrl: string;
  url?: string;
  group?: string;
  logoText?: string;
  logoBg?: string;
  logoImg?: string;
  backupStreamUrl?: string;
  isLive: boolean;
  isRadio?: boolean;
  viewers?: number;
  currentProgram: {
    title: string;
    startTime: string;
    endTime: string;
    progress: number; // 0 - 100
    description: string;
  };
  nextProgram?: {
    title: string;
    startTime: string;
  };
  description: string;
  resolution?: string;
  bitrate?: string;
  satelliteFrequency?: string;
  dvbT2Channel?: string;
  officialWebsite?: string;
  tags?: string[];
  bannerImage?: string;
}

export type TvChannel = any;
export type ProgramSchedule = any;

export interface ProgramScheduleItem {
  id: string;
  channelId: string;
  title: string;
  startTime: string;
  endTime: string;
  time?: string;
  category: string;
  description: string;
  isLive?: boolean;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  category: 'Thời sự truyền hình' | 'Công nghệ phát sóng' | 'Hậu trường & Kỹ thuật' | 'Đồ hoạ & Nhận diện' | 'Tư liệu & Lịch sử';
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  content: string[];
  tags: string[];
  relatedChannelId?: string;
  featured?: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  quality: string;
  badge: string;
  channelId: string;
  channelLogo?: string;
  channelName?: string;
  backgroundImage: string;
  ctaText: string;
  director?: string;
}

export interface UserSettings {
  autoPlay: boolean;
  defaultQuality: 'auto' | '1080p' | '720p' | '480p';
  volume: number;
  muted: boolean;
  lowLatency: boolean;
  hardwareAcceleration: boolean;
  showEpgOverlay: boolean;
  enableNoiseFilter: boolean;
  theme: 'dark' | 'oled';
}
