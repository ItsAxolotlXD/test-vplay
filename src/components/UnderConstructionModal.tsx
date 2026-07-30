import React, { useState } from "react";
import { ChevronLeft, X, Send, Check } from "lucide-react";

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
  const [feedbackText, setFeedbackText] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    if (onGiveFeedback) {
      onGiveFeedback();
    }
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      {/* Main Modal Box with WHITE OUTER BORDER */}
      <div 
        className="w-full max-w-md bg-[#c6c6c6] border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-5 sm:p-6 text-[#1c1d1f] font-sans relative animate-in zoom-in-95 duration-150"
      >
        {/* Header Title */}
        <h2 className="text-sm sm:text-base font-bold text-[#1c1d1f] tracking-wide mb-3 font-jura uppercase">
          Gửi Ý Kiến Đóng Góp Vplay
        </h2>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-6 bg-[#0e0e0e] border-2 border-[#141414] flex flex-col items-center justify-center text-center space-y-3 my-2">
            <div className="border border-white/90 p-4 w-full flex flex-col items-center">
              <div className="w-12 h-12 bg-[#388e3c] border-2 border-[#1b5e20] flex items-center justify-center text-white mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-jura font-bold text-base text-white uppercase">Cảm ơn bạn!</h4>
              <p className="text-xs text-gray-300">Ý kiến đóng góp của bạn đã được gửi thành công đến đội ngũ Vplay.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-3">
            {/* Dark Inset Box with Black Outer Border + Sharp WHITE INNER BORDER */}
            <div className="bg-[#0e0e0e] border-2 border-[#141414] p-[2px]">
              <div className="border border-white/90 p-4 sm:p-5 text-white font-sans text-xs sm:text-sm space-y-3 font-normal">
                <p className="text-gray-200 leading-relaxed">
                  Chúng tôi rất mong muốn nhận được ý kiến đóng góp của bạn về giao diện và trải nghiệm ứng dụng Vplay mới.
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-300 uppercase font-jura">
                    Ý Kiến Của Bạn
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Nhập suy nghĩ, câu hỏi hoặc góp ý cải thiện của bạn tại đây..."
                    className="w-full bg-[#1c1e20] text-white p-3 text-xs sm:text-sm font-sans border-2 border-[#141414] focus:outline-none focus:border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] placeholder:text-gray-500 resize-none"
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="vplayDiagnosticCheckbox"
                    checked={isCheckboxChecked}
                    onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                    className="w-4 h-4 bg-[#1c1e20] border border-gray-500 accent-[#3eb82a] cursor-pointer"
                  />
                  <label htmlFor="vplayDiagnosticCheckbox" className="text-[11px] text-gray-300 cursor-pointer select-none">
                    Đính kèm thông tin chẩn đoán trải nghiệm ứng dụng
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {/* Green Primary Button wrapped in White Frame */}
              <div className="border-2 border-white p-[1px] bg-[#141414]">
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 px-4 bg-[#3eb82a] hover:bg-[#48c933] active:bg-[#2b871c] text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_0_2px_0_#89dc69,inset_0_-2px_0_#236315] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4 text-white shrink-0" />
                  <span>Gửi Ý Kiến</span>
                </button>
              </div>

              {/* Light Gray Secondary Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#c6c6c6] hover:bg-[#28960b] active:bg-[#2b611a] text-[#1c1d1f] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wide font-jura border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] hover:shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
