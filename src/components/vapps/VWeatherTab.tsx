import React, { useState } from 'react';
import {
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Sun,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
  ShieldCheck,
  AlertTriangle,
  Search,
  MapPin,
  Sparkles,
  Calendar
} from 'lucide-react';

interface CityWeather {
  city: string;
  region: string;
  temp: number;
  feelsLike: number;
  condition: string;
  iconType: 'sun' | 'cloud-sun' | 'rain' | 'storm' | 'fog';
  humidity: number;
  windSpeed: number; // km/h
  uvIndex: number;
  aqi: number; // Air Quality Index
  pressure: number; // hPa
  sunrise: string;
  sunset: string;
  summary: string;
  hourly: { time: string; temp: number; icon: 'sun' | 'cloud-sun' | 'rain' | 'storm' }[];
  weekly: { day: string; date: string; tempMax: number; tempMin: number; cond: string; pop: number }[];
}

const CITIES_WEATHER_DATA: Record<string, CityWeather> = {
  'Hà Nội': {
    city: 'Hà Nội',
    region: 'Miền Bắc, Việt Nam',
    temp: 29,
    feelsLike: 32,
    condition: 'Nắng Có Mây Rải Rác',
    iconType: 'cloud-sun',
    humidity: 78,
    windSpeed: 14,
    uvIndex: 7,
    aqi: 65,
    pressure: 1012,
    sunrise: '05:42',
    sunset: '18:10',
    summary: 'Thời tiết ấm áp, gió đông nam nhẹ. Chiều tối khả năng có mưa rào cục bộ vài nơi.',
    hourly: [
      { time: 'Bây giờ', temp: 29, icon: 'cloud-sun' },
      { time: '13:00', temp: 31, icon: 'sun' },
      { time: '15:00', temp: 32, icon: 'sun' },
      { time: '17:00', temp: 30, icon: 'cloud-sun' },
      { time: '19:00', temp: 28, icon: 'rain' },
      { time: '21:00', temp: 26, icon: 'cloud-sun' },
      { time: '23:00', temp: 25, icon: 'cloud-sun' },
    ],
    weekly: [
      { day: 'Hôm nay', date: '10/09', tempMax: 32, tempMin: 25, cond: 'Nắng gián đoạn', pop: 30 },
      { day: 'Thứ Sáu', date: '11/09', tempMax: 33, tempMin: 26, cond: 'Nắng ráo', pop: 15 },
      { day: 'Thứ Bảy', date: '12/09', tempMax: 31, tempMin: 25, cond: 'Mưa rào chiều', pop: 60 },
      { day: 'Chủ Nhật', date: '13/09', tempMax: 30, tempMin: 24, cond: 'Mưa dông', pop: 70 },
      { day: 'Thứ Hai', date: '14/09', tempMax: 32, tempMin: 25, cond: 'Trời quang', pop: 20 },
      { day: 'Thứ Ba', date: '15/09', tempMax: 33, tempMin: 26, cond: 'Nắng nóng', pop: 10 },
      { day: 'Thứ Tư', date: '16/09', tempMax: 31, tempMin: 25, cond: 'Nhiều mây', pop: 40 },
    ],
  },
  'TP. Hồ Chí Minh': {
    city: 'TP. Hồ Chí Minh',
    region: 'Miền Nam, Việt Nam',
    temp: 32,
    feelsLike: 37,
    condition: 'Mưa Rào & Dông Chiều Tối',
    iconType: 'storm',
    humidity: 82,
    windSpeed: 16,
    uvIndex: 9,
    aqi: 58,
    pressure: 1009,
    sunrise: '05:48',
    sunset: '18:02',
    summary: 'Ban ngày trời nắng mạnh, tia UV cao. Chiều và tối mây dông phát triển nhanh gây mưa rào.',
    hourly: [
      { time: 'Bây giờ', temp: 32, icon: 'sun' },
      { time: '13:00', temp: 34, icon: 'sun' },
      { time: '15:00', temp: 31, icon: 'cloud-sun' },
      { time: '17:00', temp: 28, icon: 'storm' },
      { time: '19:00', temp: 26, icon: 'rain' },
      { time: '21:00', temp: 26, icon: 'cloud-sun' },
      { time: '23:00', temp: 25, icon: 'cloud-sun' },
    ],
    weekly: [
      { day: 'Hôm nay', date: '10/09', tempMax: 34, tempMin: 25, cond: 'Mưa dông chiều', pop: 75 },
      { day: 'Thứ Sáu', date: '11/09', tempMax: 33, tempMin: 25, cond: 'Mưa rào', pop: 65 },
      { day: 'Thứ Bảy', date: '12/09', tempMax: 34, tempMin: 26, cond: 'Nắng chiều dông', pop: 55 },
      { day: 'Chủ Nhật', date: '13/09', tempMax: 33, tempMin: 25, cond: 'Mưa rào', pop: 60 },
      { day: 'Thứ Hai', date: '14/09', tempMax: 34, tempMin: 26, cond: 'Nắng đẹp', pop: 30 },
      { day: 'Thứ Ba', date: '15/09', tempMax: 34, tempMin: 25, cond: 'Nắng chiều mưa', pop: 50 },
      { day: 'Thứ Tư', date: '16/09', tempMax: 33, tempMin: 25, cond: 'Mưa rải rác', pop: 70 },
    ],
  },
  'Đà Nẵng': {
    city: 'Đà Nẵng',
    region: 'Miền Trung, Việt Nam',
    temp: 31,
    feelsLike: 35,
    condition: 'Trời Nắng Đẹp & Gió Biển',
    iconType: 'sun',
    humidity: 72,
    windSpeed: 20,
    uvIndex: 8,
    aqi: 35,
    pressure: 1011,
    sunrise: '05:38',
    sunset: '17:58',
    summary: 'Không khí trong lành tuyệt đối, gió biển mát mẻ, sóng êm thuận lợi tắm biển.',
    hourly: [
      { time: 'Bây giờ', temp: 31, icon: 'sun' },
      { time: '13:00', temp: 33, icon: 'sun' },
      { time: '15:00', temp: 32, icon: 'sun' },
      { time: '17:00', temp: 29, icon: 'cloud-sun' },
      { time: '19:00', temp: 27, icon: 'cloud-sun' },
      { time: '21:00', temp: 26, icon: 'cloud-sun' },
      { time: '23:00', temp: 25, icon: 'cloud-sun' },
    ],
    weekly: [
      { day: 'Hôm nay', date: '10/09', tempMax: 33, tempMin: 25, cond: 'Nắng gió biển', pop: 10 },
      { day: 'Thứ Sáu', date: '11/09', tempMax: 33, tempMin: 25, cond: 'Trời trong xanh', pop: 10 },
      { day: 'Thứ Bảy', date: '12/09', tempMax: 32, tempMin: 26, cond: 'Nắng dịu', pop: 20 },
      { day: 'Chủ Nhật', date: '13/09', tempMax: 31, tempMin: 25, cond: 'Có mây', pop: 30 },
      { day: 'Thứ Hai', date: '14/09', tempMax: 32, tempMin: 25, cond: 'Nắng ráo', pop: 15 },
      { day: 'Thứ Ba', date: '15/09', tempMax: 33, tempMin: 26, cond: 'Nắng rực rỡ', pop: 10 },
      { day: 'Thứ Tư', date: '16/09', tempMax: 32, tempMin: 25, cond: 'Mây rải rác', pop: 25 },
    ],
  },
  'Đà Lạt': {
    city: 'Đà Lạt',
    region: 'Lâm Đồng, Tây Nguyên',
    temp: 19,
    feelsLike: 18,
    condition: 'Sương Mù & Mát Lạnh',
    iconType: 'fog',
    humidity: 90,
    windSpeed: 8,
    uvIndex: 5,
    aqi: 22,
    pressure: 1016,
    sunrise: '05:45',
    sunset: '18:00',
    summary: 'Không khí se lạnh đặc trưng vùng cao nguyên sương mù, thích hợp mặc áo ấm.',
    hourly: [
      { time: 'Bây giờ', temp: 19, icon: 'cloud-sun' },
      { time: '13:00', temp: 22, icon: 'cloud-sun' },
      { time: '15:00', temp: 21, icon: 'rain' },
      { time: '17:00', temp: 18, icon: 'rain' },
      { time: '19:00', temp: 16, icon: 'cloud-sun' },
      { time: '21:00', temp: 15, icon: 'cloud-sun' },
      { time: '23:00', temp: 14, icon: 'cloud-sun' },
    ],
    weekly: [
      { day: 'Hôm nay', date: '10/09', tempMax: 22, tempMin: 14, cond: 'Sương mù nhẹ', pop: 45 },
      { day: 'Thứ Sáu', date: '11/09', tempMax: 23, tempMin: 14, cond: 'Nắng nhẹ mát', pop: 30 },
      { day: 'Thứ Bảy', date: '12/09', tempMax: 21, tempMin: 15, cond: 'Mưa phùn chiều', pop: 60 },
      { day: 'Chủ Nhật', date: '13/09', tempMax: 20, tempMin: 14, cond: 'Se lạnh mưa', pop: 65 },
      { day: 'Thứ Hai', date: '14/09', tempMax: 22, tempMin: 14, cond: 'Sương sớm', pop: 20 },
      { day: 'Thứ Ba', date: '15/09', tempMax: 23, tempMin: 15, cond: 'Nắng ấm', pop: 15 },
      { day: 'Thứ Tư', date: '16/09', tempMax: 21, tempMin: 14, cond: 'Nhiều mây', pop: 40 },
    ],
  },
  'Sa Pa': {
    city: 'Sa Pa',
    region: 'Lào Cai, Tây Bắc',
    temp: 17,
    feelsLike: 16,
    condition: 'Mây Ngàn & Mát Dịu',
    iconType: 'fog',
    humidity: 88,
    windSpeed: 10,
    uvIndex: 4,
    aqi: 18,
    pressure: 1018,
    sunrise: '05:44',
    sunset: '18:14',
    summary: 'Khí hậu trong lành tuyệt đỉnh, mây bảng lảng đỉnh Fansipan, đêm lạnh 13°C.',
    hourly: [
      { time: 'Bây giờ', temp: 17, icon: 'cloud-sun' },
      { time: '13:00', temp: 20, icon: 'cloud-sun' },
      { time: '15:00', temp: 19, icon: 'cloud-sun' },
      { time: '17:00', temp: 16, icon: 'cloud-sun' },
      { time: '19:00', temp: 14, icon: 'cloud-sun' },
      { time: '21:00', temp: 13, icon: 'cloud-sun' },
      { time: '23:00', temp: 12, icon: 'cloud-sun' },
    ],
    weekly: [
      { day: 'Hôm nay', date: '10/09', tempMax: 20, tempMin: 12, cond: 'Biển mây vần vũ', pop: 25 },
      { day: 'Thứ Sáu', date: '11/09', tempMax: 21, tempMin: 13, cond: 'Nắng ráo dịu', pop: 20 },
      { day: 'Thứ Bảy', date: '12/09', tempMax: 19, tempMin: 12, cond: 'Mây phủ chiều', pop: 50 },
      { day: 'Chủ Nhật', date: '13/09', tempMax: 18, tempMin: 11, cond: 'Lạnh sương', pop: 55 },
      { day: 'Thứ Hai', date: '14/09', tempMax: 20, tempMin: 12, cond: 'Trời quang đãng', pop: 15 },
      { day: 'Thứ Ba', date: '15/09', tempMax: 21, tempMin: 13, cond: 'Nắng đẹp', pop: 10 },
      { day: 'Thứ Tư', date: '16/09', tempMax: 20, tempMin: 12, cond: 'Mát mẻ', pop: 30 },
    ],
  },
};

