import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wallet,
  Sparkles,
  PieChart,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  Eye,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { playPopSound, playWinSound } from '../../utils/sound';

export interface StockTicker {
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM';
  price: number; // in thousands VND, e.g., 85.5 = 85,500 đ
  change: number; // point change
  changePercent: number; // percentage
  volume: number; // total shares traded
  high: number;
  low: number;
  ceiling: number; // Trần (+6.9% / +9.9%)
  floor: number; // Sàn (-6.9% / -9.9%)
  refPrice: number; // Tham chiếu
  category: 'VN30' | 'Công Nghệ' | 'Ngân Hàng' | 'Bất Động Sản' | 'Bán Lẻ' | 'Năng Lượng';
  history: number[];
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
}

const MOCK_STOCKS: StockTicker[] = [
  {
    symbol: 'VIC',
    name: 'Tập đoàn Vingroup',
    exchange: 'HOSE',
    price: 46.2,
    change: 1.8,
    changePercent: 4.05,
    volume: 5820400,
    high: 46.5,
    low: 44.5,
    ceiling: 47.5,
    floor: 41.3,
    refPrice: 44.4,
    category: 'Bất Động Sản',
    history: [44.4, 44.8, 45.1, 44.9, 45.6, 46.0, 46.2],
  },
  {
    symbol: 'FPT',
    name: 'Công ty CP FPT',
    exchange: 'HOSE',
    price: 138.5,
    change: 4.2,
    changePercent: 3.13,
    volume: 3410200,
    high: 139.0,
    low: 135.0,
    ceiling: 143.7,
    floor: 124.9,
    refPrice: 134.3,
    category: 'Công Nghệ',
    history: [134.3, 135.0, 136.2, 135.8, 137.4, 138.0, 138.5],
  },
  {
    symbol: 'VHM',
    name: 'CTCP Vinhomes',
    exchange: 'HOSE',
    price: 43.1,
    change: 0.9,
    changePercent: 2.13,
    volume: 4120000,
    high: 43.5,
    low: 42.0,
    ceiling: 45.1,
    floor: 39.3,
    refPrice: 42.2,
    category: 'Bất Động Sản',
    history: [42.2, 42.4, 42.8, 42.5, 42.9, 43.0, 43.1],
  },
  {
    symbol: 'VCB',
    name: 'Ngân hàng TMCP Ngoại thương VN',
    exchange: 'HOSE',
    price: 92.6,
    change: -0.4,
    changePercent: -0.43,
    volume: 1250300,
    high: 93.5,
    low: 92.0,
    ceiling: 99.5,
    floor: 86.5,
    refPrice: 93.0,
    category: 'Ngân Hàng',
    history: [93.0, 93.2, 93.5, 92.8, 92.4, 92.5, 92.6],
  },
  {
    symbol: 'HPG',
    name: 'Tập đoàn Hòa Phát',
    exchange: 'HOSE',
    price: 26.85,
    change: 0.55,
    changePercent: 2.09,
    volume: 18450200,
    high: 27.0,
    low: 26.3,
    ceiling: 28.1,
    floor: 24.5,
    refPrice: 26.3,
    category: 'VN30',
    history: [26.3, 26.4, 26.6, 26.5, 26.7, 26.8, 26.85],
  },
  {
    symbol: 'MWG',
    name: 'CTCP Đầu tư Thế Giới Di Động',
    exchange: 'HOSE',
    price: 64.2,
    change: -1.1,
    changePercent: -1.68,
    volume: 3890100,
    high: 65.5,
    low: 64.0,
    ceiling: 69.8,
    floor: 60.8,
    refPrice: 65.3,
    category: 'Bán Lẻ',
    history: [65.3, 65.1, 64.8, 64.5, 64.2, 64.0, 64.2],
  },
  {
    symbol: 'SSI',
    name: 'CTCP Chứng khoán SSI',
    exchange: 'HOSE',
    price: 34.5,
    change: 1.2,
    changePercent: 3.60,
    volume: 9812000,
    high: 34.8,
    low: 33.2,
    ceiling: 35.6,
    floor: 31.0,
    refPrice: 33.3,
    category: 'VN30',
    history: [33.3, 33.6, 33.9, 34.1, 34.0, 34.3, 34.5],
  },
  {
    symbol: 'MSN',
    name: 'Tập đoàn Masan',
    exchange: 'HOSE',
    price: 77.4,
    change: 2.4,
    changePercent: 3.20,
    volume: 2430000,
    high: 78.0,
    low: 75.0,
    ceiling: 80.2,
    floor: 69.8,
    refPrice: 75.0,
    category: 'Bán Lẻ',
    history: [75.0, 75.5, 76.2, 76.0, 76.8, 77.1, 77.4],
  },
  {
    symbol: 'GAS',
    name: 'Tổng Công ty Khí Việt Nam',
    exchange: 'HOSE',
    price: 78.9,
    change: 0.0,
    changePercent: 0.0,
    volume: 870400,
    high: 79.5,
    low: 78.5,
    ceiling: 84.4,
    floor: 73.4,
    refPrice: 78.9,
    category: 'Năng Lượng',
    history: [78.9, 79.0, 79.2, 78.8, 78.9, 78.9, 78.9],
  }
];

