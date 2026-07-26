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
      <div 
        className="w-full max-w-lg bg-[#3a3a3a] border-2 border-[#1e1e1e] shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-none overflow-hidden text-left font-sans text-white relative animate-in zoom-in-95 duration-150"
        style={{ borderRadius: "0px" }}
      >
        {/* Modal Header */}
        <div className="bg-[#2d2d2d] border-b-2 border-[#1e1e1e] px-4 py-3 flex items-center justify-between relative">
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
            style={{ borderRadius: "0px" }}
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide text-center font-mono uppercase">
            Gửi Ý Kiến Đóng Góp Vplay
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-300 hover:text-white p-1 cursor-pointer transition-none rounded-none active:translate-y-0.5"
            style={{ borderRadius: "0px" }}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 bg-[#388e3c] border-2 border-[#1b5e20] flex items-center justify-center text-white" style={{ borderRadius: "0px" }}>
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-mono font-bold text-base text-white uppercase">Cảm ơn bạn!</h4>
            <p className="text-xs text-zinc-300">Ý kiến đóng góp của bạn đã được gửi thành công đến đội ngũ Vplay.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="p-4 sm:p-5 space-y-4">
            {/* Subtitle / Description */}
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium bg-[#2d2d2d] p-3 border border-[#222222]" style={{ borderRadius: "0px" }}>
              Chúng tôi rất mong muốn nhận được ý kiến đóng góp của bạn về giao diện và trải nghiệm ứng dụng Vplay mới.
            </p>

            {/* Input Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-200 tracking-wider font-mono uppercase">
                Ý Kiến Của Bạn
              </label>

              <textarea
                required
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Nhập suy nghĩ, câu hỏi hoặc góp ý cải thiện của bạn tại đây..."
                style={{ borderRadius: "0px" }}
                className="w-full bg-[#242424] border-2 border-[#181818] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 rounded-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-sans resize-none"
              />

              <p className="text-[11px] text-zinc-400 italic">
                Phản hồi của bạn sẽ trực tiếp đóng góp vào các bản cập nhật Vplay tiếp theo.
              </p>
            </div>

            {/* Checkbox Section */}
            <div className="bg-[#2d2d2d] p-3 border border-[#222222] flex items-center gap-3" style={{ borderRadius: "0px" }}>
              <input
                type="checkbox"
                id="vplayDiagnosticCheckbox"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                style={{ borderRadius: "0px" }}
                className="w-4 h-4 bg-[#1e1e1e] border border-zinc-500 rounded-none accent-[#388e3c] cursor-pointer"
              />
              <label htmlFor="vplayDiagnosticCheckbox" className="text-xs text-zinc-200 cursor-pointer font-normal select-none">
                Đính kèm thông tin chẩn đoán trải nghiệm ứng dụng
              </label>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                style={{ borderRadius: "0px" }}
                className="bg-[#282828] text-zinc-200 hover:bg-[#323232] border-b-4 border-[#181818] active:border-b-0 active:translate-y-1 px-4 py-2.5 font-bold text-xs sm:text-sm shadow-md cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                style={{ borderRadius: "0px" }}
                className="ore-btn-green w-full px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4 text-white shrink-0" />
                <span>Gửi Ý Kiến</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
