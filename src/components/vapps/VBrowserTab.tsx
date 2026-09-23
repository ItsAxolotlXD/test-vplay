import React, { useState, useEffect } from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Plus,
  X,
  Search,
  Lock,
  ExternalLink,
  Bookmark,
  Share2,
  Newspaper,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Tv,
  Check
} from 'lucide-react';

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading?: boolean;
}

interface WebArticle {
  id: string;
  title: string;
  category: string;
  source: string;
  time: string;
  snippet: string;
  image: string;
  url: string;
}

const DEFAULT_BOOKMARKS = [
  { name: 'VTV Tin Tức', url: 'https://vtv.vn', icon: '📺', category: 'Truyền hình' },
  { name: 'VnExpress', url: 'https://vnexpress.net', icon: '📰', category: 'Tin tức' },
  { name: 'Wikipedia Tiếng Việt', url: 'https://vi.wikipedia.org', icon: '📚', category: 'Kiến thức' },
  { name: 'Dân Trí', url: 'https://dantri.com.vn', icon: '⚡', category: 'Tin tức' },
  { name: 'VTV Go Trực Tuyến', url: 'https://vtvgo.vn', icon: '🔴', category: 'Truyền hình' },
  { name: 'Zing MP3', url: 'https://zingmp3.vn', icon: '🎵', category: 'Âm nhạc' },
  { name: 'Cổng VNRT Online 360', url: 'https://vnrt.online', icon: '✨', category: 'Hệ sinh thái' },
];

const CURATED_NEWS: WebArticle[] = [
  {
    id: 'art-1',
    title: 'Khánh thành Trung tâm Truyền thông Đa phương tiện V-Play Studio 360 Hiện Đại Nhất',
    category: 'Công nghệ & Truyền hình',
    source: 'VTV Công Nghệ',
    time: '30 phút trước',
    snippet: 'Khu phức hợp công nghệ truyền hình thế hệ mới áp dụng giải pháp tương tác 360 độ và xử lý hình ảnh 4K Ultra HD đã chính thức đi vào hoạt động phục vụ khán giả cả nước.',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80',
    url: 'https://vtv.vn/cong-nghe/trung-tam-studio-360',
  },
  {
    id: 'art-2',
    title: 'Đội Tuyển Bóng Đá Việt Nam Tăng Tốc Chuẩn Bị Cho Vòng Chung Kết Châu Á',
    category: 'Thể thao',
    source: 'Báo Thể Thao 247',
    time: '2 giờ trước',
    snippet: 'HLV trưởng cùng ban huấn luyện đã công bố danh sách tập trung chính thức với sự kết hợp hài hòa giữa các trụ cột dày dặn kinh nghiệm và dàn tài năng trẻ triển vọng.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    url: 'https://vnexpress.net/the-thao/bong-da-viet-nam',
  },
  {
    id: 'art-3',
    title: 'Xu Hướng AI & Trí Tuệ Nhân Tạo Tạo Sinh Định Hình Lại Nền Kinh Tế Số 2026',
    category: 'Khoa học & Đổi mới',
    source: 'Tạp chí Tin Học & Đời Sống',
    time: '4 giờ trước',
    snippet: 'Các mô hình ngôn ngữ lớn và trợ lý ảo thông minh đang thúc đẩy năng suất lao động vượt bậc trong ngành lập trình, giáo dục và công nghệ giải trí tương tác.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    url: 'https://dantri.com.vn/suc-manh-so/ai-ky-nguyen-moi',
  },
  {
    id: 'art-4',
    title: 'Di Sản Văn Hóa & Du Lịch Ẩm Thực 3 Miền Thu Hút Hàng Triệu Khách Quốc Tế',
    category: 'Văn hóa & Khám phá',
    source: 'Khám Phá Việt Nam',
    time: 'Hôm nay',
    snippet: 'Vịnh Hạ Long, Phố cổ Hội An cùng nền ẩm thực phở, bún chả và cà phê sữa đá tiếp tục lọt top những trải nghiệm không thể bỏ lỡ của du khách toàn cầu.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
    url: 'https://vietnamtourism.gov.vn/di-san-van-hoa',
  },
];

