import React, { useState, useEffect } from "react";
import {
  Armchair,
  ShoppingBag,
  ShoppingCart,
  Search,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  Tag,
  Plus,
  Minus,
  Trash2,
  X,
  ChevronRight,
  Info,
  Gift,
  Coins,
  ShieldCheck,
  Truck,
  Star,
  Check,
  Home
} from "lucide-react";
import { playPopSound } from "../../utils/sound";

export interface FurnitureProduct {
  id: string;
  name: string;
  category: "living" | "kitchen" | "bedroom" | "smart" | "decor";
  categoryName: string;
  priceOre: number;
  originalPriceOre?: number;
  rating: number;
  reviewCount: number;
  image: string;
  tagline: string;
  description: string;
  badge?: string;
  specs: { [key: string]: string };
  inStock: boolean;
}

export interface CartItem {
  product: FurnitureProduct;
  quantity: number;
}

export interface PurchasedItem {
  id: string;
  product: FurnitureProduct;
  quantity: number;
  totalOre: number;
  purchaseDate: string;
  deliveryStatus: "Đã giao đến nhà" | "Đang vận chuyển";
}

const PRODUCT_CATALOG: FurnitureProduct[] = [
  {
    id: "furn_sofa_01",
    name: "Sofa Gỗ Sồi OreUI Premium",
    category: "living",
    categoryName: "Phòng khách",
    priceOre: 1200,
    originalPriceOre: 1500,
    rating: 4.9,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    tagline: "Khung gỗ sồi tự nhiên, nệm bọc da Microfiber cao cấp",
    description: "Bộ ghế sofa phòng khách thiết kế phong cách Nordic hiện đại, nệm mút bọt biển nguyên khối êm ái, chống xẹp lỡ, chịu lực lên tới 500kg.",
    badge: "Bán chạy",
    specs: {
      "Kích thước": "240 x 85 x 78 cm",
      "Chất liệu": "Gỗ sồi Nga + Da bọc Ý",
      "Bảo hành": "5 năm khung gỗ",
      "Màu sắc": "Xám ghi / Nâu gỗ"
    },
    inStock: true
  },
  {
    id: "furn_fridge_01",
    name: "Tủ Lạnh V-Smart Inverter 500L",
    category: "kitchen",
    categoryName: "Phòng bếp",
    priceOre: 2500,
    originalPriceOre: 2900,
    rating: 5.0,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    tagline: "Công nghệ đông mềm Dual Tech, tiết kiệm điện 45%",
    description: "Tủ lạnh 4 cửa thông minh kết nối V-App, làm đá tự động, diệt khuẩn Ag+ Nano khử mùi vượt trội, giữ rau củ tươi ngon 14 ngày.",
    badge: "Ore VIP",
    specs: {
      "Dung tích": "500 Lít",
      "Công nghệ": "Digital Inverter V-Smart",
      "Điện năng": "1.1 kWh/ngày",
      "Kích thước": "83 x 69 x 180 cm"
    },
    inStock: true
  },
  {
    id: "furn_cooker_01",
    name: "Nồi Cơm Điện Cao Tần V-Cook Pro",
    category: "kitchen",
    categoryName: "Phòng bếp",
    priceOre: 650,
    originalPriceOre: 800,
    rating: 4.8,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80",
    tagline: "Nấu cơm IH 3D chín dẻo từng hạt, lòng nồi gang bọc sứ",
    description: "Nồi cơm điện áp suất cao tần công nghệ IH 360 độ, 18 chế độ nấu tự động (cơm niêu, cháo, hầm yến, làm bánh), màn hình cảm ứng Led Ore UI.",
    badge: "Giảm 19%",
    specs: {
      "Dung tích": "1.8 Lít (4-8 người)",
      "Lòng nồi": "Gang đúc 5 lớp dày 3mm",
      "Công suất": "1300W",
      "Bảo hành": "24 tháng"
    },
    inStock: true
  },
  {
    id: "furn_bed_01",
    name: "Giường Ngủ Gỗ Gõ Đỏ Royal",
    category: "bedroom",
    categoryName: "Phòng ngủ",
    priceOre: 3200,
    originalPriceOre: 3800,
    rating: 4.9,
    reviewCount: 62,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
    tagline: "Gỗ gõ đỏ tự nhiên nguyên khối, hoa văn chạm khắc tinh xảo",
    description: "Mẫu giường tân cổ điển sang trọng cho không gian phòng ngủ đẳng cấp. Khung vạt phản chắc chắn, mùi gỗ thơm tự nhiên dễ chịu.",
    badge: "Đồ Cao Cấp",
    specs: {
      "Kích thước": "180 x 200 cm (King Size)",
      "Chất liệu": "100% Gỗ Gõ Đỏ Nhập Khẩu",
      "Tải trọng": "800 kg",
      "Bảo hành": "10 năm"
    },
    inStock: true
  },
  {
    id: "furn_robot_01",
    name: "Robot Hút Bụi Lau Nhà V-Clean AI",
    category: "smart",
    categoryName: "Gia dụng thông minh",
    priceOre: 1800,
    originalPriceOre: 2200,
    rating: 4.9,
    reviewCount: 315,
    image: "https://images.unsplash.com/photo-1625834317364-b32c140fd360?w=600&auto=format&fit=crop&q=80",
    tagline: "Lực hút 6000Pa, né vật cản LiDAR 3D, giặt giẻ tự động",
    description: "Robot lau dọn nhà thông minh thế hệ mới, tự động đổ rác vào dock sạc 3L, sấy khô giẻ lau bằng khí nóng 55°C, lập bản đồ 3D chuẩn xác.",
    badge: "Xu Hướng",
    specs: {
      "Lực hút": "6000 Pa Max",
      "Pin": "5200 mAh (Dọn 250m²)",
      "Kết nối": "V-App WiFi / Giọng nói",
      "Độ ồn": "< 58 dB"
    },
    inStock: true
  },
  {
    id: "furn_table_01",
    name: "Bàn Ăn Thông Minh Mở Rộng 8 Ghế",
    category: "kitchen",
    categoryName: "Phòng bếp",
    priceOre: 1500,
    rating: 4.7,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=80",
    tagline: "Mặt đá Ceramic chống xước chống cháy, xếp gọn linh hoạt",
    description: "Bàn ăn gấp gọn thông minh kéo dài từ 1.4m lên 2.0m, đi kèm 8 ghế bọc da cao cấp chống bám bẩn. Khung thép sơn tĩnh điện bền bỉ.",
    specs: {
      "Mặt bàn": "Đá Ceramic bóng chống thấm",
      "Khung chân": "Thép mạ Carbon",
      "Ghế đi kèm": "8 ghế bọc da PU",
      "Kích thước": "140-200 x 80 x 75 cm"
    },
    inStock: true
  },
  {
    id: "furn_air_01",
    name: "Máy Lọc Không Khí V-Pure HEPA",
    category: "smart",
    categoryName: "Gia dụng thông minh",
    priceOre: 890,
    originalPriceOre: 1100,
    rating: 4.8,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
    tagline: "Màng lọc HEPA H13 lọc bụi PM2.5 & bù ẩm tự động",
    description: "Máy lọc không khí diện tích 60m², diệt 99.97% vi khuẩn và vi rút trong không khí, khử mùi khói thuốc và lông thú cưng hiệu quả.",
    specs: {
      "Diện tích": "35 - 60 m²",
      "Màng lọc": "HEPA H13 + Than hoạt tính",
      "Cảm biến": "Bụi mịn Laser PM2.5",
      "Độ ồn": "20 - 48 dB"
    },
    inStock: true
  },
  {
    id: "furn_light_01",
    name: "Đèn Chùm Pha Lê Ore UI Luxury",
    category: "decor",
    categoryName: "Trang trí",
    priceOre: 1100,
    rating: 4.9,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1543198181-e6193202e030?w=600&auto=format&fit=crop&q=80",
    tagline: "Pha lê K9 đúc nguyên khối, ánh sáng LED 3 màu điều khiển từ xa",
    description: "Đèn chùm trang trí phòng khách tôn lên nét quý phái cho căn hộ. Tiết kiệm điện năng 85%, tuổi thọ bóng LED hơn 50.000 giờ.",
    badge: "Mới",
    specs: {
      "Chất liệu": "Pha lê K9 + Hợp kim xi vàng 24K",
      "Số bóng": "15 Tay LED",
      "Kích thước": "Đường kính 80cm x Cao 65cm",
      "Điều khiển": "Remote + Cảm ứng V-App"
    },
    inStock: true
  },
  {
    id: "furn_massage_01",
    name: "Ghế Massage V-Rest 4D Zero Gravity",
    category: "living",
    categoryName: "Phòng khách",
    priceOre: 4500,
    originalPriceOre: 5200,
    rating: 5.0,
    reviewCount: 53,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    tagline: "Con lăn 4D bọc silicone mềm, chế độ không trọng lực thư giãn",
    description: "Ghế massage toàn thân cao cấp trang bị 24 bài tập tự động, nhiệt hồng ngoại sưởi ấm lưng & bắp chân, loa bluetooth vòm nghe nhạc thư thái.",
    badge: "Siêu Siêu VIP",
    specs: {
      "Công nghệ": "Con lăn 4D + Túi khí toàn thân",
      "Tính năng": "Zero Gravity, Nhiệt hồng ngoại",
      "Chất liệu": "Da PU Sinh Học Cao Cấp",
      "Trọng lượng": "85 kg"
    },
    inStock: true
  },
  {
    id: "furn_tea_01",
    name: "Bộ Tách Trà Sứ Minh Long Mạ Vàng",
    category: "decor",
    categoryName: "Trang trí",
    priceOre: 420,
    rating: 4.7,
    reviewCount: 160,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    tagline: "Gốm sứ cao cấp nung 1380°C, viền mạ vàng 18K sang trọng",
    description: "Bộ ấm trà bao gồm 1 ấm, 6 tách, 6 đĩa lót và 1 hũ đường. Men sứ trắng mịn không bám ố trà, chịu nhiệt va đập tốt.",
    specs: {
      "Bộ sản phẩm": "13 món trọn bộ",
      "Chất liệu": "Sứ cao cấp mạ vàng 18K",
      "Xuất xứ": "Việt Nam (Minh Long)",
      "Đóng gói": "Hộp quà tặng bọc nhung"
    },
    inStock: true
  },
  {
    id: "furn_stove_01",
    name: "Bếp Từ Đôi V-Cook Induction 4000W",
    category: "kitchen",
    categoryName: "Phòng bếp",
    priceOre: 1350,
    originalPriceOre: 1600,
    rating: 4.8,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    tagline: "Mặt kính Schott Ceran Đức, booster đun siêu tốc 3000W",
    description: "Bếp từ đôi âm sàn công nghệ Inverter duy trì nhiệt liên tục, khóa trẻ em an toàn, hẹn giờ tắt thông minh, tự ngắt khi trào nước.",
    specs: {
      "Công suất": "4000W (Booster 3000W)",
      "Mặt kính": "Schott Ceran vát 4 cạnh",
      "Kích thước đá": "68 x 38 cm",
      "Bảo hành": "36 tháng"
    },
    inStock: true
  },
  {
    id: "furn_fan_01",
    name: "Quạt Tháp Không Cánh V-Cool Silence",
    category: "smart",
    categoryName: "Gia dụng thông minh",
    priceOre: 750,
    rating: 4.8,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1618941702582-84384a51ebdb?w=600&auto=format&fit=crop&q=80",
    tagline: "Gió mát tự nhiên, an toàn cho trẻ nhỏ, tích hợp tạo Ion âm",
    description: "Quạt mát không cánh công nghệ Air Multiplier êm ái dưới 25dB, 12 cấp độ gió, lọc bụi thô không khí và diệt khuẩn bằng tia UV C.",
    specs: {
      "Góc quay": "120 độ tự động",
      "Màn hình": "LED cảm ứng + Remote",
      "Tính năng": "Ion âm + Đèn UV sát khuẩn",
      "Công suất": "45W siêu tiết kiệm"
    },
    inStock: true
  }
];

