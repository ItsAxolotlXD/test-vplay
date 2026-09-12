import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Film,
  Music,
  Tv,
  Train,
  Calendar,
  Clock,
  MapPin,
  Check,
  QrCode,
  Download,
  Search,
  Sparkles,
  ChevronRight,
  X,
  CreditCard,
  Percent,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface EventItem {
  id: string;
  title: string;
  category: 'Phim' | 'Concert' | 'Truyền Hình' | 'Du Lịch';
  location: string;
  date: string;
  time: string;
  pricePerSeat: number;
  banner: string;
  rating: string;
  description: string;
}

export interface BookedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  location: string;
  dateTime: string;
  seats: string[];
  totalPrice: number;
  qrCodeUrl: string;
  bookedAt: string;
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Bom Tấn Điện Ảnh: Hào Khí Đông A (4K IMAX)',
    category: 'Phim',
    location: 'Trung Tâm Chiếu Phim Quốc Gia - Phòng Chiếu Laser 1',
    date: '12/09/2026',
    time: '19:30',
    pricePerSeat: 110000,
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    rating: '★ 9.4/10',
    description: 'Tác phẩm điện ảnh dã sử hào hùng tái hiện các chiến công hiển hách của dân tộc Việt Nam với kỹ xảo hoành tráng.',
  },
  {
    id: 'ev-2',
    title: 'Đại Nhạc Hội Sóng 360: V-Concert Tương Lai',
    category: 'Concert',
    location: 'Sân Vận Động Quốc Gia Mỹ Đình - Khán Đài A',
    date: '18/09/2026',
    time: '20:00',
    pricePerSeat: 450000,
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    rating: 'Hot Event',
    description: 'Đêm quy tụ dàn ca sĩ hàng đầu V-Pop cùng hệ thống âm thanh vòm Dolby Atmos và sân khấu xoay 360 độ.',
  },
  {
    id: 'ev-3',
    title: 'Ghi Hình Trực Tiếp: Siêu Sao Gameshow V-Play Live',
    category: 'Truyền Hình',
    location: 'Trường Quay S10 - Đài Truyền Hình Việt Nam',
    date: '15/09/2026',
    time: '18:00',
    pricePerSeat: 80000,
    banner: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
    rating: 'Vé Khán Giả',
    description: 'Cơ hội trực tiếp hòa mình vào không khí trường quay, tương tác cùng ban bình luận và nhận quà tặng đặc biệt.',
  },
  {
    id: 'ev-4',
    title: 'Tàu Hỏa Di Sản: Tuyến Hà Nội - Sa Pa Mùa Vàng',
    category: 'Du Lịch',
    location: 'Ga Hà Nội - Toa Giường Nằm Hạng Thương Gia',
    date: '20/09/2026',
    time: '21:30',
    pricePerSeat: 320000,
    banner: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    rating: 'Du Lịch 5★',
    description: 'Trải nghiệm hành trình ngắm cảnh ruộng bậc thang Tây Bắc trên toa tàu cổ điển sang trọng tiện nghi.',
  },
];

// Seat layout definition
const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];
const TAKEN_SEATS = ['A3', 'A4', 'B5', 'C2', 'D6', 'D7'];

