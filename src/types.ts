export type ComponentState = 'normal' | 'hovered' | 'pressed' | 'disabled';

export interface TvChannel {
  id: string;
  name: string;
  groupTitle: string; // 'Kênh VTV' | 'Kênh VTVcab' | 'Kênh HTV' | 'Kênh SCTV' | 'Kênh thiết yếu' | 'Kênh địa phương' | 'Kênh quốc tế' | 'Kênh phát thanh'
  logo: string;
  streamUrl?: string;
  badge?: string;
  currentProgram: string;
  nextProgram: string;
  viewers: string;
  rating: string;
  videoBg: string;
  isLive: boolean;
  resolution: string;
  language: string;
  summary: string;
}

export interface ProgramSchedule {
  id: string;
  time: string;
  title: string;
  channelId: string;
  isCurrent: boolean;
  category: string;
  duration: string;
}

export interface UserSettings {
  autoPlay: boolean;
  subtitles: boolean;
  hdQuality: boolean;
  soundVolume: number;
  qualityOption: string;
  preferredCategory: string;
  themeMode: 'dark' | 'retro';
  notifications: boolean;
  searchQuery: string;
  disablePanorama?: boolean;
  lockPanoramaScroll?: boolean;
  panoramaScrollSpeed?: number;
}
