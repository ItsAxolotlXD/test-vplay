import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, Flame, Check, Sparkles } from "lucide-react";
import { Channel } from "../data/channels";

// Simulated real-time comments contextualized by group/category
const COMMENT_TEMPLATES: Record<string, string[]> = {
  vtv: [
    "Thời sự trực tiếp xem mượt quá!",
    "Bản tin hôm nay nhiều thông tin hữu ích ghê",
    "Kênh VTV nét căng đét",
    "Sóng Vplay xem ổn định dã man",
    "Thời sự 19h chuẩn bị chiếu rồi anh em",
    "Chào mọi người đang xem truyền hình nhé!",
    "App Vplay đỉnh thật sự, tiện lợi vô cùng",
    "Vừa ăn cơm vừa xem thời sự là chuẩn bài",
    "Có ai đang hóng bản tin dự báo thời tiết không?",
    "Chúc cả nhà buổi tối vui vẻ!"
  ],
  sports: [
    "VÀOOOO!!! Hay quá ae ơi! 🎉",
    "Đá đỉnh cao thực sự!",
    "Hồi hộp dã man, cố lên Việt Nam!",
    "Pha bóng đẳng cấp thế nhờ",
    "Kênh thể thao mượt đét, không bị giật tí nào",
    "Sút căng quá, tí nữa thì vào!",
    "Hôm nay ai bình luận trận này thế mọi người?",
    "Trọng tài bắt hơi bị công tâm đấy nha",
    "Kèo này ai thắng đây anh em?",
    "Vplay trực tiếp bóng đá xịn ghê"
  ],
  movies: [
    "Phim hay quá! Có ai biết lịch chiếu lại không?",
    "Diễn viên này đóng đạt ghê",
    "Phim tên gì thế cả nhà yêu ơi?",
    "Hóng tập ngày mai quá đi mất",
    "Kênh phim truyền hình đặc sắc ghê",
    "Nội dung bánh cuốn thực sự",
    "Màu phim đẹp dã man",
    "Lâu lắm mới xem lại bộ phim cảm xúc thế này",
    "VTVcab chiếu phim đỉnh thật"
  ],
  general: [
    "Chào cả nhà đang xem trực tuyến nha! 👋",
    "Đường truyền mượt mà xem rất sướng",
    "App xịn sò dã man, cám ơn đội ngũ phát triển!",
    "Mọi người xem có bị giật không? Mình xem mượt cực",
    "Kênh này phát chương trình gì thế nhỉ?",
    "Thiết kế giao diện đẹp và hiện đại quá",
    "10 điểm cho chất lượng âm thanh và hình ảnh",
    "Xem tivi miễn phí thế này tiện lợi ghê",
    "Vplay là số 1 nha cả nhà",
    "Chúc mọi người một ngày làm việc học tập vui vẻ!"
  ]
};

const VIRTUAL_USERS = [
  "tuấn_vtv", "khánh_linh", "hoàng_giang_hn", "vplay_fan_cứng",
  "minh_tâm_99", "thùy_trang_vtv1", "quang_anh_sport", "ngọc_bích_hp",
  "đức_trung_bouncy", "hải_yến_sh", "trường_giang_vo", "phương_nam_vtv3"
];

const USER_GRADIENTS = [
  "from-blue-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-red-500 to-pink-500"
];