export const VFurnitureTab: React.FC = () => {
  // Ore Currency state synced with localStorage vplay_vcoins
  const [oreBalance, setOreBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("vplay_vcoins");
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    } catch (e) {}
    return 150000;
  });

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("vplay_vfurniture_cart");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Purchased items state
  const [purchases, setPurchases] = useState<PurchasedItem[]>(() => {
    try {
      const saved = localStorage.getItem("vplay_vfurniture_purchases");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Active sub-tab inside V-Furniture: 'store' | 'cart' | 'purchases'
  const [activeTab, setActiveTab] = useState<"store" | "cart" | "purchases">("store");

  // Selected product modal
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);

  // Toast / Banner notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync oreBalance changes to localStorage & storage event
  useEffect(() => {
    try {
      localStorage.setItem("vplay_vcoins", oreBalance.toString());
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  }, [oreBalance]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vplay_vfurniture_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Sync purchases to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vplay_vfurniture_purchases", JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add to cart handler
  const handleAddToCart = (product: FurnitureProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPopSound();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng Ore! 🛒`);
  };

  // Update cart item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    playPopSound();
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    playPopSound();
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Calculate cart total
  const cartTotalOre = cart.reduce(
    (sum, item) => sum + item.product.priceOre * item.quantity,
    0
  );

  // Claim Daily Free Ore bonus
  const handleClaimFreeOre = () => {
    playPopSound();
    const bonus = 500;
    setOreBalance((prev) => prev + bonus);
    showToast(`🎁 Đã nhận thêm +${bonus.toLocaleString()} Khoáng Thạch Ore miễn phí!`);
  };

  // Buy direct single product
  const handleBuyDirect = (product: FurnitureProduct) => {
    if (oreBalance < product.priceOre) {
      showToast(
        `❌ Bạn không đủ Khoáng Thạch! Cần ${product.priceOre.toLocaleString()} Ore (Hiện có ${oreBalance.toLocaleString()} Ore).`
      );
      return;
    }

    playPopSound();
    setOreBalance((prev) => prev - product.priceOre);

    const newPurchase: PurchasedItem = {
      id: `order_${Date.now()}`,
      product,
      quantity: 1,
      totalOre: product.priceOre,
      purchaseDate: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      deliveryStatus: "Đã giao đến nhà"
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    setSelectedProduct(null);
    showToast(`🎉 Mua thành công "${product.name}"! Sản phẩm đã chuyển vào Kho Đồ Gia Dụng.`);
  };

  // Checkout whole cart
  const handleCheckoutCart = () => {
    if (cart.length === 0) return;

    if (oreBalance < cartTotalOre) {
      showToast(
        `❌ Số dư Ore không đủ! Tổng giỏ hàng là ${cartTotalOre.toLocaleString()} Ore (Hiện có ${oreBalance.toLocaleString()} Ore).`
      );
      return;
    }

    playPopSound();
    setOreBalance((prev) => prev - cartTotalOre);

    const dateStr = new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newPurchases: PurchasedItem[] = cart.map((item, idx) => ({
      id: `order_${Date.now()}_${idx}`,
      product: item.product,
      quantity: item.quantity,
      totalOre: item.product.priceOre * item.quantity,
      purchaseDate: dateStr,
      deliveryStatus: "Đã giao đến nhà"
    }));

    setPurchases((prev) => [...newPurchases, ...prev]);
    setCart([]);
    setActiveTab("purchases");
    showToast(`🎉 Thanh toán thành công ${cart.length} sản phẩm bằng ${cartTotalOre.toLocaleString()} Ore!`);
  };

  // Filter products
  const filteredProducts = PRODUCT_CATALOG.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#232528] border-2 border-[#141414] text-white font-montserrat shadow-2xl rounded-none overflow-hidden select-none space-y-0">
      
      {/* 1. TOP BANNER HEADER */}
      <div className="bg-[#1a1c1e] border-b-2 border-[#141414] p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#28960b] border-2 border-[#141414] flex items-center justify-center text-white shrink-0 shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]">
            <Armchair className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base text-white uppercase tracking-wider font-jura">
                V-FURNITURE • CỬA HÀNG GIA DỤNG ONLINE
              </h1>
              <span className="bg-[#f59e0b] text-[#141414] px-2 py-0.5 text-[10px] font-bold font-mono border border-[#141414]">
                ORE STORE
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 font-jura">
              Trang trí nhà cửa & thiết bị điện gia dụng Vplay - Thanh toán 100% bằng Khoáng Thạch (Ore)
            </p>
          </div>
        </div>

        {/* ORE BALANCE CARD & FREE CLAIM BUTTON */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end bg-[#2a2c30] p-2 border-2 border-[#141414] shadow-inner">
          <div className="flex items-center gap-2 font-mono">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase font-bold">Số dư Khoáng Thạch</div>
              <div className="text-xs sm:text-sm font-black text-amber-400">
                {oreBalance.toLocaleString()} <span className="text-[10px] text-amber-300">ORE</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaimFreeOre}
            className="bg-[#28960b] hover:bg-[#32b312] text-white px-2.5 py-1.5 text-[11px] font-bold font-mono border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69,inset_-1px_-1px_0_#1b5e20] flex items-center gap-1 active:translate-y-[1px]"
            title="Thưởng thêm 500 Ore miễn phí"
          >
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            <span>+500 Ore</span>
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION SUB-TABS & SEARCH BAR */}
      <div className="bg-[#2f3135] border-b-2 border-[#141414] p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              playPopSound();
              setActiveTab("store");
            }}
            className={`px-3 py-1.5 text-xs font-bold font-jura border-2 border-[#141414] flex items-center gap-1.5 transition-none active:translate-y-[1px] ${
              activeTab === "store"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : "bg-[#232528] hover:bg-[#383a3f] text-zinc-300"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cửa hàng Gia Dụng</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab("cart");
            }}
            className={`relative px-3 py-1.5 text-xs font-bold font-jura border-2 border-[#141414] flex items-center gap-1.5 transition-none active:translate-y-[1px] ${
              activeTab === "cart"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : "bg-[#232528] hover:bg-[#383a3f] text-zinc-300"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Giỏ hàng</span>
            {cart.length > 0 && (
              <span className="ml-1 bg-amber-500 text-black px-1.5 py-0.2 text-[10px] font-black rounded-full border border-black">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab("purchases");
            }}
            className={`px-3 py-1.5 text-xs font-bold font-jura border-2 border-[#141414] flex items-center gap-1.5 transition-none active:translate-y-[1px] ${
              activeTab === "purchases"
                ? "bg-[#28960b] text-white shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20]"
                : "bg-[#232528] hover:bg-[#383a3f] text-zinc-300"
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Đồ đã mua ({purchases.length})</span>
          </button>
        </div>

        {/* Search Bar if in store mode */}
        {activeTab === "store" && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm đồ gia dụng, bàn, ghế, tủ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161719] border-2 border-[#141414] pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* TOAST MESSAGE NOTIFICATION */}
      {toastMessage && (
        <div className="bg-[#28960b] border-b-2 border-[#141414] px-4 py-2 text-xs font-bold font-mono text-white flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. MAIN TAB BODY CONTENT */}
      <div className="p-3 sm:p-5 min-h-[480px]">
        {/* VIEW 1: STORE FRONT */}
        {activeTab === "store" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "Tất cả đồ gia dụng" },
                { id: "living", label: "🛋️ Phòng khách" },
                { id: "kitchen", label: "🍳 Phòng bếp" },
                { id: "bedroom", label: "🖏 Phòng ngủ" },
                { id: "smart", label: "⚡ Gia dụng thông minh" },
                { id: "decor", label: "✨ Trang trí & Đèn" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1 text-xs font-bold font-mono border-2 border-[#141414] whitespace-nowrap active:translate-y-[1px] ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-black border-amber-400 font-black shadow-[inset_1px_1px_0_#fde047]"
                      : "bg-[#1f2023] hover:bg-[#2c2e33] text-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#1f2023] border-2 border-[#141414] space-y-2">
                <Armchair className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-400 font-jura">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-xs text-zinc-500 font-mono">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group bg-[#2a2c30] hover:bg-[#32353a] border-2 border-[#141414] hover:border-amber-500/80 p-3 flex flex-col justify-between space-y-3 cursor-pointer shadow-lg transition-all active:translate-y-[1px]"
                  >
                    <div>
                      {/* Image Thumbnail with badge */}
                      <div className="relative aspect-video w-full bg-[#161719] border border-[#141414] overflow-hidden mb-2.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 bg-amber-500 text-black px-2 py-0.5 text-[9px] font-black font-mono border border-black shadow">
                            {product.badge}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-zinc-200 px-2 py-0.5 text-[9px] font-mono border border-white/20">
                          {product.categoryName}
                        </span>
                      </div>

                      {/* Product Title & Rating */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {product.rating} ({product.reviewCount})
                          </span>
                          <span className="text-emerald-400 text-[10px]">✓ Còn hàng</span>
                        </div>

                        <h3 className="font-bold text-sm text-white font-jura line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                          {product.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-2 border-t border-black/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-zinc-400 font-mono">Giá Khoáng Thạch</div>
                          <div className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
                            <span>{product.priceOre.toLocaleString()}</span>
                            <span className="text-[10px] text-amber-300">ORE</span>
                          </div>
                        </div>

                        {product.originalPriceOre && (
                          <div className="text-right">
                            <div className="text-[9px] text-zinc-500 line-through font-mono">
                              {product.originalPriceOre.toLocaleString()} ORE
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-full bg-[#3b3e43] hover:bg-[#474b51] text-white py-1.5 text-[11px] font-bold font-mono border border-[#141414] shadow active:translate-y-[1px] flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3 text-amber-400" />
                          <span>+ Giỏ hàng</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyDirect(product);
                          }}
                          className="w-full bg-[#28960b] hover:bg-[#31b312] text-white py-1.5 text-[11px] font-bold font-mono border border-[#141414] shadow-[inset_1px_1px_0_#89dc69] active:translate-y-[1px] flex items-center justify-center gap-1"
                        >
                          <span>Mua Ngay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SHOPPING CART */}
        {activeTab === "cart" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-[#1a1c1e] p-3 border-2 border-[#141414] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <h2 className="font-bold text-sm text-white font-jura">
                  GIỎ HÀNG ORE CỦA BẠN ({cart.reduce((s, i) => s + i.quantity, 0)} món)
                </h2>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa tất cả</span>
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-12 text-center bg-[#1f2023] border-2 border-[#141414] space-y-3">
                <ShoppingCart className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-300 font-jura">Giỏ hàng gia dụng của bạn đang trống</p>
                <p className="text-xs text-zinc-500 font-mono">
                  Hãy quay lại Cửa Hàng và chọn những vật dụng ưng ý cho căn nhà của bạn!
                </p>
                <button
                  onClick={() => setActiveTab("store")}
                  className="bg-[#28960b] text-white px-4 py-2 text-xs font-bold font-mono border-2 border-[#141414] shadow active:translate-y-[1px]"
                >
                  Khám phá Cửa Hàng
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart list */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-[#2a2c30] border-2 border-[#141414] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-12 object-cover border border-[#141414] bg-black/40 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-white font-jura">
                            {item.product.name}
                          </h4>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {item.product.categoryName} • {item.product.priceOre.toLocaleString()} Ore / cái
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 bg-[#161719] border border-[#141414] p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 bg-[#383a3f] hover:bg-[#474b51] text-white flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 bg-[#383a3f] hover:bg-[#474b51] text-white flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[90px]">
                          <div className="text-[9px] text-zinc-400 font-mono">Thành tiền</div>
                          <div className="text-xs font-black text-amber-400 font-mono">
                            {(item.product.priceOre * item.quantity).toLocaleString()} ORE
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary & Checkout Box */}
                <div className="bg-[#1f2023] border-2 border-[#141414] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>Tổng tiền hàng Ore:</span>
                    <span>{cartTotalOre.toLocaleString()} ORE</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                    <span>Phí giao hàng Vplay Express:</span>
                    <span>MIỄN PHÍ (0 ORE)</span>
                  </div>
                  <div className="border-t border-black/30 pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white font-jura">TỔNG CỘNG THANH TOÁN:</div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Số dư sau thanh toán: {(oreBalance - cartTotalOre).toLocaleString()} ORE
                      </div>
                    </div>
                    <div className="text-base font-black text-amber-400 font-mono">
                      {cartTotalOre.toLocaleString()} ORE
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutCart}
                    className="w-full bg-[#28960b] hover:bg-[#32b312] text-white py-2.5 text-xs font-bold font-mono border-2 border-[#141414] shadow-[inset_2px_2px_0_#89dc69,inset_-2px_-2px_0_#1b5e20] active:translate-y-[1px] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                    <span>XÁC NHẬN THANH TOÁN BẰNG ORE</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PURCHASED ITEMS / INVENTORY */}
        {activeTab === "purchases" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-[#1a1c1e] p-3 border-2 border-[#141414] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <h2 className="font-bold text-sm text-white font-jura">
                  KHO ĐỒ GIA DỤNG ĐÃ SỞ HỮU ({purchases.length} món)
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Tự động đồng bộ với Vplay Local Store</span>
            </div>

            {purchases.length === 0 ? (
              <div className="p-12 text-center bg-[#1f2023] border-2 border-[#141414] space-y-3">
                <PackageCheck className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-300 font-jura">Bạn chưa mua vật dụng gia dụng nào</p>
                <p className="text-xs text-zinc-500 font-mono">
                  Sử dụng Khoáng Thạch Ore để trang bị ngay cho phòng khách, phòng bếp hoặc phòng ngủ của bạn!
                </p>
                <button
                  onClick={() => setActiveTab("store")}
                  className="bg-[#28960b] text-white px-4 py-2 text-xs font-bold font-mono border-2 border-[#141414] shadow active:translate-y-[1px]"
                >
                  Đến Cửa Hàng Ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {purchases.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#2a2c30] border-2 border-[#141414] p-3.5 flex items-start gap-3 shadow-md"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover border-2 border-[#141414] bg-black shrink-0"
                    />

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                          ✓ {item.deliveryStatus}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">{item.purchaseDate}</span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-white font-jura">
                        {item.product.name}
                      </h4>

                      <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between">
                        <span>Số lượng: x{item.quantity}</span>
                        <span className="text-amber-400 font-bold">{item.totalOre.toLocaleString()} ORE</span>
                      </div>

                      <div className="pt-2 border-t border-black/30 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 text-sky-400">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Bảo hành chính hãng Vplay</span>
                        </span>

                        <button
                          onClick={() => {
                            playPopSound();
                            showToast(`🏠 "${item.product.name}" đã được bố trí trong căn hộ Vplay của bạn!`);
                          }}
                          className="bg-[#383a3f] hover:bg-[#484c52] text-white px-2 py-0.5 text-[10px] font-bold border border-[#141414] active:translate-y-[1px]"
                        >
                          Sử dụng / Đặt vị trí
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-[#2b2d30] border-4 border-[#141414] shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#1f2022] border-b-2 border-[#141414] p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Armchair className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm sm:text-base text-white font-jura uppercase">
                  CHI TIẾT SẢN PHẨM GIA DỤNG
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-7 h-7 bg-[#c6c6c6] hover:bg-rose-600 hover:text-white text-black font-bold border-2 border-[#141414] flex items-center justify-center shadow active:translate-y-[1px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="aspect-video w-full bg-black border-2 border-[#141414] overflow-hidden relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-black px-2.5 py-1 text-xs font-black font-mono border border-black shadow">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Danh mục: {selectedProduct.categoryName}
                  </span>
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {selectedProduct.rating} ({selectedProduct.reviewCount} đánh giá)
                  </span>
                </div>

                <h2 className="font-extrabold text-lg text-white font-jura">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-amber-300/90 font-mono mt-0.5">
                  {selectedProduct.tagline}
                </p>
                <p className="text-xs text-zinc-300 font-montserrat leading-relaxed mt-2 bg-[#202225] p-3 border border-[#141414]">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase font-jura tracking-wider">
                  THÔNG SỐ KỸ THUẬT & CHẤT LIỆU
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(selectedProduct.specs).map(([k, v]) => (
                    <div key={k} className="bg-[#1e2022] p-2 border border-[#141414] flex justify-between">
                      <span className="text-zinc-400">{k}:</span>
                      <span className="text-white font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-[#1f2022] border-t-2 border-[#141414] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-zinc-400 font-mono">Giá thanh toán Ore</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {selectedProduct.priceOre.toLocaleString()} <span className="text-xs">ORE</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 sm:flex-none bg-[#3b3e43] hover:bg-[#474b51] text-white px-4 py-2 text-xs font-bold font-mono border-2 border-[#141414] active:translate-y-[1px]"
                >
                  + Thêm giỏ hàng
                </button>

                <button
                  onClick={() => handleBuyDirect(selectedProduct)}
                  className="flex-1 sm:flex-none bg-[#28960b] hover:bg-[#32b312] text-white px-5 py-2 text-xs font-bold font-mono border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69] active:translate-y-[1px]"
                >
                  Mua Ngay Bằng Ore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <div className="bg-[#1c1d20] border-t-2 border-[#141414] p-2.5 text-center text-[10px] text-zinc-400 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vplay Express Delivery • Giao hàng tận nhà 24/7</span>
        </span>
        <span>V-Furniture Ore UI v1.0</span>
      </div>
    </div>
  );
};
