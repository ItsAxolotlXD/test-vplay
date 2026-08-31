import { CHANNELS_DATA } from "../data/channels";
import { NEWS_DATA } from "../data/news";
import { Channel, NewsArticle } from "../types";

export interface SearchItem {
  id: string;
  category: 'channel' | 'news' | 'toolbox' | 'vapp' | 'vpremium' | 'settings' | 'help' | 'about' | 'favorites' | 'copilot';
  categoryLabel: string;
  title: string;
  subtitle?: string;
  badge?: string;
  actionRoute?: string;
  actionState?: any;
  channelData?: Channel;
  newsData?: NewsArticle;
}

export interface SearchCategoryGroup {
  category: string;
  icon: string;
  items: SearchItem[];
}

export interface CommandResult {
  handled: boolean;
  replyText: string;
  foundChannels?: Channel[];
  searchCategoryResults?: SearchCategoryGroup[];
  isBetArena?: boolean;
  betGame?: 'baucua' | 'latxu' | 'danhbai' | 'xucxac';
  betAmount?: number;
  action?: {
    type: 'navigate' | 'theme' | 'navigation' | 'channel' | 'bet_arena';
    payload?: any;
  };
}

// 1. Static dataset: Toolbox
export const TOOLBOX_DATA = [
  {
    id: "tool-multiview",
    title: "Multiview Grid (Xem nhiều kênh cùng lúc)",
    subtitle: "Mở 4 luồng truyền hình song song và điều khiển độc lập",
    badge: "Live Tool",
    route: "/live-tv"
  },
  {
    id: "tool-custom-m3u8",
    title: "Thêm luồng ngoài M3U8",
    subtitle: "Dán liên kết luồng m3u8 của riêng bạn để phát trực tiếp",
    badge: "M3U8 Tool",
    route: "/live-tv"
  },
  {
    id: "tool-plugin-store",
    title: "Cửa hàng Tiện ích (Plugin Store)",
    subtitle: "Cài đặt các tiện ích mở rộng và addon tính năng cho Vplay",
    badge: "Tiện ích",
    route: "/settings"
  },
  {
    id: "tool-safe-area",
    title: "Đo tỷ lệ màn hình & Safe Area",
    subtitle: "Căn chỉnh vùng an toàn chuẩn phát sóng 16:9 và 4:3",
    badge: "Kỹ thuật",
    route: "/toolbox"
  },
  {
    id: "tool-m3u-export",
    title: "Nhập & Xuất Playlist M3U",
    subtitle: "Sao lưu và đồng bộ danh sách kênh truyền hình tùy chỉnh",
    badge: "Dữ liệu",
    route: "/toolbox"
  },
  {
    id: "tool-mc-container",
    title: "Emulate Minecraft Container GUI",
    subtitle: "Mô phỏng rương & kho đồ Minecraft, quản lý và sắp xếp item tương tác",
    badge: "Minecraft Tool",
    route: "/toolbox",
    routeState: { tab: "mc-container" }
  }
];