interface CommentItem {
  id: string;
  username: string;
  colorClass: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

interface LiveCommentsProps {
  channel: Channel;
  isMaterialDesignActive?: boolean;
}

export default function LiveComments({ channel, isMaterialDesignActive = false }: LiveCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userNickname, setUserNickname] = useState(() => {
    return localStorage.getItem("vplay_comment_name") || "Khách Vô Danh";
  });
  const [viewersCount, setViewersCount] = useState<number>(350);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize initial comments on mount or channel change
  useEffect(() => {
    const isVtv = channel.group?.toLowerCase().includes("vtv") && !channel.group?.toLowerCase().includes("cab");
    const isSport = channel.group?.toLowerCase().includes("cab") || channel.group?.toLowerCase().includes("sctv") || channel.group?.toLowerCase().includes("thể thao");
    const type = isVtv ? "vtv" : isSport ? "sports" : "general";
    
    const templates = COMMENT_TEMPLATES[type] || COMMENT_TEMPLATES.general;
    const initialList: CommentItem[] = [];
    
    // Seed 4-6 random comments
    const seedCount = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < seedCount; i++) {
      const userIdx = Math.floor(Math.random() * VIRTUAL_USERS.length);
      const textIdx = Math.floor(Math.random() * templates.length);
      const gradientIdx = Math.floor(Math.random() * USER_GRADIENTS.length);
      
      initialList.push({
        id: `init-${channel.id}-${i}-${Date.now()}`,
        username: VIRTUAL_USERS[userIdx],
        colorClass: USER_GRADIENTS[gradientIdx],
        text: templates[textIdx],
        timestamp: `${seedCount - i} phút trước`
      });
    }
    
    setComments(initialList);
    setViewersCount(Math.floor(Math.random() * 1500) + 120);
  }, [channel]);

  // Simulated live additions
  useEffect(() => {
    const interval = setInterval(() => {
      const isVtv = channel.group?.toLowerCase().includes("vtv") && !channel.group?.toLowerCase().includes("cab");
      const isSport = channel.group?.toLowerCase().includes("cab") || channel.group?.toLowerCase().includes("sctv") || channel.group?.toLowerCase().includes("thể thao");
      const type = isVtv ? "vtv" : isSport ? "sports" : "general";
      
      const templates = COMMENT_TEMPLATES[type] || COMMENT_TEMPLATES.general;
      const userIdx = Math.floor(Math.random() * VIRTUAL_USERS.length);
      const textIdx = Math.floor(Math.random() * templates.length);
      const gradientIdx = Math.floor(Math.random() * USER_GRADIENTS.length);
      
      const incoming: CommentItem = {
        id: `live-${Date.now()}-${Math.random()}`,
        username: VIRTUAL_USERS[userIdx],
        colorClass: USER_GRADIENTS[gradientIdx],
        text: templates[textIdx],
        timestamp: "Vừa xong"
      };

      setComments(prev => [...prev, incoming].slice(-40)); // Keep last 40 comments
      setViewersCount(prev => {
        const drift = Math.floor(Math.random() * 9) - 4; // drift count slightly
        return Math.max(20, prev + drift);
      });
    }, 5000); // simulation interval

    return () => clearInterval(interval);
  }, [channel]);

  // Auto Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userMsg: CommentItem = {
      id: `user-${Date.now()}`,
      username: userNickname || "Bạn (Khách)",
      colorClass: "from-indigo-600 to-purple-600 border border-white/20",
      text: newComment.trim(),
      timestamp: "Vừa xong",
      isUser: true
    };

    setComments(prev => [...prev, userMsg]);
    setNewComment("");
    
    localStorage.setItem("vplay_comment_name", userNickname);
  };

  const handleQuickEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950/45 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[420px] lg:h-full min-h-[460px]">
      
      {/* Header section with live indicator */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
            Trò chuyện trực tiếp
          </span>
        </div>
        <span className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2.5 py-0.5 rounded-full font-mono font-bold">
          {viewersCount.toLocaleString()} đang xem
        </span>
      </div>

      {/* Nickname selection strip */}
      <div className="px-4 py-1.5 bg-indigo-950/25 border-b border-white/5 flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold text-indigo-300 uppercase shrink-0">Biệt danh của bạn:</span>
        <input
          type="text"
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder="Khách vô danh"
          maxLength={15}
          className="bg-transparent text-[10px] font-bold text-white text-right border-b border-white/10 focus:border-indigo-400 outline-none w-32 placeholder-white/40"
        />
      </div>

      {/* Chat Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar min-h-0 bg-black/10">
        {comments.map((msg) => (
          <div key={msg.id} className="flex gap-2 text-left items-start animate-fade-in">
            {/* Avatar block */}
            <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${msg.colorClass} flex items-center justify-center font-black text-[8px] text-white shrink-0 uppercase shadow-sm border border-white/5`}>
              {msg.username.substring(0, 2)}
            </div>

            {/* Content block */}
            <div className="flex-1 min-w-0 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] px-3 py-2 rounded-xl transition-colors">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-bold text-white/95 truncate">{msg.username}</span>
                <span className="text-[8px] font-mono font-semibold text-white/30 shrink-0">{msg.timestamp}</span>
              </div>
              <p className="text-[11px] text-white/85 leading-relaxed mt-0.5 whitespace-pre-wrap select-text">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Quick emoji row */}
      <div className="px-3 py-1 flex justify-between bg-white/[0.01] border-t border-white/5">
        {["👍", "❤️", "😂", "🔥", "🎉", "💯", "👏"].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleQuickEmoji(emoji)}
            className="p-1 text-sm hover:scale-125 transition-all cursor-default"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSend} className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          maxLength={150}
          className="flex-1 bg-white/[0.03] border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-[11px] placeholder-white/30 text-white outline-none font-medium"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-default transition-all hover:scale-105 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
