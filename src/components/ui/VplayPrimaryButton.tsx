import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  variant?: 'primary' | 'purple';
}

export const VplayPrimaryButton: React.FC<VplayPrimaryButtonProps> = ({
  children = 'Primary button',
  forcedState,
  fullWidth = true,
  variant = 'primary',
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let bgClass = variant === 'purple' ? 'bg-purple-600 text-white' : 'bg-[#28960b] text-white';
  let shadowClass = variant === 'purple'
    ? 'shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#3b0764]'
    : 'shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      bgClass = variant === 'purple' ? 'bg-purple-500 text-white' : 'bg-[#2eb00d] text-white';
      shadowClass = variant === 'purple'
        ? 'shadow-[inset_2px_2px_0_#e9d5ff,inset_-2px_-2px_0_#581c87]'
        : 'shadow-[inset_2px_2px_0_#a2f285,inset_-2px_-2px_0_#1f6e24]';
      break;
    case 'pressed':
      bgClass = variant === 'purple' ? 'bg-purple-800 text-white' : 'bg-[#2b611a] text-white';
      shadowClass = variant === 'purple'
        ? 'shadow-[inset_2px_2px_0_#3b0764,inset_-2px_-2px_0_#9333ea]'
        : 'shadow-[inset_2px_2px_0_#18370d,inset_-2px_-2px_0_#418a28]';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      bgClass = 'bg-[#7a7e82] text-[#4d5053] cursor-not-allowed';
      shadowClass = 'shadow-[inset_2px_2px_0_#a0a4a8,inset_-2px_-2px_0_#505356]';
      break;
    case 'normal':
    default:
      bgClass = variant === 'purple' ? 'bg-purple-600 text-white' : 'bg-[#28960b] text-white';
      shadowClass = variant === 'purple'
        ? 'shadow-[inset_2px_2px_0_#c084fc,inset_-2px_-2px_0_#3b0764]'
        : 'shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]';
      break;
  }

  const handleMouseDown = () => {
    if (!effectiveDisabled) {
      setIsPressed(true);
      playPopSound();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effectiveDisabled) return;
    onClick?.(e);
  };

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      className={`
        relative select-none font-montserrat text-sm sm:text-base font-bold
        py-2.5 px-6 h-11 flex items-center justify-center active:translate-y-[2px] btn-press-effect
        border-2 border-[#181818] rounded-none cursor-pointer transition-none
        ${bgClass} ${shadowClass} ${transformClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
        {children}
      </span>
    </button>
  );
};
