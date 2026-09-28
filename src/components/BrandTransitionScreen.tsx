import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

interface BrandTransitionScreenProps {
  onContinue: () => void;
}

// Crisp inline SVG flags for accurate rendering on all OS/browsers
const FlagGB: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs object-cover shrink-0" viewBox="0 0 60 30" fill="none">
    <clipPath id="gb-clip"><rect width="60" height="30" /></clipPath>
    <g clipPath="url(#gb-clip)">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#FFF" strokeWidth="6" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0V30M0 15H60" stroke="#FFF" strokeWidth="10" />
      <path d="M30 0V30M0 15H60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FlagUS: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 741 390">
    <rect width="741" height="390" fill="#B22234" />
    <path d="M0 30h741M0 90h741M0 150h741M0 210h741M0 270h741M0 330h741" stroke="#FFF" strokeWidth="30" />
    <rect width="296" height="210" fill="#3C3B6E" />
    <g fill="#FFF">
      <circle cx="30" cy="21" r="9" /><circle cx="89" cy="21" r="9" /><circle cx="148" cy="21" r="9" /><circle cx="207" cy="21" r="9" /><circle cx="266" cy="21" r="9" />
      <circle cx="59" cy="42" r="9" /><circle cx="118" cy="42" r="9" /><circle cx="177" cy="42" r="9" /><circle cx="236" cy="42" r="9" />
      <circle cx="30" cy="63" r="9" /><circle cx="89" cy="63" r="9" /><circle cx="148" cy="63" r="9" /><circle cx="207" cy="63" r="9" /><circle cx="266" cy="63" r="9" />
      <circle cx="59" cy="84" r="9" /><circle cx="118" cy="84" r="9" /><circle cx="177" cy="84" r="9" /><circle cx="236" cy="84" r="9" />
      <circle cx="30" cy="105" r="9" /><circle cx="89" cy="105" r="9" /><circle cx="148" cy="105" r="9" /><circle cx="207" cy="105" r="9" /><circle cx="266" cy="105" r="9" />
      <circle cx="59" cy="126" r="9" /><circle cx="118" cy="126" r="9" /><circle cx="177" cy="126" r="9" /><circle cx="236" cy="126" r="9" />
      <circle cx="30" cy="147" r="9" /><circle cx="89" cy="147" r="9" /><circle cx="148" cy="147" r="9" /><circle cx="207" cy="147" r="9" /><circle cx="266" cy="147" r="9" />
      <circle cx="59" cy="168" r="9" /><circle cx="118" cy="168" r="9" /><circle cx="177" cy="168" r="9" /><circle cx="236" cy="168" r="9" />
      <circle cx="30" cy="189" r="9" /><circle cx="89" cy="189" r="9" /><circle cx="148" cy="189" r="9" /><circle cx="207" cy="189" r="9" /><circle cx="266" cy="189" r="9" />
    </g>
  </svg>
);

const FlagVN: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#DA251D" />
    <polygon points="30,8 33.7,19.4 45.7,19.4 36,26.4 39.7,37.8 30,30.8 20.3,37.8 24,26.4 14.3,19.4 26.3,19.4" fill="#FFFF00" />
  </svg>
);

const FlagFR: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="20" height="40" fill="#002395" />
    <rect x="20" width="20" height="40" fill="#FFFFFF" />
    <rect x="40" width="20" height="40" fill="#ED2939" />
  </svg>
);

const FlagDE: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="13.33" fill="#000000" />
    <rect y="13.33" width="60" height="13.33" fill="#DD0000" />
    <rect y="26.66" width="60" height="13.34" fill="#FFCE00" />
  </svg>
);

const FlagES: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="10" fill="#AA151B" />
    <rect y="10" width="60" height="20" fill="#F1BF00" />
    <rect y="30" width="60" height="10" fill="#AA151B" />
    <circle cx="16" cy="20" r="3.5" fill="#AA151B" />
  </svg>
);

const FlagPT: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="24" height="40" fill="#006600" />
    <rect x="24" width="36" height="40" fill="#FF0000" />
    <circle cx="24" cy="20" r="7" fill="#FFFF00" />
    <rect x="21" y="17" width="6" height="6" fill="#FFF" />
    <path d="M21 17h6v4a3 3 0 0 1-6 0z" fill="#002B7F" />
  </svg>
);

