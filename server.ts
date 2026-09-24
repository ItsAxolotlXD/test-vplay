import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini AI Client instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Load channels from JSON for searching grounding
let cachedChannels: any[] = [];
try {
  const channelsPath = path.join(process.cwd(), "src/data/channels.json");
  if (fs.existsSync(channelsPath)) {
    cachedChannels = JSON.parse(fs.readFileSync(channelsPath, "utf-8"));
  }
} catch (err) {
  console.error("Failed to load channels for Copilot:", err);
}

// API endpoint for Copilot for Vplay
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt, history, channels = [], userName = "User", mode = "chat" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung câu hỏi" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        text: `Chào ${userName}! Mình là **Copilot for Vplay** 🚀.
Hệ thống hiện đang chạy ở chế độ cơ bản do chưa phát hiện API key trong cấu hình môi trường. Bạn có thể sử dụng các lệnh điều khiển nhanh:
- \`/search <từ khóa>\`: Tìm kiếm thông minh toàn hệ thống
- \`/search <từ khóa> filter <loại>\`: Tìm kiếm theo bộ lọc (tv, news, copilot...)
- \`/mode <light/dark>\`: Chuyển đổi giao diện Sáng / Tối
- \`/navigation <dock/sidebar>\`: Đổi thanh điều hướng
- \`/subscribe premium\`: Mở cổng đăng ký Waves Premium (V-Premium)`
      });
    }

    const channelsSummary = (Array.isArray(channels) ? channels : []).slice(0, 35)
      .map((c: any) => `${c.name} (id: ${c.id}) - ${c.group || ''}`)
      .join("\n");

    const systemInstruction = `Bạn là "Copilot for Vplay" - Trợ lý Trí tuệ Nhân tạo thông minh, đắc lực và thân thiện của ứng dụng truyền hình Vplay (Waves Community).
Bạn xưng hô là "mình" và gọi người dùng là "${userName || 'bạn'}". Giọng văn lịch sự, nhiệt tình, có kèm emoji sinh động, hỗ trợ cả Markdown và tiếng Việt chuẩn xác.
Khi người dùng muốn xem hoặc chuyển sang kênh nào, bạn hãy trả lời thật tự nhiên và chèn cú pháp lệnh [COMMAND: SWITCH_CHANNEL: <channel_id_or_name>] vào cuối câu trả lời để hệ thống tự động phát kênh đó.

Danh sách kênh phát sóng tiêu biểu trong hệ thống Vplay:
${channelsSummary}

Khi người dùng hỏi về các tính năng điều khiển, bạn có thể hướng dẫn các lệnh hữu ích:
- /search <từ khóa>: Tìm kiếm toàn hệ thống
- /search <từ khóa> filter <loại>: Lọc theo kênh (tv), tin tức (news), v.v.
- /mode <light/dark>: Đổi giao diện Sáng / Tối
- /navigation <dock/sidebar>: Đổi kiểu thanh điều hướng
- /subscribe premium: Đăng ký Waves Premium`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h && h.text) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: String(h.text) }]
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: String(prompt) }]
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text;
      if (replyText) {
        return res.json({ text: replyText });
      }
    } catch (genError: any) {
      console.warn("Primary Gemini generation error, attempting fallback:", genError?.message);
    }

    // Fallback response if generation returned empty text
    return res.json({
      text: `Chào ${userName}! **Copilot for Vplay** đã nhận được yêu cầu của bạn: "${prompt}".
Bạn có thể thử các phím lệnh nhanh:
- \`/search ${prompt}\`: Tìm kiếm kênh và chương trình phù hợp
- \`/mode light\` hoặc \`/mode dark\`: Thay đổi giao diện
- \`/navigation dock\` hoặc \`/navigation sidebar\`: Đổi thanh điều hướng
- \`/subscribe premium\`: Khám phá Waves Premium`
    });
  } catch (error: any) {
    console.error("Copilot API Error:", error);
    res.json({
      text: "Xin lỗi bạn, kết nối tới Copilot AI tạm thời gián đoạn. Bạn có thể sử dụng các lệnh `/search`, `/mode`, `/navigation` hoặc `/subscribe premium` trực tiếp ngay lúc này!"
    });
  }
});

// =========================================================================
// COPILOT AI FEATURES: MUSIC, IMAGE, AND VIDEO GENERATORS
// =========================================================================

