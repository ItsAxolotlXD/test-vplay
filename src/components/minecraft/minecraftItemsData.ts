export interface MinecraftItem {
  id: string;
  name: string;
  category: 'building' | 'combat' | 'tools' | 'redstone' | 'food' | 'valuable' | 'brewing';
  maxStack: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  lore?: string[];
  enchanted?: boolean;
  durability?: { current: number; max: number };
  color?: string;
  iconType: string;
}

export interface InventorySlot {
  slotIndex: number;
  item: MinecraftItem | null;
  count: number;
  customName?: string;
}

export type ContainerType = 
  | 'chest' 
  | 'double_chest' 
  | 'ender_chest' 
  | 'shulker_box' 
  | 'barrel' 
  | 'dispenser' 
  | 'hopper' 
  | 'furnace' 
  | 'crafting_table';

export interface ContainerConfig {
  type: ContainerType;
  title: string;
  slots: number;
  rows: number;
  cols: number;
  color?: string;
}

export const CONTAINER_CONFIGS: Record<ContainerType, ContainerConfig> = {
  chest: {
    type: 'chest',
    title: 'Chest',
    slots: 27,
    rows: 3,
    cols: 9,
  },
  double_chest: {
    type: 'double_chest',
    title: 'Large Chest',
    slots: 54,
    rows: 6,
    cols: 9,
  },
  ender_chest: {
    type: 'ender_chest',
    title: 'Ender Chest',
    slots: 27,
    rows: 3,
    cols: 9,
  },
  shulker_box: {
    type: 'shulker_box',
    title: 'Shulker Box',
    slots: 27,
    rows: 3,
    cols: 9,
    color: '#8A5AAB'
  },
  barrel: {
    type: 'barrel',
    title: 'Barrel',
    slots: 27,
    rows: 3,
    cols: 9,
  },
  dispenser: {
    type: 'dispenser',
    title: 'Dispenser',
    slots: 9,
    rows: 3,
    cols: 3,
  },
  hopper: {
    type: 'hopper',
    title: 'Item Hopper',
    slots: 5,
    rows: 1,
    cols: 5,
  },
  furnace: {
    type: 'furnace',
    title: 'Furnace',
    slots: 3,
    rows: 1,
    cols: 3,
  },
  crafting_table: {
    type: 'crafting_table',
    title: 'Crafting',
    slots: 10, // 9 grid + 1 result
    rows: 3,
    cols: 3,
  },
};

