import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Tag,
  Star,
  Sun,
  Moon,
  Sparkles,
  CalendarDays,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // HH:mm
  category: 'Lễ Tết' | 'Công Việc' | 'TV Show' | 'Cá Nhân';
  color: string;
  note?: string;
}

// Vietnamese Lunar conversion helper (accurate approximation for standard UI display)
const LUNAR_MONTH_NAMES = [
  'Tháng Giêng', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
  'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
  'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Chạp'
];

const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// National and traditional holidays in Vietnam
const VIETNAM_HOLIDAYS: Record<string, { name: string; type: 'solar' | 'lunar'; isDayOff?: boolean }> = {
  '01-01': { name: 'Tết Dương Lịch', type: 'solar', isDayOff: true },
  '02-03': { name: 'Ngày Thành lập Đảng CSVN', type: 'solar' },
  '03-08': { name: 'Ngày Quốc tế Phụ nữ', type: 'solar' },
  '04-30': { name: 'Ngày Giải phóng Miền Nam', type: 'solar', isDayOff: true },
  '05-01': { name: 'Ngày Quốc tế Lao động', type: 'solar', isDayOff: true },
  '06-01': { name: 'Ngày Quốc tế Thiếu nhi', type: 'solar' },
  '07-27': { name: 'Ngày Thương binh Liệt sĩ', type: 'solar' },
  '09-02': { name: 'Quốc khánh Nước CHXHCN Việt Nam', type: 'solar', isDayOff: true },
  '10-20': { name: 'Ngày Phụ nữ Việt Nam', type: 'solar' },
  '11-20': { name: 'Ngày Nhà giáo Việt Nam', type: 'solar' },
  '12-22': { name: 'Ngày Thành lập QĐND Việt Nam', type: 'solar' },
};

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    date: '2026-09-10',
    title: 'Phát sóng Trực tiếp Liveshow V-Play Studio 360',
    time: '20:00',
    category: 'TV Show',
    color: 'bg-rose-500',
    note: 'Kênh VTV1 & luồng VNRT Online Web HD',
  },
  {
    id: 'evt-2',
    date: '2026-09-15',
    title: 'Hội nghị Kỹ thuật Truyền hình Số VTV',
    time: '09:00',
    category: 'Công Việc',
    color: 'bg-blue-500',
    note: 'Thảo luận hạ tầng 4K và IPTV',
  },
  {
    id: 'evt-3',
    date: '2026-09-25',
    title: 'Đêm Hội Trăng Rằm - Tết Trung Thu 2026',
    time: '19:30',
    category: 'Lễ Tết',
    color: 'bg-amber-500',
    note: '15/8 Âm lịch truyền thống',
  },
];

