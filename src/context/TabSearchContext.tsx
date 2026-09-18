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
  // Primary core tabs requested
  '/': 'Search Home',
  '/home': 'Search Home',
  '/live-tv': 'Search TV channels',
  '/channels': 'Search TV channels',
  '/news': 'Search news articles',
  '/v-shop': 'Search products',
  '/shop': 'Search products',
  '/vshop': 'Search products',
  '/music': 'Search music and tracks',
  '/v-music': 'Search music and tracks',
  '/audio': 'Search music and tracks',
  '/settings': 'Search settings and features',

  // Specific tabs with clear English names
  '/cookbook': 'Search Cookbook',
  '/v-cookbook': 'Search Cookbook',
  '/minecraft': 'Search Minecraft',
  '/mc-container': 'Search Minecraft',
  '/minecraft-container': 'Search Minecraft',
  '/minecraft-gui': 'Search Minecraft',
  '/space-360': 'Search Space 360',
  '/v-space': 'Search Space 360',
  '/v-apps': 'Search Space 360',
  '/v-arcade': 'Search Arcade',
  '/v-games': 'Search Games',
  '/v-files': 'Search Files',
  '/v-xplore': 'Search Files',
  '/explore-vietnam': 'Search Explore Vietnam',
  '/v-maps': 'Search Maps',
  '/maps': 'Search Maps',
  '/space-360-maps': 'Search Maps',
  '/v-box': 'Search Box',
  '/v-study': 'Search Study',
  '/v-learn': 'Search Study',
  '/v-calc': 'Search Calc',
  '/v-clock': 'Search Clock',
  '/clock': 'Search Clock',
  '/v-phone': 'Search Phone',
  '/phone': 'Search Phone',
  '/v-browser': 'Search Browser',
  '/browser': 'Search Browser',
  '/v-calendar': 'Search Calendar',
  '/calendar': 'Search Calendar',
  '/v-gallery': 'Search Gallery',
  '/gallery': 'Search Gallery',
  '/v-camera': 'Search Camera',
  '/camera': 'Search Camera',
  '/v-ticket': 'Search Ticket',
  '/ticket': 'Search Ticket',
  '/v-weather': 'Search Weather',
  '/weather': 'Search Weather',
  '/v-reminders': 'Search Reminders',
  '/v-notes': 'Search Notes',
  '/v-furniture': 'Search Furniture',
  '/v-stock': 'Search Stock',
  '/stock': 'Search Stock',
  '/v-health': 'Search Health',
  '/health': 'Search Health',
  '/v-flow': 'Search V-Flow',
  '/vflow': 'Search V-Flow',
  '/flow': 'Search V-Flow',
  '/chat': 'Search Chat',
  '/chat-room': 'Search Chat',
  '/favorites': 'Search Favorites',
  '/friends': 'Search Friends',
  '/people': 'Search Friends',
  '/loyalty': 'Search Loyalty',
  '/arena': 'Search Arena',
  '/toolbox': 'Search Toolbox',
  '/about': 'Search About',
  '/feature-flags': 'Search Feature Flags',
  '/flags': 'Search Feature Flags',
  '/vertical': 'Search Vertical TV',
  '/shorts': 'Search Vertical TV',
};

const getDynamicTabPlaceholder = (route: string): string => {
  const clean = route.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
  if (!clean) return 'Search Home';

  const formatted = clean
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return `Search ${formatted || 'Tab'}`;
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
    const cleanRoute = currentRoute.split('?')[0].replace(/\/$/, '') || '/';
    if (ROUTE_PLACEHOLDERS[cleanRoute]) {
      return ROUTE_PLACEHOLDERS[cleanRoute];
    }

    return getDynamicTabPlaceholder(cleanRoute);
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