const FlagBR: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#009B3A" />
    <polygon points="30,4 56,20 30,36 4,20" fill="#FEDF00" />
    <circle cx="30" cy="20" r="7.5" fill="#002776" />
    <path d="M23 21a8 8 0 0 1 14 -2" stroke="#FFF" strokeWidth="1.2" fill="none" />
  </svg>
);

const FlagIT: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="20" height="40" fill="#009246" />
    <rect x="20" width="20" height="40" fill="#FFFFFF" />
    <rect x="40" width="20" height="40" fill="#CE2B37" />
  </svg>
);

const FlagCN: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#DE2910" />
    <polygon points="10,6 12,12 18,12 13,16 15,22 10,18 5,22 7,16 2,12 8,12" fill="#FFDE00" />
    <polygon points="20,4 20.8,6.5 23.3,6.5 21.3,8 22.1,10.5 20,9 17.9,10.5 18.7,8 16.7,6.5 19.2,6.5" fill="#FFDE00" transform="scale(0.7) translate(8, -1)" />
    <polygon points="24,8 24.8,10.5 27.3,10.5 25.3,12 26.1,14.5 24,13 21.9,14.5 22.7,12 20.7,10.5 23.2,10.5" fill="#FFDE00" transform="scale(0.7) translate(10, 2)" />
  </svg>
);

const FlagTW: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#FE0000" />
    <rect width="30" height="20" fill="#000095" />
    <circle cx="15" cy="10" r="4.5" fill="#FFF" />
    <circle cx="15" cy="10" r="3" fill="#000095" />
    <circle cx="15" cy="10" r="2" fill="#FFF" />
  </svg>
);

const FlagHK: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#EE1C25" />
    <circle cx="30" cy="20" r="6" fill="#FFF" />
    <circle cx="30" cy="20" r="4.5" fill="#EE1C25" />
  </svg>
);

const FlagJP: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <circle cx="30" cy="20" r="9" fill="#BC002D" />
  </svg>
);

const FlagKR: React.FC = () => (
  <svg className="w-7 h-5 rounded-xs shadow-xs shrink-0" viewBox="0 0 60 40">
    <rect width="60" height="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M30 11a9 9 0 0 1 0 18 4.5 4.5 0 0 1 0 -9 4.5 4.5 0 0 0 0 -9" fill="#CD2E3A" />
    <path d="M30 29a9 9 0 0 1 0 -18 4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 0 0 9" fill="#0047A0" />
    <line x1="8" y1="9" x2="16" y2="15" stroke="#000" strokeWidth="1.5" />
    <line x1="44" y1="25" x2="52" y2="31" stroke="#000" strokeWidth="1.5" />
  </svg>
);

interface MessageItem {
  id: string;
  flags: React.ReactNode;
  title: string;
  text: string;
}

