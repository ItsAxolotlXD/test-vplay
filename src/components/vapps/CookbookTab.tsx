import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Flame,
  Users,
  Search,
  BookOpen,
  Heart,
  ChevronRight,
  CheckCircle2,
  Circle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  X,
  ChefHat
} from 'lucide-react';
import { playPopSound } from '../../utils/sound';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: 'Món Nước' | 'Món Cơm / Xôi' | 'Món Cuốn' | 'Món Xào / Kho' | 'Tráng Miệng';
  region: 'Bắc' | 'Trung' | 'Nam';
  cookTimeMinutes: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Cầu kỳ';
  servings: number;
  image: string;
  calories: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  steps: { step: number; instruction: string; tip?: string }[];
  chefTip: string;
}

export const COOKBOOK_RECIPES: Recipe[] = [
  {
    id: 'pho-bo-ha-noi',
    title: 'Phở Bò Tái Lăn Hà Nội',
    subtitle: 'Nước dùng trong thanh ngọt từ xương bò, bánh phở mềm mướt',
    category: 'Món Nước',
    region: 'Bắc',
    cookTimeMinutes: 60,
    difficulty: 'Cầu kỳ',
    servings: 4,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    calories: '480 kcal',
    description: 'Hương vị phở truyền thống đất Tràng An với nước dùng ngọt đậm đà từ thảo mộc hồi quế thảo quả và thịt bò xào lăn tỏi thơm nức mũi.',
    ingredients: [
      { name: 'Xương bò ống', amount: '1.5 kg' },
      { name: 'Thịt thăn bò tươi', amount: '500g' },
      { name: 'Bánh phở tươi', amount: '800g' },
      { name: 'Hành tây nướng, gừng nướng', amount: '2 củ' },
      { name: 'Hoa hồi, thanh quế, thảo quả, đinh hương', amount: '1 gói vị phở' },
      { name: 'Hành hoa, ngò gai, chanh ớt tươi', amount: '1 bó' }
    ],
    steps: [
      { step: 1, instruction: 'Rửa sạch xương bò với nước muối loãng, chần qua nước sôi 5 phút rồi rửa lại để nước dùng trong vắt.' },
      { step: 2, instruction: 'Nướng thơm gừng và hành tây trên lửa, cạo sạch lớp cháy. Rang thơm hoa hồi, quế, thảo quả rồi cho vào túi lọc.' },
      { step: 3, instruction: 'Ninh xương bò nhỏ lửa trong 3-4 giờ cùng túi thảo mộc và hành gừng nướng, hớt bọt thường xuyên. Nêm chút nước mắm nhĩ và muối hạt.' },
      { step: 4, instruction: 'Thái lát thịt thăn bò mỏng. Phi thơm tỏi đập dập với lửa lớn, xào lăn thịt bò nhanh trong 30 giây cho vừa chín tới.' },
      { step: 5, instruction: 'Trần bánh phở vào tô, xếp thịt bò xào lăn lên trên, rắc hành lá ngò gai và chan nước dùng sôi sùng sục. Thưởng thức kèm quẩy và giấm tỏi.' }
    ],
    chefTip: 'Nên dùng giấm tỏi ớt ngâm chua thanh tao thay vì chanh để giữ đúng vị phở chuẩn phong vị Hà Nội cổ truyền.'
  },
  {
    id: 'bun-cha-ha-noi',
    title: 'Bún Chả Nướng Than Hoa',
    subtitle: 'Chả viên và chả miếng ướp đậm đà, nước mắm đu đủ chua ngọt',
    category: 'Món Nước',
    region: 'Bắc',
    cookTimeMinutes: 45,
    difficulty: 'Trung bình',
    servings: 3,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    calories: '520 kcal',
    description: 'Món ăn đại diện cho ẩm thực đường phố Hà Nội từng chinh phục tổng thống Mỹ Obama với miếng thịt nướng xém cạnh thơm lừng than hoa.',
    ingredients: [
      { name: 'Thịt ba chỉ rút sườn', amount: '400g' },
      { name: 'Thịt nạc vai xay', amount: '400g' },
      { name: 'Bún sợi nhỏ tươi', amount: '600g' },
      { name: 'Đu đủ xanh, cà rốt tỉa hoa', amount: '1/2 củ' },
      { name: 'Nước mắm ngon, đường vàng, giấm gạo', amount: 'Gia vị pha mắm' },
      { name: 'Rau sống: xà lách, tía tô, kinh giới', amount: '1 rổ' }
    ],
    steps: [
      { step: 1, instruction: 'Thái mỏng thịt ba chỉ. Thịt nạc vai băm nhỏ vo viên tròn dẹt. Ướp cùng nước cốt hành tỏi, nước màu thắng, tiêu và dầu hào.' },
      { step: 2, instruction: 'Đu đủ và cà rốt bào mỏng, bóp muối rồi ngâm chua ngọt với giấm đường cho giòn.' },
      { step: 3, instruction: 'Kẹp thịt vào vỉ nướng trên than hoa đượm lửa, lật đều tay đến khi chả vàng óng, xém cạnh tỏa mùi thơm nức.' },
      { step: 4, instruction: 'Pha nước mắm ấm theo tỉ lệ 1 mắm : 1 đường : 1 giấm : 4 nước lọc. Thả dưa góp đu đủ và chả nướng vào bát nước chấm.' },
      { step: 5, instruction: 'Dọn ăn kèm bún lá tươi và đĩa rau sống xanh mướt ngát hương kinh giới tía tô.' }
    ],
    chefTip: 'Thêm chút mỡ phần băm nhuyễn vào chả viên giúp viên chả mềm béo, không bị khô xác khi nướng lửa than.'
  },
  {
    id: 'com-tam-sai-gon',
    title: 'Cơm Tấm Sườn Bì Chả Sài Gòn',
    subtitle: 'Sườn cốt lết nướng mật ong sả ớt, chả trứng hấp vàng ươm',
    category: 'Món Cơm / Xôi',
    region: 'Nam',
    cookTimeMinutes: 50,
    difficulty: 'Trung bình',
    servings: 4,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    calories: '650 kcal',
    description: 'Bữa ăn đậm chất phương Nam với hạt gạo tấm dẻo thơm, sườn nướng mọng nước, bì heo dai giòn thính gạo và nước mắm kẹo cay tê ngọt ngào.',
    ingredients: [
      { name: 'Gạo tấm thơm', amount: '400g' },
      { name: 'Sườn cốt lết dầy thịt', amount: '4 miếng (600g)' },
      { name: 'Da heo luộc thái sợi + thính gạo', amount: '150g' },
      { name: 'Trứng gà, mộc nhĩ, thịt băm (làm chả)', amount: '3 quả + 200g' },
      { name: 'Mỡ hành lá phi thơm', amount: '1 chén' },
      { name: 'Đồ chua củ cải cà rốt, dưa leo, cà chua', amount: 'Ăn kèm' }
    ],
    steps: [
      { step: 1, instruction: 'Dùng sống dao đập nhẹ miếng sườn cho mềm. Ướp sườn với sả băm, hành tỏi, sữa đặc, mật ong, nước tương và dầu màu điều ít nhất 1 giờ.' },
      { step: 2, instruction: 'Nấu chín gạo tấm với tỉ lệ nước vừa phải để hạt cơm ráo mà mềm dẻo.' },
      { step: 3, instruction: 'Trộn thịt băm, nấm mèo, bún tàu và lòng trắng trứng hấp chín 20 phút, quét lòng đỏ trứng lên mặt cho vàng đẹp.' },
      { step: 4, instruction: 'Nướng sườn trên than hồng hoặc nồi chiên không dầu ở 180°C cho chín mềm, vàng đều hai mặt.' },
      { step: 5, instruction: 'Xới cơm tấm ra đĩa, đặt sườn nướng, miếng chả trứng, nhúm bì trộn thính, rưới đẫm mỡ hành và chan nước mắm tỏi ớt kẹo sệt.' }
    ],
    chefTip: 'Bí quyết sườn nướng mềm ngon không bao giờ bị khô là ướp cùng một muỗng canh sữa đặc có đường và chút nước ép cam tươi.'
  },
  {
    id: 'bun-bo-hue',
    title: 'Bún Bò Giò Heo Cố Đô Huế',
    subtitle: 'Nồng đượm hương mắm ruốc đặc sản, sả cây và ớt màu cay nồng',
    category: 'Món Nước',
    region: 'Trung',
    cookTimeMinutes: 75,
    difficulty: 'Cầu kỳ',
    servings: 5,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    calories: '550 kcal',
    description: 'Món bún trứ danh xứ Thần Kinh với hương thơm nồng nàn quyến rũ từ mắm ruốc Huế hòa quyện cùng sả đập dập và màu dầu hạt điều đỏ rực rỡ.',
    ingredients: [
      { name: 'Bắp bò hoa & nạm bò', amount: '600g' },
      { name: 'Móng giò heo chặt khoanh', amount: '500g' },
      { name: 'Mắm ruốc Huế chính hiệu', amount: '3 muỗng canh' },
      { name: 'Sả cây đập dập', amount: '8 nhánh' },
      { name: 'Huyết heo luộc, chả cua Huế', amount: '200g' },
      { name: 'Bún sợi to xứ Huế', amount: '800g' }
    ],
    steps: [
      { step: 1, instruction: 'Chần sạch bắp bò và móng giò với nước gừng sôi. Đem hầm cùng sả cây đập dập cho chín mềm.' },
      { step: 2, instruction: 'Hòa mắm ruốc Huế với nước lạnh, đun sôi rồi để lắng, chỉ chắt lấy phần nước trong ngọt đậm mùi thơm cho vào nồi nước hầm.' },
      { step: 3, instruction: 'Phi thơm hành tỏi với ớt bột Huế và dầu màu điều tạo lớp váng đỏ sóng sánh đẹp mắt đổ vào nồi nước dùng.' },
      { step: 4, instruction: 'Vớt bắp bò nguội thái lát mỏng. Chả cua quết viên thả vào nồi nước sôi nổi lên là chín.' },
      { step: 5, instruction: 'Trụng bún sợi to, xếp thịt bắp bò, giò heo, huyết luộc, chả cua, chan ngập nước dùng sôi và rắc hành tây, hoa chuối bào sợi giòn sần sật.' }
    ],
    chefTip: 'Không nên nêm mắm ruốc trực tiếp cả cặn vào nồi; chỉ lấy nước trong đã lắng để nước dùng thơm thoang thoảng mà không bị gắt mùi.'
  },
  {
    id: 'goi-cuon-tom-thit',
    title: 'Gỏi Cuốn Tôm Thịt Sốt Tương Bơ Đậu Phộng',
    subtitle: 'Món cuốn thanh mát giòn rụm với tôm tươi đỏ au và rau thơm',
    category: 'Món Cuốn',
    region: 'Nam',
    cookTimeMinutes: 30,
    difficulty: 'Dễ',
    servings: 4,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    calories: '280 kcal',
    description: 'Món cuốn thanh đạm nổi tiếng thế giới của Việt Nam, hội tụ tôm sú tươi giòn, thịt ba chỉ luộc trắng mềm, bún và rau thơm bên trong lớp bánh tráng dẻo dai.',
    ingredients: [
      { name: 'Tôm sú tươi', amount: '300g' },
      { name: 'Thịt ba chỉ heo', amount: '300g' },
      { name: 'Bánh tráng cuốn dẻo', amount: '1 xấp' },
      { name: 'Bún tươi sợi nhỏ', amount: '300g' },
      { name: 'Hẹ lá cọng dài, rau thơm, xà lách', amount: '1 bó' },
      { name: 'Tương hột xay, bơ đậu phộng, hành tỏi', amount: 'Làm sốt chấm' }
    ],
    steps: [
      { step: 1, instruction: 'Luộc chín tôm sú trong nước có vài cọng sả cho ngọt thơm, vớt ra lột vỏ bỏ chỉ lưng và chẻ đôi con tôm.' },
      { step: 2, instruction: 'Luộc thịt ba chỉ với chút muối và hành tím cho trắng giòn, thái lát thật mỏng.' },
      { step: 3, instruction: 'Phi thơm tỏi, cho tương hột xay và bơ đậu phộng vào xào sệt với chút nước cốt dừa, nêm đường cho vừa khẩu vị, rắc đậu phộng rang giã nhỏ.' },
      { step: 4, instruction: 'Thấm ướt nhẹ bánh tráng, xếp xà lách, rau thơm, bún tươi, vài lát thịt heo và xếp tôm mặt đỏ úp xuống ngoài cùng cùng cọng hẹ thò ra ngoài.' },
      { step: 5, instruction: 'Cuộn chặt tay tròn đều và chấm cùng bát sốt tương bơ đậu phộng béo bùi ngất ngây.' }
    ],
    chefTip: 'Đặt mặt đỏ của tôm úp sát lớp bánh tráng trong suốt để khi cuốn xong con tôm hiện lên đỏ rực bắt mắt nhất.'
  },
  {
    id: 'che-khuc-bach',
    title: 'Chè Khúc Bạch Hạnh Nhân Thanh Mát',
    subtitle: 'Khúc bạch phô mai dẻo béo, nhãn lồng mọng nước và nước đường phèn',
    category: 'Tráng Miệng',
    region: 'Bắc',
    cookTimeMinutes: 40,
    difficulty: 'Dễ',
    servings: 4,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
    calories: '220 kcal',
    description: 'Món tráng miệng thanh tao giải nhiệt tuyệt hảo mùa hè với những viên khúc bạch trắng ngần dẻo mịn béo ngậy sữa tươi và hạnh nhân rang giòn thơm lừng.',
    ingredients: [
      { name: 'Kem tươi whipping cream + sữa tươi', amount: '250ml mỗi loại' },
      { name: 'Gelatin lá ngâm mềm', amount: '15g' },
      { name: 'Phô mai tươi dẻo mịn', amount: '50g' },
      { name: 'Đường phèn thanh khiết', amount: '150g' },
      { name: 'Hạnh nhân lát rang vàng', amount: '50g' },
      { name: 'Nhãn tươi bóc vỏ bỏ hạt (hoặc vải thiều)', amount: '300g' }
    ],
    steps: [
      { step: 1, instruction: 'Đun ấm sữa tươi, whipping cream, phô mai và đường tan đều trên lửa nhỏ, không để sôi bùng.' },
      { step: 2, instruction: 'Vắt ráo lá gelatin đã ngâm mềm, cho vào nồi sữa khuấy tan hoàn toàn rồi đổ ra khuôn làm lạnh trong ngăn mát tủ lạnh 4 tiếng.' },
      { step: 3, instruction: 'Nấu nước đường phèn với lá dứa cho thơm lừng, để thật nguội.' },
      { step: 4, instruction: 'Cắt khúc bạch thành các khối vuông lượn sóng đẹp mắt bằng dao răng cưa.' },
      { step: 5, instruction: 'Cho khúc bạch, nhãn lồng mọng nước vào bát, chan nước đường phèn thanh mát, thả vài viên đá lạnh và rắc đẫm hạnh nhân nướng giòn rụm.' }
    ],
    chefTip: 'Không đun sôi sữa tươi whipping cream trên 80°C để tránh làm mất độ mịn béo và cấu trúc gelatin.'
  }
];

