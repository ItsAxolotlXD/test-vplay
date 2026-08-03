import React, { useState } from 'react';
import { Check, X, Vote } from 'lucide-react';
import { playPopSound } from '../utils/sound';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface FeatureVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureVoteModal: React.FC<FeatureVoteModalProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVote = (option: string) => {
    playPopSound();
    setSelectedOption(option);
    setIsVoted(true);
  };

  const options = [
    { id: 'multiview', name: 'Multiview Channels', desc: 'Xem nhiều kênh cùng lúc trên một màn hình' },
    { id: 'record', name: 'Record Channels', desc: 'Ghi lại chương trình yêu thích để xem lại sau' },
    { id: 'pip', name: 'Picture-in-Picture', desc: 'Thu nhỏ video để vừa xem vừa lướt web' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none font-jura animate-fadeIn">
      {/* Outer Panel Container with Ore UI frame styling */}
      <div className="bg-[#2d2f32] text-white border-4 border-[#141414] shadow-[inset_2px_2px_0_#4a4d52,inset_-2px_-2px_0_#1e2022] w-full max-w-md p-5 sm:p-6 space-y-4 relative">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b-2 border-[#141414] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shadow-[inset_1px_1px_0_#89dc69]">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-jura drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Vote for a Vplay Features
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-7 h-7 bg-[#212325] hover:bg-[#28960b] hover:text-white text-zinc-400 border-2 border-[#141414] flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle Message */}
        <div className="bg-[#1e2022] border-2 border-[#141414] p-3 shadow-[inset_2px_2px_0_#101112]">
          <p className="text-xs sm:text-sm text-amber-300 font-bold leading-relaxed">
            You have 3 options and can only choose one. Choose wisely!
          </p>
        </div>

        {/* Success / Feedback Toast if Voted */}
        {isVoted && selectedOption && (
          <div className="bg-[#28960b] text-white text-xs font-bold p-3 border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>You voted for <strong>{selectedOption}</strong>! Thank you for your vote.</span>
            </div>
          </div>
        )}

        {/* 3 Voting Buttons List */}
        <div className="space-y-2.5 pt-1">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.name;
            return (
              <div key={opt.id} className="w-full">
                <VplaySecondaryButton
                  onClick={() => handleVote(opt.name)}
                  className={`!py-3 !px-4 text-left justify-start group relative transition-all ${
                    isSelected ? '!bg-[#28960b] !text-white !shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] border-2 border-white' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-extrabold text-xs sm:text-sm tracking-wide">
                        {opt.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] opacity-80 font-normal">
                        {opt.desc}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="bg-[#141414]/30 px-2 py-0.5 text-[10px] font-bold border border-white text-white">
                        VOTED ✓
                      </span>
                    )}
                  </div>
                </VplaySecondaryButton>
              </div>
            );
          })}
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 border-t-2 border-[#141414]">
          <VplaySecondaryButton
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-full !py-2 text-xs font-bold uppercase tracking-wider"
          >
            Close
          </VplaySecondaryButton>
        </div>

      </div>
    </div>
  );
};
