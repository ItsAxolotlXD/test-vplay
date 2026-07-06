import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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
