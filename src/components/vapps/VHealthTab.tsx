import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Activity,
  Droplet,
  Eye,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Smile,
  ShieldCheck,
  AlertTriangle,
  Award,
  Footprints,
  Moon,
  Info,
  ChevronRight
} from 'lucide-react';
import { playPopSound, playWinSound } from '../../utils/sound';

interface Exercise {
  id: string;
  title: string;
  target: string;
  durationSeconds: number;
  description: string;
  benefit: string;
  instruction: string[];
}

const STRETCH_EXERCISES: Exercise[] = [
  {
    id: 'eye-2020',
    title: 'Quy Tắc Mắt 20-20-20',
    target: 'Thị Giác & Mắt',
    durationSeconds: 20,
    description: 'Cứ sau 20 phút xem màn hình, hãy nhìn vào một vật cách xa 20 feet (6 mét) trong 20 giây.',
    benefit: 'Giảm mỏi mắt, chống khô võng mạc và hạn chế tăng độ cận thị.',
    instruction: [
      'Ngừng nhìn vào màn hình TV hoặc điện thoại.',
      'Phóng tầm mắt nhìn ra ngoài cửa sổ hoặc điểm xa nhất trong phòng.',
      'Chớp mắt nhẹ nhàng 5-10 lần và hít thở sâu.'
    ]
  },
  {
    id: 'neck-shoulder',
    title: 'Xoay Cổ & Thư Giãn Khớp Vai',
    target: 'Cổ - Vai - Gáy',
    durationSeconds: 30,
    description: 'Động tác giải tỏa áp lực đốt sống cổ do ngồi xem TV lâu một tư thế.',
    benefit: 'Tăng cường lưu thông máu lên não, giảm đau mỏi vai gáy tức thì.',
    instruction: [
      'Ngồi thẳng lưng, thả lỏng hai vai.',
      'Nghiêng đầu sang phải giữ 5 giây, đổi sang trái giữ 5 giây.',
      'Từ từ xoay tròn nhẹ nhàng khớp cổ theo chiều kim đồng hồ.'
    ]
  },
  {
    id: 'back-stretch',
    title: 'Vươn Vai & Kéo Giãn Lưng Dưới',
    target: 'Cột Sống & Thắt Lưng',
    durationSeconds: 45,
    description: 'Động tác kéo giãn trục cột sống toàn thân, giảm áp lực lên đĩa đệm.',
    benefit: 'Chống gù lưng, phòng ngừa thoái hóa cột sống khi ngồi lâu.',
    instruction: [
      'Đan hai bàn tay vào nhau và lộn ngược lòng bàn tay hướng lên trần nhà.',
      'Vươn người cao nhất có thể, hít sâu giữ trong 5 giây.',
      'Từ từ gập nhẹ người sang hai bên hông.'
    ]
  },
  {
    id: 'wrist-relief',
    title: 'Xoay Cổ Tay & Ngón Tay',
    target: 'Khớp Tay & Cổ Tay',
    durationSeconds: 30,
    description: 'Thư giãn bàn tay cầm remote hoặc bấm bàn phím liên tục.',
    benefit: 'Phòng ngừa hội chứng ống cổ tay và tê bì đầu ngón tay.',
    instruction: [
      'Nắm chặt hai bàn tay rồi bung xòe hết cỡ 10 lần.',
      'Chắp hai lòng bàn tay vào nhau trước ngực rồi hạ thấp khuỷu tay.',
      'Xoay tròn hai cổ tay theo cả hai chiều.'
    ]
  },
  {
    id: 'deep-breathing',
    title: 'Hít Thở Sâu 4-7-8',
    target: 'Hệ Hô Hấp & Thần Kinh',
    durationSeconds: 60,
    description: 'Kỹ thuật thở thanh lọc oxy của y học hiện đại giúp cân bằng nhịp tim và thư giãn não bộ.',
    benefit: 'Hạ cortisol căng thẳng, ổn định huyết áp và tái tạo năng lượng.',
    instruction: [
      'Hít vào chậm bằng mũi trong 4 giây.',
      'Giữ hơi thở lại trong 7 giây.',
      'Thở ra từ từ bằng miệng qua kẽ môi trong 8 giây.'
    ]
  }
];

