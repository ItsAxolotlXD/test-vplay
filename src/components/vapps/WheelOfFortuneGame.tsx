import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Shuffle,
  Clock,
  Settings2,
  List,
  Flame,
  Award,
  Trophy,
  HelpCircle,
  Copy,
  ChevronDown,
  Layers,
  ArrowRight,
  X,
  CheckCircle2,
  Coins
} from "lucide-react";
import {
  playWheelTickSound,
  playWheelSpinStartSound,
  playWheelCelebrationSound,
  playPopSound
} from "../../utils/sound";

export interface WheelItem {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  weight?: number;
}

export interface WheelPreset {
  id: string;
  title: string;
  description: string;
  category: "food" | "rewards" | "fun" | "names" | "fitness" | "custom";
  items: WheelItem[];
}

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#EAB308", // Yellow
  "#84CC16"  // Lime
];

const DEFAULT_PRESETS: WheelPreset[] = [
  {
    id: "food_choice",
    title: "Ăn Gì Hôm Nay? 🍜",
    description: "Giải quyết bài toán khó nhất mỗi ngày cho bạn và hội bạn bè!",
    category: "food",
    items: [
      { id: "1", label: "Cơm Tấm Sườn Trứng 🍛", color: "#EF4444" },
      { id: "2", label: "Phở Bò Tái Lăn 🍜", color: "#F97316" },
      { id: "3", label: "Bún Chả Hà Nội 🥓", color: "#F59E0B" },
      { id: "4", label: "Bánh Mì Thịt Nướng 🥖", color: "#10B981" },
      { id: "5", label: "Pizza Hải Sản 🍕", color: "#06B6D4" },
      { id: "6", label: "Lẩu Thái Chua Cay 🍲", color: "#3B82F6" },
      { id: "7", label: "Trà Sữa Trân Châu 🧋", color: "#8B5CF6" },
      { id: "8", label: "Gà Rán Giòn Cay 🍗", color: "#EC4899" }
    ]
  },
  {
    id: "orbs_rewards",
    title: "Phần Thưởng Orbs VIP 💎",
    description: "Vòng quay trúng thưởng tích lũy tiền thưởng Orbs Vplay!",
    category: "rewards",
    items: [
      { id: "1", label: "+100 Orbs 💎", color: "#3B82F6" },
      { id: "2", label: "+300 Orbs ⭐", color: "#10B981" },
      { id: "3", label: "May Mắn Lần Sau 🍀", color: "#6B7280" },
      { id: "4", label: "+500 Orbs 🎁", color: "#F59E0B" },
      { id: "5", label: "+1,000 Orbs 👑", color: "#EC4899" },
      { id: "6", label: "Nhân Đôi Orbs ⚡", color: "#8B5CF6" },
      { id: "7", label: "+2,000 Orbs 🏆", color: "#F97316" },
      { id: "8", label: "Rương Bí Mật 🗝️", color: "#14B8A6" }
    ]
  },
  {
    id: "lucky_names",
    title: "Bốc Thăm Chọn Tên 🎯",
    description: "Chọn người ngẫu nhiên phát biểu, trả lời hoặc nhận quà may mắn.",
    category: "names",
    items: [
      { id: "1", label: "Bạn Tuấn Anh", color: "#EF4444" },
      { id: "2", label: "Bạn Phương Linh", color: "#F59E0B" },
      { id: "3", label: "Bạn Minh Đức", color: "#10B981" },
      { id: "4", label: "Bạn Thu Hà", color: "#06B6D4" },
      { id: "5", label: "Bạn Hoàng Nam", color: "#3B82F6" },
      { id: "6", label: "Bạn Bích Ngọc", color: "#8B5CF6" }
    ]
  },
  {
    id: "truth_or_dare",
    title: "Sự Thật Hay Thử Thách 🎭",
    description: "Trò chơi giải trí khuấy động không khí cực vui cùng bạn bè.",
    category: "fun",
    items: [
      { id: "1", label: "Kể bí mật xấu hổ nhất", color: "#EF4444" },
      { id: "2", label: "Hát 1 bài hát bất kỳ", color: "#F97316" },
      { id: "3", label: "Uống 1 ly nước đầy", color: "#F59E0B" },
      { id: "4", label: "Bắt chước giọng NPC", color: "#10B981" },
      { id: "5", label: "Nhắn tin người thứ 1", color: "#3B82F6" },
      { id: "6", label: "Múa 1 điệu tự do 30s", color: "#8B5CF6" }
    ]
  },
  {
    id: "fitness_challenge",
    title: "Thử Thách Thể Lực 🏃",
    description: "Vận động nâng cao sức khỏe ngay trong giờ giải lao!",
    category: "fitness",
    items: [
      { id: "1", label: "15 Hít đất (Push-ups) 💪", color: "#EF4444" },
      { id: "2", label: "20 Squats đùi săn chắc 🦵", color: "#F97316" },
      { id: "3", label: "30 Giây Plank bụng 🔥", color: "#10B981" },
      { id: "4", label: "15 Gập bụng bụng phẳng ✨", color: "#3B82F6" },
      { id: "5", label: "20 Nhảy Jumping Jacks ⚡", color: "#8B5CF6" },
      { id: "6", label: "Nghỉ 1 phút thư giãn 🧘", color: "#14B8A6" }
    ]
  }
];

