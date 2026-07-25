import React from "react";
import { ExternalLink, X } from "lucide-react";

interface UnderConstructionTabProps {
  onClose: () => void;
  onGiveFeedback?: () => void;
}

export const UnderConstructionTab: React.FC<UnderConstructionTabProps> = ({
  onClose,
  onGiveFeedback,
}) => {
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

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4 flex flex-col items-center justify-center bg-transparent text-white text-center select-none my-2">
      {/* Transparent Under Construction Card (0% Opacity Background) */}
      <div className="w-full bg-transparent border-0 rounded-none shadow-none p-2 sm:p-4 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Title */}
        <h2 className="text-white text-lg sm:text-xl font-bold tracking-wide mb-2 sm:mb-3 uppercase">
          Under construction
        </h2>

        {/* Pixel-art Scaled Asset - Compact Height */}
        <div className="w-full flex justify-center items-center my-1 sm:my-2">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/3/37/Load_not_done.png/revision/latest?cb=20260724133427"
            alt="Under Construction"
            referrerPolicy="no-referrer"
            className="max-w-full h-auto object-contain max-h-[110px] sm:max-h-[140px] block [image-rendering:pixelated]"
          />
        </div>

        {/* Notice Text */}
        <p className="text-zinc-200 text-xs sm:text-sm my-2 sm:my-3 max-w-lg leading-relaxed">
          We are still working incredibly hard on this feature. Check back soon for updates!
        </p>

        {/* 2-Button Action Row - White WATCH NOW style buttons with black text, normal sentence case */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-md mt-2">
          <button
            onClick={handleGiveFeedback}
            className="w-full h-10 py-2 px-5 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-bold text-xs sm:text-sm border-b-4 border-zinc-400 active:border-b-0 active:translate-y-1 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-md"
          >
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 py-2 px-5 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-bold text-xs sm:text-sm border-b-4 border-zinc-400 active:border-b-0 active:translate-y-1 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-md"
          >
            <X className="w-4 h-4 text-black shrink-0" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
