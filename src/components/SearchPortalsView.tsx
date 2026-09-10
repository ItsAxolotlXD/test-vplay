import React, { useState, useMemo, useEffect } from 'react';
import {
  Newspaper,
  Landmark,
  Sparkles,
  Film,
  UtensilsCrossed,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Check,
  Tv,
  Play,
  Flame,
  ChevronRight,
  X
} from 'lucide-react';
import {
  PORTAL_CATEGORIES,
  PORTAL_ARTICLES,
  PortalCategory,
  PortalArticle
} from '../data/portalData';
import { Channel } from '../data/channels';
import { PortalsCircularSection } from './PortalsCircularSection';

interface SearchPortalsViewProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  navigate: (route: string, state?: any) => void;
  initialPortal?: string;
}

export const SearchPortalsView: React.FC<SearchPortalsViewProps> = ({
  channels,
  onSelectChannel,
  navigate,
  initialPortal
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialPortal || 'all');
  const [selectedArticle, setSelectedArticle] = useState<PortalArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [copiedToast, setCopiedToast] = useState(false);
  const [portalFilter, setPortalFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Sync with initialPortal prop if passed/changed from navigation
  useEffect(() => {
    if (initialPortal) {
      setActiveTab(initialPortal);
    }
  }, [initialPortal]);

  // Reset visibleCount on portal or filter change
  useEffect(() => {
    setVisibleCount(12);
  }, [activeTab, portalFilter]);

  // Icon mapping for each category
  const getPortalIcon = (id: string, className = 'w-6 h-6') => {
    switch (id) {
      case 'tin-tuc':
        return <Newspaper className={className} />;
      case 'chinh-tri':
        return <Landmark className={className} />;
      case 'van-hoa':
        return <Sparkles className={className} />;
      case 'giai-tri':
        return <Film className={className} />;
      case 'am-thuc':
        return <UtensilsCrossed className={className} />;
      case 'the-thao':
        return <Trophy className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const activeCategory = useMemo(() => {
    return PORTAL_CATEGORIES.find((cat) => cat.id === activeTab);
  }, [activeTab]);

  // Filtered articles
  const currentArticles = useMemo(() => {
    let list = activeTab === 'all'
      ? PORTAL_ARTICLES
      : PORTAL_ARTICLES.filter((item) => item.portalId === activeTab);

    if (portalFilter.trim()) {
      const q = portalFilter.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, portalFilter]);

  // Associated channels for active portal
  const relatedChannels = useMemo(() => {
    if (!activeCategory) return [];
    const keywords = activeCategory.channelKeywords;
    return channels.filter((ch) => {
      const target = (ch.name + ' ' + (ch.id || '') + ' ' + (ch.category || '')).toLowerCase();
      return keywords.some((kw) => target.includes(kw));
    }).slice(0, 5);
  }, [activeCategory, channels]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = (article: PortalArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-7 text-white select-none animate-in fade-in duration-300">
      {/* Category Pills Navigation Bar */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-6">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => {
              setActiveTab('all');
              setPortalFilter('');
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/30 scale-102'
                : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/15'
            }`}
          >
            Tất cả chuyên trang
          </button>

          {PORTAL_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                id={`portal-nav-tab-${cat.id}`}
                onClick={() => {
                  setActiveTab(cat.id);
                  setPortalFilter('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E6005A] text-white shadow-lg shadow-[#E6005A]/30 scale-102'
                    : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/15'
                }`}
              >
                {getPortalIcon(cat.id, 'w-3.5 h-3.5')}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERVIEW MODE: SHOW THE 6 CIRCULAR PORTALS (3 PER ROW) */}
      {activeTab === 'all' ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E6005A]" />
              <span>Chuyên trang đặc biệt</span>
            </h3>
          </div>

          {/* CIRCULAR PORTALS GRID: 3 PORTALS PER ROW */}
          <PortalsCircularSection
            onSelectPortal={(id) => {
              setActiveTab(id);
              setPortalFilter('');
            }}
            showSectionHeader={false}
          />

          {/* FEATURED ARTICLES FROM ALL PORTALS */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E6005A]" />
                <span>Tiêu điểm các chuyên trang</span>
              </h4>
              <span className="text-xs text-zinc-400">
                {PORTAL_ARTICLES.length} bài viết tổng hợp (100 bài / chuyên trang)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PORTAL_ARTICLES.slice(0, 6).map((article) => {
                const isBookmarked = bookmarkedIds.has(article.id);
                const category = PORTAL_CATEGORIES.find((c) => c.id === article.portalId);

                return (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="p-4 rounded-2xl bg-[#1A1922] hover:bg-[#23212D] border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 group-hover:bg-[#E6005A]/20 group-hover:text-[#FF6699] transition-colors">
                          {category?.title || article.tag}
                        </span>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </span>
                      </div>

                      <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF6699] transition-colors line-clamp-2 leading-snug mb-1.5">
                        {article.title}
                      </h5>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-zinc-400">
                      <span className="font-medium text-zinc-300">{article.source}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleBookmark(article.id, e)}
                          className="hover:text-amber-400 transition-colors cursor-pointer"
                          title="Lưu bài viết"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              isBookmarked ? 'text-amber-400 fill-amber-400' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => handleShare(article, e)}
                          className="hover:text-white transition-colors cursor-pointer"
                          title="Chia sẻ"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* INDIVIDUAL DEDICATED PORTAL TAB */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner - Enlarged and Borderless */}
          {activeCategory && (
            <div className={`relative overflow-hidden rounded-[32px] p-6 sm:p-10 md:p-12 bg-gradient-to-r ${activeCategory.accentGradient} shadow-2xl border-0`}>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5 sm:gap-7">
                  {/* Enlarged Borderless Portal Circular Avatar */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#16151D] shadow-2xl shrink-0 flex items-center justify-center">
                    <img
                      src={activeCategory.image}
                      alt={activeCategory.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${
                        activeCategory.image.includes('vtv_') ||
                        activeCategory.image.includes('.png') ||
                        activeCategory.image.includes('wikia.nocookie.net')
                          ? 'object-contain p-3 sm:p-5'
                          : 'object-cover'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-md inline-block">
                      {activeCategory.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {activeCategory.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">
                      Chuyên trang chính thức • 100 bài viết & bản tin tuyển chọn
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('all')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors cursor-pointer border-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Xem tất cả chuyên trang</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Related TV Channels for this Portal */}
          {relatedChannels.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-[#E6005A]" />
                  <span>Kênh truyền hình thuộc chuyên trang</span>
                </h4>
                <button
                  onClick={() => navigate('/channels')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Tất cả kênh</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {relatedChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onSelectChannel(ch)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1A1922] hover:bg-[#23212D] border-0 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border-0 group-hover:scale-105 transition-transform">
                      {ch.logo ? (
                        <img
                          src={ch.logo}
                          alt={ch.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Tv className="w-4 h-4 text-white/80" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#FF6699]">
                        {ch.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        Phát sóng trực tiếp
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In-portal search filter */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#E6005A]" />
              <span>Bài viết & Bản tin ({currentArticles.length} bài)</span>
            </h4>

            <div className="relative w-48 sm:w-64">
              <input
                type="text"
                value={portalFilter}
                onChange={(e) => setPortalFilter(e.target.value)}
                placeholder={`Tìm trong ${activeCategory?.title || 'chuyên trang'}...`}
                className="w-full bg-[#1A1922] border-0 focus:ring-1 focus:ring-[#E6005A] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              {portalFilter && (
                <button
                  onClick={() => setPortalFilter('')}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Articles list - 100 articles, pure text (no image), borderless */}
          <div className="space-y-3">
            {currentArticles.slice(0, visibleCount).map((article) => {
              const isBookmarked = bookmarkedIds.has(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="p-4 sm:p-5 rounded-2xl bg-[#1A1922] hover:bg-[#23212D] border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Article content (no image) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6005A]/20 text-[#FF6699]">
                        {article.tag}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.time}
                      </span>
                      {article.views && (
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FF6699] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Nguồn: {article.source}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleBookmark(article.id, e)}
                          className="hover:text-amber-400 transition-colors cursor-pointer"
                          title="Lưu"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isBookmarked ? 'text-amber-400 fill-amber-400' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => handleShare(article, e)}
                          className="hover:text-white transition-colors cursor-pointer"
                          title="Chia sẻ"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination / Load more for 100 articles */}
            {visibleCount < currentArticles.length && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="btn-load-more-portal-articles"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 12, currentArticles.length))}
                  className="px-6 py-2.5 rounded-full bg-[#E6005A] hover:bg-[#FF1E6B] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#E6005A]/25 transition-all cursor-pointer border-0"
                >
                  Xem thêm 12 bài viết ({Math.min(visibleCount, currentArticles.length)} / {currentArticles.length})
                </button>
                <button
                  id="btn-load-all-portal-articles"
                  onClick={() => setVisibleCount(currentArticles.length)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs sm:text-sm font-semibold transition-all cursor-pointer border-0"
                >
                  Xem tất cả {currentArticles.length} bài viết
                </button>
              </div>
            )}

            {currentArticles.length === 0 && (
              <div className="p-8 text-center bg-[#1A1922] rounded-2xl text-zinc-400 space-y-2 border-0">
                <p className="text-sm font-medium">
                  Không tìm thấy bài viết phù hợp với từ khóa &ldquo;{portalFilter}&rdquo;
                </p>
                <button
                  onClick={() => setPortalFilter('')}
                  className="text-xs text-[#FF6699] underline cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL (Border-free, Text-only) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#16151D] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-0 space-y-5">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border-0"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E6005A] text-white">
                {selectedArticle.tag}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.time}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">
                {selectedArticle.source}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {selectedArticle.title}
            </h2>

            <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#E6005A] text-sm text-zinc-300 font-medium leading-relaxed italic">
              {selectedArticle.summary}
            </div>

            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-zinc-400">
                Chuyên mục: {PORTAL_CATEGORIES.find((c) => c.id === selectedArticle.portalId)?.title}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium cursor-pointer border-0"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedIds.has(selectedArticle.id) ? 'text-amber-400 fill-amber-400' : ''
                    }`}
                  />
                  <span>
                    {bookmarkedIds.has(selectedArticle.id) ? 'Đã lưu' : 'Lưu bài'}
                  </span>
                </button>

                <button
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6005A] hover:brightness-110 text-white text-xs font-medium cursor-pointer border-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copied toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4" />
          <span>Đã sao chép liên kết vào bộ nhớ tạm!</span>
        </div>
      )}
    </div>
  );
};
