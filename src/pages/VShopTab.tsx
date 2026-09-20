import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  ArrowRight,
  Coins,
  AlertCircle
} from 'lucide-react';
import { 
  V_SHOP_PRODUCTS, 
  VShopProduct, 
  SHOP_HERO_SLIDES, 
  SHOP_CATEGORIES, 
  ShopCategory 
} from '../data/vShopData';
import { HeroCarousel } from '../components/HeroCarousel';
import { useOrbs } from '../hooks/useOrbs';
import { useTabSearch } from '../context/TabSearchContext';

interface VShopTabProps {
  navigate: (route: string, state?: any) => void;
}

interface CartItem {
  product: VShopProduct;
  quantity: number;
}

export const VShopTab: React.FC<VShopTabProps> = ({ navigate }) => {
  const { orbs, spendOrbs, addOrbs } = useOrbs();
  const { searchQuery, setSearchQuery } = useTabSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  // Save cart to local storage
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('vshop_cart', JSON.stringify(newCart));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (product: VShopProduct) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cart, { product, quantity: 1 }];
    }
    updateCart(updated);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    updateCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    updateCart(updated);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPriceVND = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalOrbs = cart.reduce((acc, item) => acc + item.product.priceOrbs * item.quantity, 0);

  // Thanh toán bằng Orbs (10.000 VND = 10 ORBS)
  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (orbs < totalOrbs) {
      setInsufficientFunds(true);
      return;
    }

    const success = spendOrbs(totalOrbs);
    if (success) {
      setInsufficientFunds(false);
      setCheckoutSuccess(true);
      updateCart([]);
      showToast(`Thanh toán thành công! Đã trừ ${totalOrbs.toLocaleString()} ORBS.`);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setIsCartOpen(false);
      }, 3000);
    }
  };

  // Filtered products for search
  const filteredProducts = V_SHOP_PRODUCTS.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Category refs for smooth scrolling
  const categoryRefs = {
    'Thực phẩm': useRef<HTMLDivElement>(null),
    'Đồ công nghệ - Điện tử': useRef<HTMLDivElement>(null),
    'Đồ gia dụng': useRef<HTMLDivElement>(null),
  };

  const scrollRow = (category: ShopCategory, direction: 'left' | 'right') => {
    const ref = categoryRefs[category];
    if (!ref || !ref.current) return;
    const scrollAmount = 350;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Render an individual product card in the horizontal block
  const renderProductCard = (product: VShopProduct) => (
    <div
      key={product.id}
      className="w-[260px] sm:w-[290px] md:w-[310px] shrink-0 rounded-2xl bg-[#181822]/95 border border-[#2B2B38] hover:border-[#E6005A]/50 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-[#E6005A]/10 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
    >
      {/* Product Image Box */}
      <div className="relative w-full h-48 sm:h-52 bg-white flex items-center justify-center p-4 overflow-hidden">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#E6005A] text-white shadow-md">
            {product.badge}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&q=80';
          }}
        />
        <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 text-white/95 backdrop-blur-sm">
          {product.category}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-gradient-to-b from-[#181822] to-[#12121A]">
        <div className="space-y-1.5">
          <h3 
            className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF4C93] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price in ORBS & Buy Button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-medium">Giá quy đổi</span>
            <span className="text-base sm:text-lg font-black text-[#FFB800] tracking-tight flex items-center gap-1">
              <Coins className="w-4 h-4 text-white shrink-0" />
              {product.priceOrbs.toLocaleString()} ORBS
            </span>
            <span className="text-[10.5px] text-zinc-400 font-mono">
              ~ {product.priceFormatted}
            </span>
          </div>

          <button
            id={`btn-shop-buy-${product.id}`}
            onClick={() => addToCart(product)}
            className="px-3.5 py-2 rounded-xl bg-[#E6005A] hover:bg-[#FF1A75] active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-[#E6005A]/30 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Chọn mua</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 text-white space-y-8">
      {/* 1. THẺ BANNER TRƯỢT (Đồng bộ hoạt ảnh với Trang chủ Home Page) */}
      <div className="w-full">
        <HeroCarousel slides={SHOP_HERO_SLIDES} idPrefix="shop" />
      </div>

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* Top Header with Orbs Balance & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#181824] via-[#202030] to-[#181824] border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Shop
                </h1>
                <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                  Chính hãng
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Quy đổi từ VND sang <span className="text-yellow-400 font-semibold">ORBS</span> (10.000 VND = 10 <span className="text-yellow-400 font-semibold">ORBS</span>) • Mua sắm tiện lợi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* User Orbs Balance Pill */}
            <div 
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold shadow-sm"
              title="Số dư Orbs hiện tại của bạn"
            >
              <Coins className="w-4 h-4 text-white" />
              <span>Số dư: <strong className="text-yellow-400 font-mono text-sm">{orbs.toLocaleString()}</strong> <span className="text-yellow-400">ORBS</span></span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72 h-[42px] flex items-center px-4 rounded-full spotlight-bubble-box search-box-capsule float-search-style text-xs transition-all border-0">
              <Search className="w-4.5 h-4.5 text-white stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              id="btn-shop-open-cart"
              onClick={() => {
                setInsufficientFunds(false);
                setIsCartOpen(true);
              }}
              className="relative px-5 py-2 rounded-full bg-gradient-to-r from-[#E6005A] to-[#FF4C93] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>Giỏ hàng</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#E6005A] text-xs font-black flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Important Shop Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm leading-relaxed shadow-lg backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-bold text-amber-300">Lưu ý:</strong> Bạn vẫn phải thanh toán tiền mặt hoặc tiền tài khoản khi đặt mua hoặc nhận hàng, và số Orbs của bạn vẫn sẽ bị trừ đúng với giá trị tiền thật.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1E1E2C] text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            Tất cả danh mục
          </button>
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#E6005A] text-white shadow-md shadow-[#E6005A]/30'
                  : 'bg-[#1E1E2C] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH RESULT VIEW (If searching or single category filtered) */}
        {(searchQuery || selectedCategory !== 'all') ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Kết quả lọc sản phẩm</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-semibold">
                  {filteredProducts.length} sản phẩm
                </span>
              </h2>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#FF4C93] hover:underline cursor-pointer"
              >
                Xem toàn bộ khối ngang
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-[#161622] rounded-2xl border border-white/5">
                <Search className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-base text-zinc-400 font-medium">Không tìm thấy sản phẩm nào</p>
                <p className="text-xs text-zinc-500">Hãy thử từ khóa khác như "nước dừa", "tai nghe", "nồi chiên"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(renderProductCard)}
              </div>
            )}
          </div>
        ) : (
          /* 3 KHỐI NGANG CẤP 2 THEO ĐÚNG 3 CATEGORY YÊU CẦU:
             1. Thực phẩm
             2. Đồ công nghệ - Điện tử
             3. Đồ gia dụng
             (Đã bỏ description theo yêu cầu)
          */
          <div className="space-y-10 pt-2">
            {/* CATEGORY 1: Thực phẩm */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Thực phẩm</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollRow('Thực phẩm', 'left')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRow('Thực phẩm', 'right')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={categoryRefs['Thực phẩm']}
                className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
              >
                {V_SHOP_PRODUCTS.filter((p) => p.category === 'Thực phẩm').map(renderProductCard)}
              </div>
            </section>

            {/* CATEGORY 2: Đồ công nghệ - Điện tử */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Đồ công nghệ - Điện tử</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollRow('Đồ công nghệ - Điện tử', 'left')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRow('Đồ công nghệ - Điện tử', 'right')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={categoryRefs['Đồ công nghệ - Điện tử']}
                className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
              >
                {V_SHOP_PRODUCTS.filter((p) => p.category === 'Đồ công nghệ - Điện tử').map(renderProductCard)}
              </div>
            </section>

            {/* CATEGORY 3: Đồ gia dụng */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Đồ gia dụng</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollRow('Đồ gia dụng', 'left')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRow('Đồ gia dụng', 'right')}
                    className="w-8 h-8 rounded-full bg-[#20202C] hover:bg-[#2E2E3E] text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                    title="Cuộn sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={categoryRefs['Đồ gia dụng']}
                className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
              >
                {V_SHOP_PRODUCTS.filter((p) => p.category === 'Đồ gia dụng').map(renderProductCard)}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-[#161622] border-l border-[#2E2E40] shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-white">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Giỏ hàng của bạn</h3>
                    <p className="text-xs text-zinc-400">{totalItemsCount} sản phẩm đã chọn</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Current Orbs Balance Widget */}
              <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white">
                  <Coins className="w-4 h-4 text-white shrink-0" />
                  <span>Số dư Orbs của bạn:</span>
                </div>
                <span className="font-mono font-bold text-sm text-white">
                  {orbs.toLocaleString()} ORBS
                </span>
              </div>

              {/* Cart Items List */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-340px)] pr-1">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
                    <p className="text-sm text-zinc-400 font-medium">Giỏ hàng của bạn đang trống</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs text-[#FF4C93] hover:underline font-semibold cursor-pointer"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-xl bg-[#1D1D2C] border border-white/5 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-contain rounded-lg bg-white p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-[#FFB800] flex items-center gap-0.5">
                            <Coins className="w-3 h-3 text-white shrink-0" />
                            {(item.product.priceOrbs * item.quantity).toLocaleString()} ORBS
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ({item.product.priceFormatted})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-5 h-5 rounded-md bg-[#2B2B3C] hover:bg-[#38384E] text-white flex items-center justify-center text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded-md bg-[#2B2B3C] hover:bg-[#38384E] text-white flex items-center justify-center text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Footer / Checkout */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Tổng thanh toán:</span>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#FFB800] flex items-center gap-1.5 justify-end">
                      <Coins className="w-5 h-5 text-white" />
                      <span>{totalOrbs.toLocaleString()} ORBS</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      ~ {new Intl.NumberFormat('vi-VN').format(totalPriceVND)} VND (10.000đ = 10 ORBS)
                    </span>
                  </div>
                </div>

                {/* Insufficient Funds Warning */}
                {insufficientFunds && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>
                        Số dư Orbs không đủ! Bạn cần <strong>{totalOrbs.toLocaleString()} ORBS</strong> (hiện có <strong>{orbs.toLocaleString()} ORBS</strong>).
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addOrbs(1000);
                        setInsufficientFunds(false);
                        showToast('Đã cộng +1.000 ORBS miễn phí!');
                      }}
                      className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      + Nhận ngay 1.000 ORBS miễn phí
                    </button>
                  </div>
                )}

                {/* Important Checkout Note */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11.5px] text-amber-200 leading-relaxed">
                  <strong className="text-amber-300 font-bold">Lưu ý:</strong> Bạn vẫn phải thanh toán tiền mặt hoặc tiền tài khoản khi đặt mua hoặc nhận hàng, và số Orbs của bạn vẫn sẽ bị trừ đúng với giá trị tiền thật.
                </div>

                {checkoutSuccess ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-600/90 text-white font-bold text-sm text-center flex items-center justify-center gap-2 animate-bounce">
                    <Check className="w-4 h-4" />
                    <span>Thanh toán Orbs thành công!</span>
                  </div>
                ) : (
                  <button
                    id="btn-shop-checkout"
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E6005A] to-[#FF4C93] hover:brightness-110 active:scale-95 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-white" />
                    <span>Thanh toán {totalOrbs.toLocaleString()} ORBS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1E1E2C] border border-[#E6005A]/40 text-white shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
