import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  Music, 
  Tv, 
  Send, 
  Smartphone, 
  RefreshCw, 
  Check, 
  X,
  TrendingUp,
  Search,
  MessageSquare,
  Flame,
  Info,
  Gift,
  DollarSign,
  RotateCw,
  Eye,
  EyeOff
} from "lucide-react";
import { Channel } from "../data/channels";

// Simulated high-quality comments for the streams
const SIMULATED_COMMENTS: Record<string, string[]> = {
  vtv: [
    "Thời sự trực tiếp xem căng đét!",
    "Chất lượng luồng Vplay mượt ghê",
    "Có ai đang xem giống mình không? 👋",
    "Đường truyền căng đét, không giật lag tí nào luôn",
    "VTV chiếu tin tức nhanh nhất rồi",
    "Vplay đúng là app đỉnh của chóp 💯",
    "Kênh này xem thời sự chuẩn nét căng",
    "Chào cả nhà yêu nước nha!",
    "Xem trên điện thoại tỉ lệ dọc tiện thật sự",
    "Cảm ơn đội ngũ Vplay đã chia sẻ luồng mượt thế này"
  ],
  sports: [
    "Hay quá! Sút căng vcl!!! 🔥",
    "Gáy lên anh em ơi! Việt Nam vô địch!",
    "Đá đỉnh quá, pha bóng đẳng cấp thật",
    "Đang đá giải gì thế mọi người ơi?",
    "Pha này mà không vào thì hơi phí",
    "Trận đấu hấp dẫn quá, hồi hộp ghê",
    "Căng thẳng đến từng giây luôn",
    "Mượt vãi gáy lên ae ơi",
    "Kênh thể thao yêu thích của tôi đây rồi",
    "Trọng tài bắt hơi ép nhé 😂"
  ],
  movies: [
    "Phim gì hay thế ạ? Cho mình xin tên với!",
    "Diễn viên chính xinh thế nhỉ 😍",
    "Phim này chiếu lúc mấy giờ thế?",
    "Hóng tập sau quá đi mất",
    "Cốt truyện cuốn ghê, không rời mắt được",
    "Phim Việt Nam giờ làm đỉnh thật sự",
    "Thích nhất xem phim khung giờ vàng này",
    "Review phim này siêu bánh cuốn",
    "Có ai biết lịch chiếu cụ thể không?"
  ],
  general: [
    "Chào buổi tối cả nhà nha!",
    "Kênh này xem chill phết",
    "Vplay nhiều kênh xịn thế nhở",
    "Âm thanh hình ảnh đồng bộ tốt ghê",
    "Đang rảnh rỗi lướt shorts gặp ngay truyền hình live",
    "TikTok gọi bằng cụ nhé, lướt Shorts xem tivi cực đã",
    "Tính năng này sáng tạo ghê á!",
    "Vừa lướt vừa xem tin tức, tiện cả đôi đường",
    "10 điểm không có nhưng cho Vplay",
    "Thích giao diện màu tím ấm cúng này ghê"
  ]
};

const VIRTUAL_USERNAMES = [
  "tuấn_anh_vtv", "mai_lan_99", "hoang_hai_phong", "vplay_vip_user", 
  "thanh_hang_hn", "minh_quan_korea", "linh_chi_cute", "long_vu_sport", 
  "phuong_thao_vlog", "duy_khanh_bouncy", "ngoc_huyen_vtv3", "cuong_dolce",
  "tram_anh_fashion", "tiến_dat_tech", "quỳnh_anh_vplay", "khanh_vy_official",
  "quang_huy_93", "minh_thu_bds", "binh_minh_chill", "khanh_an_vtv1",
  "anh_tuan_live", "thuy_tien_sg", "quoc_bao_92", "lan_huong_vtv2",
  "tien_dung_sport", "ngoc_anh_vtv6", "phuc_vinh_vplay", "diem_my_daily",
  "vtv_go_fan", "the_anh_28", "beat_vn_member", "schannel_fan_cung",
  "vinh_xo_review", "duy_tham_tech", "tan_one_piece", "linh_ka_official",
  "son_tung_mtp_fan", "den_vau_chill", "suboi_rapviet", "justatee_fan",
  "viet_anh_94", "huong_giang_vplay", "trung_quan_idol", "my_tam_fanpage",
  "jack_5m", "kicm_producer", "viruss_reaction", "pewpew_tiem_banh",
  "mixigaming_fan", "tiencookie_hit", "bichphuong_chill", "den_vau_rap"
];

const USER_COLORS = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-red-500 to-orange-500"
];

interface CommentItem {
  id: string;
  username: string;
  color: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface BulletComment {
  id: string;
  text: string;
  top: number; // percentage from top (20% to 70%)
  duration: number; // seconds
}

interface VplayVerticalProps {
  channels: Channel[];
  onBack: () => void;
  isMaterialDesignActive?: boolean;
  setActiveTab?: (tab: string) => void;
}

export default function VplayVertical({ channels, onBack, isMaterialDesignActive = false, setActiveTab }: VplayVerticalProps) {
  // Filter out radio and non-video channels
  const videoChannels = channels.filter(ch => !ch.isRadio && ch.url !== "#testcard");
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentChannel = videoChannels[currentIndex] || videoChannels[0];
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);
  const [danmakuEnabled, setDanmakuEnabled] = useState<boolean>(true);
  
  // Custom states for interactive features
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [sharesCountMap, setSharesCountMap] = useState<Record<string, number>>({});
  const [commentsCountMap, setCommentsCountMap] = useState<Record<string, number>>({});
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [userDisplayName, setUserDisplayName] = useState<string>(() => {
    return localStorage.getItem("vplay_comment_name") || "Bạn (Khách)";
  });

  // V-Coins & Watch Timer states
  const [vCoins, setVCoins] = useState<number>(() => {
    const saved = localStorage.getItem("vplay_vcoins");
    return saved ? parseInt(saved, 10) : 500;
  });
  const [countdown, setCountdown] = useState<number>(60);

  // Watch Mode (Zoomed / Original)
  const [watchMode, setWatchMode] = useState<"original" | "zoomed">("original");
  const [zoomScale, setZoomScale] = useState<number>(1.5);
  const [zoomOffsetX, setZoomOffsetX] = useState<number>(0);
  const [zoomOffsetY, setZoomOffsetY] = useState<number>(0);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [clearDisplay, setClearDisplay] = useState<boolean>(false);

