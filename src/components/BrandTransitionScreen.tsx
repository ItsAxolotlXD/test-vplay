import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Music, Play, Pause, Volume1, Search, ArrowRight, BookOpen, Menu, ExternalLink, SquareArrowDown } from 'lucide-react';
import { useIntermissionMusic } from '../context/IntermissionMusicContext';

interface BrandTransitionScreenProps {
  onContinue: () => void;
  onStartSetup?: () => void;
}

interface MessageItem {
  id: string;
  flagEmojis: string[];
  title: string;
  nativeTitle: string;
  region: 'asia' | 'europe' | 'global';
  text: string;
}

// Convert emoji flag to Twemoji SVG codepoints to guarantee 100% accurate flag display on Windows PC
const getTwemojiCode = (emoji: string): string => {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join('-');
};

interface TwemojiFlagProps {
  emoji: string;
  title?: string;
  className?: string;
}

export const TwemojiFlag: React.FC<TwemojiFlagProps> = ({
  emoji,
  title,
  className = 'w-7 h-7 sm:w-8 sm:h-8',
}) => {
  const [loadError, setLoadError] = useState(false);
  const code = getTwemojiCode(emoji);
  const primaryUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;

  if (loadError) {
    // If SVG fails, fallback to native emoji
    return (
      <span
        className="brand-flag-emoji text-2xl sm:text-3xl leading-none inline-block filter select-none"
        role="img"
        aria-label={title || emoji}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={primaryUrl}
      alt={title || emoji}
      title={title || emoji}
      loading="eager"
      decoding="async"
      onError={() => setLoadError(true)}
      className={`${className} inline-block object-contain align-middle drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] shrink-0 select-none`}
    />
  );
};

const MESSAGES: MessageItem[] = [
  {
    id: 'vi',
    flagEmojis: ['🇻🇳'],
    title: 'Tiếng Việt',
    nativeTitle: 'Tiếng Việt (Vietnamese)',
    region: 'asia',
    text: 'Chào mừng tới Test VNRT ONLINE. Đây là phiên bản nhà phát triển để chúng tôi có thể thử nghiệm một vài tính năng... rất ngẫu nhiên hoặc lớn hơn là một vài tính năng mới sẽ được đưa lên phiên bản VNRT ONLINE chính thức. Vì đây là phiên bản nhà phát triển nên không thể tránh khỏi các lỗi lặt vặt, vì vậy nếu bạn muốn một trải nghiệm VNRT ONLINE tốt nhất, hãy sử dụng phiên bản chính thức. Trân trọng!',
  },
  {
    id: 'en',
    flagEmojis: ['🇬🇧', '🇺🇸'],
    title: 'English',
    nativeTitle: 'English (US / UK)',
    region: 'global',
    text: 'Welcome to Test VNRT ONLINE. This is a developer version for us to experiment with some features... very random ones or bigger new features that will be brought to the official VNRT ONLINE release. Since this is a developer version, minor bugs are inevitable, so if you want the best VNRT ONLINE experience, please use the official release. Sincerely!',
  },
  {
    id: 'zh-cn',
    flagEmojis: ['🇨🇳'],
    title: '中文 (简体)',
    nativeTitle: 'Simplified Chinese',
    region: 'asia',
    text: '欢迎访问 Test VNRT ONLINE。这是供我们测试部分功能的开发者版本……包括一些非常随机的功能，或是即将上线 VNRT ONLINE 正式版的新特性。由于这是开发者版本，难免会出现些许细小问题，如果您希望获得最优质的 VNRT ONLINE 体验，请使用正式版。致敬！',
  },
  {
    id: 'zh-tw',
    flagEmojis: ['🇹🇼', '🇭🇰'],
    title: '中文 (繁體)',
    nativeTitle: 'Traditional Chinese',
    region: 'asia',
    text: '歡迎造訪 Test VNRT ONLINE。這是供我們測試部分功能的開發者版本……包括一些非常隨機的功能，或是即將上線 VNRT ONLINE 正式版的新功能。由於這是開發者版本，難免會出現細微錯誤，如果您希望獲得最佳的 VNRT ONLINE 體驗，請使用正式版。謹啟！',
  },
  {
    id: 'ja',
    flagEmojis: ['🇯🇵'],
    title: '日本語',
    nativeTitle: 'Japanese',
    region: 'asia',
    text: 'Test VNRT ONLINE へようこそ。これは、非常にランダムな機能や、VNRT ONLINE 公式版に導入される大型の新機能などをテストするための開発者向けプレビュー版です。開発者版であるため軽微な不具合が発生する場合があります。最高の VNRT ONLINE 体験をお求めの場合は、公式版をご利用ください。敬具！',
  },
  {
    id: 'ko',
    flagEmojis: ['🇰🇷'],
    title: '한국어',
    nativeTitle: 'Korean',
    region: 'asia',
    text: 'Test VNRT ONLINE에 오신 것을 환영합니다. 이것은 매우 무작위적인 기능이나 VNRT ONLINE 정식 버전에 도입될 새로운 대형 기능들을 시험해 보기 위한 개발者 버전입니다. 개발자 버전 특성상 사소한 버그가 발생할 수 있으니, 최고의 VNRT ONLINE 경험을 원하신다면 정식 버전을 이용해 주시기 바랍니다. 감사합니다!',
  },
  {
    id: 'es',
    flagEmojis: ['🇪🇸'],
    title: 'Español',
    nativeTitle: 'Spanish',
    region: 'europe',
    text: '¡Bienvenido a Test VNRT ONLINE! Esta es una versión para desarrolladores para que podamos probar algunas funciones... muy aleatorias o características más importantes que se incorporarán a la versión oficial de VNRT ONLINE. Dado que se trata de una versión para desarrolladores, los pequeños errores son inevitables, por lo que si deseas la mejor experiencia con VNRT ONLINE, utiliza la versión oficial. ¡Atentamente!',
  },
  {
    id: 'fr',
    flagEmojis: ['🇫🇷'],
    title: 'Français',
    nativeTitle: 'French',
    region: 'europe',
    text: 'Bienvenue sur Test VNRT ONLINE. Ceci est une version développeur nous permettant de tester certaines fonctionnalités... rất aléatoires ou de plus grandes nouveautés qui seront intégrées à la version officielle de VNRT ONLINE. Comme il s\'agit d\'une version développeur, de petits bugs sont inévitables ; pour une expérience optimale, nous vous invitons à utiliser la version officielle. Cordialement !',
  },
  {
    id: 'de',
    flagEmojis: ['🇩🇪'],
    title: 'Deutsch',
    nativeTitle: 'German',
    region: 'europe',
    text: 'Willkommen bei Test VNRT ONLINE. Dies ist eine Entwicklerversion, mit der wir einige Funktionen testen können... ganz zufällige oder auch größere neue Features, die in die offizielle Version von VNRT ONLINE übernommen werden. Da dies eine Entwicklerversion ist, lassen sich kleine Fehler nicht vermeiden. Für das beste VNRT ONLINE-Erlebnis nutzen Sie bitte die offizielle Version. Mit freundlichen Grüßen!',
  },
  {
    id: 'pt',
    flagEmojis: ['🇵🇹', '🇧🇷'],
    title: 'Português',
    nativeTitle: 'Portuguese (Portugal / Brasil)',
    region: 'global',
    text: 'Bem-vindo ao Test VNRT ONLINE. Esta é uma versão de desenvolvedor para testarmos alguns recursos... muito aleatórios ou novidades maiores que serão levadas para a versão oficial do VNRT ONLINE. Por ser uma versão de desenvolvedor, pequenos bugs são inevitáveis, portanto, para ter a melhor experiência no VNRT ONLINE, use a versão oficial. Atenciosamente!',
  },
  {
    id: 'ru',
    flagEmojis: ['🇷🇺'],
    title: 'Русский',
    nativeTitle: 'Russian',
    region: 'europe',
    text: 'Добро пожаловать в Test VNRT ONLINE. Это версия для разработчиков, где мы тестируем некоторые функции... как совершенно случайные, так и более масштабные нововведения, которые появятся в официальной версии VNRT ONLINE. Поскольку это версия для разработчиков, мелкие ошибки неизбежны, поэтому для наилучшего взаимодействия с VNRT ONLINE используйте официальную версию. С уважением!',
  },
  {
    id: 'it',
    flagEmojis: ['🇮🇹'],
    title: 'Italiano',
    nativeTitle: 'Italian',
    region: 'europe',
    text: 'Benvenuti su Test VNRT ONLINE. Questa è una versione per sviluppatori creata per permetterci di sperimentare alcune fonctionnalités... molto casuali o modifiche più importanti che verranno introdotte nella versione ufficiale di VNRT ONLINE. Trattandosi di una versione per sviluppatori, piccoli bug sono inevitabili; se desideri la migliore esperienza con VNRT ONLINE, ti consigliamo di utilizzare la versione ufficiale. Cordiali saluti!',
  },
  {
    id: 'id',
    flagEmojis: ['🇮🇩'],
    title: 'Bahasa Indonesia',
    nativeTitle: 'Indonesian',
    region: 'asia',
    text: 'Selamat datang di Test VNRT ONLINE. Ini adalah versi pengembang bagi kami untuk bereksperimen dengan beberapa fitur... baik fitur acak maupun fitur baru yang lebih besar yang akan dihadirkan pada rilis resmi VNRT ONLINE. Karena ini adalah versi pengembang, bug kecil tidak dapat dihindari, jadi jika Anda menginginkan pengalaman VNRT ONLINE terbaik, silakan gunakan rilis resmi. Salam hormat!',
  },
  {
    id: 'ms',
    flagEmojis: ['🇲🇾'],
    title: 'Bahasa Melayu',
    nativeTitle: 'Malay',
    region: 'asia',
    text: 'Selamat datang ke Test VNRT ONLINE. Ini adalah versi pembangun untuk kami mencuba beberapa ciri... ciri rawak mahupun ciri baharu yang lebih besar yang akan dibawakan ke versi rasmi VNRT ONLINE. Memandangkan ini adalah versi pembangun, pepijat kecil không thể tránh khỏi, jadi jika anda mahukan pengalaman VNRT ONLINE yang terbaik, sila gunakan versi rasmi. Sekian, terima kasih!',
  },
  {
    id: 'th',
    flagEmojis: ['🇹🇭'],
    title: 'ภาษาไทย',
    nativeTitle: 'Thai',
    region: 'asia',
    text: 'ยินดีต้อนรับสู่ Test VNRT ONLINE นี่เป็นเวอร์ชันสำหรับนักพัฒนาเพื่อให้เราได้ทดลองฟีเจอร์บางอย่าง... ไม่ว่าจะเป็นฟีเจอร์แบบสุ่มหรือฟีเจอร์ใหม่ที่ใหญ่กว่าซึ่งจะถูกนำไปใช้ในเวอร์ชันทางการของ VNRT ONLINE เนื่องจากเป็นเวอร์ชันสำหรับนักพัฒนา ข้อผิดพลาดเล็กน้อยจึงเป็นสิ่งที่หลีกเลี่ยงไม่ได้ หากคุณต้องการประสบการณ์ VNRT ONLINE ที่ดีที่สุด โปรดใช้เวอร์ชันทางการ ขอแสดงความนับถือ!',
  },
  {
    id: 'tl',
    flagEmojis: ['🇵🇭'],
    title: 'Filipino / Tagalog',
    nativeTitle: 'Filipino',
    region: 'asia',
    text: 'Maligayang pagdating sa Test VNRT ONLINE. Ito ay isang developer version para masubukan namin ang ilang mga tampok... mga napaka-random o mas malalaking bagong feature na dadalhin sa opisyal na release ng VNRT ONLINE. Dahil ito ay isang bersyon ng developer, hindi maiiwasan ang mga maliliit na bug, kaya kung nais mo ang pinakamahusay na karanasan sa VNRT ONLINE, mangyaring gamitin ang opisyal na release. Lubos na gumagalang!',
  },
  {
    id: 'hi',
    flagEmojis: ['🇮🇳'],
    title: 'हिन्दी',
    nativeTitle: 'Hindi',
    region: 'asia',
    text: 'Test VNRT ONLINE में आपका स्वागत है। यह डेवलपर्स के लिए एक परीक्षण संस्करण है ताकि हम कुछ सुविधाओं के साथ प्रयोग कर सकें... कुछ अप्रत्याशित या बड़े नए फीचर्स जिन्हें आधिकारिक VNRT ONLINE रिलीज में जोड़ा जाएगा। चूंकि यह एक डेवलपर संस्करण है, इसलिए छोटी-मोटी कमियां अपरिहार्य हैं, इसलिए यदि आप बेहतरीन VNRT ONLINE अनुभव चाहते हैं, तो कृपया आधिकारिक संस्करण का उपयोग करें। सादर!',
  },
  {
    id: 'ar',
    flagEmojis: ['🇸🇦', '🇦🇪'],
    title: 'العربية',
    nativeTitle: 'Arabic',
    region: 'asia',
    text: 'مرحبًا بكم في Test VNRT ONLINE. هذا إصدار للمطورين يتيح لنا تجربة بعض الميزات... سواء كانت ميزات عشوائية أو ميزات جديدة رئيسية ستتم إضافتها إلى الإصدار الرسمي من VNRT ONLINE. نظراً لأن هذا إصدار للمطورين، فإن الأخطاء البسيطة أمر لا مفر منه، لذا إذا كنت ترغب في الحصول على أفضل تجربة لـ VNRT ONLINE، يرجى استخدام الإصدار الرسمي. مع خالص التحية!',
  },
  {
    id: 'tr',
    flagEmojis: ['🇹🇷'],
    title: 'Türkçe',
    nativeTitle: 'Turkish',
    region: 'europe',
    text: 'Test VNRT ONLINE\'a hoş geldiniz. Bu, bazı özellikleri denememiz için hazırlanmış bir geliştirici sürümüdür... son derece rastgele veya VNRT ONLINE resmi sürümüne eklenecek daha büyük yeni özellikler. Bu bir geliştirici sürümü olduğundan küçük hatalar kaçılmazdır, bu nedenle en iyi VNRT ONLINE deneyimini istiyorsanız lütfen resmi sürümü kullanın. Saygılarımızla!',
  },
  {
    id: 'nl',
    flagEmojis: ['🇳🇱'],
    title: 'Nederlands',
    nativeTitle: 'Dutch',
    region: 'europe',
    text: 'Welkom bij Test VNRT ONLINE. Dit is een ontwikkelaarsversie waarmee we enkele functies kunnen uitproberen... zeer willekeurige of juist grotere nieuwe functies die aan de officiële VNRT ONLINE-versie worden toegevoegd. Aangezien dit een ontwikkelaarsversie is, zijn kleine bugs onvermijdelijk; voor de beste VNRT ONLINE-ervaring raden we aan de officiële versie te gebruiken. Met vriendelijke groet!',
  },
  {
    id: 'pl',
    flagEmojis: ['🇵🇱'],
    title: 'Polski',
    nativeTitle: 'Polish',
    region: 'europe',
    text: 'Witamy w Test VNRT ONLINE. To jest wersja deweloperska, w której testujemy wybrane funkcje... zarówno drobne, eksperymentalne, jak i większe nowości, które trafią do oficjalnego wydania VNRT ONLINE. Ponieważ jest to wersja deweloperska, drobne błędy są nieuniknione, dlatego jeśli zależy Ci na najlepszych wrażeniach z VNRT ONLINE, skorzystaj z oficjalnej wersji. Z poważaniem!',
  },
  {
    id: 'uk',
    flagEmojis: ['🇺🇦'],
    title: 'Українська',
    nativeTitle: 'Ukrainian',
    region: 'europe',
    text: 'Ласкаво просимо до Test VNRT ONLINE. Це версія для розробників, призначена для тестування нових можливостей... від випадкових експериментів до великих функцій, які незабаром з\'являться в офіційному релізі VNRT ONLINE. Оскільки це версія для розробників, незначні помилки неминучі, тому для найкращого досвіду роботи з VNRT ONLINE використовуйте офіційну версію. З повагою!',
  },
  {
    id: 'sv',
    flagEmojis: ['🇸🇪'],
    title: 'Svenska',
    nativeTitle: 'Swedish',
    region: 'europe',
    text: 'Välkommen till Test VNRT ONLINE. Detta är en utvecklarversion där vi testar olika funktioner... såväl slumpmässiga idéer som större nya funktioner som kommer att släppas i den officiella versionen av VNRT ONLINE. Eftersom detta är en utvecklarversion kan mindre buggar förekomma. För den bästa VNRT ONLINE-upplevelsen ber vi dig använda den officiella utgåvan. Vänliga hälsningar!',
  },
  {
    id: 'el',
    flagEmojis: ['🇬🇷'],
    title: 'Ελληνικά',
    nativeTitle: 'Greek',
    region: 'europe',
    text: 'Καλώς ήρθατε στο Test VNRT ONLINE. Αυτή είναι μια έκδοση προγραμματιστή για να δοκιμάσουμε ορισμένες λειτουργίες... πολύ τυχαίες ή μεγαλύτερες νέες δυνατότητες που θα ενσωματωθούν στην επίσημη έκδοση του VNRT ONLINE. Καθώς πρόκειται για έκδοση προγραμματιστή, μικρά σφάλματα είναι αναπόφευκτα, οπότε αν θέλετε την καλύτερη εμπειρία VNRT ONLINE, παρακαλούμε χρησιμοποιήστε την επίσημη έκδοση. Με εκτίμηση!',
  },
];

export const BrandTransitionScreen: React.FC<BrandTransitionScreenProps> = ({ onContinue, onStartSetup }) => {
  const {
    isPlaying,
    isMuted,
    volume: volumeLevel,
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
    boostMaxVolume,
  } = useIntermissionMusic();

  // Search and filter states (always available on the page)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'asia' | 'europe'>('all');

  // Handle any user click or key on the page to immediately guarantee maximum volume
  const handleUserInteraction = () => {
    boostMaxVolume();
  };

  const handleSwitchReleases = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = 'https://vplay-2610.vercel.app';
  };

  const handleStartSetup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartSetup) {
      onStartSetup();
    } else {
      onContinue();
      try {
        localStorage.removeItem('vplay_oobe_completed');
      } catch {}
      window.dispatchEvent(new CustomEvent('vplay:open_oobe'));
    }
  };

  const filteredMessages = MESSAGES.filter((msg) => {
    if (selectedRegion !== 'all' && msg.region !== selectedRegion) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      msg.title.toLowerCase().includes(q) ||
      msg.nativeTitle.toLowerCase().includes(q) ||
      msg.text.toLowerCase().includes(q) ||
      msg.id.toLowerCase().includes(q)
    );
  });

  return (
    <div
      onClick={handleUserInteraction}
      className="brand-intermission-screen fixed inset-0 z-[99999] overflow-y-auto bg-[#F8FAFC] text-slate-800 antialiased select-none flex flex-col justify-between"
      style={{
        fontFamily: "'Chakra Petch', 'Rajdhani', 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Explicit style tags to ensure square font family overrides global Integer !important rules */}
      <style>{`
        .brand-intermission-screen,
        .brand-intermission-screen h1,
        .brand-intermission-screen h2,
        .brand-intermission-screen h3,
        .brand-intermission-screen h4,
        .brand-intermission-screen p,
        .brand-intermission-screen span:not(.brand-flag-emoji),
        .brand-intermission-screen button,
        .brand-intermission-screen input,
        .brand-intermission-screen div:not(.brand-flag-emoji) {
          font-family: 'Chakra Petch', 'Rajdhani', 'Space Grotesk', system-ui, -apple-system, sans-serif !important;
          letter-spacing: -0.01em;
        }
        .brand-flag-emoji {
          font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Twemoji Mozilla', sans-serif !important;
          font-style: normal !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Floating Sound Controls in top-right corner with Volume Boost indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-full px-3 py-1.5 text-slate-700">
        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Music className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát tiếp nhạc'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        {/* Mute/Unmute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
        </button>

        {/* Volume Boost Indicator / Button */}
        <button
          type="button"
          onClick={(e) => handleSetVolume(100, e)}
          className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            volumeLevel === 100 && !isMuted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Âm lượng tối đa (100%)"
        >
          <Volume1 className="w-3 h-3" />
          <span>100% MAX</span>
        </button>
      </div>

      {/* Main Content Area (pb-32 for Intermission Tab Bar clearance) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-8 sm:px-10 sm:py-12 pb-32">
        {/* Header Title Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                VNRT ONLINE <span className="text-amber-500 font-black">TEST BUILD</span>
              </h1>
            </div>

            {/* Quick Continue Button on top */}
            <button
              type="button"
              onClick={onContinue}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span>Vào trang web ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ALWAYS-VISIBLE SEARCH & FILTER BOX (Đặt trực tiếp trên trang Intermission) */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-3 sm:p-3.5 shadow-xs">
          <div className="flex items-center gap-3 px-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[2.4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm ngôn ngữ hoặc nội dung thông báo (Tiếng Việt, English, Español, 日本語, Русский...)..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Region Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-slate-400 font-semibold px-1">Khu vực:</span>
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({MESSAGES.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('asia')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'asia'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Á
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('europe')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'europe'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Âu
              </button>
            </div>

            {(searchQuery || selectedRegion !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px]">
                  {filteredMessages.length} / {MESSAGES.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                  }}
                  className="text-amber-600 hover:underline font-bold cursor-pointer text-[11px]"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty Search Result State */}
        {filteredMessages.length === 0 && (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-xs my-6">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">
              Không tìm thấy ngôn ngữ phù hợp với &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Thử tìm theo tên tiếng Việt, tiếng Anh, tên bản địa hoặc quốc kỳ.
            </p>
          </div>
        )}

        {/* List of Messages */}
        <div className="space-y-6">
          {filteredMessages.map((msg, index) => (
            <div key={msg.id} className="group transition-all">
              {/* Language Header with High-Resolution Twemoji SVG Flag & Name */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  {msg.flagEmojis.map((emoji, idx) => (
                    <TwemojiFlag
                      key={idx}
                      emoji={emoji}
                      title={msg.title}
                      className="w-7 h-7 sm:w-8 sm:h-8"
                    />
                  ))}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{msg.title}</span>
                    {msg.nativeTitle !== msg.title && (
                      <span className="text-xs sm:text-sm font-medium text-slate-400">
                        ({msg.nativeTitle})
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Message Content */}
              <p
                className="mt-2.5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal"
                dir={msg.id === 'ar' ? 'rtl' : 'ltr'}
              >
                {msg.text}
              </p>

              {/* Divider (except last item) */}
              {index < filteredMessages.length - 1 && (
                <div className="h-px bg-slate-200/90 w-full mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Action Button: Tiếp tục vào trang web (Continue to Website) → */}
        <div className="flex justify-center items-center pt-12 pb-8">
          <button
            type="button"
            id="btn-continue-to-website"
            onClick={onContinue}
            className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 transition-all cursor-pointer flex items-center gap-2 group border border-slate-700/30"
          >
            <span>Tiếp tục vào trang web (Continue to Website)</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-200">
              →
            </span>
          </button>
        </div>
      </main>

      {/* DEDICATED TAB VIEW BAR FOR INTERMISSION SCREEN (Tách biệt hoàn toàn, cùng style/opacity/blur như thanh tab trong app) */}
      <nav
        aria-label="Thanh điều hướng Intermission"
        className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none max-w-[95vw]"
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(2.5px)',
            WebkitBackdropFilter: 'blur(2.5px)',
          }}
          className="tab-view-pill flex items-center px-1 sm:px-1.5 py-1 sm:py-1 rounded-full border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-all"
        >
          {/* Tab 1: Build Notice (icon book) - Active View */}
          <div
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm select-none"
          >
            <motion.div
              layoutId="intermissionTabActivePill"
              className="absolute inset-0 rounded-full bg-[#FF7A00] shadow-[0_4px_16px_rgba(255,122,0,0.48)] z-0"
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 34,
                mass: 0.75,
              }}
            />
            <div className="relative z-10 flex items-center gap-2 text-white font-bold">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.3]" />
              <span className="whitespace-nowrap">Build Notice</span>
            </div>
          </div>

          {/* Tab 2: Switch Releases (icon Menu / giống tab More), nhảy sang https://vplay-2610.vercel.app */}
          <a
            id="tab-intermission-switch-releases"
            href="https://vplay-2610.vercel.app"
            target="_top"
            rel="noopener noreferrer"
            onClick={handleSwitchReleases}
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm text-[#222222] hover:text-black font-semibold transition-all cursor-pointer outline-none select-none active:scale-95 group"
            title="Chuyển sang bản phát hành https://vplay-2610.vercel.app"
          >
            <div className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="whitespace-nowrap">Switch Releases</span>
              <ExternalLink className="w-3 h-3 text-[#555555] group-hover:text-black transition-colors -ml-0.5 shrink-0" />
            </div>
          </a>

          {/* Tab 3: Start Setup (trigger Windows 11 style OOBE Setup) */}
          <button
            type="button"
            id="tab-intermission-start-setup"
            onClick={handleStartSetup}
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm text-[#222222] hover:text-black font-semibold transition-all cursor-pointer outline-none select-none active:scale-95 group"
            title="Bắt đầu thiết lập OOBE Setup"
          >
            <div className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <SquareArrowDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-[#222222] group-hover:text-black transition-colors" />
              <span className="whitespace-nowrap">Start Setup</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Footer Branding */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 bg-white/40 pb-20 sm:pb-24">
        <span>Test VNRT ONLINE • Brand Transition 2026</span>
      </footer>
    </div>
  );
};