// 2. Static dataset: Space 360 (renamed from V-Apps)
export const SPACE360_DATA = [
  {
    id: "v_arcade",
    title: "V-Arcade: 5 Trò Chơi Ore UI",
    subtitle: "Caro XO, Oẳn Tù Tì, Nối Từ Tiếng Việt, Đếm Số, Rắn Săn Mồi",
    badge: "Hot • 5 Trò",
    route: "/v-space",
    appId: "v_arcade",
    category: "games"
  },
  {
    id: "v_notes",
    title: "V-Notes: Sổ Tay & Sticky Notes",
    subtitle: "Ghi chú nhanh lịch phát sóng, bài viết và sticker màu sắc",
    badge: "Ghi chú",
    route: "/v-space",
    appId: "v_notes",
    category: "productivity"
  },
  {
    id: "v_calc",
    title: "V-Calc: Máy Tính Biểu Thức",
    subtitle: "Máy tính khoa học, chuyển đổi đơn vị đo lường và lịch sử tính",
    badge: "Máy tính",
    route: "/v-space",
    appId: "v_calc",
    category: "utilities"
  },
  {
    id: "v_learn",
    title: "V-Study: Học Tập & Pomodoro",
    subtitle: "Flashcard từ vựng tiếng Anh, Pomodoro tập trung và câu hỏi trắc nghiệm",
    badge: "Học tập",
    route: "/v-space",
    appId: "v_learn",
    category: "learning"
  },
  {
    id: "v_xplore",
    title: "V-Files: File Explorer Ore UI",
    subtitle: "Quản lý tệp, xem trước media và sao lưu playlist M3U8",
    badge: "Tệp tin",
    route: "/v-space",
    appId: "v_xplore",
    category: "utilities"
  },
  {
    id: "explore_vietnam",
    title: "Khám Phá Việt Nam (Explore VN)",
    subtitle: "Bản đồ tương tác di sản văn hóa, ẩm thực & danh lam 63 tỉnh",
    badge: "Du lịch",
    route: "/v-space",
    appId: "explore_vietnam",
    category: "learning"
  },
  {
    id: "v_box",
    title: "V-Box: Kho Video & Giải Trí",
    subtitle: "Bộ sưu tập video đặc sắc, các clip phát lại và giải trí chọn lọc",
    badge: "Video",
    route: "/v-space",
    appId: "v_box",
    category: "media"
  },
  {
    id: "v_reminders",
    title: "V-Reminders: Hẹn Giờ & Nhắc Việc",
    subtitle: "Lên lịch nhắc nhở xem chương trình TV và công việc có âm thanh",
    badge: "Nhắc việc",
    route: "/v-space",
    appId: "v_reminders",
    category: "productivity"
  },
  {
    id: "v_furniture",
    title: "V-Furniture: Thiết Kế Không Gian 3D",
    subtitle: "Bài trí phòng khách xem TV và trải nghiệm không gian 3D",
    badge: "Nội thất",
    route: "/v-space",
    appId: "v_furniture",
    category: "utilities"
  },
  {
    id: "v_books",
    title: "V-Books: Kho Sách & Tài Liệu",
    subtitle: "Đọc sách điện tử, tài liệu giáo trình và tiểu thuyết phong phú",
    badge: "Đọc sách",
    route: "/v-space",
    appId: "v_books",
    category: "learning"
  },
  {
    id: "v_bank",
    title: "V-Bank: Ví Điện Tử & Điểm Thưởng",
    subtitle: "Quản lý điểm V-Coins, nạp rút và thanh toán dịch vụ Waves",
    badge: "Ví điểm",
    route: "/v-space",
    appId: "v_bank",
    category: "utilities"
  },
  {
    id: "v_office",
    title: "V-Office: Soạn Thảo Văn Bản",
    subtitle: "Trình biên tập tài liệu và xuất file tiện lợi phong cách Office",
    badge: "Văn phòng",
    route: "/v-space",
    appId: "v_office",
    category: "productivity"
  },
  {
    id: "v_recorder",
    title: "V-Recorder: Máy Ghi Âm Trực Tuyến",
    subtitle: "Thu âm giọng nói và quản lý bản ghi âm ngay trên trình duyệt",
    badge: "Ghi âm",
    route: "/v-space",
    appId: "v_recorder",
    category: "utilities"
  }
];

// 3. Static dataset: V-Premium
export const VPREMIUM_DATA = [
  {
    id: "vbank",
    title: "V-Bank: Ví Điện Tử & Điểm Ore",
    subtitle: "Nạp rút điểm thưởng Ore, quét mã QR và quản lý số dư",
    badge: "Ví Điện Tử",
    route: "/v-premium",
    subTab: "vbank"
  },
  {
    id: "storage-50gb",
    title: "V-Cloud Storage: Gói 50 GB",
    subtitle: "Lưu trữ 50+ playlist M3U8 và đồng bộ dữ liệu cá nhân",
    badge: "19.000đ/tháng",
    route: "/v-premium",
    subTab: "storage"
  },
  {
    id: "storage-200gb",
    title: "V-Cloud Storage: Gói 200 GB",
    subtitle: "Ghi lại luồng truyền hình 1080p và lưu trữ media tốc độ cao",
    badge: "69.000đ/tháng",
    route: "/v-premium",
    subTab: "storage"
  },
  {
    id: "storage-2tb",
    title: "V-Cloud Storage: Gói 2 TB",
    subtitle: "Dung lượng đám mây không giới hạn cho kho lưu trữ truyền hình 4K",
    badge: "VIP Cloud",
    route: "/v-premium",
    subTab: "storage"
  },
  {
    id: "verified",
    title: "Waves Verified: Huy Hiệu Tích Xanh VIP",
    subtitle: "Xác thực tài khoản chính chủ và ưu tiên băng thông truyền hình",
    badge: "Tích Xanh",
    route: "/v-premium",
    subTab: "verified"
  }
];

// 4. Static dataset: Settings
export const SETTINGS_DATA = [
  {
    id: "set-appearance",
    title: "Cài đặt Giao diện (Sáng / Tối)",
    subtitle: "Chuyển đổi Light Mode / Dark Mode và tùy biến giao diện",
    badge: "Giao diện",
    route: "/settings"
  },
  {
    id: "set-dock-sidebar",
    title: "Chuyển Dock sang Sidebar",
    subtitle: "Tùy biến vị trí thanh điều hướng dưới cùng sang bên trái",
    badge: "Điều hướng",
    route: "/settings"
  },
  {
    id: "set-font-scale",
    title: "Cỡ chữ ứng dụng",
    subtitle: "Điều chỉnh tỷ lệ phóng to thu nhỏ văn bản toàn hệ thống",
    badge: "Hiển thị",
    route: "/settings"
  },
  {
    id: "set-accessibility",
    title: "Trợ năng & Tự động trượt Banner",
    subtitle: "Bật tắt hiệu ứng tự động trượt hình và tự động ẩn Sidebar",
    badge: "Trợ năng",
    route: "/settings"
  },
  {
    id: "set-copilot",
    title: "Cài đặt Copilot for Vplay",
    subtitle: "Quản lý hợp nhất tìm kiếm Spotlight và gợi ý lệnh Slash Commands",
    badge: "Copilot",
    route: "/settings"
  },
  {
    id: "set-search",
    title: "Cài đặt Tìm kiếm Spotlight",
    subtitle: "Tùy chỉnh các danh mục kết quả hiển thị khi tìm kiếm",
    badge: "Tìm kiếm",
    route: "/settings"
  }
];