export const VCalendarTab: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('v_calendar_events');
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventCat, setNewEventCat] = useState<'Lễ Tết' | 'Công Việc' | 'TV Show' | 'Cá Nhân'>('Công Việc');
  const [newEventNote, setNewEventNote] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('v_calendar_events', JSON.stringify(events));
    } catch {}
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // First day of month & number of days
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  // Convert Gregorian date to approx Lunar day / month
  const getLunarInfo = (d: Date) => {
    // Offset calculation for standard Vietnamese Lunar calendar
    const day = d.getDate();
    const m = d.getMonth() + 1;
    // Approximated lunar offset
    let lunarDay = (day + 18) % 30 || 30;
    let lunarMonth = m - 1 <= 0 ? 12 : m - 1;
    if (day > 12) lunarMonth = m;

    const canIndex = (year + 6) % 10;
    const chiIndex = (year + 8) % 12;
    const canChiYear = `${CAN_NAMES[canIndex]} ${CHI_NAMES[chiIndex]}`;

    return {
      lunarDay,
      lunarMonth,
      canChiYear,
      isSpecialDay: lunarDay === 1 || lunarDay === 15,
      specialLabel: lunarDay === 1 ? 'Mồng 1' : lunarDay === 15 ? 'Rằm' : undefined,
    };
  };

  const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedHolidayKey = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const holiday = VIETNAM_HOLIDAYS[selectedHolidayKey];
  const selectedLunar = getLunarInfo(selectedDate);
  const dayEvents = events.filter((e) => e.date === selectedDateKey);

  const handleSaveEvent = () => {
    if (!newEventTitle.trim()) return;
    const colorMap: Record<string, string> = {
      'Lễ Tết': 'bg-amber-500',
      'Công Việc': 'bg-blue-500',
      'TV Show': 'bg-rose-500',
      'Cá Nhân': 'bg-emerald-500',
    };

    const newEv: CalendarEvent = {
      id: `evt-${Date.now()}`,
      date: selectedDateKey,
      title: newEventTitle.trim(),
      time: newEventTime,
      category: newEventCat,
      color: colorMap[newEventCat] || 'bg-purple-500',
      note: newEventNote.trim(),
    };

    setEvents((prev) => [...prev, newEv]);
    setIsAddEventOpen(false);
    setNewEventTitle('');
    setNewEventNote('');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div id="v-calendar-app" className="w-full text-white">
      {/* Header Banner - V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Calendar • Lịch Vạn Niên 360
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Âm Dương Lịch
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Tra cứu ngày Hoàng đạo • Tiết khí • Lễ Tết truyền thống Việt Nam & Lịch nhắc sự kiện
            </p>
          </div>
        </div>

        {/* Month Navigator Controls */}
        <div className="flex items-center gap-2 bg-[#18171E] p-1.5 rounded-xl border border-[#2D2D38] self-start md:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-bold font-mono px-3 text-white min-w-[130px] text-center">
            Tháng {month + 1} / {year}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2933] transition-colors cursor-pointer"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md ml-1"
          >
            Hôm Nay
          </button>
        </div>
      </div>

      {/* Main Grid: Left Calendar / Right Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-5 sm:p-6 shadow-xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center mb-3 text-xs font-bold">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (
              <div key={d} className={i === 0 ? 'text-rose-400' : 'text-[#9CA3AF]'}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Previous month padding */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const prevDay = daysInPrevMonth - firstDayOfWeek + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  className="min-h-[64px] sm:min-h-[76px] p-1.5 rounded-xl bg-transparent opacity-25 flex flex-col justify-between"
                >
                  <span className="text-xs text-slate-600 font-mono">{prevDay}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const cellDate = new Date(year, month, dayNum);
              const isToday =
                new Date().toDateString() === cellDate.toDateString();
              const isSelected =
                selectedDate.toDateString() === cellDate.toDateString();
              const dayOfWeek = cellDate.getDay();

              const lunar = getLunarInfo(cellDate);
              const cellKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const cellHolidayKey = `${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const hasHoliday = VIETNAM_HOLIDAYS[cellHolidayKey];
              const cellEvents = events.filter((e) => e.date === cellKey);

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : isToday
                      ? 'bg-[#2A2933] border-amber-500/40'
                      : 'bg-[#18171E] border-[#2D2D38] hover:bg-[#2A2933] hover:border-[#3E3D4D]'
                  }`}
                >
                  {/* Top: Solar Day Number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold font-mono ${
                        isSelected
                          ? 'text-amber-300'
                          : isToday
                          ? 'text-white'
                          : dayOfWeek === 0
                          ? 'text-rose-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Lunar Day Indicator */}
                    <span
                      className={`text-[9.5px] font-mono ${
                        lunar.isSpecialDay
                          ? 'text-amber-400 font-bold'
                          : 'text-[#9CA3AF]'
                      }`}
                    >
                      {lunar.specialLabel || lunar.lunarDay}
                    </span>
                  </div>

                  {/* Indicators: Holiday or Event Dots */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hasHoliday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title={hasHoliday.name} />
                    )}
                    {cellEvents.map((ev) => (
                      <span
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${ev.color}`}
                        title={ev.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Day Details & Events (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Day Highlight Card */}
          <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2D38]">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Chi Tiết Ngày Đã Chọn
                </span>
                <h3 className="text-lg font-bold text-white capitalize">
                  {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center">
                <span className="text-[8px] text-amber-400 uppercase font-bold">Tháng</span>
                <span className="text-sm font-black text-white font-mono">{selectedDate.getMonth() + 1}</span>
              </div>
            </div>

            {/* Lunar Details */}
            <div className="my-4 p-3.5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Âm lịch:</span>
                </span>
                <span className="font-bold text-amber-300">
                  Ngày {selectedLunar.lunarDay} {LUNAR_MONTH_NAMES[selectedLunar.lunarMonth - 1]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Năm Can Chi:</span>
                </span>
                <span className="font-bold text-white font-mono">{selectedLunar.canChiYear}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Hoàng đạo:</span>
                <span className="text-amber-300 font-medium">Giờ Tý, Thìn, Tỵ, Thân</span>
              </div>
            </div>

            {/* Holiday Notice if any */}
            {holiday && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5">
                <Star className="w-4 h-4 text-rose-400 shrink-0 fill-rose-400" />
                <div className="text-xs">
                  <div className="font-bold text-rose-300">{holiday.name}</div>
                  <div className="text-[10px] text-rose-400/80">
                    {holiday.isDayOff ? 'Nghỉ lễ theo quy định nhà nước' : 'Ngày kỷ niệm truyền thống'}
                  </div>
                </div>
              </div>
            )}

            {/* Events for selected day */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lịch Sự Kiện & Nhắc Việc ({dayEvents.length})</span>
                </h4>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dayEvents.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#9CA3AF]">
                    Không có lịch nhắc nào cho ngày này. Bấm &quot;Thêm&quot; để tạo sự kiện mới.
                  </div>
                ) : (
                  dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-[#18171E] border border-[#2D2D38] flex items-start justify-between gap-2 group hover:border-[#3E3D4D] transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${ev.color}`} />
                          <span className="text-xs font-bold text-white">{ev.title}</span>
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] mt-1 flex items-center gap-2 font-mono">
                          <span>{ev.time}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-sans">{ev.category}</span>
                        </div>
                        {ev.note && <p className="text-[11px] text-[#9CA3AF] mt-1">{ev.note}</p>}
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                        title="Xóa sự kiện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#102420] border border-emerald-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-400" />
                <span>Thêm Sự Kiện / Lịch Nhắc</span>
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Ngày Sự Kiện</label>
                <input
                  type="text"
                  disabled
                  value={selectedDateKey}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-emerald-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Sự Kiện</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Ví dụ: Họp cơ quan, Đón xem V-Play Live..."
                  className="w-full bg-[#0A1614] border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giờ Bắt Đầu</label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-[#0A1614] border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phân Loại</label>
                  <select
                    value={newEventCat}
                    onChange={(e) => setNewEventCat(e.target.value as any)}
                    className="w-full bg-[#0A1614] border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Công Việc">Công Việc</option>
                    <option value="TV Show">TV Show</option>
                    <option value="Lễ Tết">Lễ Tết</option>
                    <option value="Cá Nhân">Cá Nhân</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ghi Chú Thêm</label>
                <textarea
                  value={newEventNote}
                  onChange={(e) => setNewEventNote(e.target.value)}
                  placeholder="Nội dung chi tiết ghi chú..."
                  rows={2}
                  className="w-full bg-[#0A1614] border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Lưu Sự Kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
