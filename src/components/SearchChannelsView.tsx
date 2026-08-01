import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Check, Share2, Copy, Play, Download, Bug } from 'lucide-react';
import { TvChannel } from '../types';
import { playPopSound } from '../utils/sound';
import { useLang } from '../context/LanguageContext';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface SearchChannelsViewProps {
  channels: TvChannel[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectChannel: (channel: TvChannel) => void;
  recentlyWatched?: TvChannel[];
}

export const SearchChannelsView: React.FC<SearchChannelsViewProps> = ({
  channels,
  searchQuery,
  onSearchChange,
  onSelectChannel,
  recentlyWatched = [],
}) => {
  const { t, setIsDebugModalOpen } = useLang();
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(true);
  const [isRecentlyWatchedOpen, setIsRecentlyWatchedOpen] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shared, setShared] = useState(false);
  const [exported, setExported] = useState(false);

  // Filter channels based on search query
  const searchResults = channels.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const idx = channels.findIndex((item) => item.id === c.id);
    const channelNumStr = String(idx >= 0 ? idx + 1 : 1).padStart(3, '0');
    const rawNumStr = String(idx >= 0 ? idx + 1 : 1);
    return (
      c.name.toLowerCase().includes(q) ||
      c.groupTitle.toLowerCase().includes(q) ||
      c.currentProgram.toLowerCase().includes(q) ||
      channelNumStr.includes(q) ||
      rawNumStr === q
    );
  });

  // Top recommended channels (e.g. top 5 rated or featured)
  const recommendedChannels = channels.filter(
    (c) => c.badge === 'HOT' || c.badge === 'VIP' || parseFloat(c.rating || '0') >= 4.8
  ).slice(0, 5);

  // Default recently watched fallback if empty
  const defaultRecentlyWatched =
    recentlyWatched.length > 0 ? recentlyWatched : channels.slice(0, 3);

  const handleCopyLink = () => {
    playPopSound();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    playPopSound();
    if (navigator.share) {
      navigator.share({
        title: 'Vplay TV Channels',
        text: 'Xem truyền hình trực tuyến Vplay HD!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleExportChannels = () => {
    playPopSound();
    let m3u8Content = '#EXTM3U\n';
    channels.forEach((ch) => {
      const stream = ch.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
      m3u8Content += `#EXTINF:-1 tvg-id="${ch.id}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="${ch.groupTitle}",${ch.name}\n${stream}\n\n`;
    });

    const blob = new Blob([m3u8Content], { type: 'audio/x-mpegurl;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'Vplay_channels.m3u8');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-4 font-montserrat select-none text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN (ON DESKTOP) / TOP PANEL (ON MOBILE): SHARE & EXPORT PANEL */}
        <div className="md:col-span-4 bg-[#3c3f42] border-2 border-[#141414] p-4 flex flex-col justify-start shadow-xl space-y-4">
          <div className="border-b border-[#2d3033] pb-2">
            <h3 className="font-black text-sm uppercase text-[#89dc69] tracking-wide">
              {t('search.title', 'VPLAY CHANNELS')}
            </h3>
            <p className="text-[11px] text-gray-300 mt-1">
              {t('search.description', `Chia sẻ ứng dụng hoặc xuất danh sách toàn bộ ${channels.length} kênh Vplay dưới dạng .m3u8.`)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            <VplaySecondaryButton
              onClick={handleShare}
              size="sm"
            >
              <Share2 className="w-4 h-4" />
              <span>{shared ? t('search.shared', 'ĐÃ CHIA SẺ!') : t('search.share', 'SHARE')}</span>
            </VplaySecondaryButton>

            <VplaySecondaryButton
              onClick={handleExportChannels}
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span>{exported ? t('search.exported', 'ĐÃ TẢI FILE M3U8!') : t('search.export', 'EXPORT CHANNELS (.M3U8)')}</span>
            </VplaySecondaryButton>

            <VplaySecondaryButton
              onClick={handleCopyLink}
              size="sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? t('search.copied', 'ĐÃ COPY LINK!') : t('search.copy', 'COPY LINK')}</span>
            </VplaySecondaryButton>
          </div>
        </div>

        {/* RIGHT COLUMN (ON DESKTOP) / MAIN CONTENT (ON MOBILE): SEARCH & ACCORDIONS */}
        <div className="md:col-span-8 space-y-3">
          
          {/* SEARCH INPUT SECTION */}
          <div className="bg-[#3c3f42] border-2 border-[#141414] p-3 shadow-md space-y-2">
            <label className="block text-xs text-gray-300 font-normal">
              Find channels by name or category
            </label>

            <div className="relative flex items-center">
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/MagnifyingGlass.png/revision/latest?cb=20260730091531"
                alt="Search"
                referrerPolicy="no-referrer"
                className="absolute left-3 w-5 h-5 object-contain pointer-events-none z-10"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for channels"
                className="w-full h-9.5 mc-input-box pl-10 pr-8 text-xs font-medium cursor-default"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-gray-400 hover:text-white font-bold text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE SEARCH RESULTS IF QUERY IS PRESENT */}
          {searchQuery.trim().length > 0 ? (
            <div className="bg-[#3c3f42] border-2 border-[#141414] p-3 shadow-md space-y-2">
              <div className="text-xs font-bold text-[#89dc69] uppercase border-b border-[#2d3033] pb-1.5 flex justify-between items-center">
                <span>KẾT QUẢ TÌM KIẾM ({searchResults.length})</span>
                <span className="text-gray-400 text-[10px] lowercase">từ khóa: "{searchQuery}"</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {searchResults.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => {
                        playPopSound();
                        onSelectChannel(ch);
                      }}
                      className="bg-[#c6c6c6] text-[#181818] border-2 border-[#181818] hover:bg-[#28960b] hover:text-white hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] p-2 sm:p-2.5 flex items-center justify-between gap-3 cursor-pointer group select-none active:translate-y-[1px] btn-press-effect rounded-none transition-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Channel Logo Square Box */}
                        <div className="w-10 h-10 bg-transparent border border-[#141414]/20 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                          {ch.logo ? (
                            <img
                              src={ch.logo}
                              alt={ch.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/80/1c1d1f/89dc69?text=${encodeURIComponent(ch.name)}`;
                              }}
                            />
                          ) : (
                            <span className="text-[10px] font-black text-[#89dc69]">{ch.name}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#ffe866] text-[#141414] px-1 py-0.2 text-[9px] font-bold font-montserrat border border-[#141414] flex-shrink-0">
                              {String(channels.findIndex((item) => item.id === ch.id) + 1).padStart(3, '0')}
                            </span>
                            <h4 className="font-bold text-xs text-[#181818] uppercase group-hover:text-white transition-colors truncate">
                              {ch.name}
                            </h4>
                          </div>
                          <p className="text-[10px] text-[#404040] group-hover:text-white/90 truncate mt-0.5">
                            {ch.groupTitle} • {ch.currentProgram}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPopSound();
                          onSelectChannel(ch);
                        }}
                        className="bg-[#28960b] hover:bg-[#2eb00d] text-white font-bold text-[10px] px-2.5 py-1 border border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] flex items-center gap-1 flex-shrink-0 active:translate-y-[1px]"
                      >
                        <Play className="w-3 h-3 fill-white" /> XEM
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-gray-400">
                  Không tìm thấy kênh phù hợp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ACCORDION 1: RECOMMENDED CHANNELS */}
              <div className="border-2 border-[#141414] bg-[#3c3f42] shadow-md overflow-hidden">
                <button
                  onClick={() => {
                    playPopSound();
                    setIsRecommendedOpen(!isRecommendedOpen);
                  }}
                  className="w-full px-3 py-2 bg-[#36383b] hover:bg-[#424548] border-b border-[#141414] flex items-center justify-between text-xs sm:text-sm font-extrabold uppercase text-white cursor-pointer select-none"
                >
                  <span>Recommended channels</span>
                  {isRecommendedOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  )}
                </button>

                {isRecommendedOpen && (
                  <div className="p-2 space-y-1.5 bg-[#313336]">
                    {recommendedChannels.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          playPopSound();
                          onSelectChannel(ch);
                        }}
                        className="bg-[#c6c6c6] text-[#181818] border-2 border-[#181818] hover:bg-[#28960b] hover:text-white hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] p-2 flex items-center justify-between gap-3 cursor-pointer group select-none active:translate-y-[1px] btn-press-effect rounded-none transition-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-transparent border border-[#141414]/20 flex-shrink-0 flex items-center justify-center p-1">
                            {ch.logo ? (
                              <img
                                src={ch.logo}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/80/1c1d1f/89dc69?text=${encodeURIComponent(ch.name)}`;
                                }}
                              />
                            ) : (
                              <span className="text-[9px] font-bold text-[#181818] group-hover:text-white">{ch.name}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-[#181818] uppercase group-hover:text-white truncate">
                              {ch.name}
                            </h4>
                            <p className="text-[10px] text-[#404040] group-hover:text-white/90 truncate">{ch.groupTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playPopSound();
                              onSelectChannel(ch);
                            }}
                            className="bg-[#28960b] hover:bg-[#2eb00d] text-white font-bold text-[10px] px-2.5 py-1 border border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] flex items-center gap-1 active:translate-y-[1px]"
                          >
                            <Play className="w-2.5 h-2.5 fill-white" /> XEM
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACCORDION 2: RECENTLY WATCHED */}
              <div className="border-2 border-[#141414] bg-[#3c3f42] shadow-md overflow-hidden">
                <button
                  onClick={() => {
                    playPopSound();
                    setIsRecentlyWatchedOpen(!isRecentlyWatchedOpen);
                  }}
                  className="w-full px-3 py-2 bg-[#36383b] hover:bg-[#424548] border-b border-[#141414] flex items-center justify-between text-xs sm:text-sm font-extrabold uppercase text-white cursor-pointer select-none"
                >
                  <span>Recently watched ({defaultRecentlyWatched.length})</span>
                  {isRecentlyWatchedOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  )}
                </button>

                {isRecentlyWatchedOpen && (
                  <div className="p-2 space-y-1.5 bg-[#313336]">
                    {defaultRecentlyWatched.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          playPopSound();
                          onSelectChannel(ch);
                        }}
                        className="bg-[#c6c6c6] text-[#181818] border-2 border-[#181818] hover:bg-[#28960b] hover:text-white hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] p-2 flex items-center justify-between gap-3 cursor-pointer group select-none active:translate-y-[1px] btn-press-effect rounded-none transition-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-transparent border border-[#141414]/20 flex-shrink-0 flex items-center justify-center p-1">
                            {ch.logo ? (
                              <img
                                src={ch.logo}
                                alt={ch.name}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/80/1c1d1f/89dc69?text=${encodeURIComponent(ch.name)}`;
                                }}
                              />
                            ) : (
                              <span className="text-[9px] font-bold text-[#181818] group-hover:text-white">{ch.name}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-[#181818] uppercase group-hover:text-white truncate">
                              {ch.name}
                            </h4>
                            <p className="text-[10px] text-[#404040] group-hover:text-white/90 truncate">{ch.currentProgram}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#181818] group-hover:text-white text-[10px] font-semibold flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-[#1b5e20] group-hover:text-white" />
                          <span>Watched</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
