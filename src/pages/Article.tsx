import React, { useState } from 'react';
import { NEWS_DATA } from '../data/news';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { useFavorites } from '../hooks/useFavorites';
import { ArrowLeft, Clock, Calendar, Bookmark, Share2, CheckCircle2, User, Tag } from 'lucide-react';

interface ArticleProps {
  slug: string;
  navigate: (route: string) => void;
}

export const Article: React.FC<ArticleProps> = ({ slug, navigate }) => {
  const [copied, setCopied] = useState(false);
  const article = NEWS_DATA.find((a) => a.slug === slug) || NEWS_DATA[0];

  const { isNewsBookmarked, toggleBookmarkNews } = useFavorites();
  const bookmarked = isNewsBookmarked(article.slug);

  const relatedArticles = NEWS_DATA.filter((a) => a.id !== article.id).slice(0, 2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <button
        onClick={() => navigate('/news')}
        className="flex items-center gap-2 text-xs font-bold text-[#A1A1AA] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Chuyên san Tin tức</span>
      </button>

      {/* Category Pill */}
      <div className="flex items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-[#FF2020]/20 text-[#FF4D4D] border border-[#FF2020]/40 text-xs font-bold uppercase tracking-wider">
          {article.category}
        </span>
        <span className="text-xs text-[#8E8E93] flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {article.readingTime}
        </span>
      </div>

      {/* Main Title with Red -> Magenta gradient */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
        {article.title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#FF2020] to-[#E50914]">
        {article.subtitle}
      </p>

      {/* Author & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[24px] bg-[#1E1E22] border border-[#2D2D35]">
        <div className="flex items-center gap-3">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-11 h-11 rounded-full object-cover border border-[#E50914]"
          />
          <div>
            <div className="text-sm font-bold text-white">{article.author.name}</div>
            <div className="text-xs text-[#8E8E93]">{article.author.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmarkNews(article.slug)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
              bookmarked
                ? 'bg-[#E50914] border-[#E50914] text-white'
                : 'bg-[#26262C] border-[#383842] text-[#D1D5DB] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#26262C] hover:bg-[#32323A] border border-[#383842] text-xs font-semibold text-[#D1D5DB] hover:text-white transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép link' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative rounded-[30px] overflow-hidden bg-[#1E1E22] border border-[#2D2D35] aspect-video sm:aspect-[21/9] shadow-2xl">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="p-6 md:p-10 rounded-[30px] bg-[#1A1A1E] border border-[#2A2A32] shadow-xl text-[#D1D5DB] text-sm md:text-base leading-relaxed space-y-6">
        <p className="text-base md:text-lg font-semibold text-white leading-relaxed border-l-4 border-[#E50914] pl-4 italic">
          {article.excerpt}
        </p>

        {article.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        {/* Tags */}
        <div className="pt-6 border-t border-[#2A2A30] flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-[#E50914]" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[#24242A] text-xs text-[#A1A1AA] border border-[#34343E]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related News */}
      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-white">Bài viết liên quan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedArticles.map((rel) => (
            <NewsCard
              key={rel.id}
              article={rel}
              onClick={(a) => navigate(`/news/${a.slug}`)}
            />
          ))}
        </div>
      </div>
    </article>
  );
};
