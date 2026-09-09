import React from 'react';
import { Play, Heart, Radio, Sparkles } from 'lucide-react';
import { Channel } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
  isActive?: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onSelect,
  isActive
}) => {
  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();
  const isFav = isChannelFavorite(channel.id);

  return (
    <div
      id={`channel-card-${channel.id}`}
      onClick={() => onSelect(channel)}
      className={`group relative rounded-[20px] bg-[#22171E] transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] shadow-md border-0 ${
        isActive
          ? 'bg-[#2D1B26] shadow-lg shadow-red-900/20'
          : 'hover:bg-[#281A22]'
      }`}
    >
      {/* Top Banner / Logo Area */}
      <div className="relative h-24 sm:h-26 bg-gradient-to-b from-[#2A1D25] to-[#22171E] flex items-center justify-center p-3 overflow-hidden border-0">
        {channel.bannerImage && (
          <img
            src={channel.bannerImage}
            alt={channel.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-300"
          />
        )}

        {/* Center Channel Logo */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#170E13]/90 flex items-center justify-center p-1.5 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 border-0">
          <img
            src={channel.logo}
            alt={channel.name}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain channel-logo-img filter drop-shadow"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
            onError={(e) => {
              // Graceful fallback to stylish initial badge if image link has network issues
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="text-[10px] font-black text-white/70 absolute pointer-events-none -z-10 uppercase tracking-tighter">
            {channel.name.slice(0, 4)}
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF2020]/25 text-[#FF6666] text-[9px] font-bold border-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2020] animate-pulse" />
          <span>TRỰC TIẾP</span>
        </div>

        {/* Quality Pill */}
        <div className="absolute top-2.5 right-10 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-extrabold text-white border-0">
          {channel.quality}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteChannel(channel.id);
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors border-0 ${
            isFav 
              ? 'bg-[#FF2020] text-white shadow-md' 
              : 'bg-black/60 text-[#A1A1AA] hover:text-white'
          }`}
          title={isFav ? 'Bỏ yêu thích' : 'Yêu thích kênh'}
        >
          <Heart className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF2020] to-[#E6005A] flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-3 pt-2 border-0">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#FF3366] transition-colors truncate">
            {channel.name}
          </h3>
          <span className="text-[10px] font-medium text-[#A1959C] shrink-0">
            {channel.category}
          </span>
        </div>

        {/* Current Program on Air */}
        <div className="mt-2 p-2 rounded-xl bg-[#170E13]/70 border-0">
          <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] mb-1">
            <span className="font-semibold text-white truncate max-w-[130px]">
              {channel.currentProgram?.title || 'Chương trình trực tiếp'}
            </span>
            <span className="text-[9px] text-[#A1959C] shrink-0 font-mono">
              {channel.currentProgram?.startTime} - {channel.currentProgram?.endTime}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#2A1D25] h-1 rounded-full overflow-hidden border-0">
            <div
              className="bg-gradient-to-r from-[#FF2020] to-[#E6005A] h-full rounded-full"
              style={{ width: `${channel.currentProgram?.progress || 50}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
