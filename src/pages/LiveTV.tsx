import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Play, Pause, Volume2, VolumeX, Maximize2, Tv, Plus, CalendarDays, Ratio, LayoutGrid, MessageSquare, X } from 'lucide-react';
import { Channel } from '../types';
import { ChannelSchedule } from '../components/ChannelSchedule';
import { ChannelAdOverlay } from '../components/ChannelAdOverlay';
import { MultiviewPlayer } from '../components/MultiviewPlayer';
import LiveComments from '../components/LiveComments';
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
    id: 'vtv2_enc',
    name: 'VTV2 ENC',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/7/7c/V2_HD.png/revision/latest/scale-to-width-down/1000?cb=20260625102502',
    streamUrl: 'https://vplay.live/Colorbars',
  },
  {
    id: 'vtv4_enc',
    name: 'VTV4 ENC',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/5/5d/4_hd.png/revision/latest/scale-to-width-down/1000?cb=20260625103218',
    streamUrl: 'https://vplay.live/Colorbars',
  },
  {
    id: 'vtv9_enc',
    name: 'VTV9 ENC',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/2/25/9_HD.png/revision/latest/scale-to-width-down/1000?cb=20260625105022',
    streamUrl: 'https://vplay.live/Colorbars',
  },
  {
    id: 'vtv_can_tho_test',
    name: 'VTV Cần Thơ HD new test',
    logo: 'https://static.wikia.nocookie.net/logos/images/0/0c/VTV10_Logo_before_30-03-2026_%282%29.png/revision/latest/scale-to-width-down/1000?cb=20260510111347&path-prefix=uk',
    streamUrl: 'https://vplay.live/Colorbars',
  },
  {
    id: 'vtv5_tnb',
    name: 'VTV5 Tây Nam Bộ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/VTV5_logo_24.png',
    streamUrl: 'https://live.fptplay53.net/live/media/vtv5tnb/live-hls-avc/index.m3u8',
  },
  {
    id: 'vtv5_tn',
    name: 'VTV5 Tây Nguyên',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/VTV5_logo_24.png',
    streamUrl: 'https://live.fptplay53.net/live/media/vtv5tn/live-hls-avc/index.m3u8',
  },
  {
    id: 'vn_today_test',
    name: 'Vietnam Today (Luồng Thử nghiệm)',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/a/a4/VHD.png/revision/latest/scale-to-width-down/1000?cb=20260625105528',
    streamUrl: 'https://live.fptplay53.net/fnxhd1/vntoday_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'vtv_test_hevc1',
    name: 'VTV test HEVC-1',
    logo: 'https://static.wikia.nocookie.net/logos/images/b/b5/VTV_go_logo_2015.png/revision/latest?cb=20260317072846&path-prefix=uk',
    streamUrl: 'https://live.fptplay53.net/live/media/v1abr/live247-hls-avc/v1abr-avc1_5600000=10000-mp4a_131600=20000.m3u8',
  },
  // 3 luồng kênh phát lặp hình hiệu Ident 2026
  {
    id: 'vtv1_ident_2026',
    name: 'VTV1 ident 2026',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/f/f9/Image_%2812%29.png/revision/latest?cb=20260914074936',
    streamUrl: '/ads/ad1.mp4',
    category: 'Kênh VTV',
  },
  {
    id: 'vtv6_ident_2026',
    name: 'VTV6 ident 2026',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/3/31/Vtv6_front.png/revision/latest?cb=20260913100008',
    streamUrl: '/ads/ad2.mp4',
    category: 'Kênh VTV',
  },
  {
    id: 'vtv10_ident_2026',
    name: 'VTV10 ident 2026',
    logo: 'https://static.wikia.nocookie.net/ftv/images/a/a0/I10.png/revision/latest/scale-to-width-down/1000?cb=20260601094723&path-prefix=vi',
    streamUrl: '/ads/ad3.mp4',
    category: 'Kênh VTV',
  },
];

// Danh sách Kênh Đặc biệt (VTVgo Streams) - Đặt bên dưới nhóm kênh VTV
const SPECIAL_CHANNELS: VtvChannelItem[] = [
  {
    id: 'vtvgo_1',
    name: 'VTVgo 1',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://canal.mediaserver.com.co/live/buenisimatv.m3u8',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_1_oceans',
    name: 'VTVgo 1 (Oceans)',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'http://vjs.zencdn.net/v/oceans.mp4',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_2',
    name: 'VTVgo 2',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'http://vjs.zencdn.net/v/oceans.mp4',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_3_wild',
    name: 'VTVgo 3: Vietnam Wild LIVE Test',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://events.vtvdigital.vn/livestream/wildlife-720p50fps.m3u8',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_4',
    name: 'VTVgo 4',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://vplay.live/Colorbars',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_5',
    name: 'VTVgo 5',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_6',
    name: 'VTVgo 6',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://live.fptplay53.net/fnxhd1/vtv6hd_vhls.smil/chunklist_b5000000.m3u8',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_7',
    name: 'VTVgo 7',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_8',
    name: 'VTVgo 8',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
    category: 'Kênh Đặc biệt',
  },
  {
    id: 'vtvgo_9',
    name: 'VTVgo 9',
    logo: 'https://static.wikia.nocookie.net/ep-deo/images/6/64/Vtv_s%E1%BB%A7a.png/revision/latest/scale-to-width-down/1000?cb=20260625120702',
    streamUrl: 'https://live.fptplay53.net/fnxhd1/vntoday_vhls.smil/chunklist_b5000000.m3u8',
    category: 'Kênh Đặc biệt',
  },
];

