import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface TabSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  placeholder: string;
  setCustomPlaceholder: (placeholder: string | null) => void;
  currentRoute: string;
}

const TabSearchContext = createContext<TabSearchContextType | undefined>(undefined);

const ROUTE_PLACEHOLDERS: Record<string, string> = {
  '/': 'Tìm kiếm kênh & chuyên mục...',
  '/home': 'Tìm kiếm kênh & chuyên mục...',
  '/live-tv': 'Tìm kiếm kênh VTV, HTV, VTC...',
  '/news': 'Tìm kiếm bài viết, phóng sự...',
  '/v-shop': 'Tìm kiếm sản phẩm, thiết bị...',
  '/shop': 'Tìm kiếm sản phẩm, thiết bị...',
  '/v-flow': 'Tìm bài viết, tài khoản...',
  '/flow': 'Tìm bài viết, tài khoản...',
  '/music': 'Tìm bài hát, đài phát thanh...',
  '/settings': 'Tìm kiếm cài đặt...',
  '/about': 'Tìm thông tin phiên bản...',
  '/space-360': 'Tìm kiếm ứng dụng 360...',
  '/v-apps': 'Tìm kiếm ứng dụng 360...',
  '/v-games': 'Tìm kiếm trò chơi arcade...',
  '/v-arcade': 'Tìm kiếm trò chơi arcade...',
  '/v-files': 'Tìm tài liệu, tập tin...',
  '/v-books': 'Tìm kiếm sách, tài liệu...',
  '/favorites': 'Tìm trong mục yêu thích...',
  '/channels': 'Tìm kiếm danh sách kênh...',
  '/vertical': 'Tìm kênh dọc...',
  '/shorts': 'Tìm kênh dọc...',
};

interface TabSearchProviderProps {
  children: ReactNode;
  currentRoute: string;
}

export const TabSearchProvider: React.FC<TabSearchProviderProps> = ({ children, currentRoute }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customPlaceholder, setCustomPlaceholder] = useState<string | null>(null);

  // Clear search query whenever route changes so search belongs to each tab
  useEffect(() => {
    setSearchQuery('');
    setCustomPlaceholder(null);
  }, [currentRoute]);

  const placeholder = useMemo(() => {
    if (customPlaceholder) return customPlaceholder;
    
    // Exact or prefix match
    const cleanRoute = currentRoute.split('?')[0];
    if (ROUTE_PLACEHOLDERS[cleanRoute]) {
      return ROUTE_PLACEHOLDERS[cleanRoute];
    }

    return 'Search';
  }, [customPlaceholder, currentRoute]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <TabSearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        clearSearch,
        placeholder,
        setCustomPlaceholder,
        currentRoute,
      }}
    >
      {children}
    </TabSearchContext.Provider>
  );
};

export const useTabSearch = (): TabSearchContextType => {
  const context = useContext(TabSearchContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      searchQuery: '',
      setSearchQuery: () => {},
      clearSearch: () => {},
      placeholder: 'Search',
      setCustomPlaceholder: () => {},
      currentRoute: '/',
    };
  }
  return context;
};
