import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Globe,
  MapPin,
  Satellite,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Search,
  Layers,
  Share2,
  Camera,
  Navigation,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  Eye,
  Info,
  ChevronRight,
  Sun,
  Cloud,
  Crosshair,
  Wind
} from 'lucide-react';
import { playPopSound, playWinSound } from '../../utils/sound';

export interface VMapsLocation {
  id: string;
  name: string;
  category: 'vietnam' | 'space' | 'world';
  region: string;
  tagline: string;
  description: string;
  lat: number;
  lng: number;
  altitude: string;
  weather: {
    temp: string;
    condition: string;
    wind: string;
    humidity: string;
  };
  imageUrl: string;
  satelliteUrl: string;
  hotspots: {
    title: string;
    desc: string;
    x: number; // percentage in panorama
    y: number;
  }[];
}

const LOCATIONS_360: VMapsLocation[] = [
  {
    id: 'hoan_kiem',
    name: 'Hồ Hoàn Kiếm & Tháp Rùa',
    category: 'vietnam',
    region: 'Hà Nội, Việt Nam',
    tagline: 'Trái tim ngàn năm văn hiến Thủ đô',
    description: 'Hồ Hoàn Kiếm (Hồ Gươm) là biểu tượng lịch sử và văn hóa thiêng liêng của Thủ đô Hà Nội với Tháp Rùa cổ kính giữa lòng hồ xanh ngắt.',
    lat: 21.0285,
    lng: 105.8542,
    altitude: '18m',
    weather: { temp: '28°C', condition: 'Nắng nhẹ', wind: '12 km/h', humidity: '72%' },
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Tháp Rùa', desc: 'Di tích lịch sử xây dựng thế kỷ 19 giữa đảo Rùa', x: 50, y: 55 },
      { title: 'Cầu Thê Húc', desc: 'Cầu gỗ cong màu đỏ son dẫn vào đền Ngọc Sơn', x: 25, y: 48 },
      { title: 'Đền Ngọc Sơn', desc: 'Di tích quốc gia đặc biệt trên đảo Ngọc', x: 75, y: 52 },
    ]
  },
  {
    id: 'ha_long',
    name: 'Vịnh Hạ Long',
    category: 'vietnam',
    region: 'Quảng Ninh, Việt Nam',
    tagline: 'Di sản Thiên nhiên Thế giới UNESCO',
    description: 'Kỳ quan thiên nhiên thế giới nổi tiếng với hàng nghìn hòn đảo đá vôi kỳ vĩ nhấp nhô trên mặt biển ngọc bích.',
    lat: 20.9101,
    lng: 107.1839,
    altitude: '0m (Mực nước biển)',
    weather: { temp: '26°C', condition: 'Mát mẻ ven biển', wind: '18 km/h', humidity: '80%' },
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Hòn Trống Mái', desc: 'Biểu tượng đôi chim đá vôi kỳ thú của Vịnh Hạ Long', x: 42, y: 50 },
      { title: 'Hang Sửng Sốt', desc: 'Hang động nhũ đá lộng lẫy và quy mô bậc nhất', x: 70, y: 45 },
    ]
  },
  {
    id: 'cau_vang',
    name: 'Cầu Vàng Bà Nà Hills',
    category: 'vietnam',
    region: 'Đà Nẵng, Việt Nam',
    tagline: 'Kỳ quan kiến trúc vươn giữa mây trời',
    description: 'Cây cầu đi bộ uốn lượn được nâng đỡ bởi đôi bàn tay khổng lồ bằng đá phủ rêu phong giữa sương mờ đỉnh Bà Nà.',
    lat: 15.9953,
    lng: 107.9965,
    altitude: '1.414m',
    weather: { temp: '21°C', condition: 'Mây phủ sương mù', wind: '15 km/h', humidity: '85%' },
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Đôi Bàn Tay Phật', desc: 'Bàn tay đá khổng lồ rêu phong nâng lối đi', x: 48, y: 58 },
      { title: 'Thung Lũng Bà Nà', desc: 'Rừng nguyên sinh bạt ngàn trải dài xuống biển', x: 80, y: 40 },
    ]
  },
  {
    id: 'bitexco_hcm',
    name: 'Phố Đi Bộ & Sài Gòn Skyview',
    category: 'vietnam',
    region: 'TP. Hồ Chí Minh, Việt Nam',
    tagline: 'Nhịp đập năng động đô thị hoa lệ',
    description: 'Toàn cảnh trung tâm Sài Gòn hoa lệ nhìn từ trên cao, rực rỡ ánh đèn bên dòng sông Sài Gòn thơ mộng.',
    lat: 10.7719,
    lng: 106.7044,
    altitude: '68m',
    weather: { temp: '32°C', condition: 'Nắng ấm', wind: '10 km/h', humidity: '65%' },
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Phố đi bộ Nguyễn Huệ', desc: 'Quảng trường đi bộ trung tâm sôi động nhất', x: 38, y: 60 },
      { title: 'Bến Bạch Đằng & Sông Sài Gòn', desc: 'Cảng sông thơ mộng đón gió mát lành', x: 72, y: 50 },
    ]
  },
  {
    id: 'fansipan',
    name: 'Đỉnh Fansipan 3.143m',
    category: 'vietnam',
    region: 'Lào Cai, Việt Nam',
    tagline: 'Nóc nhà Đông Dương hùng vĩ',
    description: 'Đỉnh núi cao nhất bán đảo Đông Dương với biển mây bồng bềnh, cột mốc inox thiêng liêng và quần thể tâm linh trên mây.',
    lat: 22.3034,
    lng: 103.7751,
    altitude: '3.143m',
    weather: { temp: '14°C', condition: 'Lạnh & Gió mây', wind: '28 km/h', humidity: '92%' },
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Cột mốc Fansipan', desc: 'Chóp kim tự tháp inox đỉnh cao 3.143m', x: 50, y: 48 },
      { title: 'Đại Tượng Phật A Di Đà', desc: 'Tượng Phật bằng đồng sừng sững giữa trời mây', x: 30, y: 52 },
    ]
  },
  {
    id: 'truong_sa',
    name: 'Quần Đảo Trường Sa & Nhà Giàn DK1',
    category: 'vietnam',
    region: 'Biển Đông, Việt Nam',
    tagline: 'Chủ quyền thiêng liêng nơi đầu sóng ngọn gió',
    description: 'Vùng biển đảo thiêng liêng của Tổ quốc với những cột mốc chủ quyền kiên trung, ngọn hải đăng sừng sững và nhà giàn DK1 canh giữ biển trời.',
    lat: 8.6443,
    lng: 111.9192,
    altitude: '5m',
    weather: { temp: '29°C', condition: 'Gió biển trong lành', wind: '22 km/h', humidity: '76%' },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Cột mốc Chủ quyền', desc: 'Biểu tượng chủ quyền bất khả xâm phạm của Việt Nam', x: 45, y: 55 },
      { title: 'Hải Đăng Trường Sa', desc: 'Mắt thần soi đường cho tàu thuyền trên Biển Đông', x: 65, y: 42 },
    ]
  },
  {
    id: 'iss_space',
    name: 'Trạm Vũ Trụ ISS Orbit 360°',
    category: 'space',
    region: 'Quỹ Đạo Trái Đất (Low Earth Orbit)',
    tagline: 'Góc nhìn không gian từ độ cao 408km',
    description: 'Toàn cảnh quả cầu Trái Đất xanh nhìn từ vòm quan sát Cupola của Trạm Không Gian Quốc Tế ISS bay với vận tốc 27.600 km/h.',
    lat: 14.0583,
    lng: 108.2772,
    altitude: '408.000m (408 km)',
    weather: { temp: '-120°C / +120°C', condition: 'Chân không không gian', wind: '0 km/h', humidity: '0%' },
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Dải Khí Quyển Xanh', desc: 'Tầng khí quyển mỏng manh bảo bọc sự sống Trái Đất', x: 50, y: 35 },
      { title: 'Tấm Pin Năng Lượng Mặt Trời', desc: 'Cánh thu năng lượng quang điện của trạm ISS', x: 20, y: 60 },
    ]
  },
  {
    id: 'mars_perseverance',
    name: 'Hành Tinh Đỏ Sao Hỏa (Mars 360)',
    category: 'space',
    region: 'Miệng Hố Jezero Crater, Sao Hỏa',
    tagline: 'Địa hình hành tinh đỏ từ Robot thám hiểm',
    description: 'Toàn cảnh 360 độ sa mạc cát đỏ, đồi đá trầm tích và tàn tích lòng hồ cổ đại trên Sao Hỏa ghi lại bởi tàu thám hiểm.',
    lat: 18.38,
    lng: 77.58,
    altitude: '-2.500m (Dưới mực chuẩn Hỏa Tinh)',
    weather: { temp: '-63°C', condition: 'Bão bụi mỏng & Khí CO2', wind: '25 km/h', humidity: '0.03%' },
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1920&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1920&q=80',
    hotspots: [
      { title: 'Đồng bằng Jezero', desc: 'Lòng hồ cổ từng chứa nước hàng tỷ năm trước', x: 55, y: 52 },
      { title: 'Vách Đá Delta Cổ', desc: 'Các lớp địa chất chứa dấu vết sinh học tiềm năng', x: 78, y: 46 },
    ]
  }
];

