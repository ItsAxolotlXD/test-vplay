import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  FolderOpen,
  Camera,
  Upload,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Maximize2,
  SlidersHorizontal,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  album: 'Camera' | 'Danh Thắng' | 'Hậu Trường' | 'Nghệ Thuật' | 'Tải Lên';
  date: string;
  isFavorite?: boolean;
  resolution?: string;
  description?: string;
}

const CURATED_GALLERY: GalleryItem[] = [
  {
    id: 'vn-1',
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&auto=format&fit=crop&q=80',
    title: 'Vịnh Hạ Long - Kỳ Quan Thiên Nhiên',
    album: 'Danh Thắng',
    date: '10/09/2026',
    resolution: '3840 x 2160 (4K)',
    description: 'Hàng ngàn đảo đá vôi kỳ vĩ soi bóng xuống làn nước biển xanh ngọc bích.',
  },
  {
    id: 'vn-2',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
    title: 'Phố Cổ Hội An Rực Rỡ Đèn Lồng',
    album: 'Danh Thắng',
    date: '08/09/2026',
    resolution: '4000 x 2667',
    description: 'Vẻ đẹp trầm mặc, cổ kính bên dòng sông Hoài thơ mộng khi hoàng hôn buông xuống.',
  },
  {
    id: 'vn-3',
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
    title: 'Ruộng Bậc Thang Mù Cang Chải Mùa Lúa Chín',
    album: 'Danh Thắng',
    date: '05/09/2026',
    resolution: '3000 x 2000',
    description: 'Những thảm vàng óng ả uốn lượn lưng chừng mây ngàn Tây Bắc.',
  },
  {
    id: 'vn-4',
    url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop&q=80',
    title: 'Trường Quay Trung Tâm V-Play Studio 360',
    album: 'Hậu Trường',
    date: '02/09/2026',
    resolution: '1920 x 1080 (FHD)',
    description: 'Hệ thống ánh sáng studio và dàn camera 4K chuẩn bị cho giờ phát sóng trực tiếp.',
  },
  {
    id: 'vn-5',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
    title: 'Sân Khấu Liveshow Âm Nhạc V-Concert',
    album: 'Hậu Trường',
    date: '01/09/2026',
    resolution: '3840 x 2160 (4K)',
    description: 'Hiệu ứng laser và khói sân khấu hoành tráng trong đêm đại nhạc hội.',
  },
  {
    id: 'vn-6',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    title: 'Tranh Trừu Tượng Sóng Năng Lượng 360',
    album: 'Nghệ Thuật',
    date: '28/08/2026',
    resolution: '2560 x 1440 (2K)',
    description: 'Tác phẩm đồ họa kỹ thuật số thể hiện dòng chảy kết nối tương lai.',
  },
];