// 5. Static dataset: Help
export const HELP_DATA = [
  {
    id: "help-shortcuts",
    title: "Phím tắt bàn phím (Keyboard Shortcuts)",
    subtitle: "⌘K/Ctrl+K mở tìm kiếm, ⌘B thu gọn Sidebar, 1-9 chuyển kênh nhanh, Esc đóng modal",
    badge: "Phím tắt",
    route: "/settings"
  },
  {
    id: "help-multiview",
    title: "Hướng dẫn xem Multiview 4 màn hình",
    subtitle: "Cách thêm cùng lúc 4 luồng kênh thể thao/tin tức và điều khiển âm thanh độc lập",
    badge: "Hướng dẫn",
    route: "/live-tv"
  },
  {
    id: "help-m3u8",
    title: "Cách nhập Playlist M3U8 tùy chỉnh",
    subtitle: "Dán liên kết luồng m3u8 hoặc tải lên tệp .m3u để xem truyền hình cá nhân",
    badge: "Hướng dẫn",
    route: "/live-tv"
  },
  {
    id: "help-copilot",
    title: "Hướng dẫn sử dụng Copilot for Vplay",
    subtitle: "Cách dùng lệnh /search <từ khóa> filter <loại>, /mode, /navigation, /subscribe",
    badge: "Copilot",
    route: "/copilot"
  },
  {
    id: "help-favorites",
    title: "Cách lưu kênh yêu thích (Favorites)",
    subtitle: "Nhấn biểu tượng trái tim để ghim kênh vào danh sách xem nhanh ưu tiên",
    badge: "Mẹo hay",
    route: "/favorites"
  }
];

// 6. Static dataset: About
export const ABOUT_DATA = [
  {
    id: "about-vplay",
    title: "Vplay Television & Media Platform",
    subtitle: "Nền tảng truyền hình trực tuyến thế hệ mới, tích hợp AI Copilot & Space 360",
    badge: "Phiên bản 2026.8",
    route: "/about"
  },
  {
    id: "about-tech",
    title: "Kiến trúc công nghệ & Hiệu năng",
    subtitle: "Xây dựng trên React 18, Tailwind CSS, Motion Animations và HLS Video Stream Engine",
    badge: "Công nghệ",
    route: "/about"
  },
  {
    id: "about-license",
    title: "Bản quyền & Chuẩn phát sóng DVB-T2 / OTT",
    subtitle: "Chuẩn hình ảnh FHD/4K tốc độ cao, tương thích đa thiết bị di động & máy tính",
    badge: "Pháp lý",
    route: "/about"
  },
  {
    id: "about-team",
    title: "Đội ngũ phát triển Vplay Team",
    subtitle: "Sản phẩm được thiết kế và hoàn thiện bởi các kỹ sư công nghệ truyền hình",
    badge: "Tác giả",
    route: "/about"
  }
];

/**
 * Parses /search command to extract keyword and optional filter
 * Example formats:
 * - /search vtv3 filter tv
 * - /search bóng đá filter: news
 * - /search chào bạn filter copilot
 * - /search caro filter space360
 * - /search vbank filter premium
 * - /search htv filter favorites
 * - /search multiview filter toolbox
 * - /search phím tắt filter help
 * - /search vplay filter about
 * - /search tối filter settings
 */
export function parseSearchFilter(rawArgs: string): { keyword: string; filter: string | null } {
  const trimmed = rawArgs.trim();
  if (!trimmed) return { keyword: "", filter: null };

  // Check for regex matching: (keyword) [filter|filter:|filter=|-filter] (filter_value)
  const filterPattern = /^(.*?)\s+(?:filter:|filter=|-filter|filter)\s+([a-zA-Z0-9_-]+)$/i;
  const match = trimmed.match(filterPattern);

  if (match) {
    const keyword = match[1].trim();
    const filter = match[2].trim().toLowerCase();
    return { keyword, filter };
  }

  // Check for leading filter: filter:tv (keyword) or filter tv (keyword)
  const leadingPattern = /^(?:filter:|filter=|-filter|filter)\s+([a-zA-Z0-9_-]+)\s+(.*)$/i;
  const leadingMatch = trimmed.match(leadingPattern);
  if (leadingMatch) {
    const filter = leadingMatch[1].trim().toLowerCase();
    const keyword = leadingMatch[2].trim();
    return { keyword, filter };
  }

  return { keyword: trimmed, filter: null };
}

