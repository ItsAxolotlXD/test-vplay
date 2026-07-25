import React from "react";
import { ExternalLink } from "lucide-react";

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGiveFeedback?: () => void;
  onGoBackToOldUI?: () => void;
}

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
  isOpen,
  onClose,
  onGiveFeedback,
  onGoBackToOldUI,
}) => {
  if (!isOpen) return null;

  const handleGiveFeedback = () => {
    if (onGiveFeedback) {
      onGiveFeedback();
    } else {
      const feedback = prompt("Cảm ơn bạn! Hãy nhập góp ý của bạn cho tính năng này:");
      if (feedback) {
        alert("Cảm ơn bạn đã gửi phản hồi!");
      }
    }
  };

  const handleGoBack = () => {
    if (onGoBackToOldUI) {
      onGoBackToOldUI();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/0 backdrop-blur-none p-4 select-none">
      {/* Transparent Under Construction Dialog (0% Opacity Background) */}
      <div className="w-full max-w-3xl bg-transparent border-0 shadow-none p-6 sm:p-10 flex flex-col items-center text-center text-white relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header Title */}
        <h2 className="text-white text-lg sm:text-xl font-bold tracking-wide mb-4 sm:mb-6 uppercase">
          Under construction
        </h2>

        {/* Scaled Native Image Asset */}
        <div className="w-full flex justify-center items-center my-2 sm:my-4">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/3/37/Load_not_done.png/revision/latest?cb=20260724133427"
            alt="Under Construction"
            referrerPolicy="no-referrer"
            className="max-w-full h-auto object-contain max-h-[220px] sm:max-h-[260px] block [image-rendering:pixelated]"
          />
        </div>

        {/* Subtitle description */}
        <p className="text-zinc-200 text-xs sm:text-sm my-4 sm:my-6 max-w-lg leading-relaxed">
          We're still working on this feature. Check back soon!
        </p>

        {/* 2-Button Action Row - White WATCH NOW style buttons with black text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl mt-2">
          {/* Give Feedback Button */}
          <button
            onClick={handleGiveFeedback}
            className="w-full h-11 py-3 px-6 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-bold text-xs sm:text-sm uppercase tracking-wider border-b-4 border-zinc-400 active:border-b-0 active:translate-y-1 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-md"
          >
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
            <span>Give Feedback</span>
          </button>

          {/* Go back to old UI Button */}
          <button
            onClick={handleGoBack}
            className="w-full h-11 py-3 px-6 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-bold text-xs sm:text-sm uppercase tracking-wider border-b-4 border-zinc-400 active:border-b-0 active:translate-y-1 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-md"
          >
            <span>Go back to old UI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
