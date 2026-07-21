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
  onBack: () => void;
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
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 text-left">
      {/* Sticky Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30 px-4 py-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer border border-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-red-500" />
                V-Box Feedback Hub
              </h1>
              <p className="text-xs text-zinc-400 font-medium">Hòm thư đóng góp ý kiến, phản hồi lỗi và đặt câu hỏi cho đội ngũ Vplay Developers</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#cc1827] hover:bg-[#b01420] text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            Tạo phản hồi mới
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation & Filters Panel */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Sub-Tabs Selector */}
          <div className="bg-zinc-900 rounded-2xl p-2 border border-zinc-800/80 flex gap-1">
            <button
              onClick={() => setActiveSubTab("community")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeSubTab === "community"
                  ? "bg-[#cc1827] text-white shadow-md shadow-red-900/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Community Box
            </button>
            <button
              onClick={() => setActiveSubTab("your")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer relative ${
                activeSubTab === "your"
                  ? "bg-[#cc1827] text-white shadow-md shadow-red-900/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Your Box
              {userFeedbacks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-zinc-900">
                  {userFeedbacks.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
              <Filter className="w-3.5 h-3.5 text-red-500" />
              Lọc theo Mã hiệu
            </h3>

            <div className="flex flex-col gap-1.5">
              {[
                { id: "All", label: "Tất cả phản hồi", color: "bg-zinc-800 text-zinc-300" },
                { id: "VFQ", label: "VFQ - Câu hỏi", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
                { id: "VFS", label: "VFS - Góp ý", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
                { id: "VFI", label: "VFI - Báo lỗi", color: "bg-rose-500/10 text-rose-400 border border-rose-500/20" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    typeFilter === filter.id
                      ? "bg-[#cc1827] text-white shadow-md shadow-red-900/20"
                      : "bg-zinc-800 hover:bg-zinc-750 text-zinc-300"
                  }`}
                >
                  <span>{filter.label}</span>
                  {typeFilter === filter.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 leading-relaxed font-medium">
              * Hệ thống V-Box hiển thị tối đa 100 phản hồi ngẫu nhiên từ cộng đồng mỗi lần bạn truy cập trang.
            </div>
          </div>
        </div>

        {/* Feedback List & Search */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl px-4 py-3 shadow-md">
            <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="w-5 h-5 shrink-0 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
            <input
              type="text"
              placeholder={`Tìm kiếm tiêu đề, mã hiệu hoặc nội dung trong ${activeSubTab === "community" ? "Community Box" : "Your Box"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-medium"
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
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800/80 py-16 text-center flex flex-col items-center justify-center p-6">
              <Box className="w-14 h-14 text-zinc-800 mb-3" />
              <h3 className="text-sm font-bold text-zinc-300">Không tìm thấy phản hồi nào</h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">Điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm các ý kiến khác.</p>
              {activeSubTab === "your" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 bg-[#cc1827] hover:bg-[#b01420] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Gửi phản hồi đầu tiên của bạn
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <div 
                  key={feedback.id}
                  className="bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-5 hover:border-zinc-700/50 transition-all text-left flex flex-col gap-4 relative shadow-sm hover:shadow-md"
                >
                  {/* Card Top: Code badges & Date */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border ${
                        feedback.id.startsWith("VFQ")
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : feedback.id.startsWith("VFS")
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {feedback.id}
                      </span>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        feedback.type === "Question"
                          ? "bg-emerald-950/40 text-emerald-400"
                          : feedback.type === "Suggestion"
                            ? "bg-amber-950/40 text-amber-400"
                            : "bg-rose-950/40 text-rose-400"
                      }`}>
                        {feedback.type === "Question" && <HelpCircle className="w-3 h-3" />}
                        {feedback.type === "Suggestion" && <Lightbulb className="w-3 h-3" />}
                        {feedback.type === "Issue" && <AlertCircle className="w-3 h-3" />}
                        {feedback.type === "Question" ? "Question" : feedback.type === "Suggestion" ? "Suggestion" : "Issue"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{feedback.dateCreated}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                      {feedback.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {feedback.description}
                    </p>
                  </div>

                  {/* Ratings (Only for VFS / VFI) */}
                  {feedback.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">Mức độ ưu tiên:</span>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star 
                          key={index} 
                          className={`w-3.5 h-3.5 ${
                            index < (feedback.rating || 0) 
                              ? "text-amber-500 fill-current" 
                              : "text-zinc-700"
                          }`} 
                        />
                      ))}
                    </div>
                  )}

                  {/* Developer Response Block */}
                  {feedback.response && (
                    <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 flex flex-col gap-2 relative">
                      <div className="absolute top-0 left-6 -translate-y-1/2 w-3 h-3 bg-zinc-950 rotate-45 border-t border-l border-zinc-800/50" />
                      
                      <div className="flex items-center justify-between text-[11px] border-b border-zinc-800 pb-1.5 mb-0.5">
                        <span className="font-extrabold text-[#cc1827] uppercase tracking-wider flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-red-500" />
                          Phản hồi của {feedback.response.employee} (Developer)
                        </span>
                        <span className="text-zinc-500 font-mono font-medium">{feedback.response.date}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed italic">
                        "{feedback.response.content}"
                      </p>
                    </div>
                  )}

                  {/* Card Bottom: Upvote buttons */}
                  <div className="border-t border-zinc-800/60 pt-3.5 flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <User className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                      <span className="text-xs text-zinc-400 font-medium">Ẩn danh</span>
                    </div>

                    <button
                      onClick={() => handleVote(feedback.id, activeSubTab === "your")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        feedback.userVoted
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-800"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${feedback.userVoted ? "fill-current text-red-400" : ""}`} />
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-800 flex flex-col animate-fade-in text-left">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-red-500" />
                Gửi ý kiến đóng góp Vplay
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateFeedback} className="p-6 space-y-4.5">
              
              {/* Type Switch */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Loại phản hồi</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "Suggestion", label: "Góp ý (VFS)", color: "border-amber-500/40 text-amber-400" },
                    { type: "Issue", label: "Báo lỗi (VFI)", color: "border-rose-500/40 text-rose-400" },
                    { type: "Question", label: "Câu hỏi (VFQ)", color: "border-emerald-500/40 text-emerald-400" }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => setNewType(btn.type as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center cursor-pointer ${
                        newType === btn.type
                          ? "bg-[#cc1827] text-white border-transparent shadow-md"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Tiêu đề ngắn gọn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lỗi gián đoạn khi xem VTV3 tối thứ bảy..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  maxLength={100}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Nội dung mô tả chi tiết</label>
                <textarea
                  placeholder="Hãy mô tả rõ hơn về lỗi gặp phải, các bước gây lỗi, hoặc tính năng mong muốn được bổ sung nâng cấp..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 h-28 resize-none"
                  required
                />
              </div>

              {/* Rating Star Selector (Only for Suggestion or Issue) */}
              {newType !== "Question" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Mức độ khẩn cấp / Ưu tiên</label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewRating(index + 1)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            index < newRating 
                              ? "text-amber-500 fill-current" 
                              : "text-zinc-700"
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-zinc-400 font-extrabold ml-2">
                      {newRating === 1 ? "Rất thấp" : newRating === 2 ? "Thấp" : newRating === 3 ? "Bình thường" : newRating === 4 ? "Cao" : "Rất khẩn cấp!"}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-zinc-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black rounded-xl transition-all cursor-pointer text-center"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#cc1827] hover:bg-[#b01420] text-white text-xs font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-md shadow-red-900/10"
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