export const processCopilotCommand = (
  input: string,
  channels: Channel[] = CHANNELS_DATA
): CommandResult => {
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) {
    return { handled: false, replyText: "" };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const rawArgs = parts.slice(1).join(" ").trim();

  // 1. /search <keyword> [filter <filter_type>]
  if (command === "/search" || command === "/spolight-search" || command === "/spotlight-search") {
    if (!rawArgs) {
      return {
        handled: true,
        replyText: `🔍 **Spotlight Search trong Copilot for Vplay**
Cú pháp tìm kiếm:
- \`/search <từ khóa>\` : Tìm kiếm trên tất cả danh mục
- \`/search <từ khóa> filter <loại>\` : Lọc chính xác theo danh mục

**Các bộ lọc hỗ trợ:**
- \`tv\` : Kênh truyền hình
- \`news\` : Tin tức
- \`copilot\` : Lịch sử trò chuyện với AI
- \`space360\` : Ứng dụng & Game Space 360
- \`premium\` : Gói cước Waves Premium, V-Bank
- \`favorites\` : Kênh yêu thích
- \`toolbox\` : Công cụ & Tiện ích kỹ thuật
- \`help\` : Hướng dẫn sử dụng & Phím tắt
- \`about\` : Thông tin về ứng dụng Vplay
- \`settings\` : Cài đặt hệ thống

*Ví dụ:* \`/search vtv3 filter tv\`, \`/search bóng đá filter news\`, \`/search caro filter space360\`, \`/search chào bạn filter copilot\``
      };
    }

    const { keyword, filter } = parseSearchFilter(rawArgs);
    const q = keyword.toLowerCase();

    // Get favorite IDs from localStorage
    let favoriteIds: string[] = [];
    try {
      const favStored = localStorage.getItem("waves_favorites");
      if (favStored) favoriteIds = JSON.parse(favStored);
    } catch {}

    // Get Copilot Chat History from localStorage
    let copilotHistoryItems: { role: string; text: string; sessionTitle?: string }[] = [];
    try {
      // Check multi-session storage
      const sessionsStored = localStorage.getItem("copilot_chat_sessions");
      if (sessionsStored) {
        const sessions = JSON.parse(sessionsStored);
        if (Array.isArray(sessions)) {
          sessions.forEach((s: any) => {
            if (Array.isArray(s.messages)) {
              s.messages.forEach((m: any) => {
                copilotHistoryItems.push({
                  role: m.role,
                  text: m.text,
                  sessionTitle: s.title || "Hội thoại"
                });
              });
            }
          });
        }
      }
      // Check legacy single-array history
      const legacyHistory = localStorage.getItem("copilot_history");
      if (legacyHistory) {
        const parsedLegacy = JSON.parse(legacyHistory);
        if (Array.isArray(parsedLegacy)) {
          parsedLegacy.forEach((m: any) => {
            copilotHistoryItems.push({
              role: m.role,
              text: m.text,
              sessionTitle: "Đoạn chat hiện tại"
            });
          });
        }
      }
    } catch {}

    // 1. Matched Channels
    const matchedChannels = channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.channelNumber && c.channelNumber.includes(q)) ||
        (c.currentProgram?.title && c.currentProgram.title.toLowerCase().includes(q))
    );

    // 2. Matched News
    const matchedNews = NEWS_DATA.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.subtitle && n.subtitle.toLowerCase().includes(q)) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
    );

    // 3. Matched Space 360 (V-Apps)
    const matchedSpace360 = SPACE360_DATA.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.subtitle.toLowerCase().includes(q) ||
        v.badge.toLowerCase().includes(q)
    );

    // 4. Matched V-Premium
    const matchedVPremium = VPREMIUM_DATA.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q)
    );

    // 5. Matched Favorites
    const matchedFavorites = channels
      .filter((c) => favoriteIds.includes(c.id))
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName?.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.channelNumber && c.channelNumber.includes(q))
      );

    // 6. Matched Toolbox
    const matchedToolbox = TOOLBOX_DATA.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q)
    );

    // 7. Matched Settings
    const matchedSettings = SETTINGS_DATA.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q)
    );

    // 8. Matched Help
    const matchedHelp = HELP_DATA.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.subtitle.toLowerCase().includes(q) ||
        h.badge.toLowerCase().includes(q)
    );

    // 9. Matched About
    const matchedAbout = ABOUT_DATA.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.badge.toLowerCase().includes(q)
    );

    // 10. Matched Copilot History
    const matchedCopilotHistory = copilotHistoryItems.filter((item) =>
      item.text.toLowerCase().includes(q)
    );

    // Apply Filter Rules
    const searchCategoryResults: SearchCategoryGroup[] = [];

    const isFilterMatch = (catKey: string) => {
      if (!filter) return true;
      if (filter === "tv" || filter === "channel" || filter === "channels") return catKey === "tv";
      if (filter === "news" || filter === "tintuc") return catKey === "news";
      if (filter === "copilot" || filter === "history" || filter === "chat") return catKey === "copilot";
      if (filter === "space360" || filter === "space" || filter === "vapp" || filter === "vapps" || filter === "vspace") return catKey === "space360";
      if (filter === "premium" || filter === "vpremium" || filter === "vip") return catKey === "premium";
      if (filter === "favorites" || filter === "favorite" || filter === "yeuthich" || filter === "fav") return catKey === "favorites";
      if (filter === "toolbox" || filter === "tools" || filter === "tool") return catKey === "toolbox";
      if (filter === "help" || filter === "trogiup" || filter === "guide") return catKey === "help";
      if (filter === "about" || filter === "info" || filter === "gioithieu") return catKey === "about";
      if (filter === "settings" || filter === "setting" || filter === "caidat") return catKey === "settings";
      return true;
    };

    // 1. TV Channels
    if (isFilterMatch("tv") && matchedChannels.length > 0) {
      searchCategoryResults.push({
        category: "Truyền hình",
        icon: "Tv",
        items: matchedChannels.map((ch) => ({
          id: ch.id,
          category: 'channel' as const,
          categoryLabel: 'Truyền hình',
          title: ch.name,
          subtitle: ch.currentProgram ? `Đang phát: ${ch.currentProgram.title}` : (ch.group || ch.category),
          badge: ch.channelNumber ? `#${ch.channelNumber}` : ch.category,
          actionRoute: `/live-tv?channel=${ch.slug}`,
          channelData: ch
        }))
      });
    }

    // 2. News
    if (isFilterMatch("news") && matchedNews.length > 0) {
      searchCategoryResults.push({
        category: "Tin tức",
        icon: "Newspaper",
        items: matchedNews.map((n) => ({
          id: n.id,
          category: 'news' as const,
          categoryLabel: 'Tin tức',
          title: n.title,
          subtitle: n.subtitle || n.excerpt,
          badge: n.category,
          actionRoute: `/news/${n.slug}`,
          newsData: n
        }))
      });
    }

    // 3. Space 360
    if (isFilterMatch("space360") && matchedSpace360.length > 0) {
      searchCategoryResults.push({
        category: "Space 360 & Trò chơi",
        icon: "Gamepad2",
        items: matchedSpace360.map((v) => ({
          id: v.id,
          category: 'vapp' as const,
          categoryLabel: 'Space 360',
          title: v.title,
          subtitle: v.subtitle,
          badge: v.badge,
          actionRoute: v.route,
          actionState: { appId: v.appId }
        }))
      });
    }

    // 4. Copilot Chat History
    if (isFilterMatch("copilot") && matchedCopilotHistory.length > 0) {
      searchCategoryResults.push({
        category: "Lịch sử Copilot Chat",
        icon: "Bot",
        items: matchedCopilotHistory.slice(0, 8).map((msg, idx) => ({
          id: `copilot-msg-${idx}`,
          category: 'copilot' as const,
          categoryLabel: 'Lịch sử chat',
          title: `${msg.role === 'user' ? '👤 Bạn:' : '🤖 Copilot:'} ${msg.text.slice(0, 60)}${msg.text.length > 60 ? '...' : ''}`,
          subtitle: `Phiên: ${msg.sessionTitle || 'Hội thoại'}`,
          badge: msg.role === 'user' ? 'User' : 'AI Copilot',
          actionRoute: "/copilot"
        }))
      });
    }

    // 5. Favorites
    if (isFilterMatch("favorites") && matchedFavorites.length > 0) {
      searchCategoryResults.push({
        category: "Kênh yêu thích",
        icon: "Heart",
        items: matchedFavorites.map((ch) => ({
          id: `fav-${ch.id}`,
          category: 'favorites' as const,
          categoryLabel: 'Yêu thích',
          title: ch.name,
          subtitle: `Đã lưu vào danh sách yêu thích • ${ch.category}`,
          badge: "Yêu thích",
          actionRoute: `/live-tv?channel=${ch.slug}`,
          channelData: ch
        }))
      });
    }

    // 6. V-Premium
    if (isFilterMatch("premium") && matchedVPremium.length > 0) {
      searchCategoryResults.push({
        category: "Waves Premium & V-Cloud",
        icon: "Crown",
        items: matchedVPremium.map((p) => ({
          id: p.id,
          category: 'vpremium' as const,
          categoryLabel: 'Waves Premium',
          title: p.title,
          subtitle: p.subtitle,
          badge: p.badge,
          actionRoute: p.route,
          actionState: { subTab: p.subTab }
        }))
      });
    }

    // 7. Toolbox
    if (isFilterMatch("toolbox") && matchedToolbox.length > 0) {
      searchCategoryResults.push({
        category: "Toolbox & Kỹ thuật",
        icon: "Wrench",
        items: matchedToolbox.map((t) => ({
          id: t.id,
          category: 'toolbox' as const,
          categoryLabel: 'Toolbox',
          title: t.title,
          subtitle: t.subtitle,
          badge: t.badge,
          actionRoute: t.route
        }))
      });
    }

    // 8. Help & Guides
    if (isFilterMatch("help") && matchedHelp.length > 0) {
      searchCategoryResults.push({
        category: "Trợ giúp & Hướng dẫn",
        icon: "HelpCircle",
        items: matchedHelp.map((h) => ({
          id: h.id,
          category: 'help' as const,
          categoryLabel: 'Trợ giúp',
          title: h.title,
          subtitle: h.subtitle,
          badge: h.badge,
          actionRoute: h.route
        }))
      });
    }

    // 9. About Vplay
    if (isFilterMatch("about") && matchedAbout.length > 0) {
      searchCategoryResults.push({
        category: "Thông tin về Vplay",
        icon: "Info",
        items: matchedAbout.map((a) => ({
          id: a.id,
          category: 'about' as const,
          categoryLabel: 'Vplay',
          title: a.title,
          subtitle: a.subtitle,
          badge: a.badge,
          actionRoute: a.route
        }))
      });
    }

    // 10. Settings
    if (isFilterMatch("settings") && matchedSettings.length > 0) {
      searchCategoryResults.push({
        category: "Cài đặt hệ thống",
        icon: "Settings",
        items: matchedSettings.map((s) => ({
          id: s.id,
          category: 'settings' as const,
          categoryLabel: 'Cài đặt',
          title: s.title,
          subtitle: s.subtitle,
          badge: s.badge,
          actionRoute: s.route
        }))
      });
    }

    const totalMatches = searchCategoryResults.reduce((acc, g) => acc + g.items.length, 0);

    if (totalMatches === 0) {
      return {
        handled: true,
        replyText: `🔍 **Spotlight Search:** Không tìm thấy kết quả nào cho từ khóa "**${keyword}**"${filter ? ` với bộ lọc **filter: ${filter}**` : ''}.\n\nBạn có thể thử:
- Bỏ bộ lọc để tìm trên toàn bộ hệ thống: \`/search ${keyword}\`
- Các bộ lọc có sẵn: \`tv\`, \`news\`, \`copilot\`, \`space360\`, \`premium\`, \`favorites\`, \`toolbox\`, \`help\`, \`about\`, \`settings\``
      };
    }

    // Build Markdown Text
    let reply = `🔍 **Kết quả tìm kiếm cho "${keyword}"${filter ? ` [Filter: ${filter}]` : ''} (${totalMatches} mục):**\n\n`;

    searchCategoryResults.forEach((group) => {
      reply += `### ${group.category} (${group.items.length})\n`;
      group.items.forEach((item) => {
        reply += `- **${item.title}** ${item.badge ? `\`${item.badge}\`` : ''}${item.subtitle ? ` — *${item.subtitle}*` : ''}\n`;
      });
      reply += `\n`;
    });

    if (matchedChannels.length > 0 && isFilterMatch("tv")) {
      const topCh = matchedChannels[0];
      reply += `[COMMAND: SWITCH_CHANNEL: ${topCh.id}]`;
    }

    return {
      handled: true,
      replyText: reply,
      foundChannels: matchedChannels,
      searchCategoryResults
    };
  }

  // 2. /mode <light/dark>
  if (command === "/mode") {
    const targetMode = rawArgs.toLowerCase();
    const isLight = targetMode.includes("light") || targetMode.includes("sáng");
    const isDark = targetMode.includes("dark") || targetMode.includes("tối");

    if (!isLight && !isDark) {
      return {
        handled: true,
        replyText: `🌓 **Lệnh thay đổi giao diện:**
Cú pháp:
- \`/mode light\` : Chuyển sang giao diện Sáng
- \`/mode dark\` : Chuyển sang giao diện Tối`
      };
    }

    const newTheme: "light" | "dark" = isLight ? "light" : "dark";
    try {
      const saved = localStorage.getItem("waves_system_settings");
      const current = saved ? JSON.parse(saved) : {};
      const updated = { ...current, theme: newTheme };
      localStorage.setItem("waves_system_settings", JSON.stringify(updated));
      localStorage.setItem("waves_theme", newTheme);

      if (newTheme === "light") {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.remove("light-mode");
        document.documentElement.classList.add("dark");
      }
      window.dispatchEvent(new Event("waves_settings_change"));
    } catch (e) {
      console.error(e);
    }

    return {
      handled: true,
      replyText: `✨ **Copilot for Vplay** đã chuyển giao diện sang chế độ **${
        newTheme === "light" ? "Sáng (Light Mode)" : "Tối (Dark Mode)"
      }** thành công!`,
      action: {
        type: "theme",
        payload: newTheme
      }
    };
  }

  // 3. /navigation <dock/sidebar>
  if (command === "/navigation" || command === "/nav") {
    const navArg = rawArgs.toLowerCase();
    const isDock = navArg.includes("dock") || navArg.includes("dưới");
    const isSidebar = navArg.includes("sidebar") || navArg.includes("bên");

    if (!isDock && !isSidebar) {
      return {
        handled: true,
        replyText: `🧭 **Lệnh điều chỉnh thanh điều hướng:**
Cú pháp:
- \`/navigation dock\` : Sử dụng thanh Dock nổi phía dưới màn hình
- \`/navigation sidebar\` : Sử dụng thanh Sidebar bên cạnh màn hình`
      };
    }

    const dockToSidebar = isSidebar;
    try {
      const saved = localStorage.getItem("waves_system_settings");
      const current = saved ? JSON.parse(saved) : {};
      const updated = { ...current, dockToSidebar };
      localStorage.setItem("waves_system_settings", JSON.stringify(updated));
      window.dispatchEvent(new Event("waves_settings_change"));
    } catch (e) {
      console.error(e);
    }

    return {
      handled: true,
      replyText: `🧭 **Copilot for Vplay** đã chuyển thanh điều hướng sang: **${
        dockToSidebar ? "Thanh Sidebar (Cạnh bên)" : "Thanh Dock (Phía dưới)"
      }**!`,
      action: {
        type: "navigation",
        payload: dockToSidebar
      }
    };
  }

  // 4. /subscribe premium
  if (command === "/subscribe" || command === "/premium") {
    return {
      handled: true,
      replyText: `💎 **Waves Premium (V-Premium) & V-Cloud VIP**
Đang mở trang đăng ký gói Waves Premium cho bạn. Bạn sẽ nhận được:
- ☁️ Lưu trữ đám mây V-Cloud dung lượng cao (50GB - 2TB)
- 🚀 Mở khóa toàn bộ trò chơi & tiện ích Space 360
- 🛡️ Huy hiệu Waves Verified chính thức
- ⚡ Không gián đoạn phát sóng`,
      action: {
        type: "navigate",
        payload: "/v-premium"
      }
    };
  }

  // 5. /standalone or /page
  if (command === "/standalone" || command === "/page" || command === "/fullscreen") {
    return {
      handled: true,
      replyText: `🚀 **Mở giao diện Standalone Copilot:**
Đang chuyển bạn sang giao diện AI độc lập toàn màn hình...`,
      action: {
        type: "navigate",
        payload: "/copilot-standalone"
      }
    };
  }

  // 6. /space360, /vapps, /vapp, /caro, /notes, /calc
  if (
    command === "/space360" ||
    command === "/vspace" ||
    command === "/vapps" ||
    command === "/vapp" ||
    command === "/arcade" ||
    command === "/caro" ||
    command === "/notes" ||
    command === "/calc" ||
    command === "/files"
  ) {
    let targetAppId = "v_arcade";
    let appTitle = "V-Arcade: 5 Trò Chơi Ore UI";

    if (command === "/notes") {
      targetAppId = "v_notes";
      appTitle = "V-Notes: Sổ Tay & Ghi Chú";
    } else if (command === "/calc") {
      targetAppId = "v_calc";
      appTitle = "V-Calc: Máy Tính Biểu Thức";
    } else if (command === "/files") {
      targetAppId = "v_xplore";
      appTitle = "V-Files: Trình Quản Lý Tệp";
    } else if (rawArgs.trim()) {
      const match = SPACE360_DATA.find(
        (a) =>
          a.id.toLowerCase() === rawArgs.trim().toLowerCase() ||
          a.title.toLowerCase().includes(rawArgs.trim().toLowerCase())
      );
      if (match) {
        targetAppId = match.id;
        appTitle = match.title;
      }
    }

    return {
      handled: true,
      replyText: `🚀 **Không gian ứng dụng Space 360:**
Đang mở **${appTitle}** trực tiếp trong không gian Standalone Copilot...`,
      action: {
        type: "navigate",
        payload: "/v-space"
      }
    };
  }

  // 7. /cược, /cuoc, /bet, /baucua, /latxu, /danhbai, /xucxac
  if (
    command === "/cược" ||
    command === "/cuoc" ||
    command === "/bet" ||
    command === "/gamble" ||
    command === "/baucua" ||
    command === "/latxu" ||
    command === "/danhbai" ||
    command === "/xucxac" ||
    command === "/taixiu"
  ) {
    const rawLower = rawArgs.toLowerCase();
    let selectedGame: "baucua" | "latxu" | "danhbai" | "xucxac" = "baucua";
    let selectedAmount = 500;

    // Parse game type
    if (command === "/baucua" || rawLower.includes("baucua") || rawLower.includes("bầu") || rawLower.includes("cua")) {
      selectedGame = "baucua";
    } else if (command === "/latxu" || rawLower.includes("latxu") || rawLower.includes("xu") || rawLower.includes("coin") || rawLower.includes("flip")) {
      selectedGame = "latxu";
    } else if (command === "/danhbai" || rawLower.includes("danhbai") || rawLower.includes("bài") || rawLower.includes("bai") || rawLower.includes("card") || rawLower.includes("3cay")) {
      selectedGame = "danhbai";
    } else if (command === "/xucxac" || command === "/taixiu" || rawLower.includes("xucxac") || rawLower.includes("xúc") || rawLower.includes("tai") || rawLower.includes("xỉu") || rawLower.includes("dice")) {
      selectedGame = "xucxac";
    }

    // Parse amount if specified in args
    const amountMatch = rawArgs.match(/\b(\d+)\b/);
    if (amountMatch) {
      const parsedAmt = parseInt(amountMatch[1], 10);
      if (!isNaN(parsedAmt) && parsedAmt > 0) {
        selectedAmount = parsedAmt;
      }
    }

    const gameTitles: Record<string, string> = {
      baucua: "🦀 Bầu Cua Tôm Cá",
      latxu: "🪙 Lật Xu Sấp Ngửa",
      danhbai: "🎴 Đánh Bài 3 Cây PvP",
      xucxac: "🎲 Xúc Xắc Tài Xỉu"
    };

    return {
      handled: true,
      isBetArena: true,
      betGame: selectedGame,
      betAmount: selectedAmount,
      replyText: `🎰 **SỚI CƯỢC ORBS VIP • ĐẤU NGƯỜI CHƠI (PvP)**
Đã mở sàn cược **${gameTitles[selectedGame]}** cho bạn!

🎯 **Các trò chơi có sẵn:**
1. 🦀 **Bầu Cua Tôm Cá:** Đặt cược 6 linh vật (Nai, Bầu, Gà, Cá, Cua, Tôm), ăn x1, x2, x3 tùy số hột xuất hiện.
2. 🪙 **Lật Xu (Coin Flip):** Chọn Mặt Sấp (Kim Long) hoặc Mặt Ngửa (Hỏa Phụng), tỷ lệ thắng x1.98 Lần.
3. 🎴 **Đánh Bài (Bài Cào 3 Cây PvP):** So nút với người chơi online (0 - 9 nút, Ba Tây, Sáp x3 cược).
4. 🎲 **Xúc Xắc (Tài Xỉu):** Đặt cược Tài (11-17), Xỉu (4-10) hoặc Bão x30 lần.

👇 *Tương tác trực tiếp trên bảng cược dưới đây:*`,
      action: {
        type: "bet_arena",
        payload: {
          game: selectedGame,
          amount: selectedAmount
        }
      }
    };
  }

  // 8. /friends, /people, /users, /banbe
  if (
    command === "/friends" ||
    command === "/people" ||
    command === "/users" ||
    command === "/banbe" ||
    command === "/nguoidung"
  ) {
    return {
      handled: true,
      replyText: `👥 **CỘNG ĐỒNG VPLAY • BẠN BÈ & NGƯỜI DÙNG**
Đang mở trang danh sách **101+ Cư dân Vplay**.

✨ **Các tính năng trên tab Friends and People:**
- 🟢 Theo dõi trạng thái Online / Offline / Đang xem TV thời gian thực
- 📺 Bấm **Cùng xem** để xem chung kênh truyền hình đang phát
- 💬 Nhắn tin trực tiếp (DM) & trao đổi minigame
- 💎 **Tặng khoáng vật Orbs** cho bạn bè
- 🏆 **Bảng xếp hạng đại gia Orbs** toàn hệ thống Vplay

Đang chuyển hướng bạn sang giao diện Bạn bè & Người dùng...`,
      action: {
        type: "navigate",
        payload: "/friends"
      }
    };
  }

  // 9. /help or /commands
  if (command === "/help" || command === "/commands") {
    return {
      handled: true,
      replyText: `🤖 **Danh sách lệnh điều khiển của Copilot for Vplay:**
- \`/cược\` : Mở sới cược Orbs PvP (Bầu cua, Lật xu, Đánh bài, Xúc xắc)
- \`/cược baucua 1000\` : Vào ngay sới Bầu Cua mức cược 1.000 Orbs
- \`/cược latxu 500\` : Chơi Lật Xu Sấp / Ngửa
- \`/cược danhbai 2000\` : Đánh Bài Cào 3 Cây đấu PvP người chơi
- \`/cược xucxac 5000\` : Lắc Xúc Xắc Tài Xỉu
- \`/friends\` hoặc \`/people\` : Xem danh sách Bạn bè & Người dùng Vplay (100+ cư dân)
- \`/standalone\` : Mở Copilot dưới dạng ứng dụng độc lập toàn màn hình
- \`/space360\` hoặc \`/vapps\` : Khám phá kho ứng dụng & trò chơi Space 360
- \`/caro\` / \`/arcade\` : Chơi ngay 5 trò chơi Ore UI (Caro XO, Rắn săn mồi, Nối từ...)
- \`/notes\` : Mở sổ tay ghi chép nhanh V-Notes
- \`/calc\` : Mở máy tính khoa học V-Calc
- \`/search <từ khóa>\` : Tìm kiếm thông minh toàn hệ thống
- \`/search <từ khóa> filter <loại>\` : Tìm kiếm có lọc (tv, news, copilot, space360, premium, favorites, toolbox, help, about, settings)
- \`/mode <light/dark>\` : Đổi giao diện Sáng / Tối ngay lập tức
- \`/navigation <dock/sidebar>\` : Đổi kiểu thanh điều hướng (Dock / Sidebar)
- \`/subscribe premium\` : Mở trang đăng ký Waves Premium & V-Cloud VIP
- Hoặc bạn có thể gõ bất kỳ câu hỏi nào để trò chuyện cùng AI!`
    };
  }

  return { handled: false, replyText: "" };
};
