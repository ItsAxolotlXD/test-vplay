import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  X,
  Palette,
  Layers,
  Image as ImageIcon,
  Clock,
  Trash2,
  Wand2,
  Eye,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  enhancedPrompt: string;
  style: string;
  aspectRatio: string;
  width: number;
  height: number;
  seed: number;
  palette: string[];
  createdAt: number;
}

interface CopilotImageGeneratorProps {
  onBackToChat?: () => void;
}

const STORAGE_IMAGES_KEY = "vplay_copilot_generated_images";

export const CopilotImageGenerator: React.FC<CopilotImageGeneratorProps> = ({ onBackToChat }) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cyberpunk");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<GeneratedImage | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  // History state
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_IMAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const styleList = [
    { id: "cyberpunk", label: "Cyberpunk Neon", desc: "Đèn neon tương lai, phản chiếu hologram", icon: "⚡" },
    { id: "realistic", label: "Chân Thực 8K", desc: "Ảnh chụp ống kính 35mm, ánh sáng điện ảnh", icon: "📸" },
    { id: "anime", label: "Anime Shinkai", desc: "Bầu trời rực rỡ, cảm xúc Makoto Shinkai", icon: "🌸" },
    { id: "3d_render", label: "Pixar 3D CGI", desc: "Render 3D dễ thương, ánh sáng khối", icon: "🧸" },
    { id: "oil_painting", label: "Sơn Dầu Nghệ Thuật", desc: "Nét cọ sơn dầu kinh điển trên toan", icon: "🎨" },
    { id: "retro_tv", label: "Vintage Retro TV", desc: "Phong cách truyền hình thập niên 90", icon: "📺" },
    { id: "fantasy", label: "Fantasy Thần Thoại", desc: "Kỳ ảo ma thuật, phong cảnh huyền bí", icon: "🧙" }
  ];

  const aspectRatios = [
    { id: "16:9", label: "16:9 Màn ảnh rộng", desc: "Chuẩn TV & Phim" },
    { id: "1:1", label: "1:1 Hình vuông", desc: "Avatar / Vuông" },
    { id: "9:16", label: "9:16 Dọc", desc: "Story / Reels" },
    { id: "4:3", label: "4:3 Cổ điển", desc: "Khung truyền hình cũ" }
  ];

  const promptSuggestions = [
    "Trường quay truyền hình VTV3 tương lai 2026 với màn hình hologram không gian 3 chiều rực rỡ",
    "Hoàng hôn mùa thu buông xuống Hồ Gươm và Tháp Rùa theo phong cách anime Makoto Shinkai",
    "Robot tương lai pha cà phê phin bên hè phố Hà Nội lúc trời mưa đêm neon",
    "Phi thuyền vũ trụ mang cờ đỏ sao vàng Việt Nam khám phá những vành đai sao Thổ",
    "Khu chợ nổi miền Tây sông nước lung linh huyền ảo trong lễ hội ánh sáng tương lai"
  ];

  // Quick prompt enhance
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const response = await fetch("/api/copilot/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio
        })
      });
      const json = await response.json();
      if (json.success && json.data) {
        setPrompt(json.data.enhancedPrompt || prompt);
      }
    } catch (err) {
      console.error("Failed to enhance prompt:", err);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Generate Image
  const handleGenerate = async () => {
    const textToGen = prompt.trim() || promptSuggestions[0];
    setIsGenerating(true);
    try {
      const response = await fetch("/api/copilot/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToGen,
          style,
          aspectRatio
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        const newImg: GeneratedImage = json.data;
        setCurrentImage(newImg);

        const updated = [newImg, ...savedImages.filter((img) => img.id !== newImg.id)].slice(0, 20);
        setSavedImages(updated);
        localStorage.setItem(STORAGE_IMAGES_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download image helper
  const handleDownload = async (img: GeneratedImage) => {
    try {
      const res = await fetch(img.imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vplay_ai_${img.style}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(img.imageUrl, "_blank");
    }
  };

  const handleCopyPrompt = (p: string) => {
    navigator.clipboard?.writeText(p);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto space-y-6 p-2 sm:p-4 text-slate-900 dark:text-white">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pink-300" />
                VNRT Online Copilot Vision Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 text-[11px] font-semibold">
                Photorealistic & Neural Art
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-montserrat">
              AI Image Generator
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Biến ý tưởng thành tác phẩm nghệ thuật 8K chân thực, Cyberpunk rực rỡ, hoặc phong cách anime Makoto Shinkai với đầy đủ tùy biến khung hình và bảng màu.
            </p>
          </div>

          {onBackToChat && (
            <button
              onClick={onBackToChat}
              className="px-4 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-semibold backdrop-blur-md transition-all self-start md:self-auto cursor-pointer"
            >
              ← Quay lại Trò chuyện
            </button>
          )}
        </div>
      </div>

      {/* Preset Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Gợi ý prompt sáng tạo:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(s)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shrink-0 transition-all cursor-pointer truncate max-w-xs hover:border-purple-500/40 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Generator Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-md space-y-5">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Mô tả chi tiết hình ảnh bạn muốn vẽ:
            </label>
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancingPrompt || !prompt.trim()}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Wand2 className="w-3 h-3" />
              <span>{isEnhancingPrompt ? "Đang tối ưu..." : "Tối ưu hóa Prompt"}</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Một phi thuyền tương lai bay qua vịnh Hạ Long trong ánh hoàng hôn màu vàng cam rực rỡ, mặt biển phản chiếu ánh sáng lấp lánh..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Style Selector Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Phong cách nghệ thuật:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {styleList.map((s) => {
              const isSelected = style === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 active:scale-95 ${
                    isSelected
                      ? "bg-purple-600/15 border-purple-600 text-purple-600 dark:text-purple-300 font-bold shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{s.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <span className="text-xs font-bold truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio Row */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Tỉ lệ khung hình:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {aspectRatios.map((ar) => {
              const isSelected = aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>{ar.label}</div>
                  <div className="text-[10px] opacity-75 font-normal">{ar.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            * Tạo ảnh độ phân giải cao với công nghệ Neural Synthesis
          </span>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang render hình ảnh...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Vẽ hình ảnh ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Generated Image Result */}
      {currentImage && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-600/15 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase">
                  {currentImage.style}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• Tỉ lệ {currentImage.aspectRatio}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• Seed: {currentImage.seed}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                {currentImage.prompt}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedPreview(currentImage)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Phóng to</span>
              </button>
              <button
                onClick={() => handleDownload(currentImage)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải ảnh PNG</span>
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center max-h-[500px] group shadow-inner">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.prompt}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Color Palette Bar */}
            {currentImage.palette && (
              <div className="absolute bottom-3 left-3 p-1.5 rounded-xl bg-black/60 backdrop-blur-md flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-white/70 ml-1" />
                {currentImage.palette.map((color, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: color }}
                    className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Gallery */}
      {savedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
              Bộ sưu tập đã tạo ({savedImages.length}):
            </h4>
            <button
              onClick={() => {
                setSavedImages([]);
                localStorage.removeItem(STORAGE_IMAGES_KEY);
              }}
              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Xóa bộ sưu tập
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {savedImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedPreview(img)}
                className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 cursor-pointer shadow-xs hover:shadow-lg transition-all"
              >
                <div className="aspect-video w-full overflow-hidden bg-black/20">
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-bold uppercase text-purple-500">{img.style}</span>
                    <span>{img.aspectRatio}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                    {img.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {selectedPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1A1922] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600/15 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase">
                    {selectedPreview.style}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedPreview.aspectRatio} • Seed: {selectedPreview.seed}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(selectedPreview)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                  <button
                    onClick={() => setSelectedPreview(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-slate-950">
                <img
                  src={selectedPreview.imageUrl}
                  alt={selectedPreview.prompt}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Prompt:</span>
                  <button
                    onClick={() => handleCopyPrompt(selectedPreview.prompt)}
                    className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? "Đã chép" : "Sao chép"}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedPreview.prompt}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
