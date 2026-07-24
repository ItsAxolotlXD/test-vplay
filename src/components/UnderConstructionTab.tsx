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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-transparent text-white text-center font-sans select-none my-4">
      {/* Bedrock / Ore UI Styled Under Construction Card */}
      <div className="w-full bg-[#313233] border-2 border-[#1e1e1f] rounded-none shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Title */}
        <h2 className="text-white text-xl sm:text-2xl font-medium tracking-wide mb-4 sm:mb-6 font-mono">
          Under construction
        </h2>

        {/* Pixel-art Scaled Asset */}
        <div className="w-full flex justify-center items-center my-2 sm:my-4">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/3/37/Load_not_done.png/revision/latest?cb=20260724133427"
            alt="Under Construction"
            referrerPolicy="no-referrer"
            className="max-w-full h-auto object-contain max-h-[220px] sm:max-h-[260px] block [image-rendering:pixelated]"
          />
        </div>

        {/* Updated Notice Text */}
        <p className="text-zinc-200 text-xs sm:text-sm my-4 sm:my-6 max-w-lg leading-relaxed font-sans">
          We are still working incredibly hard on this feature. Check back soon for updates!
        </p>

        {/* 2-Button Action Row with sharp corners (no rounded edges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl mt-2">
          <button
            onClick={handleGiveFeedback}
            className="w-full py-3 px-5 bg-[#dfdfdf] hover:bg-white active:bg-[#bebebe] text-black font-bold text-xs sm:text-sm border-2 border-black/80 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
          >
            <ExternalLink className="w-4 h-4 text-black shrink-0" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-5 bg-[#dfdfdf] hover:bg-white active:bg-[#bebebe] text-black font-bold text-xs sm:text-sm border-2 border-black/80 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
          >
            <X className="w-4 h-4 text-black shrink-0" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