  // Floating drawers inside players
  const [showChannelSearchDrawer, setShowChannelSearchDrawer] = useState<boolean>(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  
  // Interactive Floating Hearts
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const heartIdCounter = useRef<number>(0);
  
  // Danmaku (Bullet Screen) comments active on screen
  const [bulletComments, setBulletComments] = useState<BulletComment[]>([]);
  
  // Search state for sidebar
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Live viewers and stream event notifications state
  const [liveViewersCount, setLiveViewersCount] = useState<number>(324800);
  const [streamEvents, setStreamEvents] = useState<{
    id: string;
    type: 'join' | 'gift' | 'reaction' | 'superchat';
    text: string;
    username: string;
    detail?: string;
  }[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize dynamic comments map
  useEffect(() => {
    const initialComments: Record<string, CommentItem[]> = {};
    videoChannels.forEach(ch => {
      const type = ch.group?.toLowerCase().includes("vtv") 
        ? "vtv" 
        : ch.group?.toLowerCase().includes("cab") || ch.group?.toLowerCase().includes("sctv")
        ? "sports"
        : "general";
      
      const templates = SIMULATED_COMMENTS[type] || SIMULATED_COMMENTS.general;
      const chComments: CommentItem[] = [];
      
      // Seed 3-5 random comments
      const seedCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < seedCount; i++) {
        const userIdx = Math.floor(Math.random() * VIRTUAL_USERNAMES.length);
        const textIdx = Math.floor(Math.random() * templates.length);
        const colorIdx = Math.floor(Math.random() * USER_COLORS.length);
        const timeOffset = seedCount - i;
        
        chComments.push({
          id: `seed-${ch.id}-${i}`,
          username: VIRTUAL_USERNAMES[userIdx],
          color: USER_COLORS[colorIdx],
          text: templates[textIdx],
          timestamp: `Vừa xong`
        });
      }
      initialComments[ch.id] = chComments;
    });
    setCommentsMap(initialComments);
    
    // Seed initial high metrics (thousands and hundreds of thousands)
    const initialLikes: Record<string, number> = {};
    const initialCommentsCount: Record<string, number> = {};
    const initialSharesCount: Record<string, number> = {};
    videoChannels.forEach(ch => {
      initialLikes[ch.id] = Math.floor(Math.random() * 115000) + 12400; // 12.4K - 127.4K
      initialCommentsCount[ch.id] = Math.floor(Math.random() * 8500) + 1200; // 1.2K - 9.7K
      initialSharesCount[ch.id] = Math.floor(Math.random() * 2400) + 350; // 350 - 2.7K
    });
    setLikesCountMap(initialLikes);
    setCommentsCountMap(initialCommentsCount);
    setSharesCountMap(initialSharesCount);
  }, []);



  // Persist V-coins to localStorage
  useEffect(() => {
    localStorage.setItem("vplay_vcoins", vCoins.toString());
  }, [vCoins]);

  // Countdown timer for earning coins (every 1 minute gets 50 coins)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setVCoins(c => c + 50);
          triggerToast("Bạn nhận được +50 V-coins nhờ xem chương trình! 💰📺");
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Creator/author replies back in the chat function
  const triggerAuthorResponse = (type: 'comment' | 'superchat', customMsg?: string) => {
    if (!currentChannel) return;
    
    setTimeout(() => {
      let responseText = "";
      const nick = userDisplayName || "Bạn";
      
      if (type === 'superchat') {
        responseText = `🌟 [TÁC GIẢ] Cảm ơn Super Chat cực chất 100 Xu từ @${nick}: ${customMsg ? `"${customMsg}"` : "Cảm ơn bạn nhiều!"}! Chúc bạn có thời gian xem vui vẻ nha. 😍`;
      } else {
        const commentReplies = [
          `@${nick} cảm ơn bạn đã quan tâm theo dõi luồng trực tiếp nha! ❤️`,
          `Chào @${nick}, chúc bạn xem truyền hình vui vẻ trên Vplay nhé!`,
          `Chuẩn luôn @${nick} ơi, nhớ thả tim ủng hộ stream nhé!`,
          `Cảm ơn @${nick} đã tương tác cực sung! Kênh luôn phát Full HD 1080p mượt mà. 🔥`
        ];
        responseText = commentReplies[Math.floor(Math.random() * commentReplies.length)];
      }

      const broadcasterReply: CommentItem = {
        id: `author-${Date.now()}-${Math.random()}`,
        username: `👑 Broadcaster @${currentChannel.logoText?.toLowerCase()}`,
        color: "from-purple-600 via-pink-600 to-rose-600 border border-rose-400 font-extrabold",
        text: responseText,
        timestamp: "Vừa xong"
      };

      setCommentsMap(prev => {
        const currentList = prev[currentChannel.id] || [];
        return { ...prev, [currentChannel.id]: [...currentList, broadcasterReply] };
      });
    }, 2800);
  };

  // Set up HLS Video streaming
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChannel) return;