export const MINECRAFT_ITEMS_DATABASE: MinecraftItem[] = [
  // COMBAT
  {
    id: 'netherite_sword',
    name: 'Netherite Sword',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Sharpness V', 'Unbreaking III', 'Looting III', 'Fire Aspect II', 'Mending', '+14 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'sword_netherite'
  },
  {
    id: 'diamond_sword',
    name: 'Diamond Sword',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+7 Attack Damage', '1.6 Attack Speed'],
    durability: { current: 1561, max: 1561 },
    iconType: 'sword_diamond'
  },
  {
    id: 'bow',
    name: 'Bow',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    enchanted: true,
    lore: ['Power V', 'Flame', 'Infinity', 'Unbreaking III'],
    durability: { current: 384, max: 384 },
    iconType: 'bow'
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    enchanted: true,
    lore: ['Quick Charge III', 'Multishot', 'Unbreaking III'],
    durability: { current: 465, max: 465 },
    iconType: 'crossbow'
  },
  {
    id: 'arrow',
    name: 'Arrow',
    category: 'combat',
    maxStack: 64,
    rarity: 'common',
    iconType: 'arrow'
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Unbreaking III', 'Mending'],
    durability: { current: 336, max: 336 },
    iconType: 'shield'
  },
  {
    id: 'totem_of_undying',
    name: 'Totem of Undying',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Grants Second Chance upon lethal damage', 'Gives Regeneration II & Absorption II'],
    iconType: 'totem'
  },
  {
    id: 'trident',
    name: 'Trident',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Riptide III', 'Impaling V', 'Loyalty III', 'Channeling'],
    durability: { current: 250, max: 250 },
    iconType: 'trident'
  },
  {
    id: 'netherite_helmet',
    name: 'Netherite Helmet',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Respiration III', 'Aqua Affinity', 'Unbreaking III', '+3 Armor', '+3 Armor Toughness', '+1 Knockback Resistance'],
    durability: { current: 407, max: 407 },
    iconType: 'helmet_netherite'
  },
  {
    id: 'netherite_chestplate',
    name: 'Netherite Chestplate',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Unbreaking III', 'Mending', '+8 Armor', '+3 Armor Toughness', '+1 Knockback Resistance'],
    durability: { current: 592, max: 592 },
    iconType: 'chestplate_netherite'
  },
  {
    id: 'netherite_leggings',
    name: 'Netherite Leggings',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Swift Sneak III', 'Unbreaking III', 'Mending', '+6 Armor', '+3 Armor Toughness'],
    durability: { current: 555, max: 555 },
    iconType: 'leggings_netherite'
  },
  {
    id: 'netherite_boots',
    name: 'Netherite Boots',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Feather Falling IV', 'Depth Strider III', 'Soul Speed III', '+3 Armor'],
    durability: { current: 481, max: 481 },
    iconType: 'boots_netherite'
  },
  {
    id: 'elytra',
    name: 'Elytra',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Unbreaking III', 'Mending', 'Enables Gliding flight in mid-air'],
    durability: { current: 432, max: 432 },
    iconType: 'elytra'
  },

  // TOOLS
  {
    id: 'netherite_pickaxe',
    name: 'Netherite Pickaxe',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Efficiency V', 'Fortune III', 'Unbreaking III', 'Mending', '+6 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'pickaxe_netherite'
  },
  {
    id: 'diamond_pickaxe',
    name: 'Diamond Pickaxe',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Efficiency IV', 'Unbreaking III', '+5 Attack Damage'],
    durability: { current: 1561, max: 1561 },
    iconType: 'pickaxe_diamond'
  },
  {
    id: 'netherite_axe',
    name: 'Netherite Axe',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Efficiency V', 'Silk Touch', 'Unbreaking III', '+10 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'axe_netherite'
  },
  {
    id: 'netherite_shovel',
    name: 'Netherite Shovel',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Efficiency V', 'Silk Touch', 'Unbreaking III', '+6.5 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'shovel_netherite'
  },
  {
    id: 'netherite_hoe',
    name: 'Netherite Hoe',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    lore: ['Fortune III', 'Unbreaking III'],
    durability: { current: 2031, max: 2031 },
    iconType: 'hoe_netherite'
  },
  {
    id: 'flint_and_steel',
    name: 'Flint and Steel',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    durability: { current: 64, max: 64 },
    iconType: 'flint_and_steel'
  },
  {
    id: 'shears',
    name: 'Shears',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    durability: { current: 238, max: 238 },
    iconType: 'shears'
  },
  {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    enchanted: true,
    lore: ['Luck of the Sea III', 'Lure III', 'Unbreaking III', 'Mending'],
    durability: { current: 64, max: 64 },
    iconType: 'fishing_rod'
  },
  {
    id: 'water_bucket',
    name: 'Water Bucket',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Essential for MLG water clutching'],
    iconType: 'water_bucket'
  },
  {
    id: 'lava_bucket',
    name: 'Lava Bucket',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Fuel duration: 1000s (100 items)'],
    iconType: 'lava_bucket'
  },
  {
    id: 'spyglass',
    name: 'Spyglass',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Zooms in on distant landmarks'],
    iconType: 'spyglass'
  },
  {
    id: 'clock',
    name: 'Clock',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Displays daylight cycle'],
    iconType: 'clock'
  },
  {
    id: 'compass',
    name: 'Compass',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Points to world spawn'],
    iconType: 'compass'
  },
  {
    id: 'recovery_compass',
    name: 'Recovery Compass',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Points to the last death location'],
    iconType: 'recovery_compass'
  },

  // VALUABLES & GEMS
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['A shiny, precious blue gem'],
    iconType: 'diamond'
  },
  {
    id: 'netherite_ingot',
    name: 'Netherite Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Forged with 4 Netherite Scraps & 4 Gold Ingots', 'Immune to lava & fire'],
    iconType: 'netherite_ingot'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['The currency of Villager trading'],
    iconType: 'emerald'
  },
  {
    id: 'gold_ingot',
    name: 'Gold Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    iconType: 'gold_ingot'
  },
  {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    iconType: 'iron_ingot'
  },
  {
    id: 'nether_star',
    name: 'Nether Star',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    enchanted: true,
    lore: ['Dropped by the Wither', 'Used to craft Beacons'],
    iconType: 'nether_star'
  },
  {
    id: 'dragon_egg',
    name: 'Dragon Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Trophy of the Ender Dragon', 'Teleports when hit'],
    iconType: 'dragon_egg'
  },
  {
    id: 'beacon',
    name: 'Beacon',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Emits a skyward beam & provides area status buffs'],
    iconType: 'beacon'
  },
  {
    id: 'enchanted_book',
    name: 'Enchanted Book',
    category: 'valuable',
    maxStack: 1,
    rarity: 'uncommon',
    enchanted: true,
    lore: ['Mending', 'Unbreaking III', 'Fortune III'],
    iconType: 'enchanted_book'
  },
  {
    id: 'heart_of_the_sea',
    name: 'Heart of the Sea',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Used with Nautilus Shells to craft a Conduit'],
    iconType: 'heart_of_the_sea'
  },
  {
    id: 'heavy_core',
    name: 'Heavy Core',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Found in Ominous Vaults', 'Crafts the Mace'],
    iconType: 'heavy_core'
  },

  // FOOD & CONSUMABLES
  {
    id: 'enchanted_golden_apple',
    name: 'Enchanted Golden Apple',
    category: 'food',
    maxStack: 64,
    rarity: 'epic',
    enchanted: true,
    lore: ['Absorption IV (2:00)', 'Regeneration II (0:20)', 'Fire Resistance (5:00)', 'Resistance (5:00)'],
    iconType: 'enchanted_golden_apple'
  },
  {
    id: 'golden_apple',
    name: 'Golden Apple',
    category: 'food',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Absorption (2:00)', 'Regeneration II (0:05)', '+4 Hunger, 9.6 Saturation'],
    iconType: 'golden_apple'
  },
  {
    id: 'cooked_beef',
    name: 'Cooked Beef',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+8 Hunger, 12.8 Saturation', 'Top tier survival food'],
    iconType: 'cooked_beef'
  },
  {
    id: 'golden_carrot',
    name: 'Golden Carrot',
    category: 'food',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['+6 Hunger, 14.4 Saturation', 'Highest saturation food in Minecraft'],
    iconType: 'golden_carrot'
  },
  {
    id: 'bread',
    name: 'Bread',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+5 Hunger, 6.0 Saturation'],
    iconType: 'bread'
  },
  {
    id: 'cake',
    name: 'Cake',
    category: 'food',
    maxStack: 1,
    rarity: 'common',
    lore: ['Can be sliced 7 times'],
    iconType: 'cake'
  },
  {
    id: 'chorus_fruit',
    name: 'Chorus Fruit',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Teleports player up to 8 blocks in random direction'],
    iconType: 'chorus_fruit'
  },
  {
    id: 'ender_pearl',
    name: 'Ender Pearl',
    category: 'food',
    maxStack: 16,
    rarity: 'uncommon',
    lore: ['Throws to teleport to impact point (inflicts 5 damage)'],
    iconType: 'ender_pearl'
  },
  {
    id: 'firework_rocket',
    name: 'Firework Rocket',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Flight Duration: 3', 'Elytra speed booster rocket'],
    iconType: 'firework_rocket'
  },

  // BUILDING & BLOCKS
  {
    id: 'oak_planks',
    name: 'Oak Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    iconType: 'oak_planks'
  },
  {
    id: 'stone',
    name: 'Stone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    iconType: 'stone'
  },
  {
    id: 'cobblestone',
    name: 'Cobblestone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    iconType: 'cobblestone'
  },
  {
    id: 'deepslate_bricks',
    name: 'Deepslate Bricks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    iconType: 'deepslate_bricks'
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Blast Resistance: 1200', 'Used to create Nether Portals'],
    iconType: 'obsidian'
  },
  {
    id: 'bedrock',
    name: 'Bedrock',
    category: 'building',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Unbreakable survival block'],
    iconType: 'bedrock'
  },
  {
    id: 'crying_obsidian',
    name: 'Crying Obsidian',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Used to craft Respawn Anchors'],
    iconType: 'crying_obsidian'
  },
  {
    id: 'tnt',
    name: 'TNT',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Explosive block, ignite with redstone or fire'],
    iconType: 'tnt'
  },
  {
    id: 'glass',
    name: 'Glass',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    iconType: 'glass'
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Enhances enchanting table level up to 30'],
    iconType: 'bookshelf'
  },
  {
    id: 'enchanting_table',
    name: 'Enchanting Table',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Enchants weapons, armor, and tools using XP & Lapis'],
    iconType: 'enchanting_table'
  },
  {
    id: 'anvil',
    name: 'Anvil',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Repairs, renames, and combines enchantments'],
    iconType: 'anvil'
  },
  {
    id: 'lantern',
    name: 'Lantern',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Light Level: 15'],
    iconType: 'lantern'
  },
  {
    id: 'sea_lantern',
    name: 'Sea Lantern',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Underwater light source (Light Level 15)'],
    iconType: 'sea_lantern'
  },
  {
    id: 'chest_item',
    name: 'Chest',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Single chest (27 slots), combines to Large Chest (54 slots)'],
    iconType: 'chest'
  },
  {
    id: 'ender_chest_item',
    name: 'Ender Chest',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Private interdimensional storage linked per player'],
    iconType: 'ender_chest'
  },
  {
    id: 'shulker_box_item',
    name: 'Purple Shulker Box',
    category: 'building',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Preserves all contained items when mined!'],
    iconType: 'shulker_box'
  },

  // REDSTONE & AUTOMATION
  {
    id: 'redstone_dust',
    name: 'Redstone Dust',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    iconType: 'redstone_dust'
  },
  {
    id: 'redstone_block',
    name: 'Block of Redstone',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Constant power source (Signal strength 15)'],
    iconType: 'redstone_block'
  },
  {
    id: 'redstone_repeater',
    name: 'Redstone Repeater',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Repeats signal, delays 1-4 redstone ticks'],
    iconType: 'repeater'
  },
  {
    id: 'redstone_comparator',
    name: 'Redstone Comparator',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Measures container fullness or subtracts signals'],
    iconType: 'comparator'
  },
  {
    id: 'sticky_piston',
    name: 'Sticky Piston',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Pushes and pulls up to 12 blocks'],
    iconType: 'sticky_piston'
  },
  {
    id: 'piston',
    name: 'Piston',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    iconType: 'piston'
  },
  {
    id: 'observer',
    name: 'Observer',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Detects block state changes and outputs a 1-tick pulse'],
    iconType: 'observer'
  },
  {
    id: 'hopper_item',
    name: 'Hopper',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Transfers 2.5 items per second between containers'],
    iconType: 'hopper'
  },
  {
    id: 'dispenser_item',
    name: 'Dispenser',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Shoots arrows, places water/lava buckets, equips armor'],
    iconType: 'dispenser'
  },
  {
    id: 'dropper_item',
    name: 'Dropper',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    iconType: 'dropper'
  },
  {
    id: 'slime_block',
    name: 'Slime Block',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Bounces entities, sticks adjacent blocks when moved'],
    iconType: 'slime_block'
  },
  {
    id: 'honey_block',
    name: 'Honey Block',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Reduces fall damage by 80%, sticks entities without sticking slime'],
    iconType: 'honey_block'
  },

  // BREWING & POTIONS
  {
    id: 'potion_healing',
    name: 'Potion of Healing II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Instant Health II (Restores 8 hearts)'],
    iconType: 'potion_red'
  },
  {
    id: 'potion_strength',
    name: 'Potion of Strength II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Strength II (1:30)', '+3 Attack Damage per strike'],
    iconType: 'potion_purple'
  },
  {
    id: 'splash_potion_speed',
    name: 'Splash Potion of Speed II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Speed II (1:07)', '+40% Movement Speed'],
    iconType: 'splash_potion_cyan'
  },
  {
    id: 'brewing_stand',
    name: 'Brewing Stand',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Brews potions with Blaze Powder as fuel'],
    iconType: 'brewing_stand'
  },
  {
    id: 'blaze_rod',
    name: 'Blaze Rod',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    iconType: 'blaze_rod'
  },
  {
    id: 'blaze_powder',
    name: 'Blaze Powder',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafts Eye of Ender & fuels Brewing Stands'],
    iconType: 'blaze_powder'
  },
  {
    id: 'ghast_tear',
    name: 'Ghast Tear',
    category: 'brewing',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Brews Potion of Regeneration'],
    iconType: 'ghast_tear'
  },
  {
    id: 'nether_wart',
    name: 'Nether Wart',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Primary ingredient for Awkward Potions'],
    iconType: 'nether_wart'
  },
  {
    id: 'experience_bottle',
    name: 'Bottle o\' Enchanting',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Shatters to yield 3-11 Experience Points'],
    iconType: 'bottle_o_enchanting'
  }
];

