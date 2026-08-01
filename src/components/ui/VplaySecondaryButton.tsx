import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplaySecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'sm';
}

export const VplaySecondaryButton: React.FC<VplaySecondaryButtonProps> = ({
  children = 'Secondary button',
  forcedState,
  fullWidth = true,
  size = 'normal',
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

  let bgClass = 'bg-[#c6c6c6] text-[#404040]';
  let shadowClass = 'shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      bgClass = 'bg-[#28960b] text-white';
      shadowClass = 'shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]';
      break;
    case 'pressed':
      bgClass = 'bg-[#2b611a] text-white';
      shadowClass = 'shadow-[inset_2px_2px_0_#18370d,inset_-2px_-2px_0_#418a28]';
      transformClass = 'translate-y-[1px]';
      break;
    case 'disabled':
      bgClass = 'bg-[#7a7e82] text-[#4d5053] cursor-not-allowed';
      shadowClass = 'shadow-[inset_2px_2px_0_#a0a4a8,inset_-2px_-2px_0_#505356]';
      break;
    case 'normal':
    default:
      bgClass = 'bg-[#c6c6c6] text-[#404040]';
      shadowClass = 'shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91]';
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

  const isSmall = size === 'sm' || size === 'compact';
  const sizeClasses = isSmall
    ? 'text-xs font-bold py-1 px-3 h-8'
    : 'text-sm sm:text-base font-semibold py-3 px-6 h-12';

  return (
    <button
      disabled={effectiveDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      className={`
        relative select-none font-montserrat
        flex items-center justify-center active:translate-y-[2px] btn-press-effect
        border-2 border-[#181818] rounded-none cursor-pointer transition-none
        ${sizeClasses}
        ${bgClass} ${shadowClass} ${transformClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 w-full h-full">
        {children}
      </div>
    </button>
  );
};
