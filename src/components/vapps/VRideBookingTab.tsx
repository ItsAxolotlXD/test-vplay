import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Star, 
  Phone, 
  MessageSquare, 
  Check, 
  AlertCircle, 
  Compass, 
  RotateCw, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Bike, 
  Truck, 
  ArrowLeft,
  X
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';
import { useOrbs } from '../../hooks/useOrbs';

interface VRideBookingTabProps {
  onBack?: () => void;
  navigate?: (route: string) => void;
}

interface RideVehicleOption {
  id: string;
  name: string;
  category: string;
  icon: any;
  baseFare: number;
  ratePerKm: number;
  timeEstimate: string;
  seats: string;
  tag?: string;
  color: string;
  image: string;
}

const VEHICLE_OPTIONS: RideVehicleOption[] = [
  {
    id: 'v_bike',
    name: 'V-Bike',
    category: 'Xe máy công nghệ',
    icon: Bike,
    baseFare: 15000,
    ratePerKm: 5500,
    timeEstimate: '3-5 phút',
    seats: '1 khách',
    tag: 'Tiết kiệm nhất',
    color: 'from-amber-500 to-orange-600',
    image: '🛵'
  },
  {
    id: 'v_car_4',
    name: 'V-Car 4 Chỗ',
    category: 'Sedan êm ái',
    icon: Car,
    baseFare: 32000,
    ratePerKm: 12000,
    timeEstimate: '4-7 phút',
    seats: '4 khách',
    tag: 'Phổ biến',
    color: 'from-blue-500 to-indigo-600',
    image: '🚗'
  },
  {
    id: 'v_car_7',
    name: 'V-Car 7 Chỗ',
    category: 'SUV rộng rãi',
    icon: Car,
    baseFare: 45000,
    ratePerKm: 16000,
    timeEstimate: '6-9 phút',
    seats: '7 khách',
    color: 'from-purple-500 to-violet-600',
    image: '🚙'
  },
  {
    id: 'v_lux',
    name: 'V-Lux Electric',
    category: 'Xe điện cao cấp',
    icon: Zap,
    baseFare: 55000,
    ratePerKm: 19000,
    timeEstimate: '5-8 phút',
    seats: '4 khách',
    tag: '0 Khí thải',
    color: 'from-emerald-500 to-teal-600',
    image: '⚡🚘'
  },
  {
    id: 'v_delivery',
    name: 'V-Delivery',
    category: 'Giao hàng hỏa tốc',
    icon: Truck,
    baseFare: 22000,
    ratePerKm: 6000,
    timeEstimate: '2-4 phút',
    seats: 'Tối đa 30kg',
    color: 'from-pink-500 to-rose-600',
    image: '📦'
  }
];

const POPULAR_DESTINATIONS = [
  { name: 'Sân bay Quốc tế Tân Sơn Nhất', address: 'Đường Trường Sơn, P.2, Q. Tân Bình, TP.HCM', distKm: 8.5 },
  { name: 'Hồ Hoàn Kiếm & Phố Cổ', address: 'Quận Hoàn Kiếm, Thủ đô Hà Nội', distKm: 4.2 },
  { name: 'Tòa tháp Landmark 81', address: '720A Điện Biên Phủ, P.22, Q. Bình Thạnh', distKm: 6.0 },
  { name: 'Chợ Bến Thành', address: 'Đường Lê Lợi, P. Bến Thành, Quận 1', distKm: 3.1 },
  { name: 'Trung tâm Hội nghị Quốc gia', address: 'Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm', distKm: 9.8 }
];