// 1. Music Generator Endpoint
app.post("/api/copilot/generate-music", async (req, res) => {
  try {
    const {
      prompt = "Nhạc Lofi thư giãn",
      genre = "lofi",
      mood = "relaxed",
      tempo = 85,
      instrumental = false,
      userName = "User"
    } = req.body;

    const ai = getGeminiClient();

    // Default fallback musical templates if Gemini is unavailable
    const defaultTemplates: Record<string, any> = {
      lofi: {
        title: "Ký Ức Mưa Đêm",
        genre: "Lofi Hip-Hop & Chill",
        mood: "Thư giãn, Hoài niệm",
        bpm: 82,
        key: "A Minor",
        summary: "Giai điệu Lofi ấm áp với tiếng đàn electric piano cổ điển, tiếng mưa rả rích và nhịp beat vinyl hoài cổ.",
        chordProgression: ["Am7", "Dm7", "G7", "Cmaj7", "Fmaj7", "Bm7b5", "E7", "Am7"],
        melodyNotes: [69, 72, 76, 74, 72, 69, 67, 65, 67, 69, 72, 71, 69, 67, 64, 69],
        bassNotes: [45, 38, 43, 36, 41, 35, 40, 45],
        lyrics: [
          { time: 0, text: "🎵 [Tiếng mưa rơi nhẹ bên khung cửa sổ]" },
          { time: 6, text: "Góc phố đêm nay chỉ còn tiếng mưa rơi trên mái hiên" },
          { time: 14, text: "Tách trà nghi ngút khói, giữ lại những bình yên" },
          { time: 22, text: "Tháng năm trôi mau như làn mây trắng bay ngang trời" },
          { time: 30, text: "Nụ cười ai đó vẫn còn đọng lại trong tim tôi" },
          { time: 38, text: "🎵 [Tiếng kèn saxophone du dương khép lại]" }
        ]
      },
      edm: {
        title: "Vplay Cyber Neon Wave",
        genre: "Cyberpunk Synthwave & EDM",
        mood: "Sôi động, Bùng nổ",
        bpm: 128,
        key: "F Minor",
        summary: "Nhịp bassline lăn tăn mạnh mẽ kết hợp arpeggio synthesizer neon mang hơi thở của tương lai 2026.",
        chordProgression: ["Fm", "Db", "Ab", "Eb", "Fm", "Db", "Bbm", "C7"],
        melodyNotes: [65, 68, 72, 75, 77, 75, 72, 68, 65, 68, 70, 72, 75, 72, 70, 65],
        bassNotes: [41, 37, 44, 39, 41, 37, 46, 36],
        lyrics: [
          { time: 0, text: "⚡ [Synth Arpeggio khởi động năng lượng]" },
          { time: 4, text: "Neon rực sáng thành phố không bao giờ ngủ" },
          { time: 10, text: "Cháy hết mình cùng làn sóng âm thanh rực lửa" },
          { time: 16, text: "🔥 DROP! Năng lượng tràn ngập không gian!" },
          { time: 24, text: "Tăng tốc độ, vượt qua mọi giới hạn đêm nay!" }
        ]
      },
      pop: {
        title: "Giai Điệu Tình Ca Phố",
        genre: "Pop Ballad Việt Nam",
        mood: "Ngọt ngào, Lãng mạn",
        bpm: 96,
        key: "C Major",
        summary: "Bản tình ca nhẹ nhàng với tiếng guitar mộc và piano trữ tình da diết.",
        chordProgression: ["C", "G/B", "Am", "Em", "F", "C/E", "Dm7", "G7"],
        melodyNotes: [60, 64, 67, 72, 71, 67, 69, 72, 69, 67, 65, 64, 62, 65, 64, 60],
        bassNotes: [36, 35, 33, 40, 41, 40, 38, 43],
        lyrics: [
          { time: 0, text: "🎸 [Tiếng đàn guitar acoustic mở đầu]" },
          { time: 6, text: "Nắng sớm chan hòa trên con đường em qua" },
          { time: 14, text: "Tà áo trắng bay bay giữa muôn ngàn sắc hoa" },
          { time: 22, text: "Chỉ muốn cùng em đi qua bao tháng ngày bình dị" },
          { time: 30, text: "Nắm chặt bàn tay, chẳng cần nghĩ suy điều gì" }
        ]
      }
    };

    let result = defaultTemplates[genre] || defaultTemplates.lofi;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Bạn là nhạc sĩ và nhà sản xuất âm nhạc tài ba. Hãy sáng tác một bài hát hoàn chỉnh dựa trên yêu cầu:
- Ý tưởng/Prompt: "${prompt}"
- Thể loại: ${genre}
- Tâm trạng: ${mood}
- Tempo mong muốn: ${tempo} BPM
- Nhạc không lời: ${instrumental ? "Có" : "Không"}

HÃY PHẢN HỒI THEO ĐỊNH DẠNG JSON HỢP LỆ VỚI CÁC TRƯỜNG SAU:
{
  "title": "Tên bài hát",
  "genre": "Tên thể loại chi tiết",
  "mood": "Tâm trạng âm nhạc",
  "bpm": ${tempo},
  "key": "Ví dụ C Major hoặc A Minor",
  "summary": "Mô tả phong cách và cấu trúc phối khí của bài hát (2-3 câu)",
  "chordProgression": ["Am", "F", "C", "G", "Am", "Dm", "E7", "Am"],
  "melodyNotes": [69, 72, 76, 74, 72, 69, 67, 65, 67, 69, 72, 71, 69, 67, 64, 69],
  "bassNotes": [45, 41, 48, 43, 45, 38, 40, 45],
  "lyrics": [
    { "time": 0, "text": "Lời bài hát dòng 1..." },
    { "time": 8, "text": "Lời bài hát dòng 2..." },
    { "time": 16, "text": "Lời bài hát dòng 3..." },
    { "time": 24, "text": "Lời bài hát dòng 4..." },
    { "time": 32, "text": "Lời bài hát dòng 5..." }
  ]
}
Chú ý: melodyNotes là mảng 16 số nguyên biểu diễn nốt MIDI (trong khoảng 60 đến 84), bassNotes là mảng 8 nốt MIDI trầm (trong khoảng 36 đến 50). Trả về JSON thuần túy không kèm markdown.`
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.8,
          }
        });

        const rawJson = response.text?.trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (parsed && parsed.title && Array.isArray(parsed.melodyNotes)) {
            result = parsed;
          }
        }
      } catch (err: any) {
        console.warn("Gemini music generation fallback, using algorithmic template:", err?.message);
      }
    }

    return res.json({
      success: true,
      data: {
        id: `song_${Date.now()}`,
        ...result,
        prompt,
        genre,
        mood,
        bpm: result.bpm || tempo,
        createdAt: Date.now()
      }
    });
  } catch (error: any) {
    console.error("Music generation error:", error);
    res.status(500).json({ error: "Không thể tạo bài hát, vui lòng thử lại sau." });
  }
});

// 2. Image Generator Endpoint
app.post("/api/copilot/generate-image", async (req, res) => {
  try {
    const {
      prompt = "Studio truyền hình hiện đại",
      style = "cyberpunk",
      aspectRatio = "16:9",
      userName = "User"
    } = req.body;

    const ai = getGeminiClient();

    // Style prompt enhancers
    const styleModifiers: Record<string, string> = {
      realistic: "ultra-realistic, 8k resolution, shot on 35mm lens, hyper-detailed, photorealistic, cinematic lighting, dramatic shadows",
      cyberpunk: "cyberpunk aesthetic, glowing neon lights, futuristic city, holographic displays, rainy reflective streets, high-tech vibe",
      anime: "modern anime style, Makoto Shinkai aesthetic, vibrant colors, beautiful sky and clouds, detailed hand-drawn feel, emotional lighting",
      "3d_render": "Pixar Disney 3D animation style, octane render, soft ambient occlusion, cute expressive characters, whimsical volumetric lighting",
      oil_painting: "masterpiece oil painting on canvas, visible rich brushstrokes, impressionist lighting, artistic color palette, classical art texture",
      retro_tv: "90s VHS retro television aesthetic, subtle scanlines, nostalgic chromatic aberration, analog broadcast texture",
      fantasy: "epic fantasy realm, mythical glowing magic, grand majestic architecture, ethereal dreamy atmosphere, dramatic golden hour"
    };

    const modifier = styleModifiers[style] || styleModifiers.realistic;
    let enhancedPrompt = `${prompt}, ${modifier}, masterpiece quality, high aesthetic score`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Bạn là chuyên gia thiết kế prompt hình ảnh AI. Hãy tối ưu và dịch mô tả sau sang tiếng Anh nghệ thuật chi tiết:
- Ý tưởng gốc: "${prompt}"
- Phong cách: ${style} (${modifier})
Yêu cầu: Viết một đoạn prompt tiếng Anh súc tích, giàu hình ảnh, mô tả chi tiết ánh sáng, góc chụp, màu sắc và chi tiết cảnh quan (khoảng 35-50 từ). Chỉ trả về duy nhất đoạn prompt đó, không kèm giải thích.`
                }
              ]
            }
          ],
          config: {
            temperature: 0.7
          }
        });

        const enhancedText = response.text?.trim();
        if (enhancedText) {
          enhancedPrompt = enhancedText;
        }
      } catch (err: any) {
        console.warn("Prompt enhancement fallback:", err?.message);
      }
    }

    // Determine dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === "16:9") {
      width = 1280;
      height = 720;
    } else if (aspectRatio === "9:16") {
      width = 720;
      height = 1280;
    } else if (aspectRatio === "4:3") {
      width = 1024;
      height = 768;
    }

    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    // Extract a harmonious color palette for the UI
    const palettes: Record<string, string[]> = {
      cyberpunk: ["#0B0813", "#7928CA", "#00DFD8", "#FF0080", "#1A102F"],
      realistic: ["#1F2937", "#3B82F6", "#F59E0B", "#10B981", "#111827"],
      anime: ["#1E1B4B", "#6366F1", "#F43F5E", "#38BDF8", "#FEF08A"],
      "3d_render": ["#312E81", "#EC4899", "#8B5CF6", "#FBBF24", "#06B6D4"],
      oil_painting: ["#451A03", "#B45309", "#D97706", "#FDE68A", "#1C1917"],
      retro_tv: ["#18181B", "#DC2626", "#2563EB", "#16A34A", "#FAFAFA"],
      fantasy: ["#1E1B4B", "#7C3AED", "#EC4899", "#FCD34D", "#0F172A"]
    };

    return res.json({
      success: true,
      data: {
        id: `img_${Date.now()}`,
        imageUrl,
        prompt,
        enhancedPrompt,
        style,
        aspectRatio,
        width,
        height,
        seed,
        palette: palettes[style] || palettes.cyberpunk,
        createdAt: Date.now()
      }
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Không thể tạo hình ảnh, vui lòng thử lại sau." });
  }
});

