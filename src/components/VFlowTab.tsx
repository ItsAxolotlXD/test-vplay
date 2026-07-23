import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Crown,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Image,
  Video,
  Sparkles,
  Lock,
  Search,
  MoreHorizontal,
  Flame,
  X,
  Plus,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Globe,
  Film
} from "lucide-react";
import { VerifiedSubState } from "./VerifiedTab";

interface VFlowTabProps {
  onBack: () => void;
  verifiedSub: VerifiedSubState;
  onNavigateToTab: (tab: string) => void;
  vCoins: number;
  setVCoins: React.Dispatch<React.SetStateAction<number>>;
}

export interface VFlowComment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  verifiedType?: "verified" | "verified_plus";
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface VFlowPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  verifiedType?: "verified" | "verified_plus";
  time: string;
  content: string;
  tag?: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  isLiked?: boolean;
  shares: number;
  comments: VFlowComment[];
  isBookmarked?: boolean;
}

export function generate100Posts(): VFlowPost[] {
  const AUTHORS = [
    { author: "Vplay Sports 1 HD", handle: "@vplay_sports", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified_plus" as const },
    { author: "Minh Tuấn Cinema", handle: "@minhtuan_movie", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Vplay Official", handle: "@vplay_official", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified_plus" as const },
    { author: "Phương Thảo VTV", handle: "@thao_vtv", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Đức Hùng Tech", handle: "@hung_tech_4k", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Khánh Linh Travel", handle: "@linh_explore", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Nam Gamer Pro", handle: "@nam_esports", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified_plus" as const },
    { author: "Mai Anh Style", handle: "@maianh_fashion", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Gia Huy Football", handle: "@huy_premier", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Thanh Trúc Review", handle: "@truc_review", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Quốc Bảo Vplay", handle: "@bao_vbox", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified_plus" as const },
    { author: "Thu Hà Foodie", handle: "@ha_food", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Văn Sang Otaku", handle: "@sang_anime", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const },
    { author: "Mỹ Linh Music", handle: "@mylinh_sing", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified_plus" as const },
    { author: "Hoài Thương V-Study", handle: "@thuong_study", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80", isVerified: true, verifiedType: "verified" as const }
  ];

  const IMAGES = [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80"
  ];

  const POST_TEMPLATES = [
    { tag: "BóngĐá", text: "🔥 Siêu kinh điển Ngoại Hạng Anh trực tiếp trên Vplay Sports 1 HD! Trận đấu kịch tính đến phút cuối cùng.", hasImg: true },
    { tag: "PhimẢnh", text: "Vừa trải nghiệm bộ phim chiếu rạp mới nhất trên V-Box. Chất lượng âm thanh Dolby Atmos quá đỉnh!", hasImg: true },
    { tag: "VplayUpdate", text: "✨ Mạng Xã Hội V-Flow chào đón bài viết thứ 100! Hãy nâng cấp Verified để nhận trọn bộ quà tặng độc quyền.", hasImg: true },
    { tag: "CongNghe", text: "Bàn về công nghệ Smart TV 8K mới ra mắt. Tốc độ truyền tải dữ liệu Cloud Vplay chạy mượt không chút giật lag.", hasImg: true },
    { tag: "DuLich", text: "Chuyến du lịch Sapa mùa này quá tuyệt vời! Không khí trong lành và cảnh đẹp núi rừng trùng điệp.", hasImg: true },
    { tag: "AmThuc", text: "Cuối tuần đi thưởng thức món Phở Bò Hà Nội chuẩn vị gia truyền. Bát phở nóng hổi đậm đà hương vị.", hasImg: true },
    { tag: "AmNhac", text: "Concert Âm Nhạc Trực Tiếp trên kênh Vplay Music HD hoành tráng không ngờ! Dàn âm thanh đỉnh cao.", hasImg: true },
    { tag: "GameMobile", text: "Trận chung kết giải đấu Esports Vplay hôm nay vô cùng gay cấn. Đội tuyển vô địch thi đấu xuất sắc!", hasImg: true },
    { tag: "Showbiz", text: "Cập nhật thảm đỏ sự kiện điện ảnh tối nay. Các nghệ sĩ xuất hiện lộng lẫy trên truyền hình Vplay.", hasImg: true },
    { tag: "VStudy", text: "Hôm nay mình vừa ôn luyện xong bộ đề thi thử THPT Quốc Gia trên V-Study. Rất chi tiết và bổ ích!", hasImg: false },
    { tag: "BóngĐá", text: "Cập nhật kết quả Cúp C1 Châu Âu: Trận đấu nghẹt thở với cú đúp phút 89. Anh em thấy thế nào?", hasImg: false },
    { tag: "PhimẢnh", text: "Top 5 bộ phim hành động bom tấn đáng xem nhất cuối tuần này trên Vplay Cinema HD.", hasImg: true },
    { tag: "CongNghe", text: "So sánh tốc độ băng thông 1Gbps trên server VIP Vplay và server thường. Khác biệt rõ rệt!", hasImg: false },
    { tag: "DuLich", text: "Khám phá bãi biển Phú Quốc rực rỡ nắng vàng. Địa điểm không thể bỏ qua mùa hè này.", hasImg: true },
    { tag: "AmThuc", text: "Quán bún bò Huế cực ngon tại trung tâm thành phố, topping đầy đặn giá cực hạt dẻ.", hasImg: true },
    { tag: "AmNhac", text: "Bài hát mới vừa cán mốc 10 triệu lượt nghe trên kênh V-Flow Audio. Giai điệu bắt tai gây nghiện!", hasImg: false },
    { tag: "GameMobile", text: "Cần tìm đồng đội leo rank Cao Thủ tối nay! Anh em nào online inbox vào team luôn nhé.", hasImg: false },
    { tag: "VplayUpdate", text: "Thông báo nâng cấp Server Cloud Storage lên 2 TB cho tất cả hội viên VIP Vplay!", hasImg: true },
    { tag: "Showbiz", text: "Bài phỏng vấn độc quyền độc lạ cùng đạo diễn nổi tiếng Việt Nam trên kênh Vplay Talkshow.", hasImg: false },
    { tag: "VStudy", text: "Bí quyết đạt điểm 9+ môn Toán trong kỳ thi sắp tới. Cùng tham khảo tài liệu V-Study nhé!", hasImg: false }
  ];

  const COMMENT_POOL = [
    "Bài viết hay quá bạn ơi!",
    "Chất lượng mượt mà thật sự, cho 5 sao ⭐️⭐️⭐️⭐️⭐️",
    "Đã thả tim và bookmark rồi nhé!",
    "Hóng trận tiếp theo quá ad ơi 🔥",
    "V-Flow dùng thích thật, đăng bài mượt đét!",
    "Tuyệt vời! Cảm ơn thông tin hữu ích của bạn.",
    "Bao giờ có chương trình tặng V-coins tiếp theo vậy ad?",
    "Giao diện Verified đẹp xuất sắc luôn!",
    "Hoàn toàn đồng ý với ý kiến của bác!",
    "Gói VIP quá đáng tiền, xem phim 4K sướng mắt."
  ];

  const postsList: VFlowPost[] = [];

  for (let i = 1; i <= 100; i++) {
    const authorObj = AUTHORS[(i - 1) % AUTHORS.length];
    const template = POST_TEMPLATES[(i - 1) % POST_TEMPLATES.length];
    const imgUrl = template.hasImg ? IMAGES[(i - 1) % IMAGES.length] : undefined;
    const likesCount = 15 + Math.floor((101 - i) * 14.2) + (i % 7) * 8;
    const sharesCount = 2 + Math.floor(likesCount / 15);
    
    const commentCount = 1 + (i % 4);
    const commentsList: VFlowComment[] = [];
    for (let c = 0; c < commentCount; c++) {
      const commenter = AUTHORS[(i + c + 2) % AUTHORS.length];
      commentsList.push({
        id: `c-${i}-${c}`,
        author: commenter.author,
        handle: commenter.handle,
        avatar: commenter.avatar,
        isVerified: commenter.isVerified,
        verifiedType: commenter.verifiedType,
        text: COMMENT_POOL[(i + c * 3) % COMMENT_POOL.length],
        time: `${(c + 1) * 4 + (i % 6)} phút trước`,
        likes: 2 + (c * 3) + (i % 4)
      });
    }

    postsList.push({
      id: `post-${i}`,
      author: authorObj.author,
      handle: authorObj.handle,
      avatar: authorObj.avatar,
      isVerified: authorObj.isVerified,
      verifiedType: authorObj.verifiedType,
      time: `${i * 10} phút trước`,
      content: `${template.text}\n\n(#BàiViết ${i}/100 trên V-Flow Community)`,
      tag: template.tag,
      imageUrl: imgUrl,
      likes: likesCount,
      isLiked: false,
      shares: sharesCount,
      comments: commentsList,
      isBookmarked: false
    });
  }

  return postsList;
}

export default function VFlowTab({
  onBack,
  verifiedSub,
  onNavigateToTab,
  vCoins,
  setVCoins
}: VFlowTabProps) {
  const isVerifiedUser = verifiedSub.plan !== "none";
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradePromptReason, setUpgradePromptReason] = useState<string>("tương tác");

  const checkVerifiedPermission = (actionName: string): boolean => {
    if (!isVerifiedUser) {
      setUpgradePromptReason(actionName);
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  // Posts State
  const [posts, setPosts] = useState<VFlowPost[]>(() => {
    const saved = localStorage.getItem("vplay_vflow_posts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 80) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return generate100Posts();
  });

  useEffect(() => {
    localStorage.setItem("vplay_vflow_posts", JSON.stringify(posts));
  }, [posts]);

  // Composer States
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostTag, setNewPostTag] = useState("VplayLive");
  const [showImageInput, setShowImageInput] = useState(false);

  // Filter & Search
  const [filterTag, setFilterTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Comment Drawer State per post
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    if (!checkVerifiedPermission("đăng bài viết mới")) return;

    const newPost: VFlowPost = {
      id: "post-" + Date.now(),
      author: verifiedSub.plan === "verified_plus" ? "Vplay Royal VIP" : "Vplay Verified Member",
      handle: "@user_verified",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      verifiedType: verifiedSub.plan === "verified_plus" ? "verified_plus" : "verified",
      time: "Vừa xong",
      content: newPostText,
      tag: newPostTag,
      imageUrl: newPostImage.trim() || undefined,
      likes: 1,
      isLiked: true,
      shares: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage("");
    setShowImageInput(false);
    showToast("Đã đăng bài viết thành công lên V-Flow!");
  };

  // Like Toggle
  const handleToggleLike = (postId: string) => {
    if (!checkVerifiedPermission("thả tim bài viết")) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likes: newLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Bookmark Toggle
  const handleToggleBookmark = (postId: string) => {
    if (!checkVerifiedPermission("lưu bài viết yêu thích")) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newBm = !p.isBookmarked;
          if (newBm) showToast("Đã lưu bài viết vào danh sách yêu thích!");
          return { ...p, isBookmarked: newBm };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    if (!checkVerifiedPermission("bình luận bài viết")) return;

    const newComment: VFlowComment = {
      id: "c-" + Date.now(),
      author: verifiedSub.plan === "verified_plus" ? "Royal Member" : "Verified Member",
      handle: "@me_verified",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      verifiedType: verifiedSub.plan === "verified_plus" ? "verified_plus" : "verified",
      text: commentInput,
      time: "Vừa xong",
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentInput("");
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesTag =
      filterTag === "all"
        ? true
        : filterTag === "hot"
        ? p.likes > 200
        : filterTag === "media"
        ? !!p.imageUrl
        : p.tag === filterTag;

    const matchesSearch =
      searchQuery === ""
        ? true
        : p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.handle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#08090c] text-white p-3 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-[120px] pointer-events-none -z-0" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[99999] bg-gradient-to-r from-amber-400 to-yellow-300 text-black px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                V-Flow Community
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase">
                VERIFIED ONLY
              </span>
            </div>
            <p className="text-xs text-zinc-400">Mạng xã hội truyền hình & giải trí chuẩn VIP</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isVerifiedUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
              <span className="hidden sm:inline">Tài Khoản Verified VIP</span>
            </div>
          ) : (
            <button
              onClick={() => onNavigateToTab("verified")}
              className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-xs font-black shadow-lg hover:from-amber-300 hover:to-yellow-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Nâng Cấp Verified</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto py-6 space-y-6 relative z-10">

        {/* READ-ONLY BANNER FOR NON-VERIFIED USERS */}
        {!isVerifiedUser && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <span className="font-extrabold text-amber-300">Chế độ Xem Thử (Read-Only):</span>{" "}
                <span>Bạn đang duyệt 100+ bài viết truyền hình & cộng đồng V-Flow. Hãy nâng cấp Verified VIP để Đăng bài, Thả tim & Bình luận!</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab("verified")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs hover:from-amber-300 hover:to-yellow-200 cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Nâng Cấp VIP Ngay</span>
            </button>
          </div>
        )}

        {/* CREATE POST COMPOSER BOX */}
        <div className="rounded-3xl bg-zinc-950/90 border border-white/10 p-4 sm:p-5 shadow-xl space-y-4 relative overflow-hidden">
          {!isVerifiedUser && (
            <div className="absolute inset-0 z-20 bg-zinc-950/85 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between p-4 px-6 gap-3 text-center sm:text-left border border-amber-500/30 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Chức Năng Đăng Bài VIP</h4>
                  <p className="text-[11px] text-zinc-400">Nâng cấp Verified VIP để đăng bài viết, ảnh & cảm nghĩ lên V-Flow</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab("verified")}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shrink-0 shadow-md flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>Nâng Cấp VIP</span>
              </button>
            </div>
          )}

          <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-black">
                    <BadgeCheck className="w-3 h-3 fill-black text-amber-400" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <textarea
                    rows={2}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Bạn đang nghĩ gì về các kênh truyền hình & bộ phim Vplay hôm nay?"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
                  />

                  {/* Image URL preview input if toggled */}
                  {showImageInput && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10">
                      <Image className="w-4 h-4 text-zinc-400 shrink-0" />
                      <input
                        type="url"
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        placeholder="Dán URL hình ảnh (https://...)"
                        className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowImageInput(false)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Attachment Bar & Submit Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          showImageInput
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-white/5 hover:bg-white/10 text-zinc-300"
                        }`}
                      >
                        <Image className="w-4 h-4 text-emerald-400" />
                        <span>Đính ảnh</span>
                      </button>

                      {/* Tag selector */}
                      <select
                        value={newPostTag}
                        onChange={(e) => setNewPostTag(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-amber-300 border border-white/10 focus:outline-none cursor-pointer"
                      >
                        <option value="VplayLive" className="bg-zinc-900 text-white">#VplayLive</option>
                        <option value="BóngĐá" className="bg-zinc-900 text-white">#BóngĐá</option>
                        <option value="PhimẢnh" className="bg-zinc-900 text-white">#PhimẢnh</option>
                        <option value="CongDong" className="bg-zinc-900 text-white">#CongDong</option>
                        <option value="Anime" className="bg-zinc-900 text-white">#Anime</option>
                      </select>
                    </div>

                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostText.trim()}
                      className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        newPostText.trim()
                          ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng Bài</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setFilterTag("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "all"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterTag("hot")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    filterTag === "hot"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Xu hướng</span>
                </button>
                <button
                  onClick={() => setFilterTag("media")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "media"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  Hình ảnh
                </button>
                <button
                  onClick={() => setFilterTag("BóngĐá")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "BóngĐá"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  #BóngĐá
                </button>
                <button
                  onClick={() => setFilterTag("PhimẢnh")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterTag === "PhimẢnh"
                      ? "bg-amber-500 text-black font-extrabold shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  #PhimẢnh
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-60 shrink-0">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài viết..."
                  className="w-full bg-zinc-900/90 border border-white/10 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* POSTS LIST */}
            <div className="space-y-5">
              {filteredPosts.length === 0 ? (
                <div className="py-12 text-center rounded-3xl bg-zinc-950/60 border border-white/5 text-zinc-500 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-bold">Không tìm thấy bài viết nào phù hợp</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-3xl bg-zinc-950/90 border border-white/10 p-5 shadow-xl space-y-4 hover:border-amber-500/30 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-white">{post.author}</span>
                            {post.isVerified && (
                              post.verifiedType === "verified_plus" ? (
                                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" title="Verified PLUS Royal Member" />
                              ) : (
                                <BadgeCheck className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" title="Verified Member" />
                              )
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span>{post.handle}</span>
                            <span>•</span>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>

                      {post.tag && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                          #{post.tag}
                        </span>
                      )}
                    </div>

                    {/* Post Body */}
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Post Media */}
                    {post.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[400px] bg-black">
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-zinc-400">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            post.isLiked ? "text-red-400 font-extrabold" : "hover:text-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            openCommentPostId === post.id ? "text-amber-300 font-bold" : "hover:text-white"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments.length}</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => showToast("Đã sao chép liên kết bài viết!")}
                          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`transition-colors cursor-pointer ${
                          post.isBookmarked ? "text-amber-400 fill-amber-400" : "hover:text-white"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                    </div>

                    {/* COMMENT DRAWER / PANEL */}
                    {openCommentPostId === post.id && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        {/* Comments List */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {post.comments.length === 0 ? (
                            <div className="text-center py-4 text-xs text-zinc-500">
                              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                            </div>
                          ) : (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
                                <img
                                  src={comment.avatar}
                                  alt={comment.author}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <span className="font-extrabold text-xs text-white">{comment.author}</span>
                                      {comment.isVerified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-500">{comment.time}</span>
                                  </div>
                                  <p className="text-xs text-zinc-300">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Viết bình luận..."
                            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInput.trim()}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

      </div>

      {/* UPGRADE PROMPT MODAL FOR UNVERIFIED USERS */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-amber-500/50 p-6 sm:p-8 text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Yêu Cầu Tài Khoản Verified VIP!</h3>
              <p className="text-xs text-zinc-300 mt-2">
                Bạn cần sở hữu gói <strong className="text-amber-400">Verified VIP</strong> để thực hiện thao tác <span className="text-amber-300 font-bold">{upgradePromptReason}</span> trên Mạng xã hội V-Flow.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
                <span>Nâng cấp Verified 100% Miễn Phí bằng V-pearls!</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-5">
                Chỉ cần điểm danh hàng ngày nhận 50 V-pearls/ngày để đổi gói Verified hoàn toàn miễn phí.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-1/2 py-3 rounded-2xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:text-white cursor-pointer"
              >
                Trải Nghiệm Đọc
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  onNavigateToTab("verified");
                }}
                className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Nâng Cấp VIP Ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
