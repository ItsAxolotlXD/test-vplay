import React, { useState } from 'react';
import { playPopSound } from '../utils/sound';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert('Vui lòng nhập ý kiến đóng góp của bạn trước khi gửi.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText('');
      onClose();
      alert('Cảm ơn bạn đã gửi đóng góp ý kiến cho đội ngũ Vplay!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in overflow-y-auto">
      {/* Main Modal Box with WHITE OUTER BORDER */}
      <div className="bg-[#c6c6c6] border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-full max-w-md p-5 sm:p-6 text-[#1c1d1f] font-sans select-none flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header Title */}
        <h2 className="text-sm sm:text-base font-bold text-[#1c1d1f] tracking-wide mb-3 font-jura uppercase">
          Submit Feedback
        </h2>

        {/* Dark Inset Box with Black Outer Border + Sharp WHITE INNER BORDER */}
        <div className="bg-[#0e0e0e] border-2 border-[#141414] p-[2px] mb-4">
          <div className="border border-white/90 p-4 sm:p-5 text-white font-sans text-xs sm:text-sm space-y-3">
            <p className="text-gray-200 leading-relaxed font-normal">
              We would love to hear what you think of this brand new design experience. Feel free to share your thoughts with us.
            </p>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full bg-[#1c1e20] text-white p-3 text-xs sm:text-sm font-sans border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] placeholder:text-gray-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Green Primary Button wrapped in White Border Frame */}
          <div className="border-2 border-white p-[1px] bg-[#141414]">
            <button
              onClick={() => {
                playPopSound();
                handleSubmit();
              }}
              disabled={isSubmitted}
              className="w-full py-2.5 sm:py-3 px-4 bg-[#3eb82a] hover:bg-[#48c933] active:bg-[#2b871c] text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_0_2px_0_#89dc69,inset_0_-2px_0_#236315] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitted ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {/* Light Gray Secondary Button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#1c1d1f] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