export const VWeatherTab: React.FC = () => {
  const [selectedCityName, setSelectedCityName] = useState<string>('Hà Nội');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentWeather = CITIES_WEATHER_DATA[selectedCityName] || CITIES_WEATHER_DATA['Hà Nội'];

  const renderWeatherIcon = (iconType: string, className = 'w-8 h-8') => {
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-sky-300`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-400`} />;
      case 'storm':
        return <CloudLightning className={`${className} text-purple-400 animate-bounce`} />;
      case 'fog':
        return <CloudFog className={`${className} text-slate-300`} />;
      default:
        return <Cloud className={`${className} text-sky-400`} />;
    }
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Tuyệt vời', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (aqi <= 100) return { label: 'Trung bình', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { label: 'Nhạy cảm', color: 'text-rose-400', bg: 'bg-rose-500/20' };
  };

  const aqiStatus = getAqiStatus(currentWeather.aqi);

  return (
    <div id="v-weather-app" className="w-full text-white">
      {/* Header Banner - V-Flow style */}
      <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-md flex items-center justify-center text-white shrink-0">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                V-Weather • Thời Tiết 360
              </h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Khí Tượng Số
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Dự báo 24 giờ & 7 ngày tới • Chất lượng không khí AQI • Bức xạ tia UV & rada mây vệ tinh
            </p>
          </div>
        </div>

        {/* City selection pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar self-start md:self-auto pb-1">
          {Object.keys(CITIES_WEATHER_DATA).map((cityName) => (
            <button
              key={cityName}
              onClick={() => setSelectedCityName(cityName)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCityName === cityName
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'bg-[#2A2933] border border-[#3E3D4D] text-[#9CA3AF] hover:text-white'
              }`}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Overview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Big Weather Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-bold">{currentWeather.region}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">{currentWeather.city}</h2>
              <p className="text-sm text-[#9CA3AF] mt-1 font-medium">{currentWeather.condition}</p>
            </div>

            <div className="p-3 bg-[#18171E] rounded-2xl border border-[#2D2D38]">
              {renderWeatherIcon(currentWeather.iconType, 'w-16 h-16 sm:w-20 sm:h-20')}
            </div>
          </div>

          {/* Temperature large stat */}
          <div className="my-8 flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tighter">
              {currentWeather.temp}°
            </span>
            <div className="text-xs sm:text-sm text-slate-300 space-y-0.5 font-medium">
              <div>Cảm giác như: <span className="text-white font-bold">{currentWeather.feelsLike}°C</span></div>
              <div className="text-cyan-300">{currentWeather.summary}</div>
            </div>
          </div>

          {/* Weather KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Độ ẩm</span>
              </div>
              <div className="text-base font-black text-white font-mono mt-1">{currentWeather.humidity}%</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gió</span>
              </div>
              <div className="text-base font-black text-white font-mono mt-1">{currentWeather.windSpeed} km/h</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Tia UV</span>
              </div>
              <div className="text-base font-black text-white font-mono mt-1">
                {currentWeather.uvIndex} <span className="text-xs font-normal text-amber-300">(Cao)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Không khí AQI</span>
              </div>
              <div className={`text-base font-black font-mono mt-1 ${aqiStatus.color}`}>
                {currentWeather.aqi} <span className="text-xs font-normal font-sans">({aqiStatus.label})</span>
              </div>
            </div>
          </div>

          {/* Sun time banner */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-300 bg-black/30 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Bình minh: <strong className="text-white font-mono">{currentWeather.sunrise}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <span>Hoàng hôn: <strong className="text-white font-mono">{currentWeather.sunset}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Hourly & Weekly Forecast (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 24h Hourly Forecast strip */}
          <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dự Báo Theo Giờ (24h)</span>
            </h3>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {currentWeather.hourly.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-between p-3 rounded-xl bg-[#18171E] border border-[#2D2D38] min-w-[72px] shrink-0 text-center space-y-2"
                >
                  <span className="text-[11px] text-[#9CA3AF] font-mono">{h.time}</span>
                  <div>{renderWeatherIcon(h.icon, 'w-6 h-6')}</div>
                  <span className="text-sm font-bold font-mono text-white">{h.temp}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-[#1F1E24] border border-[#2D2D38] rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dự Báo 7 Ngày Tới</span>
            </h3>

            <div className="divide-y divide-white/5 text-xs">
              {currentWeather.weekly.map((w, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="w-24">
                    <span className="font-bold text-white block">{w.day}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{w.date}</span>
                  </div>

                  <div className="flex-1 text-center truncate">
                    <span className="text-slate-300">{w.cond}</span>
                    {w.pop > 30 && (
                      <span className="text-[10px] text-blue-400 block font-mono">🌧 {w.pop}%</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-right shrink-0">
                    <span className="text-slate-400">{w.tempMin}°</span>
                    <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full" />
                    </div>
                    <span className="font-bold text-white">{w.tempMax}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
