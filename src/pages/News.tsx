import React, { useState } from 'react';
import { NEWS_DATA } from '../data/news';
import { NewsCard } from '../components/NewsCard';
import { NewsArticle } from '../types';
import { Newspaper, Search, Filter, Sparkles, TrendingUp } from 'lucide-react';

interface NewsProps {
  navigate: (route: string) => void;
}

export const News: React.FC<NewsProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Tất cả',
    'Thời sự truyền hình',
    'Công nghệ phát sóng',
    'Hậu trường & Kỹ thuật',
    'Đồ hoạ & Nhận diện'
  ];

  const filteredNews = NEWS_DATA.filter((article) => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = NEWS_DATA[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FF2020] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Chuyên san Kỹ thuật & Báo chí</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tin tức & Sự kiện Truyền hình
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Cập nhật toàn diện các thông tin về công nghệ phát thanh truyền hình, đồ họa nhận diện và văn hóa truyền thông Việt Nam.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 search-box-capsule rounded-full transition-all">
          <div className="flex items-center px-3 py-1.5 w-full">
            <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full bg-transparent text-xs text-white placeholder-[#8E8E93] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Featured Big Article Header Card */}
      {featured && selectedCategory === 'Tất cả' && !searchQuery && (
        <div
          onClick={() => navigate(`/news/${featured.slug}`)}
          className="relative rounded-[30px] overflow-hidden bg-[#1E1E22] border border-[#2D2D35] hover:border-[#E50914]/60 cursor-pointer group shadow-2xl transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
            {/* Image */}
            <div className="md:col-span-7 relative h-64 md:h-full overflow-hidden">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#1E1E22]/30 to-[#1E1E22]" />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2020] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                <TrendingUp className="w-3 h-3" />
                <span>Tiêu điểm</span>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E50914]">
                  {featured.category}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2 group-hover:text-[#E50914] transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-xs md:text-sm text-[#9CA3AF] mt-3 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2A2A30] flex items-center justify-between text-xs text-[#8E8E93]">
                <div className="flex items-center gap-2">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-white font-medium">{featured.author.name}</span>
                </div>
                <span>{featured.readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm'
                : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#32323A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onClick={(a) => navigate(`/news/${a.slug}`)}
          />
        ))}
      </div>
    </div>
  );
};
