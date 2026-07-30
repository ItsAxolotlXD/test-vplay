import React, { useState } from 'react';
import { ComponentState } from '../../types';

interface VplayInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  forcedState?: ComponentState;
  disabled?: boolean;
  className?: string;
}

export const VplayInputBox: React.FC<VplayInputBoxProps> = ({
  label = 'Label',
  description = 'Description',
  forcedState,
  disabled,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) => {
  const [internalVal, setInternalVal] = useState(value || '');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const effectiveDisabled = forcedState ? forcedState === 'disabled' : disabled;
  const state: ComponentState = forcedState || (
    effectiveDisabled ? 'disabled' :
    isPressed ? 'pressed' :
    isHovered ? 'hovered' : 'normal'
  );

  let inputBg = 'mc-input-box';
  let borderClass = 'border-2 border-[#141414]';

  switch (state) {
    case 'hovered':
      inputBg = 'mc-input-box !bg-[#555555]';
      break;
    case 'pressed':
      inputBg = 'mc-input-box !bg-[#3e3e3e]';
      break;
    case 'disabled':
      inputBg = 'bg-[#7a7e82] text-[#4d5053] cursor-not-allowed border-2 border-[#141414] shadow-[inset_2px_2px_0_#a0a4a8,inset_-2px_-2px_0_#505356]';
      break;
    case 'normal':
    default:
      inputBg = 'mc-input-box';
      break;
  }

  return (
    <div className={`w-full max-w-lg bg-[#36383b] p-3 border border-[#232527] rounded-none ${className}`}>
      {label && (
        <label className={`block font-montserrat font-medium text-xs mb-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-white'}`}>
          {label}
        </label>
      )}

      <input
        disabled={effectiveDisabled}
        value={value !== undefined ? value : internalVal}
        onChange={(e) => {
          setInternalVal(e.target.value);
          onChange?.(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        placeholder={placeholder}
        className={`
          w-full h-9 px-3 font-jura text-xs sm:text-sm outline-none rounded-none transition-colors duration-75 cursor-default
          placeholder:text-[#a0a0a0] focus:outline-none focus:border-white focus:border-2
          ${borderClass} ${inputBg}
        `}
        {...props}
      />

      {description && (
        <p className={`font-montserrat text-[11px] mt-1.5 select-none ${state === 'disabled' ? 'text-[#8c9196]' : 'text-[#a0a5aa]'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
