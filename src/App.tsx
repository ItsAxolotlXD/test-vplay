import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TvChannel, UserSettings } from './types';
import { TV_CHANNELS } from './data/mockTvData';
import { DesignSystemViewer } from './components/DesignSystemViewer';
import { TvPlayer } from './components/TvPlayer';
import { SettingsView } from './components/SettingsView';
import { SearchChannelsView } from './components/SearchChannelsView';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { MinecraftPanorama } from './components/MinecraftPanorama';
import { HomeBannerSlider } from './components/HomeBannerSlider';
import { FeedbackModal } from './components/FeedbackModal';
import { CreateChannelModal } from './components/CreateChannelModal';
import { DebugLanguageModal } from './components/DebugLanguageModal';
import { useLang } from './context/LanguageContext';
import { playPopSound } from './utils/sound';

import { VplayHeroButton } from './components/ui/VplayHeroButton';
import { VplayPrimaryButton } from './components/ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './components/ui/VplaySecondaryButton';
import { VplayInputBox } from './components/ui/VplayInputBox';
import { VplayTab } from './components/ui/VplayTab';

import { Settings, Trophy, Flame, Menu, X, Radio, Pencil } from 'lucide-react';

export default function App() {
  const [sidebarItem, setSidebarItem] = useState<SidebarMenuItem>('home');
  const [channelsList, setChannelsList] = useState<TvChannel[]>(TV_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<TvChannel>(TV_CHANNELS[0]);
  const [recentlyWatched, setRecentlyWatched] = useState<TvChannel[]>([TV_CHANNELS[0], TV_CHANNELS[1], TV_CHANNELS[2]]);
  const [selectedGroup, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const triggerTabLoading = () => {
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 2000);
  };

  const [settings, setSettings] = useState<UserSettings>({
    autoPlay: true,
    subtitles: true,
    hdQuality: true,
    soundVolume: 7,
    qualityOption: '1080p',
    preferredCategory: 'all',
    themeMode: 'dark',
    notifications: true,
    searchQuery: '',
    disablePanorama: false,
    lockPanoramaScroll: false,
    panoramaScrollSpeed: 5,
  });

  const handleSelectChannel = (channel: TvChannel) => {
    setSelectedChannel(channel);
    setRecentlyWatched((prev) => [channel, ...prev.filter((c) => c.id !== channel.id)].slice(0, 10));
  };

  const handleAddChannel = (newChannel: TvChannel) => {
    setChannelsList((prev) => [newChannel, ...prev]);
    setSelectedChannel(newChannel);
    triggerTabLoading();
  };

  // Extract unique group titles from parsed channels
  const groupsList = ['all', ...Array.from(new Set(channelsList.map((c) => c.groupTitle)))];

  // Filter channels based on search and selected group
  const filteredChannels = channelsList.filter((ch) => {
    const idx = channelsList.findIndex((c) => c.id === ch.id);
    const channelNumStr = String(idx >= 0 ? idx + 1 : 1).padStart(3, '0');
    const rawNumStr = String(idx >= 0 ? idx + 1 : 1);
    const q = searchQuery.trim().toLowerCase();

    const matchGroup = selectedGroup === 'all' || ch.groupTitle === selectedGroup;
    const matchSearch = !q ||
                        ch.name.toLowerCase().includes(q) ||
                        ch.groupTitle.toLowerCase().includes(q) ||
                        ch.currentProgram.toLowerCase().includes(q) ||
                        channelNumStr.includes(q) ||
                        rawNumStr === q;
    return matchGroup && matchSearch;
  });

  const handleSidebarSelect = (item: SidebarMenuItem) => {
    playPopSound();
    if (item !== sidebarItem || isSettingsOpen) {
      triggerTabLoading();
    }
    if (item === 'settings') {
      setIsSettingsOpen(true);
      setSidebarItem('settings');
    } else {
      setIsSettingsOpen(false);
      setSidebarItem(item);
    }
    setIsMobileSidebarOpen(false);
  };

  const getHeaderTitle = () => {
    if (isSettingsOpen) return 'CÀI ĐẶT';
    switch (sidebarItem) {
      case 'home': return 'TRANG CHỦ';
      case 'live_tv': return 'TRUYỀN HÌNH';
      case 'search': return 'SEARCH FOR CHANNELS';
      case 'settings': return 'CÀI ĐẶT';
      case 'design_system': return 'ORE UI';
      default: return 'CÀI ĐẶT';
    }
  };

  const handleHeaderBack = () => {
    if (isSettingsOpen || sidebarItem !== 'home') {
      triggerTabLoading();
    }
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      setSidebarItem('home');
    } else if (sidebarItem !== 'home') {
      setSidebarItem('home');
    }
  };

  return (
    <div className="relative min-h-screen text-white font-jura antialiased selection:bg-[#418a28] selection:text-white flex flex-col">
      {/* Minecraft Panorama Animated Background */}
      <MinecraftPanorama
        disablePanorama={settings.disablePanorama}
        lockPanoramaScroll={settings.lockPanoramaScroll}
        panoramaScrollSpeed={settings.panoramaScrollSpeed}
      />
      
      {/* STICKY TOP CONTAINER FOR HEADER BAR + HORIZONTAL TAB BAR */}
      <div className="sticky top-0 z-50 w-full bg-[#242424]/85 backdrop-blur-md border-b-2 border-[#141414] shadow-md">
        <HeaderBar
          title={getHeaderTitle()}
          onBack={handleHeaderBack}
          onSearchClick={() => {
            if (sidebarItem !== 'search' || isSettingsOpen) triggerTabLoading();
            setIsSettingsOpen(false);
            setSidebarItem('search');
          }}
          searchValue={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setIsSettingsOpen(false);
            if (sidebarItem !== 'search') {
              triggerTabLoading();
              setSidebarItem('search');
            }
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <Sidebar
            activeItem={sidebarItem}
            onSelectItem={handleSidebarSelect}
            channelCount={channelsList.length}
          />
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 lg:pb-8 relative">
        <main className="w-full min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              <motion.div
                key="loading"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 1, transition: { duration: 0 } }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <div className="w-full min-h-[380px] bg-black/50 border-2 border-[#141414] shadow-2xl flex items-center justify-center p-8 text-center select-none my-2 rounded-none">
                  <img
                    src="https://i.ibb.co/YF4Q2tmz/animation-074ed0ba8c16bb30e36c.gif"
                    alt="Loading..."
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-contain [image-rendering:pixelated]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isSettingsOpen ? 'settings' : sidebarItem}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ x: '-100%', opacity: 1 }}
                transition={{
                  opacity: { duration: 0.5, ease: 'easeInOut' },
                  x: { duration: 0.22, ease: 'easeInOut' },
                }}
              >
                {sidebarItem === 'settings' || isSettingsOpen ? (
                  <SettingsView
                    settings={settings}
                    onChangeLiveSettings={(newSet) => setSettings(newSet)}
                    onSave={(newSet) => {
                      setSettings(newSet);
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('live_tv');
                    }}
                    onCancel={() => {
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('live_tv');
                    }}
                    onOpenDesignSystem={() => {
                      setIsSettingsOpen(false);
                      triggerTabLoading();
                      setSidebarItem('design_system');
                    }}
                    onOpenFeedback={() => setIsFeedbackOpen(true)}
                  />
              ) : sidebarItem === 'design_system' ? (
                  <DesignSystemViewer onOpenFeedback={() => setIsFeedbackOpen(true)} />
                ) : sidebarItem === 'search' ? (
                  <SearchChannelsView
                    channels={channelsList}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelectChannel={(ch) => {
                      handleSelectChannel(ch);
                      triggerTabLoading();
                      setSidebarItem('live_tv');
                    }}
                    recentlyWatched={recentlyWatched}
                  />
                ) : sidebarItem === 'home' ? (
                  /* HOME DASHBOARD VIEW */
                  <div className="space-y-3">
                    {/* YELLOW TIP PANEL BANNER */}
                    <div className="relative w-full bg-[#ffe866] overflow-hidden select-none">
                      <div className="relative z-10 py-1 px-3 text-center text-[#141414] font-jura font-bold text-[11px] sm:text-xs">
                        You are previewing a test version of Vplay.{' '}
                        <a
                          href="https://vplay-refresh.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-black hover:text-black/80"
                        >
                          Click here
                        </a>{' '}
                        to go to official version.
                      </div>
                    </div>

                    {/* SLIDING BANNER */}
                    <HomeBannerSlider
                      onExploreDesignSystem={() => {
                        triggerTabLoading();
                        setSidebarItem('design_system');
                      }}
                      onWatchNow={() => {
                        triggerTabLoading();
                        setSidebarItem('live_tv');
                      }}
                      onOpenFeedback={() => setIsFeedbackOpen(true)}
                    />

                  {/* RECOMMENDED CHANNELS SECTION */}
                  <div className="bg-[#35383b] border-2 border-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2d3033] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#89dc69] rounded-full animate-pulse" />
                        <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                          RECOMMENDED CHANNELS (KÊNH ĐỀ XUẤT)
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          triggerTabLoading();
                          setSidebarItem('live_tv');
                        }}
                        className="text-xs text-[#89dc69] font-bold hover:underline cursor-pointer"
                      >
                        [Xem tất cả kênh]
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {channelsList.slice(0, 5).map((channel, idx) => {
                        return (
                          <div
                            key={`rec-${channel.id}`}
                            onClick={() => {
                              playPopSound();
                              handleSelectChannel(channel);
                              triggerTabLoading();
                              setSidebarItem('live_tv');
                            }}
                            className="group bg-[#424548] border-2 border-[#141414] hover:border-[#89dc69] cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-md select-none active:translate-y-[2px] btn-press-effect"
                          >
                            <div className="relative aspect-[16/10] bg-[#1a1c1e] border-b-2 border-[#141414] flex items-center justify-center p-2 overflow-hidden">
                              {channel.logo ? (
                                <img
                                  src={channel.logo}
                                  alt={channel.name}
                                  referrerPolicy="no-referrer"
                                  className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/150/1c1d1f/89dc69?text=${encodeURIComponent(channel.name)}`;
                                  }}
                                />
                              ) : (
                                <span className="font-bold text-sm text-[#89dc69] font-mono">
                                  {channel.name}
                                </span>
                              )}
                              <span className="absolute top-1 left-1 bg-[#141414]/90 text-[#89dc69] text-[9px] font-bold px-1.5 py-0.5 border border-[#418a28]">
                                CH 0{idx + 1}
                              </span>
                            </div>
                            <div className="p-2 bg-[#2d3033] flex flex-col justify-center">
                              <span className="text-[11px] font-bold text-white truncate group-hover:text-[#89dc69]">
                                {channel.name}
                              </span>
                              <span className="text-[9px] text-gray-400 truncate">
                                {channel.groupTitle}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE TV FULL VIEW */
                <div className="space-y-6">
                  
                  {/* LIVE TV PLAYER */}
                  <section className="space-y-3">
                    <TvPlayer
                      channel={selectedChannel}
                      onSelectChannel={handleSelectChannel}
                      channels={channelsList}
                      settings={settings}
                      onUpdateSettings={setSettings}
                      onCreateCustomChannel={() => setIsCreateChannelOpen(true)}
                    />
                  </section>

              {/* GROUP FILTER TABS, ACTION BAR & CHANNELS GRID */}
              <section className="space-y-4 pt-2">
                {/* FULL WIDTH CREATE CUSTOM CHANNEL BUTTON */}
                <div className="w-full py-1">
                  <VplayPrimaryButton
                    onClick={() => setIsCreateChannelOpen(true)}
                    className="w-full !py-2.5 text-xs sm:text-sm tracking-wider flex justify-center items-center"
                  >
                    + Create custom channel
                  </VplayPrimaryButton>
                </div>

                {/* SEARCH BAR IN LIVE TV */}
                <div className="bg-[#3c3f42] border-2 border-[#141414] p-3 shadow-md">
                  <div className="relative flex items-center w-full">
                    <img
                      src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/MagnifyingGlass.png/revision/latest?cb=20260730091531"
                      alt="Search"
                      referrerPolicy="no-referrer"
                      className="absolute left-3 w-5 h-5 object-contain pointer-events-none z-10"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for channels"
                      className="w-full h-9.5 mc-input-box pl-10 pr-8 text-xs font-medium cursor-default"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-gray-400 hover:text-white font-bold text-xs p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Horizontal Scrollable Category Filter Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2d3033]">
                    {groupsList.map((grp) => (
                      <VplayTab
                        key={grp}
                        active={selectedGroup === grp}
                        onClick={() => setSelectedCategory(grp)}
                      >
                        {grp === 'all' ? `Tất cả (${channelsList.length})` : grp}
                      </VplayTab>
                    ))}
                  </div>
                </div>

                {/* CHANNELS GROUPED BY CATEGORY WITH ORE UI FOLDER TABS */}
                {(() => {
                  const categoryGroupsToDisplay = selectedGroup === 'all'
                    ? Array.from(new Set(filteredChannels.map((c) => c.groupTitle)))
                    : [selectedGroup];

                  if (filteredChannels.length === 0) {
                    return (
                      <div className="bg-[#292a2c] p-8 text-center border-2 border-[#141414] space-y-3">
                        <p className="text-sm font-bold text-yellow-400">KHÔNG TÌM THẤY KÊNH NÀO MATCH TỪ KHÓA</p>
                        <p className="text-xs text-gray-300">Thử tìm từ khóa khác hoặc bấm nút bên dưới để chọn lại toàn bộ kênh.</p>
                        <div className="w-48 mx-auto pt-2">
                          <VplaySecondaryButton onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                            XÓA TÌM KIẾM
                          </VplaySecondaryButton>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-8">
                      {categoryGroupsToDisplay.map((groupName) => {
                        const groupChannels = filteredChannels.filter((c) => c.groupTitle === groupName);
                        if (groupChannels.length === 0) return null;

                        return (
                          <div key={groupName} className="space-y-0">
                            {/* Folder Tab Header */}
                            <div className="flex flex-col select-none">
                              {/* Green Folder Tab Box */}
                              <div className="flex items-end">
                                <div className="bg-[#89dc69] text-[#141414] font-bold font-montserrat text-xs sm:text-sm px-3.5 py-1.5 flex items-center gap-2">
                                  <span>{groupName} ({groupChannels.length})</span>
                                </div>
                              </div>
                              {/* Green Underline Bar spanning across without black border */}
                              <div className="h-1 bg-[#89dc69] w-full" />
                            </div>

                            {/* Group Channels Grid Container */}
                            <div className="pt-3 sm:pt-4">
                              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                                {groupChannels.map((channel) => {
                                  const isSelected = selectedChannel.id === channel.id;
                                  return (
                                    <div
                                      key={channel.id}
                                      onClick={() => {
                                        playPopSound();
                                        handleSelectChannel(channel);
                                      }}
                                      className={`
                                        group relative bg-[#4c4f52] border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-xl select-none active:translate-y-[2px] btn-press-effect rounded-none
                                        ${isSelected ? 'border-[#418a28] shadow-[0_0_15px_rgba(65,138,40,0.4)]' : 'border-[#141414] hover:border-[#89dc69]'}
                                      `}
                                    >
                                      {/* TOP IMAGE AREA */}
                                      <div className="relative aspect-[16/10] bg-[#1a1c1e] border-b-2 border-[#141414] flex items-center justify-center p-1.5 sm:p-3 overflow-hidden">
                                        <svg
                                          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none text-[#45494e]"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                        >
                                          <defs>
                                            <pattern
                                              id={`wavy-pattern-${channel.id}`}
                                              x="0"
                                              y="0"
                                              width="32"
                                              height="12"
                                              patternUnits="userSpaceOnUse"
                                            >
                                              <path
                                                d="M 0 6 Q 8 0, 16 6 T 32 6"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                              />
                                            </pattern>
                                          </defs>
                                          <rect width="100%" height="100%" fill={`url(#wavy-pattern-${channel.id})`} />
                                        </svg>

                                        {channel.logo ? (
                                          <img
                                            src={channel.logo}
                                            alt={channel.name}
                                            referrerPolicy="no-referrer"
                                            className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-200 z-10"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/150/1c1d1f/89dc69?text=${encodeURIComponent(channel.name)}`;
                                            }}
                                          />
                                        ) : (
                                          <span className="font-extrabold text-xs sm:text-sm text-[#89dc69] tracking-wider font-mono uppercase z-10">{channel.name}</span>
                                        )}

                                        {isSelected && (
                                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-[#418a28] text-white px-1 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold border border-[#141414] font-mono shadow z-10">
                                            ● LIVE
                                          </div>
                                        )}
                                      </div>

                                      {/* MIDDLE CONTENT */}
                                      <div className="p-2 sm:p-3 bg-[#4c4f52] flex flex-col justify-between gap-1.5 sm:gap-2 flex-1">
                                        <div>
                                          <h3 className="font-bold text-xs sm:text-sm text-white truncate tracking-tight font-montserrat">
                                            {channel.name}
                                          </h3>
                                          <p className="text-[9px] sm:text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                                            {channel.currentProgram || 'Đang phát sóng'}
                                          </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
                                          <span className="bg-[#1c1d1f] text-white px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-montserrat border border-[#141414] shadow-sm truncate max-w-[70px] sm:max-w-none">
                                            {channel.groupTitle}
                                          </span>

                                          <span className="bg-[#ffe866] text-[#141414] px-1 sm:px-2 py-0.5 text-[8px] sm:text-[11px] font-bold font-montserrat border border-[#141414] shadow-sm">
                                            {String(channelsList.findIndex((c) => c.id === channel.id) + 1).padStart(3, '0')}
                                          </span>
                                        </div>
                                      </div>

                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </section>

            </div>
          )}
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* CREATE CUSTOM CHANNEL MODAL */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onAddChannel={handleAddChannel}
        categories={Array.from(new Set(channelsList.map((c) => c.groupTitle)))}
      />

      {/* DEBUG MODE VPLAY.LANG FILE EDITOR MODAL */}
      <DebugLanguageModal />

    </div>
  );
}