interface VMapsTabProps {
  onBack?: () => void;
}

export const VMapsTab: React.FC<VMapsTabProps> = ({ onBack }) => {
  const [activeLocation, setActiveLocation] = useState<VMapsLocation>(LOCATIONS_360[0]);
  const [viewMode, setViewMode] = useState<'panorama' | 'satellite' | 'terrain'>('panorama');
  const [yaw, setYaw] = useState<number>(0); // 0 to 360 degrees
  const [pitch, setPitch] = useState<number>(0); // -40 to 40 degrees
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; desc: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vietnam' | 'space'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + 0.15) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // Handle Drag / Pan to orbit 360°
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startDragRef.current.x;
    const deltaY = e.clientY - startDragRef.current.y;
    startDragRef.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => (prev - deltaX * 0.25 + 360) % 360);
    setPitch((prev) => Math.max(-35, Math.min(35, prev - deltaY * 0.2)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startDragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setIsAutoRotate(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startDragRef.current.x;
    const deltaY = e.touches[0].clientY - startDragRef.current.y;
    startDragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw((prev) => (prev - deltaX * 0.3 + 360) % 360);
    setPitch((prev) => Math.max(-35, Math.min(35, prev - deltaY * 0.25)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleZoomIn = () => {
    playPopSound();
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    playPopSound();
    setZoom((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetView = () => {
    playPopSound();
    setYaw(0);
    setPitch(0);
    setZoom(1);
    setIsAutoRotate(true);
  };

  const handleSelectLocation = (loc: VMapsLocation) => {
    playPopSound();
    setActiveLocation(loc);
    setYaw(0);
    setPitch(0);
    setActiveHotspot(null);
  };

  const toggleFullscreen = () => {
    playPopSound();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const filteredLocations = LOCATIONS_360.filter((loc) => {
    const matchCat = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchQuery =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Calculate compass direction
  const getCompassHeading = (degrees: number) => {
    const directions = ['Bắc (N)', 'Đông Bắc (NE)', 'Đông (E)', 'Đông Nam (SE)', 'Nam (S)', 'Tây Nam (SW)', 'Tây (W)', 'Tây Bắc (NW)'];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
    return directions[index];
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-full flex flex-col bg-[#0B0C10] text-white select-none ${
        isFullscreen ? 'fixed inset-0 z-[99999]' : 'relative rounded-3xl overflow-hidden'
      }`}
    >
      {/* 1. TOP BAR NAVIGATION */}
      <div className="h-16 px-4 sm:px-6 bg-[#12131A]/95 border-b border-white/10 flex items-center justify-between backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Quay lại Space 360"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  V-Maps Space 360
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  PRO v4.2
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Bản đồ Không Gian 360° & Vệ Tinh Trực Tuyến
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1A1B24] border border-white/10">
          <button
            onClick={() => {
              playPopSound();
              setViewMode('panorama');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'panorama'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Toàn cảnh 360°</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setViewMode('satellite');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'satellite'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Vệ Tinh</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setViewMode('terrain');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'terrain'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Địa Hình</span>
          </button>
        </div>

        {/* Quick controls on right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
            title={audioEnabled ? 'Tắt âm thanh môi trường' : 'Bật âm thanh không gian'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* VIEWPORT / CANVAS 360° */}
        <div
          className="flex-1 relative overflow-hidden bg-black flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Panoramic Image with Orbit transform */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
            style={{
              backgroundImage: `url(${viewMode === 'satellite' ? activeLocation.satelliteUrl : activeLocation.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: `${((yaw / 360) * 100).toFixed(2)}% ${Math.max(10, Math.min(90, 50 - pitch))}%`,
              transform: `scale(${zoom})`,
              filter: viewMode === 'terrain' ? 'contrast(1.2) hue-rotate(15deg)' : 'none',
            }}
          />

          {/* Grid lines & Vignette overlay */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

          {/* Radar scan ring in satellite mode */}
          {viewMode === 'satellite' && (
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,transparent_40%,rgba(6,182,212,0.4)_70%,transparent_100%)] animate-pulse" />
          )}

          {/* Interactive Hotspot Pins in 360° space */}
          {viewMode === 'panorama' && activeLocation.hotspots.map((hotspot, idx) => {
            // Calculate screen offset based on yaw
            const screenX = ((hotspot.x + (yaw / 3.6)) % 100);
            return (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  playWinSound();
                  setActiveHotspot(hotspot);
                }}
                style={{
                  left: `${screenX}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 cursor-pointer group pointer-events-auto"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/40 animate-ping absolute" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 border-2 border-white group-hover:scale-125 transition-transform">
                    <MapPin className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white border border-cyan-400/40 text-[11px] font-bold whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-xl">
                  {hotspot.title}
                </div>
              </div>
            );
          })}

          {/* HUD OVERLAY - TOP LEFT: LOCATION INFO */}
          <div className="absolute top-4 left-4 z-10 max-w-sm pointer-events-none">
            <div className="p-3.5 rounded-2xl bg-[#0D0E15]/85 border border-white/10 backdrop-blur-xl shadow-2xl space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1 font-mono">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{activeLocation.region}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                  {activeLocation.altitude}
                </span>
              </div>

              <h2 className="text-lg font-black text-white leading-tight">
                {activeLocation.name}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                {activeLocation.description}
              </p>

              {/* Weather snapshot */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Sun className="w-4 h-4" />
                  <span>{activeLocation.weather.temp}</span>
                  <span className="text-[10px] text-zinc-400 font-normal">({activeLocation.weather.condition})</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{activeLocation.weather.wind}</span>
                </div>
              </div>
            </div>
          </div>

          {/* HUD OVERLAY - TOP RIGHT: COMPASS & SATELLITE TELEMETRY */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="p-3 rounded-2xl bg-[#0D0E15]/85 border border-white/10 backdrop-blur-xl shadow-2xl space-y-2 pointer-events-auto">
              {/* Rotating Compass Dial */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center bg-black/40 shadow-inner">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-75"
                    style={{ transform: `rotate(${-yaw}deg)` }}
                  >
                    <Navigation className="w-6 h-6 text-cyan-400 fill-cyan-400/30" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
                    Hướng Quan Sát
                  </div>
                  <div className="text-xs font-bold text-white">
                    {getCompassHeading(yaw)}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    Góc quay: {Math.round(yaw)}° | Nghiêng: {Math.round(pitch)}°
                  </div>
                </div>
              </div>

              {/* GPS Coordinates Display */}
              {showCoordinates && (
                <div className="pt-2 border-t border-white/10 font-mono text-[10px] text-zinc-400 space-y-0.5">
                  <div>LAT: <span className="text-white font-bold">{activeLocation.lat.toFixed(4)}°N</span></div>
                  <div>LNG: <span className="text-white font-bold">{activeLocation.lng.toFixed(4)}°E</span></div>
                </div>
              )}
            </div>
          </div>

          {/* HUD CONTROLS - FLOATING BOTTOM BAR */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E1017]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => {
                playPopSound();
                setIsAutoRotate(!isAutoRotate);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoRotate
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={isAutoRotate ? 'Tạm dừng xoay' : 'Xoay 360° tự động'}
            >
              {isAutoRotate ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoRotate ? 'Đang quay' : 'Tự động quay'}</span>
            </button>

            <div className="w-px h-5 bg-white/15" />

            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetView}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Đặt lại góc nhìn ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/15" />

            <button
              onClick={() => {
                playPopSound();
                setShowCoordinates(!showCoordinates);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                showCoordinates ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Ẩn/hiện toạ độ GPS"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* HOTSPOT POPUP MODAL */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-[90%] p-4 rounded-2xl bg-[#131520]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {activeHotspot.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-zinc-400 hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                  {activeHotspot.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. SIDEBAR: LANDMARK CATALOG & SEARCH */}
        <div className="w-full lg:w-84 xl:w-96 bg-[#101118] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-auto lg:h-full max-h-[380px] lg:max-h-none overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm địa danh 360°, tọa độ GPS..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1B24] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                Tất cả ({LOCATIONS_360.length})
              </button>
              <button
                onClick={() => setSelectedCategory('vietnam')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'vietnam'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                Việt Nam
              </button>
              <button
                onClick={() => setSelectedCategory('space')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'space'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                Không Gian 🚀
              </button>
            </div>
          </div>

          {/* Location Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [scrollbar-width:thin]">
            {filteredLocations.map((loc) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#191D2B] border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-[#14151E] border-white/5 hover:border-white/20 hover:bg-[#1A1C28]'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={loc.imageUrl}
                        alt={loc.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-bold text-cyan-300">
                        360°
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider truncate">
                          {loc.region}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">
                          {loc.altitude}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                        {loc.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {loc.tagline}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-white/5">
                        <span className="font-mono">{loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°</span>
                        <span className="text-amber-300 font-semibold">{loc.weather.temp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Footer Stats */}
          <div className="p-3 bg-[#0C0D13] border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vệ Tinh Space 360 Online</span>
            </span>
            <span>Tọa Độ WGS84</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VMapsTab;
