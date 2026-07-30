import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  forcedState?: ComponentState;
  fullWidth?: boolean;
}

export const VplayPrimaryButton: React.FC<VplayPrimaryButtonProps> = ({
  children = 'Primary button',
  forcedState,
  fullWidth = true,
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

  let bgClass = 'bg-[#418a28] text-white';
  let shadowClass = 'shadow-[inset_0_2px_0_#6bc34b,inset_0_-3px_0_#1e4511]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      bgClass = 'bg-[#51a233] text-white';
      shadowClass = 'shadow-[inset_0_2px_0_#89dc69,inset_0_-2px_0_#285718]';
      break;
    case 'pressed':
      bgClass = 'bg-[#2b611a] text-white';
      shadowClass = 'shadow-[inset_0_3px_0_#18370d,inset_0_-1px_0_#418a28]';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      bgClass = 'bg-[#7a7e82] text-[#4d5053] cursor-not-allowed';
      shadowClass = 'shadow-[inset_0_2px_0_#a0a4a8,inset_0_-3px_0_#505356]';
      break;
    case 'normal':
    default:
      bgClass = 'bg-[#418a28] text-white';
      shadowClass = 'shadow-[inset_0_2px_0_#6bc34b,inset_0_-3px_0_#1e4511]';
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
        border-2 border-[#181818] rounded-none cursor-pointer transition-colors duration-75
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
