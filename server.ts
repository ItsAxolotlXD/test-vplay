import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Load channels from JSON for searching grounding
let cachedChannels: any[] = [];
try {
  const channelsPath = path.join(process.cwd(), "src/data/channels.json");
  if (fs.existsSync(channelsPath)) {
    cachedChannels = JSON.parse(fs.readFileSync(channelsPath, "utf-8"));
  }
} catch (err) {
  console.error("Failed to load channels for Firesteel:", err);
}

// API endpoint for Firesteel
app.post("/api/vintelligence", async (req, res) => {
  try {
    const { messages, mode, userName, smartAction } = req.body; // messages: Array<{role: string, content: string}>, mode: 'chat' | 'search'
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    
    // Prepare channels context
    const channelsContext = cachedChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      group: ch.group
    }));
    
    const isSmartActionEnabled = smartAction !== false;
    const userIntro = userName ? `Người dùng hiện tại tên là "${userName}". Hãy xưng hô thân mật bằng cách gọi họ bằng tên "${userName}" khi thích hợp (ví dụ: "Chào anh/chị ${userName}", "Chào ${userName}", "Cảm ơn ${userName}").` : "Người dùng chưa thiết lập tên gọi cụ thể. Vui lòng xưng hô lịch sự, thân mật chung chung và không dùng tên riêng.";
    const actionRestriction = !isSmartActionEnabled ? "\nHành động thông minh (smart actions) ĐÃ BỊ TẮT bởi cài đặt của người dùng. Bạn TUYỆT ĐỐI không được thực hiện bất kỳ hành động tự động nào dưới đây (tức là luôn trả về đối tượng action là null)." : "";

    const systemInstruction = `Bạn là Firesteel, trợ lý trí tuệ nhân tạo đắc lực và thân thiện của Waves Community - ứng dụng xem truyền hình mượt mà chất lượng cao.
Nhiệm vụ của bạn là trò chuyện, tư vấn kênh truyền hình, giải đáp thắc mắc và tự động kích hoạt các thao tác hệ thống theo yêu cầu của người dùng.

${userIntro}

Dưới đây là danh sách các kênh truyền hình có trên Waves Community:
${JSON.stringify(channelsContext)}

HÃY PHẢN HỒI THEO ĐỊNH DẠNG JSON CÓ CẤU TRÚC NHƯ SAU:
{
  "reply": "Câu trả lời của bạn",
  "recommendedChannels": ["vtv1", "vtv3"],
  "action": {
    "type": "open_channel | switch_tab | open_settings",
    "target": "vtv1 | home | live | settings",
    "section": "profile | appearance | accessibility | experimental | design_system | plugin_store"
  }
}

HƯỚNG DẪN CHI TIẾT & QUY TẮC:
1. ĐỊNH DẠNG VĂN BẢN & EMOJI:
   - Hãy dùng định dạng Markdown phong phú (ví dụ: in đậm bằng **nội dung**, gạch đầu dòng, xuống dòng hợp lý) để làm nổi bật tên kênh, tên chức năng hoặc thông tin quan trọng.
   - Hãy lồng ghép nhiều biểu tượng cảm xúc (emoji) vui tươi, phù hợp ngữ cảnh (ví dụ: 📺, ⚽, 🍿, 🎵, ✨, ⚙️, 🚀, 😍, 😉) để câu trả lời thật đa dạng, sinh động và tràn đầy năng lượng!

2. ĐỀ XUẤT KÊNH (recommendedChannels):
   - Chứa mảng các "id" kênh phù hợp với nhu cầu của người dùng từ danh sách kênh ở trên. Nếu không có hoặc không cần đề xuất, hãy trả về mảng rỗng [].
   - Không tự bịa ra ID kênh không có trong danh sách.

3. HÀNH ĐỘNG HỆ THỐNG (action):${actionRestriction}
   - Bạn có thể điều khiển ứng dụng trực tiếp bằng cách trả về đối tượng "action". Nếu người dùng không yêu cầu bất kỳ hành động nào dưới đây, hãy đặt "action": null.
   - Khi người dùng muốn MỞ KÊNH, XEM KÊNH, BẬT KÊNH (ví dụ: "mở kênh vtv1 hd", "bật htv7", "cho tôi xem bóng đá trên vtchd"):
     + Hãy tìm kênh phù hợp nhất trong danh sách, đặt "action": { "type": "open_channel", "target": "<id_kenh_phu_hop>" }
     + Đưa id kênh đó vào mảng "recommendedChannels" luôn.
   - Khi người dùng muốn CHUYỂN TAB, ĐI TỚI TAB, VỀ TRANG CHỦ, MỞ TRANG CHỦ (ví dụ: "chuyển sang tab trực tiếp", "về trang chủ", "mở cài đặt", "đi tới trang live"):
     + Đặt "action": { "type": "switch_tab", "target": "home | live | settings" } (chọn 1 trong 3 tab thích hợp).
   - Khi người dùng muốn MỞ CÁC MỤC CÀI ĐẶT CỤ THỂ (ví dụ: "mở mục tài khoản", "cho tôi đổi giao diện", "mở cài đặt trợ năng", "mở phần thử nghiệm", "mở kho tiện ích", "mở cài đặt waves community refresh"):
     + Đặt "action": { "type": "open_settings", "section": "profile | appearance | accessibility | experimental | design_system | plugin_store" } (chọn section tương ứng).
     + Nếu họ muốn xem chung về cài đặt, hãy chuyển tab "settings" với action "switch_tab".

CHẾ ĐỘ HIỆN TẠI: Chế độ ${mode === 'search' ? 'Tìm kiếm thông minh (AI) - Ưu tiên tìm và đề xuất các kênh phù hợp nhất với yêu cầu' : 'Trò chuyện tâm sự - Thoải mái giao lưu, giải đáp thắc mắc và điều khiển app theo yêu cầu'}.`;

    // Map roles: 'user' -> 'user', 'assistant' or 'model' -> 'model'
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Use a direct REST fetch request to Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              reply: { type: "STRING" },
              recommendedChannels: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              action: {
                type: "OBJECT",
                properties: {
                  type: { type: "STRING" },
                  target: { type: "STRING" },
                  section: { type: "STRING" }
                }
              }
            },
            required: ["reply", "recommendedChannels"]
          }
        }
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      throw new Error(`Gemini API returned status ${apiResponse.status}: ${errText}`);
    }

    const data = await apiResponse.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Firesteel API Error:", error);
    res.status(500).json({ 
      error: "Không thể kết nối đến Firesteel. Vui lòng kiểm tra lại cấu hình API Key.",
      details: error.message 
    });
  }
});

