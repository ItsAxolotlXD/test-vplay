export interface AdVideoItem {
  id: string;
  name: string;
  tag: string;
  localUrl: string;
  remoteUrl: string;
}

export const ADS_VIDEOS: AdVideoItem[] = [
  {
    id: 'vtv1-ident-2026-main',
    name: 'VTV1 Ident 2026 (1) - Hình hiệu chính',
    tag: 'VNRT Ads',
    localUrl: '/ads/ad1.mp4',
    remoteUrl: 'https://static.wikia.nocookie.net/ep-deo/images/2/24/VTV1_ident_2026_%281%29_%28h%C3%ACnh_hi%E1%BB%87u_ch%C3%ADnh_-_main_ident%29.mp4/revision/latest?cb=20260924072211',
  },
  {
    id: 'vtv6-idents-2026',
    name: 'VTV6 Idents 07-09-2026 (No logo)',
    tag: 'VNRT Ads',
    localUrl: '/ads/ad2.mp4',
    remoteUrl: 'https://static.wikia.nocookie.net/ep-deo/images/9/9a/VTV6_idents_07-09-2026_%28No_logo%29.mp4/revision/latest?cb=20260924072324',
  },
  {
    id: 'vtv10-ident-2026',
    name: 'VTV10 Ident 2026 (30.03.2026)',
    tag: 'VNRT Ads',
    localUrl: '/ads/ad3.mp4',
    remoteUrl: 'https://static.wikia.nocookie.net/ep-deo/images/4/4b/VTV10_Ident_2026_%2830.03.2026%29.mp4/revision/latest?cb=20260924072210',
  },
];

/**
 * Returns a randomly picked ad video item from the ads playlist
 */
export function getRandomAdVideo(): AdVideoItem {
  const index = Math.floor(Math.random() * ADS_VIDEOS.length);
  return ADS_VIDEOS[index];
}
