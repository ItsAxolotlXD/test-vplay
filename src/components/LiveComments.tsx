import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, Flame, Check, Sparkles, Gift, DollarSign, X, Heart } from "lucide-react";
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

const AVAILABLE_GIFTS = [
  { name: "Tim Khổng Lồ 💖", price: 100, icon: "💖", desc: "Tặng ngàn lời yêu thương" },
  { name: "Ly Trà Sữa 🧋", price: 500, icon: "🧋", desc: "Năng lượng cày livestream" },
  { name: "Hộp Quà Kim Cương 💎", price: 1000, icon: "💎", desc: "Đẳng cấp VIP member" },
  { name: "Bảo Ngọc Vương Miện 👑", price: 10000, icon: "👑", desc: "Vinh danh bá chủ phòng live" },
  { name: "Siêu Xe Vplay 🏎️", price: 100000, icon: "🏎️", desc: "Siêu xịn siêu sang chảnh" },
  { name: "Tên Lửa Vũ Trụ 🚀", price: 1000000, icon: "🚀", desc: "Món quà vũ trụ tối thượng" }
];

interface CommentItem {
  id: string;
  username: string;
  colorClass: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
  isGift?: boolean;
  isSuperChat?: boolean;
  scAmount?: number;
  giftIcon?: string;
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
  const [vCoins, setVCoins] = useState<number>(() => {
    const saved = localStorage.getItem("vplay_vcoins");
    return saved ? parseInt(saved, 10) : 500;
  });

  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [activeGiftTab, setActiveGiftTab] = useState<"gift" | "superchat">("gift");
  const [scText, setScText] = useState("");
  const [scToast, setScToast] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Sync nickname to localStorage
  useEffect(() => {
    localStorage.setItem("vplay_comment_name", userNickname);
  }, [userNickname]);

  // Sync V-Coins to localStorage
  useEffect(() => {
    localStorage.setItem("vplay_vcoins", vCoins.toString());
  }, [vCoins]);

  // Sync V-Coins from localStorage periodically or when panel opens
  useEffect(() => {
    if (showGiftPanel) {
      const saved = localStorage.getItem("vplay_vcoins");
      if (saved) {
        setVCoins(parseInt(saved, 10));
      }
    }
  }, [showGiftPanel]);