interface CookbookTabProps {
  onBack?: () => void;
}

export const CookbookTab: React.FC<CookbookTabProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('vplay_cookbook_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set(['pho-bo-ha-noi']);
    } catch {
      return new Set();
    }
  });

  // Cooking Timer state inside modal
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  // Timer interval effect
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playPopSound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPopSound();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('vplay_cookbook_favorites', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const categories = ['Tất cả', 'Món Nước', 'Món Cơm / Xôi', 'Món Cuốn', 'Tráng Miệng', 'Đã lưu'];

  const filteredRecipes = useMemo(() => {
    return COOKBOOK_RECIPES.filter((r) => {
      if (activeCategory === 'Đã lưu' && !favorites.has(r.id)) return false;
      if (activeCategory !== 'Tất cả' && activeCategory !== 'Đã lưu' && r.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesSub = r.subtitle.toLowerCase().includes(q);
        const matchesIngr = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
        const matchesDesc = r.description.toLowerCase().includes(q);
        return matchesTitle || matchesSub || matchesIngr || matchesDesc;
      }
      return true;
    });
  }, [activeCategory, searchQuery, favorites]);

  const startPresetTimer = (minutes: number) => {
    playPopSound();
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#EA580C]/20 via-[#B45309]/20 to-[#9A3412]/30 border border-orange-500/25 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <ChefHat className="w-4 h-4 text-orange-400" />
              <span>Space 360 Cookbook</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Cẩm Nang Ẩm Thực Ba Miền</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Cookbook • Món Ngon Mỗi Ngày
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Khám phá tinh hoa ẩm thực Việt với hàng trăm công thức chi tiết, định lượng nguyên liệu chuẩn chỉ, mẹo bếp đỉnh cao và đồng hồ hẹn giờ nấu ăn thông minh.
            </p>
          </div>

          {/* Quick Stat Highlights */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-xl font-black text-orange-400 font-mono block">100+</span>
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Công thức</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-xl font-black text-amber-300 font-mono block">3 Miền</span>
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Bắc Trung Nam</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-xl font-black text-yellow-400 font-mono block">{favorites.size}</span>
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Đã yêu thích</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 [scrollbar-width:none]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playPopSound();
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 scale-102'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Recipe Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món ăn, nguyên liệu..."
            className="w-full pl-9 pr-8 py-2 rounded-full bg-[#18171F] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => {
            const isFav = favorites.has(recipe.id);
            return (
              <div
                key={recipe.id}
                onClick={() => {
                  playPopSound();
                  setCheckedIngredients(new Set());
                  setSelectedRecipe(recipe);
                }}
                className="group relative rounded-2xl overflow-hidden bg-[#18171F] border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18171F] via-transparent to-black/30" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isFav
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110'
                        : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                    }`}
                    title={isFav ? 'Bỏ lưu' : 'Lưu công thức'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Region & Time Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      Miền {recipe.region}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-zinc-200 text-[10px] font-semibold backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{recipe.cookTimeMinutes} phút</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {recipe.subtitle}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>{recipe.calories}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        <span>{recipe.servings} phần</span>
                      </span>
                    </div>

                    <span className="text-orange-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold text-[11px]">
                      <span>Xem cách làm</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-[#18171F] rounded-3xl border border-white/5">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-300">Không tìm thấy công thức phù hợp</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục công thức nấu ăn.
          </p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#18171F] border border-orange-500/30 shadow-2xl [scrollbar-width:thin] text-white flex flex-col">
            {/* Header Hero in Modal */}
            <div className="relative h-56 sm:h-64 w-full shrink-0">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18171F] via-[#18171F]/40 to-black/60" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-all cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Info on image */}
              <div className="absolute bottom-4 left-6 right-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider">
                    Miền {selectedRecipe.region} • {selectedRecipe.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/50 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                    Độ khó: {selectedRecipe.difficulty}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                  {selectedRecipe.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-1">
                  {selectedRecipe.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Quick Bar with Timer Widget */}
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block">Thời gian:</span>
                    <strong className="text-white font-mono text-sm">{selectedRecipe.cookTimeMinutes} phút</strong>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div>
                    <span className="text-zinc-400 block">Khẩu phần:</span>
                    <strong className="text-white font-mono text-sm">{selectedRecipe.servings} người</strong>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div>
                    <span className="text-zinc-400 block">Năng lượng:</span>
                    <strong className="text-rose-400 font-mono text-sm">{selectedRecipe.calories}</strong>
                  </div>
                </div>

                {/* Built-in Cooking Timer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-400 px-3 py-1.5 rounded-lg bg-black/40 border border-orange-500/30 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <span>{formatTimer(timerSeconds)}</span>
                  </span>

                  {timerSeconds > 0 ? (
                    <>
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all cursor-pointer"
                        title={isTimerRunning ? 'Tạm dừng' : 'Tiếp tục'}
                      >
                        {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(0);
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 transition-all cursor-pointer"
                        title="Đặt lại"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startPresetTimer(selectedRecipe.cookTimeMinutes)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-500/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Bấm giờ {selectedRecipe.cookTimeMinutes}p</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Ingredients Section with Checkbox Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                    <span>Nguyên liệu chuẩn bị ({selectedRecipe.ingredients.length})</span>
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Bấm để đánh dấu nguyên liệu đã sẵn sàng
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedRecipe.ingredients.map((ingr, idx) => {
                    const isChecked = checkedIngredients.has(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          playPopSound();
                          setCheckedIngredients((prev) => {
                            const next = new Set(prev);
                            if (next.has(idx)) next.delete(idx);
                            else next.add(idx);
                            return next;
                          });
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through opacity-70'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
                          )}
                          <span className="truncate">{ingr.name}</span>
                        </div>
                        <span className="font-semibold text-orange-400 font-mono shrink-0 ml-2">
                          {ingr.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-step Instructions */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>Các bước thực hiện</span>
                </h3>

                <div className="space-y-3">
                  {selectedRecipe.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xs font-extrabold shrink-0">
                          {st.step}
                        </span>
                        <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                          Bước {st.step}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed pl-8">
                        {st.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef's Secret Tip Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Bí quyết vàng từ Bếp Trưởng Vplay:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  &ldquo;{selectedRecipe.chefTip}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookbookTab;
