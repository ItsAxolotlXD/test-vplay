import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, Check, Sparkles, Tv, Star, Play, Cpu, AlertCircle } from "lucide-react";
import { Channel, processedChannels } from "../data/channels";

interface IntelligenceThumbnailTabProps {
  onBack: () => void;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  t: (key: string) => string;
}

export default function IntelligenceThumbnailTab({
  onBack,
  onSelectChannel,
  favorites,
  toggleFavorite,
  t
}: IntelligenceThumbnailTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter channels based on search query
  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return processedChannels;
    const q = searchQuery.toLowerCase();
    return processedChannels.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.group && c.group.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fade-in text-white/95 relative font-mono">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-default text-neutral-300 hover:text-white rounded-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trở về Trang chủ</span>
        </button>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest bg-zinc-900 px-3 py-1 border border-white/5 rounded-none">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
          <span>Active Session</span>
        </div>
      </div>

      {/* Premium V-Intelligence Banner */}
      <div className="relative border border-white/15 bg-[#0e0a1b]/95 p-8 overflow-hidden rounded-none shadow-2xl border-l-4 border-l-purple-500">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-none blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-none blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-widest rounded-none">
                System Core
              </span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {t("title.intelligence_banner_top.name")}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              {t("title:intelligence_banner_bottom.name")}
            </h1>

            <p className="text-xs text-white/60 leading-relaxed font-sans">
              {t("title.intelligence_banner_desc.name")}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <div className="text-[10px] text-white/40 font-semibold uppercase">Logo identifier:</div>
              <div className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-wider rounded-none">
                V-Intelligence
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-none w-full md:w-48 text-center gap-2">
            <Cpu className="w-8 h-8 text-purple-400 animate-pulse" />
            <div className="text-[10px] font-black uppercase text-white/90">Smooth Engine v1.0</div>
            <div className="text-[9px] text-white/40 uppercase">Lag-free dynamic loading</div>
          </div>
        </div>
      </div>

      {/* Control Area (Search) without language selection (ko lang) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm kênh trong kho dữ liệu V-Intelligence..."
            className="w-full bg-zinc-950 border border-white/10 focus:border-purple-500/50 pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-all rounded-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-3 py-2 text-[10px] text-white/50 uppercase tracking-wider shrink-0">
          <span>Tìm thấy {filteredChannels.length} kênh khả dụng</span>
        </div>
      </div>

      {/* Channel Thumbnail Grid - lag-free, non-blocking rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredChannels.map((channel) => {
          const isFav = favorites.includes(channel.id);
          
          return (
            <div
              key={channel.id}
              className="group bg-[#0d091a]/80 border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col text-left rounded-none overflow-hidden"
            >
              {/* Card visual body */}
              <div className="relative aspect-video bg-zinc-950 overflow-hidden border-b border-white/5">
                {/* Simulated live visual scanline matrix to show a gorgeous TV view */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-black to-black z-10" />
                
                {/* Visual Placeholder representing a channel thumbnail */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 rounded-none bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <Tv className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase text-purple-200 tracking-wider group-hover:text-white transition-colors">
                    {channel.name}
                  </span>
                  <span className="text-[8px] text-white/30 uppercase mt-0.5 font-mono tracking-widest">
                    {channel.group || "General"}
                  </span>
                </div>

                {/* Direct quick-play button on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                  <button
                    onClick={() => onSelectChannel(channel)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 border border-purple-400/20 text-[9px] font-bold uppercase tracking-widest text-white transition-all cursor-default transform scale-90 group-hover:scale-100 flex items-center gap-1.5 rounded-none"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Xem ngay</span>
                  </button>
                </div>

                {/* Favorite badge */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(channel.id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 border border-white/10 rounded-none text-white transition-colors z-30 cursor-default"
                >
                  <Star className={`w-3 h-3 ${isFav ? "fill-amber-400 text-amber-400" : "text-white/60"}`} />
                </button>
              </div>

              {/* Channel metadata caption under the card */}
              <div className="p-3 bg-zinc-950/60 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide truncate">
                    {channel.name}
                  </div>
                  <div className="text-[8px] text-white/40 font-mono tracking-wider truncate">
                    URL: {channel.url ? channel.url.slice(0, 42) : "N/A"}...
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-[8px] bg-white/5 border border-white/5 px-1.5 py-0.5 text-neutral-400 uppercase">
                    HD Stream
                  </span>
                  <span className="text-[8px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-none" />
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChannels.length === 0 && (
        <div className="py-16 text-center border border-dashed border-white/10 text-white/40 uppercase text-xs tracking-wider">
          Không tìm thấy kênh nào khớp với tìm kiếm.
        </div>
      )}
    </div>
  );
}
