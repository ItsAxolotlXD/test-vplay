import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CONTAINER_CONFIGS,
  ContainerType,
  InventorySlot,
  MinecraftItem,
  MINECRAFT_ITEMS_DATABASE,
  PRESET_LOADOUTS,
  LoadoutPreset,
  SMELTING_RECIPES,
  CRAFTING_RECIPES,
  FUEL_ITEMS
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
  Minimize2,
  BookOpen,
  ArrowRight
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

  // Furnace State (Input, Fuel, Output, and burn timer)
  const [furnaceInput, setFurnaceInput] = useState<InventorySlot>({ slotIndex: 0, item: null, count: 0 });
  const [furnaceFuel, setFurnaceFuel] = useState<InventorySlot>({ slotIndex: 1, item: null, count: 0 });
  const [furnaceOutput, setFurnaceOutput] = useState<InventorySlot>({ slotIndex: 2, item: null, count: 0 });
  const [smeltProgress, setSmeltProgress] = useState(0);
  const [burnFuelRemaining, setBurnFuelRemaining] = useState(0);
  const [burnFuelMax, setBurnFuelMax] = useState(800);
  const isBurning = burnFuelRemaining > 0;
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState(true);

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

  // Initial Load: Load Preset 0 (Furnace Smelter Kit)
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

  // Crafting Recipe Evaluator
  const evaluateCraftingRecipe = useCallback((grid: InventorySlot[]): { item: MinecraftItem; count: number } | null => {
    const ids = grid.map((s) => (s.item && s.count > 0 ? s.item.id : null));
    const countNonEmpty = ids.filter(Boolean).length;
    if (countNonEmpty === 0) return null;

    // 1. Bread (Bánh mì): 3 Wheat in any horizontal row
    const rows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    for (const r of rows) {
      if (ids[r[0]] === 'wheat' && ids[r[1]] === 'wheat' && ids[r[2]] === 'wheat' && countNonEmpty === 3) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bread');
        if (item) return { item, count: 1 };
      }
    }

    // 2. Crafting Table: 4 Oak Planks in 2x2
    const quads = [
      [0, 1, 3, 4],
      [1, 2, 4, 5],
      [3, 4, 6, 7],
      [4, 5, 7, 8]
    ];
    for (const q of quads) {
      if (q.every((idx) => ids[idx] === 'oak_planks') && countNonEmpty === 4) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'crafting_table_item');
        if (item) return { item, count: 1 };
      }
    }

    // 3. Sticks: 2 Oak Planks vertical
    const vertPairs = [
      [0, 3],
      [3, 6],
      [1, 4],
      [4, 7],
      [2, 5],
      [5, 8]
    ];
    for (const p of vertPairs) {
      if (ids[p[0]] === 'oak_planks' && ids[p[1]] === 'oak_planks' && countNonEmpty === 2) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'stick');
        if (item) return { item, count: 4 };
      }
    }

    // 4. Torches: 1 Coal above 1 Stick
    for (const p of vertPairs) {
      if (ids[p[0]] === 'coal' && ids[p[1]] === 'stick' && countNonEmpty === 2) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'torch');
        if (item) return { item, count: 4 };
      }
    }

    // 5. Golden Apple: 1 Apple in center (index 4) + 8 Gold Ingots
    if (ids[4] === 'apple' && countNonEmpty === 9) {
      const isSurrounded = [0, 1, 2, 3, 5, 6, 7, 8].every((idx) => ids[idx] === 'gold_ingot');
      if (isSurrounded) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'golden_apple');
        if (item) return { item, count: 1 };
      }
    }

    // 6. Mace (1.21 Tricky Trials): 1 Heavy Core directly above 1 Breeze Rod
    for (const p of vertPairs) {
      if (ids[p[0]] === 'heavy_core' && ids[p[1]] === 'breeze_rod' && countNonEmpty === 2) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mace');
        if (item) return { item, count: 1 };
      }
    }

    // 7. Eye of Ender: 1 Ender Pearl + 1 Blaze Powder (anywhere in grid)
    if (countNonEmpty === 2 && ids.includes('ender_pearl') && ids.includes('blaze_powder')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'eye_of_ender');
      if (item) return { item, count: 1 };
    }

    // 8. Golden Carrot: 1 Carrot in center (index 4) + 8 Gold Ingots
    if (ids[4] === 'carrot' && countNonEmpty === 9) {
      const isSurrounded = [0, 1, 2, 3, 5, 6, 7, 8].every((idx) => ids[idx] === 'gold_ingot');
      if (isSurrounded) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'golden_carrot');
        if (item) return { item, count: 1 };
      }
    }

    // 9. Block of Diamond: 9 Diamonds
    if (countNonEmpty === 9 && ids.every((id) => id === 'diamond')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'diamond_block');
      if (item) return { item, count: 1 };
    }

    // 10. Block of Iron: 9 Iron Ingots
    if (countNonEmpty === 9 && ids.every((id) => id === 'iron_ingot')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'iron_block');
      if (item) return { item, count: 1 };
    }

    // 11. Block of Gold: 9 Gold Ingots
    if (countNonEmpty === 9 && ids.every((id) => id === 'gold_ingot')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'gold_block');
      if (item) return { item, count: 1 };
    }

    // 12. Netherite Ingot: 4 Netherite Scraps + 4 Gold Ingots
    if (countNonEmpty === 8) {
      const scrapCount = ids.filter((id) => id === 'netherite_scrap').length;
      const goldCount = ids.filter((id) => id === 'gold_ingot').length;
      if (scrapCount === 4 && goldCount === 4) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'netherite_ingot');
        if (item) return { item, count: 1 };
      }
    }

    // 13. Crafter (1.21 Redstone): 5 Iron Ingots + 1 Crafting Table + 2 Redstone + 1 Dropper
    if (countNonEmpty === 9) {
      const ironCount = ids.filter((id) => id === 'iron_ingot').length;
      const tableCount = ids.filter((id) => id === 'crafting_table_item').length;
      const redstoneCount = ids.filter((id) => id === 'redstone_dust').length;
      const dropperCount = ids.filter((id) => id === 'dropper_item').length;
      if (ironCount === 5 && tableCount === 1 && redstoneCount === 2 && dropperCount === 1) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'crafter');
        if (item) return { item, count: 1 };
      }
    }

    // 14. Block of Gold Ore / Raw Gold Block: 9 Raw Gold
    if (countNonEmpty === 9 && ids.every((id) => id === 'raw_gold')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'gold_ore');
      if (item) return { item, count: 1 };
    }

    // 15. Single Wood / Log -> 4 Oak Planks
    if (countNonEmpty === 1 && (ids.some((id) => id === 'oak_wood_log') || ids.some((id) => id === 'oak_wood'))) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'oak_planks');
      if (item) return { item, count: 4 };
    }

    // 16. Cherry Log -> 4 Cherry Planks (1.20)
    if (countNonEmpty === 1 && (ids.some((id) => id === 'cherry_log') || ids.some((id) => id === 'cherry_wood') || ids.some((id) => id === 'stripped_cherry_log'))) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'cherry_planks');
      if (item) return { item, count: 4 };
    }

    // 17. Block of Bamboo -> 2 Bamboo Planks (1.20)
    if (countNonEmpty === 1 && (ids.some((id) => id === 'bamboo_block') || ids.some((id) => id === 'stripped_bamboo_block'))) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bamboo_planks');
      if (item) return { item, count: 2 };
    }

    // 18. Brush 1.20: Copper Ingot + Stick (or with feather/gem)
    if (countNonEmpty === 2 || countNonEmpty === 3) {
      const hasCopper = ids.some((id) => id === 'copper_ingot');
      const hasStick = ids.some((id) => id === 'stick');
      if (hasCopper && hasStick) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'brush');
        if (item) return { item, count: 1 };
      }
    }

    // 19. Decorated Pot 1.20: 4 Pottery Sherds
    if (countNonEmpty === 4 && ids.filter((id) => id && id.includes('pottery_sherd')).length === 4) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'decorated_pot');
      if (item) return { item, count: 1 };
    }

    // 20. Calibrated Sculk Sensor 1.20: 1 Sculk + 3 Amethyst Shards
    if (countNonEmpty === 4) {
      const sculkCount = ids.filter((id) => id === 'sculk' || id === 'sculk_catalyst').length;
      const amethystCount = ids.filter((id) => id === 'amethyst_shard').length;
      if (sculkCount === 1 && amethystCount === 3) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'calibrated_sculk_sensor');
        if (item) return { item, count: 1 };
      }
    }

    // 21. Bamboo Raft 1.20: 5 Bamboo Planks
    if (countNonEmpty === 5 && ids.filter((id) => id === 'bamboo_planks').length === 5) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bamboo_raft');
      if (item) return { item, count: 1 };
    }

    // 22. Bamboo Mosaic 1.20: 2 or 4 Bamboo Planks
    if (countNonEmpty === 2 && ids.filter((id) => id === 'bamboo_planks').length === 2) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bamboo_mosaic');
      if (item) return { item, count: 1 };
    }

    // 23. Chiseled Bookshelf 1.20: 6 Planks (Oak, Cherry, or Bamboo)
    if (countNonEmpty === 6) {
      const plankCount = ids.filter((id) => id === 'oak_planks' || id === 'cherry_planks' || id === 'bamboo_planks').length;
      if (plankCount === 6) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'chiseled_bookshelf');
        if (item) return { item, count: 1 };
      }
    }

    // 24. Mangrove Log -> 4 Mangrove Planks (1.19)
    if (countNonEmpty === 1 && (ids.some((id) => id === 'mangrove_log') || ids.some((id) => id === 'mangrove_wood') || ids.some((id) => id === 'stripped_mangrove_log'))) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_planks');
      if (item) return { item, count: 4 };
    }

    // 25. Packed Mud (1.19): 1 Mud + 1 Wheat
    if (countNonEmpty === 2 && ids.includes('mud') && ids.includes('wheat')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'packed_mud');
      if (item) return { item, count: 1 };
    }

    // 26. Mud Bricks (1.19): 4 Packed Mud in 2x2
    if (countNonEmpty === 4 && ids.filter((id) => id === 'packed_mud').length === 4) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mud_bricks');
      if (item) return { item, count: 4 };
    }

    // 27. Muddy Mangrove Roots (1.19): 1 Mangrove Roots + 1 Mud
    if (countNonEmpty === 2 && ids.includes('mangrove_roots') && ids.includes('mud')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'muddy_mangrove_roots');
      if (item) return { item, count: 1 };
    }

    // 28. Recovery Compass (1.19): 1 Compass in center (slot 4) + 8 Echo Shards
    if (ids[4] === 'compass' && countNonEmpty === 9) {
      const isSurroundedByEchoShards = [0, 1, 2, 3, 5, 6, 7, 8].every((idx) => ids[idx] === 'echo_shard');
      if (isSurroundedByEchoShards) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'recovery_compass');
        if (item) return { item, count: 1 };
      }
    }

    // 29. Music Disc 5 (1.19): 9 Disc Fragments (5)
    if (countNonEmpty === 9 && ids.every((id) => id === 'disc_fragment_5')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'music_disc_5');
      if (item) return { item, count: 1 };
    }

    // 30. Mangrove Boat (1.19): 5 Mangrove Planks
    if (countNonEmpty === 5 && ids.filter((id) => id === 'mangrove_planks').length === 5) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_boat');
      if (item) return { item, count: 1 };
    }

    // 31. Boat with Chest (1.19): 1 Boat + 1 Chest
    if (countNonEmpty === 2 && ids.includes('chest')) {
      const boatMap: Record<string, string> = {
        oak_boat: 'oak_chest_boat',
        mangrove_boat: 'mangrove_chest_boat',
        spruce_boat: 'spruce_chest_boat',
        birch_boat: 'birch_chest_boat',
        jungle_boat: 'jungle_chest_boat',
        acacia_boat: 'acacia_chest_boat',
        dark_oak_boat: 'dark_oak_chest_boat',
      };
      const boatId = ids.find((id) => id && id.endsWith('_boat'));
      if (boatId && boatMap[boatId]) {
        const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === boatMap[boatId]);
        if (item) return { item, count: 1 };
      }
    }

    // 32. Mangrove Stairs (1.19): 6 Mangrove Planks
    if (countNonEmpty === 6 && ids.filter((id) => id === 'mangrove_planks').length === 6) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_stairs');
      if (item) return { item, count: 4 };
    }

    // 33. Mangrove Slab (1.19): 3 Mangrove Planks
    if (countNonEmpty === 3 && ids.filter((id) => id === 'mangrove_planks').length === 3) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_slab');
      if (item) return { item, count: 6 };
    }

    // 34. Mangrove Pressure Plate (1.19): 2 Mangrove Planks
    if (countNonEmpty === 2 && ids.filter((id) => id === 'mangrove_planks').length === 2) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_pressure_plate');
      if (item) return { item, count: 1 };
    }

    // 35. Mangrove Button (1.19): 1 Mangrove Plank
    if (countNonEmpty === 1 && ids.includes('mangrove_planks')) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mangrove_button');
      if (item) return { item, count: 1 };
    }

    // 36. Mud Brick Stairs (1.19): 6 Mud Bricks
    if (countNonEmpty === 6 && ids.filter((id) => id === 'mud_bricks').length === 6) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mud_brick_stairs');
      if (item) return { item, count: 4 };
    }

    // 37. Mud Brick Slab (1.19): 3 Mud Bricks
    if (countNonEmpty === 3 && ids.filter((id) => id === 'mud_bricks').length === 3) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mud_brick_slab');
      if (item) return { item, count: 6 };
    }

    // 38. Mud Brick Wall (1.19): 6 Mud Bricks
    if (countNonEmpty === 6 && ids.filter((id) => id === 'mud_bricks').length === 6) {
      const item = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'mud_brick_wall');
      if (item) return { item, count: 6 };
    }

    return null;
  }, []);

  // Update crafting output whenever crafting grid changes
  useEffect(() => {
    const res = evaluateCraftingRecipe(craftingGrid);
    if (res) {
      setCraftingOutput({ slotIndex: 9, item: res.item, count: res.count });
    } else {
      setCraftingOutput({ slotIndex: 9, item: null, count: 0 });
    }
  }, [craftingGrid, evaluateCraftingRecipe]);

  // Crafting Table: Take Output
  const handleCraftOutputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!craftingOutput.item || craftingOutput.count === 0) return;

    const craftedItem = craftingOutput.item;
    const craftedCount = craftingOutput.count;
    const isShift = e.shiftKey;

    if (isShift) {
      let placed = false;
      setPlayerSlots((prev) => {
        const next = [...prev];
        for (let i = 0; i < 36; i++) {
          if (next[i].item?.id === craftedItem.id && next[i].count + craftedCount <= craftedItem.maxStack) {
            next[i] = { ...next[i], count: next[i].count + craftedCount };
            placed = true;
            break;
          }
        }
        if (!placed) {
          for (let i = 0; i < 36; i++) {
            if (!next[i].item || next[i].count === 0) {
              next[i] = { slotIndex: i, item: craftedItem, count: craftedCount };
              placed = true;
              break;
            }
          }
        }
        return next;
      });
      if (!placed) return;
    } else {
      if (!cursorItem.item) {
        setCursorItem({ item: craftedItem, count: craftedCount });
      } else if (cursorItem.item.id === craftedItem.id && cursorItem.count + craftedCount <= craftedItem.maxStack) {
        setCursorItem({ item: cursorItem.item, count: cursorItem.count + craftedCount });
      } else {
        return;
      }
    }

    // Deduct 1 from all filled crafting grid slots
    setCraftingGrid((prev) =>
      prev.map((s) => {
        if (s.item && s.count > 0) {
          const newCount = s.count - 1;
          return {
            ...s,
            count: newCount,
            item: newCount > 0 ? s.item : null
          };
        }
        return s;
      })
    );

    mcAudio.playPop(1.4);
  };

  // Crafting Table: Click on grid slots (0-8)
  const handleCraftingSlotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const isRightClick = e.button === 2;
    const isShiftClick = e.shiftKey;
    const current = craftingGrid[index];

    // Shift click -> return this slot back to player inventory
    if (isShiftClick && current.item && current.count > 0) {
      mcAudio.playPop(1.1);
      let remaining = current.count;
      setPlayerSlots((prev) => {
        const next = [...prev];
        for (let i = 0; i < 36; i++) {
          if (next[i].item?.id === current.item!.id && next[i].count < next[i].item!.maxStack) {
            const space = next[i].item!.maxStack - next[i].count;
            const add = Math.min(space, remaining);
            next[i] = { ...next[i], count: next[i].count + add };
            remaining -= add;
            if (remaining <= 0) break;
          }
        }
        if (remaining > 0) {
          for (let i = 0; i < 36; i++) {
            if (!next[i].item || next[i].count === 0) {
              next[i] = { slotIndex: i, item: current.item, count: remaining };
              remaining = 0;
              break;
            }
          }
        }
        return next;
      });

      setCraftingGrid((prev) => {
        const next = [...prev];
        next[index] = {
          ...current,
          item: remaining > 0 ? current.item : null,
          count: remaining
        };
        return next;
      });
      return;
    }

    // Right click
    if (isRightClick) {
      if (cursorItem.item && cursorItem.count > 0) {
        if (!current.item || current.count === 0) {
          setCraftingGrid((prev) => {
            const next = [...prev];
            next[index] = { slotIndex: index, item: cursorItem.item, count: 1 };
            return next;
          });
          const newCount = cursorItem.count - 1;
          setCursorItem({ item: newCount > 0 ? cursorItem.item : null, count: newCount });
          mcAudio.playPop(1.0);
        } else if (current.item.id === cursorItem.item.id && current.count < current.item.maxStack) {
          setCraftingGrid((prev) => {
            const next = [...prev];
            next[index] = { ...current, count: current.count + 1 };
            return next;
          });
          const newCount = cursorItem.count - 1;
          setCursorItem({ item: newCount > 0 ? cursorItem.item : null, count: newCount });
          mcAudio.playPop(1.0);
        }
      } else if (current.item && current.count > 0) {
        const take = Math.ceil(current.count / 2);
        const leave = current.count - take;
        setCursorItem({ item: current.item, count: take });
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[index] = { ...current, item: leave > 0 ? current.item : null, count: leave };
          return next;
        });
        mcAudio.playPop(0.95);
      }
      return;
    }

    // Left click
    if (!cursorItem.item || cursorItem.count === 0) {
      if (current.item && current.count > 0) {
        setCursorItem({ item: current.item, count: current.count });
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[index] = { slotIndex: index, item: null, count: 0 };
          return next;
        });
        mcAudio.playPop(1.0);
      }
    } else {
      if (!current.item || current.count === 0) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[index] = { slotIndex: index, item: cursorItem.item, count: cursorItem.count };
          return next;
        });
        setCursorItem({ item: null, count: 0 });
        mcAudio.playPop(1.0);
      } else if (current.item.id === cursorItem.item.id) {
        const max = current.item.maxStack;
        const space = max - current.count;
        if (space > 0) {
          const add = Math.min(space, cursorItem.count);
          setCraftingGrid((prev) => {
            const next = [...prev];
            next[index] = { ...current, count: current.count + add };
            return next;
          });
          const rem = cursorItem.count - add;
          setCursorItem({ item: rem > 0 ? cursorItem.item : null, count: rem });
          mcAudio.playPop(1.05);
        }
      } else {
        const temp = { ...current };
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[index] = { slotIndex: index, item: cursorItem.item, count: cursorItem.count };
          return next;
        });
        setCursorItem({ item: temp.item, count: temp.count });
        mcAudio.playPop(1.1);
      }
    }
  };

  // Quick populate recipe into crafting grid
  const applyCraftingRecipe = (recipeId: string) => {
    mcAudio.playPop(1.2);
    clearCraftingGrid(false);

    if (recipeId === 'bread') {
      const wheat = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'wheat');
      if (wheat) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[3] = { slotIndex: 3, item: wheat, count: 1 };
          next[4] = { slotIndex: 4, item: wheat, count: 1 };
          next[5] = { slotIndex: 5, item: wheat, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'crafting_table') {
      const planks = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'oak_planks');
      if (planks) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[0] = { slotIndex: 0, item: planks, count: 1 };
          next[1] = { slotIndex: 1, item: planks, count: 1 };
          next[3] = { slotIndex: 3, item: planks, count: 1 };
          next[4] = { slotIndex: 4, item: planks, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'stick') {
      const planks = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'oak_planks');
      if (planks) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[1] = { slotIndex: 1, item: planks, count: 1 };
          next[4] = { slotIndex: 4, item: planks, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'torch') {
      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
      const stick = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'stick');
      if (coal && stick) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[1] = { slotIndex: 1, item: coal, count: 1 };
          next[4] = { slotIndex: 4, item: stick, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'golden_apple') {
      const apple = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'apple');
      const gold = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'gold_ingot');
      if (apple && gold) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          [0, 1, 2, 3, 5, 6, 7, 8].forEach((idx) => {
            next[idx] = { slotIndex: idx, item: gold, count: 1 };
          });
          next[4] = { slotIndex: 4, item: apple, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'mace') {
      const core = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'heavy_core');
      const breeze = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'breeze_rod');
      if (core && breeze) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[1] = { slotIndex: 1, item: core, count: 1 };
          next[4] = { slotIndex: 4, item: breeze, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'eye_of_ender') {
      const pearl = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'ender_pearl');
      const powder = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'blaze_powder');
      if (pearl && powder) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[3] = { slotIndex: 3, item: pearl, count: 1 };
          next[4] = { slotIndex: 4, item: powder, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'golden_carrot') {
      const carrot = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'carrot');
      const gold = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'gold_ingot');
      if (carrot && gold) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          [0, 1, 2, 3, 5, 6, 7, 8].forEach((idx) => {
            next[idx] = { slotIndex: idx, item: gold, count: 1 };
          });
          next[4] = { slotIndex: 4, item: carrot, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'diamond_block') {
      const diamond = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'diamond');
      if (diamond) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          for (let i = 0; i < 9; i++) {
            next[i] = { slotIndex: i, item: diamond, count: 1 };
          }
          return next;
        });
      }
    } else if (recipeId === 'crafter') {
      const iron = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'iron_ingot');
      const table = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'crafting_table_item');
      const redstone = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'redstone_dust');
      const dropper = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'dropper_item');
      if (iron && table && redstone && dropper) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[0] = { slotIndex: 0, item: iron, count: 1 };
          next[1] = { slotIndex: 1, item: iron, count: 1 };
          next[2] = { slotIndex: 2, item: iron, count: 1 };
          next[3] = { slotIndex: 3, item: iron, count: 1 };
          next[4] = { slotIndex: 4, item: table, count: 1 };
          next[5] = { slotIndex: 5, item: iron, count: 1 };
          next[6] = { slotIndex: 6, item: redstone, count: 1 };
          next[7] = { slotIndex: 7, item: dropper, count: 1 };
          next[8] = { slotIndex: 8, item: redstone, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'brush') {
      const copper = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'copper_ingot');
      const stick = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'stick');
      if (copper && stick) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[1] = { slotIndex: 1, item: copper, count: 1 };
          next[4] = { slotIndex: 4, item: stick, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'decorated_pot') {
      const sherd = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'angler_pottery_sherd') ||
                    MINECRAFT_ITEMS_DATABASE.find((i) => i.id?.includes('pottery_sherd'));
      if (sherd) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[1] = { slotIndex: 1, item: sherd, count: 1 };
          next[3] = { slotIndex: 3, item: sherd, count: 1 };
          next[5] = { slotIndex: 5, item: sherd, count: 1 };
          next[7] = { slotIndex: 7, item: sherd, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'cherry_planks') {
      const log = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'cherry_log');
      if (log) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[4] = { slotIndex: 4, item: log, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'bamboo_planks') {
      const bambooBlock = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bamboo_block');
      if (bambooBlock) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[4] = { slotIndex: 4, item: bambooBlock, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'bamboo_raft') {
      const planks = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'bamboo_planks');
      if (planks) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[3] = { slotIndex: 3, item: planks, count: 1 };
          next[5] = { slotIndex: 5, item: planks, count: 1 };
          next[6] = { slotIndex: 6, item: planks, count: 1 };
          next[7] = { slotIndex: 7, item: planks, count: 1 };
          next[8] = { slotIndex: 8, item: planks, count: 1 };
          return next;
        });
      }
    } else if (recipeId === 'calibrated_sculk_sensor') {
      const sculk = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'sculk');
      const shard = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'amethyst_shard');
      if (sculk && shard) {
        setCraftingGrid((prev) => {
          const next = [...prev];
          next[0] = { slotIndex: 0, item: shard, count: 1 };
          next[1] = { slotIndex: 1, item: shard, count: 1 };
          next[2] = { slotIndex: 2, item: shard, count: 1 };
          next[4] = { slotIndex: 4, item: sculk, count: 1 };
          return next;
        });
      }
    }
  };

  // Clear Crafting Grid and return items to player inventory
  const clearCraftingGrid = (playSound = true) => {
    if (playSound) mcAudio.playPop(1.0);
    craftingGrid.forEach((slot) => {
      if (slot.item && slot.count > 0) {
        let remaining = slot.count;
        setPlayerSlots((prev) => {
          const next = [...prev];
          for (let i = 0; i < 36; i++) {
            if (next[i].item?.id === slot.item!.id && next[i].count < next[i].item!.maxStack) {
              const space = next[i].item!.maxStack - next[i].count;
              const add = Math.min(space, remaining);
              next[i] = { ...next[i], count: next[i].count + add };
              remaining -= add;
              if (remaining <= 0) break;
            }
          }
          if (remaining > 0) {
            for (let i = 0; i < 36; i++) {
              if (!next[i].item || next[i].count === 0) {
                next[i] = { slotIndex: i, item: slot.item, count: remaining };
                remaining = 0;
                break;
              }
            }
          }
          return next;
        });
      }
    });

    setCraftingGrid(Array.from({ length: 9 }, (_, i) => ({ slotIndex: i, item: null, count: 0 })));
  };

  // Furnace Smelting Loop Simulation with authentic Burn Timer and Smelt Progress
  useEffect(() => {
    if (containerType !== 'furnace') return;
    const timer = setInterval(() => {
      const recipe = SMELTING_RECIPES.find((r) => r.inputItemId === furnaceInput.item?.id);
      const outputDef = recipe ? MINECRAFT_ITEMS_DATABASE.find((i) => i.id === recipe.outputItemId) : null;
      const canAcceptOutput =
        !furnaceOutput.item ||
        (outputDef && furnaceOutput.item.id === outputDef.id && furnaceOutput.count < furnaceOutput.item.maxStack);

      setBurnFuelRemaining((currentFuel) => {
        if (currentFuel > 0) {
          const nextFuel = Math.max(0, currentFuel - 10);
          if (recipe && outputDef && canAcceptOutput && furnaceInput.count > 0) {
            setSmeltProgress((prevProg) => {
              if (prevProg >= 100) {
                mcAudio.playPop(1.4);
                // Deduct 1 input
                setFurnaceInput((currIn) => {
                  const count = currIn.count - 1;
                  return {
                    ...currIn,
                    count,
                    item: count > 0 ? currIn.item : null
                  };
                });
                // Produce 1 output
                setFurnaceOutput((currOut) => {
                  const count = currOut.item ? currOut.count + 1 : 1;
                  return {
                    slotIndex: 2,
                    item: outputDef,
                    count: Math.min(count, outputDef.maxStack)
                  };
                });
                return 0;
              }
              return prevProg + 6;
            });
          } else {
            setSmeltProgress((p) => Math.max(0, p - 2));
          }
          return nextFuel;
        } else {
          // If fuel ran out, check if we can ignite fuel in fuel slot
          if (recipe && outputDef && canAcceptOutput && furnaceInput.count > 0 && furnaceFuel.item && furnaceFuel.count > 0) {
            const fuelVal = FUEL_ITEMS[furnaceFuel.item.id] || (furnaceFuel.item.id === 'coal' ? 800 : 0);
            if (fuelVal > 0) {
              setFurnaceFuel((currF) => {
                const count = currF.count - 1;
                return {
                  ...currF,
                  count,
                  item: count > 0 ? currF.item : null
                };
              });
              setBurnFuelMax(fuelVal);
              mcAudio.playPop(1.1);
              return fuelVal;
            }
          }
          setSmeltProgress((p) => Math.max(0, p - 2));
          return 0;
        }
      });
    }, 100);

    return () => clearInterval(timer);
  }, [containerType, furnaceInput, furnaceFuel, furnaceOutput]);

  // Furnace Slot Click Handler
  const handleFurnaceSlotClick = (e: React.MouseEvent, type: 'input' | 'fuel' | 'output') => {
    e.preventDefault();
    const isRightClick = e.button === 2;
    const isShiftClick = e.shiftKey;

    if (type === 'output') {
      if (!furnaceOutput.item || furnaceOutput.count === 0) return;
      const item = furnaceOutput.item;
      const count = furnaceOutput.count;

      if (isShiftClick) {
        // Shift click -> move directly to player inventory
        let placed = false;
        setPlayerSlots((prev) => {
          const next = [...prev];
          for (let i = 0; i < 36; i++) {
            if (next[i].item?.id === item.id && next[i].count + count <= item.maxStack) {
              next[i] = { ...next[i], count: next[i].count + count };
              placed = true;
              break;
            }
          }
          if (!placed) {
            for (let i = 0; i < 36; i++) {
              if (!next[i].item || next[i].count === 0) {
                next[i] = { slotIndex: i, item, count };
                placed = true;
                break;
              }
            }
          }
          return next;
        });
        if (placed) {
          setFurnaceOutput({ slotIndex: 2, item: null, count: 0 });
          mcAudio.playPop(1.3);
        }
      } else {
        // Collect into cursor
        if (!cursorItem.item) {
          setCursorItem({ item, count });
          setFurnaceOutput({ slotIndex: 2, item: null, count: 0 });
          mcAudio.playPop(1.3);
        } else if (cursorItem.item.id === item.id && cursorItem.count + count <= item.maxStack) {
          setCursorItem({ item, count: cursorItem.count + count });
          setFurnaceOutput({ slotIndex: 2, item: null, count: 0 });
          mcAudio.playPop(1.3);
        }
      }
      return;
    }

    // Input or Fuel slot
    const current = type === 'input' ? furnaceInput : furnaceFuel;
    const setTarget = type === 'input' ? setFurnaceInput : setFurnaceFuel;

    if (isShiftClick && current.item && current.count > 0) {
      // Shift click to player
      let remaining = current.count;
      setPlayerSlots((prev) => {
        const next = [...prev];
        for (let i = 0; i < 36; i++) {
          if (next[i].item?.id === current.item!.id && next[i].count < next[i].item!.maxStack) {
            const space = next[i].item!.maxStack - next[i].count;
            const add = Math.min(space, remaining);
            next[i] = { ...next[i], count: next[i].count + add };
            remaining -= add;
            if (remaining <= 0) break;
          }
        }
        if (remaining > 0) {
          for (let i = 0; i < 36; i++) {
            if (!next[i].item || next[i].count === 0) {
              next[i] = { slotIndex: i, item: current.item, count: remaining };
              remaining = 0;
              break;
            }
          }
        }
        return next;
      });
      setTarget({
        ...current,
        item: remaining > 0 ? current.item : null,
        count: remaining
      });
      mcAudio.playPop(1.1);
      return;
    }

    if (isRightClick) {
      if (cursorItem.item && cursorItem.count > 0) {
        if (!current.item || current.count === 0) {
          setTarget({ slotIndex: current.slotIndex, item: cursorItem.item, count: 1 });
          const newCount = cursorItem.count - 1;
          setCursorItem({ item: newCount > 0 ? cursorItem.item : null, count: newCount });
          mcAudio.playPop(1.0);
        } else if (current.item.id === cursorItem.item.id && current.count < current.item.maxStack) {
          setTarget({ ...current, count: current.count + 1 });
          const newCount = cursorItem.count - 1;
          setCursorItem({ item: newCount > 0 ? cursorItem.item : null, count: newCount });
          mcAudio.playPop(1.0);
        }
      } else if (current.item && current.count > 0) {
        const take = Math.ceil(current.count / 2);
        const leave = current.count - take;
        setCursorItem({ item: current.item, count: take });
        setTarget({ ...current, item: leave > 0 ? current.item : null, count: leave });
        mcAudio.playPop(0.95);
      }
      return;
    }

    // Left click
    if (!cursorItem.item || cursorItem.count === 0) {
      if (current.item && current.count > 0) {
        setCursorItem({ item: current.item, count: current.count });
        setTarget({ slotIndex: current.slotIndex, item: null, count: 0 });
        mcAudio.playPop(1.0);
      }
    } else {
      if (!current.item || current.count === 0) {
        setTarget({ slotIndex: current.slotIndex, item: cursorItem.item, count: cursorItem.count });
        setCursorItem({ item: null, count: 0 });
        mcAudio.playPop(1.0);
      } else if (current.item.id === cursorItem.item.id) {
        const space = current.item.maxStack - current.count;
        if (space > 0) {
          const add = Math.min(space, cursorItem.count);
          setTarget({ ...current, count: current.count + add });
          const rem = cursorItem.count - add;
          setCursorItem({ item: rem > 0 ? cursorItem.item : null, count: rem });
          mcAudio.playPop(1.05);
        }
      } else {
        const temp = { ...current };
        setTarget({ slotIndex: current.slotIndex, item: cursorItem.item, count: cursorItem.count });
        setCursorItem({ item: temp.item, count: temp.count });
        mcAudio.playPop(1.1);
      }
    }
  };

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

    // 1. SHIFT + LEFT CLICK: Quick Move
    if (isShiftClick && current.item && current.count > 0) {
      mcAudio.playPop(1.1);

      // Special Case A: Player inventory -> Crafting Table 3x3 grid
      if (area === 'player' && containerType === 'crafting_table') {
        let remaining = current.count;
        setCraftingGrid((prev) => {
          const next = [...prev];
          for (let i = 0; i < 9; i++) {
            if (next[i].item?.id === current.item!.id && next[i].count < next[i].item!.maxStack) {
              const space = next[i].item!.maxStack - next[i].count;
              const add = Math.min(space, remaining);
              next[i] = { ...next[i], count: next[i].count + add };
              remaining -= add;
              if (remaining <= 0) break;
            }
          }
          if (remaining > 0) {
            for (let i = 0; i < 9; i++) {
              if (!next[i].item || next[i].count === 0) {
                next[i] = { slotIndex: i, item: current.item, count: remaining };
                remaining = 0;
                break;
              }
            }
          }
          return next;
        });
        setPlayerSlots((prev) => {
          const next = [...prev];
          next[index] = { ...current, item: remaining > 0 ? current.item : null, count: remaining };
          return next;
        });
        return;
      }

      // Special Case B: Player inventory -> Furnace
      if (area === 'player' && containerType === 'furnace') {
        const isFuel = !!FUEL_ITEMS[current.item.id] || current.item.id === 'coal' || current.item.id === 'blaze_rod' || current.item.id === 'oak_planks' || current.item.id === 'stick';
        let remaining = current.count;

        if (isFuel) {
          if (!furnaceFuel.item || (furnaceFuel.item.id === current.item.id && furnaceFuel.count < current.item.maxStack)) {
            const space = furnaceFuel.item ? current.item.maxStack - furnaceFuel.count : current.item.maxStack;
            const add = Math.min(space, remaining);
            setFurnaceFuel({
              slotIndex: 1,
              item: current.item,
              count: (furnaceFuel.item ? furnaceFuel.count : 0) + add
            });
            remaining -= add;
          }
        } else {
          if (!furnaceInput.item || (furnaceInput.item.id === current.item.id && furnaceInput.count < current.item.maxStack)) {
            const space = furnaceInput.item ? current.item.maxStack - furnaceInput.count : current.item.maxStack;
            const add = Math.min(space, remaining);
            setFurnaceInput({
              slotIndex: 0,
              item: current.item,
              count: (furnaceInput.item ? furnaceInput.count : 0) + add
            });
            remaining -= add;
          }
        }

        setPlayerSlots((prev) => {
          const next = [...prev];
          next[index] = { ...current, item: remaining > 0 ? current.item : null, count: remaining };
          return next;
        });
        return;
      }

      // Standard Move between container and player inventory
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
    const is119Item =
      item.id.includes('mangrove') ||
      item.id.includes('mud') ||
      item.id.includes('sculk') ||
      item.id.includes('frog') ||
      item.id.includes('tadpole') ||
      item.id.includes('goat_horn') ||
      item.id.includes('echo_shard') ||
      item.id.includes('recovery_compass') ||
      item.id.includes('disc_fragment_5') ||
      item.id.includes('music_disc_5') ||
      item.id.includes('swift_sneak') ||
      item.id.includes('chest_boat') ||
      item.id.includes('warden') ||
      item.id.includes('allay') ||
      item.id.includes('reinforced_deepslate');

    const matchCat =
      creativeCategory === 'all' ||
      (creativeCategory === '1.19' ? is119Item : item.category === creativeCategory);
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
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
            className="px-3.5 py-2 rounded-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 border-2 border-emerald-400/40"
            title="Mở bảng Creative để lấy bất kỳ item nào"
          >
            <Plus className="w-4 h-4" />
            <span>Lấy Item (Creative)</span>
          </button>

          {/* Random Dungeon Loot */}
          <button
            onClick={handleFillRandomLoot}
            className="px-3 py-2 rounded-none bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Đổ đầy rương với vật phẩm ngẫu nhiên"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Loot ngẫu nhiên</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-none bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Xuất bố cục kho đồ ra JSON"
          >
            {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedMessage ? 'Đã sao chép!' : 'Xuất JSON'}</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-none bg-[#282832] hover:bg-[#343442] text-slate-200 hover:text-white border border-[#3E3E4C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
            className="p-2 rounded-none bg-[#282832] hover:bg-[#343442] text-slate-300 hover:text-white border border-[#3E3E4C] text-xs transition-all cursor-pointer"
            title={isMuted ? 'Bật âm thanh Minecraft' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Clear All */}
          <button
            onClick={() => handleClear('all')}
            className="p-2 rounded-none bg-[#282832] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-[#3E3E4C] hover:border-rose-500/40 text-xs transition-all cursor-pointer"
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
            className="px-3 py-1.5 rounded-none bg-[#1C1C22] hover:bg-[#2A2A34] text-slate-300 hover:text-white border border-[#343440] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
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
              className={`px-4 py-2 rounded-none text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border-2 ${
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
          className="mc-gui-frame p-4 sm:p-6 rounded-none shadow-2xl relative border-4 border-[#373737] max-w-full overflow-x-auto"
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
                className="px-2.5 py-1 rounded-none bg-[#8B8B8B] hover:bg-[#9E9E9E] text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Tự động gom và sắp xếp rương"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sắp xếp</span>
              </button>

              <button
                onClick={() => handleClear('container')}
                className="px-2.5 py-1 rounded-none bg-[#8B8B8B] hover:bg-red-300 text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Dọn sạch rương"
              >
                <Trash2 className="w-3 h-3" />
                <span>Dọn</span>
              </button>
            </div>
          </div>

          {/* CONTAINER SLOTS GRID */}
          {containerType === 'crafting_table' ? (
            /* Dedicated Crafting Table 3x3 Screen */
            <div className="flex flex-col gap-3 py-2 px-3 sm:px-6 bg-[#C6C6C6] rounded-none">
              {/* Recipe Book Quick Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#A0A0A0]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecipeBookOpen(!isRecipeBookOpen)}
                    className="px-2.5 py-1 rounded-none bg-[#4A6E2E] hover:bg-[#5A8538] text-white text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#2E4A1A]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isRecipeBookOpen ? 'Ẩn sách công thức' : 'Mở sách công thức'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-[#555]">
                    Lưới chế tạo 3x3 tiêu chuẩn
                  </span>
                </div>

                <button
                  onClick={() => clearCraftingGrid(true)}
                  className="px-2.5 py-1 rounded-none bg-[#8B8B8B] hover:bg-amber-300 text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  title="Chuyển toàn bộ nguyên liệu trên bàn về kho đồ"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Dọn lưới</span>
                </button>
              </div>

              {/* Collapsible Recipe Quick-List */}
              {isRecipeBookOpen && (
                <div className="bg-[#B0B0B0] p-2.5 border-2 border-[#555] rounded-none flex flex-wrap items-center gap-1.5 shadow-inner max-h-36 overflow-y-auto">
                  <span className="text-[10px] font-mono font-bold text-[#333] uppercase mr-1 shrink-0">
                    Công thức nhanh:
                  </span>
                  <button
                    onClick={() => applyCraftingRecipe('bread')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-black border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🥖 Bánh mì (3 Lúa mì)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('crafting_table')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-black border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🛠️ Bàn chế tạo (4 Ván gỗ)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('torch')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-black border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🔥 Đuốc (Than + Gậy)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('stick')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-black border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🪵 Gậy gỗ (2 Ván gỗ)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('mace')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-[#6D28D9] border border-[#7C3AED] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🔨 Chùy Mace 1.21 (Heavy Core + Breeze)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('golden_apple')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-amber-700 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🍏 Táo vàng (8 Thỏi vàng + Táo)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('golden_carrot')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-amber-600 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🥕 Cà rốt vàng (8 Thỏi vàng + Cà rốt)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('eye_of_ender')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-emerald-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>👁️ Mắt Ender (Ender Pearl + Bột lửa)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('diamond_block')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-cyan-700 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>💎 Khối kim cương (9 Kim cương)</span>
                  </button>
                  <button
                    onClick={() => applyCraftingRecipe('crafter')}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-rose-700 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>⚙️ Crafter 1.21 (Sắt + Redstone)</span>
                  </button>
                </div>
              )}

              {/* Crafting Grid & Output Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-4">
                {/* 3x3 Crafting Grid */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono font-bold text-[#4F4F4F] mb-1.5">
                    Lưới chế tạo (Crafting 3x3)
                  </span>
                  <div
                    className="grid grid-cols-3 gap-[3px] p-2 bg-[#8B8B8B] rounded-none border-2 border-[#373737]"
                    style={{
                      boxShadow: 'inset 2px 2px 0px #373737, inset -2px -2px 0px #FFFFFF'
                    }}
                  >
                    {craftingGrid.map((slot, index) => (
                      <SlotCell
                        key={index}
                        slot={slot}
                        onClick={(e) => handleCraftingSlotClick(e, index)}
                        onContextMenu={(e) => handleCraftingSlotClick(e, index)}
                        onMouseEnter={() => slot.item && setHoveredSlot(slot as any)}
                        onMouseLeave={() => setHoveredSlot(null)}
                      />
                    ))}
                  </div>
                </div>

                {/* Crafting Arrow Pointer */}
                <div className="flex flex-col items-center justify-center">
                  <div className="p-2 bg-[#A0A0A0] border border-[#555] shadow-xs">
                    <ArrowRight className="w-8 h-8 text-[#373737]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#555] mt-1">Chế tạo</span>
                </div>

                {/* Crafting Output Slot */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono font-bold text-[#4F4F4F] mb-1.5">
                    Thành phẩm (Output)
                  </span>
                  <div
                    className="p-2 bg-[#8B8B8B] rounded-none border-3 border-[#373737]"
                    style={{
                      boxShadow: 'inset 3px 3px 0px #373737, inset -3px -3px 0px #FFFFFF'
                    }}
                  >
                    <SlotCell
                      slot={craftingOutput}
                      size={52}
                      onClick={handleCraftOutputClick}
                      onContextMenu={handleCraftOutputClick}
                      onMouseEnter={() => craftingOutput.item && setHoveredSlot(craftingOutput as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : containerType === 'furnace' ? (
            /* Dedicated Furnace GUI Layout */
            <div className="flex flex-col gap-3 py-2 px-3 sm:px-6 bg-[#C6C6C6] rounded-none">
              {/* Furnace Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#A0A0A0]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#333] uppercase">
                    Nạp nhanh lò nung:
                  </span>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const goldOre = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'gold_ore');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (goldOre) setFurnaceInput({ slotIndex: 0, item: goldOre, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-amber-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🧈 Quặng vàng</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const rawGold = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'raw_gold');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (rawGold) setFurnaceInput({ slotIndex: 0, item: rawGold, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-amber-600 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>✨ Vàng thô</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const ironOre = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'iron_ore');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (ironOre) setFurnaceInput({ slotIndex: 0, item: ironOre, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-slate-700 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>⚙️ Quặng sắt</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const rawIron = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'raw_iron');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (rawIron) setFurnaceInput({ slotIndex: 0, item: rawIron, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-slate-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🔩 Sắt thô</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const ancientDebris = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'ancient_debris');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (ancientDebris) setFurnaceInput({ slotIndex: 0, item: ancientDebris, count: 8 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-purple-900 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🔥 Ancient Debris</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const rawBeef = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'raw_beef');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (rawBeef) setFurnaceInput({ slotIndex: 0, item: rawBeef, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-red-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🥩 Thịt bò</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const sand = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'sand');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (sand) setFurnaceInput({ slotIndex: 0, item: sand, count: 32 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-yellow-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🏖️ Cát -&gt; Kính</span>
                  </button>
                  <button
                    onClick={() => {
                      mcAudio.playPop(1.2);
                      const wetSponge = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'wet_sponge');
                      const coal = MINECRAFT_ITEMS_DATABASE.find((i) => i.id === 'coal');
                      if (wetSponge) setFurnaceInput({ slotIndex: 0, item: wetSponge, count: 8 });
                      if (coal) setFurnaceFuel({ slotIndex: 1, item: coal, count: 32 });
                    }}
                    className="px-2 py-1 bg-[#D4D4D4] hover:bg-white text-[11px] font-mono font-bold text-emerald-800 border border-[#555] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>🧽 Sấy bọt biển</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    mcAudio.playPop(1.1);
                    // Return all furnace items to player
                    [furnaceInput, furnaceFuel, furnaceOutput].forEach((slot) => {
                      if (slot.item && slot.count > 0) {
                        let remaining = slot.count;
                        setPlayerSlots((prev) => {
                          const next = [...prev];
                          for (let i = 0; i < 36; i++) {
                            if (next[i].item?.id === slot.item!.id && next[i].count < next[i].item!.maxStack) {
                              const add = Math.min(next[i].item!.maxStack - next[i].count, remaining);
                              next[i] = { ...next[i], count: next[i].count + add };
                              remaining -= add;
                              if (remaining <= 0) break;
                            }
                          }
                          if (remaining > 0) {
                            for (let i = 0; i < 36; i++) {
                              if (!next[i].item || next[i].count === 0) {
                                next[i] = { slotIndex: i, item: slot.item, count: remaining };
                                remaining = 0;
                                break;
                              }
                            }
                          }
                          return next;
                        });
                      }
                    });
                    setFurnaceInput({ slotIndex: 0, item: null, count: 0 });
                    setFurnaceFuel({ slotIndex: 1, item: null, count: 0 });
                    setFurnaceOutput({ slotIndex: 2, item: null, count: 0 });
                    setSmeltProgress(0);
                    setBurnFuelRemaining(0);
                  }}
                  className="px-2.5 py-1 rounded-none bg-[#8B8B8B] hover:bg-amber-300 text-black text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  title="Thu hồi toàn bộ vật phẩm trong lò nung về túi đồ"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Thu hồi lò</span>
                </button>
              </div>

              {/* Main Furnace Components Layout */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 py-4">
                {/* Left: Input slot + Flame + Fuel slot */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-[#4F4F4F] font-mono font-bold mb-1">
                      Vật liệu nung (Input)
                    </span>
                    <SlotCell
                      slot={furnaceInput}
                      onClick={(e) => handleFurnaceSlotClick(e, 'input')}
                      onContextMenu={(e) => handleFurnaceSlotClick(e, 'input')}
                      onMouseEnter={() => furnaceInput.item && setHoveredSlot(furnaceInput as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>

                  {/* Animated Flame with Fuel Percentage */}
                  <div className="flex flex-col items-center justify-center my-1 relative" title={isBurning ? `Nhiệt độ lò đang cháy: ${Math.round((burnFuelRemaining / burnFuelMax) * 100)}%` : 'Lò nung chưa kích hoạt'}>
                    <div className="relative w-7 h-7 flex items-center justify-center">
                      <Flame
                        className={`w-6 h-6 transition-transform ${
                          isBurning
                            ? 'text-amber-500 animate-pulse scale-125 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                            : 'text-[#777]'
                        }`}
                      />
                    </div>
                    {isBurning && (
                      <span className="text-[9px] font-mono font-bold text-amber-700">
                        {Math.round((burnFuelRemaining / burnFuelMax) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-[#4F4F4F] font-mono font-bold mb-1">
                      Nhiên liệu (Fuel: Than...)
                    </span>
                    <SlotCell
                      slot={furnaceFuel}
                      onClick={(e) => handleFurnaceSlotClick(e, 'fuel')}
                      onContextMenu={(e) => handleFurnaceSlotClick(e, 'fuel')}
                      onMouseEnter={() => furnaceFuel.item && setHoveredSlot(furnaceFuel as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>
                </div>

                {/* Center: Smelting Progress Arrow */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#444]">
                    {isBurning ? 'Đang nung...' : 'Chờ nạp liệu'}
                  </span>
                  <div className="w-24 h-5 bg-[#8B8B8B] rounded-none border-2 border-[#373737] overflow-hidden shadow-inner p-0.5">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-emerald-500 transition-all duration-150"
                      style={{ width: `${smeltProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#373737]">
                    {smeltProgress > 0 ? `${smeltProgress}%` : '0%'}
                  </span>
                </div>

                {/* Right: Output Slot */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-[#4F4F4F] font-mono font-bold mb-1">
                    Thành phẩm (Output)
                  </span>
                  <div
                    className="p-2 bg-[#8B8B8B] rounded-none border-3 border-[#373737]"
                    style={{
                      boxShadow: 'inset 3px 3px 0px #373737, inset -3px -3px 0px #FFFFFF'
                    }}
                  >
                    <SlotCell
                      slot={furnaceOutput}
                      size={52}
                      onClick={(e) => handleFurnaceSlotClick(e, 'output')}
                      onContextMenu={(e) => handleFurnaceSlotClick(e, 'output')}
                      onMouseEnter={() => furnaceOutput.item && setHoveredSlot(furnaceOutput as any)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Grid Slots Container (Chest, Barrel, Shulker, Dispenser...) */
            <div 
              className="grid gap-[3px] p-2 bg-[#8B8B8B] rounded-none border-2 border-[#373737]"
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
                className="px-2 py-0.5 rounded-none bg-[#8B8B8B] hover:bg-[#9E9E9E] text-black text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                title="Sắp xếp kho đồ người chơi"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sắp xếp</span>
              </button>
            </div>
          </div>

          {/* PLAYER INVENTORY: Main 27 Storage Slots (3 rows of 9) */}
          <div 
            className="grid grid-cols-9 gap-[3px] p-2 bg-[#8B8B8B] rounded-none border-2 border-[#373737]"
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
              className="grid grid-cols-9 gap-[3px] p-2 bg-[#8B8B8B] rounded-none border-2 border-[#373737]"
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
              imageUrl={cursorItem.item.imageUrl}
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
          className="fixed pointer-events-none z-99999 p-2.5 rounded-none text-xs select-none max-w-xs shadow-2xl"
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
                className="p-1 rounded-none text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
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
                  className="w-full pl-9 pr-3 py-2 rounded-none bg-[#22222C] border border-[#343440] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: '1.19', label: '🐸 1.19 The Wild' },
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
                    className={`px-2.5 py-1 rounded-none text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                      creativeCategory === cat.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#22222C] text-slate-400 hover:text-white border-[#343440]'
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
                    className="p-2 rounded-none bg-[#22222C] hover:bg-[#2F2F3D] border border-[#333342] hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group active:scale-95 shadow-xs"
                    title={`Lấy ${item.name} (${item.maxStack}x)`}
                  >
                    <MinecraftItemIcon
                      iconType={item.iconType}
                      imageUrl={item.imageUrl}
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
              className="w-full max-w-md bg-[#1C1C24] border-2 border-[#333340] rounded-none p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2C2C38] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Wrench className="w-5 h-5" />
                  <h3 className="font-bold text-base text-white">Anvil: Tùy Chỉnh Phù Phép & Tên</h3>
                </div>
                <button
                  onClick={() => setIsAnvilModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-none border border-[#343440] hover:bg-[#2A2A34]"
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
                    className="w-full p-2.5 rounded-none bg-[#14141A] border border-[#2D2D38] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dòng Lore / Phù Phép (Mỗi dòng một hiệu ứng):</label>
                  <textarea
                    rows={4}
                    value={anvilLoreLines}
                    onChange={(e) => setAnvilLoreLines(e.target.value)}
                    className="w-full p-2.5 rounded-none bg-[#14141A] border border-[#2D2D38] text-white focus:outline-none focus:border-amber-400 font-mono resize-none"
                    placeholder="Sharpness V&#10;Unbreaking III&#10;Mending"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={anvilIsEnchanted}
                    onChange={(e) => setAnvilIsEnchanted(e.target.checked)}
                    className="w-4 h-4 rounded-none accent-amber-500"
                  />
                  <span>Bật hiệu ứng lấp lánh Phù Phép (Enchantment Glint)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAnvilModalOpen(false)}
                  className="px-4 py-2 rounded-none bg-[#252530] text-slate-300 hover:text-white text-xs font-semibold border border-[#3A3A46]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveAnvil}
                  className="px-4 py-2 rounded-none bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md border-2 border-amber-300"
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
              className="w-full max-w-lg bg-[#1C1C24] border-2 border-[#333340] rounded-none p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2C2C38] pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="font-bold text-base">Nhập Bố Cục Kho Đồ JSON</h3>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-none border border-[#343440] hover:bg-[#2A2A34]"
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
                  className="w-full p-3 rounded-none bg-[#14141A] border border-[#2D2D38] text-white font-mono focus:outline-none focus:border-[#00E5FF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-none bg-[#252530] text-slate-300 hover:text-white text-xs font-semibold border border-[#3A3A46]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApplyImport}
                  className="px-4 py-2 rounded-none bg-[#00E5FF] hover:bg-[#33EAFF] text-black text-xs font-bold shadow-md border-2 border-cyan-300"
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
            imageUrl={slot.item.imageUrl}
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
