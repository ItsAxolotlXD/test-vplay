import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X, ChevronLeft, Check, Send } from "lucide-react";
import { VplaySecondaryButton } from "./ui/VplaySecondaryButton";

interface UnderConstructionTabProps {
  onClose: () => void;
  onGiveFeedback?: () => void;
}

export const UnderConstructionTab: React.FC<UnderConstructionTabProps> = ({
  onClose,
  onGiveFeedback,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleOpenFeedback = () => {
    if (onGiveFeedback) {
      onGiveFeedback();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsModalOpen(false);
    setFeedbackText("");
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4 flex flex-col items-center justify-center bg-transparent text-white text-center select-none my-2 relative">
      {/* Toast Notification rendered via Portal to body */}
      {showSuccessToast && createPortal(
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000000] bg-[#388e3c] border-2 border-[#1b5e20] text-white px-6 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200" style={{ borderRadius: "0px" }}>
          <Check className="w-5 h-5 text-white shrink-0" />
          <span className="font-normal text-sm">Thank you! Your feedback has been submitted successfully.</span>
        </div>,
        document.body
      )}

      {/* Transparent Under Construction Card (0% Opacity Background) */}
      <div className="w-full bg-transparent border-0 rounded-none shadow-none p-2 sm:p-4 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Title */}
        <h2 className="text-white text-lg sm:text-xl font-bold tracking-wide mb-2 sm:mb-3 uppercase">
          Under construction
        </h2>

        {/* Pixel-art Scaled Asset - Enlarged */}
        <div className="w-full flex justify-center items-center my-3 sm:my-4">
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/3/37/Load_not_done.png/revision/latest?cb=20260724133427"
            alt="Under Construction"
            referrerPolicy="no-referrer"
            className="max-w-full h-auto object-contain h-[180px] sm:h-[220px] md:h-[260px] block [image-rendering:pixelated]"
          />
        </div>

        {/* Notice Text */}
        <p className="text-zinc-200 text-sm sm:text-base my-3 sm:my-4 max-w-xl leading-relaxed font-semibold">
          We are still working incredibly hard on this feature. Check back soon for updates!
        </p>

        {/* 2-Button Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg mt-3">
          <VplaySecondaryButton
            onClick={handleOpenFeedback}
            fullWidth={true}
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span>Give Feedback</span>
          </VplaySecondaryButton>

          <VplaySecondaryButton
            onClick={onClose}
            fullWidth={true}
          >
            <X className="w-5 h-5 shrink-0" />
            <span>Close</span>
          </VplaySecondaryButton>
        </div>
      </div>

      {/* FEEDBACK POPUP MODAL (Always on top overlay rendered via Portal directly to body) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#3a3a3a] border-2 border-[#1e1e1e] shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-none overflow-hidden text-left font-sans text-white select-none relative animate-in zoom-in-95 duration-150" style={{ borderRadius: "0px" }}>
            
            {/* Modal Header */}
            <div className="bg-[#2d2d2d] border-b-2 border-[#1e1e1e] px-4 py-3 flex items-center justify-between relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
                style={{ borderRadius: "0px" }}
                title="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide text-center font-mono">
                Submit Feedback
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
                style={{ borderRadius: "0px" }}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleConfirmFeedback} className="p-4 sm:p-5 space-y-4">
              
              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium bg-[#2d2d2d] p-3 border border-[#222222]">
                We would love to hear what do you think of our new interface experience so far. Feel free to share your thoughts!
              </p>

              {/* Input Section */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-200 tracking-wider font-mono">
                  Your Feedback
                </label>

                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Type your thoughts or suggestions here..."
                  style={{ borderRadius: "0px" }}
                  className="w-full bg-[#242424] border-2 border-[#181818] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 rounded-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-sans resize-none"
                />

                <p className="text-[11px] text-zinc-400 italic">
                  Your feedback helps us continuously improve our app experience.
                </p>
              </div>

              {/* Checkbox Section */}
              <div className="bg-[#2d2d2d] p-3 border border-[#222222] flex items-center gap-3" style={{ borderRadius: "0px" }}>
                <input
                  type="checkbox"
                  id="diagnosticCheckbox"
                  checked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                  style={{ borderRadius: "0px" }}
                  className="w-4 h-4 bg-[#1e1e1e] border border-zinc-500 rounded-none accent-[#388e3c] cursor-pointer"
                />
                <label htmlFor="diagnosticCheckbox" className="text-xs text-zinc-200 cursor-pointer font-normal select-none">
                  Check example for confirmation
                </label>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-2.5 pt-2">
                {/* Green Confirm Button */}
                <button
                  type="submit"
                  className="ore-btn-green w-full h-11 py-2.5 px-4 text-white font-normal text-sm rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span className="font-normal">Confirm</span>
                </button>

                {/* White Close Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ore-btn-white w-full h-11 py-2.5 px-4 text-black font-normal text-sm rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4 text-black shrink-0" />
                  <span className="text-black font-normal">Close</span>
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