// 3. Video Generator Endpoint
app.post("/api/copilot/generate-video", async (req, res) => {
  try {
    const {
      prompt = "Intro Thời Sự Vplay 2026",
      style = "cinematic",
      duration = 10,
      aspectRatio = "16:9",
      userName = "User"
    } = req.body;

    const ai = getGeminiClient();

    let videoProject = {
      title: "Vplay Cinematic Motion Project",
      logline: `Video nghệ thuật ngắn dựa trên ý tưởng: ${prompt}`,
      aspectRatio,
      duration,
      scenes: [
        {
          sceneNumber: 1,
          title: "Khởi Đầu - Toàn Cảnh",
          duration: 3,
          cameraMovement: "zoom_in",
          subtitles: "Tương lai phát sóng truyền hình số 2026 bắt đầu từ đây...",
          visualEffect: "lens_flare",
          audioMood: "ambient_drone",
          prompt: `${prompt}, wide establishing shot, cinematic composition, 8k resolution, dramatic lighting`,
          imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " establishing wide shot cinematic masterpiece 8k") }?width=1280&height=720&seed=101&nologo=true`
        },
        {
          sceneNumber: 2,
          title: "Chuyển Động - Cao Trào",
          duration: 4,
          cameraMovement: "pan_right",
          subtitles: "Những luồng ánh sáng neon hội tụ tạo nên không gian đa chiều",
          visualEffect: "cyberpunk_glitch",
          audioMood: "synthwave_drive",
          prompt: `${prompt}, dynamic camera movement, high energy, motion blur, glowing particles`,
          imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " dynamic action vibrant motion cinematic") }?width=1280&height=720&seed=202&nologo=true`
        },
        {
          sceneNumber: 3,
          title: "Kết Thúc - Biểu Tượng Vplay",
          duration: 3,
          cameraMovement: "orbit",
          subtitles: "Vplay Copilot AI - Sáng tạo không giới hạn",
          visualEffect: "film_grain",
          audioMood: "orchestral_swell",
          prompt: `${prompt}, majestic hero shot, elegant logo reveal, golden hour rim light`,
          imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " grand finale majestic hero shot glowing logo") }?width=1280&height=720&seed=303&nologo=true`
        }
      ],
      soundtrack: {
        bpm: 110,
        key: "D Minor",
        chords: ["Dm", "Bb", "F", "C"]
      }
    };

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Bạn là đạo diễn phim và motion graphic AI hàng đầu. Hãy lên kịch bản phân cảnh (Storyboard Director Cut) cho video ngắn:
- Ý tưởng: "${prompt}"
- Phong cách: ${style}
- Tổng thời lượng: ${duration} giây
- Tỉ lệ khung hình: ${aspectRatio}

HÃY PHẢN HỒI THEO ĐỊNH DẠNG JSON HỢP LỆ VỚI CẤU TRÚC:
{
  "title": "Tên video cuốn hút",
  "logline": "1 câu tóm tắt ý tưởng video",
  "aspectRatio": "${aspectRatio}",
  "duration": ${duration},
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Tên phân cảnh 1",
      "duration": 3,
      "cameraMovement": "zoom_in",
      "subtitles": "Lời bình hoặc phụ đề cảnh 1",
      "visualEffect": "lens_flare",
      "audioMood": "ambient_drone",
      "prompt": "Mô tả tiếng Anh chi tiết để sinh keyframe cảnh 1..."
    },
    {
      "sceneNumber": 2,
      "title": "Tên phân cảnh 2",
      "duration": 4,
      "cameraMovement": "pan_right",
      "subtitles": "Lời bình hoặc phụ đề cảnh 2",
      "visualEffect": "cyberpunk_glitch",
      "audioMood": "synthwave_drive",
      "prompt": "Mô tả tiếng Anh chi tiết để sinh keyframe cảnh 2..."
    },
    {
      "sceneNumber": 3,
      "title": "Tên phân cảnh 3",
      "duration": 3,
      "cameraMovement": "orbit",
      "subtitles": "Lời bình hoặc phụ đề cảnh 3",
      "visualEffect": "film_grain",
      "audioMood": "orchestral_swell",
      "prompt": "Mô tả tiếng Anh chi tiết để sinh keyframe cảnh 3..."
    }
  ],
  "soundtrack": {
    "bpm": 110,
    "key": "D Minor",
    "chords": ["Dm", "Bb", "F", "C"]
  }
}
Chỉ trả về JSON thuần túy không kèm markdown.`
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.8
          }
        });

        const rawJson = response.text?.trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (parsed && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
            // Attach rendered keyframe images for each scene
            parsed.scenes = parsed.scenes.map((s: any, idx: number) => {
              const seed = Math.floor(Math.random() * 888888) + (idx * 100);
              const scenePrompt = encodeURIComponent(`${s.prompt || prompt}, cinematic movie shot 8k photorealistic`);
              return {
                ...s,
                imageUrl: `https://image.pollinations.ai/prompt/${scenePrompt}?width=1280&height=720&seed=${seed}&nologo=true`
              };
            });
            videoProject = parsed;
          }
        }
      } catch (err: any) {
        console.warn("Gemini video storyboard generation fallback:", err?.message);
      }
    }

    return res.json({
      success: true,
      data: {
        id: `vid_${Date.now()}`,
        ...videoProject,
        prompt,
        style,
        createdAt: Date.now()
      }
    });
  } catch (error: any) {
    console.error("Video generation error:", error);
    res.status(500).json({ error: "Không thể tạo video, vui lòng thử lại sau." });
  }
});

