import React, { useState, useMemo } from 'react';
import { Channel } from '../types';
import { NEWS_DATA } from '../data/news';
import { VAPPS_LIST, VAppDefinition } from './VAppsView';
import { V_SHOP_PRODUCTS, VShopProduct } from '../data/vShopData';
import { TV_MUSIC_TRACKS, TvMusicTrack } from '../data/tvMusicData';
import { playPopSound } from '../utils/sound';
import {
  Search,
  Sparkles,
  Tv,
  Film,
  Globe,
  ShoppingBag,
  Music,
  Settings,
  ArrowRight,
  X,
  ExternalLink,
  Layers,
  Radio,
  Sliders,
  Flag,
  Share2,
  Clock,
  Compass
} from 'lucide-react';

interface HomeSpotlightSearchProps {
  query: string;
  onClear: () => void;
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
}

// Route resolver for Space 360 apps
const getSpace360Route = (appId: string) => {
  switch (appId) {
    case 'v_arcade': return '/v-arcade';
    case 'v_xplore': return '/v-files';
    case 'explore_vietnam': return '/explore-vietnam';
    case 'v_maps': return '/v-maps';
    case 'v_box': return '/v-box';
    case 'v_learn': return '/v-study';
    case 'v_calc': return '/v-calc';
    case 'v_clock': return '/v-clock';
    case 'v_phone': return '/v-phone';
    case 'v_browser': return '/v-browser';
    case 'v_calendar': return '/v-calendar';
    case 'v_gallery': return '/v-gallery';
    case 'v_camera': return '/v-camera';
    case 'v_ticket': return '/v-ticket';
    case 'v_weather': return '/v-weather';
    case 'v_reminders': return '/v-reminders';
    case 'v_notes': return '/v-notes';
    case 'v_minecraft': return '/minecraft';
    case 'v_flow': return '/v-flow';
    case 'v_chat': return '/chat';
    case 'v_stock': return '/v-stock';
    case 'v_health': return '/v-health';
    case 'cookbook': return '/cookbook';
    default: return '/v-space';
  }
};

const SYSTEM_LINKS = [
  { id: 'nav-settings', name: 'Cài đặt hệ thống', route: '/settings', desc: 'Tùy chỉnh giao diện, thanh điều hướng, cỡ chữ, trợ năng', category: 'Cài đặt', icon: Settings },
  { id: 'nav-feature-flags', name: 'Cờ tính năng (Feature Flags)', route: '/feature-flags', desc: 'Trung tâm thử nghiệm tính năng VNRT Online Experimental Labs', category: 'Cài đặt', icon: Flag },
  { id: 'nav-v-flow', name: 'V-Flow', route: '/v-flow', desc: 'Mạng xã hội tin tức & chia sẻ khoảnh khắc', category: 'Khám phá', icon: Share2 },
  { id: 'nav-space-360', name: 'Space 360', route: '/space-360', desc: 'Kho ứng dụng hệ điều hành 360 độ & tiện ích', category: 'Khám phá', icon: Layers },
  { id: 'nav-v-shop', name: 'V-Shop', route: '/v-shop', desc: 'Cửa hàng chính hãng quà tặng, công nghệ & đặc sản', category: 'Mua sắm', icon: ShoppingBag },
  { id: 'nav-music', name: 'Nhạc hiệu truyền hình', route: '/music', desc: 'Kho lưu trữ nhạc hiệu VTV, HTV, VTC qua các thời kỳ', category: 'Âm nhạc', icon: Music },
  { id: 'nav-news', name: 'Bản tin & Tin tức', route: '/news', desc: 'Cập nhật tin thời sự, thể thao, văn hóa và phóng sự', category: 'Tin tức', icon: Globe },
  { id: 'nav-channels', name: 'Truyền hình trực tuyến', route: '/live-tv', desc: 'Xem truyền hình trực tiếp các kênh phát sóng HD', category: 'Truyền hình', icon: Tv },
];

const normalizeText = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();

type SpotlightCategoryFilter = 'all' | 'channels' | 'apps' | 'news' | 'shop' | 'music' | 'system';

