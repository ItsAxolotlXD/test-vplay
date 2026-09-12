import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, BarChart3, Search, Star } from 'lucide-react';

const market = [
  { symbol: 'VPLAY', name: 'Vplay Digital', price: '128.40', change: '+4.82%', up: true },
  { symbol: 'VNET', name: 'V-Network', price: '86.15', change: '+1.64%', up: true },
  { symbol: 'VTV', name: 'VTV Media', price: '42.70', change: '-0.93%', up: false },
  { symbol: 'VBOX', name: 'VBox Cloud', price: '64.25', change: '+2.18%', up: true },
];

export const VStocksTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => market.filter((stock) => `${stock.symbol} ${stock.name}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <section className="bg-[#0f172a] p-5 sm:p-7 text-white">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">V-Stocks</p>
          <h2 className="mt-1 text-2xl font-bold">Theo dõi thị trường</h2>
          <p className="mt-1 text-sm text-slate-400">Bảng giá mô phỏng, danh mục yêu thích và biến động theo thời gian.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
          <BarChart3 className="size-4 text-cyan-300" /> VN-Index <span className="font-semibold text-emerald-300">+1.24%</span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search className="size-4 text-slate-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã cổ phiếu..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((stock) => (
          <article key={stock.symbol} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/10">
            <div className="flex items-start justify-between"><div><p className="font-bold">{stock.symbol}</p><p className="text-xs text-slate-400">{stock.name}</p></div><Star className="size-4 text-slate-500" /></div>
            <div className="mt-5 flex items-end justify-between"><p className="text-2xl font-semibold">{stock.price}</p><span className={`flex items-center gap-1 text-sm font-bold ${stock.up ? 'text-emerald-300' : 'text-rose-300'}`}>{stock.up ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}{stock.change}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default VStocksTab;