export const VRideBookingTab: React.FC<VRideBookingTabProps> = ({ onBack, navigate }) => {
  const { orbs, spendOrbs, addOrbs } = useOrbs();
  const [pickup, setPickup] = useState('Vị trí hiện tại của bạn (GPS định vị)');
  const [destination, setDestination] = useState('Tòa tháp Landmark 81');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('v_car_4');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'orbs'>('cash');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'searching' | 'driver_found' | 'on_trip' | 'completed'>('idle');
  const [distanceKm, setDistanceKm] = useState(6.0);
  const [driverEta, setDriverEta] = useState(3);
  const [car360Angle, setCar360Angle] = useState(0);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);
  const [tripProgress, setTripProgress] = useState(0);

  const currentOption = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle) || VEHICLE_OPTIONS[1];
  const tripPriceVND = currentOption.baseFare + Math.round(distanceKm * currentOption.ratePerKm);
  const tripPriceOrbs = Math.round(tripPriceVND / 100);

  // Simulation step transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bookingStatus === 'searching') {
      timer = setTimeout(() => {
        setBookingStatus('driver_found');
        playPopSound();
      }, 3500);
    } else if (bookingStatus === 'driver_found') {
      timer = setTimeout(() => {
        setBookingStatus('on_trip');
        playPopSound();
      }, 5000);
    } else if (bookingStatus === 'on_trip') {
      const interval = setInterval(() => {
        setTripProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setBookingStatus('completed');
            playPopSound();
            return 100;
          }
          return prev + 15;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => clearTimeout(timer);
  }, [bookingStatus]);

  const handleStartBooking = () => {
    playPopSound();
    if (paymentMethod === 'orbs') {
      if (orbs < tripPriceOrbs) {
        addOrbs(500);
      }
      spendOrbs(tripPriceOrbs);
    }
    setBookingStatus('searching');
  };

  const handleCancelBooking = () => {
    playPopSound();
    setBookingStatus('idle');
    setTripProgress(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 select-none animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                VNRT Ride • Đặt xe 360
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                SPACE 360
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Đặt xe công nghệ, taxi cao cấp và giao hàng thông minh
            </p>
          </div>
        </div>

        <button
          onClick={() => setIs360ModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Xem xe 360°</span>
        </button>
      </div>

      {/* Main Booking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Simulated Map & Status */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl flex flex-col justify-between p-4">
            {/* Map Grid Background Simulation */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px, 48px 48px, 48px 48px'
              }}
            />

            {/* Simulated Road Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current">
              <path
                d="M 50 320 Q 180 200 280 220 T 480 90"
                fill="none"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 50 320 Q 180 200 280 220 T 480 90"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeDasharray="8 6"
                strokeLinecap="round"
                className="animate-[dash_2s_linear_infinite]"
              />
            </svg>

            {/* Map Header Status Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bản đồ trực tiếp GPS • TP. Hồ Chí Minh</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-blue-600/30 border border-blue-500/40 text-cyan-200 text-xs font-mono font-bold backdrop-blur-md">
                {distanceKm} km • ~{Math.round(distanceKm * 2.2)} phút
              </div>
            </div>

            {/* Simulated Vehicle & Pin Markers */}
            <div className="relative z-10 w-full h-full pointer-events-none">
              {/* Pickup Marker */}
              <div className="absolute left-[38px] bottom-[35px] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px] shadow mb-1">
                  Điểm đón
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center animate-ping" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg -mt-4.5" />
              </div>

              {/* Destination Marker */}
              <div className="absolute right-[50px] top-[70px] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-red-500 text-white font-bold text-[10px] shadow mb-1 truncate max-w-[120px]">
                  {destination}
                </div>
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[9px] shadow-lg">
                  📍
                </div>
              </div>

              {/* Moving Vehicle Indicator */}
              {bookingStatus === 'on_trip' && (
                <div 
                  className="absolute transition-all duration-700 ease-out flex items-center justify-center"
                  style={{
                    left: `${20 + tripProgress * 0.65}%`,
                    top: `${75 - tripProgress * 0.55}%`
                  }}
                >
                  <div className="p-2 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/50 scale-125 animate-bounce">
                    <Car className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>

            {/* Map Overlay Card: Driver Found or Searching status */}
            {bookingStatus === 'searching' && (
              <div className="relative z-20 p-4 rounded-2xl bg-zinc-900/95 border border-white/15 backdrop-blur-xl flex items-center gap-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <RotateCw className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white">Đang tìm tài xế gần bạn nhất...</h4>
                  <p className="text-xs text-zinc-400">Kết nối với mạng lưới {currentOption.name} trong bán kính 1km</p>
                </div>
                <button
                  onClick={handleCancelBooking}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Hủy
                </button>
              </div>
            )}

            {bookingStatus === 'driver_found' && (
              <div className="relative z-20 p-4 rounded-2xl bg-zinc-900/95 border border-emerald-500/30 backdrop-blur-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-base shadow-lg">
                      LM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Lê Văn Minh</span>
                        <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">VinFast VF8 • <strong className="text-white">51H - 892.44</strong></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">Đang đến đón</span>
                    <div className="text-base font-black text-white">~{driverEta} phút</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                  <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Gọi điện
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Nhắn tin
                  </button>
                  <button onClick={handleCancelBooking} className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition-colors">
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {bookingStatus === 'on_trip' && (
              <div className="relative z-20 p-4 rounded-2xl bg-blue-950/90 border border-blue-500/40 backdrop-blur-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Chuyến đi đang diễn ra
                  </span>
                  <span className="text-white font-mono font-bold">{tripProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" 
                    style={{ width: `${tripProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-300">
                  Điểm đến: <strong>{destination}</strong>
                </p>
              </div>
            )}

            {bookingStatus === 'completed' && (
              <div className="relative z-20 p-5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-xl text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Đã hoàn thành chuyến đi!</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">Cảm ơn bạn đã lựa chọn VNRT Ride. Chúc bạn một ngày tuyệt vời!</p>
                </div>
                <button
                  onClick={() => {
                    setBookingStatus('idle');
                    setTripProgress(0);
                  }}
                  className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Đặt chuyến mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Form & Vehicle Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            {/* Location Inputs */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Điểm đón:
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/90 border border-white/10 text-white text-xs">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Điểm đến:
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/90 border border-white/10 text-white text-xs">
                  <Navigation className="w-4 h-4 text-red-400 shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Popular destination quick chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_DESTINATIONS.slice(0, 3).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setDestination(item.name);
                      setDistanceKm(item.distKm);
                      playPopSound();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    📍 {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Options List */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Chọn phương tiện di chuyển:
              </label>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {VEHICLE_OPTIONS.map((veh) => {
                  const isSelected = veh.id === selectedVehicle;
                  const fare = veh.baseFare + Math.round(distanceKm * veh.ratePerKm);

                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        setSelectedVehicle(veh.id);
                        playPopSound();
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-500/10'
                          : 'bg-zinc-800/60 hover:bg-zinc-800 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${veh.color} flex items-center justify-center text-white text-xl shadow-md shrink-0`}>
                          {veh.image}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs sm:text-sm">{veh.name}</span>
                            {veh.tag && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                                {veh.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>{veh.seats}</span>
                            <span>•</span>
                            <span>~{veh.timeEstimate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-black text-white text-sm">
                          {new Intl.NumberFormat('vi-VN').format(fare)}đ
                        </div>
                        <div className="text-[10px] text-amber-400 font-semibold">
                          ~{Math.round(fare / 100)} Orbs
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method & Confirm */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Hình thức thanh toán:</span>
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-800 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'cash' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Tiền mặt
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('orbs')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'orbs' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Orbs ({orbs})
                  </button>
                </div>
              </div>

              {/* Action Button */}
              {bookingStatus === 'idle' ? (
                <button
                  type="button"
                  onClick={handleStartBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>
                    Đặt {currentOption.name} • {new Intl.NumberFormat('vi-VN').format(tripPriceVND)}đ
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Hủy đặt xe
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 360° Car Exploration Modal */}
      {is360ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Khám phá Ngoại Thất & Khoang Xe 360°</h3>
              </div>
              <button
                onClick={() => setIs360ModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 360 Car Interactive Canvas / SVG Box */}
            <div className="relative h-64 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col items-center justify-center overflow-hidden border border-white/5">
              <div 
                className="text-8xl transition-transform duration-100 cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: `rotateY(${car360Angle}deg)`
                }}
              >
                🚘
              </div>
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCar360Angle((a) => a - 45)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold"
                >
                  ⟲ Xoay trái
                </button>
                <span className="text-xs text-cyan-300 font-mono font-bold">{car360Angle}°</span>
                <button
                  onClick={() => setCar360Angle((a) => a + 45)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold"
                >
                  Xoay phải ⟳
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-zinc-400 font-medium">Khoang hành khách</div>
                <div className="text-white font-bold mt-0.5">Rộng rãi • Da Nappa</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-zinc-400 font-medium">Hệ thống an toàn</div>
                <div className="text-emerald-400 font-bold mt-0.5">5 Sao ASEAN NCAP</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-zinc-400 font-medium">Điều hòa không khí</div>
                <div className="text-cyan-300 font-bold mt-0.5">Lọc bụi mịn PM2.5</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