const STORAGE_KEY = "vplay_wheels_custom_presets";
const STORAGE_ACTIVE_KEY = "vplay_wheels_active_preset_id";
const STORAGE_DURATION_KEY = "vplay_wheels_duration_sec";

interface WheelOfFortuneGameProps {
  soundEnabled?: boolean;
  onScoreUpdate?: (score: number) => void;
  onClose?: () => void;
}

export const WheelOfFortuneGame: React.FC<WheelOfFortuneGameProps> = ({
  soundEnabled = true,
  onScoreUpdate,
  onClose
}) => {
  // Load saved presets or defaults
  const [presets, setPresets] = useState<WheelPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PRESETS;
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (savedId) return savedId;
    } catch {}
    return "food_choice";
  });

  // Current active wheel
  const activePreset = useMemo(() => {
    return presets.find((p) => p.id === activePresetId) || presets[0] || DEFAULT_PRESETS[0];
  }, [presets, activePresetId]);

  // Current items of the active wheel
  const [items, setItems] = useState<WheelItem[]>(activePreset.items);

  // Keep items synced when switching preset
  useEffect(() => {
    setItems(activePreset.items);
  }, [activePreset]);

  // Spin Duration in seconds (chỉnh thời gian vòng quay)
  const [spinDuration, setSpinDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DURATION_KEY);
      if (saved) {
        const num = parseFloat(saved);
        if (num >= 1 && num <= 60) return num;
      }
    } catch {}
    return 6;
  });

  const handleSetDuration = (sec: number) => {
    const clamped = Math.max(1, Math.min(60, Number(sec) || 5));
    setSpinDuration(clamped);
    try {
      localStorage.setItem(STORAGE_DURATION_KEY, clamped.toString());
    } catch {}
  };

  // State of the wheel
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // in degrees
  const [winningItem, setWinningItem] = useState<WheelItem | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [recentWins, setRecentWins] = useState<{ item: WheelItem; timestamp: string }[]>([]);
  const [flapperDeflection, setFlapperDeflection] = useState(0); // degrees for needle deflection

  // UI Modes
  const [activeTab, setActiveTab] = useState<"wheel" | "edit" | "presets" | "bulk">("wheel");
  const [newItemText, setNewItemText] = useState("");
  const [newItemColor, setNewItemColor] = useState(PRESET_COLORS[0]);
  const [bulkTextInput, setBulkTextInput] = useState("");
  const [editingItem, setEditingItem] = useState<{ id: string; label: string; color: string } | null>(null);
  const [newWheelName, setNewWheelName] = useState("");
  const [showNewWheelModal, setShowNewWheelModal] = useState(false);

  // References for Canvas & Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentAngleRef = useRef(0);
  const lastPinIndexRef = useRef(-1);

  // Save presets to localStorage
  const savePresets = (newPresets: WheelPreset[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    } catch (e) {
      console.error("Failed to save presets:", e);
    }
  };

  // Update current preset items
  const updateCurrentItems = (newItems: WheelItem[]) => {
    setItems(newItems);
    const updated = presets.map((p) => {
      if (p.id === activePreset.id) {
        return { ...p, items: newItems };
      }
      return p;
    });
    savePresets(updated);
  };

  // Draw wheel on canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;

    ctx.clearRect(0, 0, width, height);

    const totalItems = items.length;
    if (totalItems === 0) return;
    const arcAngle = (2 * Math.PI) / totalItems;

    ctx.save();
    ctx.translate(centerX, centerY);
    // Rotate canvas by current angle
    ctx.rotate((currentAngleRef.current * Math.PI) / 180);

    // 1. Draw Outer Ring / Shadow
    ctx.beginPath();
    ctx.arc(0, 0, radius + 12, 0, 2 * Math.PI);
    ctx.fillStyle = "#141517";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#27292d";
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#383b40";
    ctx.stroke();

    // 2. Draw Wheel Slices
    for (let i = 0; i < totalItems; i++) {
      const startAngle = i * arcAngle;
      const endAngle = startAngle + arcAngle;
      const item = items[i];

      // Draw Slice Sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Base fill color
      ctx.fillStyle = item.color;
      ctx.fill();

      // Subtle gradient overlay for 3D depth
      const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      grad.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Slice separator border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#141414";
      ctx.stroke();

      // 3. Draw Slice Text
      ctx.save();
      const midAngle = startAngle + arcAngle / 2;
      ctx.rotate(midAngle);

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      // Choose text font size based on item count and label length
      let fontSize = 14;
      if (totalItems <= 6) fontSize = 16;
      else if (totalItems > 12) fontSize = 11;
      else if (totalItems > 18) fontSize = 9;

      ctx.font = `bold ${fontSize}px 'Jura', sans-serif, system-ui`;

      // Text stroke for ultra contrast
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#101112";
      ctx.strokeText(item.label, radius - 24, 0);

      ctx.fillStyle = item.textColor || "#FFFFFF";
      ctx.fillText(item.label, radius - 24, 0);

      ctx.restore();
    }

    // 4. Draw Outer Rim Pins (Metallic Pegs at slice junctions)
    for (let i = 0; i < totalItems; i++) {
      const pinAngle = i * arcAngle;
      const pinX = Math.cos(pinAngle) * (radius + 4);
      const pinY = Math.sin(pinAngle) * (radius + 4);

      // Pin shadow
      ctx.beginPath();
      ctx.arc(pinX, pinY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#0c0d0e";
      ctx.fill();

      // Pin head
      ctx.beginPath();
      ctx.arc(pinX, pinY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#F59E0B";
      ctx.fill();

      // Pin shine
      ctx.beginPath();
      ctx.arc(pinX - 1, pinY - 1, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }

    // 5. Center Hub (Glossy Gold / Emerald Core)
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = "#141414";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, 2 * Math.PI);
    ctx.fillStyle = "#28960b";
    ctx.fill();

    const hubGrad = ctx.createLinearGradient(-30, -30, 30, 30);
    hubGrad.addColorStop(0, "#89dc69");
    hubGrad.addColorStop(0.5, "#28960b");
    hubGrad.addColorStop(1, "#175207");
    ctx.fillStyle = hubGrad;
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#141414";
    ctx.stroke();

    // Center jewel
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, 2 * Math.PI);
    ctx.fillStyle = "#F59E0B";
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.restore();
  }, [items]);

  // Initial and subsequent renders
  useEffect(() => {
    drawWheel();
  }, [drawWheel, rotationAngle]);

  // Handle Resize for sharp Retina resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 420, 500);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    drawWheel();
  }, [drawWheel]);

  // SPIN ENGINE
  const handleSpin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setWinningItem(null);
    if (soundEnabled) playWheelSpinStartSound();

    const startTime = performance.now();
    const startAngle = currentAngleRef.current % 360;

    // Determine random number of full rotations (between 5 and 10 turns depending on duration)
    const baseTurns = Math.max(4, Math.floor(spinDuration * 1.4));
    const randomTurns = baseTurns + Math.random() * 3;

    // Random landing angle
    const randomStopOffset = Math.random() * 360;
    const totalRotation = randomTurns * 360 + randomStopOffset;
    const targetAngle = startAngle + totalRotation;

    const durationMs = spinDuration * 1000;
    const sliceCount = items.length;
    const sliceAngle = 360 / sliceCount;

    lastPinIndexRef.current = -1;

    // Easing function: Cubic ease out with smooth long deceleration tail
    const easeOut = (t: number): number => {
      return 1 - Math.pow(1 - t, 3.8);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOut(progress);

      const currentAngle = startAngle + totalRotation * easedProgress;
      currentAngleRef.current = currentAngle;
      setRotationAngle(currentAngle);

      // Sound & Flapper Pin Check
      // Pointer is at the top: 270 degrees in standard coordinate space
      const pointerNormalizedAngle = (360 - ((currentAngle - 90) % 360)) % 360;
      const currentPinIndex = Math.floor(pointerNormalizedAngle / sliceAngle);

      if (currentPinIndex !== lastPinIndexRef.current) {
        lastPinIndexRef.current = currentPinIndex;

        // Needle deflection spring effect
        setFlapperDeflection(18);
        setTimeout(() => setFlapperDeflection(0), 40);

        // Sound intensity decreases as speed slows down
        if (soundEnabled) {
          const remainingFactor = 1 - progress;
          playWheelTickSound(remainingFactor * 1.5 + 0.3);
        }
      }

      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const finalAngle = targetAngle % 360;
        currentAngleRef.current = finalAngle;

        // Determine winner
        // Pointer is at top (270 degrees). With angle rotation, calculate slice index.
        const normalizedPointer = (360 - ((finalAngle - 90) % 360)) % 360;
        const winningIndex = Math.floor(normalizedPointer / sliceAngle) % sliceCount;
        const winner = items[winningIndex];

        setWinningItem(winner);
        setSpinCount((c) => c + 1);

        const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setRecentWins((prev) => [{ item: winner, timestamp: nowStr }, ...prev.slice(0, 9)]);

        if (soundEnabled) {
          playWheelCelebrationSound();
        }

        if (onScoreUpdate) {
          onScoreUpdate(100);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Add Item to current wheel
  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: WheelItem = {
      id: Date.now().toString(),
      label: newItemText.trim(),
      color: newItemColor
    };
    const updated = [...items, newItem];
    updateCurrentItems(updated);
    setNewItemText("");
    // Cycle color
    const nextColorIndex = (PRESET_COLORS.indexOf(newItemColor) + 1) % PRESET_COLORS.length;
    setNewItemColor(PRESET_COLORS[nextColorIndex]);
    if (soundEnabled) playPopSound();
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 2) {
      alert("Vòng quay cần có ít nhất 2 ô để hoạt động!");
      return;
    }
    const updated = items.filter((i) => i.id !== id);
    updateCurrentItems(updated);
    if (soundEnabled) playPopSound();
  };

  // Remove won item from wheel
  const handleRemoveWonItem = () => {
    if (!winningItem) return;
    handleRemoveItem(winningItem.id);
    setWinningItem(null);
  };

  // Shuffle items
  const handleShuffleItems = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    updateCurrentItems(shuffled);
    if (soundEnabled) playPopSound();
  };

  // Randomize colors
  const handleRandomizeColors = () => {
    const updated = items.map((item, idx) => ({
      ...item,
      color: PRESET_COLORS[idx % PRESET_COLORS.length]
    }));
    updateCurrentItems(updated);
    if (soundEnabled) playPopSound();
  };

  // Bulk add items from multi-line text
  const handleApplyBulkText = () => {
    const lines = bulkTextInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      alert("Vui lòng nhập ít nhất 2 dòng để tạo vòng quay!");
      return;
    }

    const newItems: WheelItem[] = lines.map((line, idx) => ({
      id: `${Date.now()}_${idx}`,
      label: line,
      color: PRESET_COLORS[idx % PRESET_COLORS.length]
    }));

    updateCurrentItems(newItems);
    setBulkTextInput("");
    setActiveTab("wheel");
    if (soundEnabled) playPopSound();
  };

  // Create new custom wheel
  const handleCreateNewWheel = () => {
    if (!newWheelName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newPreset: WheelPreset = {
      id: newId,
      title: newWheelName.trim(),
      description: "Vòng quay tùy biến của bạn",
      category: "custom",
      items: [
        { id: "1", label: "Lựa chọn 1", color: PRESET_COLORS[0] },
        { id: "2", label: "Lựa chọn 2", color: PRESET_COLORS[1] },
        { id: "3", label: "Lựa chọn 3", color: PRESET_COLORS[2] },
        { id: "4", label: "Lựa chọn 4", color: PRESET_COLORS[3] }
      ]
    };

    const updatedPresets = [...presets, newPreset];
    savePresets(updatedPresets);
    setActivePresetId(newId);
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, newId);
    } catch {}

    setNewWheelName("");
    setShowNewWheelModal(false);
    setActiveTab("edit");
    if (soundEnabled) playPopSound();
  };

  // Switch Active Preset
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, presetId);
    } catch {}
    setWinningItem(null);
    if (soundEnabled) playPopSound();
  };

  // Reset to default presets
  const handleResetPresets = () => {
    if (confirm("Khôi phục tất cả mẫu vòng quay về mặc định?")) {
      savePresets(DEFAULT_PRESETS);
      setActivePresetId("food_choice");
      setWinningItem(null);
      if (soundEnabled) playPopSound();
    }
  };

  return (
    <div className="w-full text-white font-sans select-none animate-fade-in">
      {/* 1. Header Bar: Title, Preset Picker, Tabs (Spatial Glass) */}
      <div className="w-full bg-white/[0.09] backdrop-blur-[24px] saturate-[180%] rounded-[20px] p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.25)] border border-white/15 mb-5 relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activePreset.title}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase">
                {items.length} Ô Thưởng
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5 line-clamp-1">
              {activePreset.description}
            </p>
          </div>
        </div>

        {/* Action Tabs: Vòng Quay / Chỉnh Sửa / Mẫu Có Sẵn / Tự Tạo Mới */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/10 z-10 flex-wrap">
          <button
            onClick={() => {
              setActiveTab("wheel");
              if (soundEnabled) playPopSound();
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-1.5 ${
              activeTab === "wheel"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-white/20 shadow-md"
                : "bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white border-white/10"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Vòng Quay</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("edit");
              if (soundEnabled) playPopSound();
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-1.5 ${
              activeTab === "edit"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-white/20 shadow-md"
                : "bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white border-white/10"
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Tạo & Chỉnh Sửa</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("presets");
              if (soundEnabled) playPopSound();
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-1.5 ${
              activeTab === "presets"
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-white/20 shadow-md"
                : "bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white border-white/10"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Mẫu Vòng Quay ({presets.length})</span>
          </button>

          <button
            onClick={() => {
              setShowNewWheelModal(true);
              if (soundEnabled) playPopSound();
            }}
            className="px-4 py-2 rounded-full text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
            title="Tạo vòng quay mới theo ý muốn"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Tự Tạo Vòng Quay</span>
          </button>
        </div>
      </div>

      {/* 2. Main Tab Content */}
      {activeTab === "wheel" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: The Wheel Stage (Spatial Glass) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-white/[0.06] backdrop-blur-[24px] saturate-[180%] rounded-[24px] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.25)] relative min-h-[460px] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* The Flapper Needle at the Top */}
            <div
              className="absolute top-2 z-20 transition-transform duration-75 origin-top pointer-events-none"
              style={{
                transform: `translateX(-50%) rotate(${flapperDeflection}deg)`
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Needle Base Ring */}
                <div className="w-7 h-7 rounded-full bg-black/60 border-2 border-amber-400 shadow-lg flex items-center justify-center backdrop-blur-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                </div>
                {/* Needle Tip Arrow */}
                <div
                  className="w-0 h-0 -mt-1"
                  style={{
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "32px solid #EF4444",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.8))"
                  }}
                />
              </div>
            </div>

            {/* Canvas Wheel */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer transition-transform hover:scale-[1.008] active:scale-[0.995]"
                onClick={handleSpin}
                title={isSpinning ? "Đang quay..." : "Nhấp để quay ngay!"}
              />

              {/* Big Center SPIN Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 font-bold text-sm sm:text-base uppercase tracking-wider flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all cursor-pointer ${
                  isSpinning
                    ? "bg-zinc-600 text-zinc-300 opacity-90 cursor-not-allowed scale-95"
                    : "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:scale-105 active:scale-95 text-white"
                }`}
              >
                <Play className="w-5 h-5 fill-current mb-0.5" />
                <span>{isSpinning ? "ĐANG QUAY" : "QUAY"}</span>
              </button>
            </div>

            {/* Winning Banner Alert */}
            {winningItem && (
              <div className="w-full mt-4 p-4 rounded-2xl bg-white/[0.12] backdrop-blur-[24px] border border-amber-400/50 shadow-[0_8px_32px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shrink-0 shadow-md">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      🎉 KẾT QUẢ VÒNG QUAY:
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                      {winningItem.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRemoveWonItem}
                    className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-200 border border-white/15 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Xóa ô này khỏi vòng quay"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Xóa Ô Này</span>
                  </button>
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-amber-500/25 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Quay Lại</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Controls, Duration Adjustment & Wheel Slices */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. CHỈNH THỜI GIAN VÒNG QUAY (Spin Duration Controls) */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-[20px] border border-white/15 shadow-md">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/80">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Thời Gian Vòng Quay</span>
                </div>
                {/* Direct Number Input */}
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-emerald-400/40">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    step={0.5}
                    value={spinDuration}
                    disabled={isSpinning}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleSetDuration(val);
                    }}
                    className="w-12 bg-transparent text-right font-mono font-bold text-xs text-emerald-300 focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-emerald-400">Giây</span>
                </div>
              </div>

              {/* Slider Duration */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={spinDuration}
                  disabled={isSpinning}
                  onChange={(e) => handleSetDuration(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>1s (Chớp nhoáng)</span>
                  <span>5s (Chuẩn)</span>
                  <span>15s (Kịch tính)</span>
                  <span>30s (Cực lâu)</span>
                </div>
              </div>

              {/* Quick Duration Buttons */}
              <div className="grid grid-cols-6 gap-1.5 mt-3">
                {[
                  { sec: 1, label: "1s" },
                  { sec: 3, label: "3s" },
                  { sec: 5, label: "5s" },
                  { sec: 8, label: "8s" },
                  { sec: 12, label: "12s" },
                  { sec: 20, label: "20s" }
                ].map((item) => (
                  <button
                    key={item.sec}
                    onClick={() => handleSetDuration(item.sec)}
                    disabled={isSpinning}
                    className={`py-1.5 rounded-xl text-xs font-semibold uppercase border transition-all cursor-pointer ${
                      spinDuration === item.sec
                        ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-white/20 shadow-sm"
                        : "bg-white/5 hover:bg-white/15 text-white/70 border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quick Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShuffleItems}
                disabled={isSpinning}
                className="flex-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] transition-all active:scale-95"
                title="Xáo trộn vị trí các ô thưởng"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Xáo Trộn</span>
              </button>

              <button
                onClick={handleRandomizeColors}
                disabled={isSpinning}
                className="flex-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] transition-all active:scale-95"
                title="Đổi màu sắc ngẫu nhiên"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Đổi Màu</span>
              </button>

              <button
                onClick={() => setActiveTab("edit")}
                className="flex-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] shadow-md transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Ô Mới</span>
              </button>
            </div>

            {/* 3. Items List of the Active Wheel */}
            <div className="p-4 rounded-2xl bg-white/[0.07] backdrop-blur-[20px] border border-white/15 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-white/80">
                  Danh Sách {items.length} Ô Thưởng
                </span>
                <span className="text-[11px] font-mono text-white/60">
                  Tỷ lệ: {(100 / items.length).toFixed(1)}% / ô
                </span>
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-mono text-white/40 text-[10px]">#{idx + 1}</span>
                      <span className="font-semibold text-white truncate">{item.label}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isSpinning || items.length <= 2}
                      className="p-1 text-white/40 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                      title="Xóa ô này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Recent Wins History */}
            {recentWins.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-[20px] border border-white/15 text-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lịch Sử Lượt Quay Gần Đây</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {recentWins.map((win, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-white whitespace-nowrap flex items-center gap-1.5 shrink-0"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: win.item.color }}
                      />
                      <span>{win.item.label}</span>
                      <span className="text-[9px] text-white/40">{win.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Tab: Chỉnh Sửa & Thêm Ô (Edit Wheel - Spatial Glass) */}
      {activeTab === "edit" && (
        <div className="p-6 rounded-[24px] bg-white/[0.08] backdrop-blur-[24px] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-amber-400" />
                <span>Chỉnh Sửa Vòng Quay: {activePreset.title}</span>
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Thêm, xóa hoặc chỉnh sửa nội dung và màu sắc của từng ô trên vòng quay.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("bulk")}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold uppercase transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Dán Danh Sách Nhanh</span>
              </button>

              <button
                onClick={() => setActiveTab("wheel")}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold uppercase shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Xong & Quay Thử</span>
              </button>
            </div>
          </div>

          {/* Add New Item Form */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold uppercase text-amber-300 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Thêm Ô Thưởng Mới</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                placeholder="Nhập tên ô mới (vd: Trà đào cam sả, +500 Orbs, Bạn Nam...)"
                className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-amber-400 min-h-[44px] w-full"
              />

              {/* Color Palette Picker */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewItemColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      newItemColor === c ? "border-white scale-110 shadow-md" : "border-black/30 opacity-80"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <button
                onClick={handleAddItem}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs uppercase shadow-md cursor-pointer min-h-[44px] shrink-0 active:scale-95 transition-all"
              >
                Thêm Vào Vòng Quay
              </button>
            </div>
          </div>

          {/* Slices Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/60 px-1">
              <span>DANH SÁCH {items.length} Ô HIỆN CÓ:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShuffleItems}
                  className="hover:text-amber-300 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Xáo trộn
                </button>
                <button
                  onClick={handleRandomizeColors}
                  className="hover:text-amber-300 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Phối màu mới
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-mono text-xs text-white/40 font-bold w-6">
                      #{idx + 1}
                    </span>

                    {/* Color chip */}
                    <div
                      className="w-6 h-6 rounded-full border border-white/30 shadow-inner shrink-0"
                      style={{ backgroundColor: item.color }}
                    />

                    {editingItem?.id === item.id ? (
                      <input
                        type="text"
                        value={editingItem.label}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, label: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const updated = items.map((i) =>
                              i.id === item.id ? { ...i, label: editingItem.label } : i
                            );
                            updateCurrentItems(updated);
                            setEditingItem(null);
                          }
                        }}
                        className="flex-1 bg-black/40 border border-amber-400 rounded-xl px-3 py-1 text-xs text-white"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-semibold text-white truncate">
                        {item.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {editingItem?.id === item.id ? (
                      <button
                        onClick={() => {
                          const updated = items.map((i) =>
                            i.id === item.id ? { ...i, label: editingItem.label } : i
                          );
                          updateCurrentItems(updated);
                          setEditingItem(null);
                        }}
                        className="p-2 rounded-full bg-emerald-500 text-white cursor-pointer hover:bg-emerald-400 transition-colors"
                        title="Lưu thay đổi"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingItem({ id: item.id, label: item.label, color: item.color })}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 cursor-pointer transition-colors"
                        title="Sửa tên"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length <= 2}
                      className="p-2 rounded-full bg-white/10 hover:bg-rose-500/30 text-white/50 hover:text-rose-300 border border-white/15 disabled:opacity-30 cursor-pointer transition-colors"
                      title="Xóa ô này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: Mẫu Có Sẵn & Tạo Vòng Quay Mới (Presets - Spatial Glass) */}
      {activeTab === "presets" && (
        <div className="p-6 rounded-[24px] bg-white/[0.08] backdrop-blur-[24px] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                <List className="w-5 h-5 text-amber-400" />
                <span>Kho Vòng Quay Mẫu & Tùy Biến ({presets.length})</span>
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Chọn vòng quay có sẵn hoặc tạo một vòng quay hoàn toàn mới theo chủ đề của bạn.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetPresets}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 text-xs font-semibold uppercase transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Khôi phục lại các mẫu mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi Phục Mẫu</span>
              </button>

              <button
                onClick={() => setShowNewWheelModal(true)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold uppercase shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tạo Vòng Quay Mới</span>
              </button>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presets.map((preset) => {
              const isSelected = preset.id === activePreset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    handleSelectPreset(preset.id);
                    setActiveTab("wheel");
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-white/[0.14] border-amber-400 shadow-[0_8px_24px_rgba(245,158,11,0.2)]"
                      : "bg-white/[0.06] border-white/15 hover:border-white/30 hover:bg-white/[0.10]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/40 text-amber-300 border border-white/10 uppercase">
                        {preset.items.length} Ô
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ĐANG DÙNG
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    {/* Slice Preview Bar */}
                    <div className="flex items-center -space-x-1">
                      {preset.items.slice(0, 6).map((it, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: it.color }}
                        />
                      ))}
                      {preset.items.length > 6 && (
                        <span className="text-[9px] font-mono text-white/40 pl-1.5">
                          +{preset.items.length - 6}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                      Chọn <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tab: Nhập Dán Danh Sách Hàng Loạt (Bulk Text - Spatial Glass) */}
      {activeTab === "bulk" && (
        <div className="p-6 rounded-[24px] bg-white/[0.08] backdrop-blur-[24px] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                <Copy className="w-5 h-5 text-cyan-400" />
                <span>Nhập Dán Nhanh Danh Sách Ô Thưởng</span>
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                Dán danh sách tên lựa chọn (mỗi dòng là một ô trên vòng quay).
              </p>
            </div>

            <button
              onClick={() => setActiveTab("wheel")}
              className="px-4 py-2 rounded-full bg-white/10 text-white/80 hover:text-white border border-white/15 text-xs font-semibold uppercase cursor-pointer transition-all"
            >
              Hủy
            </button>
          </div>

          <textarea
            rows={8}
            value={bulkTextInput}
            onChange={(e) => setBulkTextInput(e.target.value)}
            placeholder={`Ví dụ:\nCơm tấm sườn\nPhở bò tái\nBún đậu mắm tôm\nPizza hải sản\nGà rán giòn`}
            className="w-full bg-black/40 border border-white/20 rounded-2xl p-4 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleApplyBulkText}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs uppercase shadow-md cursor-pointer transition-all active:scale-95"
            >
              Áp Dụng Vào Vòng Quay Ngay
            </button>
          </div>
        </div>
      )}

      {/* 6. Modal: Tạo Vòng Quay Mới (Spatial Glass) */}
      {showNewWheelModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-white/[0.12] backdrop-blur-[24px] border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 space-y-4 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Tạo Vòng Quay Tùy Biến Mới</span>
              </h3>
              <button
                onClick={() => setShowNewWheelModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-white/80 block mb-1.5">
                Tên Chủ Đề Vòng Quay
              </label>
              <input
                type="text"
                value={newWheelName}
                onChange={(e) => setNewWheelName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNewWheel()}
                placeholder="vd: Bốc Thăm Trúng Thưởng, Chọn Người Rửa Bát..."
                className="w-full bg-black/40 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewWheelModal(false)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 text-xs font-semibold uppercase cursor-pointer transition-all"
              >
                Hủy Bỏ
              </button>

              <button
                onClick={handleCreateNewWheel}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold uppercase shadow-md cursor-pointer transition-all active:scale-95"
              >
                Tạo Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
