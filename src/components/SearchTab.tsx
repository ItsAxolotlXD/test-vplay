import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Mic,
  Tv,
  Gamepad2,
  Crown,
  Megaphone,
  Sliders,
  Sparkles,
  Play,
  Star,
  Layers,
  ArrowRight,
  Compass,
  Check,
  Clock,
  Trash2,
  Tag,
  Radio,
  FileText,
  Settings,
  HardDrive,
  Building2,
  BadgeCheck,
  Folder,
  Swords,
  Coins,
  Flame,
  Volume2,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Cloud,
  LayoutGrid,
  Zap,
  Box
} from 'lucide-react';
import { Channel } from '../data/channels';
import { NEWS_LIST } from './NewsView';
import { playPopSound } from '../utils/sound';
import { useSettings } from '../hooks/useSettings';
import { useFavorites } from '../hooks/useFavorites';

interface SearchTabProps {
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
}

type SearchCategoryFilter = 
  | 'all' 
  | 'channels' 
  | 'apps' 
  | 'bet' 
  | 'premium' 
  | 'news' 
  | 'settings' 
  | 'toolbox';

const RECENT_SEARCHES_KEY = 'vplay_search_tab_recents';

export const SearchTab: React.FC<SearchTabProps> = ({
  navigate,
  onSelectChannel,
  channels
}) => {
  const { settings } = useSettings();
  const { favoriteChannelIds, toggleFavoriteChannel, isChannelFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SearchCategoryFilter>('all');
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['VTV1 HD', 'Bầu Cua Tôm Cá', 'V-Arcade', 'Pro Cloud 200GB', 'Explore Vietnam'];
  });

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== text);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  const triggerToastMsg = (msg: string) => {
    setVoiceToast(msg);
    setTimeout(() => setVoiceToast(null), 3000);
  };

  // Voice Search Handler
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      triggerToastMsg('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      triggerToastMsg('Đang lắng nghe... Hãy nói từ khóa');

      recognition.start();

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setQuery(speechResult);
        saveRecentSearch(speechResult);
        setIsListening(false);
        triggerToastMsg(`Đã nhận: "${speechResult}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        triggerToastMsg('Lỗi nhận diện giọng nói');
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
      triggerToastMsg('Không thể kích hoạt micro');
    }
  };

  // Static App Dataset
  const appsList = useMemo(() => [
    {
      id: 'v_arcade',
      name: 'V-Arcade Minigames',
      tagline: '5 Trò Chơi Ore UI Siêu Cuốn (Caro, Rắn săn mồi, Nối từ)',
      category: 'Trò chơi (Arcade)',
      route: '/v-space',
      appId: 'v_arcade',
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
      tags: ['Caro XO', 'Rắn Săn Mồi', 'Nối Từ', 'Oẳn Tù Tì'],
    },
    {
      id: 'v_xplore',
      name: 'V-Files Explorer',
      tagline: 'Trình Quản Lý Tệp, Danh Sách Phát M3U8 & V-Cloud',
      category: 'Tiện ích & Tệp tin',
      route: '/v-space',
      appId: 'v_xplore',
      icon: <Folder className="w-5 h-5 text-purple-400" />,
      tags: ['File Manager', 'M3U8 Playlists', 'Cloud Backup'],
    },
    {
      id: 'explore_vietnam',
      name: 'Explore Vietnam 360',
      tagline: 'Bản Đồ Du Lịch 63 Tỉnh Thành & Đặc Sản Văn Hóa',
      category: 'Học tập & Văn hóa',
      route: '/v-space',
      appId: 'explore_vietnam',
      icon: <Compass className="w-5 h-5 text-rose-400" />,
      tags: ['63 Tỉnh Thành', 'Ẩm Thực', 'Du Lịch'],
    },
    {
      id: 'v_box',
      name: 'V-Box Media Player',
      tagline: 'Kho Video & Truyền Hình Chọn Lọc',
      category: 'Giải trí & Media',
      route: '/v-space',
      appId: 'v_box',
      icon: <Tv className="w-5 h-5 text-amber-400" />,
      tags: ['Video Clip', 'Phát Lại', 'Giải Trí'],
    },
    {
      id: 'v_learn',
      name: 'V-Study Pomodoro',
      tagline: 'Học Tập Sâu, Bộ Thẻ Flashcard & Mục Tiêu',
      category: 'Học tập & Văn hóa',
      route: '/v-space',
      appId: 'v_learn',
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      tags: ['Pomodoro', 'Flashcards', 'Tập Trung'],
    },
    {
      id: 'v_calc',
      name: 'V-Calc Express',
      tagline: 'Máy Tính Biểu Thức Khoa Học Đa Năng',
      category: 'Tiện ích & Tệp tin',
      route: '/v-space',
      appId: 'v_calc',
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      tags: ['Khoa Học', 'Biểu Thức', 'Quy Đổi'],
    },
    {
      id: 'v_minecraft',
      name: 'Minecraft Container GUI',
      tagline: 'Mô Phỏng Kho Đồ & Rương Minecraft Pixel Art Chuẩn Sandbox',
      category: 'Tiện ích & Tệp tin',
      route: '/minecraft',
      appId: 'v_minecraft',
      icon: <Box className="w-5 h-5 text-emerald-400" />,
      tags: ['Minecraft Chest', 'Container GUI', 'Pixel Art', 'Rương Đồ', 'Kho Đồ', 'Inventory'],
    },
  ], []);

  // Casino Minigames Dataset
  const betGamesList = useMemo(() => [
    {
      id: 'baucua',
      title: 'Bầu Cua Tôm Cá 3D',
      category: 'Dân gian Việt Nam',
      multiplier: 'x1 đến x3',
      excerpt: 'Cược 6 linh vật truyền thống Bầu, Cua, Tôm, Cá, Gà, Nai với tỷ lệ thưởng x3.',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'latxu',
      title: 'Lật Xu Sấp Ngửa 3D',
      category: 'Xác suất 50/50',
      multiplier: 'x1.98',
      excerpt: 'Dự đoán mặt Sấp hoặc Ngửa đồng xu vàng nguyên chất với tốc độ 5 giây.',
      icon: <Coins className="w-5 h-5 text-yellow-300" />,
    },
    {
      id: 'danhbai',
      title: 'Bài Cào 3 Cây PvP',
      category: 'Game bài đối kháng',
      multiplier: 'Thắng trọn ván',
      excerpt: 'Đếm nút 1-9 hoặc so sánh Ba Tây, Liêng, Sáp để phân định thắng thua.',
      icon: <Swords className="w-5 h-5 text-rose-400" />,
    },
    {
      id: 'xucxac',
      title: 'Xúc Xắc Tài Xỉu (Sicbo)',
      category: 'Xúc xắc High-Roller',
      multiplier: 'x1.98 đến x30',
      excerpt: 'Tổng 3 viên xúc xắc: Tài (11-17) hoặc Xỉu (4-10). Nổ Bão x30 cược.',
      icon: <Flame className="w-5 h-5 text-purple-400" />,
    },
  ], []);

  // Premium & Cloud Plans Dataset
  const premiumList = useMemo(() => [
    {
      id: 'vbank',
      title: 'V-Bank & Ví Quặng Ore',
      category: 'Tài chính & Ví Ore',
      price: 'Miễn phí kích hoạt',
      excerpt: 'Nạp quặng Ore, chuyển điểm và giao dịch nội bộ hệ sinh thái Waves.',
      subTab: 'vbank' as const,
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'pro_200gb',
      title: 'Gói Pro Cloud 200 GB (Khuyên Dùng)',
      category: 'V-Cloud Storage',
      price: '69.000đ / tháng',
      excerpt: '200 GB bộ nhớ NVMe SSD siêu tốc, lưu trữ playlist M3U8 và tặng 500 Ore.',
      subTab: 'storage' as const,
      icon: <Cloud className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'diamond_2tb',
      title: 'Gói Diamond VIP 2 TB (Ultimate)',
      category: 'V-Cloud Storage',
      price: '225.000đ / tháng',
      excerpt: '2.000 GB dung lượng đám mây, tặng kèm Tích Xanh Waves Verified vĩnh viễn.',
      subTab: 'storage' as const,
      icon: <Crown className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'verified',
      title: 'Waves Verified (Tích Xanh Chính Chủ)',
      category: 'Xác minh & Huy hiệu',
      price: 'Đặc quyền VIP',
      excerpt: 'Huy hiệu Tích Xanh chính chủ, bảo vệ tên người dùng và ưu tiên phát sóng.',
      subTab: 'verified' as const,
      icon: <BadgeCheck className="w-5 h-5 text-sky-400" />,
    },
  ], []);

  // Settings Shortcuts Dataset
  const settingsList = useMemo(() => [
    {
      id: 'theme',
      title: 'Chủ đề Giao diện (Sáng / Tối)',
      category: 'Cài đặt hệ thống',
      description: 'Chuyển đổi giữa chế độ nền tối Dark Luxury và nền sáng Light Mode',
      route: '/settings',
      icon: <Settings className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: 'sidebar',
      title: 'Thanh điều hướng Sidebar / Dock',
      category: 'Cài đặt bố cục',
      description: 'Tùy chọn ghim menu sang cạnh trái hoặc dùng thanh Dock nổi bên dưới',
      route: '/settings',
      icon: <LayoutGrid className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'copilot',
      title: 'Hợp nhất Spotlight với Copilot',
      category: 'Cài đặt tìm kiếm',
      description: 'Tùy chọn mở Copilot AI Assistant hoặc Search Tab khi nhấn phím tìm kiếm',
      route: '/settings',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
  ], []);

  // Filtered Data Calculation
  const q = query.trim().toLowerCase();

  const filteredChannels = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'channels') return [];
    if (!q) return channels.slice(0, 12);
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.shortName && c.shortName.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.channelNumber && c.channelNumber.toString().includes(q))
    );
  }, [channels, q, selectedFilter]);

  const filteredApps = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'apps') return [];
    if (!q) return appsList;
    return appsList.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [appsList, q, selectedFilter]);

  const filteredBetGames = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'bet') return [];
    if (!q) return betGamesList;
    return betGamesList.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q)
    );
  }, [betGamesList, q, selectedFilter]);

  const filteredPremium = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'premium') return [];
    if (!q) return premiumList;
    return premiumList.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [premiumList, q, selectedFilter]);

  const filteredNews = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'news') return [];
    if (!q) return NEWS_LIST.slice(0, 4);
    return NEWS_LIST.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
        (n.formattedArticle?.lead && n.formattedArticle.lead.toLowerCase().includes(q))
    );
  }, [q, selectedFilter]);

  const filteredSettings = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'settings') return [];
    if (!q) return settingsList;
    return settingsList.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [settingsList, q, selectedFilter]);

  const totalResultsCount =
    filteredChannels.length +
    filteredApps.length +
    filteredBetGames.length +
    filteredPremium.length +
    filteredNews.length +
    filteredSettings.length;

  const categories: { id: SearchCategoryFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'channels', label: 'Kênh Truyền Hình', count: filteredChannels.length },
    { id: 'apps', label: 'Space 360 & Trò Chơi', count: filteredApps.length },
    { id: 'bet', label: 'Sàn Cược Orbs', count: filteredBetGames.length },
    { id: 'premium', label: 'V-Cloud & Premium', count: filteredPremium.length },
    { id: 'news', label: 'Tin Tức', count: filteredNews.length },
    { id: 'settings', label: 'Cài Đặt Hệ Thống', count: filteredSettings.length },
  ];

  const handleSelectChannel = (channel: Channel) => {
    playPopSound();
    saveRecentSearch(channel.name);
    onSelectChannel(channel);
    navigate(`/live-tv?channel=${channel.slug}`);
  };

  const handleQuickKeyword = (kw: string) => {
    playPopSound();
    setQuery(kw);
    saveRecentSearch(kw);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-8 pb-20 text-left select-none animate-in fade-in duration-300">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>SPOTLIGHT SEARCH TAB • TRUNG TÂM TÌM KIẾM TOÀN TRANG</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tìm Kiếm Toàn Diện Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Tra cứu hơn 70+ kênh truyền hình HD/4K, ứng dụng Space 360, trò chơi Sàn Cược Orbs, gói lưu trữ V-Cloud và lối tắt cài đặt nhanh.
          </p>
        </div>

        {/* Action button: Search settings */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 rounded-full bg-[#1E1E22] hover:bg-[#2A2A32] border border-[#34343E] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cài đặt tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* 2. HERO SEARCH CAPSULE BOX */}
      <div className="p-6 sm:p-8 rounded-[30px] bg-[#1A1A22] border border-[#2D2D35] shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Main Input Box */}
          <div className="relative flex items-center w-full rounded-full spotlight-bubble-box search-box-capsule transition-all p-2 border-0 shadow-lg">
            <div className="pl-4 pr-3 text-zinc-400">
              <Search className="w-6 h-6 text-cyan-400" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  saveRecentSearch(query);
                }
              }}
              placeholder="Nhập tên kênh (VTV1, HBO), ứng dụng (Caro, V-Files), cược (Bầu cua), hoặc cài đặt..."
              className="w-full py-3 bg-transparent text-sm sm:text-base text-white placeholder-[#71717A] focus:outline-none font-medium truncate"
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer mr-1"
                title="Xóa nội dung tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              className={`p-3 rounded-full transition-all cursor-pointer flex items-center justify-center mr-1 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white'
              }`}
              title="Tìm kiếm bằng giọng nói"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Toast Message */}
          {voiceToast && (
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{voiceToast}</span>
            </div>
          )}

          {/* Recent Searches Row */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gần đây:</span>
              </div>

              {recentSearches.map((rec) => (
                <div
                  key={rec}
                  onClick={() => handleQuickKeyword(rec)}
                  className="group px-3 py-1 rounded-xl bg-[#22222C] hover:bg-cyan-950/60 border border-[#343440] hover:border-cyan-500/40 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{rec}</span>
                  <button
                    onClick={(e) => removeRecentSearch(rec, e)}
                    className="opacity-60 hover:opacity-100 hover:text-rose-400 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={clearAllRecents}
                className="text-[11px] text-zinc-500 hover:text-rose-400 transition-colors ml-auto cursor-pointer"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playPopSound();
                setSelectedFilter(cat.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-purple-active text-white shadow-md glow-purple-sm font-bold'
                  : 'bg-[#1E1E22] text-[#A1A1AA] hover:text-white border border-[#32323A]'
              }`}
            >
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#2A2A32] text-zinc-400'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. RESULTS COUNT SUMMARY BAR */}
      <div className="flex items-center justify-between px-2 text-xs text-[#9CA3AF]">
        <div className="flex items-center gap-2">
          <span>Tìm thấy</span>
          <span className="font-mono font-bold text-cyan-300 text-sm">{totalResultsCount}</span>
          <span>kết quả {query ? `cho từ khóa "${query}"` : 'trong toàn bộ hệ sinh thái'}</span>
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Đặt lại tìm kiếm
          </button>
        )}
      </div>

      {/* 5. SEARCH RESULTS MAIN BODY */}
      {totalResultsCount === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-[30px] bg-[#1E1E22] border border-[#2D2D35] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Search className="w-8 h-8 opacity-70" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Không tìm thấy kết quả phù hợp</h3>
            <p className="text-xs text-[#9CA3AF] max-w-md mt-1 leading-relaxed">
              Hãy thử từ khóa ngắn hơn, kiểm tra lỗi chính tả hoặc chọn tab bộ lọc khác như "Kênh Truyền Hình" hay "Space 360".
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center pt-2">
            {['VTV1', 'Caro XO', 'Bầu Cua', 'Pro Cloud', 'Thời sự'].map((suggest) => (
              <button
                key={suggest}
                onClick={() => handleQuickKeyword(suggest)}
                className="px-3.5 py-1.5 rounded-full bg-[#282830] hover:bg-[#343440] text-cyan-300 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                {suggest}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTION 5.1: KÊNH TRUYỀN HÌNH */}
          {filteredChannels.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Kênh Truyền Hình Live TV</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredChannels.length} kênh khả dụng
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/live-tv')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Mở Sảnh Live TV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel)}
                    className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] hover:border-cyan-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Channel Number / Logo avatar */}
                      <div className="w-11 h-11 rounded-2xl bg-[#14141A] border border-[#32323E] flex items-center justify-center text-cyan-300 font-mono font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                        {channel.channelNumber ? `#${channel.channelNumber}` : <Tv className="w-5 h-5 text-cyan-400" />}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {channel.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-400 truncate">
                            {channel.category || 'Tổng Hợp'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            HD
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectChannel(channel);
                      }}
                      className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform"
                      title="Phát kênh ngay"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5.2: SPACE 360 & MINI-APPS */}
          {filteredApps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Space 360 & Kho Ứng Dụng Mini</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredApps.length} mini-app
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v-space')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Xem Toàn Bộ Space 360</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      playPopSound();
                      saveRecentSearch(app.name);
                      navigate(app.route, { appId: app.appId });
                    }}
                    className="p-5 rounded-[24px] bg-[#1E1E22] border border-[#2D2D35] hover:border-emerald-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex flex-col justify-between shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#141A17] border border-emerald-500/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          {app.icon}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                          {app.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                        {app.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-emerald-300 font-bold">
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-normal">
                        <span>#{app.tags[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Khởi Chạy</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5.3: SÀN CƯỢC ORBS CASINO */}
          {filteredBetGames.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Sàn Cược Orbs VIP</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredBetGames.length} sảnh cá cược Provably Fair
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/bet-arena')}
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Mở Sàn Cược Đấu Trường</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredBetGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => {
                      playPopSound();
                      saveRecentSearch(game.title);
                      navigate('/bet-arena');
                    }}
                    className="p-5 rounded-[24px] bg-[#1E1E22] border border-[#2D2D35] hover:border-purple-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex flex-col justify-between shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#1C1726] border border-purple-500/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          {game.icon}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                          {game.multiplier}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                        {game.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-purple-300 font-bold">
                      <span className="text-[10px] text-amber-400 font-mono">100% Orbs</span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Vào Cược</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5.4: V-PREMIUM & V-CLOUD */}
          {filteredPremium.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-300">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Waves Premium & Gói V-Cloud</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredPremium.length} gói dịch vụ
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/v-premium')}
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Mở Sảnh V-Premium</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPremium.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      playPopSound();
                      saveRecentSearch(plan.title);
                      navigate('/v-premium', { subTab: plan.subTab });
                    }}
                    className="p-5 rounded-[24px] bg-[#1E1E22] border border-[#2D2D35] hover:border-sky-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex flex-col justify-between shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#141A22] border border-sky-500/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          {plan.icon}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase">
                          {plan.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                        {plan.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-sky-300 font-bold">
                      <span className="text-[11px] text-amber-300 font-mono">{plan.price}</span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Chi Tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5.5: TIN TỨC & BÁO CHÍ */}
          {filteredNews.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-950/70 border border-rose-500/40 flex items-center justify-center text-rose-300">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Tin Tức & Thông Báo</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredNews.length} bài viết
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/news')}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Xem Trang Tin Tức</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => {
                      playPopSound();
                      saveRecentSearch(article.title);
                      navigate(`/news/${article.id}`);
                    }}
                    className="p-5 rounded-[24px] bg-[#1E1E22] border border-[#2D2D35] hover:border-rose-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex flex-col justify-between shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">
                          Bản Tin Vplay
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">{article.date}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-1.5 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A2A30] flex items-center justify-between text-xs text-rose-300 font-bold">
                      <span className="text-zinc-400 font-normal">Ban Biên Tập Vplay</span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Đọc Bản Tin</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5.6: CÀI ĐẶT HỆ THỐNG */}
          {filteredSettings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Lối Tắt Cài Đặt Hệ Thống</h2>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {filteredSettings.length} tùy chỉnh nhanh
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Mở Trang Cài Đặt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredSettings.map((set) => (
                  <div
                    key={set.id}
                    onClick={() => {
                      playPopSound();
                      saveRecentSearch(set.title);
                      navigate(set.route);
                    }}
                    className="p-4 rounded-[22px] bg-[#1E1E22] border border-[#2D2D35] hover:border-indigo-500/60 hover:bg-[#25252C] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-[#181824] border border-indigo-500/30 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                        {set.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {set.title}
                        </h4>
                        <span className="text-[11px] text-zinc-400 truncate block">
                          {set.description}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
