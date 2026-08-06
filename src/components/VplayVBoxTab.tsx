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
  Plus
} from "lucide-react";

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

  // Generate 100 random feedbacks upon mount (mỗi lần vào lại trang sẽ random, hiện tối đa 100 feedback)
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
      "Giao diện tối màu thực sự AMOLED đen tuyệt đối trên tivi",
      "Hỗ trợ chia sẻ màn hình trực tiếp lên Chromecast và Apple TV",
      "Cho phép lưu danh mục kênh ưa thích theo từng cá nhân",
      "Thêm chuyên mục nhạc trẻ xưa Lofi nghe cực chill về đêm",
      "Gợi ý chương trình tivi cá nhân hóa dựa trên thói quen hàng ngày",
      "Nâng cao tốc độ stream với serverCDN khu vực miền Nam",
      "Thêm widget xem nhanh lịch phát sóng ngày hôm nay ngoài màn hình",
      "Hỗ trợ phát âm thanh nền khi khóa màn hình điện thoại (Background Audio)"
    ];

    const issuesTemplates = [
      "Gặp lỗi giật khựng hình khi xem VTV3 HD vào khung giờ vàng",
      "Không thể tải danh sách kênh tivi trên Android TV Sony Box",
      "Mất âm thanh đột ngột khoảng 3 giây khi chuyển kênh Radio giải trí",
      "Lỗi vỡ bố cục thanh dock điều hướng trên dòng máy iPad Mini",
      "Ứng dụng hao pin cực nhanh sau khi cập nhật phiên bản 2.4.0",
      "Tính năng tìm kiếm bằng giọng nói tiếng Việt thi thoảng bị đứng hình",
      "Không lưu được danh sách kênh yêu thích sau khi xóa cookie trình duyệt",
      "Màn hình bị đen xì khi mở luồng phát trực tiếp thể thao trực tuyến",
      "Lỗi đứng hình khi bật Multiview xem đồng thời 3 kênh cùng lúc",
      "Thi thoảng bị văng ứng dụng đột ngột khi chuyển sang tab Thiết lập",
      "Thời tiết hiển thị sai lệch nhiệt độ so với thực tế 3-4 độ",
      "V-Intelligence bị lỗi không nhận diện được giọng nói vùng miền",
      "Thanh điều khiển âm lượng hệ thống bị đơ khi kéo nhanh bằng chuột",
      "Lỗi không mở được camera quét mã QR thanh toán hóa đơn Vplay",
      "Bị đứng logo Vplay khi khởi động từ trạng thái ngủ sâu",
      "Thi thoảng mất phụ đề tiếng Việt trên các kênh truyền hình quốc tế"
    ];

    const questionsTemplates = [
      "Làm cách nào để thanh toán gói cước Vplay VIP bằng ví điện tử Momo?",
      "Làm sao để kích hoạt giao diện Material Design 3 đẹp mắt trên di động?",
      "Danh sách thiết bị Smart TV nào được Vplay hỗ trợ chính thức?",
      "Mật danh V-Employee là gì và thuộc phòng ban nào?",
      "Tính năng Multiview hỗ trợ tối đa bao nhiêu màn hình cùng lúc?",
      "Làm thế nào để báo cáo lỗi bảo mật nhanh nhất đến đội ngũ quản trị?",
      "Lịch phát sóng các trận đấu Ngoại Hạng Anh cuối tuần xem ở đâu?",
      "Tôi có thể sử dụng một tài khoản Vplay trên bao nhiêu thiết bị?",
      "Vplay có hỗ trợ xem phim chiếu rạp bom tấn có bản quyền không?",
      "Tại sao chất lượng hình ảnh tự động giảm xuống HD khi mạng yếu?",
      "Làm thế nào để đổi ảnh đại diện tài khoản Vplay theo ý muốn?",
      "Ứng dụng có tốn nhiều băng thông dung lượng 3G/4G hàng tháng không?",
      "Có thể thiết lập mật khẩu khóa trẻ em cho các kênh đặc biệt không?"
    ];

    const devResponses = [
      "Cảm ơn bạn đã đóng góp ý kiến cực kỳ giá trị! V-Employee đã ghi nhận thông tin này và gửi trực tiếp tới nhóm kỹ sư phát triển tính năng. Hãy chờ đón bản cập nhật tiếp theo nhé!",
      "Rất xin lỗi bạn vì sự bất tiện này. Đội ngũ hạ tầng Vplay đã tối ưu lại tuyến băng thông và hệ thống máy chủ phát sóng. Lỗi giật lag này đã được xử lý triệt để.",
      "Chào bạn! Tính năng này hiện đã nằm trong kế hoạch phát triển chính thức cho phiên bản Vplay 2.5.0 ra mắt vào quý tới. Cảm ơn sự đồng hành của bạn!",
      "Cảm ơn phản hồi từ bạn. Để khắc phục nhanh nhất, bạn vui lòng cập nhật trình duyệt lên phiên bản mới nhất hoặc xóa bộ nhớ đệm cache của ứng dụng Vplay rồi thử lại nhé.",
      "Chào thành viên Vplay! Ban quản trị đã tiếp nhận và đang tiến hành kiểm tra mức độ tương thích trên thiết bị của bạn nhằm tối ưu hóa hiệu năng tốt nhất."
    ];

    const generateRandomId = (prefix: string) => {
      const digits = Math.floor(100000 + Math.random() * 900000);
      return `${prefix}-${digits}`;
    };

    const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const generatedList: VBoxFeedback[] = [];

    for (let i = 0; i < 100; i++) {
      const randType = Math.random();
      let type: "Question" | "Suggestion" | "Issue" = "Suggestion";
      let title = "";
      let prefix = "VFS";

      if (randType < 0.35) {
        type = "Question";
        title = getRandomElement(questionsTemplates);
        prefix = "VFQ";
      } else if (randType < 0.7) {
        type = "Issue";
        title = getRandomElement(issuesTemplates);
        prefix = "VFI";
      } else {
        type = "Suggestion";
        title = getRandomElement(suggestionsTemplates);
        prefix = "VFS";
      }

      // Add a random variation code to the title to make them look distinct
      const uniqueSuffix = ` #${100 + i}`;
      const finalTitle = title + (Math.random() > 0.6 ? uniqueSuffix : "");

      const description = `Mô tả chi tiết từ người dùng về nội dung: "${finalTitle}". Yêu cầu cải thiện hiệu năng, kiểm tra kỹ luồng dữ liệu truyền tải của dịch vụ Vplay để nâng tầm trải nghiệm truyền hình trực tuyến của cộng đồng.`;
      
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateString = date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });

      const feedbackId = generateRandomId(prefix);
      const rating = (type === "Suggestion" || type === "Issue") ? Math.floor(3 + Math.random() * 3) : undefined;
      const votes = Math.floor(1 + Math.random() * 250);

      // 80% chance of having a developer reply
      let response;
      if (Math.random() > 0.2) {
        const empNumber = Math.floor(100 + Math.random() * 900);
        const replyContent = getRandomElement(devResponses);
        const replyDate = new Date(date);
        replyDate.setHours(replyDate.getHours() + Math.floor(1 + Math.random() * 24));
        
        response = {
          employee: `V-Employee #${empNumber}`,
          content: replyContent,
          date: replyDate.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" })
        };
      }

      generatedList.push({
        id: feedbackId,
        title: finalTitle,
        description,
        type,
        dateCreated: dateString,
        rating,
        votes,
        userVoted: false,
        response
      });
    }

    setCommunityFeedbacks(generatedList);
  }, []);

  const handleVote = (id: string, isUserFeed: boolean) => {
    if (isUserFeed) {
      setUserFeedbacks(prev => prev.map(f => {
        if (f.id === id) {
          const nextVoted = !f.userVoted;
          return {
            ...f,
            userVoted: nextVoted,
            votes: f.votes + (nextVoted ? 1 : -1)
          };
        }
        return f;
      }));
    } else {
      setCommunityFeedbacks(prev => prev.map(f => {
        if (f.id === id) {
          const nextVoted = !f.userVoted;
          return {
            ...f,
            userVoted: nextVoted,
            votes: f.votes + (nextVoted ? 1 : -1)
          };
        }
        return f;
      }));
    }
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    let prefix = "VFS";
    if (newType === "Question") prefix = "VFQ";
    else if (newType === "Issue") prefix = "VFI";

    const digits = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `${prefix}-${digits}`;

    const currentDate = new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });

    // Auto response from developer after a split millisecond
    const empNumber = Math.floor(100 + Math.random() * 900);
    const generatedResponse = {
      employee: `V-Employee #${empNumber}`,
      content: `Vplay Developer [Mật danh ${empNumber}] đã nhận được đóng góp cá nhân của bạn về vấn đề: "${newTitle}". Đóng góp này đã được chuyển ngay sang Your Box riêng tư của bạn để theo dõi tiến độ xử lý và cập nhật giải pháp. Trân trọng cảm ơn!`,
      date: currentDate
    };

    const freshFeedback: VBoxFeedback = {
      id: generatedId,
      title: newTitle,
      description: newDescription,
      type: newType,
      dateCreated: currentDate,
      rating: newType !== "Question" ? newRating : undefined,
      votes: 1,
      userVoted: true,
      response: generatedResponse
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

    // Sort by votes (or date)
    return list.sort((a, b) => b.votes - a.votes);
  }, [currentFeedbacksList, searchQuery, typeFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-white font-sans text-left">
      {/* Banner Header - Ore UI Header Bar */}
      <div className="bg-[#2d2f32] border-2 border-[#141414] p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-[#c6c6c6] hover:bg-[#383b3e] hover:text-white text-[#141414] p-2 border-2 border-[#141414] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#898d91] active:translate-y-[1px] shrink-0"
              title="Trở về"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-jura">
                V-BOX FEEDBACK HUB
              </h1>
              <span className="bg-[#89dc69] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                Hòm thư & Ý kiến
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Đóng góp ý kiến, phản hồi lỗi và đặt câu hỏi cho đội ngũ Vplay Developers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-bold text-xs uppercase font-jura tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Phản Hồi Mới
        </button>
      </div>

      {/* Main layout */}
      <main className="w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation & Filters Panel */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Sub-Tabs Selector */}
          <div className="bg-[#2d2f32] p-2 border-2 border-[#141414] flex gap-1 shadow-xl">
            <button
              onClick={() => setActiveSubTab("community")}
              className={`flex-1 py-2 text-xs font-bold font-jura uppercase transition-all cursor-pointer border-2 border-[#141414] ${
                activeSubTab === "community"
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#383b3e] text-zinc-300 hover:text-white"
              }`}
            >
              Community Box
            </button>
            <button
              onClick={() => setActiveSubTab("your")}
              className={`flex-1 py-2 text-xs font-bold font-jura uppercase transition-all cursor-pointer border-2 border-[#141414] relative ${
                activeSubTab === "your"
                  ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                  : "bg-[#383b3e] text-zinc-300 hover:text-white"
              }`}
            >
              Your Box
              {userFeedbacks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[9px] font-bold w-4 h-4 border border-[#141414] flex items-center justify-center font-mono">
                  {userFeedbacks.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="bg-[#2d2f32] p-4 border-2 border-[#141414] space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-jura flex items-center gap-1.5 border-b-2 border-[#141414] pb-2">
              <Filter className="w-3.5 h-3.5 text-[#89dc69]" />
              Lọc theo Mã hiệu
            </h3>

            <div className="flex flex-col gap-1.5 font-jura">
              {[
                { id: "All", label: "Tất cả phản hồi" },
                { id: "VFQ", label: "VFQ - Câu hỏi" },
                { id: "VFS", label: "VFS - Góp ý" },
                { id: "VFI", label: "VFI - Báo lỗi" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id as any)}
                  className={`px-3 py-2 text-xs font-bold border-2 border-[#141414] transition-all text-left flex items-center justify-between cursor-pointer ${
                    typeFilter === filter.id
                      ? "bg-[#cc1827] text-white shadow-[inset_2px_2px_0_#ff6b6b,inset_-2px_-2px_0_#7a0000]"
                      : "bg-[#383b3e] hover:bg-[#4a4d50] text-zinc-200"
                  }`}
                >
                  <span>{filter.label}</span>
                  {typeFilter === filter.id && <CheckCircle2 className="w-3 h-3" />}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-700/50 text-[11px] text-zinc-400 leading-relaxed font-jura">
              * Hệ thống V-Box hiển thị tối đa 100 phản hồi ngẫu nhiên từ cộng đồng mỗi lần bạn truy cập trang.
            </div>
          </div>
        </div>

        {/* Feedback List & Search */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[#2d2f32] border-2 border-[#141414] px-3 py-2 shadow-xl">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder={`Tìm kiếm tiêu đề, mã hiệu hoặc nội dung trong ${activeSubTab === "community" ? "Community Box" : "Your Box"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-zinc-400 focus:outline-none font-jura"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-zinc-400 hover:text-white cursor-pointer transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Feedback Feed Cards */}
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-[#2d2f32] border-2 border-[#141414] py-12 text-center flex flex-col items-center justify-center p-6 shadow-xl">
              <Box className="w-12 h-12 text-zinc-500 mb-2" />
              <h3 className="text-xs font-bold text-zinc-200 font-jura uppercase">Không tìm thấy phản hồi nào</h3>
              <p className="text-[11px] text-zinc-400 max-w-sm mt-1 font-jura">Điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm các ý kiến khác.</p>
              {activeSubTab === "your" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white font-bold text-xs uppercase font-jura tracking-wider shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] cursor-pointer"
                >
                  Gửi phản hồi đầu tiên của bạn
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedbacks.map((feedback) => (
                <div 
                  key={feedback.id}
                  className="bg-[#2d2f32] border-2 border-[#141414] p-4 text-left flex flex-col gap-3 relative shadow-xl font-jura"
                >
                  {/* Card Top: Code badges & Date */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-[#141414] bg-[#1a1b1d] text-[#89dc69]">
                        {feedback.id}
                      </span>

                      <span className="text-[9px] font-bold px-2 py-0.5 border border-[#141414] uppercase flex items-center gap-1 bg-[#383b3e] text-zinc-200">
                        {feedback.type === "Question" && <HelpCircle className="w-3 h-3 text-[#89dc69]" />}
                        {feedback.type === "Suggestion" && <Lightbulb className="w-3 h-3 text-amber-400" />}
                        {feedback.type === "Issue" && <AlertCircle className="w-3 h-3 text-rose-400" />}
                        {feedback.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400 text-[11px] font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{feedback.dateCreated}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {feedback.title}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {feedback.description}
                    </p>
                  </div>

                  {/* Ratings (Only for VFS / VFI) */}
                  {feedback.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">Mức độ ưu tiên:</span>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star 
                          key={index} 
                          className={`w-3 h-3 ${
                            index < (feedback.rating || 0) 
                              ? "text-amber-400 fill-current" 
                              : "text-zinc-600"
                          }`} 
                        />
                      ))}
                    </div>
                  )}

                  {/* Developer Response Block */}
                  {feedback.response && (
                    <div className="bg-[#1f2022] p-3 border-2 border-[#141414] flex flex-col gap-1.5 relative">
                      <div className="flex items-center justify-between text-[11px] border-b border-[#141414] pb-1">
                        <span className="font-bold text-[#89dc69] uppercase tracking-wider flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-[#89dc69]" />
                          Phản hồi của {feedback.response.employee} (Developer)
                        </span>
                        <span className="text-zinc-400 font-mono text-[10px]">{feedback.response.date}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed italic font-sans">
                        "{feedback.response.content}"
                      </p>
                    </div>
                  )}

                  {/* Card Bottom: Upvote buttons */}
                  <div className="border-t-2 border-[#141414] pt-2.5 flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-[#141414] bg-[#383b3e] flex items-center justify-center text-zinc-300">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-zinc-400 font-jura">Ẩn danh</span>
                    </div>

                    <button
                      onClick={() => handleVote(feedback.id, activeSubTab === "your")}
                      className={`px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 border-[#141414] font-jura ${
                        feedback.userVoted
                          ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                          : "bg-[#383b3e] hover:bg-[#4a4d50] text-zinc-200"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${feedback.userVoted ? "fill-current text-white" : ""}`} />
                      <span>Đồng tình ({feedback.votes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CREATE FEEDBACK MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#2d2f32] border-4 border-[#141414] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-left font-jura">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#1f2022] border-b-2 border-[#141414] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-[#89dc69]" />
                Gửi ý kiến đóng góp Vplay
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 border border-[#141414] bg-[#383b3e] hover:bg-[#4a4d50] text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateFeedback} className="p-4 space-y-4">
              
              {/* Type Switch */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">Loại phản hồi</label>
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
                      className={`py-1.5 px-1 text-xs font-bold border-2 border-[#141414] transition-all text-center cursor-pointer ${
                        newType === btn.type
                          ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                          : "bg-[#383b3e] text-zinc-300 hover:bg-[#4a4d50]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">Tiêu đề ngắn gọn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lỗi gián đoạn khi xem VTV3 tối thứ bảy..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  maxLength={100}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">Nội dung mô tả chi tiết</label>
                <textarea
                  placeholder="Hãy mô tả rõ hơn về lỗi gặp phải, các bước gây lỗi, hoặc tính năng mong muốn bổ sung..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#1f2022] border-2 border-[#141414] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none h-24 resize-none"
                  required
                />
              </div>

              {/* Rating Star Selector (Only for Suggestion or Issue) */}
              {newType !== "Question" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">Mức độ khẩn cấp / Ưu tiên</label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewRating(index + 1)}
                        className="p-1 cursor-pointer"
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            index < newRating 
                              ? "text-amber-400 fill-current" 
                              : "text-zinc-600"
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-zinc-300 font-bold ml-2">
                      {newRating === 1 ? "Rất thấp" : newRating === 2 ? "Thấp" : newRating === 3 ? "Bình thường" : newRating === 4 ? "Cao" : "Rất khẩn cấp!"}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t-2 border-[#141414] mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-[#383b3e] hover:bg-[#4a4d50] text-zinc-200 text-xs font-bold border-2 border-[#141414] cursor-pointer text-center"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#28960b] hover:bg-[#32b312] border-2 border-[#141414] text-white text-xs font-bold uppercase tracking-wider cursor-pointer text-center flex items-center justify-center gap-2 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
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