const MESSAGES: MessageItem[] = [
  {
    id: 'en',
    flags: (
      <div className="flex items-center gap-1.5 shrink-0">
        <FlagGB />
        <FlagUS />
      </div>
    ),
    title: 'English',
    text: 'Welcome to Test VNRT ONLINE. We are undergoing a special brand transition from Vplay to VNRT ONLINE to open a new chapter. Sincerely!',
  },
  {
    id: 'vi',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagVN />
      </div>
    ),
    title: 'Tiếng Việt',
    text: 'Chào mừng đến với Test VNRT ONLINE. Chúng tôi đang thực hiện cuộc chuyển giao thương hiệu đặc biệt từ Vplay sang VNRT ONLINE để mở ra một chương mới. Trân trọng!',
  },
  {
    id: 'fr',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagFR />
      </div>
    ),
    title: 'Français (French)',
    text: 'Bienvenue sur Test VNRT ONLINE. Nous effectuons une transition de marque spéciale de Vplay vers VNRT ONLINE afin d\'ouvrir un nouveau chapitre. Cordialement !',
  },
  {
    id: 'de',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagDE />
      </div>
    ),
    title: 'Deutsch (German)',
    text: 'Willkommen bei Test VNRT ONLINE. Wir führen einen besonderen Markenübergang von Vplay zu VNRT ONLINE durch, um ein neues Kapitel aufzuschlagen. Mit freundlichen Grüßen!',
  },
  {
    id: 'es',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagES />
      </div>
    ),
    title: 'Español (Spanish)',
    text: '¡Bienvenido a Test VNRT ONLINE! Estamos realizando una transición de marca especial de Vplay a VNRT ONLINE para abrir un nuevo capítulo. ¡Atentamente!',
  },
  {
    id: 'pt',
    flags: (
      <div className="flex items-center gap-1.5 shrink-0">
        <FlagPT />
        <FlagBR />
      </div>
    ),
    title: 'Português (Portuguese)',
    text: 'Bem-vindo ao Test VNRT ONLINE. Estamos realizando uma transição especial de marca do Vplay para o VNRT ONLINE para abrir um novo capítulo. Atenciosamente!',
  },
  {
    id: 'it',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagIT />
      </div>
    ),
    title: 'Italiano (Italian)',
    text: 'Benvenuti su Test VNRT ONLINE. Stiamo effettuando una transizione speciale del marchio da Vplay a VNRT ONLINE per aprire un nuovo capitolo. Cordiali saluti!',
  },
  {
    id: 'zh-cn',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagCN />
      </div>
    ),
    title: '中文 (简体) (Simplified Chinese)',
    text: '欢迎访问 Test VNRT ONLINE。我们正在进行从 Vplay 到 VNRT ONLINE 的特别品牌过渡，开启崭新篇章。致敬！',
  },
  {
    id: 'zh-tw',
    flags: (
      <div className="flex items-center gap-1.5 shrink-0">
        <FlagTW />
        <FlagHK />
      </div>
    ),
    title: '中文 (繁體) (Traditional Chinese)',
    text: '歡迎造訪 Test VNRT ONLINE。我們正在進行從 Vplay 到 VNRT ONLINE 的特別品牌過渡，開啟嶄新篇章。謹啟！',
  },
  {
    id: 'ja',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagJP />
      </div>
    ),
    title: '日本語 (Japanese)',
    text: 'Test VNRT ONLINE へようこそ。私たちは Vplay から VNRT ONLINE への特別なブランド移行を行い、新たな章の幕を開けています。敬具！',
  },
  {
    id: 'ko',
    flags: (
      <div className="flex items-center shrink-0">
        <FlagKR />
      </div>
    ),
    title: '한국어 (Korean)',
    text: 'Test VNRT ONLINE에 오신 것을 환영합니다. 저희는 새로운 장을 열기 위해 Vplay에서 VNRT ONLINE으로의 특별한 브랜드 전환을 진행하고 있습니다. 감사합니다!',
  },
];

export const BrandTransitionScreen: React.FC<BrandTransitionScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // YouTube video ID: ijS5whAOX3Q (Minecraft Live 2023 - Intermission Music)
  const videoId = 'ijS5whAOX3Q';
  const youtubeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=0&playsinline=1&modestbranding=1`;

  // Try to guarantee audio starts on first click anywhere if browser blocked initial autoplay
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute' }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo' }),
          '*'
        );
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    if (isPlaying) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo' }),
        '*'
      );
      setIsPlaying(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo' }),
        '*'
      );
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    if (isMuted) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute' }),
        '*'
      );
      setIsMuted(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'mute' }),
        '*'
      );
      setIsMuted(true);
    }
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-[#F8FAFC] text-slate-800 antialiased font-sans select-none flex flex-col justify-between"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Hidden YouTube Iframe that loops the intermission music continuously */}
      <iframe
        ref={iframeRef}
        src={youtubeUrl}
        title="Background Music"
        allow="autoplay; encrypted-media"
        className="w-0 h-0 opacity-0 pointer-events-none absolute -top-[9999px] -left-[9999px]"
      />

      {/* Floating Sound Controls in top-right corner */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-full px-2.5 py-1.5 text-slate-700">
        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Music className="w-2.5 h-2.5 text-emerald-400" />
        </div>
        <button
          type="button"
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát tiếp nhạc'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-700" />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
        <div className="space-y-6">
          {MESSAGES.map((msg, index) => (
            <div key={msg.id} className="group">
              {/* Language Header with Flags & Name */}
              <div className="flex items-center gap-3">
                {msg.flags}
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  {msg.title}
                </h3>
              </div>

              {/* Message Content */}
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {msg.text}
              </p>

              {/* Divider (except last item) */}
              {index < MESSAGES.length - 1 && (
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
            className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-[#0B132B] hover:bg-[#1C2541] active:scale-95 text-white font-medium sm:font-semibold text-sm sm:text-base shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 transition-all cursor-pointer flex items-center gap-2 group border border-slate-700/30"
          >
            <span>Tiếp tục vào trang web (Continue to Website)</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-200">
              →
            </span>
          </button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        <span>Test VNRT ONLINE • Brand Transition 2026</span>
      </footer>
    </div>
  );
};
