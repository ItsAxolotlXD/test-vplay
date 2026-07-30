import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayTabProps {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  forcedState?: ComponentState;
  forcedActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VplayTab: React.FC<VplayTabProps> = ({
  children = 'First tab',
  active = false,
  onClick,
  forcedState,
  forcedActive,
  disabled,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isActive = forcedActive !== undefined ? forcedActive : active;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let tabBg = isActive
    ? 'bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]'
    : 'bg-[#c6c6c6] text-[#404040] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91]';
  let borderClass = (isHovered || isActive) ? 'border-2 border-white' : 'border-2 border-[#141414]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      tabBg = isActive
        ? 'bg-[#31aa0e] text-white shadow-[inset_2px_2px_0_#a2f283,inset_-2px_-2px_0_#1b5e20]'
        : 'bg-[#28960b] text-[#d0d0d0] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]';
      borderClass = 'border-2 border-white';
      break;
    case 'pressed':
      tabBg = 'bg-[#2b611a] text-white shadow-[inset_2px_2px_0_#18370d,inset_-2px_-2px_0_#418a28]';
      borderClass = 'border-2 border-white';
      transformClass = 'translate-y-[1px]';
      break;
    case 'disabled':
      tabBg = 'bg-[#7a7e82] text-[#4d5053] cursor-not-allowed shadow-[inset_2px_2px_0_#a0a4a8,inset_-2px_-2px_0_#505356]';
      borderClass = 'border-2 border-[#141414]';
      break;
    case 'normal':
    default:
      break;
  }

  const handleClick = () => {
    if (effectiveDisabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => { if (!effectiveDisabled) { setIsPressed(true); playPopSound(); } }}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative px-4 py-2 min-w-[100px] flex items-center justify-center text-center font-jura font-bold text-xs sm:text-sm select-none
        rounded-none outline-none cursor-default btn-press-effect active:translate-y-[1px] transition-all duration-75
        ${borderClass} ${tabBg} ${transformClass} ${className}
      `}
    >
      <div className="relative inline-flex flex-col items-center max-w-full">
        <span className="truncate">
          {children}
        </span>
      </div>
    </button>
  );
};
