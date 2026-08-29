import React, { useState, useEffect } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { ChannelCard } from '../components/ChannelCard';
import { Channel, ProgramScheduleItem } from '../types';
import { SCHEDULE_DATA } from '../data/channels';
import { useFavorites } from '../hooks/useFavorites';
import { 
  Tv, 
  Search, 
  Clock, 
  Calendar, 
  Radio, 
  Satellite, 
  Info, 
  Sparkles, 
  ExternalLink,
  Heart,
  Share2,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface LiveTVProps {
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
  onOpenCustomStreamModal: () => void;
}

export const LiveTV: React.FC<LiveTVProps> = ({
  currentChannel,
  onSelectChannel,
  channels,
  onOpenCustomStreamModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();
  const isFav = isChannelFavorite(currentChannel.id);

  const categories = ['Tất cả', ...Array.from(new Set(channels.map((c) => c.category)))];

  const filteredChannels = channels.filter((c) => {
    const matchesCategory = selectedCategory === 'Tất cả' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const schedules: ProgramScheduleItem[] = SCHEDULE_DATA[currentChannel.id] || [
    {
      id: 'default-1',
      channelId: currentChannel.id,
      startTime: currentChannel.currentProgram?.startTime || '20:00',
      endTime: currentChannel.currentProgram?.endTime || '21:00',
      title: currentChannel.currentProgram?.title || 'Chương trình phát sóng trực tiếp',
      category: 'Thời sự / Giải trí',
      description: currentChannel.currentProgram?.description || 'Phát sóng trực tiếp theo khung giờ đài.',
      isLive: true
    },
    {
      id: 'default-2',
      channelId: currentChannel.id,
      startTime: currentChannel.nextProgram?.startTime || '21:00',
      endTime: '22:00',
      title: currentChannel.nextProgram?.title || 'Bản tin tiếp theo',
      category: 'Tổng hợp',
      description: 'Chương trình kế tiếp trong ngày.'
    }
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Channel Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#C83DFF] font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Phát sóng trực tiếp HLS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{currentChannel.name}</span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FF2020] text-white rounded-full">
              {currentChannel.quality}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Add custom M3U8 */}
          <button
            onClick={onOpenCustomStreamModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#26262C] hover:bg-[#32323A] border border-[#383842] text-xs font-bold text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Nhập M3U8</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#26262C] hover:bg-[#32323A] border border-[#383842] text-xs font-semibold text-[#D1D5DB] hover:text-white transition-colors"
            title="Sao chép liên kết kênh"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>

          {/* Favorite */}
          <button
            onClick={() => toggleFavoriteChannel(currentChannel.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-colors ${
              isFav 
                ? 'bg-[#E50914] border-[#E50914] text-white' 
                : 'bg-[#26262C] border-[#383842] text-[#D1D5DB] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Đã thích' : 'Yêu thích'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid on Desktop */}
      <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
        {/* Left Column: Player + Program Info + Specs + Schedule */}
        <div className={isTheaterMode ? 'w-full space-y-6' : 'lg:col-span-8 space-y-6'}>
          {/* Video Player */}
          <VideoPlayer
            channel={currentChannel}
            onOpenCustomStreamModal={onOpenCustomStreamModal}
            isTheaterMode={isTheaterMode}
            onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
          />

          {/* Current Program Details Card */}
          <div className="p-6 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E50914]">
                  Chương trình đang phát sóng
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  {currentChannel.currentProgram?.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mt-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>{currentChannel.currentProgram?.startTime} - {currentChannel.currentProgram?.endTime}</span>
                  <span>•</span>
                  <span className="text-white font-medium">{currentChannel.category}</span>
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#D1D5DB] mt-4 leading-relaxed">
              {currentChannel.currentProgram?.description || currentChannel.description}
            </p>

            {/* Tags */}
            {currentChannel.tags && currentChannel.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2A2A30]">
                {currentChannel.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#26262C] text-[#C5C5CE] text-[11px] font-medium border border-[#34343E]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specs & Broadcast Parameters */}
          <div className="p-6 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Satellite className="w-4 h-4 text-[#00E5FF]" />
              <span>Thông số Kỹ thuật & Hạ tầng Tiếp sóng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#171719] border border-[#2C2C32]">
                <span className="text-[#8E8E93] block text-[10px] uppercase font-bold">Độ phân giải luồng</span>
                <span className="text-white font-semibold font-mono mt-0.5 block">{currentChannel.resolution || '1080p50 Full HD'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#171719] border border-[#2C2C32]">
                <span className="text-[#8E8E93] block text-[10px] uppercase font-bold">Băng thông Bitrate</span>
                <span className="text-white font-semibold font-mono mt-0.5 block">{currentChannel.bitrate || '8.5 Mbps H.264'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#171719] border border-[#2C2C32]">
                <span className="text-[#8E8E93] block text-[10px] uppercase font-bold">Tần số Số mặt đất DVB-T2</span>
                <span className="text-white font-semibold font-mono mt-0.5 block">{currentChannel.dvbT2Channel || 'Kênh 25 UHF (506 MHz)'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#171719] border border-[#2C2C32] sm:col-span-2">
                <span className="text-[#8E8E93] block text-[10px] uppercase font-bold">Vệ tinh VINASAT</span>
                <span className="text-white font-semibold font-mono mt-0.5 block">{currentChannel.satelliteFrequency || 'VINASAT-1 (132.0°E) - 11090 H 28800'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#171719] border border-[#2C2C32]">
                <span className="text-[#8E8E93] block text-[10px] uppercase font-bold">Cổng thông tin</span>
                {currentChannel.officialWebsite ? (
                  <a
                    href={currentChannel.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E50914] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                  >
                    <span>Truy cập web đài</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#A1A1AA]">Đài truyền hình</span>
                )}
              </div>
            </div>
          </div>

          {/* EPG Schedule Timeline for this channel */}
          <div className="p-6 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FFD600]" />
                <span>Lịch phát sóng hôm nay (EPG)</span>
              </h3>
              <span className="text-xs text-[#8E8E93]">Giờ Việt Nam (UTC+7)</span>
            </div>

            <div className="space-y-2.5">
              {schedules.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-colors flex items-start justify-between gap-3 ${
                    item.isLive
                      ? 'bg-[#E50914]/15 border-[#E50914]/50'
                      : 'bg-[#171719] border-[#2C2C32] hover:bg-[#202025]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0 w-16 pt-0.5">
                      <span className="text-xs font-bold font-mono text-white">{item.startTime}</span>
                      <span className="text-[10px] font-mono text-[#8E8E93]">{item.endTime}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                        {item.isLive && (
                          <span className="px-2 py-0.2 text-[9px] font-extrabold bg-[#E50914] text-white rounded-full uppercase">
                            Đang phát
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-[#C5C5CE] px-2 py-1 bg-[#26262C] rounded-lg shrink-0">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Channels Selector List */}
        <div className={isTheaterMode ? 'w-full' : 'lg:col-span-4'}>
          <div className="p-5 rounded-[30px] bg-[#1E1E22] border border-[#2E2E36] shadow-xl sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#E50914]" />
                <h3 className="text-base font-bold text-white">Danh sách kênh</h3>
              </div>
              <span className="text-xs text-[#8E8E93]">
                {filteredChannels.length} kênh
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3 search-box-capsule rounded-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8E8E93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kênh truyền hình..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-[#171719] border border-[#34343C] text-xs text-white placeholder-[#8E8E93] focus:outline-none"
              />
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                      : 'bg-[#26262C] text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Channel Items Vertical List */}
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1">
              {filteredChannels.map((ch) => {
                const isSelected = ch.id === currentChannel.id;
                const isChFav = isChannelFavorite(ch.id);

                return (
                  <div
                    key={ch.id}
                    onClick={() => onSelectChannel(ch)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#E50914]/25 to-[#B81D24]/20 border-[#E50914] shadow-md'
                        : 'bg-[#171719] border-[#2C2C32] hover:bg-[#24242A] hover:border-[#3E3E48]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        <img
                          src={ch.logo}
                          alt={ch.name}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#E50914]' : 'text-white group-hover:text-white'}`}>
                            {ch.shortName || ch.name}
                          </span>
                          <span className="px-1.5 py-0.2 text-[8px] font-extrabold bg-[#E50914]/20 text-[#FF4D4D] border border-[#E50914]/30 rounded-full shrink-0">
                            {ch.quality}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8E8E93] truncate mt-0.5">
                          {ch.currentProgram?.title || ch.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteChannel(ch.id);
                      }}
                      className={`p-1.5 rounded-full shrink-0 transition-colors ${
                        isChFav ? 'text-[#E50914]' : 'text-[#71717A] hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isChFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
