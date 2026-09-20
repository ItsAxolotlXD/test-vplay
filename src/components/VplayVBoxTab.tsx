import React, { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  Box, 
  AlertCircle, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Send, 
  Star, 
  User, 
  Clock, 
  Filter, 
  MessageCircle, 
  ThumbsUp,
  X,
  Plus,
  Sparkles
} from "lucide-react";
import { playPopSound, playWinSound } from "../utils/sound";

export interface VBoxFeedback {
  id: string; // VFQ-XXXXXX, VFS-XXXXXX, VFI-XXXXXX
  title: string;
  description: string;
  type: "Question" | "Suggestion" | "Issue";
  dateCreated: string;
  rating?: number; // 1 to 5, only for VFS and VFI
  votes: number;
  userVoted: boolean;
  response?: {
    employee: string;
    content: string;
    date: string;
  };
}

interface VplayVBoxTabProps {
  onBack?: () => void;
}

export default function VplayVBoxTab({ onBack }: VplayVBoxTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"community" | "your">("community");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "VFQ" | "VFS" | "VFI">("All");
  
  // Create Feedback state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"Question" | "Suggestion" | "Issue">("Suggestion");
  const [newDescription, setNewDescription] = useState("");
  const [newRating, setNewRating] = useState<number>(5);

  // Community Feedbacks (generated once when visited/mounted)
  const [communityFeedbacks, setCommunityFeedbacks] = useState<VBoxFeedback[]>([]);
  
  // User created feedbacks (persisted in localStorage for durability)
  const [userFeedbacks, setUserFeedbacks] = useState<VBoxFeedback[]>(() => {
    const saved = localStorage.getItem("vplay_user_feedbacks");
    return saved ? JSON.parse(saved) : [];
  });

  // Save user feedbacks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("vplay_user_feedbacks", JSON.stringify(userFeedbacks));
  }, [userFeedbacks]);

  // Generate 100 random feedbacks upon mount
  useEffect(() => {
    const suggestionsTemplates = [
      "Thêm kênh HBO, Cinemax bản quyền chuẩn nét căng",
      "Tối ưu hóa độ trễ khi xem bóng đá trực tiếp chất lượng 4K",
      "Hỗ trợ HDR và Dolby Vision cho Smart TV Sony đời cũ",
      "Thêm tính năng hẹn giờ tự động tắt ứng dụng ban đêm",
      "Cho phép tùy chỉnh chất lượng âm thanh Dolby Atmos 5.1",
      "Hỗ trợ tính năng tải trước và xem offline ngoại tuyến",
      "Thêm phụ đề song ngữ Anh - Việt cho toàn bộ kênh VTV",
      "Tích hợp phím tắt nhanh chuyển giao diện WinUI 3 mượt mà hơn",
      "Cải tiến V-Intelligence AI có phản hồi phản xạ nhanh hơn nữa",
      "Hỗ trợ đồng bộ hóa lịch chiếu phim trực tuyến lên Google Calendar",
      "Bổ sung chế độ tiết kiệm pin tối đa khi chạy 4G/5G trên điện thoại",
      "Thêm tính năng xem cùng bạn bè Watch Party qua V-Chat",
      "Tối ưu hóa dung lượng bộ nhớ đệm cache khi phát video dài",
      "Bổ sung kho nhạc Lossless chất lượng cao vào V-Box Media"
    ];

    const issuesTemplates = [
      "Lỗi phụ đề bị lệch 1-2 giây trên kênh thể thao K+ lúc 20:00",
      "Âm thanh bị ngắt quãng khi chuyển qua lại giữa các kênh VTV",
      "Không lưu lại được danh sách yêu thích khi xóa cache trình duyệt",
      "Màn hình bị nháy đen 0.5s khi bật chế độ toàn màn hình",
      "Tốc độ tải chậm vào khung giờ cao điểm 19:30 tối",
      "Không nhận diện được giọng nói tiếng Việt giọng miền Trung",
      "Nút tua nhanh 10 giây thỉnh thoảng bị kẹt trên Smart TV LG",
      "Lỗi hiển thị tên kênh bị tràn viền ở màn hình tỷ lệ 21:9",
      "Ứng dụng tự động thoát khi phát video định dạng HEVC",
      "Không cập nhật được lịch phát sóng EPG ngày mai"
    ];

    const questionsTemplates = [
      "Làm sao để đăng ký gói tài khoản gia đình Family Plan?",
      "Vplay có hỗ trợ truyền hình ảnh AirPlay và Chromecast không?",
      "Khi nào sẽ có bản cập nhật giao diện V-Flow tiếp theo?",
      "Làm cách nào để đổi mật khẩu tài khoản Vplay ID?",
      "Có thể xem đồng thời trên bao nhiêu thiết bị cùng lúc?",
      "Chính sách bảo mật dữ liệu người dùng của Vplay quy định ra sao?",
      "Vplay có kế hoạch hỗ trợ hệ điều hành Tizen OS trên Samsung TV không?",
      "Làm thế nào để báo cáo nội dung vi phạm bản quyền trên nền tảng?",
      "Gói cước VIP có được miễn phí toàn bộ phim rạp chiếu mới không?"
    ];

    const generated: VBoxFeedback[] = [];

    for (let i = 1; i <= 100; i++) {
      const typeRand = Math.random();
      let type: "Question" | "Suggestion" | "Issue" = "Suggestion";
      let prefix = "VFS";
      let titlePool = suggestionsTemplates;
      let rating: number | undefined = Math.floor(Math.random() * 3) + 3; // 3 to 5 stars

      if (typeRand < 0.35) {
        type = "Question";
        prefix = "VFQ";
        titlePool = questionsTemplates;
        rating = undefined; // Questions do not have rating
      } else if (typeRand < 0.7) {
        type = "Issue";
        prefix = "VFI";
        titlePool = issuesTemplates;
        rating = Math.floor(Math.random() * 4) + 2; // 2 to 5 stars
      }

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const id = `${prefix}-${randomNum}`;
      const title = titlePool[Math.floor(Math.random() * titlePool.length)];
      const votes = Math.floor(Math.random() * 150) + 1;
      
      const day = Math.floor(Math.random() * 28) + 1;
      const month = Math.floor(Math.random() * 12) + 1;
      const dateCreated = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      let description = "";
      if (type === "Question") {
        description = "Tôi muốn tìm hiểu kỹ hơn về tính năng này để sử dụng hiệu quả trên TV gia đình. Nhờ đội ngũ hỗ trợ kỹ thuật Vplay giải đáp chi tiết.";
      } else if (type === "Suggestion") {
        description = "Đề xuất này sẽ giúp trải nghiệm người dùng tiện lợi và thân thiện hơn rất nhiều nếu được cập nhật vào phiên bản sắp tới.";
      } else {
        description = "Lỗi này xảy ra khá thường xuyên khi sử dụng mạng wifi thông thường. Mong đội ngũ kỹ sư kiểm tra và sớm khắc phục bản vá.";
      }

      let response;
      if (Math.random() > 0.6) {
        const staff = ["An Nguyễn", "Tuấn Lê", "Minh Trần", "Hương Đỗ", "Đức Vũ"][Math.floor(Math.random() * 5)];
        const respText = type === "Question" 
          ? "Cảm ơn bạn đã gửi câu hỏi! Tính năng này đã sẵn sàng và bạn có thể kích hoạt trong phần Cài đặt > Tùy chọn hệ thống nhé."
          : type === "Suggestion"
          ? "Ý kiến đóng góp rất giá trị! Đội ngũ phát triển Vplay đã đưa mục này vào lộ trình nâng cấp quý tới."
          : "Chào bạn, đội ngũ kỹ thuật đã tái hiện được lỗi này và đang gấp rút phát hành bản cập nhật sửa lỗi trong 48h tới.";
        
        response = {
          employee: staff,
          content: respText,
          date: `2025-${month.toString().padStart(2, '0')}-${Math.min(day + 1, 28).toString().padStart(2, '0')}`
        };
      }

      generated.push({
        id,
        title,
        description,
        type,
        dateCreated,
        rating,
        votes,
        userVoted: false,
        response
      });
    }

    setCommunityFeedbacks(generated);
  }, []);

  // Handle vote toggle
  const handleVote = (id: string, isUserList: boolean) => {
    playPopSound();
    if (isUserList) {
      setUserFeedbacks(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            votes: f.userVoted ? f.votes - 1 : f.votes + 1,
            userVoted: !f.userVoted
          };
        }
        return f;
      }));
    } else {
      setCommunityFeedbacks(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            votes: f.userVoted ? f.votes - 1 : f.votes + 1,
            userVoted: !f.userVoted
          };
        }
        return f;
      }));
    }
  };

  // Handle creating new feedback
  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;
    playWinSound();

    let prefix = "VFS";
    if (newType === "Question") prefix = "VFQ";
    if (newType === "Issue") prefix = "VFI";

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `${prefix}-${randomNum}`;
    const today = new Date().toISOString().split("T")[0];

    const freshFeedback: VBoxFeedback = {
      id: newId,
      title: newTitle.trim(),
      description: newDescription.trim(),
      type: newType,
      dateCreated: today,
      rating: newType !== "Question" ? newRating : undefined,
      votes: 1,
      userVoted: true,
    };

    setUserFeedbacks(prev => [freshFeedback, ...prev]);

    // Reset Form & Close
    setNewTitle("");
    setNewDescription("");
    setNewType("Suggestion");
    setNewRating(5);
    setShowCreateModal(false);

    // Swap to Your Box to view the newly created feedback
    setActiveSubTab("your");
  };

  // Filter and Search logic
  const currentFeedbacksList = activeSubTab === "community" ? communityFeedbacks : userFeedbacks;

  const filteredFeedbacks = useMemo(() => {
    let list = [...currentFeedbacksList];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f => 
        f.title.toLowerCase().includes(q) || 
        f.description.toLowerCase().includes(q) || 
        f.id.toLowerCase().includes(q)
      );
    }

    // Prefix Type filter
    if (typeFilter !== "All") {
      list = list.filter(f => f.id.startsWith(typeFilter));
    }

    // Sort by votes
    return list.sort((a, b) => b.votes - a.votes);
  }, [currentFeedbacksList, searchQuery, typeFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-6 select-none pb-16 text-white">
      {/* 1. TOP HEADER - V-FLOW STYLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2D2D38]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 border border-[#3E3D4D] transition-all cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                V-Box
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  HÒM THƯ & Ý KIẾN
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Đóng góp ý kiến, phản hồi lỗi và bình chọn tính năng cùng cộng đồng Vplay
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPopSound();
            setShowCreateModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Phản Hồi Mới
        </button>
      </div>

      {/* 2. SUB-TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-2 bg-[#1F1E24] p-1.5 rounded-2xl border border-[#2D2D38]">
          <button
            onClick={() => {
              playPopSound();
              setActiveSubTab("community");
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === "community"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Community Box ({communityFeedbacks.length})
          </button>
          <button
            onClick={() => {
              playPopSound();
              setActiveSubTab("your");
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer relative ${
              activeSubTab === "your"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Hòm Thư Của Bạn
            {userFeedbacks.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500 text-zinc-950 font-mono">
                {userFeedbacks.length}
              </span>
            )}
          </button>
        </div>

        {/* Search & Filter pills */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-80 h-[44px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0">
            <Search className="w-4.5 h-4.5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. TYPE FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: "All", label: "Tất cả phản hồi" },
          { id: "VFQ", label: "VFQ • Câu hỏi" },
          { id: "VFS", label: "VFS • Góp ý tính năng" },
          { id: "VFI", label: "VFI • Báo cáo lỗi" }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              playPopSound();
              setTypeFilter(filter.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              typeFilter === filter.id
                ? "bg-[#2D2D38] text-amber-300 border border-amber-500/40 shadow-sm"
                : "bg-[#1F1E24] text-zinc-400 hover:text-white border border-[#2D2D38]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* 4. FEEDBACK LIST */}
      {filteredFeedbacks.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] text-center space-y-3">
          <Box className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">Không tìm thấy phản hồi nào</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm các ý kiến khác từ cộng đồng.
          </p>
          {activeSubTab === "your" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold cursor-pointer"
            >
              Gửi phản hồi đầu tiên của bạn
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3D3D4E] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#18171E] text-amber-300 border border-[#2D2D38]">
                      {feedback.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-white/5 text-zinc-300">
                      {feedback.type === "Question" && <HelpCircle className="w-3 h-3 text-emerald-400" />}
                      {feedback.type === "Suggestion" && <Lightbulb className="w-3 h-3 text-amber-400" />}
                      {feedback.type === "Issue" && <AlertCircle className="w-3 h-3 text-rose-400" />}
                      {feedback.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{feedback.dateCreated}</span>
                  </div>
                </div>

                {/* Title & Desc */}
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{feedback.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{feedback.description}</p>
                </div>

                {/* Star rating if any */}
                {feedback.rating !== undefined && (
                  <div className="flex items-center gap-1 pt-1">
                    <span className="text-[10px] text-zinc-500 font-medium">Mức độ ưu tiên:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (feedback.rating || 0) ? "text-amber-400 fill-current" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Staff Response */}
                {feedback.response && (
                  <div className="p-3 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Phản hồi từ {feedback.response.employee} (Developer)
                      </span>
                      <span className="text-zinc-500 font-mono">{feedback.response.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 italic">"{feedback.response.content}"</p>
                  </div>
                )}
              </div>

              {/* Bottom footer: user & vote */}
              <div className="pt-3 border-t border-[#2D2D38] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <User className="w-3.5 h-3.5" />
                  <span>Ẩn danh</span>
                </div>

                <button
                  onClick={() => handleVote(feedback.id, activeSubTab === "your")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    feedback.userVoted
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                      : "bg-[#18171E] hover:bg-[#262530] text-zinc-300 border border-[#2D2D38]"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${feedback.userVoted ? "fill-current" : ""}`} />
                  <span>Đồng tình ({feedback.votes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE FEEDBACK MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#1F1E24] border border-[#343440] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left">
            <div className="p-4 border-b border-[#2D2D38] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                Gửi Ý Kiến Đóng Góp Vplay
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="p-5 space-y-4">
              {/* Type Switch */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Loại phản hồi</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "Suggestion", label: "Góp ý (VFS)" },
                    { type: "Issue", label: "Báo lỗi (VFI)" },
                    { type: "Question", label: "Câu hỏi (VFQ)" }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => setNewType(btn.type as any)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all text-center cursor-pointer border ${
                        newType === btn.type
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md"
                          : "bg-[#18171E] text-zinc-400 border-[#2D2D38] hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Tiêu đề ngắn gọn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đề xuất thêm tính năng lịch phát sóng bóng đá..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
                  maxLength={100}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Nội dung chi tiết</label>
                <textarea
                  placeholder="Mô tả cụ thể về trải nghiệm hoặc tính năng mong muốn..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#18171E] border border-[#2D2D38] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 h-24 resize-none"
                  required
                />
              </div>

              {/* Star rating */}
              {newType !== "Question" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Mức độ ưu tiên</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewRating(index + 1)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            index < newRating ? "text-amber-400 fill-current" : "text-zinc-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-zinc-400 ml-2">
                      {newRating === 1
                        ? "Rất thấp"
                        : newRating === 2
                        ? "Thấp"
                        : newRating === 3
                        ? "Bình thường"
                        : newRating === 4
                        ? "Cao"
                        : "Rất khẩn cấp!"}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-[#2D2D38]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2A2933] hover:bg-[#34333F] text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