// Danh sách các kênh VTVcab
const VTVCAB_CHANNELS: VtvChannelItem[] = [
  { id: 'on_trending', name: 'ON TRENDING TV', logo: 'https://img.vtvprime.vn/55xu-sW33ZbTdC_Jok1jkP6jWGpa3U96dXvvDuXoyz0/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGZjNzVhY2EtYjZhYS00MjYwLWIwMDMtZDRkYzg4OWI4ZGNkLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=186' },
  { id: 'on_kids', name: 'ON Kids', logo: 'https://img.vtvprime.vn/L7ERumqY3GEtK8vTe_DtMEJRYJkZPrVD3O4cbdT5P44/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGFlYmUzZGMtODZmYS00NGFkLTlhNzUtODg5NmFkODZhNGI3LnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=179' },
  { id: 'on_golf', name: 'ON Golf', logo: 'https://static.wikia.nocookie.net/logos/images/f/ff/ON_Golf_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20220311023800&path-prefix=vi', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=169' },
  { id: 'on_e_channel', name: 'ON E- Channel', logo: 'https://img.vtvprime.vn/bofK3Lca_KQJMc9sb6pUyQ_A41aWbsQi2ibNAzkN3I0/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTk3YjgwOGUtNjI3OS00NWQ4LWJkMTAtNWY1MGE1MjIwMTZkLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=182' },
  { id: 'on_vie_giaitri', name: 'ON Vie Giải Trí', logo: 'https://img.vtvprime.vn/gV1k4G1mCGQpnNGJFCJQISd0-p96jY14Ufz_mOb8h_o/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZjVhZDhkNmBiMTQ4NS00YjYxLThhMDEtNTdiYzBiMjU2NGU1LnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=180' },
  { id: 'on_vie_dramas', name: 'ON Vie Dramas', logo: 'https://img.vtvprime.vn/mVzz9rvhJ_BCun2e4ILB0OYl8ptcxG9TsSrIZ85kpLk/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvMmExZjgwNGYtNjc0Yi00ZjYzLThjZWMtNjgwN2NkNThhYTRkLnBuZw==.png', streamUrl: 'http://dvrfl05.bozztv.com/vch_vchannel18/tracks-v1a1/mono.m3u8' },
  { id: 'on_phimviet', name: 'ON Phim Việt', logo: 'https://img.vtvprime.vn/vDASEJI2IRP0eBox0ta6hgKo4vnY-3AdofWLa5lSqjM/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTc3YzdkNmItZTVhNi00ZTkyLWIzYzUtMGEzMTkyZjIyM2RhLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=175' },
  { id: 'on_movies_youtv', name: 'ON Movies - You TV', logo: 'https://img.vtvprime.vn/8-eDFNeJkwyONvmJVu_JydPc2dZaNJXuBTY7vtvCxxE/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZWQzOTEzNjgtYTJmNy00NDBkLWI0N2ItNzA2MDliNjJmNDYzLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=181' },
  { id: 'on_o2tv', name: 'ON O2TV', logo: 'https://img.vtvprime.vn/5FxYjiz34GsArbti7aFiSkIO7NMCxKNZcQJ9AvIme80/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvODAyNGIwMDQtNGJiNC00M2Y3LWJkYmEtYmU0MWVkMGY0NjM4LnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=136' },
  { id: 'on_bibi', name: 'ON BiBi', logo: 'https://img.vtvprime.vn/vjXRRLGeFrNx1iAkqhrK9RoAgU1oW6kq5q_6r7cd9zs/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvYzI3NWExNmEtNTMwOS00ZWE3LWJjMjMtYTMyNGIwZDczNGJlLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=178' },
  { id: 'on_infotv', name: 'ON Info TV', logo: 'https://img.vtvprime.vn/nCr-YgSmtNg5gcpJ35d6l_T4DUWz8fzr9EJpd9jAZ6E/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvM2E2NzM5NzQtNzRhYi00MjYxLTg2M2QtZWE2YzUyNzU5YzcyLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=189' },
  { id: 'on_cine', name: 'ON Cine', logo: 'https://img.vtvprime.vn/XY6SjolNpy8W8Eh_v_2oDyE6BiNOvofLosgPYO-hlY4/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTY5YjgyNmUtNjkzYi00YzBiLWFhZmYtNmFhZGFjZjFhZDA0LnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=176' },
  { id: 'on_styletv', name: 'ON Style TV', logo: 'https://img.vtvprime.vn/TxObOi0p9hC6K414i12Fk27SP8s_QKswAvPaRH2kK6M/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvNTcyOGM3MzEtOWE4OS00ZjljLTkyYTItMWVhODZmNzhiOWE4LnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=184' },
  { id: 'on_music', name: 'ON Music', logo: 'https://img.vtvprime.vn/39RnkA6ZHfNSCcsMaaSivvTVwmWjeGsbqlQsmD7nuvQ/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvN7RmOTYzYTYtZWRkYS00MDdjLWIxYmYtYTAwODBhMTUyYTNlLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=185' },
  { id: 'on_vfamily', name: 'ON V Family', logo: 'https://img.vtvprime.vn/8oeGePxG0Z-iJqm5biFVNdMdAlVHFDYsS0i7i3IpH2Y/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGI0YzYzOTgtNWJiOS00ODQ1LWE1ZjMtZTdhZTM5ZTc4NzVmLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=187' },
  { id: 'on_life', name: 'ON Life', logo: 'https://img.vtvprime.vn/cJ9URVIqC2BkU1gsT0IKiEy0tXDXqu7C4M3Ni3hjlgY/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvY2U2MWMwZGEtMWI1Zi00ZWJiLWE4ZTktZjdmZTVkNzRlODhmLnBuZw==.png', streamUrl: 'https://vpsttt.vietanhtv.top/tv360/tv360.php?id=188' },
];

// Danh sách các kênh HTV & HTVC
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
    id: 'htv5',
    name: 'HTV5 / B Channel',
    logo: 'https://static.wikia.nocookie.net/logos/images/b/bc/HTV5_Bchannel_logo_ch%C3%ADnh.png/revision/latest?cb=20260528063037&path-prefix=vi',
    streamUrl: 'https://live.fptplay53.net/fnxsd1/btv9_hls.smil/chunklist_b2500000.m3u8',
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
    id: 'htvc_thethao',
    name: 'HTVC Thể Thao',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/d/d4/HTVC_Th%E1%BB%83_thao.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_canhac',
    name: 'HTVC Ca Nhạc',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/a/ad/HTVC_Ca_nh%E1%BA%A1c.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcmusic_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_dulich',
    name: 'HTVC Du Lịch',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/9/98/HTVC_Du_l%E1%BB%8Bch.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcdulich_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_giadinh',
    name: 'HTVC Gia Đình',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/1/18/HTVC_Gia_%C4%91%C3%ACnh.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcgiadinh_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_phimhd',
    name: 'HTVC Phim HD',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/3/36/HTVC_Phim.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcmovieshd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_phunu',
    name: 'HTVC Phụ Nữ',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/4/4e/HTVC_Ph%E1%BB%A5_n%E1%BB%AF.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcphunu_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_thuanviet',
    name: 'HTVC Thuần Việt HD',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/3/3a/Thu%E1%BA%A7n_Vi%E1%BB%87t.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcthuanviethd_vhls.smil/chunklist_b5000000.m3u8',
  },
  {
    id: 'htvc_plus',
    name: 'HTVC+ HD',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/e/ec/HTVC_Plus.png',
    streamUrl: 'https://live.fptplay53.net/epzhd1/htvcplus_vhls.smil/chunklist_b5000000.m3u8',
  },
];

