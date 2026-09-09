import React, { useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OnAirSlider } from '../components/OnAirSlider';
import { ChannelCard } from '../components/ChannelCard';
import { NewsCard } from '../components/NewsCard';
import { CHANNELS_DATA } from '../data/channels';
import { NEWS_DATA } from '../data/news';
import { Channel, NewsArticle } from '../types';
import { Tv, Megaphone, Sparkles, Radio, ArrowRight, ShieldCheck, Cpu, Film, Layers } from 'lucide-react';
import { PortalsCircularSection } from '../components/PortalsCircularSection';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(channels.map((c) => c.category)))];

  const filteredChannels = selectedCategory === 'Tất cả'
    ? channels
    : channels.filter((c) => c.category === selectedCategory);

  const featuredArticle = NEWS_DATA[0];
  const otherArticles = NEWS_DATA.slice(1, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Big Full Page Hero Banner */}
      <HeroCarousel
        navigate={navigate}
        onSelectChannel={onSelectChannel}
      />

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* 2. Chuyên trang banner tròn */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1C1A24] via-[#181620] to-[#14131A] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#E6005A]" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Chuyên trang
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
          />
        </section>

        {/* 3. Copilot is coming to Vplay - Featured Banner Thumbnail */}
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

        {/* 3. Đang phát sóng (On Air Section) */}
        <OnAirSlider
          channels={channels}
          onSelectChannel={onSelectChannel}
          navigate={navigate}
        />

        {/* 3. Kênh truyền hình - Đề xuất cho bạn (Channels Grid) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Tv className="w-6 h-6 text-[#FF2020]" />
                <span>Đề xuất cho bạn</span>
              </h2>
              <p className="text-xs text-[#A1959C] mt-0.5">
                Các kênh truyền hình trực tuyến được tuyển chọn và đề xuất theo sở thích của bạn
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border-0 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#FF2020] to-[#E6005A] text-white shadow-md'
                      : 'bg-[#251821] text-[#A1959C] hover:text-white hover:bg-[#311F2B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Cards Grid - Compact and responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onSelect={(ch) => {
                  onSelectChannel(ch);
                  navigate(`/live-tv?channel=${ch.slug}`);
                }}
              />
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
