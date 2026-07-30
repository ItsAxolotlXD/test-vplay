import React, { useState } from 'react';
import { ComponentState } from '../../types';
import { playPopSound } from '../../utils/sound';

export interface DropdownOption {
  value: string;
  label: string;
}

interface VplayDropdownProps {
  label?: string;
  options?: DropdownOption[];
  value?: string;
  onChange?: (val: string) => void;
  forcedState?: ComponentState;
  disabled?: boolean;
  className?: string;
}

export const VplayDropdown: React.FC<VplayDropdownProps> = ({
  label = 'Label',
  options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
  ],
  value = 'one',
  onChange,
  forcedState,
  disabled,
  className = '',
}) => {
  const [selected, setSelected] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  const selectedOption = options.find((o) => o.value === selected) || options[0];

  let btnBg = 'bg-[#cdd1d4] text-[#1c1d1f]';
  let shadowClass = 'shadow-[inset_0_2px_0_#f4f6f8,inset_0_-3px_0_#9ea2a6]';
  let transformClass = '';

  switch (state) {
    case 'hovered':
      btnBg = 'bg-[#ffffff] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_2px_0_#ffffff,inset_0_-2px_0_#b5b9bd]';
      break;
    case 'pressed':
      btnBg = 'bg-[#abafb3] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_3px_0_#898d91,inset_0_-1px_0_#cdd1d4]';
      transformClass = 'translate-y-[2px]';
      break;
    case 'disabled':
      btnBg = 'bg-[#bdc1c5] text-[#7c8084] cursor-not-allowed';
      shadowClass = 'shadow-[inset_0_2px_0_#d8dcde,inset_0_-3px_0_#9ea2a6]';
      break;
    case 'normal':
    default:
      btnBg = 'bg-[#cdd1d4] text-[#1c1d1f]';
      shadowClass = 'shadow-[inset_0_2px_0_#f4f6f8,inset_0_-3px_0_#9ea2a6]';
      break;
  }

  return (
    <div className={`w-full max-w-lg bg-[#36383b] p-3 border border-[#232527] rounded-none relative ${className}`}>
      {label && (
        <label className="block text-white font-montserrat font-medium text-xs mb-1.5 select-none">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={effectiveDisabled}
        onClick={() => {
          if (!effectiveDisabled && !forcedState) {
            setIsOpen(!isOpen);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => { if (!effectiveDisabled) { setIsPressed(true); playPopSound(); } }}
        onMouseUp={() => setIsPressed(false)}
        className={`
          relative w-full h-10 px-4 flex items-center justify-between font-montserrat text-xs sm:text-sm font-semibold select-none
          border-2 border-[#141414] rounded-none transition-colors duration-75 active:translate-y-[2px] btn-press-effect cursor-pointer
          ${btnBg} ${shadowClass} ${transformClass}
        `}
      >
        <span>{selectedOption?.label || 'Select'}</span>
        <span className="text-xs font-bold">▼</span>
      </button>

      {isOpen && !effectiveDisabled && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-[#222426] border-2 border-white z-50 shadow-2xl">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                playPopSound();
                setSelected(opt.value);
                onChange?.(opt.value);
                setIsOpen(false);
              }}
              className={`
                px-4 py-2 font-montserrat text-xs font-medium cursor-pointer select-none border-b border-[#333] last:border-b-0
                ${selected === opt.value ? 'bg-[#418a28] text-white' : 'text-gray-200 hover:bg-[#36383b] hover:text-white'}
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