    setIsPlaying(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // MP4/Sample assets support
    const isMp4 = currentChannel.id === "test_video" || currentChannel.url.endsWith(".mp4") || currentChannel.url.includes(".mp4?");

    if (isMp4) {
      video.src = currentChannel.url;
      video.load();
      video.play().catch(err => console.log("Autoplay block or playback interrupted:", err));
    } else {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(currentChannel.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.log("HLS play block:", err));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn("HLS Error:", data);
          if (data.fatal) {
            triggerToast(`Luồng ${currentChannel.name} gặp sự cố. Đang tự động bỏ qua...`);
            setTimeout(() => {
              handleNextShort();
            }, 1500);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentChannel.url;
        video.load();
        video.play().catch(err => console.log("Safari play block:", err));
      }
    }

    const handleVideoError = () => {
      console.warn("Video element reported playback error.");
      triggerToast(`Luồng ${currentChannel?.name} gặp sự cố tải. Đang bỏ qua...`);
      setTimeout(() => {
        handleNextShort();
      }, 1500);
    };

    video.addEventListener("error", handleVideoError);

    return () => {
      video.removeEventListener("error", handleVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentChannel]);

  // 1. Randomize stats on channel switch + 2. Fast real-time live viewers fluctuation + 3. Floating live events generator
  useEffect(() => {
    if (!currentChannel) return;

    // A. Randomize Likes, Comments, Shares to extremely high numbers on channel load
    const randLikes = Math.floor(Math.random() * 250000) + 124000; // 124K - 374K
    const randComments = Math.floor(Math.random() * 28000) + 5200;  // 5.2K - 33.2K
    const randShares = Math.floor(Math.random() * 8000) + 1200;    // 1.2K - 9.2K
    const startViewers = Math.floor(Math.random() * 150000) + 320000; // 320K - 470K

    setLikesCountMap(prev => ({ ...prev, [currentChannel.id]: randLikes }));
    setCommentsCountMap(prev => ({ ...prev, [currentChannel.id]: randComments }));
    setSharesCountMap(prev => ({ ...prev, [currentChannel.id]: randShares }));
    setLiveViewersCount(startViewers);

    // Initial stream event on channel enter
    setStreamEvents([
      {
        id: `enter-${Date.now()}`,
        type: 'join',
        username: `@${userDisplayName.toLowerCase().replace(/\s+/g, "") || "khach"}`,
        text: "vừa tham gia phòng xem"
      }
    ]);

    // B. Real-time fast jumping of viewers (every 1.5 seconds)
    const viewerInterval = setInterval(() => {
      setLiveViewersCount(prev => {
        // Fluctuates between +4500 and -4200
        const delta = Math.floor(Math.random() * 8700) - 4200;
        const newVal = prev + delta;
        return newVal < 100000 ? Math.floor(Math.random() * 100000) + 250000 : newVal;
      });
    }, 1500);

    // C. Stream events ticker interval (e.g. users joining, gifting, sending super chats)
    const streamEventInterval = setInterval(() => {
      const uIdx = Math.floor(Math.random() * VIRTUAL_USERNAMES.length);
      const randUsername = `@${VIRTUAL_USERNAMES[uIdx]}`;
      
      const eventTypes: ('join' | 'gift' | 'reaction' | 'superchat')[] = ['join', 'gift', 'reaction', 'gift', 'join'];
      const randType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      let text = "vừa tham gia phòng";
      let detail = "";
      
      if (randType === 'gift') {
        const giftList = [
          { name: "Hộp Quà Kim Cương 💎", detail: "gửi tặng kênh" },
          { name: "Siêu Xe Vplay 🏎️", detail: "gửi tặng kênh" },
          { name: "Bảo Ngọc Vương Miện 👑", detail: "gửi tặng kênh" },
          { name: "Tim Khổng Lồ 💖", detail: "gửi tặng kênh" },
          { name: "Tên Lửa Vũ Trụ 🚀", detail: "gửi tặng kênh" }
        ];
        const g = giftList[Math.floor(Math.random() * giftList.length)];
        text = `đã tặng [${g.name}]`;
        detail = g.detail;

        // Gifting also boosts likes count randomly
        setLikesCountMap(prev => ({
          ...prev,
          [currentChannel.id]: (prev[currentChannel.id] || 250000) + Math.floor(Math.random() * 250) + 50
        }));
      } else if (randType === 'reaction') {
        const reactions = [
          "thả tim liên tục! ❤️❤️❤️",
          "vỗ tay phầm phập! 👏👏👏",
          "bật ngửa với luồng quá nét! 😱😱",
          "thả pháo hoa rực rỡ! 🎉🎉🎉"
        ];
        text = reactions[Math.floor(Math.random() * reactions.length)];

        // Reaction boosts likes
        setLikesCountMap(prev => ({
          ...prev,
          [currentChannel.id]: (prev[currentChannel.id] || 250000) + Math.floor(Math.random() * 150) + 20
        }));
      } else if (randType === 'superchat') {
        const superChats = [
          { amt: "50.000đ", msg: "Kênh nét căng đét! 😍" },
          { amt: "100.000đ", msg: "Đường truyền mượt quá ad ơi!" },
          { amt: "20.000đ", msg: "Chào cả nhà yêu Vplay nha!" },
          { amt: "200.000đ", msg: "Tặng ad ly cà phê sáng ☕" }
        ];
        const sc = superChats[Math.floor(Math.random() * superChats.length)];
        text = `đã gửi Super Chat ${sc.amt}`;
        detail = `"${sc.msg}"`;
      }

      const newEvent = {
        id: `ev-${Date.now()}-${Math.random()}`,
        type: randType,
        username: randUsername,
        text,
        detail
      };

      setStreamEvents(prev => {
        const list = [...prev, newEvent];
        return list.slice(-3); // Keep only the latest 3 events on screen
      });

    }, 2800);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(streamEventInterval);
    };
  }, [currentChannel]);

  // Periodic simulated live comments & Bullet comment generator
  useEffect(() => {
    if (!currentChannel) return;
    
    const interval = setInterval(() => {
      // Choose type of comment
      const type = currentChannel.group?.toLowerCase().includes("vtv") 
        ? "vtv" 
        : currentChannel.group?.toLowerCase().includes("cab") || currentChannel.group?.toLowerCase().includes("sctv")
        ? "sports"
        : "general";
      
      const templates = SIMULATED_COMMENTS[type] || SIMULATED_COMMENTS.general;
      const userIdx = Math.floor(Math.random() * VIRTUAL_USERNAMES.length);
      const textIdx = Math.floor(Math.random() * templates.length);
      const colorIdx = Math.floor(Math.random() * USER_COLORS.length);
      
      const username = VIRTUAL_USERNAMES[userIdx];
      const commentText = templates[textIdx];
      const userColor = USER_COLORS[colorIdx];
      
      const newComment: CommentItem = {
        id: `sim-${Date.now()}-${Math.random()}`,
        username,
        color: userColor,
        text: commentText,
        timestamp: "Vừa xong"
      };
      
      // Update comments list
      setCommentsMap(prev => {
        const currentList = prev[currentChannel.id] || [];
        // Keep last 30 comments
        const updated = [...currentList, newComment].slice(-30);
        return { ...prev, [currentChannel.id]: updated };
      });

      // Increment comments count dynamically to show highly active live engagement
      setCommentsCountMap(prev => ({
        ...prev,
        [currentChannel.id]: (prev[currentChannel.id] || 1200) + 1
      }));

      // 35% probability of triggering automatic rising heart outbursts or matching key words
      if (Math.random() < 0.35 || commentText.includes("🔥") || commentText.includes("😍") || commentText.includes("VÀOOOO") || commentText.includes("Hay")) {
        triggerHearts(Math.floor(Math.random() * 4) + 3);
        // Live viewers double-tap simulation increases likes count slightly
        setLikesCountMap(prev => ({
          ...prev,
          [currentChannel.id]: (prev[currentChannel.id] || 12000) + Math.floor(Math.random() * 6) + 1
        }));
      }

      // Also trigger a drifting bullet comment on screen if Danmaku is enabled
      if (danmakuEnabled) {
        const newBullet: BulletComment = {
          id: `bullet-${Date.now()}-${Math.random()}`,
          text: `${username}: ${commentText}`,
          top: Math.floor(Math.random() * 45) + 15, // 15% to 60% top height
          duration: Math.floor(Math.random() * 4) + 6 // 6 to 10 seconds drift duration
        };
        
        setBulletComments(prev => [...prev, newBullet]);
        
        // Auto remove bullet comment after drift ends
        setTimeout(() => {
          setBulletComments(prev => prev.filter(b => b.id !== newBullet.id));
        }, (newBullet.duration + 1) * 1000);
      }
      
    }, 2200); // add simulated comments and reactions every 2.2 seconds for rapid live feed

    return () => clearInterval(interval);
  }, [currentChannel, danmakuEnabled]);

