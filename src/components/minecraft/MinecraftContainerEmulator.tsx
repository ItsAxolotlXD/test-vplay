import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CONTAINER_CONFIGS,
  ContainerType,
  InventorySlot,
  MinecraftItem,
  MINECRAFT_ITEMS_DATABASE,
  PRESET_LOADOUTS,
  LoadoutPreset
} from './minecraftItemsData';
import { MinecraftItemIcon } from './MinecraftItemIcon';
import { mcAudio } from './minecraftAudio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Plus,
  Search,
  Wrench,
  Layers,
  Box,
  Shuffle,
  ArrowUpDown,
  Flame,
  Check,
  X,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CursorState {
  item: MinecraftItem | null;
  count: number;
  customName?: string;
}

export const MinecraftContainerEmulator: React.FC = () => {
  // Current active container type
  const [containerType, setContainerType] = useState<ContainerType>('double_chest');
  const activeConfig = CONTAINER_CONFIGS[containerType];

  // Container slots state
  const [containerSlots, setContainerSlots] = useState<InventorySlot[]>(() => {
    return Array.from({ length: 54 }, (_, i) => ({
      slotIndex: i,
      item: null,
      count: 0
    }));
  });

  // Player inventory state (27 main storage slots + 9 hotbar slots = 36 slots total)
  const [playerSlots, setPlayerSlots] = useState<InventorySlot[]>(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      slotIndex: i,
      item: null,
      count: 0
    }));
  });

  // Player Armor & Offhand slots
  const [armorSlots, setArmorSlots] = useState<{
    helmet: InventorySlot;
    chestplate: InventorySlot;
    leggings: InventorySlot;
    boots: InventorySlot;
    offhand: InventorySlot;
  }>({
    helmet: { slotIndex: 0, item: null, count: 0 },
    chestplate: { slotIndex: 1, item: null, count: 0 },
    leggings: { slotIndex: 2, item: null, count: 0 },
    boots: { slotIndex: 3, item: null, count: 0 },
    offhand: { slotIndex: 4, item: null, count: 0 },
  });

  // Crafting table 3x3 + output slot state
  const [craftingGrid, setCraftingGrid] = useState<InventorySlot[]>(() =>
    Array.from({ length: 9 }, (_, i) => ({ slotIndex: i, item: null, count: 0 }))
  );
  const [craftingOutput, setCraftingOutput] = useState<InventorySlot>({
    slotIndex: 9,
    item: null,
    count: 0
  });

  // Furnace State (Input, Fuel, Output)
  const [furnaceInput, setFurnaceInput] = useState<InventorySlot>({ slotIndex: 0, item: null, count: 0 });
  const [furnaceFuel, setFurnaceFuel] = useState<InventorySlot>({ slotIndex: 1, item: null, count: 0 });
  const [furnaceOutput, setFurnaceOutput] = useState<InventorySlot>({ slotIndex: 2, item: null, count: 0 });
  const [smeltProgress, setSmeltProgress] = useState(0);
  const [isBurning, setIsBurning] = useState(false);

  // Held cursor item
  const [cursorItem, setCursorItem] = useState<CursorState>({ item: null, count: 0 });

  // Mouse coordinates for cursor-following item & tooltip
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSlot, setHoveredSlot] = useState<{
    item: MinecraftItem;
    count: number;
    customName?: string;
  } | null>(null);

  // UI Drawer & Modal States
  const [isCreativeDrawerOpen, setIsCreativeDrawerOpen] = useState(false);
  const [creativeSearch, setCreativeSearch] = useState('');
  const [creativeCategory, setCreativeCategory] = useState<string>('all');
  const [isAnvilModalOpen, setIsAnvilModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Custom Item Anvil Editor State
  const [anvilTargetSlot, setAnvilTargetSlot] = useState<{ area: 'container' | 'player'; index: number } | null>(null);
  const [anvilItemName, setAnvilItemName] = useState('');
  const [anvilLoreLines, setAnvilLoreLines] = useState('');
  const [anvilIsEnchanted, setAnvilIsEnchanted] = useState(true);

  // Initial Load: Load Preset 0 (End Fight Kit)
  useEffect(() => {
    applyPreset(PRESET_LOADOUTS[0]);
  }, []);

  // Update mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Furnace Smelting Loop Simulation
  useEffect(() => {
    if (containerType !== 'furnace') return;
    let timer: any = null;

    if (furnaceInput.item && furnaceFuel.item && furnaceInput.count > 0 && furnaceFuel.count > 0) {
      setIsBurning(true);
      timer = setInterval(() => {
        setSmeltProgress((prev) => {
          if (prev >= 100) {
            // Finished 1 smelt cycle
            mcAudio.playPop(1.4);
            // Deduct 1 input
            setFurnaceInput((curr) => {
              const newCount = curr.count - 1;
              return {
                ...curr,
                count: newCount,
                item: newCount > 0 ? curr.item : null
              };
            });
            // Produce output
            setFurnaceOutput((curr) => {
              const resultItem = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'iron_ingot') || MINECRAFT_ITEMS_DATABASE[0];
              const newCount = curr.item ? curr.count + 1 : 1;
              return {
                ...curr,
                item: resultItem,
                count: Math.min(newCount, 64)
              };
            });
            return 0;
          }
          return prev + 5;
        });
      }, 150);
    } else {
      setIsBurning(false);
      setSmeltProgress(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [containerType, furnaceInput, furnaceFuel]);

  // Handle Preset Load
  const applyPreset = (preset: LoadoutPreset) => {
    mcAudio.playChestOpen();
    setContainerType(preset.containerType);
    const newContainer = Array.from({ length: 54 }, (_, i) => ({
      slotIndex: i,
      item: null as MinecraftItem | null,
      count: 0
    }));

    preset.containerItems.forEach((c) => {
      const itemDef = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === c.itemId);
      if (itemDef && c.slot < newContainer.length) {
        newContainer[c.slot] = {
          slotIndex: c.slot,
          item: itemDef,
          count: c.count
        };
      }
    });
    setContainerSlots(newContainer);

    const newPlayer = Array.from({ length: 36 }, (_, i) => ({
      slotIndex: i,
      item: null as MinecraftItem | null,
      count: 0
    }));

    preset.playerItems.forEach((p) => {
      const itemDef = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === p.itemId);
      if (itemDef && p.slot < newPlayer.length) {
        newPlayer[p.slot] = {
          slotIndex: p.slot,
          item: itemDef,
          count: p.count
        };
      }
    });
    setPlayerSlots(newPlayer);
  };

  // Helper: Get item from a specific area
  const getSlot = (area: 'container' | 'player', index: number): InventorySlot => {
    return area === 'container' ? containerSlots[index] : playerSlots[index];
  };

  // Helper: Set item in a specific area
  const setSlot = (area: 'container' | 'player', index: number, newSlot: InventorySlot) => {
    if (area === 'container') {
      setContainerSlots((prev) => {
        const next = [...prev];
        next[index] = newSlot;
        return next;
      });
    } else {
      setPlayerSlots((prev) => {
        const next = [...prev];
        next[index] = newSlot;
        return next;
      });
    }
  };

  // Click Handler for standard inventory slots
  const handleSlotClick = (
    e: React.MouseEvent,
    area: 'container' | 'player',
    index: number
  ) => {
    e.preventDefault();
    const isRightClick = e.button === 2;
    const isShiftClick = e.shiftKey;
    const current = getSlot(area, index);

    // 1. SHIFT + LEFT CLICK: Quick Move between container and player inventory
    if (isShiftClick && current.item && current.count > 0) {
      mcAudio.playPop(1.1);
      const targetArea = area === 'container' ? 'player' : 'container';
      const targetList = targetArea === 'container' ? [...containerSlots] : [...playerSlots];
      let remainingCount = current.count;

      // First pass: try merging into existing matching slots that are not full
      for (let i = 0; i < (targetArea === 'container' ? activeConfig.slots : 36); i++) {
        if (targetList[i].item?.id === current.item.id) {
          const maxStack = current.item.maxStack;
          const space = maxStack - targetList[i].count;
          if (space > 0) {
            const add = Math.min(space, remainingCount);
            targetList[i] = {
              ...targetList[i],
              count: targetList[i].count + add
            };
            remainingCount -= add;
            if (remainingCount <= 0) break;
          }
        }
      }

      // Second pass: place in first available empty slot
      if (remainingCount > 0) {
        for (let i = 0; i < (targetArea === 'container' ? activeConfig.slots : 36); i++) {
          if (!targetList[i].item || targetList[i].count === 0) {
            targetList[i] = {
              ...targetList[i],
              item: current.item,
              count: remainingCount,
              customName: current.customName
            };
            remainingCount = 0;
            break;
          }
        }
      }

      // Update target list & clear or reduce source slot
      if (targetArea === 'container') {
        setContainerSlots(targetList);
      } else {
        setPlayerSlots(targetList);
      }

      setSlot(area, index, {
        ...current,
        item: remainingCount > 0 ? current.item : null,
        count: remainingCount
      });
      return;
    }

    // 2. RIGHT CLICK LOGIC
    if (isRightClick) {
      // Cursor has item -> place exactly 1 into slot
      if (cursorItem.item && cursorItem.count > 0) {
        if (!current.item || current.count === 0) {
          // Place 1 into empty slot
          setSlot(area, index, {
            ...current,
            item: cursorItem.item,
            count: 1,
            customName: cursorItem.customName
          });
          const newCursorCount = cursorItem.count - 1;
          setCursorItem({
            item: newCursorCount > 0 ? cursorItem.item : null,
            count: newCursorCount,
            customName: newCursorCount > 0 ? cursorItem.customName : undefined
          });
          mcAudio.playPop(1.0);
        } else if (current.item.id === cursorItem.item.id && current.count < current.item.maxStack) {
          // Add 1 to matching slot
          setSlot(area, index, {
            ...current,
            count: current.count + 1
          });
          const newCursorCount = cursorItem.count - 1;
          setCursorItem({
            item: newCursorCount > 0 ? cursorItem.item : null,
            count: newCursorCount,
            customName: newCursorCount > 0 ? cursorItem.customName : undefined
          });
          mcAudio.playPop(1.0);
        }
      } else if (current.item && current.count > 0) {
        // Cursor is empty -> split stack in half (take Math.ceil(count / 2))
        const take = Math.ceil(current.count / 2);
        const leave = current.count - take;
        setCursorItem({
          item: current.item,
          count: take,
          customName: current.customName
        });
        setSlot(area, index, {
          ...current,
          item: leave > 0 ? current.item : null,
          count: leave
        });
        mcAudio.playPop(0.95);
      }
      return;
    }

    // 3. LEFT CLICK LOGIC
    if (!cursorItem.item || cursorItem.count === 0) {
      // Cursor empty -> pick up whole stack
      if (current.item && current.count > 0) {
        setCursorItem({
          item: current.item,
          count: current.count,
          customName: current.customName
        });
        setSlot(area, index, {
          ...current,
          item: null,
          count: 0,
          customName: undefined
        });
        mcAudio.playPop(1.0);
      }
    } else {
      // Cursor has item
      if (!current.item || current.count === 0) {
        // Drop whole cursor into empty slot
        setSlot(area, index, {
          ...current,
          item: cursorItem.item,
          count: cursorItem.count,
          customName: cursorItem.customName
        });
        setCursorItem({ item: null, count: 0 });
        mcAudio.playPop(1.0);
      } else if (current.item.id === cursorItem.item.id) {
        // Same item: merge stacks
        const maxStack = current.item.maxStack;
        const available = maxStack - current.count;
        if (available > 0) {
          const move = Math.min(available, cursorItem.count);
          setSlot(area, index, {
            ...current,
            count: current.count + move
          });
          const rem = cursorItem.count - move;
          setCursorItem({
            item: rem > 0 ? cursorItem.item : null,
            count: rem,
            customName: rem > 0 ? cursorItem.customName : undefined
          });
          mcAudio.playPop(1.05);
        }
      } else {
        // Different item: swap cursor and slot
        const temp = { ...current };
        setSlot(area, index, {
          ...current,
          item: cursorItem.item,
          count: cursorItem.count,
          customName: cursorItem.customName
        });
        setCursorItem({
          item: temp.item,
          count: temp.count,
          customName: temp.customName
        });
        mcAudio.playPop(1.1);
      }
    }
  };

  // Quick Sort Action: Sorts container or player inventory items by category and name
  const handleSort = (target: 'container' | 'player') => {
    mcAudio.playPop(1.3);
    if (target === 'container') {
      const items = containerSlots
        .filter((s) => s.item && s.count > 0)
        .sort((a, b) => {
          if (a.item!.category !== b.item!.category) {
            return a.item!.category.localeCompare(b.item!.category);
          }
          return a.item!.name.localeCompare(b.item!.name);
        });

      const next = Array.from({ length: 54 }, (_, i) => ({
        slotIndex: i,
        item: items[i]?.item || null,
        count: items[i]?.count || 0,
        customName: items[i]?.customName
      }));
      setContainerSlots(next);
    } else {
      // Sort main 27 slots (keep hotbar untouched)
      const mainItems = playerSlots
        .slice(0, 27)
        .filter((s) => s.item && s.count > 0)
        .sort((a, b) => a.item!.name.localeCompare(b.item!.name));

      const next = [...playerSlots];
      for (let i = 0; i < 27; i++) {
        next[i] = {
          slotIndex: i,
          item: mainItems[i]?.item || null,
          count: mainItems[i]?.count || 0,
          customName: mainItems[i]?.customName
        };
      }
      setPlayerSlots(next);
    }
  };

  // Random Dungeon Loot Generator
  const handleFillRandomLoot = () => {
    mcAudio.playChestOpen();
    const countSlots = activeConfig.slots;
    const newContainer = Array.from({ length: 54 }, (_, i) => ({
      slotIndex: i,
      item: null as MinecraftItem | null,
      count: 0
    }));

    const numLoot = Math.floor(countSlots * 0.4) + 4;
    const chosenIndices = new Set<number>();
    while (chosenIndices.size < numLoot) {
      chosenIndices.add(Math.floor(Math.random() * countSlots));
    }

    chosenIndices.forEach((idx) => {
      const randItem = MINECRAFT_ITEMS_DATABASE[Math.floor(Math.random() * MINECRAFT_ITEMS_DATABASE.length)];
      const randCount = randItem.maxStack === 1 ? 1 : Math.floor(Math.random() * Math.min(randItem.maxStack, 32)) + 1;
      newContainer[idx] = {
        slotIndex: idx,
        item: randItem,
        count: randCount
      };
    });

    setContainerSlots(newContainer);
  };

  // Clear Container
  const handleClear = (target: 'container' | 'player' | 'all') => {
    mcAudio.playChestClose();
    if (target === 'container' || target === 'all') {
      setContainerSlots(
        Array.from({ length: 54 }, (_, i) => ({ slotIndex: i, item: null, count: 0 }))
      );
    }
    if (target === 'player' || target === 'all') {
      setPlayerSlots(
        Array.from({ length: 36 }, (_, i) => ({ slotIndex: i, item: null, count: 0 }))
      );
      setCursorItem({ item: null, count: 0 });
    }
  };

  // Export Container NBT / JSON Data
  const handleExportJSON = () => {
    const payload = {
      containerType,
      timestamp: Date.now(),
      containerItems: containerSlots
        .filter((s) => s.item && s.count > 0)
        .map((s) => ({
          slot: s.slotIndex,
          id: s.item!.id,
          name: s.item!.name,
          count: s.count,
          customName: s.customName
        })),
      playerItems: playerSlots
        .filter((s) => s.item && s.count > 0)
        .map((s) => ({
          slot: s.slotIndex,
          id: s.item!.id,
          name: s.item!.name,
          count: s.count,
          customName: s.customName
        }))
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    mcAudio.playLevelUp();
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Import JSON Data
  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.containerType) setContainerType(parsed.containerType);

      if (Array.isArray(parsed.containerItems)) {
        const next: InventorySlot[] = Array.from({ length: 54 }, (_, i) => ({ slotIndex: i, item: null, count: 0 }));
        parsed.containerItems.forEach((ci: any) => {
          const itemDef = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === ci.id);
          if (itemDef && ci.slot < next.length) {
            next[ci.slot] = {
              slotIndex: ci.slot,
              item: itemDef,
              count: ci.count || 1,
              customName: ci.customName
            };
          }
        });
        setContainerSlots(next);
      }

      if (Array.isArray(parsed.playerItems)) {
        const nextP: InventorySlot[] = Array.from({ length: 36 }, (_, i) => ({ slotIndex: i, item: null, count: 0 }));
        parsed.playerItems.forEach((pi: any) => {
          const itemDef = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === pi.id);
          if (itemDef && pi.slot < nextP.length) {
            nextP[pi.slot] = {
              slotIndex: pi.slot,
              item: itemDef,
              count: pi.count || 1,
              customName: pi.customName
            };
          }
        });
        setPlayerSlots(nextP);
      }

      mcAudio.playLevelUp();
      setIsImportModalOpen(false);
      setImportJsonText('');
    } catch {
      alert('Định dạng JSON không hợp lệ!');
    }
  };

  // Filtered Creative Items
  const filteredCreativeItems = MINECRAFT_ITEMS_DATABASE.filter((item) => {
    const matchCat = creativeCategory === 'all' || item.category === creativeCategory;
    const matchSearch =
      creativeSearch === '' ||
      item.name.toLowerCase().includes(creativeSearch.toLowerCase()) ||
      (item.lore && item.lore.some((l) => l.toLowerCase().includes(creativeSearch.toLowerCase())));
    return matchCat && matchSearch;
  });

  // Spawn Creative Item directly into cursor or first empty slot
  const handleSpawnCreativeItem = (item: MinecraftItem) => {
    mcAudio.playPop(1.2);
    setCursorItem({
      item,
      count: item.maxStack
    });
  };

  // Anvil Enchanter Save Handler
  const handleSaveAnvil = () => {
    if (!anvilTargetSlot) return;
    mcAudio.playAnvil();
    const current = getSlot(anvilTargetSlot.area, anvilTargetSlot.index);
    if (current.item) {
      const loreArr = anvilLoreLines
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      const updatedItem: MinecraftItem = {
        ...current.item,
        lore: loreArr.length > 0 ? loreArr : current.item.lore,
        enchanted: anvilIsEnchanted
      };
      setSlot(anvilTargetSlot.area, anvilTargetSlot.index, {
        ...current,
        item: updatedItem,
        customName: anvilItemName.trim() || undefined
      });
    }
    setIsAnvilModalOpen(false);
    setAnvilTargetSlot(null);
  };

  // Open Anvil for a specific slot
  const handleOpenAnvilForSlot = (area: 'container' | 'player', index: number) => {
    const slot = getSlot(area, index);
    if (!slot.item) return;
    setAnvilTargetSlot({ area, index });
    setAnvilItemName(slot.customName || slot.item.name);
    setAnvilLoreLines((slot.item.lore || []).join('\n'));
    setAnvilIsEnchanted(slot.item.enchanted || false);
    setIsAnvilModalOpen(true);
  };

  return (
    <div 
      className="space-y-6 select-none font-sans text-slate-100 pb-16 relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider mb-1">
            <Box className="w-4 h-4 text-[#00E5FF]" />
            <span>Minecraft Sandbox Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Emulate Minecraft Container GUI</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Interactive v1.21
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mô phỏng rương chứa đồ (Chest, Double Chest, Ender Chest, Shulker Box, Hopper, Furnace) theo phong cách Minecraft chuẩn pixel art. Hỗ trợ kéo thả, tách stack, gán phù phép (Enchant) và quản lý Inventory.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Creative Item Palette Drawer Button */}
          <button
            onClick={() => {
              mcAudio.playClick();
              setIsCreativeDrawerOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            title="Mở bảng Creative để lấy bất kỳ item nào"
          >
            <Plus className="w-4 h-4" />
            <span>Lấy Item (Creative)</span>
          </button>

          {/* Random Dungeon Loot */}
          <button
            onClick={handleFillRandomLoot}
            className="px-3 py-2 rounded-xl bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Đổ đầy rương với vật phẩm ngẫu nhiên"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Loot ngẫu nhiên</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Xuất bố cục kho đồ ra JSON"
          >
            {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedMessage ? 'Đã sao chép!' : 'Xuất JSON'}</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Nhập bố cục từ JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              const muted = mcAudio.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-xl bg-[#282832] hover:bg-[#343442] text-slate-300 hover:text-white border border-[#3E3E4C] text-xs transition-all cursor-pointer"
            title={isMuted ? 'Bật âm thanh Minecraft' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Clear All */}
          <button
            onClick={() => handleClear('all')}
            className="p-2 rounded-xl bg-[#282832] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-[#3E3E4C] hover:border-rose-500/40 text-xs transition-all cursor-pointer"
            title="Xóa sạch rương và kho đồ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Loadouts Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0 font-bold">
          Bộ mẫu sẵn (Loadouts):
        </span>
        {PRESET_LOADOUTS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className="px-3 py-1.5 rounded-full bg-[#1C1C22] hover:bg-[#2A2A34] text-slate-300 hover:text-white border border-[#343440] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-[#FFD600]" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Container Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(Object.keys(CONTAINER_CONFIGS) as ContainerType[]).map((type) => {
          const cfg = CONTAINER_CONFIGS[type];
          const isActive = containerType === type;
          return (
            <button
              key={type}
              onClick={() => {
                mcAudio.playChestOpen();
                setContainerType(type);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-md shadow-[#E50914]/25'
                  : 'bg-[#18181E] text-slate-400 hover:text-white hover:bg-[#24242E] border-[#2C2C38]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{cfg.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Minecraft GUI Box Container */}
      <div className="flex justify-center items-start">
        <div 
          className="mc-gui-frame p-4 sm:p-6 rounded-2xl shadow-2xl relative border-4 border-[#373737] max-w-full overflow-x-auto"
          style={{
            backgroundColor: activeConfig.color || '#C6C6C6',
            boxShadow: 'inset 3px 3px 0px #FFFFFF, inset -3px -3px 0px #555555, 0 20px 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Top Header: Container Title & Sort Action */}
          <div className="flex items-center justify-between pb-3 px-1">
            <h3 
              className="text-base sm:text-lg font-bold tracking-wide"
              style={{ color: '#3F3F3F', fontFamily: 'monospace, sans-serif' }}
            >
              {activeConfig.title}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSort('container')}
                className="px-2.5 py-1 rounded bg-[#8B8B8B] hover:bg-[#9E9E9E] text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Tự động gom và sắp xếp rương"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sắp xếp</span>
              </button>

              <button
                onClick={() => handleClear('container')}
                className="px-2.5 py-1 rounded bg-[#8B8B8B] hover:bg-red-300 text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Dọn sạch rương"
              >
                <Trash2 className="w-3 h-3" />
                <span>Dọn</span>
              </button>
            </div>
          </div>

          {/* CONTAINER SLOTS GRID */}
          {containerType === 'furnace' ? (
            /* Special Furnace GUI Layout */
            <div className="flex flex-col items-center py-4 px-6 bg-[#C6C6C6] rounded-lg">
              <div className="flex items-center gap-8">
                {/* Input Slot & Fuel Slot */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#4F4F4F] font-mono font-bold mb-1">Vật liệu</span>
                    <SlotCell
                      slot={furnaceInput}
                      onClick={(e) => {
                        // Quick input slot interaction
                        if (cursorItem.item) {
                          setFurnaceInput({ slotIndex: 0, item: cursorItem.item, count: cursorItem.count });
                          setCursorItem({ item: null, count: 0 });
                          mcAudio.playPop(1.0);
                        } else if (furnaceInput.item) {
                          setCursorItem({ item: furnaceInput.item, count: furnaceInput.count });
                          setFurnaceInput({ slotIndex: 0, item: null, count: 0 });
                          mcAudio.playPop(1.0);
                        }
                      }}
                      onMouseEnter={() => furnaceInput.item && setHoveredSlot(furnaceInput as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>

                  {/* Animated Flame */}
                  <div className="flex items-center justify-center h-6">
                    <Flame className={`w-5 h-5 ${isBurning ? 'text-amber-500 animate-pulse scale-110' : 'text-[#888]'}`} />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#4F4F4F] font-mono font-bold mb-1">Nhiên liệu</span>
                    <SlotCell
                      slot={furnaceFuel}
                      onClick={(e) => {
                        if (cursorItem.item) {
                          setFurnaceFuel({ slotIndex: 1, item: cursorItem.item, count: cursorItem.count });
                          setCursorItem({ item: null, count: 0 });
                          mcAudio.playPop(1.0);
                        } else if (furnaceFuel.item) {
                          setCursorItem({ item: furnaceFuel.item, count: furnaceFuel.count });
                          setFurnaceFuel({ slotIndex: 1, item: null, count: 0 });
                          mcAudio.playPop(1.0);
                        }
                      }}
                      onMouseEnter={() => furnaceFuel.item && setHoveredSlot(furnaceFuel as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>
                </div>

                {/* Smelting Progress Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-4 bg-[#8B8B8B] rounded border border-[#373737] overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-150"
                      style={{ width: `${smeltProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#444]">
                    {smeltProgress > 0 ? `${smeltProgress}%` : 'Sẵn sàng'}
                  </span>
                </div>

                {/* Output Slot */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#4F4F4F] font-mono font-bold mb-1">Thành phẩm</span>
                  <div className="p-1 bg-[#8B8B8B] rounded border-2 border-[#373737]">
                    <SlotCell
                      slot={furnaceOutput}
                      size={44}
                      onClick={(e) => {
                        if (furnaceOutput.item) {
                          setCursorItem({ item: furnaceOutput.item, count: furnaceOutput.count });
                          setFurnaceOutput({ slotIndex: 2, item: null, count: 0 });
                          mcAudio.playPop(1.2);
                        }
                      }}
                      onMouseEnter={() => furnaceOutput.item && setHoveredSlot(furnaceOutput as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Grid Slots Container */
            <div 
              className="grid gap-[3px] p-2 bg-[#8B8B8B] rounded border-2 border-[#373737]"
              style={{
                gridTemplateColumns: `repeat(${activeConfig.cols}, minmax(0, 1fr))`,
                boxShadow: 'inset 2px 2px 0px #373737, inset -2px -2px 0px #FFFFFF'
              }}
            >
              {containerSlots.slice(0, activeConfig.slots).map((slot, index) => (
                <SlotCell
                  key={index}
                  slot={slot}
                  onClick={(e) => handleSlotClick(e, 'container', index)}
                  onContextMenu={(e) => handleSlotClick(e, 'container', index)}
                  onDoubleClick={() => handleOpenAnvilForSlot('container', index)}
                  onMouseEnter={() => slot.item && setHoveredSlot(slot as any)}
                  onMouseLeave={() => setHoveredSlot(null)}
                />
              ))}
            </div>
          )}

          {/* Middle Divider: Player Inventory Title */}
          <div className="flex items-center justify-between pt-5 pb-2 px-1">
            <h3 
              className="text-base sm:text-lg font-bold tracking-wide"
              style={{ color: '#3F3F3F', fontFamily: 'monospace, sans-serif' }}
            >
              Inventory (Kho đồ)
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSort('player')}
                className="px-2 py-0.5 rounded bg-[#8B8B8B] hover:bg-[#9E9E9E] text-black text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Sắp xếp kho đồ người chơi"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sắp xếp</span>
              </button>
            </div>
          </div>

          {/* PLAYER INVENTORY: Main 27 Storage Slots (3 rows of 9) */}
          <div 
            className="grid grid-cols-9 gap-[3px] p-2 bg-[#8B8B8B] rounded border-2 border-[#373737]"
            style={{
              boxShadow: 'inset 2px 2px 0px #373737, inset -2px -2px 0px #FFFFFF'
            }}
          >
            {playerSlots.slice(0, 27).map((slot, index) => (
              <SlotCell
                key={index}
                slot={slot}
                onClick={(e) => handleSlotClick(e, 'player', index)}
                onContextMenu={(e) => handleSlotClick(e, 'player', index)}
                onDoubleClick={() => handleOpenAnvilForSlot('player', index)}
                onMouseEnter={() => slot.item && setHoveredSlot(slot as any)}
                onMouseLeave={() => setHoveredSlot(null)}
              />
            ))}
          </div>

          {/* PLAYER HOTBAR: 9 Quick Slots */}
          <div className="pt-2">
            <div 
              className="grid grid-cols-9 gap-[3px] p-2 bg-[#8B8B8B] rounded border-2 border-[#373737]"
              style={{
                boxShadow: 'inset 2px 2px 0px #373737, inset -2px -2px 0px #FFFFFF'
              }}
            >
              {playerSlots.slice(27, 36).map((slot, index) => (
                <SlotCell
                  key={index + 27}
                  slot={slot}
                  isHotbar={true}
                  hotbarKey={index + 1}
                  onClick={(e) => handleSlotClick(e, 'player', index + 27)}
                  onContextMenu={(e) => handleSlotClick(e, 'player', index + 27)}
                  onDoubleClick={() => handleOpenAnvilForSlot('player', index + 27)}
                  onMouseEnter={() => slot.item && setHoveredSlot(slot as any)}
                  onMouseLeave={() => setHoveredSlot(null)}
                />
              ))}
            </div>
          </div>

          {/* Quick Tips Footer inside GUI */}
          <div className="mt-3 pt-2 border-t border-[#AFAFAF] flex items-center justify-between text-[10px] font-mono text-[#555] px-1">
            <span>Chuột trái: Lấy/Đặt | Chuột phải: Tách 1/2 hoặc đặt 1</span>
            <span className="hidden sm:inline">Shift + Click: Chuyển nhanh | Nhấp đúp: Enchant/Đổi tên</span>
          </div>
        </div>
      </div>

      {/* FLOATING CURSOR ITEM (Follows mouse when holding an item) */}
      {cursorItem.item && cursorItem.count > 0 && (
        <div
          className="fixed pointer-events-none z-99999 transform -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: mousePos.x,
            top: mousePos.y
          }}
        >
          <div className="relative">
            <MinecraftItemIcon
              iconType={cursorItem.item.iconType}
              enchanted={cursorItem.item.enchanted}
              size={36}
            />
            {cursorItem.count > 1 && (
              <span
                className="absolute -bottom-1 -right-1 font-mono font-bold text-xs leading-none text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,1)]"
                style={{
                  fontFamily: 'monospace, sans-serif',
                  textShadow: '2px 2px 0px #3f3f3f'
                }}
              >
                {cursorItem.count}
              </span>
            )}
          </div>
        </div>
      )}

      {/* MINECRAFT AUTHENTIC ITEM TOOLTIP */}
      {hoveredSlot && hoveredSlot.item && !cursorItem.item && (
        <div
          className="fixed pointer-events-none z-99999 p-2.5 rounded text-xs select-none max-w-xs shadow-2xl"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
            backgroundColor: 'rgba(16, 0, 16, 0.94)',
            border: '2px solid #280064',
            boxShadow: 'inset 0 0 6px rgba(80, 0, 255, 0.4), 0 8px 24px rgba(0,0,0,0.8)',
            fontFamily: 'monospace, sans-serif'
          }}
        >
          {/* Item Name / Custom Name */}
          <div 
            className="font-bold text-sm tracking-wide mb-1"
            style={{
              color:
                hoveredSlot.customName ? '#55FFFF' :
                hoveredSlot.item.rarity === 'epic' ? '#FF55FF' :
                hoveredSlot.item.rarity === 'rare' ? '#55FFFF' :
                hoveredSlot.item.rarity === 'uncommon' ? '#FFFF55' : '#FFFFFF',
              fontStyle: hoveredSlot.customName ? 'italic' : 'normal'
            }}
          >
            {hoveredSlot.customName || hoveredSlot.item.name}
          </div>

          {/* Lore Lines */}
          {hoveredSlot.item.lore && hoveredSlot.item.lore.length > 0 && (
            <div className="space-y-0.5 text-xs">
              {hoveredSlot.item.lore.map((line, idx) => (
                <div 
                  key={idx} 
                  style={{
                    color: line.startsWith('+') ? '#55FF55' : 
                           line.includes('Sharpness') || line.includes('Protection') || line.includes('Efficiency') || line.includes('Unbreaking') ? '#55FFFF' : 
                           line.includes('Damage') || line.includes('Explosive') ? '#FF5555' : '#AAAAAA'
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Item Category & Count Info */}
          <div className="mt-2 pt-1.5 border-t border-purple-900/60 flex items-center justify-between text-[10px] text-[#777777]">
            <span className="uppercase">{hoveredSlot.item.category}</span>
            <span>Stack: {hoveredSlot.count}/{hoveredSlot.item.maxStack}</span>
          </div>
        </div>
      )}

      {/* CREATIVE ITEM PALETTE DRAWER (Right sidebar popup) */}
      <AnimatePresence>
        {isCreativeDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#1A1A22] border-l border-[#2E2E38] shadow-2xl z-9999 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#2E2E38] flex items-center justify-between bg-[#15151B]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Kho Vật Phẩm Sáng Tạo (Creative)</h3>
              </div>
              <button
                onClick={() => setIsCreativeDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="p-3 border-b border-[#2E2E38] space-y-2 bg-[#181820]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm item (Sword, Pickaxe, Apple, TNT)..."
                  value={creativeSearch}
                  onChange={(e) => setCreativeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#22222C] border border-[#343440] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'combat', label: 'Vũ khí' },
                  { id: 'tools', label: 'Công cụ' },
                  { id: 'valuable', label: 'Kho báu' },
                  { id: 'food', label: 'Thức ăn' },
                  { id: 'building', label: 'Khối' },
                  { id: 'redstone', label: 'Redstone' },
                  { id: 'brewing', label: 'Thuốc' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCreativeCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      creativeCategory === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#22222C] text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {filteredCreativeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSpawnCreativeItem(item)}
                    className="p-2 rounded-xl bg-[#22222C] hover:bg-[#2F2F3D] border border-[#333342] hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group active:scale-95 shadow-xs"
                    title={`Lấy ${item.name} (${item.maxStack}x)`}
                  >
                    <MinecraftItemIcon
                      iconType={item.iconType}
                      enchanted={item.enchanted}
                      size={32}
                    />
                    <span className="text-[10px] text-slate-300 truncate w-full text-center group-hover:text-emerald-400">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[#2E2E38] bg-[#15151B] text-center text-xs text-slate-400">
              Nhấn vào item để lấy full stack vào tay chuột
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANVIL / ENCHANT MODAL DIALOG */}
      <AnimatePresence>
        {isAnvilModalOpen && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#1C1C24] border border-[#333340] rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2C2C38] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Wrench className="w-5 h-5" />
                  <h3 className="font-bold text-base text-white">Anvil: Tùy Chỉnh Phù Phép & Tên</h3>
                </div>
                <button
                  onClick={() => setIsAnvilModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tên Item Tùy Chỉnh (Custom Name):</label>
                  <input
                    type="text"
                    value={anvilItemName}
                    onChange={(e) => setAnvilItemName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#14141A] border border-[#2D2D38] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dòng Lore / Phù Phép (Mỗi dòng một hiệu ứng):</label>
                  <textarea
                    rows={4}
                    value={anvilLoreLines}
                    onChange={(e) => setAnvilLoreLines(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#14141A] border border-[#2D2D38] text-white focus:outline-none focus:border-amber-400 font-mono resize-none"
                    placeholder="Sharpness V&#10;Unbreaking III&#10;Mending"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={anvilIsEnchanted}
                    onChange={(e) => setAnvilIsEnchanted(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span>Bật hiệu ứng lấp lánh Phù Phép (Enchantment Glint)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAnvilModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#252530] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveAnvil}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md"
                >
                  Áp Dụng Đe (Anvil)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMPORT JSON MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#1C1C24] border border-[#333340] rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2C2C38] pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="font-bold text-base">Nhập Bố Cục Kho Đồ JSON</h3>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-slate-300 font-bold block">Dán mã JSON kho đồ:</label>
                <textarea
                  rows={8}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Dán JSON đã xuất trước đó vào đây..."
                  className="w-full p-3 rounded-xl bg-[#14141A] border border-[#2D2D38] text-white font-mono focus:outline-none focus:border-[#00E5FF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#252530] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApplyImport}
                  className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EAFF] text-black text-xs font-bold shadow-md"
                >
                  Tải vào Kho đồ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Minecraft Slot Component
interface SlotCellProps {
  slot: InventorySlot;
  size?: number;
  isHotbar?: boolean;
  hotbarKey?: number;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SlotCell: React.FC<SlotCellProps> = ({
  slot,
  size = 40,
  isHotbar = false,
  hotbarKey,
  onClick,
  onContextMenu,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex items-center justify-center cursor-pointer transition-transform hover:brightness-110 active:scale-95"
      style={{
        width: size,
        height: size,
        backgroundColor: '#8B8B8B',
        boxShadow: 'inset 2px 2px 0px #373737, inset -2px -2px 0px #FFFFFF',
        border: '1px solid #373737'
      }}
    >
      {/* Item Icon */}
      {slot.item && slot.count > 0 && (
        <div className="relative pointer-events-none">
          <MinecraftItemIcon
            iconType={slot.item.iconType}
            enchanted={slot.item.enchanted}
            size={size - 10}
          />
          {slot.count > 1 && (
            <span
              className="absolute -bottom-1 -right-1 font-mono font-bold text-[11px] leading-none text-white select-none"
              style={{
                fontFamily: 'monospace, sans-serif',
                textShadow: '2px 2px 0px #222222, 1px 1px 0px #000000'
              }}
            >
              {slot.count}
            </span>
          )}
        </div>
      )}

      {/* Hotbar numeric label */}
      {isHotbar && hotbarKey && !slot.item && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#666666] select-none pointer-events-none opacity-40">
          {hotbarKey}
        </span>
      )}
    </div>
  );
};