const MARKET_INDICES = [
  { name: 'VN-INDEX', points: 1288.45, change: 14.82, percent: 1.16, status: 'up' },
  { name: 'VN30-INDEX', points: 1332.10, change: 16.25, percent: 1.23, status: 'up' },
  { name: 'HNX-INDEX', points: 242.30, change: -0.85, percent: -0.35, status: 'down' },
  { name: 'UPCOM-INDEX', points: 94.60, change: 0.42, percent: 0.45, status: 'up' },
  { name: 'S&P 500', points: 5648.40, change: 24.12, percent: 0.43, status: 'up' },
  { name: 'NASDAQ', points: 17683.98, change: 114.50, percent: 0.65, status: 'up' }
];

export const VStockTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'watchlist' | 'portfolio' | 'news'>('market');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<StockTicker>(MOCK_STOCKS[1]); // Default FPT
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated Virtual Account Balance (100 Million VND)
  const [virtualCash, setVirtualCash] = useState<number>(100000000);
  const [positions, setPositions] = useState<PortfolioPosition[]>([
    { symbol: 'FPT', shares: 500, buyPrice: 132.0, currentPrice: 138.5 },
    { symbol: 'HPG', shares: 1000, buyPrice: 25.5, currentPrice: 26.85 }
  ]);
  const [watchlist, setWatchlist] = useState<string[]>(['FPT', 'VIC', 'HPG', 'SSI']);
  const [orderShares, setOrderShares] = useState<number>(100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleWatchlist = (symbol: string) => {
    playPopSound();
    if (watchlist.includes(symbol)) {
      setWatchlist((prev) => prev.filter((s) => s !== symbol));
      showToast(`Đã bỏ ${symbol} khỏi danh mục theo dõi`);
    } else {
      setWatchlist((prev) => [...prev, symbol]);
      showToast(`Đã thêm ${symbol} vào danh mục theo dõi ★`);
    }
  };

  // Buy Stock Demo
  const handleBuyStock = () => {
    const totalCost = orderShares * selectedStock.price * 1000;
    if (virtualCash < totalCost) {
      showToast('Số dư tiền mặt không đủ để đặt lệnh!');
      return;
    }
    playWinSound();
    setVirtualCash((prev) => prev - totalCost);
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === selectedStock.symbol);
      if (existing) {
        const totalShares = existing.shares + orderShares;
        const avgPrice =
          (existing.shares * existing.buyPrice + orderShares * selectedStock.price) / totalShares;
        return prev.map((p) =>
          p.symbol === selectedStock.symbol
            ? { ...p, shares: totalShares, buyPrice: avgPrice, currentPrice: selectedStock.price }
            : p
        );
      }
      return [
        ...prev,
        {
          symbol: selectedStock.symbol,
          shares: orderShares,
          buyPrice: selectedStock.price,
          currentPrice: selectedStock.price
        }
      ];
    });
    showToast(`Đã khớp lệnh mua ${orderShares.toLocaleString()} CP ${selectedStock.symbol}!`);
  };

  // Sell Stock Demo
  const handleSellStock = () => {
    const pos = positions.find((p) => p.symbol === selectedStock.symbol);
    if (!pos || pos.shares < orderShares) {
      showToast(`Không đủ số lượng cổ phiếu ${selectedStock.symbol} để bán!`);
      return;
    }
    playPopSound();
    const totalRevenue = orderShares * selectedStock.price * 1000;
    setVirtualCash((prev) => prev + totalRevenue);
    setPositions((prev) =>
      prev
        .map((p) =>
          p.symbol === selectedStock.symbol
            ? { ...p, shares: p.shares - orderShares }
            : p
        )
        .filter((p) => p.shares > 0)
    );
    showToast(`Đã khớp lệnh bán ${orderShares.toLocaleString()} CP ${selectedStock.symbol}!`);
  };

  // Calculate Portfolio Value
  const totalStockValue = useMemo(() => {
    return positions.reduce((acc, p) => acc + p.shares * p.currentPrice * 1000, 0);
  }, [positions]);

  const totalAssetValue = virtualCash + totalStockValue;
  const totalProfitLoss = useMemo(() => {
    return positions.reduce(
      (acc, p) => acc + (p.currentPrice - p.buyPrice) * p.shares * 1000,
      0
    );
  }, [positions]);

  const filteredStocks = useMemo(() => {
    return MOCK_STOCKS.filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'Tất cả' || stock.category === selectedCategory;
      const matchesTab =
        activeTab !== 'watchlist' || watchlist.includes(stock.symbol);
      return matchesSearch && matchesCat && matchesTab;
    });
  }, [searchQuery, selectedCategory, activeTab, watchlist]);

  // Stock color code helper:
  // Green: Up, Red: Down, Purple: Ceiling, Cyan: Floor, Yellow: Reference
  const getPriceColor = (stock: StockTicker) => {
    if (stock.price >= stock.ceiling) return 'text-purple-400';
    if (stock.price <= stock.floor) return 'text-cyan-400';
    if (stock.change > 0) return 'text-emerald-400';
    if (stock.change < 0) return 'text-rose-400';
    return 'text-amber-300';
  };

  const getPriceBg = (stock: StockTicker) => {
    if (stock.price >= stock.ceiling) return 'bg-purple-500/10 border-purple-500/30';
    if (stock.price <= stock.floor) return 'bg-cyan-500/10 border-cyan-500/30';
    if (stock.change > 0) return 'bg-emerald-500/10 border-emerald-500/30';
    if (stock.change < 0) return 'bg-rose-500/10 border-rose-500/30';
    return 'bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="w-full min-h-screen text-white select-none pb-20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1F1E24]/95 border border-amber-500/40 text-white text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-6">
        {/* 1. TOP HEADER - V-FLOW STYLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2D2D38]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  V-Stock
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    TÀI CHÍNH & CHỨNG KHOÁN
                  </span>
                </h1>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Bảng giá trực tuyến HOSE, HNX, UPCoM & Danh mục đầu tư thông minh 2026
              </p>
            </div>
          </div>

          {/* Quick Stats & Virtual Balance */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18171E] border border-[#2D2D38] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#9CA3AF]">
                Thị trường: <strong className="text-emerald-400">Đang giao dịch</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18171E] border border-[#2D2D38] text-xs font-mono">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[#9CA3AF]">Tài sản:</span>
              <span className="font-bold text-white">
                {(totalAssetValue / 1000000).toFixed(1)}Tr đ
              </span>
            </div>
          </div>
        </div>

        {/* 2. MARKET TICKER BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {MARKET_INDICES.map((idx) => {
            const isUp = idx.status === 'up';
            return (
              <div
                key={idx.name}
                className="p-2.5 rounded-2xl bg-[#18171E] border border-[#2D2D38] hover:border-[#3E3D4D] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] font-bold">
                  <span>{idx.name}</span>
                  {isUp ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-400" />
                  )}
                </div>
                <div className="text-sm font-black text-white font-mono mt-1">
                  {idx.points.toLocaleString()}
                </div>
                <div
                  className={`text-[10px] font-mono font-bold flex items-center gap-0.5 mt-0.5 ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <span>{isUp ? '+' : ''}{idx.change}</span>
                  <span>({isUp ? '+' : ''}{idx.percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. SUB NAVIGATION TABS */}
        <div className="flex items-center justify-between gap-3 border-b border-[#2D2D38] pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {[
              { id: 'market', label: 'Bảng Giá & Giao Dịch', icon: BarChart3 },
              { id: 'watchlist', label: `Theo Dõi (${watchlist.length})`, icon: Eye },
              { id: 'portfolio', label: 'Tài Sản & Danh Mục', icon: PieChart },
              { id: 'news', label: 'Tin Tức Tài Chính', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playPopSound();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md font-bold'
                      : 'bg-[#2A2933] text-[#9CA3AF] hover:text-white border border-[#3E3D4D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative shrink-0 w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã CP (FPT, VIC...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#18171E] border border-[#2D2D38] text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* 4. MAIN CONTENT AREA */}
        {activeTab === 'market' || activeTab === 'watchlist' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLS: INTERACTIVE CHART & DETAIL OF SELECTED STOCK */}
            <div className="lg:col-span-2 space-y-4">
              {/* Selected Stock Overview Card */}
              <div className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D2D38]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-lg text-emerald-400 font-mono">
                      {selectedStock.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">{selectedStock.name}</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {selectedStock.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>Nhóm ngành: {selectedStock.category}</span>
                        <span>•</span>
                        <span>KL: {(selectedStock.volume / 1000).toLocaleString()}K</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                    <div className={`text-2xl font-black font-mono ${getPriceColor(selectedStock)}`}>
                      {selectedStock.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-mono font-bold flex items-center gap-1 ${
                        selectedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedStock.change >= 0 ? '+' : ''}
                      {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                {/* Price Reference Grid */}
                <div className="grid grid-cols-4 gap-2 py-3 text-center text-xs font-mono border-b border-[#2D2D38]">
                  <div className="p-2 rounded-xl bg-[#18171E]">
                    <div className="text-[10px] text-purple-400 font-bold">Giá Trần</div>
                    <div className="text-purple-400 font-bold mt-0.5">{selectedStock.ceiling.toFixed(2)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#18171E]">
                    <div className="text-[10px] text-cyan-400 font-bold">Giá Sàn</div>
                    <div className="text-cyan-400 font-bold mt-0.5">{selectedStock.floor.toFixed(2)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#18171E]">
                    <div className="text-[10px] text-amber-400 font-bold">Tham Chiếu</div>
                    <div className="text-amber-400 font-bold mt-0.5">{selectedStock.refPrice.toFixed(2)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#18171E]">
                    <div className="text-[10px] text-zinc-400 font-bold">Cao / Thấp</div>
                    <div className="text-zinc-200 font-bold mt-0.5">
                      {selectedStock.high}/{selectedStock.low}
                    </div>
                  </div>
                </div>

                {/* Timeframe selector & Chart visualization */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-zinc-400 font-medium">Biểu đồ biến động giá</div>
                    <div className="flex items-center gap-1 bg-[#18171E] p-1 rounded-xl">
                      {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            timeframe === tf
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart Simulator */}
                  <div className="h-44 w-full relative flex items-end pt-4 pb-2 px-2 rounded-xl bg-[#14131A] border border-[#2D2D38]">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 32 Q 15 25, 30 28 T 60 18 T 85 12 T 100 8 L 100 40 L 0 40 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M 0 32 Q 15 25, 30 28 T 60 18 T 85 12 T 100 8"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-500">
                      Đỉnh: {selectedStock.high.toFixed(2)} | Đáy: {selectedStock.low.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Buy / Sell Quick Simulator */}
                <div className="mt-4 pt-4 border-t border-[#2D2D38] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-zinc-400">Khối lượng:</span>
                    <input
                      type="number"
                      min={100}
                      step={100}
                      value={orderShares}
                      onChange={(e) => setOrderShares(Math.max(100, parseInt(e.target.value) || 100))}
                      className="w-24 px-3 py-1.5 rounded-xl bg-[#18171E] border border-[#2D2D38] text-xs font-mono text-white text-center focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-500 font-mono">
                      ≈ {((orderShares * selectedStock.price * 1000) / 1000000).toFixed(2)} Tr đ
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleBuyStock}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      MUA {selectedStock.symbol}
                    </button>
                    <button
                      onClick={handleSellStock}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      BÁN {selectedStock.symbol}
                    </button>
                    <button
                      onClick={() => toggleWatchlist(selectedStock.symbol)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        watchlist.includes(selectedStock.symbol)
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-[#18171E] border-[#2D2D38] text-zinc-400 hover:text-white'
                      }`}
                      title="Lưu Watchlist"
                    >
                      ★
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 1 COL: STOCKS LIST TABLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Mã Cổ Phiếu ({filteredStocks.length})
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Đơn vị: 1,000 đ</span>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
                {filteredStocks.map((stock) => {
                  const isSelected = selectedStock.symbol === stock.symbol;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => {
                        playPopSound();
                        setSelectedStock(stock);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#262530] border-emerald-500/50 shadow-md'
                          : 'bg-[#1F1E24] border-[#2D2D38] hover:border-[#3D3D4E]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#18171E] flex items-center justify-center font-bold text-sm text-white font-mono">
                          {stock.symbol}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{stock.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            KL: {(stock.volume / 1000).toLocaleString()}K
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-sm font-black font-mono ${getPriceColor(stock)}`}>
                          {stock.price.toFixed(2)}
                        </div>
                        <div
                          className={`text-[10px] font-mono font-bold ${
                            stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {stock.change >= 0 ? '+' : ''}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'portfolio' ? (
          /* PORTFOLIO TAB */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38]">
                <div className="text-xs text-zinc-400">Tổng tài sản ước tính</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {(totalAssetValue).toLocaleString()} đ
                </div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Vốn cấp ban đầu: 100 Tr đ</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38]">
                <div className="text-xs text-zinc-400">Tiền mặt khả dụng</div>
                <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                  {(virtualCash).toLocaleString()} đ
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Sẵn sàng giải ngân</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38]">
                <div className="text-xs text-zinc-400">Lãi / Lỗ danh mục</div>
                <div
                  className={`text-2xl font-black font-mono mt-1 ${
                    totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {totalProfitLoss >= 0 ? '+' : ''}
                  {(totalProfitLoss).toLocaleString()} đ
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {( (totalProfitLoss / 100000000) * 100 ).toFixed(2)}% so với vốn
                </div>
              </div>
            </div>

            {/* Positions Table */}
            <div className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38]">
              <h3 className="text-sm font-bold text-white mb-4">Danh Sách Cổ Phiếu Đang Nắm Giữ</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2D2D38] text-zinc-400 text-[11px]">
                      <th className="pb-3">MÃ CP</th>
                      <th className="pb-3 text-right">SỐ LƯỢNG</th>
                      <th className="pb-3 text-right">GIÁ VỐN</th>
                      <th className="pb-3 text-right">GIÁ HIỆN TẠI</th>
                      <th className="pb-3 text-right">GIÁ TRỊ TT</th>
                      <th className="pb-3 text-right">LÃI / LỖ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2D38]/50">
                    {positions.map((pos) => {
                      const pnl = (pos.currentPrice - pos.buyPrice) * pos.shares * 1000;
                      const pnlPercent = ((pos.currentPrice - pos.buyPrice) / pos.buyPrice) * 100;
                      return (
                        <tr key={pos.symbol} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">{pos.symbol}</td>
                          <td className="py-3 text-right text-zinc-200">{pos.shares.toLocaleString()}</td>
                          <td className="py-3 text-right text-zinc-400">{pos.buyPrice.toFixed(2)}</td>
                          <td className="py-3 text-right text-white font-bold">{pos.currentPrice.toFixed(2)}</td>
                          <td className="py-3 text-right text-zinc-200">
                            {((pos.shares * pos.currentPrice * 1000)).toLocaleString()} đ
                          </td>
                          <td
                            className={`py-3 text-right font-bold ${
                              pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {pnl >= 0 ? '+' : ''}
                            {pnl.toLocaleString()} đ ({pnlPercent.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* FINANCIAL NEWS TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'VN-Index bứt phá hơn 14 điểm nhờ nhóm cổ phiếu công nghệ và bất động sản',
                time: '15 phút trước',
                source: 'VNRT Online Finance',
                desc: 'Khối ngoại quay lại mua ròng hơn 450 tỷ đồng, tâm điểm tập trung tại FPT, VIC và HPG.'
              },
              {
                title: 'FPT công bố kết quả kinh doanh quý 3: Doanh thu mảng AI và Cloud tăng trưởng 38%',
                time: '1 giờ trước',
                source: 'Bản tin Thị trường',
                desc: 'Định hướng tiếp tục mở rộng hợp tác toàn cầu và phát triển trung tâm dữ liệu xanh tại Việt Nam.'
              },
              {
                title: 'Ngân hàng Nhà nước duy trì mặt bằng lãi suất hấp dẫn hỗ trợ sản xuất kinh doanh',
                time: '3 giờ trước',
                source: 'VTV1 Tài chính',
                desc: 'Thanh khoản hệ thống ngân hàng dồi dào, tỷ giá duy trì ổn định quanh ngưỡng mục tiêu.'
              },
              {
                title: 'Thị trường thép phục hồi mạnh mẽ: Hòa Phát (HPG) xuất khẩu kỷ lục sang EU',
                time: '5 giờ trước',
                source: 'Kinh Tế Số',
                desc: 'Sản lượng tiêu thụ thép xây dựng và HRC tiếp tục tăng trưởng hai con số trong tháng vừa qua.'
              }
            ].map((news, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3D3D4E] transition-all space-y-2"
              >
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <span className="text-emerald-400 font-bold">{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
                <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer">
                  {news.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{news.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