export const VTicketTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'my-tickets'>('events');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Seat booking state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [isDiscountApplied, setIsDiscountApplied] = useState<boolean>(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<BookedTicket | null>(null);

  // Booked tickets list in localStorage
  const [myTickets, setMyTickets] = useState<BookedTicket[]>(() => {
    try {
      const saved = localStorage.getItem('v_user_booked_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('v_user_booked_tickets', JSON.stringify(myTickets));
    } catch {}
  }, [myTickets]);

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (selectedCategory === 'Tất cả') return true;
    return e.category === selectedCategory;
  });

  const toggleSeat = (seatId: string) => {
    if (TAKEN_SEATS.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const calculateSubtotal = () => {
    if (!selectedEvent) return 0;
    return selectedSeats.length * selectedEvent.pricePerSeat;
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    if (isDiscountApplied) {
      return Math.round(sub * 0.8); // 20% off
    }
    return sub;
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'VPLAY360') {
      setIsDiscountApplied(true);
    } else {
      alert('Mã giảm giá không hợp lệ. Hãy thử dùng mã: VPLAY360');
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedEvent || selectedSeats.length === 0) return;

    const newTicket: BookedTicket = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      category: selectedEvent.category,
      location: selectedEvent.location,
      dateTime: `${selectedEvent.date} lúc ${selectedEvent.time}`,
      seats: [...selectedSeats],
      totalPrice: calculateTotal(),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VPLAY-TICKET-${Date.now()}`,
      bookedAt: new Date().toLocaleDateString('vi-VN'),
    };

    setMyTickets((prev) => [newTicket, ...prev]);
    setBookingSuccessModal(newTicket);
    setSelectedSeats([]);
    setIsDiscountApplied(false);
    setDiscountCode('');
    setSelectedEvent(null);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setMyTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div id="v-ticket-app" className="w-full text-white">
      {/* Header Banner - V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Ticket • Đặt Vé Trực Tuyến 360
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                E-Ticketing
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Vé xem phim chiếu rạp • Liveshow & Concert • Khán giả trường quay VTV • Mã QR điện tử
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-[#18171E] p-1.5 rounded-xl border border-[#2D2D38] self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab('events');
              setSelectedEvent(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Sự Kiện & Lịch Chiếu
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-tickets'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Vé Của Tôi ({myTickets.length})
          </button>
        </div>
      </div>

      {/* 1. EVENTS VIEW */}
      {activeTab === 'events' && (
        <>
          {/* Category filter */}
          {!selectedEvent && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              {['Tất cả', 'Phim', 'Concert', 'Truyền Hình', 'Du Lịch'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 border-transparent text-white shadow-md'
                      : 'bg-[#2A2933] border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {cat === 'Phim' && '🎬 '}
                  {cat === 'Concert' && '🎤 '}
                  {cat === 'Truyền Hình' && '📺 '}
                  {cat === 'Du Lịch' && '✈️ '}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}

          {/* Event Listing */}
          {!selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#181105] hover:bg-[#221808] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ev.banner}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181105] via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow">
                        {ev.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                        {ev.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
                      <div className="flex items-center gap-1.5 drop-shadow">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ev.date}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ev.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Giá vé từ</span>
                        <span className="text-base font-black text-amber-400 font-mono">
                          {formatVnd(ev.pricePerSeat)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedEvent(ev);
                          setSelectedSeats([]);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Chọn Ghế & Đặt Vé</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* SEAT SELECTION & CHECKOUT VIEW */
            <div className="bg-[#181105] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold mb-4 flex items-center gap-1 cursor-pointer"
              >
                ← Quay lại danh sách sự kiện
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Seat Map (7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <div className="w-full text-center mb-6">
                    <h3 className="text-lg font-black text-white">{selectedEvent.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedEvent.location}</p>

                    {/* Stage / Screen line */}
                    <div className="mt-6 w-3/4 mx-auto py-1.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent border-t-2 border-amber-400 text-[10px] uppercase tracking-widest font-bold text-amber-300">
                      MÀN HÌNH / KHÁN ĐÀI CHÍNH
                    </div>
                  </div>

                  {/* Seat Matrix */}
                  <div className="space-y-3 my-4">
                    {SEAT_ROWS.map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-5 text-xs font-mono font-bold text-slate-400 text-center">{row}</span>
                        <div className="flex items-center gap-2">
                          {SEAT_COLS.map((col) => {
                            const seatId = `${row}${col}`;
                            const isTaken = TAKEN_SEATS.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                disabled={isTaken}
                                onClick={() => toggleSeat(seatId)}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                                  isTaken
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                                    : isSelected
                                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.6)] font-black'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                }`}
                                title={isTaken ? 'Ghế đã có người đặt' : `Ghế ${seatId}`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Seat Legend */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-6 bg-black/30 px-4 py-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-white/15 border border-white/10" />
                      <span>Ghế trống</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                      <span className="text-amber-300 font-bold">Đang chọn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-slate-800" />
                      <span>Đã bán</span>
                    </div>
                  </div>
                </div>

                {/* Right Summary & Checkout (5 cols) */}
                <div className="lg:col-span-5 bg-[#120D04] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-amber-400" />
                      <span>Thông Tin Đặt Vé Điện Tử</span>
                    </h4>

                    <div className="space-y-3 mt-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Sự kiện:</span>
                        <span className="font-bold text-white text-sm">{selectedEvent.title}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Thời gian:</span>
                        <span className="font-bold text-amber-300">{selectedEvent.date} • {selectedEvent.time}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Ghế đã chọn:</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế nào'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Đơn giá:</span>
                        <span className="font-mono text-slate-300">{formatVnd(selectedEvent.pricePerSeat)} / ghế</span>
                      </div>

                      {/* Coupon input */}
                      <div className="pt-2">
                        <label className="block text-slate-400 font-bold mb-1">Mã Ưu Đãi (Thử: VPLAY360)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Nhập mã giảm giá..."
                            className="flex-1 bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                          />
                          <button
                            onClick={handleApplyDiscount}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Áp dụng
                          </button>
                        </div>
                        {isDiscountApplied && (
                          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                            <Percent className="w-3 h-3" />
                            <span>Đã giảm 20% tổng tiền vé!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-slate-400">Tổng thanh toán:</span>
                      <span className="text-xl font-black text-amber-400 font-mono">
                        {formatVnd(calculateTotal())}
                      </span>
                    </div>

                    <button
                      disabled={selectedSeats.length === 0}
                      onClick={handleConfirmBooking}
                      className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                        selectedSeats.length > 0
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Xác Nhận & Xuất Vé Ngay ({selectedSeats.length} ghế)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. MY TICKETS VIEW */}
      {activeTab === 'my-tickets' && (
        <div className="space-y-4">
          {myTickets.length === 0 ? (
            <div className="bg-[#181105] border border-white/10 rounded-3xl p-12 text-center">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">Bạn chưa có vé điện tử nào</h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy chọn một sự kiện chiếu phim, concert hoặc show truyền hình để đặt vé ngay.
              </p>
              <button
                onClick={() => setActiveTab('events')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Xem Danh Sách Sự Kiện</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-gradient-to-r from-[#201506] via-[#1B1205] to-[#120C03] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          {tkt.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">#{tkt.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-2 leading-snug">{tkt.eventTitle}</h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{tkt.location}</span>
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="p-1.5 bg-white rounded-2xl shrink-0 shadow-md">
                      <img src={tkt.qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                    </div>
                  </div>

                  <div className="my-4 py-3 border-y border-white/10 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Thời gian:</span>
                      <span className="font-bold text-amber-300">{tkt.dateTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Vị trí ghế:</span>
                      <span className="font-mono font-bold text-white">{tkt.seats.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tổng thanh toán</span>
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {formatVnd(tkt.totalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteTicket(tkt.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Hủy / Xóa vé"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING SUCCESS MODAL */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className="bg-[#1A1205] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-xl font-black text-white">Đặt Vé Thành Công!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Vé điện tử của bạn đã được xuất và lưu vào danh sách &quot;Vé Của Tôi&quot;.
              </p>

              <div className="my-5 p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã vé:</span>
                  <span className="font-mono font-bold text-amber-300">#{bookingSuccessModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sự kiện:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{bookingSuccessModal.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ghế:</span>
                  <span className="font-mono font-bold text-white">{bookingSuccessModal.seats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tổng tiền:</span>
                  <span className="font-mono font-bold text-amber-400">{formatVnd(bookingSuccessModal.totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  setActiveTab('my-tickets');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:from-amber-400 hover:to-orange-400 cursor-pointer"
              >
                Xem Vé Điện Tử Ngay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
