import { useState, useEffect } from 'react';

const FAVORITES_CHANNELS_KEY = 'waves_favorite_channels';
const BOOKMARKED_NEWS_KEY = 'waves_bookmarked_news';

export function useFavorites() {
  const [favoriteChannelIds, setFavoriteChannelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_CHANNELS_KEY);
      return saved ? JSON.parse(saved) : ['vtv1-hd', 'vtv3-hd', 'vtv4-hd'];
    } catch {
      return ['vtv1-hd', 'vtv3-hd', 'vtv4-hd'];
    }
  });

  const [bookmarkedNewsSlugs, setBookmarkedNewsSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKED_NEWS_KEY);
      return saved ? JSON.parse(saved) : ['vietnam-today-chuyen-doi-so-quoc-te'];
    } catch {
      return ['vietnam-today-chuyen-doi-so-quoc-te'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_CHANNELS_KEY, JSON.stringify(favoriteChannelIds));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favoriteChannelIds]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKED_NEWS_KEY, JSON.stringify(bookmarkedNewsSlugs));
    } catch (e) {
      console.warn('Could not save bookmarks to localStorage', e);
    }
  }, [bookmarkedNewsSlugs]);

  const toggleFavoriteChannel = (channelId: string) => {
    setFavoriteChannelIds((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  const isChannelFavorite = (channelId: string) => {
    return favoriteChannelIds.includes(channelId);
  };

  const toggleBookmarkNews = (slug: string) => {
    setBookmarkedNewsSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isNewsBookmarked = (slug: string) => {
    return bookmarkedNewsSlugs.includes(slug);
  };

  const clearAllFavorites = () => {
    setFavoriteChannelIds([]);
    setBookmarkedNewsSlugs([]);
    try {
      localStorage.removeItem(FAVORITES_CHANNELS_KEY);
      localStorage.removeItem(BOOKMARKED_NEWS_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return {
    favoriteChannelIds,
    bookmarkedNewsSlugs,
    toggleFavoriteChannel,
    isChannelFavorite,
    toggleBookmarkNews,
    isNewsBookmarked,
    clearAllFavorites
  };
}