// Danh sách các kênh SCTV
const SCTV_CHANNELS: VtvChannelItem[] = [
  { id: 'sctv1', name: 'SCTV1 HD', logo: 'https://static.wikia.nocookie.net/logos/images/3/3c/SCTV1.png/revision/latest/scale-to-width-down/1000?cb=20201119113949&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv1' },
  { id: 'sctv2', name: 'SCTV2 HD', logo: 'https://static.wikia.nocookie.net/logos/images/6/64/SCTV2.png/revision/latest/scale-to-width-down/1000?cb=20201119114104&path-prefix=vi', streamUrl: 'https://liveh12.vtvprime.vn/hls/SCTV2/03.m3u8' },
  { id: 'sctv3', name: 'SCTV3 HD', logo: 'https://static.wikia.nocookie.net/logos/images/4/4a/SCTV3.png/revision/latest/scale-to-width-down/1000?cb=20210819101244&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv3' },
  { id: 'sctv4', name: 'SCTV4 HD', logo: 'https://static.wikia.nocookie.net/logos/images/6/62/SCTV4.png/revision/latest/scale-to-width-down/1000?cb=20240116011558&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv4' },
  { id: 'sctv5', name: 'SCTV5 HD', logo: 'https://static.wikia.nocookie.net/logos/images/e/e7/SCTV5.png/revision/latest/scale-to-width-down/1000?cb=20210819100021&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv5' },
  { id: 'sctv6', name: 'SCTV6 HD', logo: 'https://static.wikia.nocookie.net/logos/images/4/4b/SCTV6.png/revision/latest/scale-to-width-down/1000?cb=20210819100633&path-prefix=vi', streamUrl: 'https://live.fptplay53.net/epzhd2/film360_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'sctv7', name: 'SCTV7 HD', logo: 'https://static.wikia.nocookie.net/logos/images/8/87/SCTV7.png/revision/latest/scale-to-width-down/1000?cb=20210819102155&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv7' },
  { id: 'sctv8', name: 'SCTV8 HD', logo: 'https://static.wikia.nocookie.net/logos/images/0/05/SCTV8.png/revision/latest/scale-to-width-down/1000?cb=20210819103024&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv8' },
  { id: 'sctv9', name: 'SCTV9 HD', logo: 'https://static.wikia.nocookie.net/logos/images/f/f3/SCTV9.png/revision/latest/scale-to-width-down/1000?cb=20210821040105&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv9' },
  { id: 'sctv10', name: 'SCTV10 HD', logo: 'https://static.wikia.nocookie.net/logos/images/c/c0/SCTV10.png/revision/latest/scale-to-width-down/1000?cb=20210819105314&path-prefix=vi', streamUrl: 'https://liveh34.vtvprime.vn/hls/SCTV10/01.m3u8' },
  { id: 'sctv11', name: 'SCTV11 HD', logo: 'https://static.wikia.nocookie.net/logos/images/7/7d/SCTV11.png/revision/latest/scale-to-width-down/1000?cb=20210821040108&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv11' },
  { id: 'sctv12', name: 'SCTV12 HD', logo: 'https://static.wikia.nocookie.net/logos/images/5/51/SCTV12.png/revision/latest/scale-to-width-down/1000?cb=20201127035429&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv12' },
  { id: 'sctv13', name: 'SCTV13 HD', logo: 'https://static.wikia.nocookie.net/logos/images/c/c1/SCTV13_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20230630142130&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv13' },
  { id: 'sctv14', name: 'SCTV14 HD', logo: 'https://static.wikia.nocookie.net/logos/images/1/12/SCTV14_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20220428035033&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv14' },
  { id: 'sctv15', name: 'SCTV15 HD', logo: 'https://static.wikia.nocookie.net/logos/images/9/92/SCTV15.png/revision/latest/scale-to-width-down/1000?cb=20210820043237&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv15' },
  { id: 'sctv16', name: 'SCTV16 HD', logo: 'https://static.wikia.nocookie.net/logos/images/a/aa/SCTV16.png/revision/latest/scale-to-width-down/1000?cb=20210820043927&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv16' },
  { id: 'sctv17', name: 'SCTV17 HD', logo: 'https://static.wikia.nocookie.net/logos/images/0/0a/SCTV17.png/revision/latest/scale-to-width-down/1000?cb=20210820120340&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv17' },
  { id: 'sctv18', name: 'SCTV18 HD', logo: 'https://static.wikia.nocookie.net/logos/images/c/ca/SCTV18.png/revision/latest/scale-to-width-down/1000?cb=20210820120952&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv18' },
  { id: 'sctv19', name: 'SCTV19 HD', logo: 'https://static.wikia.nocookie.net/logos/images/e/ef/SCTV19.png/revision/latest/scale-to-width-down/1000?cb=20240131141543&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv19' },
  { id: 'sctv20', name: 'SCTV20 HD', logo: 'https://static.wikia.nocookie.net/logos/images/b/b1/SCTV20.png/revision/latest/scale-to-width-down/1000?cb=20210821042852&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv20' },
  { id: 'sctv21', name: 'SCTV21 HD', logo: 'https://static.wikia.nocookie.net/logos/images/9/9f/SCTV21.png/revision/latest/scale-to-width-down/1000?cb=20210821043405&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv21' },
  { id: 'sctv22', name: 'SCTV22 HD', logo: 'https://static.wikia.nocookie.net/logos/images/5/5f/SCTV22.png/revision/latest/scale-to-width-down/1000?cb=20210821035512&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctv22' },
  { id: 'sctv_phim', name: 'SCTV Phim', logo: 'https://static.wikia.nocookie.net/logos/images/1/12/SCTV_Phim_T%E1%BB%95ng_h%E1%BB%A3p_2020.png/revision/latest?cb=20230323070113&path-prefix=vi', streamUrl: 'https://hoiquan.dpdns.org/VTVGo/?sctvphim' },
];

// Danh sách Kênh Thiết yếu
const ESSENTIAL_CHANNELS: VtvChannelItem[] = [
  { id: 'antv', name: 'Truyền hình Công an Nhân dân (ANTV)', logo: 'https://img-zlr1.tv360.vn/image1/2020_09_23/1600822516608/b33963dc0df8_640_360.png', streamUrl: 'https://live.fptplay53.net/fnxhd2/anninhtv_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'qpvn', name: 'Truyền hình Quốc phòng Việt Nam (QPVN)', logo: 'https://static.wikia.nocookie.net/logos/images/5/5d/QPVN.png/revision/latest/scale-to-width-down/1000?cb=20220827083916&path-prefix=vi', streamUrl: 'https://live.fptplay53.net/fnxhd2/quocphongvnhd_vhls.smil/chunklist_b5000000.m3u8' },
];

// Danh sách Kênh Quốc tế & Thế giới
const INTERNATIONAL_CHANNELS: VtvChannelItem[] = [
  { id: 'cnn', name: 'CNN', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg', streamUrl: 'https://d3bp6dwmpbdajl.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ury0meh5m4nzm/index.m3u8' },
  { id: 'bbc_news', name: 'BBC News', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/62/BBC_News_2022.svg', streamUrl: 'https://stream8.cinerama.uz/1251/tracks-v1a1/mono.m3u8' },
  { id: 'discovery', name: 'Discovery Channel HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Discovery_Channel_logo.svg', streamUrl: 'http://cdn4.skygo.mn/live/disk1/SoutheastAsia/HLSv3-FTA/SoutheastAsia.m3u8' },
  { id: 'aljazeera', name: 'ALJAZEERA', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Aljazeera_eng.svg', streamUrl: 'https://live-hls-apps-aje-fa.getaj.net/AJE/01.m3u8' },
  { id: 'animal_planet', name: 'Animal Planet', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Animal_Planet_logo_2018.svg', streamUrl: 'https://tiger-hub.vercel.app@vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8' },
  { id: 'afn', name: 'ASIAN FOOD NETWORK', logo: 'https://static.wikia.nocookie.net/logos/images/a/a2/Asian_Food_Network.png', streamUrl: 'https://live.fptplay53.net/fnxhd2/afchd_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'cartoon_network', name: 'Cartoon Network', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Cartoon_Network_logo.svg', streamUrl: 'http://cdn4.skygo.mn/live/disk1/Cartoon_Network/HLSv3-FTA/Cartoon_Network.m3u8' },
  { id: 'kbs_world', name: 'KBS World', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/KBS_World_2018.svg', streamUrl: 'https://live.fptplay53.net/epzhd2/kbs_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'nhk_world', name: 'NHK World Japan', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/NHK_World-Japan_logo.svg', streamUrl: 'https://live.fptplay53.net/fnxhd2/nhkworld_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'tv5_monde', name: 'TV5 Monde', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/TV5MONDE_logo.svg', streamUrl: 'https://live.fptplay53.net/fnxhd2/tv5_hls.smil/chunklist_b2500000.m3u8' },
  { id: 'cna', name: 'CNA', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Channel_NewsAsia_logo.svg', streamUrl: 'https://live.fptplay53.net/fnxhd2/newsasia_hls.smil/chunklist_b2500000.m3u8' },
  { id: 'cnbc', name: 'CNBC', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg', streamUrl: 'https://live.fptplay53.net/fnxsd1/cnbc_hls.smil/chunklist_b2500000.m3u8' },
  { id: 'kix_hd', name: 'KIX HD', logo: 'https://static.wikia.nocookie.net/logos/images/0/05/KIX_HD.png', streamUrl: 'https://live.fptplay53.net/fnxhd2/kixhd_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'outdoor_channel', name: 'Outdoor Channel', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Outdoor_Channel_logo.svg', streamUrl: 'https://live.fptplay53.net/epzhd2/outdoorfhd_vhls.smil/chunklist_b5000000.m3u8' },
  { id: 'tvn', name: 'tvN', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Tvn_logo.svg', streamUrl: 'https://d21dxaer0ypwk1.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-a6m2cy2rylsvo-ssai-prd/54ac8e25_eb5a_4f10_ba20_ffb254f0a16c/hls/playlist.m3u8' },
  { id: 'warner_tv', name: 'Warner TV HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Warner_TV_logo.svg', streamUrl: 'http://cdn4.skygo.mn/live/disk1/Warner/HLSv3-FTA/Warner.m3u8' },
  { id: 'extreme_sports', name: 'Extreme Sports', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Extreme_Group_Logo.svg', streamUrl: 'http://flussonic.mkpnet.ru/tv-1a9441fd32d63873/video.m3u8' },
  { id: 'fashion_tv', name: 'Fashion TV', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Fashion_TV.svg', streamUrl: 'https://stream8.cinerama.uz/1053/tracks-v1a1/mono.m3u8' },
  { id: 'bloomberg', name: 'Bloomberg', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Bloomberg_logo.svg', streamUrl: 'https://cdn4.skygo.mn/live/disk1/Bloomberg/HLSv3-FTA/Bloomberg.m3u8' },
  // Quốc tế: Kênh Mỹ
  { id: 'abc_us', name: 'ABC (720p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/ABC_logo_2021.svg', streamUrl: 'http://41.205.93.154/ABC/index.m3u8' },
  { id: 'bein_sports_xtra', name: 'beIN SPORTS XTRA (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/BeIN_Sports_logo.svg', streamUrl: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8' },
  { id: 'bloomberg_us', name: 'Bloomberg TV US (720p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Bloomberg_logo.svg', streamUrl: 'https://bloomberg.com/media-manifest/streams/us.m3u8' },
  { id: 'disney_xd', name: 'Disney XD (720p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Disney_XD_logo_2015.svg', streamUrl: 'http://23.237.104.106:8080/USA_DISNEY_XD/index.m3u8' },
  { id: 'mtv_us', name: 'MTV (720p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/MTV_logo_2021.svg', streamUrl: 'http://198.58.104.90:8989/mtv/index.m3u8' },
  { id: 'nickelodeon_us', name: 'Nickelodeon (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Nickelodeon_logo_2023.svg', streamUrl: 'http://23.237.104.106:8080/USA_NICKELODEON/index.m3u8' },
  { id: 'showtime_us', name: 'Showtime (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Showtime_logo.svg', streamUrl: 'http://23.237.104.106:8080/USA_SHOWTIME/index.m3u8' },
  { id: 'starz_us', name: 'Starz (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Starz_2016.svg', streamUrl: 'http://23.237.104.106:8080/USA_STARZ/index.m3u8' },
  // Quốc tế: Kênh Trung Quốc
  { id: 'cctv_1', name: 'CCTV-1 (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/CCTV-1_logo.svg', streamUrl: 'http://69.30.245.50/live/cctv1.m3u8' },
  { id: 'cctv_3', name: 'CCTV-3 (720p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/CCTV-3_logo.svg', streamUrl: 'http://74.91.26.218:82/live/cctv3hd.m3u8' },
  { id: 'cctv_6', name: 'CCTV-6 (1080p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/CCTV-6_logo.svg', streamUrl: 'http://69.30.245.50/live/cctv6.m3u8' },
  { id: 'hunan_tv', name: 'Hunan TV (2160p)', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Hunan_TV_logo.svg', streamUrl: 'http://hlsal-ldvt.qing.mgtv.com/nn_live/nn_x64/dWlwPTEyNy4wLjAuMSZ1aWQ9cWluZy1jbXMmbm5fdGltZXpvbmU9OCZjZG5leF9pZD1hbF9obHNfbGR2dCZ1dWlkPTliODY4NmU5ZTM2YzYwMmMmZT02OTE0NjA0JnY9MSZpZD1ITldTWkdTVCZzPTcwN2RiYTc2YzJjNmJmMTQ4MmUyZGYzOWU2NWM3YWFi/HNWSZGST.m3u8' },
  // Quốc tế: Tây Ban Nha, Ý, Nga, Ấn Độ
  { id: 'real_madrid_tv', name: 'Real Madrid TV', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Real_Madrid_CF.svg', streamUrl: 'https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/master.m3u8' },
  { id: 'canale_5', name: 'Canale 5', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Canale_5_logo_2018.svg', streamUrl: 'https://live3-mediaset-it.akamaized.net/Content/hls_h0_clr_vos/live/channel(C5)/index.m3u8' },
  { id: 'italia_1', name: 'Italia 1', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Italia_1_logo_2018.svg', streamUrl: 'https://live3-mediaset-it.akamaized.net/Content/hls_h0_clr_vos/live/channel(i1)/index.m3u8' },
  { id: 'rai_1_hd', name: 'Rai 1 HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Rai_1_logo_%282016%29.svg', streamUrl: 'https://srv1.adriatelekom.com/Rai1/index.m3u8' },
  { id: 'russia_1_hd', name: 'Russia-1 HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Rossiya_1_logo_2012.svg', streamUrl: 'https://stream.smotrim.ru/hls2/russia_hd/playlist_6.m3u8' },
  { id: 'russia_24', name: 'Russia-24', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Rossiya_24_logo_2012.svg', streamUrl: 'https://stream.smotrim.ru/hls2/russia24nl_smotrim/playlist_5.m3u8' },
  { id: 'aaj_tak_hd', name: 'Aaj Tak HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Aaj_Tak_Logo.svg', streamUrl: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8' },
  { id: 'star_sports_1_hd', name: 'Star Sports 1 HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Star_Sports_logo_2021.svg', streamUrl: 'http://103.253.18.58:8000/play/a00m' },
  { id: 'wion_hd', name: 'WION HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/WION_Logo.svg', streamUrl: 'https://raw.githubusercontent.com/Alstruit/adaptive-streams/alstruit-10_23_in/streams/in/WION.in.m3u8' },
];

// Danh sách Kênh Radio
const RADIO_CHANNELS: VtvChannelItem[] = [
  { id: 'vov1', name: 'VOV1', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://media-audio.vov.vn/vov1vov5Vietnamese.sdp_aac/playlist.m3u8' },
  { id: 'vov2', name: 'VOV2', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://media-audio.vov.vn/vov2.sdp_aac/playlist.m3u8' },
  { id: 'vov3', name: 'VOV3', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://media-audio.vov.vn/vov3.sdp_aac/playlist.m3u8' },
  { id: 'vov4', name: 'VOV4', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'http://media.kythuatvov.vn:1936/live/VOV4_TB.sdp/chunklist.m3u8' },
  { id: 'vov5', name: 'VOV5', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://media-audio.vov.vn/vov5.sdp_aac/playlist.m3u8' },
  { id: 'vov_gt_hn', name: 'VOV Giao Thông Hà Nội', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://play.vovgiaothong.vn/live/gthn/playlist.m3u8' },
  { id: 'vov_gt_hcm', name: 'VOV Giao Thông TP.HCM', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://play.vovgiaothong.vn/live/gthcm/playlist.m3u8' },
  { id: 'vov_gt_mekong', name: 'VOV Giao Thông Mê Kông', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_VOV.svg', streamUrl: 'https://play.vovgiaothong.vn/live/mekong/playlist.m3u8' },
  { id: 'hanoi_fm90', name: 'Hà Nội FM90', logo: 'https://static.wikia.nocookie.net/ftv/images/4/4e/H1.png/revision/latest/scale-to-width-down/1000?cb=20260602015950&path-prefix=vi', streamUrl: 'http://14.162.146.90:8000/HANOI90' },
  { id: 'hanoi_fm96', name: 'Hà Nội FM96', logo: 'https://static.wikia.nocookie.net/ftv/images/4/4e/H1.png/revision/latest/scale-to-width-down/1000?cb=20260602015950&path-prefix=vi', streamUrl: 'http://222.252.21.96:8000/HANOI96' },
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

export const LiveTV: React.FC<LiveTVProps> = ({ currentChannel, onSelectChannel, channels, onOpenCustomStreamModal }) => {
  const { searchQuery } = useTabSearch();
  const [selectedChannel, setSelectedChannel] = useState<VtvChannelItem>(() => {
    if (currentChannel?.id) {
      const all = [...VTV_CHANNELS, ...SPECIAL_CHANNELS, ...HTV_CHANNELS, ...LOCAL_CHANNELS];
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
  const [isMobileCommentsOpen, setIsMobileCommentsOpen] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'schedule' | 'comments'>('schedule');
  const [playerHeight, setPlayerHeight] = useState<number | undefined>(undefined);
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>(() => {
    try {
      const saved = localStorage.getItem('vplay_tv_aspect_ratio');
      if (saved === '4:3' || saved === '16:9') return saved;
    } catch {}
    return '16:9';
  });
  const [aspectRatioToast, setAspectRatioToast] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Multiview Mode State (2 - 15 channels concurrent in one frame)
  const [isMultiview, setIsMultiview] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vplay_tv_multiview_active') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMultiview = (active: boolean) => {
    setIsMultiview(active);
    try {
      localStorage.setItem('vplay_tv_multiview_active', active ? 'true' : 'false');
    } catch {}
  };

  // Aggregated channel list for multiview and search
  const allChannelsList = useMemo<VtvChannelItem[]>(() => {
    const list: VtvChannelItem[] = [...VTV_CHANNELS, ...SPECIAL_CHANNELS, ...HTV_CHANNELS, ...LOCAL_CHANNELS];
    if (channels && channels.length > 0) {
      channels.forEach((ch) => {
        if (!list.some((existing) => existing.id === ch.id)) {
          list.push({
            id: ch.id,
            name: ch.name,
            logo: ch.logo || '',
            streamUrl: ch.streamUrl || '',
          });
        }
      });
    }
    return list;
  }, [channels]);

  const handleAspectRatioChange = (ratio: '16:9' | '4:3') => {
    setAspectRatio(ratio);
    try {
      localStorage.setItem('vplay_tv_aspect_ratio', ratio);
    } catch {}
    setAspectRatioToast(`Tỷ lệ luồng: ${ratio} (${ratio === '16:9' ? '16:9 Màn rộng' : '4:3 Squish'})`);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setAspectRatioToast(null);
    }, 2000);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const prevChannelIdRef = useRef<string | null>(null);

  // Trigger 5-second advertisement on entering any channel (every 5 channels watched)
  useEffect(() => {
    if (prevChannelIdRef.current === selectedChannel.id) return;
    prevChannelIdRef.current = selectedChannel.id;

    try {
      const stored = parseInt(sessionStorage.getItem('vplay_tv_channel_view_count') || '0', 10);
      const nextCount = stored + 1;
      sessionStorage.setItem('vplay_tv_channel_view_count', nextCount.toString());

      // Every 5 channels (5th, 10th, 15th, etc.), show 5s ad
      if (nextCount % 5 === 0) {
        setIsAdOpen(true);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    } catch {}
  }, [selectedChannel.id]);

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

    // Check if the stream is an MP4 video file or local ad/ident loop
    const isMp4 =
      streamUrl.endsWith('.mp4') ||
      streamUrl.includes('.mp4') ||
      streamUrl.startsWith('/ads/') ||
      streamUrl.startsWith('/intro-video');

    if (isMp4) {
      video.loop = true;
      video.src = streamUrl;
      video.load();

      const handleLoadedMetadata = () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {});
        }
      };

      const handlePlaying = () => {
        setIsLoading(false);
        setHasPlaybackError(false);
      };

      const handleEnded = () => {
        // Continuous seamless loop replay when video ends
        video.currentTime = 0;
        video.play().catch(() => {});
      };

      const handleError = () => {
        console.warn('MP4 playback error for stream:', streamUrl);
        setHasPlaybackError(true);
        setIsLoading(false);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
        video.loop = false;
      };
    }

    video.loop = false;

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
    const target = playerContainerRef.current || videoRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      target.requestFullscreen().catch(() => {
        videoRef.current?.requestFullscreen().catch(() => {});
      });
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

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8E8B99]">
                <Tv className="w-3.5 h-3.5" />
                <span>{isMultiview ? 'Multiview Đa Kênh' : 'Đang phát trực tiếp'}</span>
              </div>

              {/* Multiview Mode Toggle (Single vs Multiview 2-15 channels) */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/15 text-xs shadow-sm">
                <button
                  type="button"
                  onClick={() => handleToggleMultiview(false)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    !isMultiview
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Xem 1 kênh chuẩn có lịch phát sóng"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>1 Kênh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMultiview(true)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isMultiview
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Bật chế độ Multiview (xem đồng thời từ 2 đến 15 kênh trong 1 khung)"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Multiview (2-15)</span>
                </button>
              </div>

              {/* Aspect Ratio Switcher (16:9 vs 4:3 Squish) */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/15 text-xs shadow-sm">
                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('16:9')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    aspectRatio === '16:9'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Tỷ lệ 16:9 (Màn ảnh rộng, squish luồng vừa 16:9)"
                >
                  <Ratio className="w-3.5 h-3.5" />
                  <span>16:9</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAspectRatioChange('4:3')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    aspectRatio === '4:3'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Tỷ lệ 4:3 (Truyền thống, squish luồng kênh lại cho vừa 4:3)"
                >
                  <Ratio className="w-3.5 h-3.5" />
                  <span>4:3</span>
                </button>
              </div>

              {/* Mobile Calendar Icon Button ("icon hình quyển lịch") */}
              <button
                type="button"
                onClick={() => setIsMobileScheduleOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/25 to-[#C83DFF]/25 hover:from-red-600/35 hover:to-[#C83DFF]/35 border border-red-500/40 text-red-200 text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                title="Xem lịch phát sóng 24h"
              >
                <CalendarDays className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium">Lịch</span>
              </button>

              {/* Mobile Comments Button */}
              <button
                type="button"
                onClick={() => setIsMobileCommentsOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/25 to-indigo-600/25 hover:from-blue-600/35 hover:to-indigo-600/35 border border-blue-500/40 text-blue-200 text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                title="Bình luận trực tiếp"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium">Bình luận</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Player View: Multiview (2-15 channels) vs Single View Player */}
          {isMultiview ? (
            <div className="w-full">
              <MultiviewPlayer
                allChannels={allChannelsList}
                currentChannel={selectedChannel}
                aspectRatio={aspectRatio}
                onSelectSingleChannel={(channel) => {
                  const full = allChannelsList.find((c) => c.id === channel.id) || {
                    id: channel.id,
                    name: channel.name,
                    logo: channel.logo,
                    streamUrl: channel.streamUrl,
                  };
                  handleSelectChannel(full);
                  handleToggleMultiview(false);
                }}
                onExitMultiview={() => handleToggleMultiview(false)}
              />
            </div>
          ) : (
            /* Desktop: Side-by-side grid with height strictly determined by video player */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Video Player (8 cols on desktop) */}
              <div className="lg:col-span-8 flex flex-col">
                <div
                  ref={playerContainerRef}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl group flex items-center justify-center border border-white/10"
                >
                  {/* Real Video Element with 16:9 / 4:3 Squish support */}
                  <video
                    ref={videoRef}
                    className={`h-full transition-all duration-300 bg-black cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'w-full object-fill block'
                        : 'w-auto aspect-[4/3] object-fill mx-auto block'
                    }`}
                    style={{
                      objectFit: 'fill',
                      aspectRatio: aspectRatio === '4:3' ? '4 / 3' : '16 / 9',
                      width: aspectRatio === '4:3' ? 'auto' : '100%',
                      height: '100%',
                      maxWidth: '100%',
                    }}
                    onClick={togglePlay}
                    playsInline
                    autoPlay
                    muted={isMuted}
                    loop={
                      selectedChannel.streamUrl.endsWith('.mp4') ||
                      selectedChannel.streamUrl.includes('.mp4') ||
                      selectedChannel.streamUrl.startsWith('/ads/')
                    }
                    onEnded={() => {
                      if (
                        selectedChannel.streamUrl.endsWith('.mp4') ||
                        selectedChannel.streamUrl.includes('.mp4') ||
                        selectedChannel.streamUrl.startsWith('/ads/')
                      ) {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          videoRef.current.play().catch(() => {});
                        }
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* On-screen Toast Notification for Aspect Ratio */}
                  {aspectRatioToast && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md text-white font-mono text-xs font-bold flex items-center gap-2 z-20 pointer-events-none shadow-2xl animate-fade-in">
                      <Ratio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>{aspectRatioToast}</span>
                    </div>
                  )}

                  {/* 5-Second Channel Interstitial Ad Overlay (Every 5 Channels) */}
                  <ChannelAdOverlay
                    isOpen={isAdOpen}
                    channelName={selectedChannel.name}
                    onAdComplete={() => {
                      setIsAdOpen(false);
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => {});
                      }
                    }}
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
                          className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                          title={isPlaying ? 'Tạm dừng' : 'Phát'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                          title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <span className="text-xs font-semibold text-white/90">
                          {selectedChannel.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick switch to Multiview */}
                        <button
                          type="button"
                          onClick={() => handleToggleMultiview(true)}
                          className="px-2.5 py-1 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-purple-500/30"
                          title="Chuyển sang xem Multiview (2-15 kênh)"
                        >
                          <LayoutGrid className="w-3.5 h-3.5 text-purple-300" />
                          <span className="hidden sm:inline">Multiview</span>
                        </button>

                        {/* Aspect Ratio Quick Toggle Pill in Overlay Controls */}
                        <button
                          type="button"
                          onClick={() => handleAspectRatioChange(aspectRatio === '16:9' ? '4:3' : '16:9')}
                          className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                          title={`Tỷ lệ hiện tại: ${aspectRatio}. Bấm để chuyển sang ${aspectRatio === '16:9' ? '4:3' : '16:9'} (squish luồng)`}
                        >
                          <Ratio className="w-3.5 h-3.5 text-red-400" />
                          <span>{aspectRatio}</span>
                        </button>

                        <button
                          onClick={toggleFullscreen}
                          className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                          title="Toàn màn hình"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Sidebar: Tab Switcher between Lịch phát sóng & Bình luận trực tiếp */}
              <div
                className="hidden lg:flex lg:col-span-4 flex-col relative min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl"
                style={playerHeight ? { height: `${playerHeight}px`, maxHeight: `${playerHeight}px` } : undefined}
              >
                {/* Tab Switcher Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 w-full">
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('schedule')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeRightTab === 'schedule'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Lịch phát sóng</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('comments')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeRightTab === 'comments'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Bình luận</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </button>
                  </div>
                </div>

                {/* Tab Body */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                  {activeRightTab === 'schedule' ? (
                    <div className="absolute inset-0 h-full w-full overflow-hidden">
                      <ChannelSchedule channel={selectedChannel} variant="sidebar" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 h-full w-full overflow-hidden flex flex-col">
                      <LiveComments channel={selectedChannel} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Schedule Drawer (Slide-in from right edge) */}
        <ChannelSchedule
          channel={selectedChannel}
          variant="drawer"
          isOpen={isMobileScheduleOpen}
          onClose={() => setIsMobileScheduleOpen(false)}
        />

        {/* Mobile Live Comments Drawer (Slide-in from right edge) */}
        {isMobileCommentsOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
              onClick={() => setIsMobileCommentsOpen(false)}
            />
            <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-zinc-900/90">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      Bình luận trực tiếp
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      {selectedChannel.name} • Trò chuyện thời gian thực
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileCommentsOpen(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-0 relative">
                <LiveComments channel={selectedChannel} />
              </div>
            </div>
          </div>
        )}

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
                      className={`channel-card h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
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
                      {channel.id.includes('ident') && (
                        <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#E60000] text-white tracking-wider uppercase shadow-md pointer-events-none">
                          IDENT 2026
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Section Đặc biệt: Kênh Đặc biệt (VTVgo Streams) - Đặt bên dưới nhóm kênh VTV */}
        <div className="w-full space-y-4 pt-2">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2">
            <span className="w-1.5 h-5 bg-[#A855F7] rounded-full shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Kênh Đặc biệt (VTVgo Streams)</span>
              <span className="text-sm sm:text-base font-semibold text-[#8E8B99]">
                ({SPECIAL_CHANNELS.length})
              </span>
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 w-full mb-4" />

          {/* Grid of Special channels */}
          {(() => {
            const filteredSpecial = SPECIAL_CHANNELS.filter((ch) =>
              !searchQuery.trim() || ch.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );

            if (filteredSpecial.length === 0) {
              return (
                <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-zinc-400 text-sm">
                    Không tìm thấy kênh nào khớp với từ khóa &quot;{searchQuery}&quot;
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
                {filteredSpecial.map((channel) => {
                  const isSelected = selectedChannel.id === channel.id;

                  return (
                    <button
                      key={channel.id}
                      id={`channel-btn-${channel.id}`}
                      onClick={() => handleSelectChannel(channel)}
                      className={`channel-card h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
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
                      <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#7C3AED] text-white tracking-wider uppercase shadow-md pointer-events-none">
                        VTVgo
                      </span>
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
            To watch official TV channels feed provided by VNRT Online and our community without interruptions, please visit the official VNRT Online website. This website is only for testing feed and they will not be able to watch at anytime.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              id="btn-livetv-official-website"
              href="https://v0-vplay-preview.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-[30px] bg-gradient-to-r from-[#FF0000] to-[#E6007A] text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Check official website</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            {onOpenCustomStreamModal && (
              <button
                id="btn-livetv-add-custom-link"
                onClick={onOpenCustomStreamModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[30px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
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
                  className={`channel-card h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
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
                  className={`channel-card h-20 sm:h-22 rounded-2xl p-2.5 sm:p-3 flex items-center justify-center cursor-pointer bg-[#353535] hover:bg-[#424242] relative group border-[3px] ${
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



