import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Play, Pause, Volume2, VolumeX, Maximize2, Tv, Plus, CalendarDays } from 'lucide-react';
import { Channel } from '../types';
import { ChannelSchedule } from '../components/ChannelSchedule';
import { useTabSearch } from '../context/TabSearchContext';
import Hls from 'hls.js';

interface LiveTVProps {
  currentChannel?: Channel;
  onSelectChannel?: (channel: Channel) => void;
  channels?: Channel[];
  onOpenCustomStreamModal?: () => void;
}

interface VtvChannelItem {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category?: string;
  isVtv2?: boolean;
}

// Danh sách các kênh VTV và luồng thử nghiệm/front
const VTV_CHANNELS: VtvChannelItem[] = [
  {
    id: 'vtv1',
    name: 'VTV1',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/f/f9/Image_%2812%29.png/revision/latest?cb=20260914074936',
    streamUrl: 'https://live.fptplay53.net/live/media/vtv1/live247-hls-avc/vtv1-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv2',
    name: 'VTV2',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/4/45/Vtv2_front.png/revision/latest/scale-to-width-down/1000?cb=20260913100152',
    streamUrl: 'https://live.fptplay53.net/live/media/v2abr/live247-hls-avc/v2abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
    isVtv2: true,
  },
  {
    id: 'vtv3',
    name: 'VTV3',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/5/53/Image_%2814%29.png/revision/latest?cb=20260914083805',
    streamUrl: 'https://live.fptplay53.net/live/media/v3abr/live247-hls-avc/v3abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv4',
    name: 'VTV4',
    logo: 'https://static.wikia.nocookie.net/logos/images/2/2c/VTV4_logo_%282026-nay%29.png/revision/latest?cb=20260907125330&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/live/media/vtv4/live247-hls-avc/vtv4-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv5',
    name: 'VTV5',
    logo: 'https://static.wikia.nocookie.net/logos/images/9/9b/VTV5_logo_%282026-nay%29.png/revision/latest?cb=20260907125407&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/live/media/vtv5/live247-hls-avc/vtv5-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv6',
    name: 'VTV6',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/3/31/Vtv6_front.png/revision/latest?cb=20260913100008',
    streamUrl: 'https://live.fptplay53.net/live/media/v6abr/live247-hls-avc/v6abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv7',
    name: 'VTV7',
    logo: 'https://static.wikia.nocookie.net/logos/images/1/14/VTV7_logo_%282016-nay%29_%283%29.png/revision/latest/scale-to-width-down/1000?cb=20260420032353&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/live/media/v7abr/live247-hls-avc/v7abr-avc1_5600000=10000-mp4a_140800_vie=20000.m3u8',
  },
  {
    id: 'vtv8',
    name: 'VTV8',
    logo: 'https://static.wikia.nocookie.net/logos/images/7/73/Logo_VTV8_01.02.2016.png/revision/latest?cb=20260228014157&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/vtv8hd_vhls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'vtv9',
    name: 'VTV9',
    logo: 'https://static.wikia.nocookie.net/logos/images/7/7b/Logo_VTV9_20.12.2012.png/revision/latest?cb=20260301015846&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/live/media/v9abr/live247-hls-avc/v9abr-avc1_5600000=10000-mp4a_140800_vie=20000.m3u8',
  },
  {
    id: 'vtv10',
    name: 'VTV10',
    logo: 'https://static.wikia.nocookie.net/ftv/images/a/a0/I10.png/revision/latest/scale-to-width-down/1000?cb=20260601094723&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/live/media/v10abr/live247-hls-avc/v10abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vn_today',
    name: 'Vietnam Today',
    logo: 'https://static.wikia.nocookie.net/logos/images/f/f2/Logo_Vietnam_Today_07-2025_v2.png/revision/latest?cb=20260228060318&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/fnxhd1/vntoday_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'vtv_can_tho',
    name: 'VTV Cần Thơ',
    logo: 'https://static.wikia.nocookie.net/logos/images/7/79/VTV_C%E1%BA%A7n_Th%C6%A1_logo_%282022-nay%29.png/revision/latest?cb=20221009182058&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzsd1/cantho_hls.smil/chunklist_b2500000.m3u8',
  },
  // Kênh duplicate giữ lại theo yêu cầu: VTV6, VTV8 (duplicate), VTV10 (duplicate)
  {
    id: 'vtv6_front',
    name: 'VTV6 Front',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/3/31/Vtv6_front.png/revision/latest?cb=20260913100008',
    streamUrl: 'https://live.fptplay53.net/live/media/v6abr/live247-hls-avc/v6abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv6_thu_nghiem',
    name: 'VTV6 thử nghiệm',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/62/6_th%E1%BB%AD_nghi%E1%BB%87m.png/revision/latest/scale-to-width-down/1000?cb=20260625124449',
    streamUrl: 'https://live.fptplay53.net/live/media/v6abr/live247-hls-avc/v6abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv6_low_latency',
    name: 'VTV6 Low Latency',
    logo: 'https://static.wikia.nocookie.net/ftv/images/1/19/6n.png/revision/latest/scale-to-width-down/1000?cb=20260603024041&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/live/media/v6abr/live247-hls-avc/v6abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv8_duplicate',
    name: 'VTV8 (duplicate)',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/e/e3/Image_%2816%29.png/revision/latest?cb=20260914083804',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/vtv8hd_vhls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'vtv10_test',
    name: 'VTV10 (duplicate)',
    logo: 'https://static.wikia.nocookie.net/logos/images/4/4c/VTV10_30.03.2026-nay.png/revision/latest?cb=20260330072914&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/live/media/v10abr/live247-hls-avc/v10abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  {
    id: 'vtv_test_hevc1',
    name: 'VTV test HEVC-1',
    logo: 'https://static.wikia.nocookie.net/logos/images/b/b5/VTV_go_logo_2015.png/revision/latest?cb=20260317072846&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/live/media/v1abr/live247-hls-avc/v1abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
];

// Danh sách các kênh HTV
const HTV_CHANNELS: VtvChannelItem[] = [
  {
    id: 'htv1',
    name: 'HTV1',
    logo: 'https://static.wikia.nocookie.net/ftv/images/0/04/HTV1.png/revision/latest/scale-to-width-down/1000?cb=20260601104705&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv1_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'htv2',
    name: 'HTV2',
    logo: 'https://static.wikia.nocookie.net/ftv/images/9/99/HTV2.png/revision/latest/scale-to-width-down/1000?cb=20260601105845&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv2hd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htv3',
    name: 'HTV3',
    logo: 'https://static.wikia.nocookie.net/ftv/images/2/26/H3.png/revision/latest/scale-to-width-down/1000?cb=20260601110041&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv3_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'htv4',
    name: 'HTV4',
    logo: 'https://static.wikia.nocookie.net/ftv/images/d/d4/H4.png/revision/latest/scale-to-width-down/1000?cb=20260601110245&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv4_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'htv7',
    name: 'HTV7',
    logo: 'https://static.wikia.nocookie.net/ftv/images/6/60/H7.png/revision/latest/scale-to-width-down/1000?cb=20260601112033&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv7hd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htv9',
    name: 'HTV9',
    logo: 'https://static.wikia.nocookie.net/ftv/images/e/e4/H9.png/revision/latest/scale-to-width-down/1000?cb=20260601111956&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htv9hd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htv_thethao',
    name: 'HTV Thể Thao',
    logo: 'https://static.wikia.nocookie.net/ftv/images/5/5c/H6.png/revision/latest/scale-to-width-down/1000?cb=20260601112653&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_canhac',
    name: 'HTVC Ca Nhạc',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/a/ad/HTVC_Ca_nh%E1%BA%A1c.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcmusic_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_phimhd',
    name: 'HTVC Phim HD',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/3/36/HTVC_Phim.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcmovieshd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_thuanviet',
    name: 'HTVC Thuần Việt',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/3/3a/Thu%E1%BA%A7n_Vi%E1%BB%87t.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcthuanviethd_vhls.smil/chunklist_b5000000.m3u8',
  },
];

// Danh sách các kênh địa phương
const LOCAL_CHANNELS: VtvChannelItem[] = [
  {
    id: 'ha_noi_1',
    name: 'Hà Nội 1',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/4/4e/H1.png/revision/latest/scale-to-width-down/1000?cb=20260702004820',
    streamUrl: 'https://live.fptplay53.net/fnxhd2/hanoitv1_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'ha_noi_2',
    name: 'Hà Nội 2',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/7/78/H2.png/revision/latest/scale-to-width-down/1000?cb=20260702004903',
    streamUrl: 'https://live.fptplay53.net/fnxhd1/hntv2_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'vinh_long_1',
    name: 'THVL1',
    logo: 'https://static.wikia.nocookie.net/logos/images/3/32/THVL1_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083051&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd2/vinhlong1_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'vinh_long_2',
    name: 'THVL2',
    logo: 'https://static.wikia.nocookie.net/logos/images/9/98/THVL2_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083053&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzhd2/vinhlong2_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'dong_nai_1',
    name: 'Đồng Nai 1',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/9/95/Dong1.png/revision/latest/scale-to-width-down/1000?cb=20260702004514',
    streamUrl: 'https://live.fptplay53.net/epzsd1/dongnai1_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'da_nang_1',
    name: 'Đà Nẵng 1',
    logo: 'https://static.wikia.nocookie.net/ftv/images/c/c6/D1.png/revision/latest/scale-to-width-down/1000?cb=20260601122210&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzsd1/danang1_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'hai_phong',
    name: 'Hải Phòng',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/c/c8/Tho1.png/revision/latest/scale-to-width-down/1000?cb=20260706064226',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/haiphong_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'can_tho_1',
    name: 'Cần Thơ 1',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/a/a9/Cansa.png/revision/latest/scale-to-width-down/1000?cb=20260701135206',
    streamUrl: 'https://live.fptplay53.net/epzsd1/cantho_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'dong_thap_1',
    name: 'Đồng Tháp 1',
    logo: 'https://static.wikia.nocookie.net/ftv/images/4/44/D8.png/revision/latest/scale-to-width-down/1000?cb=20260601123433&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzsd1/dongthap_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'khanh_hoa',
    name: 'Khánh Hòa',
    logo: 'https://static.wikia.nocookie.net/ftv/images/0/03/K0.png/revision/latest/scale-to-width-down/1000?cb=20260602021528&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/epzsd1/khanhhoa_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'nghe_an',
    name: 'Nghệ An',
    logo: 'https://img-zlr1.tv360.vn/image1/2020_09_23/1600821989411/75bfb004e210_640_360.png',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/nghean_hls.smil/chunklist_b2500000.m3u8',
  },
  {
    id: 'thanh_hoa',
    name: 'Thanh Hóa',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/9/99/Thanhhoe.png/revision/latest/scale-to-width-down/1000?cb=20260706060048',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/thanhhoa_hls.smil/chunklist_b2500000.m3u8',
  },
];

export const LiveTV: React.FC<LiveTVProps> = ({ currentChannel, onSelectChannel, onOpenCustomStreamModal }) => {
  const { searchQuery } = useTabSearch();
  const [selectedChannel, setSelectedChannel] = useState<VtvChannelItem>(() => {
    if (currentChannel?.id) {
      const all = [...VTV_CHANNELS, ...HTV_CHANNELS, ...LOCAL_CHANNELS];
      const match = all.find((c) => c.id === currentChannel.id || c.name.toLowerCase() === currentChannel.name.toLowerCase());
      if (match) return match;
    }
    return VTV_CHANNELS[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileScheduleOpen, setIsMobileScheduleOpen] = useState<boolean>(false);
  const [playerHeight, setPlayerHeight] = useState<number | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Measure and synchronize video player exact pixel height to desktop schedule sidebar
  useEffect(() => {
    const el = playerContainerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.clientHeight > 0) {
        setPlayerHeight(el.clientHeight);
      }
    };

    updateHeight();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setPlayerHeight(Math.round(entry.contentRect.height));
        }
      }
    });
    ro.observe(el);

    window.addEventListener('resize', updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Initialize and load video stream when selectedChannel changes
  useEffect(() => {
    setHasPlaybackError(false);
    setIsLoading(true);

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = selectedChannel.streamUrl;

    if (!streamUrl) {
      setHasPlaybackError(true);
      setIsLoading(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 8000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 8000,
        fragLoadingTimeOut: 12000,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {
            // Browser autoplay restrictions
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setHasPlaybackError(true);
              setIsLoading(false);
              hls.destroy();
              hlsRef.current = null;
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {});
        }
      });
      video.addEventListener('error', () => {
        setHasPlaybackError(true);
        setIsLoading(false);
      });
    } else {
      setHasPlaybackError(true);
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedChannel.id, selectedChannel.streamUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  const handleSelectChannel = (channel: VtvChannelItem) => {
    setSelectedChannel(channel);
    onSelectChannel?.(channel as any);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-start px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Video Player & Schedule Section (Side-by-side on desktop, calendar icon on mobile) */}
        <div className="w-full space-y-3">
          {/* Channel Info Bar & Mobile Schedule Button */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#353535] border border-white/10 flex items-center justify-center p-1 shrink-0">
                <img
                  src={selectedChannel.logo}
                  alt={selectedChannel.name}
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <h1 className="text-lg sm:text-xl font-black text-white tracking-wide truncate">
                  {selectedChannel.name}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-[#A1A1AA] shrink-0">
                  Live Feed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8E8B99]">
                <Tv className="w-3.5 h-3.5" />
                <span>Đang phát trực tiếp</span>
              </div>

              {/* Mobile Calendar Icon Button ("icon hình quyển lịch") */}
              <button
                type="button"
                onClick={() => setIsMobileScheduleOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/25 to-[#C83DFF]/25 hover:from-red-600/35 hover:to-[#C83DFF]/35 border border-red-500/40 text-red-200 text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                title="Xem lịch phát sóng 24h"
              >
                <CalendarDays className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium">Lịch phát sóng</span>
              </button>
            </div>
          </div>

          {/* Desktop: Side-by-side grid with height strictly determined by video player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            {/* Video Player (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col">
              <div
                ref={playerContainerRef}
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/95 shadow-2xl group flex items-center justify-center border border-white/10"
              >
                {/* Real Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black cursor-pointer"
                  onClick={togglePlay}
                  playsInline
                  autoPlay
                  muted={isMuted}
                />

                {/* Simple Playback Error Message */}
                {hasPlaybackError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4 text-center z-20">
                    <span className="text-white text-lg font-medium tracking-wide">
                      Playback error.
                    </span>
                  </div>
                )}

                {/* Loading Indicator */}
                {isLoading && !hasPlaybackError && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}

                {/* Player Controls Bar */}
                {!hasPlaybackError && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title={isPlaying ? 'Tạm dừng' : 'Phát'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <span className="text-xs font-semibold text-white/90">
                        {selectedChannel.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title="Toàn màn hình"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop LPS sidebar: Height is strictly locked to video player, scrollable inside */}
            <div
              className="hidden lg:block lg:col-span-4 relative min-h-0 overflow-hidden"
              style={playerHeight ? { height: `${playerHeight}px`, maxHeight: `${playerHeight}px` } : undefined}
            >
              <div className="absolute inset-0 h-full w-full overflow-hidden">
                <ChannelSchedule channel={selectedChannel} variant="sidebar" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Schedule Drawer (Slide-in from right edge) */}
        <ChannelSchedule
          channel={selectedChannel}
          variant="drawer"
          isOpen={isMobileScheduleOpen}
          onClose={() => setIsMobileScheduleOpen(false)}
        />

        {/* Section 1: Kênh VTV (Bao gồm các luồng chính và luồng duplicate/test) */}
        <div className="w-full space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2">
            <span className="w-1.5 h-5 bg-[#E60000] rounded-full shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Kênh VTV & Thử nghiệm</span>
              <span className="text-sm sm:text-base font-semibold text-[#8E8B99]">
                ({VTV_CHANNELS.length})
              </span>
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 w-full mb-4" />

          {/* Grid of VTV channels */}
          {(() => {
            const filteredVtv = VTV_CHANNELS.filter((ch) =>
              !searchQuery.trim() || ch.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );

            if (filteredVtv.length === 0) {
              return (
                <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-zinc-400 text-sm">
                    Không tìm thấy kênh nào khớp với từ khóa &quot;{searchQuery}&quot;
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-7 gap-3">
                {filteredVtv.map((channel) => {
                  const isSelected = selectedChannel.id === channel.id;
                  // Phóng to logo vtv6 low latency và front, vtv6 thử nghiệm quay lại như cũ
                  const isEnlargedVtv6 = channel.id === 'vtv6_front' || channel.id === 'vtv6_low_latency';

                  return (
                    <button
                      key={channel.id}
                      id={`channel-btn-${channel.id}`}
                      onClick={() => handleSelectChannel(channel)}
                      className={`h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
                        isSelected
                          ? 'border-white shadow-xl shadow-black/40'
                          : 'border-transparent hover:border-white'
                      }`}
                      title={channel.name}
                    >
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className={`${
                          isEnlargedVtv6
                            ? 'h-16 sm:h-18 max-w-[95%] max-h-[92%] scale-135'
                            : 'h-12 sm:h-14 max-w-[88%] max-h-[82%]'
                        } w-auto object-contain select-none pointer-events-none`}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Notice Section: Chuyển xuống bên dưới category kênh VTV */}
        <div className="max-w-2xl mx-auto text-center space-y-4 pt-2 pb-2">
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl mx-auto">
            To watch official TV channels feed provided by Vplay and our community without interruptions, please visit the official Vplay website. This website is only for testing feed and they will not be able to watch at anytime.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              id="btn-livetv-official-website"
              href="https://v0-vplay-preview.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF0000] to-[#E6007A] text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Check official website</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            {onOpenCustomStreamModal && (
              <button
                id="btn-livetv-add-custom-link"
                onClick={onOpenCustomStreamModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add custom TV link</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Kênh HTV */}
        <div className="w-full space-y-4 pt-2">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2">
            <span className="w-1.5 h-5 bg-[#0066FF] rounded-full shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Kênh HTV</span>
              <span className="text-sm sm:text-base font-semibold text-[#8E8B99]">
                ({HTV_CHANNELS.length})
              </span>
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 w-full mb-4" />

          {/* Grid of HTV channels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-7 gap-3">
            {HTV_CHANNELS.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;

              return (
                <button
                  key={channel.id}
                  id={`channel-btn-${channel.id}`}
                  onClick={() => handleSelectChannel(channel)}
                  className={`h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
                    isSelected
                      ? 'border-white shadow-xl shadow-black/40'
                      : 'border-transparent hover:border-white'
                  }`}
                  title={channel.name}
                >
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-12 sm:h-14 w-auto max-w-[88%] max-h-[82%] object-contain select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Kênh địa phương */}
        <div className="w-full space-y-4 pt-2">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2">
            <span className="w-1.5 h-5 bg-[#10B981] rounded-full shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Kênh Địa phương</span>
              <span className="text-sm sm:text-base font-semibold text-[#8E8B99]">
                ({LOCAL_CHANNELS.length})
              </span>
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 w-full mb-4" />

          {/* Grid of Local channels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-7 gap-3">
            {LOCAL_CHANNELS.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;

              return (
                <button
                  key={channel.id}
                  id={`channel-btn-${channel.id}`}
                  onClick={() => handleSelectChannel(channel)}
                  className={`h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
                    isSelected
                      ? 'border-white shadow-xl shadow-black/40'
                      : 'border-transparent hover:border-white'
                  }`}
                  title={channel.name}
                >
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-12 sm:h-14 w-auto max-w-[88%] max-h-[82%] object-contain select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};



