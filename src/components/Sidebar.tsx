import React from 'react';
import { playPopSound } from '../utils/sound';
import { VplayTab } from './ui/VplayTab';
import { useLang } from '../context/LanguageContext';

export type SidebarMenuItem = 'home' | 'live_tv' | 'search' | 'settings' | 'design_system';

interface SidebarProps {
  activeItem: SidebarMenuItem;
  onSelectItem: (item: SidebarMenuItem) => void;
  onOpenFeedback?: () => void;
  className?: string;
  channelCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onSelectItem,
  className = '',
  channelCount = 98,
}) => {
  const { t } = useLang();

  const menuItems: { id: SidebarMenuItem; label: string; badge?: string }[] = [
    { id: 'home', label: t('header.home', 'Home') },
    { id: 'live_tv', label: t('header.live', 'Live TV'), badge: `(${channelCount})` },
    { id: 'settings', label: t('header.settings', 'Settings') },
  ];

  // Navigate left/right with bumper brackets
  const handlePrevTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    onSelectItem(menuItems[prevIndex].id);
  };

  const handleNextTab = () => {
    playPopSound();
    const currentIndex = menuItems.findIndex((m) => m.id === activeItem);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    onSelectItem(menuItems[nextIndex].id);
  };

  return (
    <nav className={`w-full select-none ${className}`}>
      {/* Horizontal Tab Bar Container matching Minecraft Realm Hub layout */}
      <div className="bg-[#2a2c2e] border-2 border-[#141414] p-1 shadow-lg flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        
        {/* Left Bumper Bracket [ */}
        <button
          onClick={handlePrevTab}
          title="Previous Tab"
          aria-label="Previous Tab"
          className="hidden sm:flex items-center justify-center bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#404040] hover:text-white font-bold font-jura text-xs px-2.5 py-2 border-2 border-[#141414] hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex-shrink-0 cursor-default active:translate-y-[1px]"
        >
          [
        </button>

        {/* Tab Items */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => {
            const isSelected = activeItem === item.id;
            return (
              <VplayTab
                key={item.id}
                active={isSelected}
                onClick={() => onSelectItem(item.id)}
                className="flex-1 !min-w-[90px] sm:!min-w-[120px] !py-1.5"
              >
                <span className="flex items-center justify-center gap-1">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] sm:text-xs font-bold ${isSelected ? 'text-[#a2f283]' : 'text-[#505050]'}`}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </VplayTab>
            );
          })}
        </div>

        {/* Right Bumper Bracket ] */}
        <button
          onClick={handleNextTab}
          title="Next Tab"
          aria-label="Next Tab"
          className="hidden sm:flex items-center justify-center bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#404040] hover:text-white font-bold font-jura text-xs px-2.5 py-2 border-2 border-[#141414] hover:border-white shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] flex-shrink-0 cursor-default active:translate-y-[1px]"
        >
          ]
        </button>

      </div>
    </nav>
  );
};