// API endpoint for Firesteel
app.post("/api/vintelligence", async (req, res) => {
  try {
    const { messages = [], mode = "chat", userName = "User", smartAction } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    // Prepare channels context
    const channelsContext = cachedChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      group: ch.group
    }));

    const isSmartActionEnabled = smartAction !== false;
    const userIntro = userName ? `Người dùng hiện tại tên là "${userName}". Hãy xưng hô thân mật bằng cách gọi họ bằng tên "${userName}" khi thích hợp (ví dụ: "Chào ${userName}", "Cảm ơn ${userName}").` : "Người dùng chưa thiết lập tên gọi cụ thể. Vui lòng xưng hô lịch sự, thân mật chung chung và không dùng tên riêng.";
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

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content) }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            recommendedChannels: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            action: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                target: { type: Type.STRING },
                section: { type: Type.STRING }
              }
            }
          },
          required: ["reply", "recommendedChannels"]
        }
      }
    });

    const resultText = response.text || "{}";
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
const handleFandomLogos = async (req: express.Request, res: express.Response) => {
  try {
    const rawUrl = (req.query.url as string) || req.body?.url;
    let lang = ((req.query.lang as string) || req.body?.lang || "en").toLowerCase();
    let pageName = ((req.query.page as string) || req.body?.page || "").trim();

    if (rawUrl) {
      console.log(`Processing Fandom request from URL: ${rawUrl}`);
      try {
        const urlObj = new URL(rawUrl);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        
        if (pathParts[0] === "vi" && pathParts[1] === "wiki") {
          lang = "vi";
          pageName = decodeURIComponent(pathParts[2]);
        } else if (pathParts[0] === "wiki") {
          lang = "en";
          pageName = decodeURIComponent(pathParts[1]);
        } else {
          pageName = decodeURIComponent(pathParts[pathParts.length - 1] || "");
        }
      } catch (e) {
        pageName = rawUrl.trim();
      }
    }

    if (!pageName) {
      return res.status(400).json({ error: "Vui lòng cung cấp tên trang hoặc liên kết Fandom Logopedia" });
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
      success: true,
      title: pageTitle,
      sections,
      sectionsCount: sections.length
    });
  } catch (error: any) {
    console.error("Fandom Logos API Error:", error);
    res.status(500).json({
      error: "Không thể lấy dữ liệu từ Fandom Logopedia. Vui lòng kiểm tra lại liên kết.",
      details: error.message
    });
  }
};

