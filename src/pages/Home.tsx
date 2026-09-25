import React, { useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { BannerCardItem } from '../components/BannerCardItem';
import { OnAirSlider } from '../components/OnAirSlider';
import { CHANNELS_DATA } from '../data/channels';
import { HERO_SLIDES } from '../data/heroSlides';
import { Channel } from '../types';
import { Sparkles, Radio, ArrowRight, ShieldCheck, Cpu, Film, Layers, Search, X } from 'lucide-react';
import { PortalsCircularSection } from '../components/PortalsCircularSection';
import { VplayAppsHomeGrid } from '../components/VplayAppsHomeGrid';
import { useTabSearch } from '../context/TabSearchContext';
import { HomeSpotlightSearch } from '../components/HomeSpotlightSearch';
import { HomeCountdownWidget } from '../components/HomeCountdownWidget';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

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
  const { searchQuery, setSearchQuery, clearSearch } = useTabSearch();
  const { flags } = useFeatureFlags();
  const [localSearch, setLocalSearch] = useState('');

  const isMinimalism = Boolean(flags.minimalism_home_page || (flags as any).minimalism_home);

  const handleMinimalSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = localSearch.trim() || searchQuery.trim();
    if (query) {
      setSearchQuery(query);
    }
  };

  // 2 cái AD banner cho lên đầu khối ngang
  const horizontalBanners = [
    ...HERO_SLIDES.filter((s) => s.isAd),
    ...HERO_SLIDES.filter((s) => !s.isAd)
  ];

  // Feature Flag: Minimalism Home Page
  // Khi bật thì home page chỉ xuất hiện nguyên 1 thanh search đơn giản, ko xuất hiện gì thêm
  if (isMinimalism) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 select-none animate-in fade-in duration-300">
        {/* Spotlight Search Overlay when user actively enters query */}
        {searchQuery.trim() ? (
          <div className="w-full max-w-4xl">
            <HomeSpotlightSearch
              query={searchQuery}
              onClear={() => {
                clearSearch();
                setLocalSearch('');
              }}
              navigate={navigate}
              onSelectChannel={onSelectChannel}
              channels={channels}
            />
          </div>
        ) : (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
            {/* Single Centered Minimal Search Bar: Không xuất hiện gì thêm */}
            <form onSubmit={handleMinimalSearchSubmit} className="w-full">
              <div className="w-full h-14 sm:h-16 px-5 rounded-full bg-zinc-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl flex items-center gap-3.5 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 transition-all group">
                <Search className="w-6 h-6 text-zinc-400 group-focus-within:text-white shrink-0 transition-colors" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (localSearch.trim()) {
                        setSearchQuery(localSearch.trim());
                      }
                    }
                  }}
                  placeholder="Tìm kiếm..."
                  autoFocus
                  className="w-full bg-transparent text-white placeholder-zinc-500 text-base sm:text-lg font-medium focus:outline-none"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      clearSearch();
                    }}
                    className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!localSearch.trim()}
                  className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

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

      {/* Aesthetic Headline: Introducing Spatial Glass (Cam vàng - Đỏ magenta gradient) */}
      <div id="home-welcome-tagline" className="w-full flex flex-col items-center justify-center my-6 sm:my-8 px-4 text-center select-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight font-['Integer','Inter',sans-serif] leading-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1 drop-shadow-[0_0_24px_rgba(249,115,22,0.45)]">
          <span className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.4)]">
            Introducing
          </span>
          <span className="bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#E6007A] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(249,115,22,0.65)]">
            Spatial Glass
          </span>
        </h2>
      </div>

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Countdown to VNRT Online (00h00 16/10/2026) */}
        <HomeCountdownWidget navigate={navigate} />

        {/* 2. Đề xuất cho bạn */}
        <OnAirSlider
          channels={channels}
          onSelectChannel={onSelectChannel}
          navigate={navigate}
          title="Đề xuất cho bạn"
        />

        {/* 3. VNRT Online Apps (Grid 4 apps/dòng phong cách visionOS / iOS) */}
        <VplayAppsHomeGrid navigate={navigate} />

        {/* 4. Chuyên trang banner tròn - Dạng scroll ngang giống các ô kênh, bỏ nền */}
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

        {/* 4. Copilot is coming to VNRT Online - Featured Banner Thumbnail */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1A1A20] via-[#241C2B] to-[#1A1A20] border border-[#3E344A] p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#E6005A]/20 to-[#A800FF]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between">
            {/* Thumbnail Image */}
            <div className="relative w-full md:w-[320px] lg:w-[380px] h-[190px] sm:h-[220px] rounded-[20px] overflow-hidden shrink-0 border border-white/10 shadow-lg group">
              <img
                src="https://news.microsoft.com/source/emea/wp-content/uploads/2025/01/copilot-masthead.png"
                alt="Copilot is coming to VNRT Online"
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
                Copilot is coming to VNRT Online
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
                Microsoft is collaborating with VNRT Online to bring Copilot - an everyday AI companion to your VNRT Online!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="btn-home-banner-ask-copilot"
                  onClick={() => navigate('/copilot')}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-[30px] bg-gradient-to-r from-[#E6005A] via-[#FF1E6B] to-[#D0008F] hover:from-[#FF1E6B] hover:to-[#E6005A] text-white text-sm font-bold shadow-[0_4px_20px_rgba(230,0,90,0.4)] hover:shadow-[0_6px_25px_rgba(230,0,90,0.6)] transition-all cursor-pointer group"
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
                  className="px-5 py-3 rounded-[30px] bg-[#2A2A33] hover:bg-[#34343F] text-zinc-200 text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
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
