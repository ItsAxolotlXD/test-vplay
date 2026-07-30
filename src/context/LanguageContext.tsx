import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const DEFAULT_VPLAY_LANG = `# ========================================================
# VPLAY LANGUAGE FILE (vplay.lang)
# File cấu hình ngôn ngữ toàn bộ ứng dụng Vplay (JSON UI)
# Định dạng: key=value
# Chỉnh sửa nội dung dưới đây để thay đổi văn bản trong app
# ========================================================

# --- HEADER BAR & NAVIGATION ---
header.home=HOME
header.live=TRỰC TIẾP
header.explore=Khám phá
header.copilot=Copilot
header.vstudy=Vstudy
header.vflow=Vflow
header.verified=Tài khoản xác minh
header.settings=Cài đặt

# --- SIDEBAR & MENU ---
sidebar.home=Trang chủ
sidebar.channels=Danh sách kênh
sidebar.exploreVietnam=Khám phá Việt Nam
sidebar.fandomLogos=Fandom & Đội bóng
sidebar.aiThumbnail=Vplay Intelligence
sidebar.oreSettings=Cài đặt giao diện JSON UI
sidebar.search=Tìm kiếm kênh
sidebar.copilot=Vplay Copilot
sidebar.vstudy=Vstudy
sidebar.vflow=Vflow
sidebar.verified=Verified Users
sidebar.notifications=Thông báo
sidebar.vbox=Vplay VBox
sidebar.vertical=Vplay Vertical
sidebar.debugMode=Debug Mode (vplay.lang)

# --- START MENU ---
startMenu.title=VPLAY MENU
startMenu.mainTabs=Danh mục chính
startMenu.vplayApps=Vplay Suite Apps

# --- HOME TAB & BANNER SLIDER ---
home.tab.DesignPreview.name=WELCOME TO A DESIGN PREVIEW
home.tab.DesignPreview.desc=Bạn đang được trải nghiệm hệ thống giao diện mới của Vplay, lấy cảm hứng từ Minecraft Bedrock JSON UI, chúng tôi rất muốn nghe ý kiến của bạn. Hãy nhớ rằng là web nói chung và giao diện nói riêng vẫn đang trong quá trình phát triển, vì vậy một số tính năng có thể bị thiếu hoặc bạn sẽ gặp phải khá nhiều lỗi. JSON UI hứa hẹn sẽ đem đến cho bạn một trải nghiệm Vplay đẹp mắt, trực quan và mượt mà nhất.
home.banner.exploreOreUI=KHÁM PHÁ JSON UI
home.banner.giveFeedback=Give Feedback
home.banner.vtv6Title=Vì một Việt Nam khỏe mạnh
home.banner.vtv6Desc=VTV6 là kênh truyền hình chuyên biệt về thể thao của Đài Truyền hình Việt Nam. Nội dung chính của kênh bao gồm các bản tin, chuyên mục và chương trình tường thuật về thể thao trong nước và quốc tế do Trung tâm Truyền hình Thể thao sản xuất chính, với mục tiêu thúc đẩy phong trào thể thao quần chúng, thể thao học đường, thể thao chuyên nghiệp phát triển tại Việt Nam cũng như hướng đến rèn luyện, nâng cao sức khỏe cộng đồng và xây dựng con người phát triển toàn diện.
home.banner.watchNow=Watch now
home.banner.learnMore=Learn more

# --- LIVE TV & CHANNEL PLAYER ---
livetv.title=TRỰC TIẾP VPLAY TV
livetv.nowPlaying=Đang phát
livetv.liveBadge=LIVE
livetv.fullscreen=Toàn màn hình
livetv.exitFullscreen=Thoát toàn màn hình
livetv.volume=Âm lượng
livetv.mute=Tắt tiếng
livetv.unmute=Bật tiếng
livetv.comments=Bình luận trực tiếp
livetv.sendComment=Gửi bình luận
livetv.inputPlaceholder=Nhập bình luận...
livetv.quality=Chất lượng video
livetv.autoQuality=Tự động (1080p)

# --- SEARCH CHANNELS VIEW ---
search.title=VPLAY CHANNELS
search.description=Chia sẻ ứng dụng hoặc xuất danh sách toàn bộ kênh Vplay dưới dạng .m3u8.
search.share=SHARE
search.shared=ĐÃ CHIA SẺ!
search.export=EXPORT CHANNELS (.M3U8)
search.exported=ĐÃ TẢI FILE M3U8!
search.copy=COPY LINK
search.copied=ĐÃ COPY LINK!
search.debugMode=DEBUG MODE (VPLAY.LANG)
search.input.label=Find channels by name or category
search.input.placeholder=Search for channels
search.recommended=Recommended channels
search.recentlyWatched=Recently watched
search.results=KẾT QUẢ TÌM KIẾM
search.keyword=từ khóa:
search.noResults=Không tìm thấy kênh phù hợp với từ khóa
search.watch=XEM
search.watched=Watched

# --- SETTINGS TAB (CÀI ĐẶT) ---
settings.title=CÀI ĐẶT
settings.save=LƯU CÀI ĐẶT
settings.cancel=HỦY
settings.resetDefault=KHÔI PHÚC MẶC ĐỊNH
settings.giveFeedback=Góp ý giao diện
settings.section.appearance=GIAO DIỆN VÀ TÙY BIẾN
settings.disablePanorama=Disable panorama
settings.disablePanorama.desc=Đổi nền ứng dụng thành màu xám tối thay vì nền không gian.
settings.lockPanorama=Lock panorama scroll
settings.lockPanorama.desc=Khóa nền không gian đứng yên thay vì quay.
settings.panoramaSpeed=Panorama scroll speed
settings.panoramaSpeed.desc=Tùy chỉnh độ quay nền không gian nhanh hay chậm.
settings.section.account=TÀI KHOẢN & THÔNG BÁO
settings.signIn=Sign in with Vplay account
settings.signIn.desc=Experience all the best things of Vplay with an official account.
settings.signInBtn=Sign in
settings.username=Tên người dùng
settings.notifications=Thông báo sự kiện thể thao trực tiếp
settings.notifications.desc=Nhận thông báo khi có trận đấu hot hoặc chương trình đặc sắc.
settings.section.playback=TRÌNH CHIẾU & ÂM THANH
settings.soundVolume=Âm lượng âm thanh ứng dụng
settings.subtitles=Phụ đề tự động
settings.autoPlay=Tự động phát kênh tiếp theo

# --- COMMON BUTTONS, TOGGLES & SLIDERS ---
btn.ok=OK
btn.cancel=Cancel
btn.save=Save
btn.close=Close
btn.apply=Apply
btn.reset=Reset
btn.back=Back
btn.next=Next
toggle.on=BẬT
toggle.off=TẮT
slider.volume=Âm lượng
slider.speed=Tốc độ quay Panorama

# --- JSON UI DESIGN SYSTEM VIEWER ---
design.preview.title=WELCOME TO A DESIGN PREVIEW
design.preview.desc=Bạn đang được trải nghiệm hệ thống giao diện mới của Vplay, lấy cảm hứng từ Minecraft Bedrock JSON UI. Chúng tôi rất muốn nghe ý kiến của bạn.

# --- FOOTER & MISC ---
app.footer=Vplay TV © 2026 - JSON UI Minecraft Edition
app.debugAlert=Vplay Debug Mode is Active!
`;