// Helper function to parse Fandom Logopedia HTML with section-based image detection
function parseFandomHtml(html: string) {
  const sections: Array<{ heading: string; logos: Array<{ url: string; originalUrl: string; caption: string }> }> = [];
  
  // Clean comments
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  
  // Split the HTML into headings (h2, h3, h4)
  const headingRegex = /<h([234])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  const headingPositions: Array<{ index: number; tag: string; headingText: string; length: number }> = [];
  
  while ((match = headingRegex.exec(cleanHtml)) !== null) {
    const tag = match[1];
    const fullHeader = match[2];
    
    // Extract text from mw-headline if exists, or just strip HTML
    let headingText = "";
    const headlineMatch = /<span[^>]*class="mw-headline"[^>]*>([\s\S]*?)<\/span>/i.exec(fullHeader);
    if (headlineMatch) {
      headingText = headlineMatch[1];
    } else {
      headingText = fullHeader;
    }
    // Remove any HTML tags inside the heading
    headingText = headingText.replace(/<[^>]+>/g, "").trim();
    
    // Skip unhelpful headings like Navigation, Contents, References, etc.
    const lowerHeading = headingText.toLowerCase();
    if (
      lowerHeading === "contents" || 
      lowerHeading === "navigation" || 
      lowerHeading === "references" || 
      lowerHeading === "see also" ||
      lowerHeading === "gallery" ||
      lowerHeading === "external links"
    ) {
      continue;
    }
    
    headingPositions.push({
      index: match.index,
      tag,
      headingText: headingText,
      length: match[0].length
    });
  }
  
  // If we found headings, divide into sections and parse logos
  if (headingPositions.length > 0) {
    for (let i = 0; i < headingPositions.length; i++) {
      const current = headingPositions[i];
      const nextIndex = i + 1 < headingPositions.length ? headingPositions[i + 1].index : cleanHtml.length;
      const sectionHtml = cleanHtml.substring(current.index + current.length, nextIndex);
      
      const logos: Array<{ url: string; originalUrl: string; caption: string }> = [];
      
      // Method A: Check for official MediaWiki gallery boxes
      const itemRegex = /<(li|div)[^>]*(class="[^"]*gallerybox[^"]*"|class="[^"]*wikia-gallery-item[^"]*")[^>]*>([\s\S]*?)<\/\1>/gi;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(sectionHtml)) !== null) {
        const itemContent = itemMatch[3];
        const imgMatch = /<img[^>]+>/i.exec(itemContent);
        if (!imgMatch) continue;
        const imgTag = imgMatch[0];
        
        let url = "";
        const dataSrcMatch = /data-src="([^"]+)"/i.exec(imgTag);
        const srcMatch = /src="([^"]+)"/i.exec(imgTag);
        
        if (dataSrcMatch && dataSrcMatch[1] && !dataSrcMatch[1].includes("placeholder")) {
          url = dataSrcMatch[1];
        } else if (srcMatch && srcMatch[1]) {
          url = srcMatch[1];
        }
        
        if (!url) continue;
        url = url.replace(/&amp;/g, "&");
        const originalUrl = url
          .replace(/\/scale-to-width-down\/\d+/g, "")
          .replace(/\/thumbnail\/width\/\d+\/height\/\d+/g, "");
          
        let caption = "";
        const captionMatch = /<div[^>]+class="[^"]*(gallerytext|lightbox-caption|caption)[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(itemContent);
        if (captionMatch) {
          caption = captionMatch[2].replace(/<[^>]+>/g, "").trim();
        } else {
          caption = itemContent.replace(/<[^>]+>/g, "").trim();
        }
        
        caption = caption
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim();
          
        logos.push({ url, originalUrl, caption: caption || "Logo" });
      }
      
      // Method B: If no gallery elements in this section, scan for standard img tags that are Fandom assets (used in wikitables)
      if (logos.length === 0) {
        const imgRegex = /<img[^>]+>/gi;
        let imgTagMatch;
        while ((imgTagMatch = imgRegex.exec(sectionHtml)) !== null) {
          const imgTag = imgTagMatch[0];
          
          let url = "";
          const srcMatch = /src="([^"]+)"/i.exec(imgTag);
          const dataSrcMatch = /data-src="([^"]+)"/i.exec(imgTag);
          
          if (dataSrcMatch && dataSrcMatch[1] && !dataSrcMatch[1].includes("placeholder")) {
            url = dataSrcMatch[1];
          } else if (srcMatch && srcMatch[1]) {
            url = srcMatch[1];
          }
          
          if (!url) continue;
          if (!url.includes("static.wikia.nocookie.net") || url.includes("sprite") || url.includes("placeholder") || url.includes("window-icon")) {
            continue;
          }
          
          url = url.replace(/&amp;/g, "&");
          const originalUrl = url
            .replace(/\/scale-to-width-down\/\d+/g, "")
            .replace(/\/thumbnail\/width\/\d+\/height\/\d+/g, "");
            
          let caption = "";
          const altMatch = /alt="([^"]+)"/i.exec(imgTag);
          const titleAttrMatch = /title="([^"]+)"/i.exec(imgTag);
          const imgKeyMatch = /data-image-name="([^"]+)"/i.exec(imgTag);
          
          if (altMatch && altMatch[1] && !altMatch[1].startsWith("File:") && altMatch[1] !== "Logo") {
            caption = altMatch[1];
          } else if (titleAttrMatch && titleAttrMatch[1] && !titleAttrMatch[1].startsWith("File:")) {
            caption = titleAttrMatch[1];
          } else if (imgKeyMatch && imgKeyMatch[1]) {
            caption = imgKeyMatch[1].replace(/\.[^/.]+$/, "").replace(/_/g, " ");
          } else {
            caption = "Logo";
          }
          
          logos.push({ url, originalUrl, caption });
        }
      }
      
      if (logos.length > 0) {
        sections.push({
          heading: current.headingText,
          logos
        });
      }
    }
  }
  
  // Fallback if no sections or logos found at all
  if (sections.length === 0) {
    const logos: Array<{ url: string; originalUrl: string; caption: string }> = [];
    const imgRegex = /<img[^>]+>/gi;
    let imgTagMatch;
    while ((imgTagMatch = imgRegex.exec(cleanHtml)) !== null) {
      const imgTag = imgTagMatch[0];
      let url = "";
      const srcMatch = /src="([^"]+)"/i.exec(imgTag);
      const dataSrcMatch = /data-src="([^"]+)"/i.exec(imgTag);
      
      if (dataSrcMatch && dataSrcMatch[1] && !dataSrcMatch[1].includes("placeholder")) {
        url = dataSrcMatch[1];
      } else if (srcMatch && srcMatch[1]) {
        url = srcMatch[1];
      }
      
      if (!url) continue;
      if (!url.includes("static.wikia.nocookie.net") || url.includes("sprite") || url.includes("placeholder") || url.includes("window-icon")) {
        continue;
      }
      
      url = url.replace(/&amp;/g, "&");
      const originalUrl = url
        .replace(/\/scale-to-width-down\/\d+/g, "")
        .replace(/\/thumbnail\/width\/\d+\/height\/\d+/g, "");
      
      logos.push({
        url,
        originalUrl,
        caption: "Logo"
      });
    }
    
    if (logos.length > 0) {
      sections.push({
        heading: "Logo tìm thấy",
        logos
      });
    }
  }
  
  return sections;
}

