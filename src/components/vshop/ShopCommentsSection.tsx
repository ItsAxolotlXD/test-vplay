import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2, Filter, Sparkles, User, ShoppingBag } from 'lucide-react';
import { V_SHOP_PRODUCTS } from '../../data/vShopData';
import { playPopSound } from '../../utils/sound';

export interface ShopComment {
  id: string;
  author: string;
  avatarColor: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
  likes: number;
  isVerifiedBuyer: boolean;
}

const INITIAL_COMMENTS: ShopComment[] = [
  {
    id: 'c1',
    author: 'Nguyễn Hoàng Nam',
    avatarColor: 'from-blue-500 to-indigo-600',
    rating: 5,
    productName: 'Áo Thun VNRT Online Edition',
    comment: 'Chất vải 100% cotton dày dặn, mặc mềm mát thấm hút mồ hôi tốt. Logo VNRT Online in chuyển nhiệt sắc nét giặt máy không lo bong tróc. Rất đáng tiền!',
    date: '2 ngày trước',
    likes: 24,
    isVerifiedBuyer: true
  },
  {
    id: 'c2',
    author: 'Lê Thùy Dung',
    avatarColor: 'from-pink-500 to-rose-600',
    rating: 5,
    productName: 'Mũ Lưỡi Trai Cyberpunk Cap',
    comment: 'Mũ form cứng cáp chuẩn chỉ, đội ôm đầu vừa vặn. Khóa kim loại phía sau chỉnh size mượt mà, phong cách hiện đại đội đi chơi ai cũng hỏi mua ở đâu.',
    date: '3 ngày trước',
    likes: 19,
    isVerifiedBuyer: true
  },
  {
    id: 'c3',
    author: 'Trần Quốc Bảo',
    avatarColor: 'from-amber-500 to-orange-600',
    rating: 5,
    productName: 'Cốc Sứ Đổi Màu Nhiệt VPlay',
    comment: 'Rót nước nóng vào là hiệu ứng đổi màu logo VNRT Online hiện ra cực kỳ ảo diệu! Men sứ bóng loáng, đóng gói hộp xốp rất an toàn không sợ sứt mẻ.',
    date: '5 ngày trước',
    likes: 31,
    isVerifiedBuyer: true
  },
  {
    id: 'c4',
    author: 'Đỗ Mai Anh',
    avatarColor: 'from-emerald-500 to-teal-600',
    rating: 5,
    productName: 'Bình Giữ Nhiệt Smart Thermal',
    comment: 'Bình giữ lạnh cả ngày, sáng bỏ đá vào đến tối đá vẫn chưa tan hết. Có hiển thị nhiệt độ cảm ứng trên nắp cực tiện lợi, không bám vân tay.',
    date: '1 tuần trước',
    likes: 15,
    isVerifiedBuyer: true
  },
  {
    id: 'c5',
    author: 'Vũ Đình Hưng',
    avatarColor: 'from-purple-500 to-indigo-600',
    rating: 4,
    productName: 'Balo Công Nghệ VPlay Shield',
    comment: 'Balo chống nước tốt, nhiều ngăn để laptop và phụ kiện. Quai đeo có đệm mút êm ái, đi làm cả ngày không bị mỏi lưng. Đổi bằng Orbs siêu hời.',
    date: '1 tuần trước',
    likes: 11,
    isVerifiedBuyer: true
  }
];

const STORAGE_KEY = 'vshop_user_comments';

