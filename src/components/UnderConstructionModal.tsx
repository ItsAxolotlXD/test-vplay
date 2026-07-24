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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      {/* Bedrock / Ore UI Under Construction Dialog */}
      <div className="w-full max-w-3xl bg-[#313233] border-2 border-[#1e1e1f] shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center text-white font-sans relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header Title */}
        <h2 className="text-white text-lg sm:text-xl font-medium tracking-wide mb-4 sm:mb-6 font-mono">
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
        <p className="text-zinc-300 text-xs sm:text-sm my-4 sm:my-6 max-w-lg leading-relaxed">
          We're still working on this feature. Check back soon!
        </p>

        {/* 2-Button Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl mt-2">
          {/* Give Feedback Button */}
          <button
            onClick={handleGiveFeedback}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#dfdfdf] hover:bg-white active:bg-[#bebebe] text-black font-semibold text-xs sm:text-sm border-2 border-black/80 flex items-center justify-center gap-2 cursor-pointer transition-none shadow-md"
          >
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
            <span>Give Feedback</span>
          </button>

          {/* Go back to old UI Button */}
          <button
            onClick={handleGoBack}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#dfdfdf] hover:bg-white active:bg-[#bebebe] text-black font-semibold text-xs sm:text-sm border-2 border-black/80 flex items-center justify-center gap-2 cursor-pointer transition-none shadow-md"
          >
            <span>Go back to old UI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