app.get("/api/fandom-logos", handleFandomLogos);
app.post("/api/fandom-logos", handleFandomLogos);

// Audio proxy endpoint for streaming TV music tracks without Cloudflare hotlinking blocks
app.get("/api/audio-proxy", async (req, res) => {
  try {
    const audioUrl = req.query.url as string;
    if (!audioUrl) {
      return res.status(400).json({ error: "Missing audio url" });
    }

    const range = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://logos.fandom.com/"
    };
    if (range) {
      fetchHeaders["Range"] = range;
    }

    const response = await fetch(audioUrl, { headers: fetchHeaders });
    if (!response.ok && response.status !== 206) {
      return res.status(response.status).send(`Failed to fetch audio: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");
    const acceptRanges = response.headers.get("accept-ranges");

    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Audio Proxy Error:", error);
    res.status(500).json({ error: "Failed to proxy audio", details: error.message });
  }
});

// Stream local video files with full Range / 206 Partial Content support
const handleStreamVideoFile = (videoPath: string, req: express.Request, res: express.Response) => {
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
      "Access-Control-Allow-Origin": "*",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Access-Control-Allow-Origin": "*",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

const handleStreamIntroVideo = (req: express.Request, res: express.Response) => {
  const videoPath = path.join(process.cwd(), "public/intro-video.mp4");
  handleStreamVideoFile(videoPath, req, res);
};

app.get("/intro-video.mp4", handleStreamIntroVideo);
app.get("/api/intro-video", handleStreamIntroVideo);

// Stream ads videos
app.get("/ads/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const videoPath = path.join(process.cwd(), "public/ads", filename);
  handleStreamVideoFile(videoPath, req, res);
});
app.get("/api/ads/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const videoPath = path.join(process.cwd(), "public/ads", filename);
  handleStreamVideoFile(videoPath, req, res);
});

// Video proxy for external wikia links (bypasses hotlink protection)
app.get("/api/video-proxy", async (req, res) => {
  try {
    const videoUrl = (req.query.url as string) || "https://static.wikia.nocookie.net/ep-deo/images/4/4a/5c1imv.mp4/revision/latest?cb=20260924070114";
    const range = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://logos.fandom.com/",
    };
    if (range) fetchHeaders["Range"] = range;

    const response = await fetch(videoUrl, { headers: fetchHeaders });
    if (!response.ok && response.status !== 206) {
      return res.status(response.status).send(`Failed to fetch video: ${response.statusText}`);
    }

    res.status(response.status);
    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");
    const acceptRanges = response.headers.get("accept-ranges");

    res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Video Proxy Error:", error);
    res.status(500).json({ error: "Failed to proxy video", details: error.message });
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