export const ShopCommentsSection: React.FC = () => {
  const [comments, setComments] = useState<ShopComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMMENTS;
  });

  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [authorName, setAuthorName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Đánh giá chung về V-Shop');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {}
  }, [comments]);

  const handleToggleLike = (id: string) => {
    playPopSound();
    setLikedMap((prev) => {
      const next = !prev[id];
      setComments((list) =>
        list.map((c) => (c.id === id ? { ...c, likes: c.likes + (next ? 1 : -1) } : c))
      );
      return { ...prev, [id]: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    playPopSound();
    const newCommentItem: ShopComment = {
      id: 'usr_' + Date.now(),
      author: authorName.trim() || 'Khách hàng VNRT',
      avatarColor: 'from-[#E6005A] to-[#FF4C93]',
      rating,
      productName: selectedProduct,
      comment: commentText.trim(),
      date: 'Vừa xong',
      likes: 1,
      isVerifiedBuyer: true
    };

    setComments([newCommentItem, ...comments]);
    setCommentText('');
    setAuthorName('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const filteredComments = comments.filter((c) => {
    if (filterRating === 'all') return true;
    return c.rating === filterRating;
  });

  const avgRating = (comments.reduce((acc, c) => acc + c.rating, 0) / (comments.length || 1)).toFixed(1);

  return (
    <section id="shop-comments-section" className="space-y-6 pt-6 border-t border-white/10 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-[#E6005A] rounded-full shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Bình luận & Đánh giá Shop</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#E6005A]/20 text-pink-300 border border-[#E6005A]/30">
                {comments.length} Đánh giá
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Xem nhận xét thực tế từ cộng đồng và chia sẻ trải nghiệm mua sắm của bạn
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-lg shrink-0">
          <div className="text-center pr-3 border-r border-white/10">
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
              <span>{avgRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-[10px] text-zinc-400 font-medium">98% Hài lòng</div>
          </div>
          <div className="text-xs text-zinc-300 space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chính hãng 100%</span>
            </div>
            <div className="text-[10.5px] text-zinc-400">Đổi trả miễn phí 7 ngày</div>
          </div>
        </div>
      </div>

      {/* Main Container: Form on Left/Top + Comments List on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Create Review Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <MessageSquare className="w-4 h-4 text-[#E6005A]" />
              <h3 className="font-bold text-sm text-white">Gửi đánh giá của bạn</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Star Rating Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Đánh giá sao:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-1">
                    {rating === 5 ? 'Tuyệt vời ⭐⭐⭐⭐⭐' : rating === 4 ? 'Rất tốt ⭐⭐⭐⭐' : rating === 3 ? 'Bình thường ⭐⭐⭐' : 'Cần cải thiện'}
                  </span>
                </div>
              </div>

              {/* Product Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Sản phẩm đánh giá:</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/90 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-[#E6005A] transition-colors"
                >
                  <option value="Đánh giá chung về V-Shop">Đánh giá chung về V-Shop</option>
                  {V_SHOP_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.name}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Tên của bạn (Tùy chọn):</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Long, Minh Anh..."
                  maxLength={30}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-800/90 border border-white/10 text-white placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-[#E6005A] transition-colors"
                />
              </div>

              {/* Comment Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Nội dung bình luận:</label>
                  <span className="text-[10px] text-zinc-500 font-mono">{commentText.length}/300</span>
                </div>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm, dịch vụ giao hàng, đóng gói..."
                  maxLength={300}
                  required
                  className="w-full p-3 rounded-xl bg-zinc-800/90 border border-white/10 text-white placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-[#E6005A] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E6005A] to-[#FF4C93] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-lg shadow-pink-600/30 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đăng bình luận</span>
              </button>

              {isSuccessToast && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cảm ơn bạn! Bình luận đã được đăng thành công.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Filter + Comments Feed */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-zinc-900/60 border border-white/10 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-semibold px-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc:
              </span>
              {[
                { label: 'Tất cả', val: 'all' },
                { label: '5 ⭐', val: 5 },
                { label: '4 ⭐', val: 4 }
              ].map((f) => (
                <button
                  key={String(f.val)}
                  type="button"
                  onClick={() => setFilterRating(f.val as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterRating === f.val
                      ? 'bg-gradient-to-r from-[#E6005A] to-[#FF4C93] text-white shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-zinc-400 pr-2">
              Hiển thị <strong>{filteredComments.length}</strong> bình luận
            </span>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredComments.length === 0 ? (
              <div className="py-12 text-center bg-zinc-900/40 rounded-3xl border border-white/10 space-y-2">
                <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm font-medium">Chưa có bình luận nào ở mức lọc này.</p>
              </div>
            ) : (
              filteredComments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 shadow-md transition-all space-y-2.5"
                >
                  {/* Author + Rating row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${item.avatarColor} flex items-center justify-center text-white font-black text-xs uppercase shadow-sm border border-white/10 shrink-0`}
                      >
                        {item.author.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm leading-none">
                            {item.author}
                          </span>
                          {item.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Đã mua hàng</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= item.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-500">• {item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        likedMap[item.id]
                          ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                          : 'bg-zinc-800/80 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                      title="Đánh giá hữu ích"
                    >
                      <ThumbsUp className={`w-3 h-3 ${likedMap[item.id] ? 'fill-pink-400 text-pink-400' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                  </div>

                  {/* Product tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-medium">
                    <ShoppingBag className="w-2.5 h-2.5 text-[#E6005A]" />
                    <span>Sản phẩm: {item.productName}</span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                    {item.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