export const VGalleryTab: React.FC = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('Tất cả');
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const userUploads = localStorage.getItem('v_user_gallery_photos');
      const cameraPhotos = localStorage.getItem('v_camera_captured_photos');
      let combined = [...CURATED_GALLERY];

      if (cameraPhotos) {
        const parsedCam = JSON.parse(cameraPhotos);
        combined = [...parsedCam, ...combined];
      }
      if (userUploads) {
        const parsedUp = JSON.parse(userUploads);
        combined = [...parsedUp, ...combined];
      }
      return combined;
    } catch {
      return CURATED_GALLERY;
    }
  });

  // Lightbox view
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slideshow interval
  useEffect(() => {
    let timer: number | null = null;
    if (isSlideshowRunning && activePhoto) {
      timer = window.setInterval(() => {
        handleNextPhoto();
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSlideshowRunning, activePhoto]);

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const newItem: GalleryItem = {
            id: `up-${Date.now()}-${Math.random()}`,
            url: base64,
            title: file.name.replace(/\.[^/.]+$/, ''),
            album: 'Tải Lên',
            date: new Date().toLocaleDateString('vi-VN'),
            resolution: 'Ảnh Gốc Tải Lên',
            description: 'Ảnh được tải lên từ thiết bị của bạn.',
          };

          setItems((prev) => {
            const next = [newItem, ...prev];
            try {
              const uploads = next.filter((i) => i.album === 'Tải Lên');
              localStorage.setItem('v_user_gallery_photos', JSON.stringify(uploads.slice(0, 15)));
            } catch {}
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const filteredItems = items.filter((it) => {
    if (selectedAlbum === 'Tất cả') return true;
    if (selectedAlbum === 'Yêu thích') return it.isFavorite;
    return it.album === selectedAlbum;
  });

  const handleOpenLightbox = (photo: GalleryItem) => {
    setActivePhoto(photo);
    setZoomLevel(1);
    setRotation(0);
    setIsSlideshowRunning(false);
  };

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActivePhoto(filteredItems[nextIndex]);
    setZoomLevel(1);
    setRotation(0);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActivePhoto(filteredItems[prevIndex]);
    setZoomLevel(1);
    setRotation(0);
  };

  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i))
    );
    if (activePhoto && activePhoto.id === id) {
      setActivePhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activePhoto?.id === id) {
      setActivePhoto(null);
    }
  };

  return (
    <div id="v-gallery-app" className="w-full text-white selection:bg-purple-500/30">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#170E28] via-[#24133A] to-[#120B21] border border-purple-500/25 rounded-3xl p-5 sm:p-6 mb-6 shadow-[0_10px_35px_rgba(168,85,247,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-600 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#120921] rounded-[14px] flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Thư Viện Ảnh V-Gallery</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Ultra HD Media
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Kho ảnh danh thắng Việt Nam • Hậu trường đài truyền hình • Tự động lưu ảnh từ V-Camera
            </p>
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Tải Ảnh Lên</span>
          </button>
        </div>
      </div>

      {/* Album Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {['Tất cả', 'Camera', 'Danh Thắng', 'Hậu Trường', 'Nghệ Thuật', 'Tải Lên', 'Yêu thích'].map((album) => (
          <button
            key={album}
            onClick={() => setSelectedAlbum(album)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
              selectedAlbum === album
                ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                : 'bg-[#150D24] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {album === 'Camera' && '📸 '}
            {album === 'Danh Thắng' && '🏞️ '}
            {album === 'Hậu Trường' && '🎬 '}
            {album === 'Nghệ Thuật' && '🎨 '}
            {album === 'Yêu thích' && '❤️ '}
            <span>{album}</span>
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto hidden sm:inline">
          {filteredItems.length} hình ảnh
        </span>
      </div>

      {/* Gallery Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#130B21] border border-white/10 rounded-3xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Chưa có hình ảnh nào trong mục này</h3>
          <p className="text-xs text-slate-500 mt-1">
            Hãy chụp ảnh mới từ ứng dụng V-Camera hoặc bấm &quot;Tải Ảnh Lên&quot; từ thiết bị.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="group relative bg-[#130B21] border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-200 aspect-square flex flex-col justify-end"
            >
              <img
                src={item.url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Top Tags */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-purple-300 border border-purple-400/30">
                  {item.album}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                    item.isFavorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/50 text-white/70 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10 p-3">
                <h4 className="text-xs font-bold text-white truncate drop-shadow">{item.title}</h4>
                <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
                  <span>{item.date}</span>
                  {item.resolution && <span className="font-mono">{item.resolution}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX VIEWER */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  {activePhoto.album}
                </span>
                <span className="text-sm font-bold text-white truncate max-w-[280px] sm:max-w-md">
                  {activePhoto.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsSlideshowRunning((prev) => !prev)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSlideshowRunning
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/10 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Trình chiếu tự động"
                >
                  {isSlideshowRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isSlideshowRunning ? 'Dừng chiếu' : 'Slideshow'}</span>
                </button>

                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Xoay ảnh 90 độ"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleFavorite(activePhoto.id)}
                  className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer ${
                    activePhoto.isFavorite ? 'text-rose-400' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Thêm vào yêu thích"
                >
                  <Heart className={`w-4 h-4 ${activePhoto.isFavorite ? 'fill-rose-400' : ''}`} />
                </button>

                <a
                  href={activePhoto.url}
                  download={`${activePhoto.title}.jpg`}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Tải ảnh về máy"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleDeleteItem(activePhoto.id)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-rose-500 text-white transition-colors cursor-pointer ml-2"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Canvas with Next/Prev Controls */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all hover:scale-110 cursor-pointer"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                className="transition-transform duration-200 flex items-center justify-center max-h-[80vh] max-w-[90vw]"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="max-h-[78vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
                />
              </div>

              <button
                onClick={handleNextPhoto}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all hover:scale-110 cursor-pointer"
                title="Ảnh sau"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & EXIF info */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-3 max-w-2xl mx-auto w-full text-center z-10 text-xs">
              <p className="text-slate-300 leading-relaxed font-medium">
                {activePhoto.description || 'Hình ảnh lưu trữ chất lượng cao trong hệ sinh thái V-Play 360.'}
              </p>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-4 font-mono">
                <span>{activePhoto.date}</span>
                {activePhoto.resolution && (
                  <>
                    <span>•</span>
                    <span className="text-purple-300">{activePhoto.resolution}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