export interface LoadoutPreset {
  id: string;
  name: string;
  description: string;
  containerType: ContainerType;
  containerItems: { slot: number; itemId: string; count: number }[];
  playerItems: { slot: number; itemId: string; count: number }[];
}

export const PRESET_LOADOUTS: LoadoutPreset[] = [
  {
    id: 'end_fight',
    name: 'End Dragon Slayer Kit',
    description: 'Bộ trang bị Netherite tối thượng, Elytra, Táo vàng Enchant và Ngọc Ender',
    containerType: 'double_chest',
    containerItems: [
      { slot: 0, itemId: 'netherite_sword', count: 1 },
      { slot: 1, itemId: 'bow', count: 1 },
      { slot: 2, itemId: 'netherite_pickaxe', count: 1 },
      { slot: 3, itemId: 'arrow', count: 64 },
      { slot: 4, itemId: 'enchanted_golden_apple', count: 16 },
      { slot: 5, itemId: 'golden_carrot', count: 64 },
      { slot: 6, itemId: 'ender_pearl', count: 16 },
      { slot: 7, itemId: 'totem_of_undying', count: 1 },
      { slot: 8, itemId: 'water_bucket', count: 1 },
      { slot: 9, itemId: 'elytra', count: 1 },
      { slot: 10, itemId: 'firework_rocket', count: 64 },
      { slot: 11, itemId: 'firework_rocket', count: 64 },
      { slot: 12, itemId: 'potion_healing', count: 1 },
      { slot: 13, itemId: 'potion_strength', count: 1 },
      { slot: 14, itemId: 'splash_potion_speed', count: 1 },
      { slot: 15, itemId: 'bedrock', count: 64 },
      { slot: 16, itemId: 'obsidian', count: 64 },
      { slot: 17, itemId: 'experience_bottle', count: 64 },
    ],
    playerItems: [
      { slot: 27, itemId: 'netherite_sword', count: 1 }, // hotbar 0
      { slot: 28, itemId: 'bow', count: 1 }, // hotbar 1
      { slot: 29, itemId: 'netherite_pickaxe', count: 1 }, // hotbar 2
      { slot: 30, itemId: 'golden_carrot', count: 64 }, // hotbar 3
      { slot: 31, itemId: 'ender_pearl', count: 16 }, // hotbar 4
      { slot: 32, itemId: 'water_bucket', count: 1 }, // hotbar 5
      { slot: 33, itemId: 'firework_rocket', count: 64 }, // hotbar 6
      { slot: 34, itemId: 'totem_of_undying', count: 1 }, // hotbar 7
      { slot: 35, itemId: 'arrow', count: 64 }, // hotbar 8
    ]
  },
  {
    id: 'redstone_master',
    name: 'Redstone Engineer Lab',
    description: 'Kho linh kiện tự động hóa: Piston, Observer, Hopper, Repeater & TNT',
    containerType: 'chest',
    containerItems: [
      { slot: 0, itemId: 'redstone_dust', count: 64 },
      { slot: 1, itemId: 'redstone_block', count: 64 },
      { slot: 2, itemId: 'redstone_repeater', count: 64 },
      { slot: 3, itemId: 'redstone_comparator', count: 64 },
      { slot: 4, itemId: 'sticky_piston', count: 64 },
      { slot: 5, itemId: 'piston', count: 64 },
      { slot: 6, itemId: 'observer', count: 64 },
      { slot: 7, itemId: 'hopper_item', count: 64 },
      { slot: 8, itemId: 'dispenser_item', count: 64 },
      { slot: 9, itemId: 'slime_block', count: 64 },
      { slot: 10, itemId: 'honey_block', count: 64 },
      { slot: 11, itemId: 'tnt', count: 64 },
      { slot: 12, itemId: 'lantern', count: 64 },
    ],
    playerItems: [
      { slot: 27, itemId: 'redstone_dust', count: 64 },
      { slot: 28, itemId: 'redstone_repeater', count: 64 },
      { slot: 29, itemId: 'redstone_comparator', count: 64 },
      { slot: 30, itemId: 'sticky_piston', count: 64 },
      { slot: 31, itemId: 'observer', count: 64 },
      { slot: 32, itemId: 'hopper_item', count: 64 },
    ]
  },
  {
    id: 'dungeon_loot',
    name: 'Ancient City & Bastion Loot',
    description: 'Rương kho báu hiếm: Thỏi Netherite, Nether Star, Kim cương & Đĩa nhạc',
    containerType: 'chest',
    containerItems: [
      { slot: 2, itemId: 'netherite_ingot', count: 4 },
      { slot: 4, itemId: 'diamond', count: 18 },
      { slot: 6, itemId: 'enchanted_golden_apple', count: 2 },
      { slot: 10, itemId: 'enchanted_book', count: 1 },
      { slot: 12, itemId: 'nether_star', count: 1 },
      { slot: 14, itemId: 'heavy_core', count: 1 },
      { slot: 16, itemId: 'emerald', count: 32 },
      { slot: 20, itemId: 'gold_ingot', count: 24 },
      { slot: 22, itemId: 'crying_obsidian', count: 12 },
      { slot: 24, itemId: 'dragon_egg', count: 1 },
    ],
    playerItems: []
  }
];