// API endpoint for fetching and parsing Fandom Logos using MediaWiki Action API (bypasses Cloudflare)
app.post("/api/fandom-logos", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Vui lòng cung cấp đường link Fandom Logopedia" });
    }

    console.log(`Processing Fandom request: ${url}`);
    
    // Parse URL into language and pageName
    let lang = "en";
    let pageName = "";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      
      if (pathParts[0] === "vi" && pathParts[1] === "wiki") {
        lang = "vi";
        pageName = decodeURIComponent(pathParts[2]);
      } else if (pathParts[0] === "wiki") {
        lang = "en";
        pageName = decodeURIComponent(pathParts[1]);
      } else {
        // Fallback: use last segment of path as pageName if not matching exact /wiki/
        pageName = decodeURIComponent(pathParts[pathParts.length - 1] || "");
      }
    } catch (e) {
      // If not a full URL but just page name, we can guess page name directly
      pageName = url.trim();
    }

    if (!pageName) {
      return res.status(400).json({ error: "Không tìm thấy tên trang hợp lệ từ liên kết cung cấp." });
    }

    const apiUrl = lang === "vi" 
      ? `https://logos.fandom.com/vi/api.php` 
      : `https://logos.fandom.com/api.php`;

    const queryUrl = `${apiUrl}?action=parse&page=${encodeURIComponent(pageName)}&format=json&prop=text|images&redirects=1`;
    console.log(`Requesting Fandom API: ${queryUrl}`);

    const response = await fetch(queryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Fandom API returned error state: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    
    if (data.error) {
      throw new Error(data.error.info || "Trang Fandom không tồn tại hoặc lỗi API.");
    }

    const pageTitle = data.parse.title || pageName;
    const html = data.parse.text["*"];

    const sections = parseFandomHtml(html);

    if (sections.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy logo nào trong trang này. Vui lòng kiểm tra lại liên kết." });
    }

    res.json({
      title: pageTitle,
      sections
    });
  } catch (error: any) {
    console.error("Fandom Logos API Error:", error);
    res.status(500).json({
      error: "Không thể lấy dữ liệu từ Fandom Logopedia. Vui lòng kiểm tra lại liên kết.",
      details: error.message
    });
  }
});

// Serve Vite in development, static files in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
