import React from 'react';
import { Clock, ArrowRight, Bookmark } from 'lucide-react';
import { NewsArticle } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface NewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  const { isNewsBookmarked, toggleBookmarkNews } = useFavorites();
  const bookmarked = isNewsBookmarked(article.slug);

  return (
    <div
      onClick={() => onClick(article)}
      className="group rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] hover:border-[#E50914]/60 hover:bg-[#25252C] transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.01]"
    >
      {/* Cover Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E22] via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
          {article.category}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmarkNews(article.slug);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
            bookmarked 
              ? 'bg-[#E50914] text-white border-[#E50914]' 
              : 'bg-black/60 text-[#A1A1AA] hover:text-white border-white/10'
          }`}
          title={bookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-[#8E8E93]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTime}</span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          <div className="flex items-center gap-1 text-[#E50914] font-semibold text-xs group-hover:translate-x-1 transition-transform">
            <span>Chi tiết</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