interface LanguageContextType {
  langRawContent: string;
  langMap: Record<string, string>;
  setLangRawContent: (content: string) => void;
  updateLangKey: (key: string, value: string) => void;
  resetToDefaultLang: () => void;
  t: (key: string, fallback?: string) => string;
  isDebugModalOpen: boolean;
  setIsDebugModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vplay_lang_file_content';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langRawContent, setLangRawContentState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && saved.trim().length > 0) {
        return saved;
      }
    } catch (e) {
      console.error('Error loading language file from localStorage', e);
    }
    return DEFAULT_VPLAY_LANG;
  });

  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  // Parse .lang raw text into key-value map
  const langMap = useMemo(() => {
    const map: Record<string, string> = {};
    const lines = langRawContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
        continue;
      }
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex).trim();
        const value = line.substring(eqIndex + 1);
        if (key) {
          map[key] = value;
        }
      }
    }
    return map;
  }, [langRawContent]);

  const setLangRawContent = (content: string) => {
    setLangRawContentState(content);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
    } catch (e) {
      console.error('Error saving language file to localStorage', e);
    }
  };

  const updateLangKey = (key: string, value: string) => {
    // Check if key already exists in raw content, replace or append
    const lines = langRawContent.split('\n');
    let keyFound = false;
    const newLines = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//')) {
        const eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
          const k = line.substring(0, eqIndex).trim();
          if (k === key) {
            keyFound = true;
            return `${key}=${value}`;
          }
        }
      }
      return line;
    });

    if (!keyFound) {
      newLines.push(`${key}=${value}`);
    }

    const newContent = newLines.join('\n');
    setLangRawContent(newContent);
  };

  const resetToDefaultLang = () => {
    setLangRawContent(DEFAULT_VPLAY_LANG);
  };

  // Translation function t(key, fallback)
  const t = (key: string, fallback?: string): string => {
    if (Object.prototype.hasOwnProperty.call(langMap, key)) {
      return langMap[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        langRawContent,
        langMap,
        setLangRawContent,
        updateLangKey,
        resetToDefaultLang,
        t,
        isDebugModalOpen,
        setIsDebugModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};