export const HomeSpotlightSearch: React.FC<HomeSpotlightSearchProps> = ({
  query,
  onClear,
  navigate,
  onSelectChannel,
  channels
}) => {
  const [activeCategory, setActiveCategory] = useState<SpotlightCategoryFilter>('all');

  const normalizedQ = useMemo(() => normalizeText(query), [query]);

  // Match channels
  const matchedChannels = useMemo(() => {
    if (!normalizedQ) return [];
    return channels.filter((c) => {
      const nameNorm = normalizeText(c.name);
      const catNorm = normalizeText(c.category);
      const descNorm = normalizeText(c.description || '');
      return (
        nameNorm.includes(normalizedQ) ||
        catNorm.includes(normalizedQ) ||
        descNorm.includes(normalizedQ)
      );
    });
  }, [channels, normalizedQ]);

  // Match Space 360 apps
  const matchedApps = useMemo(() => {
    if (!normalizedQ) return [];
    return VAPPS_LIST.filter((app) => {
      const nameNorm = normalizeText(app.name);
      const taglineNorm = normalizeText(app.tagline);
      const descNorm = normalizeText(app.description);
      const tagsNorm = app.tags.map(normalizeText).join(' ');
      return (
        nameNorm.includes(normalizedQ) ||
        taglineNorm.includes(normalizedQ) ||
        descNorm.includes(normalizedQ) ||
        tagsNorm.includes(normalizedQ)
      );
    });
  }, [normalizedQ]);

  // Match News
  const matchedNews = useMemo(() => {
    if (!normalizedQ) return [];
    return NEWS_DATA.filter((n) => {
      const titleNorm = normalizeText(n.title);
      const excerptNorm = normalizeText(n.excerpt || '');
      const catNorm = normalizeText(n.category);
      return (
        titleNorm.includes(normalizedQ) ||
        excerptNorm.includes(normalizedQ) ||
        catNorm.includes(normalizedQ)
      );
    });
  }, [normalizedQ]);

  // Match V-Shop
  const matchedShop = useMemo(() => {
    if (!normalizedQ) return [];
    return V_SHOP_PRODUCTS.filter((p) => {
      const nameNorm = normalizeText(p.name);
      const descNorm = normalizeText(p.description);
      const catNorm = normalizeText(p.category);
      return (
        nameNorm.includes(normalizedQ) ||
        descNorm.includes(normalizedQ) ||
        catNorm.includes(normalizedQ)
      );
    });
  }, [normalizedQ]);

  // Match Music
  const matchedMusic = useMemo(() => {
    if (!normalizedQ) return [];
    return TV_MUSIC_TRACKS.filter((m) => {
      const titleNorm = normalizeText(m.title);
      const chNorm = normalizeText(m.channel);
      const descNorm = normalizeText(m.description);
      const eraNorm = normalizeText(m.era);
      return (
        titleNorm.includes(normalizedQ) ||
        chNorm.includes(normalizedQ) ||
        descNorm.includes(normalizedQ) ||
        eraNorm.includes(normalizedQ)
      );
    });
  }, [normalizedQ]);

  // Match System
  const matchedSystem = useMemo(() => {
    if (!normalizedQ) return [];
    return SYSTEM_LINKS.filter((s) => {
      const nameNorm = normalizeText(s.name);
      const descNorm = normalizeText(s.desc);
      const catNorm = normalizeText(s.category);
      return (
        nameNorm.includes(normalizedQ) ||
        descNorm.includes(normalizedQ) ||
        catNorm.includes(normalizedQ)
      );
    });
  }, [normalizedQ]);

  const totalResults =
    matchedChannels.length +
    matchedApps.length +
    matchedNews.length +
    matchedShop.length +
    matchedMusic.length +
    matchedSystem.length;

  return (
    <div id="home-spotlight-search-results" className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pt-2 pb-6 space-y-5">
      {/* Spotlight Header Box */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-[#1a1920]/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-[#B80710] flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Spotlight Search</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-xs text-zinc-400">{totalResults} kết quả</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Tìm kiếm toàn bộ app cho &quot;<span className="text-red-400">{query}</span>&quot;
              </h2>
            </div>
          </div>

          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Đóng tìm kiếm</span>
          </button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/10 text-zinc-300 hover:bg-white/15'
            }`}
          >
            Tất cả ({totalResults})
          </button>
          {matchedChannels.length > 0 && (
            <button
              onClick={() => setActiveCategory('channels')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'channels'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              Truyền hình ({matchedChannels.length})
            </button>
          )}
          {matchedApps.length > 0 && (
            <button
              onClick={() => setActiveCategory('apps')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'apps'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              Ứng dụng 360 ({matchedApps.length})
            </button>
          )}
          {matchedNews.length > 0 && (
            <button
              onClick={() => setActiveCategory('news')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'news'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              Tin tức ({matchedNews.length})
            </button>
          )}
          {matchedShop.length > 0 && (
            <button
              onClick={() => setActiveCategory('shop')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'shop'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              V-Shop ({matchedShop.length})
            </button>
          )}
          {matchedMusic.length > 0 && (
            <button
              onClick={() => setActiveCategory('music')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'music'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              Âm nhạc ({matchedMusic.length})
            </button>
          )}
          {matchedSystem.length > 0 && (
            <button
              onClick={() => setActiveCategory('system')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'system'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
            >
              Cài đặt & Lối tắt ({matchedSystem.length})
            </button>
          )}
        </div>

        {/* Zero Results State */}
        {totalResults === 0 && (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Không tìm thấy kết quả Spotlight nào
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Không tìm thấy mục nào trên toàn bộ VNRT Online khớp với &quot;{query}&quot;. Thử tìm kiếm theo tên kênh, game, tiện ích, tin tức hoặc cài đặt.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {['VTV3', 'Games', 'Maps', 'Thời tiết', 'Cài đặt', 'Nhạc hiệu'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    playPopSound();
                    const input = document.getElementById('floating-tab-search-bar')?.querySelector('input');
                    if (input) {
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                      nativeInputValueSetter?.call(input, kw);
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. Kênh truyền hình Section */}
        {(activeCategory === 'all' || activeCategory === 'channels') && matchedChannels.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-500" />
                <span>Kênh truyền hình ({matchedChannels.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {matchedChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    playPopSound();
                    onSelectChannel(ch);
                    navigate(`/live-tv?channel=${ch.slug}`);
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 hover:border-white/25 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left group shadow-sm"
                >
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">{ch.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{ch.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Ứng dụng Space 360 Section */}
        {(activeCategory === 'all' || activeCategory === 'apps') && matchedApps.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Ứng dụng Space 360 ({matchedApps.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      playPopSound();
                      navigate(getSpace360Route(app.id));
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className={`w-11 h-11 rounded-xl ${app.gradientBg} flex items-center justify-center text-white shrink-0 shadow-md`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {app.name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 uppercase">
                          {app.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{app.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Tin tức & Phóng sự Section */}
        {(activeCategory === 'all' || activeCategory === 'news') && matchedNews.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Tin tức & Phóng sự ({matchedNews.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    playPopSound();
                    navigate(`/news/${item.slug}`);
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex gap-3 group"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-semibold text-white line-clamp-2 mt-0.5 group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                      <span>{item.publishedAt}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. V-Shop Products Section */}
        {(activeCategory === 'all' || activeCategory === 'shop') && matchedShop.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>V-Shop ({matchedShop.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matchedShop.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    playPopSound();
                    navigate('/v-shop');
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full aspect-video rounded-xl object-cover mb-2"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{prod.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-xs font-bold text-amber-400">{prod.priceFormatted}</span>
                    <span className="text-[9px] font-bold text-zinc-400">{prod.priceOrbs} ORBS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Music Tracks Section */}
        {(activeCategory === 'all' || activeCategory === 'music') && matchedMusic.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-pink-400" />
                <span>Nhạc hiệu & Nhạc truyền hình ({matchedMusic.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedMusic.map((trk) => (
                <div
                  key={trk.id}
                  onClick={() => {
                    playPopSound();
                    navigate('/music');
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-pink-400 uppercase tracking-wide">
                      {trk.channel} • {trk.era}
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate mt-0.5 group-hover:text-pink-300 transition-colors">
                      {trk.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate">{trk.categoryLabel}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. System & Settings Section */}
        {(activeCategory === 'all' || activeCategory === 'system') && matchedSystem.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Cài đặt & Tiện ích hệ thống ({matchedSystem.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedSystem.map((sys) => {
                const SysIcon = sys.icon;
                return (
                  <div
                    key={sys.id}
                    onClick={() => {
                      playPopSound();
                      navigate(sys.route);
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <SysIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {sys.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{sys.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
