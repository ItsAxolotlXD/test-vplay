import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Generate Fandom Logos
  app.get("/api/fandom-logos", async (req, res) => {
    try {
      const { lang, page } = req.query;
      if (!lang || !page) {
        return res.status(400).json({ error: "Thiếu tham số lang hoặc page." });
      }

      const wikiLang = String(lang).toLowerCase() === "vi" ? "vi" : "uk";
      const wikiPage = String(page).trim();

      // Query via MediaWiki Parse API
      const apiUrl = `https://logos.fandom.com/${wikiLang}/api.php?action=parse&page=${encodeURIComponent(wikiPage)}&prop=text&format=json&origin=*`;
      
      let htmlText = "";
      try {
        const apiResponse = await fetch(apiUrl, {
          headers: { 'User-Agent': 'VPlayLogoGenerator/1.0' }
        });
        if (apiResponse.ok) {
          const data = await apiResponse.json() as any;
          if (data && data.parse && data.parse.text && data.parse.text["*"]) {
            htmlText = data.parse.text["*"];
          }
        }
      } catch (err) {
        console.error("Fandom parse API error:", err);
      }

      // Fallback: If parse API fails, fetch direct page HTML
      if (!htmlText) {
        try {
          const htmlUrl = `https://logos.fandom.com/${wikiLang}/wiki/${encodeURIComponent(wikiPage)}`;
          const htmlResponse = await fetch(htmlUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          if (htmlResponse.ok) {
            htmlText = await htmlResponse.text();
          }
        } catch (err) {
          console.error("Fandom Direct HTML Scrape Error:", err);
        }
      }

      if (!htmlText) {
        return res.status(404).json({ error: `Không thể kết nối hoặc không tìm thấy trang "${wikiPage}" trên Fandom.` });
      }

      // Helper function to extract years or dates from captions
      const extractDateFromCaption = (caption: string, defaultDate: string): string => {
        const dateRegex = /\b(19\d{2}|20\d{2})\s*[-–—]\s*(19\d{2}|20\d{2}|present|nay|hiện\s+nay)\b|\b(19\d{2}|20\d{2})\b/gi;
        const match = caption.match(dateRegex);
        if (match) {
          return match[0];
        }
        return defaultDate;
      };

      const $ = cheerio.load(htmlText);
      const sections: { title: string; logos: { url: string; caption: string; date: string; title: string }[] }[] = [];

      let currentSectionName = "Chung / Khác";
      let currentLogos: any[] = [];
      const seenUrls = new Set<string>();

      // Traverse elements
      $('h2, h3, h4, ul.gallery, div.thumb, figure.thumb').each((_i, el) => {
        const tagName = el.name;
        const $el = $(el);

        if (['h2', 'h3', 'h4'].includes(tagName)) {
          const headline = $el.find('.mw-headline');
          if (headline.length > 0) {
            const headingText = headline.text().trim();
            const skipHeadings = [
              "references", "see also", "external links", "navigation", "categories", 
              "tài liệu tham khảo", "xem thêm", "liên kết ngoài", "chú thích", "bình luận", "comments"
            ];
            if (skipHeadings.some(h => headingText.toLowerCase().includes(h))) {
              return;
            }
            
            if (currentLogos.length > 0) {
              sections.push({ title: currentSectionName, logos: currentLogos });
            }
            currentSectionName = headingText;
            currentLogos = [];
          }
        } else if (tagName === 'ul' && $el.hasClass('gallery')) {
          $el.find('li.gallerybox').each((_j, box) => {
            const $box = $(box);
            const img = $box.find('img');
            let imgSrc = img.attr('data-src') || img.attr('src') || '';
            if (imgSrc) {
              if (imgSrc.includes('/revision/latest')) {
                imgSrc = imgSrc.split('/revision/latest')[0] + '/revision/latest';
              }
              if (imgSrc.startsWith('//')) {
                imgSrc = 'https:' + imgSrc;
              }

              const isCommonUI = imgSrc.includes("sprite") || imgSrc.includes("favicon") || imgSrc.includes("wiki_logo") || imgSrc.includes("Theme-") || imgSrc.includes("placeholder");
              if (imgSrc.startsWith('http') && !isCommonUI && !seenUrls.has(imgSrc)) {
                seenUrls.add(imgSrc);
                const captionText = $box.find('.gallerytext').text().trim().replace(/\s+/g, ' ');
                const cleanCaption = captionText || "Logo";
                
                let logoTitle = "Logo";
                if (cleanCaption) {
                  const parts = cleanCaption.split(/[.;|]/);
                  if (parts[0] && parts[0].trim().length > 3) {
                    logoTitle = parts[0].trim();
                  } else {
                    logoTitle = cleanCaption;
                  }
                }

                currentLogos.push({
                  url: imgSrc,
                  caption: cleanCaption,
                  title: logoTitle,
                  date: extractDateFromCaption(cleanCaption, currentSectionName)
                });
              }
            }
          });
        } else if (tagName === 'div' || tagName === 'figure') {
          if ($el.hasClass('thumb') || $el.hasClass('thumbinner')) {
            const img = $el.find('img');
            let imgSrc = img.attr('data-src') || img.attr('src') || '';
            if (imgSrc) {
              if (imgSrc.includes('/revision/latest')) {
                imgSrc = imgSrc.split('/revision/latest')[0] + '/revision/latest';
              }
              if (imgSrc.startsWith('//')) {
                imgSrc = 'https:' + imgSrc;
              }

              const isCommonUI = imgSrc.includes("sprite") || imgSrc.includes("favicon") || imgSrc.includes("wiki_logo") || imgSrc.includes("Theme-") || imgSrc.includes("placeholder");
              if (imgSrc.startsWith('http') && !isCommonUI && !seenUrls.has(imgSrc)) {
                seenUrls.add(imgSrc);
                const captionText = $el.find('.thumbcaption').text().trim().replace(/\s+/g, ' ');
                const cleanCaption = captionText || "Logo";
                
                let logoTitle = "Logo";
                if (cleanCaption) {
                  const parts = cleanCaption.split(/[.;|]/);
                  if (parts[0] && parts[0].trim().length > 3) {
                    logoTitle = parts[0].trim();
                  } else {
                    logoTitle = cleanCaption;
                  }
                }

                currentLogos.push({
                  url: imgSrc,
                  caption: cleanCaption,
                  title: logoTitle,
                  date: extractDateFromCaption(cleanCaption, currentSectionName)
                });
              }
            }
          }
        }
      });

      if (currentLogos.length > 0) {
        sections.push({ title: currentSectionName, logos: currentLogos });
      }

      const finalSections = sections.filter(s => s.logos.length > 0);

      res.json({
        success: true,
        lang: wikiLang,
        page: wikiPage,
        sectionsCount: finalSections.length,
        sections: finalSections
      });
    } catch (error: any) {
      console.error("Fandom Logos Proxy Error:", error);
      res.status(500).json({ error: error.message || "Không thể tải logo từ fandom" });
    }
  });

  // API Route: V-Intelligence Gemini Assistant Proxy
  app.post("/api/gemini", async (req: express.Request, res: express.Response) => {
    try {
      const { prompt, history, channels, mode } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Chưa cấu hình GEMINI_API_KEY trong Settings > Secrets." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const channelsListString = channels && Array.isArray(channels)
        ? channels.map((c: any) => `- ID: "${c.id}", Name: "${c.name}", Group: "${c.group}"`).join("\n")
        : "";

      let modeInstruction = "";
      if (mode === "search") {
        modeInstruction = `
[CHẾ ĐỘ TÌM KIẾM AI]: Bạn đang hoạt động ở chế độ Tìm kiếm kênh truyền hình thông minh bằng AI. Khi người dùng nhập một từ khóa hoặc một mong muốn tìm kiếm kênh (ví dụ: thể thao, phim truyện, bóng đá, nhạc, đài địa phương, vv.), hãy tận dụng danh sách kênh ở trên để lọc và đề xuất các kênh phù hợp, mô tả ngắn gọn và luôn kết thúc bằng lệnh chuyển kênh [COMMAND: SWITCH_CHANNEL: channel_id] tương ứng để người dùng có thể kích hoạt kênh ngay lập tức.`;
      } else {
        modeInstruction = `
[CHẾ ĐỘ TRÒ CHUYỆN CHAT]: Bạn đang hoạt động ở chế độ Trò chuyện/Chat thông thường. Hãy tán gẫu, thảo luận, trả lời câu hỏi tự do, và chỉ hỗ trợ chuyển kênh khi người dùng chủ động yêu cầu bạn mở hoặc bật một kênh cụ thể.`;
      }

      const systemInstruction = `Bạn là V-Intelligence - Trợ lý Trí tuệ Nhân tạo thông minh, người bạn đồng hành đắc lực của người dùng trên ứng dụng truyền hình Vplay.

Nhiệm vụ của bạn:
1. Trả lời người dùng một cách sinh động, hấp dẫn, ngắn gọn và lịch sự hoàn toàn bằng tiếng Việt. Hãy xưng hô là "mình" và gọi người dùng là "bạn" (không xưng "em" và không gọi người dùng là "anh/chị").
2. Bạn có khả năng giúp người dùng điều khiển tivi! Nếu người dùng muốn chuyển kênh, bật kênh, mở kênh, xem kênh (ví dụ: "mở VTV3", "bật kênh phim", "chuyển sang VTV1", vv), bạn hãy phân tích danh sách kênh có sẵn dưới đây để tìm kênh phù hợp nhất, sau đó thêm lệnh điều khiển chính xác ở CUỐI câu trả lời dưới định dạng đặc biệt này:
[COMMAND: SWITCH_CHANNEL: channel_id]
Ví dụ: "Mình sẽ chuyển sang kênh VTV3 cho bạn ngay nhé! [COMMAND: SWITCH_CHANNEL: vtv3]"
3. Nếu người dùng hỏi chung chung về các kênh hoặc muốn tìm thể loại (ví dụ: "có kênh bóng đá nào không?"), hãy gợi ý cho họ các kênh phù hợp từ danh sách và nếu họ muốn mở, bạn cũng gợi ý chuyển kênh kèm theo COMMAND.
${modeInstruction}

Danh sách kênh hiện có trên Vplay:
${channelsListString}

Hãy luôn xưng hô "mình" - "bạn", giữ thái độ nhiệt tình, thân thiện, và phản hồi ngắn gọn (dưới 120 từ) để hiển thị đẹp mắt trên giao diện ứng dụng.`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in backend:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu với Gemini." });
    }
  });

  // Setup Vite Dev Middleware or Static Production Serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
