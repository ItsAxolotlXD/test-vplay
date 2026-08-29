import { CHANNELS_DATA } from "../data/channels";
import { NEWS_DATA } from "../data/news";
import { Channel } from "../types";

export interface CommandResult {
  handled: boolean;
  replyText: string;
  foundChannels?: Channel[];
  action?: {
    type: 'navigate' | 'theme' | 'navigation' | 'channel';
    payload?: any;
  };
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
  const args = parts.slice(1).join(" ").trim();

  // 1. /spolight-search or /spotlight-search <keyword>
  if (command === "/spolight-search" || command === "/spotlight-search") {
    if (!args) {
      return {
        handled: true,
        replyText: `🔍 **Spotlight Search trong Copilot for Vplay**
Vui lòng nhập từ khóa tìm kiếm.
*Ví dụ:* \`/spolight-search vtv3\` hoặc \`/spotlight-search bóng đá\``
      };
    }

    const q = args.toLowerCase();
    const matchedChannels = channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.currentProgram?.title.toLowerCase().includes(q)
    );

    const matchedNews = NEWS_DATA.filter(
      (n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );

    if (matchedChannels.length === 0 && matchedNews.length === 0) {
      return {
        handled: true,
        replyText: `🔍 **Spotlight Search:** Không tìm thấy kênh hoặc bài viết nào cho từ khóa "**${args}**". Bạn hãy thử tìm với tên kênh khác như *VTV1, VTV3, HTV7, THVL, Thể thao* nhé!`
      };
    }

    let reply = `🔍 **Kết quả Spotlight Search cho "${args}":**\n\n`;

    if (matchedChannels.length > 0) {
      reply += `📺 **Kênh truyền hình (${matchedChannels.length}):**\n`;
      matchedChannels.slice(0, 5).forEach((ch) => {
        reply += `• **${ch.name}** [${ch.category}] ${
          ch.currentProgram ? `— *Đang phát: ${ch.currentProgram.title}*` : ""
        }\n`;
      });
      // Pick first matched channel as switch command
      const topCh = matchedChannels[0];
      reply += `\n[COMMAND: SWITCH_CHANNEL: ${topCh.id}]`;
    }

    if (matchedNews.length > 0) {
      reply += `\n📰 **Tin tức liên quan (${matchedNews.length}):**\n`;
      matchedNews.slice(0, 3).forEach((n) => {
        reply += `• **${n.title}** (${n.category})\n`;
      });
    }

    return {
      handled: true,
      replyText: reply,
      foundChannels: matchedChannels
    };
  }

  // 2. /mode <light/dark>
  if (command === "/mode") {
    const targetMode = args.toLowerCase();
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
    const navArg = args.toLowerCase();
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
- 🚀 Mở khóa toàn bộ trò chơi & tiện ích V-Space
- 🛡️ Huy hiệu Waves Verified chính thức
- ⚡ Không gián đoạn phát sóng`,
      action: {
        type: "navigate",
        payload: "/v-premium"
      }
    };
  }

  // 5. /help or /commands
  if (command === "/help" || command === "/commands") {
    return {
      handled: true,
      replyText: `🤖 **Danh sách lệnh điều khiển của Copilot for Vplay:**
- \`/spolight-search <từ khóa>\` : Tìm kiếm thông minh kênh TV & tin tức
- \`/mode <light/dark>\` : Đổi giao diện Sáng / Tối ngay lập tức
- \`/navigation <dock/sidebar>\` : Đổi kiểu thanh điều hướng (Dock / Sidebar)
- \`/subscribe premium\` : Mở trang đăng ký Waves Premium & V-Cloud VIP
- Hoặc bạn có thể gõ bất kỳ câu hỏi nào để trò chuyện cùng AI!`
    };
  }

  return { handled: false, replyText: "" };
};
