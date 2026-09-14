export interface TvMusicTrack {
  id: string;
  title: string;
  channel: string;
  category: 'ident' | 'schedule' | 'theme';
  categoryLabel: string;
  era: string;
  audioUrl: string;
  channelLogo?: string;
  badge?: string;
  description: string;
}

export const TV_MUSIC_TRACKS: TvMusicTrack[] = [
  {
    id: 'vtv1-schedule-2026',
    title: 'VTV1: Giới thiệu chương trình (07/09/2026 - nay)',
    channel: 'VTV1',
    category: 'schedule',
    categoryLabel: 'Giới thiệu chương trình',
    era: '07/09/2026 - nay',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/1/1a/VTV1_program_schedule_theme_2026.mp3/revision/latest?cb=20260907001939&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'MỚI NHẤT',
    description: 'Nhạc nền bảng giới thiệu chương trình phát sóng chính thức của kênh VTV1 từ ngày 07/09/2026 (dịp kỷ niệm 56 năm VTV).'
  },
  {
    id: 'vtv1-ident-2026-main',
    title: 'VTV1 ident 07/09/2026 - nay (main)',
    channel: 'VTV1',
    category: 'ident',
    categoryLabel: 'Nhận diện kênh (Main Ident)',
    era: '07/09/2026 - nay',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/c/ca/VTV1_main_ident_theme_2026.mp3/revision/latest?cb=20260907001933&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'MAIN IDENT',
    description: 'Âm thanh nhận diện kênh chính (Main Station ID) VTV1 áp dụng từ ngày 07/09/2026.'
  },
  {
    id: 'vtv1-ident-2026-1',
    title: 'VTV1 ident 07/09/2026 - nay (1)',
    channel: 'VTV1',
    category: 'ident',
    categoryLabel: 'Nhận diện kênh (Bản 1)',
    era: '07/09/2026 - nay',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/a/a2/VTV1_ident_theme_2026_1.mp3/revision/latest?cb=20260907001925&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'IDENT 1',
    description: 'Âm thanh nhận diện kênh VTV1 biến thể 1 áp dụng từ ngày 07/09/2026.'
  },
  {
    id: 'vtv1-ident-2026-2',
    title: 'VTV1 ident 07/09/2026 - nay (2)',
    channel: 'VTV1',
    category: 'ident',
    categoryLabel: 'Nhận diện kênh (Bản 2)',
    era: '07/09/2026 - nay',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/c/cf/VTV1_ident_theme_2026_2.mp3/revision/latest?cb=20260907001927&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'IDENT 2',
    description: 'Âm thanh nhận diện kênh VTV1 biến thể 2 áp dụng từ ngày 07/09/2026.'
  },
  {
    id: 'vtv1-schedule-today-2023-2026',
    title: 'VTV1: Giới thiệu chương trình Hôm nay (31/12/2022 - 06/09/2026)',
    channel: 'VTV1',
    category: 'schedule',
    categoryLabel: 'Chương trình Hôm nay',
    era: '31/12/2022 - 06/09/2026',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/3/3f/Today_on_VTV1_theme_2023.mp3/revision/latest?cb=20230113032852&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'GIAI ĐOẠN TRƯỚC',
    description: 'Nhạc nền giới thiệu chương trình hôm nay trên kênh VTV1 phát sóng trong giai đoạn 31/12/2022 đến 06/09/2026.'
  },
  {
    id: 'vtv1-schedule-tomorrow-2023-2026',
    title: 'VTV1: Giới thiệu chương trình Ngày mai (31/12/2022 - 06/09/2026)',
    channel: 'VTV1',
    category: 'schedule',
    categoryLabel: 'Chương trình Ngày mai',
    era: '31/12/2022 - 06/09/2026',
    audioUrl: 'https://static.wikia.nocookie.net/logos/images/4/45/Tomorrow_on_VTV1_theme_2023.mp3/revision/latest?cb=20230113032932&path-prefix=vi',
    channelLogo: 'https://static.wikia.nocookie.net/logos/images/e/e4/VTV1_logo_2013.png',
    badge: 'GIAI ĐOẠN TRƯỚC',
    description: 'Nhạc nền giới thiệu chương trình ngày mai trên kênh VTV1 phát sóng trong giai đoạn 31/12/2022 đến 06/09/2026.'
  }
];

export function getAudioProxyUrl(url: string): string {
  if (!url) return '';
  return `/api/audio-proxy?url=${encodeURIComponent(url)}`;
}
