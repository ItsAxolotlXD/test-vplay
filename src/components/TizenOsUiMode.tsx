import React, { useState } from 'react';
import {
  Settings,
  Tv,
  Search,
  Grid,
  Volume2,
  VolumeX,
  Play,
  ArrowLeft,
  Music,
  Trophy,
  Gamepad2,
  Radio,
  Tv2,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Flame,
  Radio as AntennaIcon
} from 'lucide-react';
import { TvChannel } from '../types';
import VirtualRemoteControl from './VirtualRemoteControl';
import { playPopSound } from '../utils/sound';

interface TizenOsUiModeProps {
  channels: TvChannel[];
  selectedChannel: TvChannel;
  onSelectChannel: (channel: TvChannel) => void;
  onOpenSettings: () => void;
  onDisableTizenOs: () => void;
}

interface RecommendationItem {
  id: string;
  title: string;
  subTitle: string;
  league: string;
  bgImage: string;
  team1Logo: string;
  team2Logo: string;
  channelName: string;
  matchChannelId?: string;
}

export const TizenOsUiMode: React.FC<TizenOsUiModeProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  onOpenSettings,
  onDisableTizenOs,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('sports');
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'on_now' | 'upcoming'>('on_now');
  const [isRemoteActive, setIsRemoteActive] = useState(true);
  
  // LiveTV Overlay State when hovering or clicking TV section
  const [showLiveTvPage, setShowLiveTvPage] = useState(false);
  const [channelCategoryFilter, setChannelCategoryFilter] = useState<string>('ALL');

  // Sample sports & channel recommendation items for top ribbon
  const onNowItems: RecommendationItem[] = [
    {
      id: 'match_1',
      title: 'Mets AT Yankees',
      subTitle: 'MLB Regular Season • Live',
      league: 'MLB',
      bgImage: 'https://images.unsplash.com/photo-1508801935849-2a03261775e5?auto=format&fit=crop&w=800&q=80',
      team1Logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/New_York_Mets_Insignia.svg',
      team2Logo: 'https://upload.wikimedia.org/wikipedia/commons/7/a3/New_York_Yankees_logo.svg',
      channelName: 'VTVcab 18 - Sports',
      matchChannelId: channels[0]?.id
    },
    {
      id: 'match_2',
      title: 'Cavaliers AT Warriors',
      subTitle: 'NBA Finals Game 7 • Live',
      league: 'NBA',
      bgImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      team1Logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Cleveland_Cavaliers_logo.svg',
      team2Logo: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Golden_State_Warriors_logo.svg',
      channelName: 'VTV3 HD - Bóng Rổ',
      matchChannelId: channels[1]?.id
    },
    {
      id: 'match_3',
      title: 'Steelers AT Patriots',
      subTitle: 'NFL Sunday Night • Live',
      league: 'NFL',
      bgImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80',
      team1Logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Pittsburgh_Steelers_logo.svg',
      team2Logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/New_England_Patriots_logo.svg',
      channelName: 'SCTV17 - Thể Thao',
      matchChannelId: channels[2]?.id
    }
  ];

  const upcomingItems: RecommendationItem[] = [
    {
      id: 'upcoming_1',
      title: 'Seahawks AT 49ers',
      subTitle: 'Hôm nay • 20:00 PM',
      league: 'NFL',
      bgImage: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
      team1Logo: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg',
      team2Logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg',
      channelName: 'VTV6 HD'
    },
    {
      id: 'upcoming_2',
      title: 'VTV1 - Thời Sự 19h',
      subTitle: 'Tối nay • 19:00 PM',
      league: 'NEWS',
      bgImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      team1Logo: '',
      team2Logo: '',
      channelName: 'VTV1 HD'
    }
  ];

  const categoriesList = ['ALL', ...Array.from(new Set(channels.map((c) => c.groupTitle)))];

  const filteredChannels = channelCategoryFilter === 'ALL'
    ? channels
    : channels.filter((c) => c.groupTitle === channelCategoryFilter);

  return (
    <div className="relative w-full h-screen bg-transparent text-white font-sans overflow-hidden select-none">
      
      {/* 1. TV BACKGROUND STREAM CANVAS OVER PANORAMA */}
      <div className="absolute inset-0 z-0">
        <video
          key={selectedChannel.id}
          src={selectedChannel.videoBg || 'https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-shining-in-the-dark-41551-large.mp4'}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90 opacity-45 mix-blend-screen"
        />

        {/* Top Dark Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 pointer-events-none" />
      </div>

      {/* 2. TOP VPLAYTV OS TV STATUS BAR */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs uppercase tracking-widest text-white shadow rounded-none border border-white">
            VplayTV OS
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono bg-black/50 px-3 py-1 rounded-none border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white">{selectedChannel.name}</span>
            <span className="text-zinc-400">• {selectedChannel.currentProgram}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              playPopSound();
            }}
            className="p-2.5 bg-black/60 hover:bg-black/80 border border-white text-white rounded-none transition cursor-pointer"
            title="Âm thanh"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Toggle Remote Control Overlay */}
          <button
            onClick={() => {
              setIsRemoteActive(!isRemoteActive);
              playPopSound();
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-none border-2 transition cursor-pointer ${
              isRemoteActive
                ? 'bg-cyan-600 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-black/60 border-white text-zinc-300 hover:text-white'
            }`}
          >
            🎮 Remote Control: {isRemoteActive ? 'ON' : 'OFF'}
          </button>

          {/* Exit VplayTV OS */}
          <button
            onClick={() => {
              playPopSound();
              onDisableTizenOs();
            }}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-none border-2 border-white shadow cursor-pointer flex items-center gap-1.5"
            title="Thoát VplayTV OS"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Thoát VplayTV OS
          </button>
        </div>
      </div>

      {/* 3. OVERLAY LIVETV CHANNELS PAGE WHEN HOVERED OR CLICKED ON TV */}
      {showLiveTvPage && (
        <div
          onMouseLeave={() => setShowLiveTvPage(false)}
          className="absolute inset-x-4 top-16 bottom-32 z-40 bg-black/95 backdrop-blur-2xl border-2 border-cyan-400 p-6 shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-fade-in flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600 border border-white text-white">
                <Tv2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-cyan-300 tracking-wider flex items-center gap-2">
                  <span>LiveTV Channels</span>
                  <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 border border-cyan-400/50 font-mono">
                    TRUYỀN HÌNH ĐAN MẠCH VPLAY
                  </span>
                </h3>
                <p className="text-xs text-zinc-300">
                  Danh sách toàn bộ kênh truyền hình trực tiếp HD & 4K
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLiveTvPage(false)}
              className="p-2 bg-red-600 hover:bg-red-500 border border-white text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setChannelCategoryFilter(cat);
                  playPopSound();
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition cursor-pointer border-2 ${
                  channelCategoryFilter === cat
                    ? 'bg-cyan-600 text-white border-white shadow-[0_0_10px_rgba(6,182,212,0.6)] font-black'
                    : 'bg-zinc-800 text-zinc-300 border-white/30 hover:border-cyan-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả kênh' : cat}
              </button>
            ))}
          </div>

          {/* Grid of Channels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-y-auto pr-1 flex-1">
            {filteredChannels.map((channel) => {
              const isCurrent = selectedChannel.id === channel.id;
              return (
                <div
                  key={channel.id}
                  onClick={() => {
                    playPopSound();
                    onSelectChannel(channel);
                    setShowLiveTvPage(false);
                  }}
                  className={`p-3 border-2 transition cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-cyan-600 text-white border-white shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                      : 'bg-zinc-900/90 hover:bg-zinc-800 border-white hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-black/60 text-cyan-300 px-1.5 py-0.5 border border-white/20">
                      {channel.id}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[9px] bg-cyan-400 text-black font-extrabold px-1.5 py-0.5">
                        <Flame className="w-3 h-3 fill-current" /> DANG PHÁT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 my-1">
                    <div className="w-10 h-10 bg-black border border-white flex items-center justify-center shrink-0">
                      {channel.logo ? (
                        <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Tv className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-black text-white group-hover:text-cyan-300 truncate">
                        {channel.name}
                      </h4>
                      <p className="text-[10px] text-zinc-300 truncate">
                        {channel.groupTitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-zinc-400 truncate">
                    ▶ {channel.currentProgram}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. FLOATING CONTENT & SMART HUB BAR (CENTER-BOTTOM) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        
        {/* TOP RECOMMENDATION RIBBON (On Now & Upcoming Matchups / Channels) */}
        <div className="w-full max-w-7xl mx-auto mb-4 animate-fade-in">
          
          {/* Section Headers: On Now / Upcoming */}
          <div className="flex items-center gap-6 mb-3 text-sm font-bold tracking-wide">
            <button
              onClick={() => {
                setActiveTab('on_now');
                playPopSound();
              }}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'on_now'
                  ? 'border-cyan-400 text-cyan-300 font-extrabold scale-105'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              On Now
            </button>
            <button
              onClick={() => {
                setActiveTab('upcoming');
                playPopSound();
              }}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'border-cyan-400 text-cyan-300 font-extrabold scale-105'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Cards Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {(activeTab === 'on_now' ? onNowItems : upcomingItems).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playPopSound();
                  if (item.matchChannelId) {
                    const found = channels.find((c) => c.id === item.matchChannelId);
                    if (found) onSelectChannel(found);
                  } else {
                    onSelectChannel(channels[0]);
                  }
                }}
                className="group relative h-28 sm:h-32 rounded-none overflow-hidden border-2 border-white hover:border-cyan-400 shadow-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Background Image */}
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Team Logos Matchup Overlay */}
                {item.team1Logo && item.team2Logo && (
                  <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none opacity-85 group-hover:opacity-100">
                    <img src={item.team1Logo} alt="Team 1" className="w-10 h-10 object-contain drop-shadow-md" />
                    <span className="text-xs font-black text-white/80 uppercase font-mono bg-black/60 px-2 py-0.5 border border-white">AT</span>
                    <img src={item.team2Logo} alt="Team 2" className="w-10 h-10 object-contain drop-shadow-md" />
                  </div>
                )}

                {/* Bottom Title & Channel Badge */}
                <div className="absolute bottom-2 left-3 right-3 z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                      {item.subTitle}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[180px]">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[9px] bg-black/80 text-white font-mono font-bold px-2 py-0.5 border border-white">
                    {item.channelName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. MAIN SMART HUB TILES ROW (BOTTOM BAR - UNIFIED SCROLL WITH CYAN ACCENTS & WHITE BORDER APPS) */}
        <div className="w-full max-w-7xl mx-auto bg-[#1a1c1e]/95 backdrop-blur-2xl border-t-2 border-white p-2.5 sm:p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2 overflow-x-auto scrollbar-none py-2 rounded-none">
          
          {/* Action Buttons (Settings, TV/Source with LiveTV hover, Search, Apps) */}
          <button
            onClick={() => {
              playPopSound();
              onOpenSettings();
            }}
            className="p-3 bg-zinc-800 hover:bg-cyan-600 border-2 border-white text-white transition cursor-pointer flex flex-col items-center justify-center min-w-[50px] min-h-[50px] shrink-0 rounded-none hover:shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            title="Cài đặt Settings"
          >
            <Settings className="w-5 h-5 text-cyan-300 hover:text-white" />
          </button>

          {/* TV BUTTON WITH HOVER/CLICK TO SHOW LIVETV CHANNELS */}
          <button
            onMouseEnter={() => setShowLiveTvPage(true)}
            onClick={() => {
              playPopSound();
              setShowLiveTvPage(!showLiveTvPage);
            }}
            className={`p-3 border-2 border-white transition cursor-pointer flex flex-col items-center justify-center min-w-[50px] min-h-[50px] shrink-0 rounded-none ${
              showLiveTvPage
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.9)] ring-2 ring-white'
                : 'bg-zinc-800 hover:bg-cyan-600 text-white hover:shadow-[0_0_12px_rgba(6,182,212,0.8)]'
            }`}
            title="Kênh truyền hình LiveTV"
          >
            <Tv2 className="w-5 h-5 text-cyan-300 hover:text-white" />
          </button>

          <button
            onClick={() => {
              playPopSound();
              onOpenSettings();
            }}
            className="p-3 bg-zinc-800 hover:bg-cyan-600 border-2 border-white text-white transition cursor-pointer flex flex-col items-center justify-center min-w-[50px] min-h-[50px] shrink-0 rounded-none hover:shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            title="Search Kênh"
          >
            <Search className="w-5 h-5 text-cyan-300 hover:text-white" />
          </button>

          <button
            onClick={() => {
              playPopSound();
            }}
            className="p-3 bg-zinc-800 hover:bg-cyan-600 border-2 border-white text-white transition cursor-pointer flex flex-col items-center justify-center min-w-[50px] min-h-[50px] shrink-0 rounded-none hover:shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            title="Ứng dụng Apps"
          >
            <Grid className="w-5 h-5 text-cyan-300 hover:text-white" />
          </button>

          {/* Vertical Separator */}
          <div className="w-[2px] h-8 bg-white shrink-0 mx-1" />

          {/* APP TILE 1: TV PLUS (HOVER TO SHOW LIVETV) */}
          <div
            onMouseEnter={() => setShowLiveTvPage(true)}
            onClick={() => {
              playPopSound();
              setShowLiveTvPage(true);
            }}
            className="min-w-[95px] h-[52px] bg-[#0c1a30] hover:bg-cyan-600 border-2 border-white rounded-none flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0 hover:shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          >
            <span className="font-extrabold text-xs tracking-wider text-cyan-300 font-mono group-hover:text-white">
              TV<span className="text-white">PLUS</span>
            </span>
          </div>

          {/* APP TILE 2: NETFLIX */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[95px] h-[52px] bg-white hover:bg-zinc-100 text-red-600 border-2 border-white rounded-none flex items-center justify-center font-extrabold text-xs tracking-widest cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0 font-serif"
          >
            NETFLIX
          </div>

          {/* APP TILE 3: AMAZON */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[95px] h-[52px] bg-white hover:bg-zinc-100 text-slate-900 border-2 border-white rounded-none flex items-center justify-center font-extrabold text-xs tracking-wider cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0 font-sans"
          >
            amazon
          </div>

          {/* APP TILE 4: YOUTUBE */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[95px] h-[52px] bg-[#cc0000] hover:bg-[#e60000] text-white border-2 border-white rounded-none flex items-center justify-center font-extrabold text-xs tracking-wider cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0"
          >
            YouTube
          </div>

          {/* APP TILE 5: HULU */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[95px] h-[52px] bg-[#10b981] hover:bg-[#34d399] text-black border-2 border-white rounded-none flex items-center justify-center font-black text-xs tracking-widest cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0"
          >
            hulu
          </div>

          {/* APP TILE 6: HBO NOW */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[95px] h-[52px] bg-black border-2 border-white rounded-none flex items-center justify-center text-white font-extrabold text-xs tracking-widest cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0"
          >
            HBO<span className="text-cyan-400 font-mono text-[9px] ml-0.5">NOW</span>
          </div>

          {/* APP TILE 7: GOOGLE PLAY */}
          <div
            onClick={() => playPopSound()}
            className="min-w-[100px] h-[52px] bg-white text-zinc-800 border-2 border-white rounded-none flex items-center justify-center text-[10px] font-bold tracking-tight cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0 px-2 text-center"
          >
            Google Play
          </div>

          {/* APP TILE 8: ACTIVE CATEGORY: SPORTS (HIGHLIGHTED WITH CYAN ACCENT) */}
          <div
            onClick={() => {
              setActiveCategory('sports');
              playPopSound();
            }}
            className="min-w-[130px] h-[52px] bg-cyan-600 text-white border-2 border-white rounded-none flex items-center justify-center gap-2 font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.8)] transform scale-105 shrink-0"
          >
            <Trophy className="w-4 h-4" />
            <span>Sports</span>
          </div>

          {/* APP TILE 9: MUSIC */}
          <div
            onClick={() => {
              setActiveCategory('music');
              playPopSound();
            }}
            className="min-w-[110px] h-[52px] bg-[#7c3aed] text-white border-2 border-white rounded-none flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0"
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </div>

          {/* TV CHANNEL TILES */}
          {channels.slice(0, 8).map((channel) => {
            const isSelected = selectedChannel.id === channel.id;

            return (
              <div
                key={channel.id}
                onClick={() => {
                  playPopSound();
                  onSelectChannel(channel);
                }}
                className={`min-w-[115px] h-[52px] border-2 rounded-none flex items-center gap-2 px-2.5 cursor-pointer transition transform hover:scale-105 active:scale-95 shadow shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 border-white text-white font-bold ring-2 ring-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                    : 'bg-zinc-800/90 hover:bg-zinc-700/90 border-white text-zinc-200'
                }`}
              >
                <div className="w-6 h-6 rounded-none bg-black/60 border border-white/30 overflow-hidden shrink-0 flex items-center justify-center">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                  ) : (
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <div className="truncate text-left">
                  <div className="text-[11px] font-extrabold truncate">{channel.name}</div>
                  <div className="text-[8px] text-zinc-300 truncate">{channel.groupTitle}</div>
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* 6. VIRTUAL REMOTE CONTROL OVERLAY */}
      <VirtualRemoteControl
        isActive={isRemoteActive}
        onDisable={() => setIsRemoteActive(false)}
        channels={channels}
        onSelectChannel={onSelectChannel}
      />

    </div>
  );
};
