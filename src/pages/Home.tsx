import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { BannerCardItem } from '../components/BannerCardItem';
import { OnAirSlider } from '../components/OnAirSlider';
import { NewsCard } from '../components/NewsCard';
import { CHANNELS_DATA } from '../data/channels';
import { NEWS_DATA } from '../data/news';
import { HERO_SLIDES } from '../data/heroSlides';
import { Channel, NewsArticle } from '../types';
import { Megaphone, Sparkles, Radio, ArrowRight, ShieldCheck, Cpu, Film, Layers, Search } from 'lucide-react';
import { PortalsCircularSection } from '../components/PortalsCircularSection';
import { useTabSearch } from '../context/TabSearchContext';
import { HomeSpotlightSearch } from '../components/HomeSpotlightSearch';

interface HomeProps {
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
}

export const Home: React.FC<HomeProps> = ({
  navigate,
  onSelectChannel,
  channels
}) => {
  const { searchQuery, clearSearch } = useTabSearch();
  const featuredArticle = NEWS_DATA[0];
  const otherArticles = NEWS_DATA.slice(1, 4);

  // 2 cái AD banner cho lên đầu khối ngang
  const horizontalBanners = [
    ...HERO_SLIDES.filter((s) => s.isAd),
    ...HERO_SLIDES.filter((s) => !s.isAd)
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Spotlight Search across the entire app when querying in Home tab */}
      {searchQuery.trim() ? (
        <HomeSpotlightSearch
          query={searchQuery}
          onClear={clearSearch}
          navigate={navigate}
          onSelectChannel={onSelectChannel}
          channels={channels}
        />
      ) : null}

      {/* 1. Banner Cards Carousel */}
      <HeroCarousel
        navigate={navigate}
        onSelectChannel={onSelectChannel}
      />

      {/* Aesthetic Welcome Tagline */}
      <div id="home-welcome-tagline" className="w-full flex items-center justify-center -mt-2 sm:-mt-1 mb-1 sm:mb-2 px-4 select-none">
        <p className="text-sm sm:text-base md:text-lg tracking-wide text-zinc-300/90 font-light">
          Welcome to{' '}
          <span className="font-['Playfair_Display',serif] italic font-medium text-[#FFA6D2] tracking-normal text-base sm:text-lg md:text-xl drop-shadow-[0_0_14px_rgba(255,166,210,0.45)]">
            the everything app.
          </span>
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* 2. Đề xuất cho bạn */}
        <OnAirSlider
          channels={channels}
          onSelectChannel={onSelectChannel}
          navigate={navigate}
          title="Đề xuất cho bạn"
        />

        {/* 3. Chuyên trang banner tròn - Dạng scroll ngang giống các ô kênh, bỏ nền */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#E6005A]" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Chuyên trang</span>
                <span className="text-xs sm:text-sm font-semibold text-[#8E8B99]">(Vuốt ngang để khám phá)</span>
              </h2>
            </div>

            <button
              id="btn-home-view-all-portals"
              onClick={() => navigate('/search')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#E6005A] hover:text-[#FF6699] transition-colors cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <PortalsCircularSection
            onSelectPortal={(portalId) => {
              navigate('/search', { portal: portalId });
            }}
            showSectionHeader={false}
            variant="scroll"
          />
        </section>

        {/* 4. Copilot is coming to Vplay - Featured Banner Thumbnail */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1A1A20] via-[#241C2B] to-[#1A1A20] border border-[#3E344A] p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#E6005A]/20 to-[#A800FF]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between">
            {/* Thumbnail Image */}
            <div className="relative w-full md:w-[320px] lg:w-[380px] h-[190px] sm:h-[220px] rounded-[20px] overflow-hidden shrink-0 border border-white/10 shadow-lg group">
              <img
                src="https://news.microsoft.com/source/emea/wp-content/uploads/2025/01/copilot-masthead.png"
                alt="Copilot is coming to Vplay"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
                  <img
                    src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                    alt="Copilot"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 object-contain"
                  />
                  <span>Microsoft Copilot</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6005A]/30 border border-[#E6005A]/50 text-[10px] font-mono font-bold text-[#FF6699]">
                  PREVIEW
                </span>
              </div>
            </div>

            {/* Banner Content */}
            <div className="flex-1 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6005A]/15 border border-[#E6005A]/30 text-xs font-semibold text-[#FF4D8B]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D8B]" />
                <span>AI COMPANION COLLABORATION</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Copilot is coming to Vplay
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
                Microsoft is collaborating with Vplay to bring Copilot - an everyday AI companion to your Vplay!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="btn-home-banner-ask-copilot"
                  onClick={() => navigate('/copilot')}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#E6005A] via-[#FF1E6B] to-[#D0008F] hover:from-[#FF1E6B] hover:to-[#E6005A] text-white text-sm font-bold shadow-[0_4px_20px_rgba(230,0,90,0.4)] hover:shadow-[0_6px_25px_rgba(230,0,90,0.6)] transition-all cursor-pointer group"
                >
                  <img
                    src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/microsoft-copilot.svg"
                    alt="Copilot"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 object-contain shrink-0 group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span>Ask Copilot</span>
                </button>

                <button
                  id="btn-home-banner-open-standalone"
                  onClick={() => navigate('/copilot-standalone')}
                  className="px-5 py-3 rounded-full bg-[#2A2A33] hover:bg-[#34343F] text-zinc-200 text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Giao diện độc lập
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category: khối ngang - cấp 2 */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            khối ngang - cấp 2
          </h2>

          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
            {horizontalBanners.map((banner) => (
              <div
                key={banner.id}
                className="w-[280px] sm:w-[340px] md:w-[380px] aspect-[16/9] shrink-0 select-none cursor-default"
              >
                <BannerCardItem slide={banner} />
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder Category 2: khối chứa khối 3 */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            khối chứa khối 3
          </h2>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 no-scrollbar scroll-smooth items-start">
            {[
              {
                id: 'circle-1',
                innerLines: ['Spotlight', 'khối chứ...'],
                label: 'Spotlight khối chứa khối',
              },
              {
                id: 'circle-2',
                innerLines: ['khối chứa', 'nd 2'],
                label: 'khối chứa nd 2',
              },
              {
                id: 'circle-3',
                innerLines: ['khối', 'banner'],
                label: 'khối banner',
              },
              {
                id: 'circle-4',
                innerLines: ['khối chứa', 'VOD'],
                label: 'khối chứa VOD',
              },
              {
                id: 'circle-5',
                innerLines: ['KHỐI', 'CHỨA...'],
                label: 'KHỐI CHỨA NHÓM KÊNH 2',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center cursor-pointer group shrink-0 w-32 sm:w-36"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#1b4698] via-[#163a82] to-[#10275c] border border-[#2753a7]/50 shadow-lg shadow-blue-950/30 flex flex-col items-center justify-center p-3 transition-all duration-200 group-hover:scale-105 group-hover:border-blue-400/60 group-hover:brightness-110">
                  {item.innerLines.map((line, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm font-bold text-white leading-tight"
                    >
                      {line}
                    </span>
                  ))}
                </div>
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white leading-snug max-w-[130px] group-hover:text-blue-200 transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Tin tức mới (Latest TV & Broadcast News) */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-[#FF2020]" />
                <span>Tin tức & Chuyên san Truyền hình</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Cập nhật xu hướng kỹ thuật, trường quay và nhận diện truyền hình Việt Nam
              </p>
            </div>

            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#E50914] hover:underline"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEWS_DATA.slice(0, 3).map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={(a) => navigate(`/news/${a.slug}`)}
              />
            ))}
          </div>
        </section>

        {/* 5. Chuyên mục nổi bật (Featured Broadcast Topics) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#E50914]" />
              <span>Chuyên mục nổi bật</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'safe-area' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E50914]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 text-[#E50914] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors">
                Quy chuẩn Safe Area
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Mô phỏng tiêu chuẩn vùng an toàn Action Safe 90% & Title Safe 80% theo chuẩn EBU/ITU.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'color-bars' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#FF2020]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF2020]/15 text-[#FF2020] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FF2020] transition-colors">
                SMPTE Color Bars
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Bảng màu chuẩn hiệu chuẩn màn hình và phát âm tham chiếu 1kHz âm thanh chuẩn đài.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'dvb-t2' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#00E5FF]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                Tần số DVB-T2
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Bảng tra cứu tần số kênh UHF/VHF số hóa truyền hình tại các tỉnh thành Việt Nam.
              </p>
            </div>

            {/* Card 4 */}
            <div 
              onClick={() => navigate('/about')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E50914]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 text-[#E50914] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors">
                Waves Community
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Không gian lưu trữ tư liệu, lịch sử hình hiệu idents và văn hóa truyền hình Việt Nam.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