export const VHealthTab: React.FC = () => {
  const [waterMl, setWaterMl] = useState<number>(1250);
  const waterTarget = 2000;
  const [heartBpm, setHeartBpm] = useState<number>(76);
  const [steps, setSteps] = useState<number>(5420);
  const stepsTarget = 8000;
  const [screenTimeMinutes, setScreenTimeMinutes] = useState<number>(45);

  // BMI Calculator states
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(65);

  // Active Stretch Exercise & Timer
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(STRETCH_EXERCISES[0]);
  const [timerSeconds, setTimerSeconds] = useState<number>(STRETCH_EXERCISES[0].durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add water handler
  const handleAddWater = (amount: number) => {
    playPopSound();
    setWaterMl((prev) => {
      const next = Math.min(prev + amount, 3500);
      if (next >= waterTarget && prev < waterTarget) {
        playWinSound();
        showToast('Chúc mừng! Bạn đã hoàn thành chỉ tiêu 2,000ml nước hôm nay! 💧🎉');
      } else {
        showToast(`Đã thêm +${amount}ml nước uống!`);
      }
      return next;
    });
  };

  // Timer logic for exercise
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playWinSound();
      showToast(`Hoàn thành bài tập ${selectedExercise.title}! Cơ thể bạn đã được nạp lại năng lượng! ✨`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, selectedExercise]);

  const handleSelectExercise = (ex: Exercise) => {
    playPopSound();
    setSelectedExercise(ex);
    setTimerSeconds(ex.durationSeconds);
    setIsTimerRunning(false);
  };

  // BMI calculation
  const bmi = (weightKg / ((heightCm / 100) * (heightCm / 100))).toFixed(1);
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { text: 'Thiếu cân', color: 'text-amber-400', advice: 'Cần bổ sung dinh dưỡng hợp lý' };
    if (val < 23.0) return { text: 'Bình thường (Chuẩn châu Á)', color: 'text-emerald-400', advice: 'Tuyệt vời! Hãy tiếp tục duy trì thể trạng này' };
    if (val < 25.0) return { text: 'Tiền béo phì', color: 'text-amber-400', advice: 'Nên kết hợp vận động 30 phút mỗi ngày' };
    return { text: 'Thừa cân / Béo phì', color: 'text-rose-400', advice: 'Cần giảm khẩu phần tinh bột và tăng tập cardio' };
  };
  const bmiInfo = getBmiStatus(parseFloat(bmi));

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
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  V-Health
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    SỨC KHỎE & THỂ CHẤT
                  </span>
                </h1>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Theo dõi sức khỏe, cảnh báo ngồi xem TV lâu & bài tập giãn cơ thông minh
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18171E] border border-[#2D2D38] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#9CA3AF]">
                Thể trạng: <strong className="text-emerald-400">Rất tốt (92/100)</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 2. TV POSTURE & SCREEN TIME ALERT BANNER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#1F1E24] to-[#1F1E24] border border-amber-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Cảnh báo thời gian xem màn hình: {screenTimeMinutes} phút
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Khuyến nghị nghỉ ngơi
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Bạn đã xem TV và màn hình liên tục trên 40 phút. Hãy đứng dậy xoay người, uống 1 ngụm nước và thực hiện bài tập giãn cơ!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPopSound();
              setScreenTimeMinutes(0);
              showToast('Đã đặt lại bộ đếm thời gian xem màn hình!');
            }}
            className="px-4 py-2 rounded-xl bg-[#2A2933] hover:bg-[#3E3D4D] border border-[#3E3D4D] text-amber-300 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Đã nghỉ ngơi xong ✓
          </button>
        </div>

        {/* 3. CORE METRICS 4-CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Water Intake */}
          <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3E3D4D] transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF]">Nước Uống Hôm Nay</span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">
                {waterMl} <span className="text-xs font-normal text-[#9CA3AF]">/ {waterTarget} ml</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#18171E] mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (waterMl / waterTarget) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => handleAddWater(250)}
                className="flex-1 py-1.5 rounded-lg bg-[#2A2933] hover:bg-[#3E3D4D] border border-[#3E3D4D] text-sky-300 text-xs font-bold transition-all cursor-pointer"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="flex-1 py-1.5 rounded-lg bg-[#2A2933] hover:bg-[#3E3D4D] border border-[#3E3D4D] text-sky-300 text-xs font-bold transition-all cursor-pointer"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Card 2: Heart Rate */}
          <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3E3D4D] transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF]">Nhịp Tim Lúc Nghỉ</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">
                {heartBpm} <span className="text-xs font-normal text-[#9CA3AF]">BPM</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                Nhịp tim ổn định • Bình thường
              </div>
            </div>
            <div className="pt-2 text-[10px] text-[#9CA3AF] border-t border-[#2D2D38]">
              Đo tự động qua cảm biến thể chất Vplay
            </div>
          </div>

          {/* Card 3: Steps */}
          <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3E3D4D] transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF]">Bước Chân Vận Động</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Footprints className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">
                {steps.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#9CA3AF]">/ {stepsTarget.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#18171E] mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (steps / stepsTarget) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1">
              <span>≈ {(steps * 0.04).toFixed(0)} kcal</span>
              <span>≈ {(steps * 0.00075).toFixed(1)} km</span>
            </div>
          </div>

          {/* Card 4: Sleep Time */}
          <div className="p-4 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] hover:border-[#3E3D4D] transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF]">Giấc Ngủ Đêm Qua</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Moon className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">
                7g 45p <span className="text-xs font-normal text-[#9CA3AF]">ngủ sâu</span>
              </div>
              <div className="text-xs text-purple-400 font-semibold mt-1">
                Chất lượng giấc ngủ: 88% Tốt
              </div>
            </div>
            <div className="pt-2 text-[10px] text-[#9CA3AF] border-t border-[#2D2D38]">
              Thức dậy lúc 06:30 • 3 chu kỳ REM
            </div>
          </div>
        </div>

        {/* 4. GUIDED STRETCHES & BMI CALCULATOR (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: STRETCH EXERCISE STUDIO */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#2D2D38]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Bài Tập Giãn Cơ Tại Chỗ Cho Người Xem TV
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Thực hiện ngay trên ghế sofa hoặc bàn làm việc để bảo vệ cột sống và thị lực
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {STRETCH_EXERCISES.length} bài tập chuẩn y khoa
                </div>
              </div>

              {/* Exercises selector pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4">
                {STRETCH_EXERCISES.map((ex) => {
                  const isSelected = selectedExercise.id === ex.id;
                  return (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExercise(ex)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md font-bold'
                          : 'bg-[#18171E] text-[#9CA3AF] hover:text-white border border-[#2D2D38]'
                      }`}
                    >
                      {ex.title}
                    </button>
                  );
                })}
              </div>

              {/* Active Exercise Display Box */}
              <div className="p-5 rounded-2xl bg-[#18171E] border border-[#2D2D38] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      Mục tiêu: {selectedExercise.target}
                    </span>
                    <h4 className="text-lg font-black text-white mt-1.5">{selectedExercise.title}</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                      {selectedExercise.description}
                    </p>
                  </div>

                  {/* Timer Display */}
                  <div className="text-center shrink-0 p-3 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] w-28">
                    <div className="text-3xl font-black text-amber-400 font-mono">
                      {timerSeconds}s
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-0.5">
                      Đếm ngược
                    </div>
                  </div>
                </div>

                {/* Step by step instructions */}
                <div className="space-y-2 pt-2 border-t border-[#2D2D38]">
                  <div className="text-xs font-bold text-white">Hướng dẫn động tác:</div>
                  <div className="space-y-1.5">
                    {selectedExercise.instruction.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#9CA3AF]">
                        <span className="w-5 h-5 rounded-full bg-[#2A2933] text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      playPopSound();
                      setIsTimerRunning(!isTimerRunning);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                      isTimerRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'TẠM DỪNG' : 'BẮT ĐẦU TẬP (START)'}</span>
                  </button>
                  <button
                    onClick={() => {
                      playPopSound();
                      setIsTimerRunning(false);
                      setTimerSeconds(selectedExercise.durationSeconds);
                    }}
                    className="p-2.5 rounded-xl bg-[#2A2933] hover:bg-[#3E3D4D] text-[#9CA3AF] hover:text-white border border-[#3E3D4D] cursor-pointer"
                    title="Đặt lại đồng hồ"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: BMI CALCULATOR */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#1F1E24] border border-[#2D2D38] shadow-lg space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Chỉ Số Khối Cơ Thể (BMI)
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Đánh giá thể trạng chuẩn y tế WHO
                </p>
              </div>

              {/* Slider Inputs */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1">
                    <span>Chiều cao:</span>
                    <span className="font-bold text-white font-mono">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={140}
                    max={200}
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1">
                    <span>Cân nặng:</span>
                    <span className="font-bold text-white font-mono">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={35}
                    max={120}
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div className="p-4 rounded-xl bg-[#18171E] border border-[#2D2D38] text-center space-y-1">
                <div className="text-[10px] text-[#9CA3AF] font-bold uppercase">Chỉ số BMI của bạn</div>
                <div className="text-3xl font-black text-white font-mono">{bmi}</div>
                <div className={`text-xs font-bold ${bmiInfo.color}`}>{bmiInfo.text}</div>
                <div className="text-[11px] text-[#9CA3AF] pt-1 leading-relaxed">
                  {bmiInfo.advice}
                </div>
              </div>

              {/* Healthy TV tips */}
              <div className="p-3.5 rounded-xl bg-[#18171E] border border-[#2D2D38] space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mẹo Xem TV Lành Mạnh
                </div>
                <ul className="text-[11px] text-[#9CA3AF] space-y-1.5 list-disc list-inside">
                  <li>Đặt màn hình TV cách mắt tối thiểu 2.5 - 3 mét.</li>
                  <li>Bật đèn phòng dịu nhẹ, tránh xem trong phòng tối hoàn toàn.</li>
                  <li>Giữ góc nhìn ngang hoặc hơi chúc xuống 15 độ.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