  // Auto Scroll comments to bottom
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commentsMap, currentChannel, showCommentsDrawer]);

  const handleNextShort = () => {
    if (currentIndex < videoChannels.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowCommentsDrawer(false);
    } else {
      // Loop back to start
      setCurrentIndex(0);
      setShowCommentsDrawer(false);
    }
  };

  const handlePrevShort = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowCommentsDrawer(false);
    } else {
      // Loop to end
      setCurrentIndex(videoChannels.length - 1);
      setShowCommentsDrawer(false);
    }
  };

  // Keep standard scroll styling on mount, ensure scroller is visible
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Standard scrolling is enabled on the page. Switch channels using up/down navigation controls.

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentChannel) return;
    
    const isLiked = !likedMap[currentChannel.id];
    setLikedMap(prev => ({ ...prev, [currentChannel.id]: isLiked }));
    setLikesCountMap(prev => ({
      ...prev,
      [currentChannel.id]: (prev[currentChannel.id] || 1000) + (isLiked ? 1 : -1)
    }));

    // Trigger rising hearts
    const rect = e.currentTarget.getBoundingClientRect();
    triggerHearts(5);
  };

  const triggerHearts = (count: number) => {
    const colors = ["#ff2d55", "#ff3b30", "#ff9500", "#ffcc00", "#ff2d55"];
    const newHearts: FloatingHeart[] = [];
    
    for (let i = 0; i < count; i++) {
      heartIdCounter.current++;
      newHearts.push({
        id: heartIdCounter.current,
        x: Math.random() * 60 - 30, // randomized horizontal drift offset
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 14
      });
    }
    
    setHearts(prev => [...prev, ...newHearts]);

    // Remove hearts after animation completes
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 2000);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    // Only double tap triggers like!
    if (e.detail === 2) {
      if (!currentChannel) return;
      if (!likedMap[currentChannel.id]) {
        setLikedMap(prev => ({ ...prev, [currentChannel.id]: true }));
        setLikesCountMap(prev => ({
          ...prev,
          [currentChannel.id]: (prev[currentChannel.id] || 15000) + 1
        }));
      }
      triggerHearts(8);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentChannel) return;

    const userComment: CommentItem = {
      id: `user-${Date.now()}`,
      username: userDisplayName || "Bạn (Khách)",
      color: "from-indigo-600 to-purple-600 border border-white/20",
      text: newCommentText.trim(),
      timestamp: "Vừa xong",
      isUser: true
    };

    // Post to current channel comments list
    setCommentsMap(prev => {
      const currentList = prev[currentChannel.id] || [];
      return { ...prev, [currentChannel.id]: [...currentList, userComment] };
    });

    // Increment base comment counts state
    setCommentsCountMap(prev => ({
      ...prev,
      [currentChannel.id]: (prev[currentChannel.id] || 1200) + 1
    }));

    // Also cast on bullet screen (Danmaku)
    if (danmakuEnabled) {
      const newBullet: BulletComment = {
        id: `bullet-${Date.now()}`,
        text: `Bạn: ${newCommentText.trim()}`,
        top: Math.floor(Math.random() * 40) + 20,
        duration: 8
      };
      setBulletComments(prev => [...prev, newBullet]);
      
      setTimeout(() => {
        setBulletComments(prev => prev.filter(b => b.id !== newBullet.id));
      }, 9000);
    }

    const postedMsg = newCommentText.trim();
    setNewCommentText("");
    
    // Save displayName to localstorage
    localStorage.setItem("vplay_comment_name", userDisplayName);

    // Occasional 50% chance author responds to ordinary comments
    if (Math.random() < 0.50) {
      triggerAuthorResponse('comment', postedMsg);
    }
  };

  const handleTriggerGift = () => {
    setShowGiftModal(true);
  };

  const handleTriggerSuperChat = () => {
    if (!currentChannel) return;

    if (vCoins < 100) {
      triggerToast("Bạn không đủ V-coins để Super Chat! Phí: 100 Xu. Đang đợi countdown... 💰");
      return;
    }
    
    // Fast clean native window prompt
    const msg = window.prompt("Nhập nội dung tin nhắn Super Chat (Phí: 100 Xu):", "Ủng hộ luồng trực tiếp nét căng! 🔥");
    if (msg === null) return; // User cancelled
    
    const finalMsg = msg.trim() || "Luồng trực tiếp tuyệt vời! 👍";
    
    // Deduct 100 V-coins
    setVCoins(prev => prev - 100);
    
    // 1. Post simulated golden Super Chat comment in feed
    const scComment: CommentItem = {
      id: `sc-${Date.now()}`,
      username: `🌟 Super Chat [100 Xu] - ${userDisplayName || "Bạn"}`,
      color: "from-yellow-400 via-amber-500 to-orange-500 text-black border border-amber-300 font-bold",
      text: `💬 "${finalMsg}"`,
      timestamp: "Vừa xong",
      isUser: true
    };
    
    setCommentsMap(prev => {
      const currentList = prev[currentChannel.id] || [];
      return { ...prev, [currentChannel.id]: [...currentList, scComment] };
    });
    
    // 2. Increment comments count
    setCommentsCountMap(prev => ({
      ...prev,
      [currentChannel.id]: (prev[currentChannel.id] || 1200) + 1
    }));
    
    // 3. Trigger hearts
    triggerHearts(15);
    
    // 4. Insert stream notification
    const scEvent = {
      id: `user-sc-${Date.now()}`,
      type: 'superchat' as const,
      username: `@${userDisplayName.toLowerCase().replace(/\s+/g, "") || "khach"}`,
      text: `đã gửi Super Chat 100 Xu`,
      detail: `"${finalMsg}"`
    };
    setStreamEvents(prev => [...prev, scEvent].slice(-3));

    // 5. Trigger creator feedback reply
    triggerAuthorResponse('superchat', finalMsg);
    
    triggerToast("Đã gửi Super Chat! Trừ -100 V-coins 🌟");
  };

  const handleShareShort = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shortUrl = `${window.location.origin}?tab=shorts&channel=${currentChannel.id}`;
    navigator.clipboard.writeText(shortUrl);
    
    setSharesCountMap(prev => ({
      ...prev,
      [currentChannel.id]: (prev[currentChannel.id] || 450) + 1
    }));
    
    triggerToast("Đã sao chép liên kết Vertical tới bộ nhớ tạm!");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleQuickEmoji = (emoji: string) => {
    setNewCommentText(prev => prev + emoji);
  };

  const filteredSidebarChannels = videoChannels.filter(ch => 
    ch.logoText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeComments = commentsMap[currentChannel?.id] || [];
  const activeLikesCount = likesCountMap[currentChannel?.id] || 1200;
  const isCurrentlyLiked = likedMap[currentChannel?.id] || false;

  const translateName = (key: string): string => {
    if (!key) return "";
    if (key.startsWith("live_feed.") && key.endsWith(".name")) {
      const core = key.substring(10, key.length - 5);
      if (core === "VietnamWildLive") return "Vietnam Wild Live";
      if (core === "VTV6Test") return "VTV6 Test Stream";
      if (core.startsWith("VTVgo")) return "VTVgo " + core.substring(5);
      return core.replace(/([A-Z])/g, ' $1').trim();
    }
    return key;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center pb-2 text-white font-sans animate-fade-in relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[200] bg-zinc-900/95 backdrop-blur-xl border border-indigo-500/20 px-4 py-2.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 animate-fade-in text-xs font-semibold text-indigo-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* LEFT COLUMN: Hidden entirely as requested */}
      <div className="hidden">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/10">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 uppercase">
              Vplay Vertical Live
            </h2>
            <p className="text-[10px] text-white/40 font-semibold uppercase">PORTRAIT TELEVISION MODE</p>
          </div>
        </div>

        {/* Informative card */}
        <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl mb-4 text-[11px] leading-relaxed text-indigo-200/90 flex gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-300">TV Tỉ Lệ Dọc 9:16</p>
            <p className="mt-0.5">Trải nghiệm xem truyền hình di động dọc hiện đại. Cuộn chuột/Vuốt lên/xuống hoặc chọn luồng bên dưới.</p>
          </div>
        </div>

        {/* Live Channel Search */}
        <div className="relative mb-3.5">
          <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
          <input
            type="text"
            placeholder="Tìm kênh Vertical..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 hover:border-white/25 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none transition-all font-medium"
          />
        </div>

        {/* Sidebar Channel List container */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {filteredSidebarChannels.map((ch, idx) => {
            const isSel = currentChannel.id === ch.id;
            const originalIndex = videoChannels.findIndex(vc => vc.id === ch.id);
            
            return (
              <button
                key={ch.id}
                onClick={() => {
                  if (originalIndex !== -1) {
                    setCurrentIndex(originalIndex);
                    setShowCommentsDrawer(false);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                  isSel 
                    ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border-indigo-500/40 text-white" 
                    : "bg-white/[0.01] hover:bg-white/[0.04] border-transparent text-white/70 hover:text-white"
                }`}
              >
                {/* Micro Channel Logo */}
                <div className={`w-8 h-8 rounded-lg ${ch.logoBg || "bg-indigo-600"} flex items-center justify-center font-bold text-[9px] uppercase tracking-wider shadow-md shrink-0 border border-white/10 overflow-hidden`}>
                  {ch.logoImg ? (
                    <img src={ch.logoImg} alt={ch.logoText} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    ch.logoText
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${isSel ? "text-indigo-300" : "text-white"}`}>
                    {translateName(ch.name)}
                  </p>
                  <p className="text-[10px] text-white/35 font-semibold mt-0.5 truncate uppercase">
                    {ch.group}
                  </p>
                </div>

                {isSel && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                )}
              </button>
            );
          })}
          
          {filteredSidebarChannels.length === 0 && (
            <p className="text-center text-white/30 text-xs py-8">Không tìm thấy kênh phù hợp</p>
          )}
        </div>
      </div>

      {/* CENTER COLUMN: TikTok / Shorts Device Simulator */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Top Control Bar for Vertical Mode - unified and gorgeous on both mobile & desktop */}
        <div className={`flex items-center justify-between w-full px-2 mb-4 select-none z-10 transition-all duration-500 ease-in-out ${
          isRotated ? "max-w-[720px] sm:max-w-[800px] md:max-w-[900px]" : "max-w-[390px] sm:max-w-[420px]"
        }`}>
          <button 
            onClick={onBack} 
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold transition-all cursor-default"
          >
            <ChevronUp className="w-3.5 h-3.5 -rotate-90" />
            Trở về
          </button>
          
          <button
            onClick={() => {
              if (setActiveTab) {
                setActiveTab("live");
              }
            }}
            className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 flex items-center gap-1 text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-default"
          >
            <Tv className="w-3.5 h-3.5" />
            Watch on Full Resolution
          </button>
        </div>

        {/* Device Viewer frame wrapper (9:16 portrait or 16:9 landscape depending on isRotated) */}
        <div 
          className={`w-full rounded-[36px] overflow-hidden relative border border-white/15 bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between group/shorts select-none transition-all duration-500 ease-in-out ${
            isRotated 
              ? "max-w-[720px] sm:max-w-[800px] md:max-w-[900px] aspect-[16/9]" 
              : "max-w-[390px] sm:max-w-[420px] aspect-[9/16]"
          }`}
          onClick={togglePlay}
          onDoubleClick={handleDoubleTap}
        >
          {/* Neon side border active gradient (gorgeous aesthetic) */}
          <div className="absolute inset-0 border-[3.5px] border-indigo-500/20 rounded-[36px] pointer-events-none z-40" />

          {/* Vertical Video Element container scaled to crop 16:9 into 9:16 format */}
          <div className="absolute inset-0 z-0 bg-zinc-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover origin-center transform transition-all duration-300 animate-fade-in"
              style={
                isRotated
                  ? { transform: "scale(1.0)" }
                  : watchMode === "zoomed" 
                    ? { transform: `scale(${1.78 * zoomScale}) translate(${zoomOffsetX}px, ${zoomOffsetY}px)` } 
                    : { transform: `scale(1.78)` }
              }
              playsInline
              autoPlay
              muted={muted}
            />

            {/* Video overlay dark gradient backdrop for text clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75 pointer-events-none z-10" />

            {/* Scanning analog CRT retro lines (subtle detail) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent pointer-events-none z-10 opacity-70" />
          </div>

          {/* DANMAKU / BULLET COMMENTS SCREEN OVERLAY */}
          {!clearDisplay && danmakuEnabled && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mt-16 mb-44">
              {bulletComments.map((bullet) => (
                <div
                  key={bullet.id}
                  className="absolute left-full text-xs font-bold text-white whitespace-nowrap bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full shadow-lg select-none flex items-center gap-1.5"
                  style={{
                    top: `${bullet.top}%`,
                    animation: `drift ${bullet.duration}s linear forwards`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>{bullet.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* HEART CLOUD OVERLAY (Rising floating hearts) */}
          {!clearDisplay && (
            <div className="absolute right-14 bottom-32 z-30 pointer-events-none">
              {hearts.map((h) => (
                <div
                  key={h.id}
                  className="absolute text-center animate-rising-heart opacity-0"
                  style={{
                    color: h.color,
                    fontSize: `${h.size}px`,
                    left: `${h.x}px`,
                    transform: `translateY(${h.y}px)`
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          )}

          {/* TOP CONTROLS OVERLAY: Title, Play State & Volume Indicator */}
          {!clearDisplay && (
            <div className="relative z-30 p-5 flex flex-col gap-2 pointer-events-auto">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-black tracking-widest text-white flex items-center gap-1 shadow-md uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    VPLAY VERTICAL
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400 animate-pulse">
                    Viewer: {liveViewersCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Logo of currently playing channel replaces DANMAKU ON */}
                  <div 
                    className="flex items-center bg-black/55 backdrop-blur-md border border-indigo-500/30 p-1 rounded-full shadow-lg shrink-0"
                    title={`Đang phát: ${currentChannel?.name}`}
                  >
                    <div className={`w-6 h-6 rounded-full ${currentChannel?.logoBg || "bg-indigo-600"} p-0.5 overflow-hidden flex items-center justify-center text-white text-[9px] font-black shrink-0 border border-white/10`}>
                      {currentChannel?.logoImg ? (
                        <img src={currentChannel.logoImg} alt={currentChannel.logoText} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        currentChannel?.logoText || "TV"
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMuted(prev => !prev);
                    }}
                    className="p-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white hover:bg-black/75 cursor-default transition-all"
                  >
                    {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Middle top info bar: Coins & Watch Mode */}
              <div className="flex items-center justify-between gap-1 w-full bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                {/* Coins & Countdown */}
                <span className="text-[9px] font-bold text-yellow-400 flex items-center gap-1.5">
                  💰 <span className="font-mono">{vCoins.toLocaleString()} Xu</span>
                  <span className="text-[8px] text-white/50">(Nhận +50: {countdown}s)</span>
                </span>

                {/* Watch Mode selector */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWatchMode(prev => prev === "original" ? "zoomed" : "original");
                    triggerToast(watchMode === "original" ? "Đã bật Chế độ Phóng to! 🔍" : "Đã khôi phục Tỉ lệ gốc 📱");
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-wide uppercase transition-all cursor-default ${
                    watchMode === "zoomed"
                      ? "bg-amber-500 border-amber-400 text-black shadow-lg font-extrabold animate-pulse"
                      : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                  }`}
                  title="Đổi Chế độ Xem (Gốc / Zoom)"
                >
                  {watchMode === "zoomed" ? "Zoomed 🔍" : "Original 📱"}
                </button>
              </div>
            </div>
          )}

          {/* Zoom Adjustments floating controls panel with locator tools */}
          {!clearDisplay && watchMode === "zoomed" && (
            <div 
              className="absolute left-4 top-32 z-40 bg-black/90 backdrop-blur-md border border-amber-500/30 p-3 rounded-2xl flex flex-col gap-2.5 w-44 text-white shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[10px] font-black text-amber-400 border-b border-white/10 pb-1">
                <span>VỊ TRÍ PHÓNG TO</span>
                <button 
                  onClick={() => {
                    setZoomOffsetX(0);
                    setZoomOffsetY(0);
                    setZoomScale(1.5);
                  }}
                  className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white hover:bg-white/20 uppercase cursor-default"
                >
                  Reset
                </button>
              </div>
              
              {/* Scale Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] font-bold text-white/70">
                  <span>Thu Phóng:</span>
                  <span className="font-mono text-amber-300">{zoomScale.toFixed(1)}x</span>
                </div>
                <input 
                  type="range"
                  min="1.1"
                  max="3.0"
                  step="0.1"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* X Offset Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] font-bold text-white/70">
                  <span>Ngang (X):</span>
                  <span className="font-mono text-amber-300">{zoomOffsetX}px</span>
                </div>
                <input 
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={zoomOffsetX}
                  onChange={(e) => setZoomOffsetX(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Y Offset Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] font-bold text-white/70">
                  <span>Dọc (Y):</span>
                  <span className="font-mono text-amber-300">{zoomOffsetY}px</span>
                </div>
                <input 
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={zoomOffsetY}
                  onChange={(e) => setZoomOffsetY(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* PAUSED BANNER OVERLAY */}
          {!clearDisplay && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/15 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white scale-90 animate-bounce">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* RIGHT UTILITIES OVERLAY: TikTok Actions column */}
          {!clearDisplay && (
            <div className={`absolute right-3.5 z-30 flex flex-col items-center gap-4 pointer-events-auto transition-all duration-300 ${
              isRotated ? "bottom-4 scale-90 sm:bottom-6 sm:scale-100" : "bottom-24 sm:bottom-28"
            }`}>
              {/* 1. Channel Profile Picture widget */}
              <div className="relative group/avatar">
                <div className={`w-11 h-11 rounded-full border-2 border-indigo-400 ${currentChannel?.logoBg || "bg-indigo-600"} p-1 overflow-hidden shadow-xl flex items-center justify-center text-white text-xs font-black select-none`}>
                  {currentChannel?.logoImg ? (
                    <img src={currentChannel.logoImg} alt={currentChannel.logoText} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    currentChannel?.logoText
                  )}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full border border-black flex items-center justify-center shadow-lg cursor-default">
                  <span className="text-white text-[9px] font-black">+</span>
                </div>
              </div>

              {/* 2. Love / Like Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleToggleLike}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115 active:scale-130 ${
                    isCurrentlyLiked 
                      ? "bg-rose-600/90 border border-rose-400 text-white animate-once animate-pulse" 
                      : "bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isCurrentlyLiked ? "fill-white text-white" : "text-white"}`} />
                </button>
                <span className="text-[10px] font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {activeLikesCount.toLocaleString()}
                </span>
              </div>

              {/* 3. Comment Toggle Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommentsDrawer(prev => !prev);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115 ${
                    showCommentsDrawer
                      ? "bg-indigo-600 border border-indigo-400 text-white"
                      : "bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {(commentsCountMap[currentChannel?.id] || 1200).toLocaleString()}
                </span>
              </div>

              {/* 4. Share button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleShareShort}
                  className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {(sharesCountMap[currentChannel?.id] || 450).toLocaleString()}
                </span>
              </div>

              {/* 4.5. Search Channel Magnify Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChannelSearchDrawer(prev => !prev);
                    setShowCommentsDrawer(false);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115 ${
                    showChannelSearchDrawer
                      ? "bg-amber-500 border border-amber-400 text-black animate-pulse"
                      : "bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white"
                  }`}
                  title="Tìm kiếm & Chọn kênh"
                >
                  <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="w-5 h-5 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
                </button>
                <span className="text-[10px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Tìm Kênh
                </span>
              </div>

              {/* 4.8. Rotate Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRotated(prev => !prev);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115 ${
                    isRotated
                      ? "bg-amber-500 border border-amber-400 text-black"
                      : "bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white"
                  }`}
                  title={isRotated ? "Xoay dọc" : "Xoay ngang"}
                >
                  <RotateCw className={`w-5 h-5 transition-transform duration-500 ${isRotated ? "rotate-90" : "rotate-0"}`} />
                </button>
                <span className="text-[10px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Xoay
                </span>
              </div>

              {/* 4.9. Clear Display Toggle Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClearDisplay(true);
                    setShowCommentsDrawer(false);
                    setShowChannelSearchDrawer(false);
                    triggerToast("Đã ẩn toàn bộ giao diện! Nhấn 'Hiện Giao Diện' ở góc trên để khôi phục. 👀");
                  }}
                  className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 hover:text-white flex items-center justify-center shadow-lg cursor-default transition-all transform hover:scale-115"
                  title="Ẩn toàn bộ giao diện (Clear Display)"
                >
                  <EyeOff className="w-5 h-5 text-neutral-300" />
                </button>
                <span className="text-[10px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Ẩn G.Diện
                </span>
              </div>

              {/* 5. Navigation Control: Previous Short */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevShort();
                }}
                className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-white hover:text-indigo-300 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg cursor-default"
                title="Kênh trước (Mũi tên lên)"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              {/* 6. Navigation Control: Next Short */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextShort();
                }}
                className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-white hover:text-indigo-300 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg cursor-default animate-bounce"
                title="Kênh sau (Mũi tên xuống)"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Real-time stream events ticker (gifting, joins, superchats) overlayed above metadata */}
          {!clearDisplay && (
            <div className="absolute bottom-[88px] left-5 z-40 flex flex-col gap-1.5 max-w-[280px] pointer-events-none">
              {streamEvents.map((ev) => {
                let badgeStyle = "bg-black/55 border-white/10 text-white";
                let textStyle = "text-white/80";

                if (ev.type === 'gift') {
                  badgeStyle = "bg-gradient-to-r from-pink-950/80 to-rose-950/70 border-pink-500/30 text-pink-300 shadow-pink-500/10";
                  textStyle = "text-pink-100 font-bold";
                } else if (ev.type === 'superchat') {
                  badgeStyle = "bg-gradient-to-r from-yellow-950/80 to-amber-950/70 border-amber-500/30 text-amber-300 shadow-amber-500/10";
                  textStyle = "text-amber-100 font-extrabold";
                } else if (ev.type === 'join') {
                  badgeStyle = "bg-black/60 border-emerald-500/20 text-emerald-300";
                  textStyle = "text-emerald-100/90";
                }

                return (
                  <div 
                    key={ev.id} 
                    className={`px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-md flex flex-col gap-0.5 text-[10px] animate-fade-in-slide-up ${badgeStyle}`}
                  >
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-extrabold">{ev.username}</span>
                      <span className={textStyle}>{ev.text}</span>
                    </div>
                    {ev.detail && (
                      <span className="text-[9px] text-white/50 italic pl-1 font-semibold truncate">
                        {ev.detail}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* BOTTOM OVERLAYS: Channel Details & Rotating Vinyl Track */}
          {!clearDisplay && (
            <div className="relative z-30 p-5 pt-0 flex items-end justify-between pointer-events-auto">
              {/* Metadata Text */}
              <div className="flex-1 mr-14 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {/* Channel username */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-indigo-300 hover:underline cursor-default">
                    @{currentChannel ? currentChannel.logoText?.toLowerCase().replace(/\s+/g, "") : "vertical_tv"}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-black flex items-center justify-center text-[6px] text-black font-black" title="Tài khoản chính thức">✓</span>
                </div>
                
                {/* Channel full name */}
                <h3 className="text-[13px] font-black text-white mt-1 uppercase tracking-wider">
                  {currentChannel ? translateName(currentChannel.name) : "Vplay Television Stream"}
                </h3>
              </div>

              {/* Spinning Music Disc */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black p-1.5 border border-white/20 shadow-lg flex items-center justify-center shrink-0 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-zinc-950 border border-indigo-500/30 flex items-center justify-center relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <div className="absolute w-6 h-6 border border-white/5 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* FLOATING RESTORE BUTTON FOR CLEAR DISPLAY */}
          {clearDisplay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setClearDisplay(false);
                triggerToast("Đã khôi phục toàn bộ giao diện! 👀");
              }}
              className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-indigo-600/95 hover:bg-indigo-500 text-white border border-indigo-400/40 flex items-center gap-1.5 text-[10px] font-black transition-all shadow-lg hover:scale-105 active:scale-95 animate-fade-in pointer-events-auto"
            >
              <Eye className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
              <span>HIỆN GIAO DIỆN</span>
            </button>
          )}

          {/* SLIDE-UP COMMENTS DRAWER */}
          {showCommentsDrawer && (
            <div 
              className="absolute inset-x-0 bottom-0 h-[68%] bg-zinc-950/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[28px] z-50 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.8)] animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black tracking-wide text-white">Bình luận trực tiếp ({(commentsCountMap[currentChannel?.id] || 1200).toLocaleString()})</span>
                </div>
                <button
                  onClick={() => setShowCommentsDrawer(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-default"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Display Name Input (For custom user branding) */}
              <div className="px-4 py-1.5 bg-indigo-950/20 border-b border-white/5 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold text-indigo-300 uppercase shrink-0">Biệt danh của bạn:</span>
                <input
                  type="text"
                  value={userDisplayName}
                  onChange={(e) => setUserDisplayName(e.target.value)}
                  placeholder="Khách vô danh"
                  maxLength={15}
                  className="bg-transparent text-[10px] font-bold text-white text-right border-b border-white/10 focus:border-indigo-400 outline-none w-28 placeholder-white/30"
                />
              </div>

              {/* Comments Scrolling list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                {activeComments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    {/* User Mini Avatar */}
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${comment.color} flex items-center justify-center font-black text-[8px] text-white shrink-0 uppercase border border-white/5`}>
                      {comment.username.substring(0, 2)}
                    </div>
                    
                    {/* Text block */}
                    <div className="flex-1 min-w-0 bg-white/[0.03] border border-white/[0.04] p-2 rounded-xl text-left">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-black text-white/90 truncate">{comment.username}</span>
                        <span className="text-[8px] font-mono font-semibold text-white/30 shrink-0">{comment.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-white/85 leading-relaxed mt-0.5 whitespace-pre-wrap select-text">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}

                {activeComments.length === 0 && (
                  <div className="py-12 text-center text-white/30 text-xs">Hãy là người đầu tiên bình luận!</div>
                )}
                
                <div ref={commentsEndRef} />
              </div>

              {/* Quick Emojis strip */}
              <div className="px-4 py-1 flex justify-around border-t border-white/5 bg-white/[0.01]">
                {["👍", "❤️", "😂", "🔥", "🎉", "💯", "😱"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleQuickEmoji(emoji)}
                    className="p-1 text-base hover:scale-125 transition-transform cursor-default"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Support Channel Actions Bar (Super Chat & Gift) */}
              <div className="px-4 py-2 border-t border-b border-white/5 bg-zinc-950 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Ủng hộ streamer:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerSuperChat}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-black text-[9px] font-black tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/10 cursor-default transition-all"
                  >
                    <DollarSign className="w-3 h-3 stroke-[3]" />
                    <span>SUPER CHAT</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerGift}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 active:scale-95 text-white text-[9px] font-black tracking-wider flex items-center gap-1 shadow-md shadow-pink-500/10 cursor-default transition-all"
                  >
                    <Gift className="w-3 h-3" />
                    <span>TẶNG QUÀ</span>
                  </button>
                </div>
              </div>

              {/* Form Input row */}
              <form onSubmit={handlePostComment} className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  maxLength={120}
                  className="flex-1 bg-white/[0.04] border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-[11px] placeholder-white/30 text-white outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-default transition-all hover:scale-105 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* FLOATING CHANNEL SELECTOR & SEARCH DRAWER */}
          {showChannelSearchDrawer && (
            <div 
              className="absolute inset-x-0 bottom-0 h-[75%] bg-zinc-950/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[28px] z-50 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.8)] animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="w-4 h-4 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
                  <span className="text-xs font-black tracking-wide text-white uppercase">Tìm kiếm & Chọn kênh</span>
                </div>
                <button
                  onClick={() => setShowChannelSearchDrawer(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-default"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-3 border-b border-white/5 shrink-0">
                <div className="relative">
                  <img src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest/scale-to-width-down/1000?cb=20260717131751" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 object-contain" style={{ filter: "brightness(0) invert(1)" }} referrerPolicy="no-referrer" alt="Search" />
                  <input
                    type="text"
                    placeholder="Nhập tên kênh cần tìm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 focus:border-amber-400 rounded-xl pl-8.5 pr-4 py-2 text-[11px] text-white placeholder-white/30 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* List of Channels */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredSidebarChannels.map((ch) => {
                  const isSel = currentChannel.id === ch.id;
                  const originalIndex = videoChannels.findIndex(vc => vc.id === ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        if (originalIndex !== -1) {
                          setCurrentIndex(originalIndex);
                          setShowChannelSearchDrawer(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between border ${
                        isSel 
                          ? "bg-gradient-to-r from-amber-500/15 to-yellow-500/5 border-amber-500/40 text-white" 
                          : "bg-white/[0.02] hover:bg-white/[0.05] border-transparent text-white/70 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg ${ch.logoBg || "bg-indigo-600"} flex items-center justify-center font-bold text-[8px] uppercase tracking-wider shrink-0 border border-white/10 overflow-hidden`}>
                          {ch.logoImg ? (
                            <img src={ch.logoImg} alt={ch.logoText} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            ch.logoText
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className={`text-[11px] font-bold truncate ${isSel ? "text-amber-300" : "text-white"}`}>
                            {translateName(ch.name)}
                          </p>
                          <p className="text-[9px] text-white/30 font-semibold uppercase mt-0.5">{ch.group}</p>
                        </div>
                      </div>
                      {isSel && (
                        <span className="text-[9px] text-amber-400 font-extrabold uppercase bg-amber-400/10 px-1.5 py-0.5 rounded-md">ĐANG XEM</span>
                      )}
                    </button>
                  );
                })}

                {filteredSidebarChannels.length === 0 && (
                  <p className="text-center text-white/30 text-xs py-8">Không tìm thấy kênh phù hợp</p>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC GIFT STORE MODAL */}
          {showGiftModal && (
            <div 
              className="absolute inset-x-0 bottom-0 h-[80%] bg-zinc-950/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[28px] z-50 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.8)] animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-black tracking-wide text-white uppercase">Cửa Hàng Quà Tặng Vplay</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-yellow-400/10 text-yellow-400 font-black px-2 py-0.5 rounded-full border border-yellow-400/20">
                    💰 {vCoins.toLocaleString()} Xu
                  </span>
                  <button
                    onClick={() => setShowGiftModal(false)}
                    className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-default"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gift Cards Grid */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 custom-scrollbar">
                {[
                  { name: "Tim Khổng Lồ 💖", price: 100, icon: "💖", desc: "Tặng ngàn lời yêu thương" },
                  { name: "Ly Trà Sữa 🧋", price: 500, icon: "🧋", desc: "Năng lượng cày livestream" },
                  { name: "Hộp Quà Kim Cương 💎", price: 1000, icon: "💎", desc: "Đẳng cấp VIP member" },
                  { name: "Bảo Ngọc Vương Miện 👑", price: 10000, icon: "👑", desc: "Vinh danh bá chủ phòng live" },
                  { name: "Siêu Xe Vplay 🏎️", price: 100000, icon: "🏎️", desc: "Siêu xịn siêu sang chảnh" },
                  { name: "Tên Lửa Vũ Trụ 🚀", price: 1000000, icon: "🚀", desc: "Món quà vũ trụ tối thượng" }
                ].map((g) => {
                  const displayPriceStr = g.price === 1000000 ? "1.000.000" : g.price.toLocaleString();
                  return (
                    <button
                      key={g.name}
                      onClick={() => {
                        if (vCoins < g.price) {
                          triggerToast(`Bạn không đủ V-coins! Thiếu ${(g.price - vCoins).toLocaleString()} Xu. Đợi clock cộng thêm nhé! 💰`);
                          return;
                        }
                        
                        // Deduct V-coins
                        setVCoins(prev => prev - g.price);
                        setShowGiftModal(false);

                        // Create system comment in chat feed
                        const giftComment: CommentItem = {
                          id: `gift-${Date.now()}`,
                          username: userDisplayName || "Bạn (Khách)",
                          color: "from-pink-500 to-rose-600 border border-pink-400",
                          text: `🎁 Đã gửi tặng kênh [${g.name}]! Cảm ơn bạn rất nhiều!`,
                          timestamp: "Vừa xong",
                          isUser: true
                        };
                        
                        setCommentsMap(prev => {
                          const currentList = prev[currentChannel.id] || [];
                          return { ...prev, [currentChannel.id]: [...currentList, giftComment] };
                        });
                        
                        // Increment stats
                        setCommentsCountMap(prev => ({
                          ...prev,
                          [currentChannel.id]: (prev[currentChannel.id] || 1200) + 1
                        }));
                        
                        setLikesCountMap(prev => ({
                          ...prev,
                          [currentChannel.id]: (prev[currentChannel.id] || 15000) + Math.floor(Math.random() * 1200) + 800
                        }));

                        // Boost floating hearts
                        triggerHearts(30);

                        // Add overlay live stream event notification banner
                        const userEvent = {
                          id: `user-gift-${Date.now()}`,
                          type: 'gift' as const,
                          username: `@${userDisplayName.toLowerCase().replace(/\s+/g, "") || "khach"}`,
                          text: `đã gửi tặng ${g.name} 🎁`,
                          detail: "Món quà tuyệt vời từ khán giả! 🎉"
                        };
                        setStreamEvents(prev => [...prev, userEvent].slice(-3));

                        // Trigger broadcaster auto reply feedback after delay
                        triggerAuthorResponse('comment', `Cảm ơn món quà ${g.name} cực kỳ giá trị nhé!`);

                        triggerToast(`Đã gửi tặng ${g.name}! Trừ -${displayPriceStr} Xu 🎉`);
                      }}
                      className="flex flex-col items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-pink-500/30 text-center transition-all group cursor-default"
                    >
                      <div className="text-3xl group-hover:scale-125 transition-transform duration-300 my-1">{g.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-white">{g.name.split(" ")[0]}</p>
                        <p className="text-[8px] text-white/40 mt-0.5 line-clamp-1 leading-normal">{g.desc}</p>
                      </div>
                      <div className="mt-2 text-[9px] font-black text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-2 py-0.5 rounded-full w-full">
                        {displayPriceStr} Xu
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Help footer */}
              <div className="p-3 bg-zinc-950/80 border-t border-white/5 text-[9px] text-white/40 text-center font-bold">
                Cứ mỗi 1 phút xem trực tuyến bạn sẽ nhận được +50 Xu miễn phí! 💰
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
