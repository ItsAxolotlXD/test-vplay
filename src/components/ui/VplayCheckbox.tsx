import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

interface VplayCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  forcedState?: ComponentState;
  forcedChecked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const VplayCheckbox: React.FC<VplayCheckboxProps> = ({
  checked = false,
  onChange,
  forcedState,
  forcedChecked,
  disabled,
  label,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isChecked = forcedChecked !== undefined ? forcedChecked : internalChecked;
  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;

  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const handleClick = () => {
    if (effectiveDisabled) return;
    playPopSound();
    const next = !isChecked;
    if (forcedChecked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  let boxClass = '';
  let checkColor = 'text-white';
  let transformClass = '';

  if (isChecked) {
    switch (state) {
      case 'hovered':
        boxClass = 'bg-[#51a233] shadow-[inset_0_1px_0_#89dc69]';
        break;
      case 'pressed':
        boxClass = 'bg-[#2b611a] shadow-[inset_0_2px_0_#18370d]';
        transformClass = 'translate-y-[1px]';
        break;
      case 'disabled':
        boxClass = 'bg-[#c8cbce] shadow-none cursor-not-allowed';
        checkColor = 'text-[#8c9196]';
        break;
      case 'normal':
      default:
        boxClass = 'bg-[#418a28] shadow-[inset_0_1px_0_#6bc34b]';
        break;
    }
  } else {
    switch (state) {
      case 'hovered':
        boxClass = 'bg-[#a3a8ad] shadow-[inset_0_1px_0_#c5cbcf]';
        break;
      case 'pressed':
        boxClass = 'bg-[#5a5e62] shadow-[inset_0_2px_0_#383b3e]';
        transformClass = 'translate-y-[1px]';
        break;
      case 'disabled':
        boxClass = 'bg-[#c8cbce] shadow-none cursor-not-allowed';
        break;
      case 'normal':
      default:
        boxClass = 'bg-[#8c9196] shadow-[inset_0_1px_0_#a8adb2]';
        break;
    }
  }

  return (
    <label
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`inline-flex items-center gap-2 cursor-pointer select-none active:translate-y-[1px] ${effectiveDisabled ? 'cursor-not-allowed opacity-90' : ''} ${className}`}
    >
      <div
        className={`
          w-6 h-6 sm:w-7 sm:h-7 border-2 border-[#141414] rounded-none flex items-center justify-center select-none p-0.5
          transition-all duration-75 ${boxClass} ${transformClass}
        `}
      >
        {isChecked && (
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/5/5d/Checkfcbxo.png/revision/latest?cb=20260728024540"
            alt="Checked"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain [image-rendering:pixelated]"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>
      {label && (
        <span className={`font-montserrat font-medium text-xs sm:text-sm ${effectiveDisabled ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </span>
      )}
    </label>
  );
};