export const VBrowserTab: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'tab-1', title: 'VNRT Online Portal - Trang Chủ', url: 'https://vnrt.online', favicon: '🌐' },
    { id: 'tab-2', title: 'Wikipedia Tiếng Việt', url: 'https://vi.wikipedia.org', favicon: '📚' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [inputUrl, setInputUrl] = useState<string>('https://vnrt.online');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [readingArticle, setReadingArticle] = useState<WebArticle | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [bookmarkedUrls, setBookmarkedUrls] = useState<string[]>([
    'https://vtv.vn',
    'https://vnexpress.net',
  ]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (currentTab) {
      setInputUrl(currentTab.url);
    }
  }, [activeTabId]);

  const handleNavigate = (targetUrl: string, title?: string) => {
    setIsLoading(true);
    let finalUrl = targetUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = `https://${finalUrl}`;
      } else {
        finalUrl = `https://vi.wikipedia.org/w/index.php?search=${encodeURIComponent(finalUrl)}`;
      }
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: finalUrl, title: title || finalUrl.replace(/^https?:\/\//, '') }
          : t
      )
    );
    setInputUrl(finalUrl);
    setReadingArticle(null);

    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const handleAddNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: 'Tab Mới',
      url: 'https://vnrt.online',
      favicon: '✨',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setInputUrl('https://vnrt.online');
    setReadingArticle(null);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  const handleToggleBookmark = (url: string) => {
    setBookmarkedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const isCurrentBookmarked = bookmarkedUrls.includes(currentTab?.url || '');

  return (
    <div id="v-browser-app" className="w-full text-white">
      {/* 1. Header Banner - V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Browser • Trình Duyệt Web
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Web Portal 360
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Duyệt web đa tab • Tin tức tổng hợp • Kho tri thức Wikipedia & Truyền hình trực tuyến
            </p>
          </div>
        </div>
      </div>

      {/* 2. Browser Window Frame */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl overflow-hidden shadow-xl">
        {/* Tabs Bar */}
        <div className="bg-[#18171E] border-b border-[#2D2D38] px-3 pt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setReadingArticle(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-medium max-w-[200px] cursor-pointer transition-all border-t border-x ${
                  isActive
                    ? 'bg-[#1F1E24] border-[#2D2D38] text-white shadow-sm font-semibold'
                    : 'bg-transparent border-transparent text-[#9CA3AF] hover:text-white hover:bg-[#2A2933]'
                }`}
              >
                <span>{tab.favicon || '🌐'}</span>
                <span className="truncate">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className="p-0.5 rounded-full hover:bg-white/20 text-[#9CA3AF] hover:text-white ml-auto"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddNewTab}
            className="p-1.5 rounded-lg hover:bg-[#2A2933] text-[#9CA3AF] hover:text-white transition-colors cursor-pointer ml-1"
            title="Mở tab mới"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation & Address Bar */}
        <div className="bg-[#1F1E24] border-b border-[#2D2D38] p-2.5 sm:p-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNavigate('https://vnrt.online')}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavigate(inputUrl)}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
              title="Làm mới"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => handleNavigate('https://vnrt.online', 'VNRT Online Portal')}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
              title="Về trang chủ VNRT Online"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* URL Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate(inputUrl);
            }}
            className="flex-1 flex items-center bg-[#18171E] border border-[#2D2D38] focus-within:border-amber-500 rounded-xl px-3 py-1.5 text-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Nhập địa chỉ web (URL) hoặc từ khóa tìm kiếm..."
              className="w-full bg-transparent text-white placeholder-[#9CA3AF] focus:outline-none font-mono"
            />
            {isLoading && <span className="text-[10px] text-amber-400 font-mono animate-pulse">Đang tải...</span>}
          </form>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleBookmark(currentTab.url)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isCurrentBookmarked ? 'text-amber-400' : 'text-[#9CA3AF] hover:text-white'
              }`}
              title="Lưu dấu trang"
            >
              <Star className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <a
              href={currentTab.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
              title="Mở sang tab trình duyệt máy tính"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Bookmarks Strip */}
        <div className="bg-[#18171E] px-4 py-2 border-b border-[#2D2D38] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {DEFAULT_BOOKMARKS.map((bm) => (
            <button
              key={bm.name}
              onClick={() => handleNavigate(bm.url, bm.name)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2A2933] hover:bg-amber-500/20 text-[#9CA3AF] hover:text-white border border-[#3E3D4D] transition-all cursor-pointer shrink-0"
            >
              <span>{bm.icon}</span>
              <span className="truncate max-w-[120px]">{bm.name}</span>
            </button>
          ))}
        </div>

        {/* Browser Content Area */}
        <div className="p-4 sm:p-6 min-h-[520px] bg-[#141318]">
          {/* Article Detail View if open */}
          {readingArticle ? (
            <div className="max-w-3xl mx-auto bg-[#131A2B] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setReadingArticle(null)}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 mb-4 cursor-pointer font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại trang duyệt web</span>
              </button>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {readingArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {readingArticle.title}
              </h2>
              <div className="text-xs text-slate-400 mt-2 mb-6 flex items-center gap-3">
                <span className="font-bold text-slate-200">{readingArticle.source}</span>
                <span>•</span>
                <span>{readingArticle.time}</span>
              </div>

              <img
                src={readingArticle.image}
                alt={readingArticle.title}
                className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-6 shadow-md"
              />

              <div className="prose prose-invert text-slate-200 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-base text-sky-200">{readingArticle.snippet}</p>
                <p>
                  Theo đại diện ban tổ chức, chương trình đã thu hút sự tham gia tích cực từ đông đảo khán thính giả truyền hình trên cả nước. Việc đổi mới mô hình trải nghiệm nội dung số đa nền tảng không chỉ mở rộng không gian văn hóa mà còn đưa công nghệ phục vụ đời sống một cách gần gũi, tiện ích và sinh động nhất.
                </p>
                <p>
                  Trong thời gian tới, hệ sinh thái V-Play 360 sẽ tiếp tục bổ sung thêm các dịch vụ số tân tiến, giúp người dùng dễ dàng theo dõi các chương trình giải trí, học tập và tra cứu thông tin chỉ bằng một cú nhấp chuột.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href={readingArticle.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <span>Xem bài gốc trên nguồn tin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div>
              {/* If user navigates to wikipedia or external search */}
              {currentTab.url.includes('wikipedia.org') ? (
                <div className="w-full bg-[#111624] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">📚</div>
                      <div>
                        <h3 className="text-base font-bold text-white">Wikipedia Tiếng Việt</h3>
                        <p className="text-xs text-slate-400">Bách khoa toàn thư mở toàn cầu</p>
                      </div>
                    </div>
                    <a
                      href={currentTab.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-sky-300 font-bold flex items-center gap-1.5"
                    >
                      <span>Mở Wikipedia ngoài tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[
                      { title: 'Việt Nam', desc: 'Quốc gia độc lập nằm ở cực đông bán đảo Đông Dương thuộc khu vực Đông Nam Á.' },
                      { title: 'Đài Truyền hình Việt Nam', desc: 'Đài truyền hình quốc gia trực thuộc Chính phủ nước Cộng hòa xã hội chủ nghĩa Việt Nam.' },
                      { title: 'Lịch sử Internet tại Việt Nam', desc: 'Việt Nam chính thức kết nối mạng Internet toàn cầu vào ngày 19 tháng 11 năm 1997.' },
                      { title: 'Văn hóa truyền thông hiện đại', desc: 'Sự phát triển mạnh mẽ của truyền thông số, truyền hình tương tác và mạng xã hội.' },
                    ].map((wiki) => (
                      <div
                        key={wiki.title}
                        onClick={() => handleNavigate(`https://vi.wikipedia.org/wiki/${encodeURIComponent(wiki.title)}`, wiki.title)}
                        className="p-4 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/5 hover:border-sky-500/30 transition-all cursor-pointer"
                      >
                        <h4 className="text-sm font-bold text-sky-300 mb-1">{wiki.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{wiki.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Default VNRT Online Web Portal */
                <div className="space-y-6">
                  {/* Search Hero */}
                  <div className="bg-gradient-to-r from-sky-950/60 via-indigo-950/50 to-slate-900 border border-sky-500/25 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Cổng Thông Tin & Trình Duyệt Web</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                      Tra cứu thông tin, điểm báo điện tử 24/7 và kết nối kho kiến thức bách khoa mở
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchFilter.trim()) {
                          handleNavigate(searchFilter);
                        }
                      }}
                      className="mt-5 relative max-w-lg mx-auto"
                    >
                      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Tìm kiếm tin tức, Google, hoặc nhập URL..."
                        className="w-full bg-[#090D17] border border-white/20 focus:border-sky-400 rounded-2xl pl-11 pr-24 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Tìm kiếm
                      </button>
                    </form>
                  </div>

                  {/* Curated Feed Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-sky-400" />
                        <span>Điểm Tin Nổi Bật Trong Ngày</span>
                      </h3>
                      <span className="text-xs text-slate-400">Cập nhật liên tục</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {CURATED_NEWS.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => setReadingArticle(art)}
                          className="bg-[#121A2A] hover:bg-[#182338] border border-white/10 hover:border-sky-500/40 rounded-2xl overflow-hidden transition-all duration-200 group cursor-pointer flex flex-col justify-between shadow-lg"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={art.image}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-black/60 backdrop-blur-md text-sky-300 border border-sky-400/30">
                              {art.category}
                            </span>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-sky-300 line-clamp-2 leading-snug">
                                {art.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                {art.snippet}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-semibold text-slate-300">{art.source}</span>
                              <span>{art.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