  // Earn free V-Coins: +50 V-coins every minute while watching
  useEffect(() => {
    const timer = setInterval(() => {
      const saved = localStorage.getItem("vplay_vcoins");
      const currentCoins = saved ? parseInt(saved, 10) : 500;
      const newVal = currentCoins + 50;
      localStorage.setItem("vplay_vcoins", newVal.toString());
      setVCoins(newVal);
      triggerToastLocal("Bạn nhận được +50 V-coins từ xem Live! 💰");
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const triggerToastLocal = (msg: string) => {
    setScToast(msg);
    setTimeout(() => {
      setScToast(null);
    }, 3000);
  };

  // Initialize comments on channel change
  useEffect(() => {
    const isVtv = channel?.group?.toLowerCase().includes("vtv") && !channel?.group?.toLowerCase().includes("cab");
    const isSport = channel?.group?.toLowerCase().includes("cab") || channel?.group?.toLowerCase().includes("sctv") || channel?.group?.toLowerCase().includes("thể thao");
    const type = isVtv ? "vtv" : isSport ? "sports" : "general";
    
    const templates = COMMENT_TEMPLATES[type] || COMMENT_TEMPLATES.general;
    const initialList: CommentItem[] = [];
    
    // Seed comments
    const seedCount = Math.floor(Math.random() * 3) + 5;
    for (let i = 0; i < seedCount; i++) {
      const userIdx = Math.floor(Math.random() * VIRTUAL_USERS.length);
      const textIdx = Math.floor(Math.random() * templates.length);
      const gradientIdx = Math.floor(Math.random() * USER_GRADIENTS.length);
      
      initialList.push({
        id: `init-${channel?.id || "chan"}-${i}-${Date.now()}`,
        username: VIRTUAL_USERS[userIdx],
        colorClass: USER_GRADIENTS[gradientIdx],
        text: templates[textIdx],
        timestamp: `${seedCount - i}p trước`
      });
    }
    
    setComments(initialList);
    setViewersCount(Math.floor(Math.random() * 1200) + 250);
    setShowGiftPanel(false);
  }, [channel]);

  // Continuous Comment Stream (Simulated every 1.8s - 3s)
  useEffect(() => {
    let timeoutId: any;

    const addSimulatedComment = () => {
      const isVtv = channel?.group?.toLowerCase().includes("vtv") && !channel?.group?.toLowerCase().includes("cab");
      const isSport = channel?.group?.toLowerCase().includes("cab") || channel?.group?.toLowerCase().includes("sctv") || channel?.group?.toLowerCase().includes("thể thao");
      const type = isVtv ? "vtv" : isSport ? "sports" : "general";
      
      const templates = COMMENT_TEMPLATES[type] || COMMENT_TEMPLATES.general;
      const userIdx = Math.floor(Math.random() * VIRTUAL_USERS.length);
      const gradientIdx = Math.floor(Math.random() * USER_GRADIENTS.length);
      
      const roll = Math.random();
      let incoming: CommentItem;

      if (roll > 0.93) {
        // Virtual user sends a Super Chat!
        const scAmount = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
        const scMessages = [
          "Live mượt quá admin ơi!",
          "Vplay số 1 luôn nha 💯",
          "Kênh này xem đá bóng sướng cực",
          "Cảm ơn Vplay đã phát sóng nha!",
          "Thời sự trực tiếp sắc nét"
        ];
        incoming = {
          id: `live-sc-${Date.now()}-${Math.random()}`,
          username: `🌟 Super Chat [${scAmount} Xu] - ${VIRTUAL_USERS[userIdx]}`,
          colorClass: "from-yellow-400 via-amber-500 to-orange-500 text-black font-bold",
          text: `💬 "${scMessages[Math.floor(Math.random() * scMessages.length)]}"`,
          timestamp: "Vừa xong",
          isSuperChat: true,
          scAmount: scAmount
        };
      } else if (roll > 0.85) {
        // Virtual user sends a Gift!
        const randomGift = AVAILABLE_GIFTS[Math.floor(Math.random() * 3)]; // Tim, Trà sữa or Diamond
        incoming = {
          id: `live-gift-${Date.now()}-${Math.random()}`,
          username: VIRTUAL_USERS[userIdx],
          colorClass: "from-pink-500 to-rose-500 font-semibold",
          text: `🎁 Đã gửi tặng [${randomGift.name}]`,
          timestamp: "Vừa xong",
          isGift: true,
          giftIcon: randomGift.icon
        };
      } else {
        // Standard text comment
        const textIdx = Math.floor(Math.random() * templates.length);
        incoming = {
          id: `live-text-${Date.now()}-${Math.random()}`,
          username: VIRTUAL_USERS[userIdx],
          colorClass: USER_GRADIENTS[gradientIdx],
          text: templates[textIdx],
          timestamp: "Vừa xong"
        };
      }

      setComments(prev => [...prev, incoming].slice(-40));
      setViewersCount(prev => {
        const drift = Math.floor(Math.random() * 5) - 2;
        return Math.max(50, prev + drift);
      });

      // Schedule next comment with random time (1.5s to 3s)
      const nextTime = Math.random() * 1500 + 1500;
      timeoutId = setTimeout(addSimulatedComment, nextTime);
    };

    timeoutId = setTimeout(addSimulatedComment, 2000);
    return () => clearTimeout(timeoutId);
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
      username: userNickname || "Bạn",
      colorClass: "from-indigo-600 to-purple-600 border border-white/20",
      text: newComment.trim(),
      timestamp: "Vừa xong",
      isUser: true
    };

    setComments(prev => [...prev, userMsg].slice(-40));
    setNewComment("");
  };

  const handleQuickEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji);
  };

  const handleSendGift = (gift: typeof AVAILABLE_GIFTS[0]) => {
    if (vCoins < gift.price) {
      triggerToastLocal(`Bạn không đủ Xu! Thiếu ${(gift.price - vCoins).toLocaleString()} Xu. Đợi clock nhận thêm nhé 💰`);
      return;
    }

    setVCoins(prev => prev - gift.price);
    
    const userGiftMsg: CommentItem = {
      id: `user-gift-${Date.now()}`,
      username: userNickname || "Bạn",
      colorClass: "from-pink-500 via-rose-500 to-red-600 font-extrabold border border-pink-400",
      text: `🎁 Đã gửi tặng [${gift.name}]! Cảm ơn bạn rất nhiều!`,
      timestamp: "Vừa xong",
      isUser: true,
      isGift: true,
      giftIcon: gift.icon
    };

    setComments(prev => [...prev, userGiftMsg].slice(-40));
    setShowGiftPanel(false);
    triggerToastLocal(`Đã gửi tặng ${gift.name}! Trừ -${gift.price.toLocaleString()} Xu 🎉`);
  };

  const handleSendSuperChat = () => {
    if (!scText.trim()) return;
    if (vCoins < 100) {
      triggerToastLocal("Bạn không đủ 100 Xu để gửi Super Chat! 💰");
      return;
    }

    setVCoins(prev => prev - 100);

    const userScMsg: CommentItem = {
      id: `user-sc-${Date.now()}`,
      username: `🌟 Super Chat [100 Xu] - ${userNickname || "Bạn"}`,
      colorClass: "from-yellow-400 via-amber-500 to-orange-500 text-black font-extrabold border border-amber-300",
      text: `💬 "${scText.trim()}"`,
      timestamp: "Vừa xong",
      isUser: true,
      isSuperChat: true,
      scAmount: 100
    };

    setComments(prev => [...prev, userScMsg].slice(-40));
    setScText("");
    setShowGiftPanel(false);
    triggerToastLocal("Đã gửi Super Chat 100 Xu thành công! 🌟");
  };

  return (
    <div className="w-full bg-zinc-950/45 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[480px] lg:h-[500px] xl:h-[550px] max-h-[550px] flex flex-col relative select-none">
      
      {/* Toast Alert overlay */}
      {scToast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[60] bg-black/90 text-white border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-2xl animate-fade-in truncate max-w-[90%] whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          <span>{scToast}</span>
        </div>
      )}

      {/* Header section with live indicator */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-black uppercase text-white tracking-wider">
            Trò chuyện trực tiếp
          </span>
        </div>
        <span className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2.5 py-0.5 rounded-full font-mono font-bold">
          {viewersCount.toLocaleString()} xem
        </span>
      </div>

      {/* Nickname selection strip */}
      <div className="px-4 py-1.5 bg-indigo-950/25 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
        <span className="text-[9px] font-bold text-indigo-300 uppercase shrink-0">Biệt danh:</span>
        <input
          type="text"
          value={userNickname}
          onChange={(e) => setUserNickname(e.target.value)}
          placeholder="Khách vô danh"
          maxLength={15}
          className="bg-transparent text-[10px] font-bold text-white text-right border-b border-transparent hover:border-white/10 focus:border-indigo-400 outline-none w-32 placeholder-white/40"
        />
      </div>

      {/* Main Container containing scrollable chat OR Gifting Panel */}
      <div className="flex-1 relative min-h-0">
        {showGiftPanel ? (
          /* GIFT STORE / SUPER CHAT PANEL */
          <div className="absolute inset-0 bg-zinc-950/95 z-40 flex flex-col justify-between animate-fade-in">
            {/* Tab selection header */}
            <div className="px-4 py-2 border-b border-white/15 flex items-center justify-between shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveGiftTab("gift")}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                    activeGiftTab === "gift" ? "bg-pink-600 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  Tặng quà 🎁
                </button>
                <button
                  onClick={() => setActiveGiftTab("superchat")}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                    activeGiftTab === "superchat" ? "bg-amber-500 text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  Super Chat 🌟
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-yellow-400">💰 {vCoins.toLocaleString()} Xu</span>
                <button onClick={() => setShowGiftPanel(false)} className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0 bg-black/25">
              {activeGiftTab === "gift" ? (
                /* GIFTS GRID */
                <div className="grid grid-cols-2 gap-2.5">
                  {AVAILABLE_GIFTS.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => handleSendGift(g)}
                      className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-pink-500/30 text-center flex flex-col items-center justify-between transition-all group"
                    >
                      <span className="text-2xl group-hover:scale-115 transition-transform duration-200">{g.icon}</span>
                      <div className="mt-1">
                        <p className="text-[10px] font-bold text-white line-clamp-1">{g.name.split(" ")[0]}</p>
                        <p className="text-[8px] text-white/40">{g.desc}</p>
                      </div>
                      <span className="mt-1.5 text-[8px] font-bold text-yellow-400 bg-yellow-400/5 px-1.5 py-0.5 rounded-full border border-yellow-400/10">
                        {g.price.toLocaleString()} Xu
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                /* SUPER CHAT FORM */
                <div className="space-y-3.5 p-1 text-left">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                    <p className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Super Chat Đặc Quyền
                    </p>
                    <p className="text-[9px] text-neutral-400 leading-normal">
                      Tin nhắn Super Chat của bạn sẽ được ghim nổi bật với màu sắc rực rỡ và nhận được sự cảm ơn trực tiếp từ kênh phát sóng.
                    </p>
                    <span className="inline-block text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/10">
                      Chi phí: 100 Xu
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/50 uppercase">Nội dung tin nhắn:</label>
                    <textarea
                      value={scText}
                      onChange={(e) => setScText(e.target.value)}
                      placeholder="Nhập lời nhắn của bạn gửi tặng đài phát sóng..."
                      maxLength={100}
                      rows={3}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400/50 resize-none font-medium"
                    />
                  </div>

                  <button
                    onClick={handleSendSuperChat}
                    className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-extrabold text-[10.5px] rounded-xl transition-all shadow-md active:scale-98"
                  >
                    Gửi Super Chat (100 Xu)
                  </button>
                </div>
              )}
            </div>

            {/* Panel Footer instructions */}
            <div className="p-2.5 bg-black/60 border-t border-white/5 text-[8px] text-white/30 text-center shrink-0">
              Nhận Xu miễn phí tự động bằng cách duy trì xem kênh trực tiếp!
            </div>
          </div>
        ) : null}

        {/* Chat Messages scrollable area */}
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-black/10 flex flex-col">
          {comments.map((msg) => {
            const isSc = msg.isSuperChat;
            const isGf = msg.isGift;
            
            return (
              <div key={msg.id} className="flex gap-2 text-left items-start animate-fade-in shrink-0">
                {/* Avatar block */}
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${msg.colorClass} flex items-center justify-center font-black text-[8px] text-white shrink-0 uppercase shadow-sm border border-white/5`}>
                  {msg.username.substring(0, 2)}
                </div>

                {/* Content block */}
                <div className={`flex-1 min-w-0 px-3 py-2 rounded-xl transition-all ${
                  isSc 
                    ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/35 shadow-[0_4px_12px_rgba(245,158,11,0.08)]" 
                    : isGf 
                      ? "bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-transparent border border-pink-500/35 shadow-[0_4px_12px_rgba(236,72,153,0.08)]" 
                      : "bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03]"
                }`}>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-[10px] font-bold truncate flex items-center gap-1 ${
                      isSc ? "text-amber-300" : isGf ? "text-pink-300" : "text-white/95"
                    }`}>
                      {isSc && "🌟 "}
                      {msg.username}
                    </span>
                    <span className="text-[8px] font-mono font-semibold text-white/30 shrink-0">{msg.timestamp}</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed mt-0.5 whitespace-pre-wrap select-text ${
                    isSc ? "text-amber-100 font-semibold" : isGf ? "text-pink-100" : "text-white/85"
                  }`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Quick emoji row */}
      <div className="px-3 py-1 flex justify-between bg-white/[0.01] border-t border-white/5 shrink-0">
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

      {/* Input controls form + Gifting Launcher button */}
      <div className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2 shrink-0">
        <button
          onClick={() => setShowGiftPanel(true)}
          className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg cursor-default transition-all hover:scale-105 shrink-0 flex items-center justify-center"
          title="Tặng quà & Super Chat"
        >
          <Gift className="w-3.5 h-3.5 text-white" />
        </button>

        <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
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
    </div>
  );
}
