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
  imageUrl?: string;
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
    color: '#0B2321',
  },
  shulker_box: {
    type: 'shulker_box',
    title: 'Shulker Box',
    slots: 27,
    rows: 3,
    cols: 9,
    color: '#8A5AAB',
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
    slots: 10,
    rows: 3,
    cols: 3,
  },
};

export const MINECRAFT_ITEMS_DATABASE: MinecraftItem[] = [
  // ===================== COMBAT & WEAPONS =====================
  {
    id: 'mace',
    name: 'Mace',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    lore: ['Smashes enemies upon fall attacks', 'Damage scales infinitely with falling height', '+7 Attack Damage', 'Density V', 'Wind Burst III'],
    durability: { current: 500, max: 500 },
    iconType: 'mace',
    imageUrl: 'https://minecraft.wiki/images/Mace_JE1_BE1.png'
  },
  {
    id: 'netherite_sword',
    name: 'Netherite Sword',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Sharpness V', 'Unbreaking III', 'Looting III', 'Fire Aspect II', 'Mending', '+14 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'sword_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Sword_JE2_BE2.png'
  },
  {
    id: 'diamond_sword',
    name: 'Diamond Sword',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+7 Attack Damage', '1.6 Attack Speed'],
    durability: { current: 1561, max: 1561 },
    iconType: 'sword_diamond',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Sword_JE3_BE3.png'
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
    iconType: 'bow',
    imageUrl: 'https://minecraft.wiki/images/Bow_%28item%29_JE3_BE3.png'
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
    iconType: 'crossbow',
    imageUrl: 'https://minecraft.wiki/images/Crossbow_JE2_BE1.png'
  },
  {
    id: 'arrow',
    name: 'Arrow',
    category: 'combat',
    maxStack: 64,
    rarity: 'common',
    iconType: 'arrow',
    imageUrl: 'https://minecraft.wiki/images/Arrow_%28item%29_JE2_BE1.png'
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Blocks melee and projectile damage', 'Unbreaking III', 'Mending'],
    durability: { current: 336, max: 336 },
    iconType: 'shield',
    imageUrl: 'https://minecraft.wiki/images/Shield_JE2_BE1.png'
  },
  {
    id: 'totem_of_undying',
    name: 'Totem of Undying',
    category: 'combat',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Grants Second Chance upon lethal damage', 'Gives Regeneration II & Absorption II'],
    iconType: 'totem',
    imageUrl: 'https://minecraft.wiki/images/Totem_of_Undying_JE2_BE2.png'
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
    iconType: 'trident',
    imageUrl: 'https://minecraft.wiki/images/Trident_%28item%29_JE2_BE2.png'
  },
  {
    id: 'wind_charge',
    name: 'Wind Charge',
    category: 'combat',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Dropped by Breezes in Trial Chambers', 'Propels entities upward with high knockback burst'],
    iconType: 'wind_charge',
    imageUrl: 'https://minecraft.wiki/images/Wind_Charge_%28item%29_JE1_BE1.png'
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
    iconType: 'helmet_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Helmet_JE2_BE1.png'
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
    iconType: 'chestplate_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Chestplate_JE2_BE1.png'
  },
  {
    id: 'netherite_leggings',
    name: 'Netherite Leggings',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Unbreaking III', 'Swift Sneak III', '+6 Armor', '+3 Armor Toughness', '+1 Knockback Resistance'],
    durability: { current: 555, max: 555 },
    iconType: 'leggings_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Leggings_JE2_BE1.png'
  },
  {
    id: 'netherite_boots',
    name: 'Netherite Boots',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Protection IV', 'Feather Falling IV', 'Soul Speed III', '+3 Armor', '+3 Armor Toughness', '+1 Knockback Resistance'],
    durability: { current: 481, max: 481 },
    iconType: 'boots_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Boots_JE2_BE1.png'
  },
  {
    id: 'diamond_helmet',
    name: 'Diamond Helmet',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+3 Armor', '+2 Armor Toughness'],
    durability: { current: 363, max: 363 },
    iconType: 'helmet_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Helmet_JE3_BE3.png'
  },
  {
    id: 'diamond_chestplate',
    name: 'Diamond Chestplate',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+8 Armor', '+2 Armor Toughness'],
    durability: { current: 528, max: 528 },
    iconType: 'chestplate_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Chestplate_JE3_BE3.png'
  },
  {
    id: 'diamond_leggings',
    name: 'Diamond Leggings',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+6 Armor', '+2 Armor Toughness'],
    durability: { current: 495, max: 495 },
    iconType: 'leggings_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Leggings_JE3_BE3.png'
  },
  {
    id: 'diamond_boots',
    name: 'Diamond Boots',
    category: 'combat',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+3 Armor', '+2 Armor Toughness'],
    durability: { current: 429, max: 429 },
    iconType: 'boots_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Boots_JE3_BE3.png'
  },
  {
    id: 'elytra',
    name: 'Elytra',
    category: 'combat',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Unbreaking III', 'Mending', 'Wings for soaring through the End and Overworld'],
    durability: { current: 432, max: 432 },
    iconType: 'elytra',
    imageUrl: 'https://minecraft.wiki/images/Elytra_JE2_BE2.png'
  },

  // ===================== TOOLS =====================
  {
    id: 'netherite_pickaxe',
    name: 'Netherite Pickaxe',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Efficiency V', 'Fortune III', 'Unbreaking III', 'Mending', '+6 Attack Damage'],
    durability: { current: 2031, max: 2031 },
    iconType: 'pickaxe_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Pickaxe_JE3_BE2.png'
  },
  {
    id: 'diamond_pickaxe',
    name: 'Diamond Pickaxe',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Capable of mining Obsidian & Ancient Debris', '+5 Attack Damage'],
    durability: { current: 1561, max: 1561 },
    iconType: 'pickaxe_diamond',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Pickaxe_JE3_BE3.png'
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
    iconType: 'axe_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Axe_JE2_BE2.png'
  },
  {
    id: 'diamond_axe',
    name: 'Diamond Axe',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['+9 Attack Damage', 'Chops wood rapidly'],
    durability: { current: 1561, max: 1561 },
    iconType: 'axe_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Axe_JE3_BE3.png'
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
    iconType: 'shovel_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Shovel_JE2_BE2.png'
  },
  {
    id: 'diamond_shovel',
    name: 'Diamond Shovel',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Digs dirt, gravel, and sand with extreme speed'],
    durability: { current: 1561, max: 1561 },
    iconType: 'shovel_netherite',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Shovel_JE3_BE3.png'
  },
  {
    id: 'netherite_hoe',
    name: 'Netherite Hoe',
    category: 'tools',
    maxStack: 1,
    rarity: 'epic',
    enchanted: true,
    lore: ['Efficiency V', 'Fortune III', 'Unbreaking III'],
    durability: { current: 2031, max: 2031 },
    iconType: 'hoe_netherite',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Hoe_JE2_BE2.png'
  },
  {
    id: 'flint_and_steel',
    name: 'Flint and Steel',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Ignites portals and fires'],
    durability: { current: 64, max: 64 },
    iconType: 'flint_and_steel',
    imageUrl: 'https://minecraft.wiki/images/Flint_and_Steel_JE4_BE2.png'
  },
  {
    id: 'shears',
    name: 'Shears',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Gathers wool from sheep and harvests leaves intact'],
    durability: { current: 238, max: 238 },
    iconType: 'shears',
    imageUrl: 'https://minecraft.wiki/images/Shears_JE2_BE2.png'
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
    iconType: 'fishing_rod',
    imageUrl: 'https://minecraft.wiki/images/Fishing_Rod_JE2_BE2.png'
  },
  {
    id: 'water_bucket',
    name: 'Water Bucket',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Places water source, essential for MLG water clutching'],
    iconType: 'water_bucket',
    imageUrl: 'https://minecraft.wiki/images/Water_Bucket_JE2_BE2.png'
  },
  {
    id: 'lava_bucket',
    name: 'Lava Bucket',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Super fuel duration: 1000s (smelts 100 items in Furnace)'],
    iconType: 'lava_bucket',
    imageUrl: 'https://minecraft.wiki/images/Lava_Bucket_JE2_BE2.png'
  },
  {
    id: 'powder_snow_bucket',
    name: 'Powder Snow Bucket',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Negates fall damage when landing in it'],
    iconType: 'water_bucket',
    imageUrl: 'https://minecraft.wiki/images/Powder_Snow_Bucket_JE2_BE1.png'
  },
  {
    id: 'spyglass',
    name: 'Spyglass',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Zooms in on distant landmarks and mobs'],
    iconType: 'spyglass',
    imageUrl: 'https://minecraft.wiki/images/Spyglass_JE2_BE1.png'
  },
  {
    id: 'clock',
    name: 'Clock',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Displays sunlight and celestial rotation'],
    iconType: 'clock',
    imageUrl: 'https://minecraft.wiki/images/Clock_JE3_BE3.png'
  },
  {
    id: 'compass',
    name: 'Compass',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Points directly to world spawn point'],
    iconType: 'compass',
    imageUrl: 'https://minecraft.wiki/images/Compass_JE3_BE3.png'
  },
  {
    id: 'recovery_compass',
    name: 'Recovery Compass',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Points to the last location the player died'],
    iconType: 'recovery_compass',
    imageUrl: 'https://minecraft.wiki/images/Recovery_Compass_JE2_BE1.png'
  },
  {
    id: 'lead',
    name: 'Lead',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Leashes passive animals and boats'],
    iconType: 'lead',
    imageUrl: 'https://minecraft.wiki/images/Lead_JE2_BE2.png'
  },
  {
    id: 'name_tag',
    name: 'Name Tag',
    category: 'tools',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Renames mobs to keep them from despawning'],
    iconType: 'name_tag',
    imageUrl: 'https://minecraft.wiki/images/Name_Tag_JE2_BE2.png'
  },
  {
    id: 'saddle',
    name: 'Saddle',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Equips horses, pigs, striders, and camels for riding'],
    iconType: 'saddle',
    imageUrl: 'https://minecraft.wiki/images/Saddle_JE2_BE2.png'
  },
  {
    id: 'bundle',
    name: 'Bundle',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Holds a combined stack of up to 64 items inside'],
    iconType: 'bundle',
    imageUrl: 'https://minecraft.wiki/images/Bundle_JE2_BE2.png'
  },

  // ===================== VALUABLES & MINERALS =====================
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['A shiny, precious blue gem of the deep'],
    iconType: 'diamond',
    imageUrl: 'https://minecraft.wiki/images/Diamond_JE3_BE3.png'
  },
  {
    id: 'diamond_block',
    name: 'Block of Diamond',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Crafted from 9 Diamonds', 'Luxurious beacon base block'],
    iconType: 'diamond_ore',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Diamond_JE5_BE3.png'
  },
  {
    id: 'netherite_ingot',
    name: 'Netherite Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Forged with 4 Netherite Scraps & 4 Gold Ingots', 'Floats on and is immune to lava & fire'],
    iconType: 'netherite_ingot',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Ingot_JE2_BE2.png'
  },
  {
    id: 'netherite_scrap',
    name: 'Netherite Scrap',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Smelted from Ancient Debris in a Furnace'],
    iconType: 'netherite_ingot',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Scrap_JE2_BE1.png'
  },
  {
    id: 'netherite_block',
    name: 'Block of Netherite',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Crafted from 9 Netherite Ingots', 'The most prestigious block in Minecraft'],
    iconType: 'netherite_ingot',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Netherite_JE1_BE1.png'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['The official currency of Villager trading'],
    iconType: 'emerald',
    imageUrl: 'https://minecraft.wiki/images/Emerald_JE3_BE3.png'
  },
  {
    id: 'emerald_block',
    name: 'Block of Emerald',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Crafted from 9 Emeralds', 'Powers Beacons'],
    iconType: 'emerald',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Emerald_JE4_BE3.png'
  },
  {
    id: 'gold_ingot',
    name: 'Gold Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelted from Raw Gold or Gold Ore', 'Used for Golden Apples, Carrots, and Piglin bartering'],
    iconType: 'gold_ingot',
    imageUrl: 'https://minecraft.wiki/images/Gold_Ingot_JE4_BE2.png'
  },
  {
    id: 'gold_block',
    name: 'Block of Gold',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Crafted from 9 Gold Ingots'],
    iconType: 'gold_ingot',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Gold_JE6_BE3.png'
  },
  {
    id: 'raw_gold',
    name: 'Raw Gold',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Smelted from Gold Ore or mined underground', 'Smelt in a Furnace to forge Gold Ingots'],
    iconType: 'raw_gold',
    imageUrl: 'https://minecraft.wiki/images/thumb/Raw_Gold_JE2_BE1.png/120px-Raw_Gold_JE2_BE1.png?88da6'
  },
  {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelted from Raw Iron in a Furnace', 'The backbone of tools, armor, and redstone mechanics'],
    iconType: 'iron_ingot',
    imageUrl: 'https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png'
  },
  {
    id: 'raw_iron',
    name: 'Raw Iron',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Mined from Iron Ore veins', 'Smelt in a Furnace to yield Iron Ingots'],
    iconType: 'raw_iron',
    imageUrl: 'https://minecraft.wiki/images/Raw_Iron_JE3_BE2.png'
  },
  {
    id: 'iron_block',
    name: 'Block of Iron',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafted from 9 Iron Ingots', 'Spawns Iron Golems'],
    iconType: 'iron_ingot',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Iron_JE2_BE2.png'
  },
  {
    id: 'copper_ingot',
    name: 'Copper Ingot',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelted from Raw Copper in a Furnace', 'Used for Lightning Rods, Spyglasses, and Crafters'],
    iconType: 'copper_ingot',
    imageUrl: 'https://minecraft.wiki/images/Copper_Ingot_JE2_BE2.png'
  },
  {
    id: 'raw_copper',
    name: 'Raw Copper',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Mined from Copper Ore', 'Smelt in a Furnace to make Copper Ingots'],
    iconType: 'raw_copper',
    imageUrl: 'https://minecraft.wiki/images/Raw_Copper_JE3_BE2.png'
  },
  {
    id: 'copper_block',
    name: 'Block of Copper',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafted from 9 Copper Ingots', 'Oxidizes and patinas over time outdoors'],
    iconType: 'copper_ingot',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Copper_JE1_BE1.png'
  },
  {
    id: 'coal',
    name: 'Coal',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Essential furnace fuel (smelts 8 items in Furnace)', 'Used to craft Torches and Campfires'],
    iconType: 'coal',
    imageUrl: 'https://minecraft.wiki/images/Coal_JE4_BE3.png?165e9'
  },
  {
    id: 'lapis_lazuli',
    name: 'Lapis Lazuli',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Deep blue mineral', 'Mandatory catalyst for Enchanting Table enchantments'],
    iconType: 'lapis',
    imageUrl: 'https://minecraft.wiki/images/Lapis_Lazuli_JE3_BE3.png'
  },
  {
    id: 'amethyst_shard',
    name: 'Amethyst Shard',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Harvested from Amethyst Geodes', 'Crafts Spyglasses and Tinted Glass'],
    iconType: 'amethyst_shard',
    imageUrl: 'https://minecraft.wiki/images/Amethyst_Shard_JE2_BE1.png'
  },
  {
    id: 'amethyst_block',
    name: 'Block of Amethyst',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Makes chime musical notes when walked on or hit'],
    iconType: 'amethyst_shard',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Amethyst_JE2_BE1.png'
  },
  {
    id: 'nether_star',
    name: 'Nether Star',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    enchanted: true,
    lore: ['Dropped by the Wither boss', 'The core component of Beacons'],
    iconType: 'nether_star',
    imageUrl: 'https://minecraft.wiki/images/Nether_Star_JE2_BE2.png'
  },
  {
    id: 'dragon_egg',
    name: 'Dragon Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['The ultimate trophy of conquering the Ender Dragon', 'Teleports when struck'],
    iconType: 'dragon_egg',
    imageUrl: 'https://minecraft.wiki/images/Dragon_Egg_JE2_BE2.png'
  },
  {
    id: 'beacon',
    name: 'Beacon',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Emits a skyward beam & provides area status buffs (Haste II, Speed II, Regen)'],
    iconType: 'beacon',
    imageUrl: 'https://minecraft.wiki/images/Beacon_JE2_BE2.png'
  },
  {
    id: 'enchanted_book',
    name: 'Enchanted Book',
    category: 'valuable',
    maxStack: 1,
    rarity: 'uncommon',
    enchanted: true,
    lore: ['Mending', 'Unbreaking III', 'Fortune III', 'Apply via Anvil'],
    iconType: 'enchanted_book',
    imageUrl: 'https://minecraft.wiki/images/Enchanted_Book.gif'
  },
  {
    id: 'heart_of_the_sea',
    name: 'Heart of the Sea',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Found in buried treasure', 'Combine with 8 Nautilus Shells to craft a Conduit'],
    iconType: 'heart_of_the_sea',
    imageUrl: 'https://minecraft.wiki/images/Heart_of_the_Sea_JE2_BE2.png'
  },
  {
    id: 'nautilus_shell',
    name: 'Nautilus Shell',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Obtained from Drowned or fishing', 'Encases the Heart of the Sea'],
    iconType: 'heart_of_the_sea',
    imageUrl: 'https://minecraft.wiki/images/Nautilus_Shell_JE1_BE1.png'
  },
  {
    id: 'echo_shard',
    name: 'Echo Shard',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Harvested from Ancient City chests', 'Crafts the Recovery Compass'],
    iconType: 'amethyst_shard',
    imageUrl: 'https://minecraft.wiki/images/Echo_Shard_JE1_BE1.png'
  },
  {
    id: 'heavy_core',
    name: 'Heavy Core',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Rare reward discovered in Ominous Vaults', 'Crafts the powerful Mace with a Breeze Rod'],
    iconType: 'heavy_core',
    imageUrl: 'https://minecraft.wiki/images/Heavy_Core_JE1_BE1.png'
  },
  {
    id: 'breeze_rod',
    name: 'Breeze Rod',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Dropped by Breezes in Trial Chambers', 'Crafts Wind Charges and the Mace'],
    iconType: 'breeze_rod',
    imageUrl: 'https://minecraft.wiki/images/Breeze_Rod_JE2_BE1.png'
  },
  {
    id: 'trial_key',
    name: 'Trial Key',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Unlocks reward vaults inside underground Trial Chambers'],
    iconType: 'trial_key',
    imageUrl: 'https://minecraft.wiki/images/Trial_Key_JE3_BE1.png'
  },
  {
    id: 'ominous_trial_key',
    name: 'Ominous Trial Key',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Obtained during Bad Omen trial challenges', 'Unlocks rare Ominous Vaults with Heavy Core loot'],
    iconType: 'ominous_trial_key',
    imageUrl: 'https://minecraft.wiki/images/Ominous_Trial_Key_JE2_BE1.png'
  },
  {
    id: 'ominous_bottle',
    name: 'Ominous Bottle',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Grants Bad Omen effect (Duration: 100 minutes)', 'Triggers Village Raids & Trial Spawners'],
    iconType: 'potion_purple',
    imageUrl: 'https://minecraft.wiki/images/Ominous_Bottle_JE2_BE1.png'
  },

  // ===================== ORES & NATURAL BLOCKS =====================
  {
    id: 'gold_ore',
    name: 'Block of Gold Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Natural ore block found deep underground', 'Smelt in a Furnace to extract Raw Gold'],
    iconType: 'gold_ore',
    imageUrl: 'https://minecraft.wiki/images/Gold_Ore_JE7_BE4.png?9817a'
  },
  {
    id: 'deepslate_gold_ore',
    name: 'Deepslate Gold Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Found below Y=0', 'Smelt in Furnace to yield Raw Gold'],
    iconType: 'gold_ore',
    imageUrl: 'https://minecraft.wiki/images/Deepslate_Gold_Ore_JE2_BE2.png'
  },
  {
    id: 'iron_ore',
    name: 'Block of Iron Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Common metallic ore block', 'Smelt in a Furnace to extract Raw Iron'],
    iconType: 'iron_ore',
    imageUrl: 'https://minecraft.wiki/images/Iron_Ore_JE6_BE4.png'
  },
  {
    id: 'deepslate_iron_ore',
    name: 'Deepslate Iron Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Deepslate variant of Iron Ore', 'Smelt in a Furnace for Raw Iron'],
    iconType: 'iron_ore',
    imageUrl: 'https://minecraft.wiki/images/Deepslate_Iron_Ore_JE2_BE2.png'
  },
  {
    id: 'copper_ore',
    name: 'Block of Copper Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Common mineral block', 'Smelt in a Furnace to extract Raw Copper'],
    iconType: 'copper_ore',
    imageUrl: 'https://minecraft.wiki/images/Copper_Ore_JE2_BE2.png'
  },
  {
    id: 'diamond_ore',
    name: 'Block of Diamond Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Precious ore found deep near bedrock', 'Mines into Diamonds with an Iron or Diamond Pickaxe'],
    iconType: 'diamond_ore',
    imageUrl: 'https://minecraft.wiki/images/Diamond_Ore_JE5_BE5.png'
  },
  {
    id: 'deepslate_diamond_ore',
    name: 'Deepslate Diamond Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Embedded within hard deepslate rock near Y=-58', 'Yields Diamonds when mined'],
    iconType: 'diamond_ore',
    imageUrl: 'https://minecraft.wiki/images/Deepslate_Diamond_Ore_JE2_BE2.png'
  },
  {
    id: 'coal_ore',
    name: 'Coal Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Abundant fuel source found in mountain cliffs and caverns'],
    iconType: 'coal',
    imageUrl: 'https://minecraft.wiki/images/Coal_Ore_JE5_BE4.png'
  },
  {
    id: 'ancient_debris',
    name: 'Ancient Debris',
    category: 'building',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Rare fossilized Nether ore immune to TNT explosions', 'Smelt in a Furnace to obtain Netherite Scrap'],
    iconType: 'obsidian',
    imageUrl: 'https://minecraft.wiki/images/Ancient_Debris_JE1_BE1.png'
  },
  {
    id: 'lapis_ore',
    name: 'Lapis Lazuli Ore',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Drops 4-9 Lapis Lazuli gems when mined'],
    iconType: 'lapis',
    imageUrl: 'https://minecraft.wiki/images/Lapis_Lazuli_Ore_JE4_BE4.png'
  },
  {
    id: 'grass_block',
    name: 'Grass Block',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['The iconic topsoil block of the Overworld surface', 'Spreads grass to adjacent dirt blocks'],
    iconType: 'grass_block',
    imageUrl: 'https://minecraft.wiki/images/Grass_Block_JE7_BE6.png'
  },
  {
    id: 'dirt',
    name: 'Dirt',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Universal soil block for agriculture and landscaping'],
    iconType: 'dirt',
    imageUrl: 'https://minecraft.wiki/images/Dirt_JE2_BE2.png'
  },
  {
    id: 'sand',
    name: 'Sand',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Gravity-affected block found in deserts and beaches', 'Smelt in a Furnace to produce Glass'],
    iconType: 'sand',
    imageUrl: 'https://minecraft.wiki/images/Sand_JE3_BE2.png'
  },
  {
    id: 'gravel',
    name: 'Gravel',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Subject to gravity', 'Drops Flint when dug with a shovel'],
    iconType: 'gravel',
    imageUrl: 'https://minecraft.wiki/images/Gravel_JE5_BE4.png'
  },
  {
    id: 'stone',
    name: 'Stone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Natural stone block produced by smelting Cobblestone in a Furnace'],
    iconType: 'stone',
    imageUrl: 'https://minecraft.wiki/images/Stone_JE5_BE3.png'
  },
  {
    id: 'smooth_stone',
    name: 'Smooth Stone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelted twice from Cobblestone', 'Crafts Blast Furnaces and Armor Stands'],
    iconType: 'stone',
    imageUrl: 'https://minecraft.wiki/images/Smooth_Stone_JE2_BE2.png'
  },
  {
    id: 'cobblestone',
    name: 'Cobblestone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Fractured stone block', 'Smelt in a Furnace to restore Smooth Stone'],
    iconType: 'cobblestone',
    imageUrl: 'https://minecraft.wiki/images/Cobblestone_JE5_BE3.png'
  },
  {
    id: 'stone_bricks',
    name: 'Stone Bricks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Architectural building brick found in strongholds'],
    iconType: 'stone',
    imageUrl: 'https://minecraft.wiki/images/Stone_Bricks_JE3_BE2.png'
  },
  {
    id: 'deepslate_bricks',
    name: 'Deepslate Bricks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Dense dark building stone of Ancient Cities'],
    iconType: 'deepslate_bricks',
    imageUrl: 'https://minecraft.wiki/images/Deepslate_Bricks_JE2_BE2.png'
  },
  {
    id: 'reinforced_deepslate',
    name: 'Reinforced Deepslate',
    category: 'building',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Extremely blast-resistant frame block found only in Ancient City portals'],
    iconType: 'deepslate_bricks',
    imageUrl: 'https://minecraft.wiki/images/Reinforced_Deepslate_JE1_BE1.png'
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Blast Resistance: 1200', 'Forms when water touches lava source, builds Nether Portals'],
    iconType: 'obsidian',
    imageUrl: 'https://minecraft.wiki/images/Obsidian_JE3_BE2.png'
  },
  {
    id: 'crying_obsidian',
    name: 'Crying Obsidian',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Luminescent purple obsidian', 'Used to craft Respawn Anchors in the Nether'],
    iconType: 'crying_obsidian',
    imageUrl: 'https://minecraft.wiki/images/Crying_Obsidian_JE2_BE2.png'
  },
  {
    id: 'bedrock',
    name: 'Bedrock',
    category: 'building',
    maxStack: 64,
    rarity: 'epic',
    lore: ['Unbreakable survival block at the foundation of the world'],
    iconType: 'bedrock',
    imageUrl: 'https://minecraft.wiki/images/Bedrock_JE2_BE2.png'
  },
  {
    id: 'glass',
    name: 'Glass',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Transparent window block', 'Smelted directly from Sand in a Furnace'],
    iconType: 'glass',
    imageUrl: 'https://minecraft.wiki/images/Glass_JE4_BE2.png'
  },
  {
    id: 'oak_wood_log',
    name: 'Oak Log',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Harvested from Oak trees', 'Craft 1 Oak Log into 4 Oak Planks'],
    iconType: 'oak_log',
    imageUrl: 'https://minecraft.wiki/images/Oak_Log_JE5_BE3.png'
  },
  {
    id: 'oak_planks',
    name: 'Oak Wood Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafted from Oak Wood Logs', 'Fundamental building and crafting material'],
    iconType: 'oak_planks',
    imageUrl: 'https://minecraft.wiki/images/Oak_Planks.png'
  },
  {
    id: 'birch_planks',
    name: 'Birch Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Light-colored wooden planks crafted from Birch Logs'],
    iconType: 'oak_planks',
    imageUrl: 'https://minecraft.wiki/images/Birch_Planks.png'
  },
  {
    id: 'cherry_planks',
    name: 'Cherry Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Beautiful pastel pink wood from Cherry Blossom Groves'],
    iconType: 'oak_planks',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Planks_JE1_BE1.png'
  },
  {
    id: 'sponge',
    name: 'Sponge',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Drains up to 65 water blocks instantly', 'Found in Ocean Monuments'],
    iconType: 'sponge',
    imageUrl: 'https://minecraft.wiki/images/Sponge_JE3_BE3.png'
  },
  {
    id: 'wet_sponge',
    name: 'Wet Sponge',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Saturated with ocean water', 'Smelt in a Furnace to dry back into a clean Sponge'],
    iconType: 'wet_sponge',
    imageUrl: 'https://minecraft.wiki/images/Wet_Sponge_JE2_BE2.png'
  },
  {
    id: 'blue_ice',
    name: 'Blue Ice',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Super slippery block', 'Enables fastest boat travel speeds in Minecraft'],
    iconType: 'glass',
    imageUrl: 'https://minecraft.wiki/images/Blue_Ice_JE2_BE1.png'
  },
  {
    id: 'sculk',
    name: 'Sculk Block',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Deep dark biome block that absorbs and stores mob XP'],
    iconType: 'sculk',
    imageUrl: 'https://minecraft.wiki/images/Sculk_JE2_BE1.png'
  },
  {
    id: 'sculk_catalyst',
    name: 'Sculk Catalyst',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Converts XP from nearby deceased mobs into expanding sculk growth'],
    iconType: 'sculk',
    imageUrl: 'https://minecraft.wiki/images/Sculk_Catalyst_JE2_BE1.png'
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Boosts Enchanting Table level up to 30 when placed around it'],
    iconType: 'bookshelf',
    imageUrl: 'https://minecraft.wiki/images/Bookshelf_JE4_BE2.png'
  },
  {
    id: 'enchanting_table',
    name: 'Enchanting Table',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Enchants weapons, armor, and tools using XP & Lapis'],
    iconType: 'enchanting_table',
    imageUrl: 'https://minecraft.wiki/images/Enchanting_Table_JE4_BE2.png'
  },
  {
    id: 'anvil',
    name: 'Anvil',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Repairs, renames, and applies Enchanted Books to gear'],
    iconType: 'anvil',
    imageUrl: 'https://minecraft.wiki/images/Anvil_JE2_BE2.png'
  },
  {
    id: 'crafting_table_item',
    name: 'Crafting Table',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Provides a 3x3 crafting grid to craft advanced items'],
    iconType: 'crafting_table',
    imageUrl: 'https://minecraft.wiki/images/Crafting_Table_JE4_BE3.png'
  },
  {
    id: 'furnace_item',
    name: 'Furnace',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelts ores, cooks food, and refines materials using fuel'],
    iconType: 'furnace',
    imageUrl: 'https://minecraft.wiki/images/Furnace_JE4.png'
  },
  {
    id: 'blast_furnace',
    name: 'Blast Furnace',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Smelts ores and metals twice as fast as regular furnaces'],
    iconType: 'furnace',
    imageUrl: 'https://minecraft.wiki/images/Blast_Furnace_JE2.png'
  },
  {
    id: 'smoker',
    name: 'Smoker',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Cooks meat and food items twice as fast as regular furnaces'],
    iconType: 'furnace',
    imageUrl: 'https://minecraft.wiki/images/Smoker_JE2.png'
  },
  {
    id: 'lantern',
    name: 'Lantern',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Light Level: 15 (Brighter than torches)'],
    iconType: 'lantern',
    imageUrl: 'https://minecraft.wiki/images/Lantern_JE1_BE1.png'
  },
  {
    id: 'soul_lantern',
    name: 'Soul Lantern',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Emits blue soul fire light, repels Piglins'],
    iconType: 'lantern',
    imageUrl: 'https://minecraft.wiki/images/Soul_Lantern_JE1_BE1.png'
  },
  {
    id: 'sea_lantern',
    name: 'Sea Lantern',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Underwater light source (Light Level 15)'],
    iconType: 'sea_lantern',
    imageUrl: 'https://minecraft.wiki/images/Sea_Lantern_JE2_BE2.png'
  },
  {
    id: 'glowstone',
    name: 'Glowstone',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Natural luminous Nether cluster (Light Level 15)'],
    iconType: 'lantern',
    imageUrl: 'https://minecraft.wiki/images/Glowstone_JE4_BE2.png'
  },
  {
    id: 'chest_item',
    name: 'Chest',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Single chest (27 slots), combines to Large Chest (54 slots)'],
    iconType: 'chest',
    imageUrl: 'https://minecraft.wiki/images/Chest_JE6.png'
  },
  {
    id: 'barrel_item',
    name: 'Barrel',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Fisherman job site block with 27 storage slots that opens even with blocks on top'],
    iconType: 'chest',
    imageUrl: 'https://minecraft.wiki/images/Barrel_JE2_BE1.png'
  },
  {
    id: 'ender_chest_item',
    name: 'Ender Chest',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Private interdimensional storage linked per player'],
    iconType: 'ender_chest',
    imageUrl: 'https://minecraft.wiki/images/Ender_Chest_JE3_BE2.png'
  },
  {
    id: 'shulker_box_item',
    name: 'Purple Shulker Box',
    category: 'building',
    maxStack: 1,
    rarity: 'rare',
    lore: ['Preserves all contained items when mined! Portable inventory expander'],
    iconType: 'shulker_box',
    imageUrl: 'https://minecraft.wiki/images/Shulker_Box_JE2_BE2.png'
  },
  {
    id: 'torch',
    name: 'Torch',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Light Level: 14', 'Crafted from 1 Coal + 1 Stick'],
    iconType: 'torch',
    imageUrl: 'https://minecraft.wiki/images/Torch_JE4_BE2.png'
  },
  {
    id: 'tnt',
    name: 'TNT',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Explosive block, ignite with redstone or fire'],
    iconType: 'tnt',
    imageUrl: 'https://minecraft.wiki/images/TNT_JE3_BE2.png'
  },

  // ===================== REDSTONE & AUTOMATION =====================
  {
    id: 'crafter',
    name: 'Crafter',
    category: 'redstone',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Automated crafting machine powered by redstone pulses (1.21 Tricky Trials)'],
    iconType: 'crafter',
    imageUrl: 'https://minecraft.wiki/images/Crafter_JE2_BE1.png'
  },
  {
    id: 'redstone_dust',
    name: 'Redstone Dust',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Transmits redstone signals across power networks'],
    iconType: 'redstone_dust',
    imageUrl: 'https://minecraft.wiki/images/Redstone_Dust_JE2_BE2.png'
  },
  {
    id: 'redstone_block',
    name: 'Block of Redstone',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Constant power source (Signal strength 15)'],
    iconType: 'redstone_block',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Redstone_JE2_BE2.png'
  },
  {
    id: 'redstone_repeater',
    name: 'Redstone Repeater',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Repeats signal, delays 1-4 redstone ticks'],
    iconType: 'repeater',
    imageUrl: 'https://minecraft.wiki/images/Redstone_Repeater_%28item%29_JE3_BE2.png'
  },
  {
    id: 'redstone_comparator',
    name: 'Redstone Comparator',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Measures container fullness or subtracts signal strengths'],
    iconType: 'comparator',
    imageUrl: 'https://minecraft.wiki/images/Redstone_Comparator_%28item%29_JE3_BE2.png'
  },
  {
    id: 'sticky_piston',
    name: 'Sticky Piston',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Pushes and pulls up to 12 blocks using slime'],
    iconType: 'sticky_piston',
    imageUrl: 'https://minecraft.wiki/images/Sticky_Piston_JE3_BE2.png'
  },
  {
    id: 'piston',
    name: 'Piston',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Pushes up to 12 blocks when activated'],
    iconType: 'piston',
    imageUrl: 'https://minecraft.wiki/images/Piston_JE3_BE2.png'
  },
  {
    id: 'observer',
    name: 'Observer',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Detects block state updates and outputs a 1-tick pulse'],
    iconType: 'observer',
    imageUrl: 'https://minecraft.wiki/images/Observer_JE4_BE2.png'
  },
  {
    id: 'hopper_item',
    name: 'Hopper',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Transfers 2.5 items per second between containers'],
    iconType: 'hopper',
    imageUrl: 'https://minecraft.wiki/images/Hopper_%28item%29_JE4_BE2.png'
  },
  {
    id: 'dispenser_item',
    name: 'Dispenser',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Shoots arrows, places water/lava buckets, equips armor'],
    iconType: 'dispenser',
    imageUrl: 'https://minecraft.wiki/images/Dispenser_JE4_BE2.png'
  },
  {
    id: 'dropper_item',
    name: 'Dropper',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Ejects items as loose floating entities or into containers'],
    iconType: 'dropper',
    imageUrl: 'https://minecraft.wiki/images/Dropper_JE3_BE2.png'
  },
  {
    id: 'slime_block',
    name: 'Slime Block',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Bounces entities high, adheres to adjacent blocks in flying machines'],
    iconType: 'slime_block',
    imageUrl: 'https://minecraft.wiki/images/Slime_Block_JE2_BE2.png'
  },
  {
    id: 'honey_block',
    name: 'Honey Block',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: ['Reduces fall damage by 80%, sticks entities without sticking to slime'],
    iconType: 'honey_block',
    imageUrl: 'https://minecraft.wiki/images/Honey_Block_JE1_BE1.png'
  },

  // ===================== FOOD & CROPS =====================
  {
    id: 'bread',
    name: 'Bread',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+5 Hunger (2.5 bars), 6.0 Saturation', 'Food staple crafted from 3 Wheat horizontally'],
    iconType: 'bread',
    imageUrl: 'https://minecraft.wiki/images/Bread_JE3_BE3.png?e1046'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Agricultural crop', 'Craft 3 Wheat horizontally in a Crafting Table to bake Bread'],
    iconType: 'wheat',
    imageUrl: 'https://minecraft.wiki/images/Wheat_JE2_BE2.png?c39ee'
  },
  {
    id: 'raw_beef',
    name: 'Raw Beef',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+3 Hunger (1.5 bars), 1.8 Saturation', 'Smelt in a Furnace to cook into Steak'],
    iconType: 'raw_beef',
    imageUrl: 'https://minecraft.wiki/images/Raw_Beef_JE4_BE3.png?f3d10'
  },
  {
    id: 'cooked_beef',
    name: 'Cooked Beef',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+8 Hunger (4 bars), 12.8 Saturation', 'Top tier survival food (Steak)'],
    iconType: 'cooked_beef',
    imageUrl: 'https://minecraft.wiki/images/Steak_JE4_BE3.png'
  },
  {
    id: 'raw_porkchop',
    name: 'Raw Porkchop',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+3 Hunger', 'Smelt in a Furnace to make Cooked Porkchop'],
    iconType: 'raw_porkchop',
    imageUrl: 'https://minecraft.wiki/images/Raw_Porkchop_JE4_BE3.png'
  },
  {
    id: 'cooked_porkchop',
    name: 'Cooked Porkchop',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+8 Hunger, 12.8 Saturation', 'Hearty high-saturation meal'],
    iconType: 'cooked_porkchop',
    imageUrl: 'https://minecraft.wiki/images/Cooked_Porkchop_JE4_BE3.png'
  },
  {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Caught in rivers and oceans', 'Smelt in a Furnace to cook'],
    iconType: 'cooked_porkchop',
    imageUrl: 'https://minecraft.wiki/images/Raw_Salmon_JE2_BE2.png'
  },
  {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+6 Hunger, 9.6 Saturation'],
    iconType: 'cooked_porkchop',
    imageUrl: 'https://minecraft.wiki/images/Cooked_Salmon_JE2_BE2.png'
  },
  {
    id: 'enchanted_golden_apple',
    name: 'Enchanted Golden Apple',
    category: 'food',
    maxStack: 64,
    rarity: 'epic',
    enchanted: true,
    lore: ['Absorption IV (2:00)', 'Regeneration II (0:20)', 'Fire Resistance (5:00)', 'Resistance (5:00)', 'The legendary Notch Apple'],
    iconType: 'enchanted_golden_apple',
    imageUrl: 'https://minecraft.wiki/images/Enchanted_Golden_Apple_JE2_BE2.gif'
  },
  {
    id: 'golden_apple',
    name: 'Golden Apple',
    category: 'food',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Absorption (2:00)', 'Regeneration II (0:05)', '+4 Hunger, 9.6 Saturation'],
    iconType: 'golden_apple',
    imageUrl: 'https://minecraft.wiki/images/Golden_Apple_JE2_BE2.png'
  },
  {
    id: 'golden_carrot',
    name: 'Golden Carrot',
    category: 'food',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['+6 Hunger, 14.4 Saturation', 'Highest saturation food in Minecraft'],
    iconType: 'golden_carrot',
    imageUrl: 'https://minecraft.wiki/images/Golden_Carrot_JE4_BE2.png'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+3 Hunger', 'Breed rabbits and craft Golden Carrots'],
    iconType: 'carrot',
    imageUrl: 'https://minecraft.wiki/images/Carrot_JE3_BE2.png'
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+1 Hunger', 'Bake in a Furnace to make Baked Potatoes'],
    iconType: 'potato',
    imageUrl: 'https://minecraft.wiki/images/Potato_JE3_BE2.png'
  },
  {
    id: 'baked_potato',
    name: 'Baked Potato',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+5 Hunger, 6.0 Saturation', 'Cooked in a Furnace from raw Potato'],
    iconType: 'baked_potato',
    imageUrl: 'https://minecraft.wiki/images/Baked_Potato_JE4_BE2.png'
  },
  {
    id: 'sweet_berries',
    name: 'Sweet Berries',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Harvested from thorny bushes in Taiga forests'],
    iconType: 'sweet_berries',
    imageUrl: 'https://minecraft.wiki/images/Sweet_Berries_JE2_BE2.png'
  },
  {
    id: 'glow_berries',
    name: 'Glow Berries',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Luminescent cave fruit that emits light level 14'],
    iconType: 'glow_berries',
    imageUrl: 'https://minecraft.wiki/images/Glow_Berries_JE2_BE1.png'
  },
  {
    id: 'honey_bottle',
    name: 'Honey Bottle',
    category: 'food',
    maxStack: 16,
    rarity: 'common',
    lore: ['Cures Poison effect instantly without clearing other buffs'],
    iconType: 'honey_bottle',
    imageUrl: 'https://minecraft.wiki/images/Honey_Bottle_JE2_BE2.png'
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['+4 Hunger, 2.4 Saturation', 'Food item dropped by oak leaves'],
    iconType: 'apple',
    imageUrl: 'https://minecraft.wiki/images/Apple_JE3_BE3.png'
  },
  {
    id: 'milk_bucket',
    name: 'Milk Bucket',
    category: 'food',
    maxStack: 1,
    rarity: 'common',
    lore: ['Obtained from cows using an iron bucket', 'Removes all active status effects and potion boosts'],
    iconType: 'milk_bucket',
    imageUrl: 'https://minecraft.wiki/images/Milk_Bucket_JE2_BE2.png'
  },
  {
    id: 'cake',
    name: 'Cake',
    category: 'food',
    maxStack: 1,
    rarity: 'common',
    lore: ['Can be sliced 7 times on a block'],
    iconType: 'cake',
    imageUrl: 'https://minecraft.wiki/images/Cake_JE4.png'
  },
  {
    id: 'cookie',
    name: 'Cookie',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafted from Wheat and Cocoa Beans'],
    iconType: 'bread',
    imageUrl: 'https://minecraft.wiki/images/Cookie_JE2_BE2.png'
  },
  {
    id: 'chorus_fruit',
    name: 'Chorus Fruit',
    category: 'food',
    maxStack: 64,
    rarity: 'common',
    lore: ['Teleports player up to 8 blocks randomly when eaten'],
    iconType: 'chorus_fruit',
    imageUrl: 'https://minecraft.wiki/images/Chorus_Fruit_JE2_BE2.png'
  },
  {
    id: 'ender_pearl',
    name: 'Ender Pearl',
    category: 'valuable',
    maxStack: 16,
    rarity: 'uncommon',
    lore: ['Throws to teleport to impact point (inflicts 5 damage)'],
    iconType: 'ender_pearl',
    imageUrl: 'https://minecraft.wiki/images/Ender_Pearl_JE3_BE2.png'
  },
  {
    id: 'eye_of_ender',
    name: 'Eye of Ender',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Crafted from Ender Pearl + Blaze Powder', 'Locates Strongholds and activates End Portals'],
    iconType: 'ender_pearl',
    imageUrl: 'https://minecraft.wiki/images/Eye_of_Ender_JE2_BE2.png'
  },
  {
    id: 'firework_rocket',
    name: 'Firework Rocket',
    category: 'valuable',
    maxStack: 64,
    rarity: 'common',
    lore: ['Flight Duration: 3', 'Elytra flight propulsion rocket'],
    iconType: 'firework_rocket',
    imageUrl: 'https://minecraft.wiki/images/Firework_Rocket_JE2_BE2.png'
  },

  // ===================== BREWING & POTIONS =====================
  {
    id: 'water_bottle',
    name: 'Water Bottle',
    category: 'brewing',
    maxStack: 1,
    rarity: 'common',
    lore: ['No Effects', 'Base ingredient for brewing all potions in the Brewing Stand'],
    iconType: 'water_bottle',
    imageUrl: 'https://minecraft.wiki/images/Water_Bottle_JE2.png'
  },
  {
    id: 'potion_healing',
    name: 'Potion of Healing II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Instant Health II (Restores 8 hearts)'],
    iconType: 'potion_red',
    imageUrl: 'https://minecraft.wiki/images/Potion_of_Healing_JE2_BE2.png'
  },
  {
    id: 'potion_strength',
    name: 'Potion of Strength II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Strength II (1:30)', '+3 Attack Damage per strike'],
    iconType: 'potion_purple',
    imageUrl: 'https://minecraft.wiki/images/Potion_of_Strength_JE2_BE2.png'
  },
  {
    id: 'splash_potion_speed',
    name: 'Splash Potion of Speed II',
    category: 'brewing',
    maxStack: 1,
    rarity: 'uncommon',
    lore: ['Speed II (1:07)', '+40% Movement Speed'],
    iconType: 'splash_potion_cyan',
    imageUrl: 'https://minecraft.wiki/images/Splash_Potion_of_Swiftness_JE2_BE2.png'
  },
  {
    id: 'brewing_stand',
    name: 'Brewing Stand',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Brews potions with Blaze Powder as fuel'],
    iconType: 'brewing_stand',
    imageUrl: 'https://minecraft.wiki/images/Brewing_Stand_%28item%29_JE3_BE2.png'
  },
  {
    id: 'blaze_rod',
    name: 'Blaze Rod',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Dropped by Blazes in Nether Fortresses', 'Furnace fuel for 12 items & crafts Brewing Stands'],
    iconType: 'blaze_rod',
    imageUrl: 'https://minecraft.wiki/images/Blaze_Rod_JE2_BE2.png'
  },
  {
    id: 'blaze_powder',
    name: 'Blaze Powder',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crafts Eye of Ender & fuels Brewing Stands'],
    iconType: 'blaze_powder',
    imageUrl: 'https://minecraft.wiki/images/Blaze_Powder_JE2_BE2.png'
  },
  {
    id: 'ghast_tear',
    name: 'Ghast Tear',
    category: 'brewing',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Brews Potion of Regeneration'],
    iconType: 'ghast_tear',
    imageUrl: 'https://minecraft.wiki/images/Ghast_Tear_JE2_BE2.png'
  },
  {
    id: 'nether_wart',
    name: 'Nether Wart',
    category: 'brewing',
    maxStack: 64,
    rarity: 'common',
    lore: ['Primary ingredient for Awkward Potions'],
    iconType: 'nether_wart',
    imageUrl: 'https://minecraft.wiki/images/Nether_Wart_%28item%29_JE2_BE2.png'
  },
  {
    id: 'experience_bottle',
    name: 'Bottle o\' Enchanting',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Shatters to yield 3-11 Experience Points'],
    iconType: 'bottle_o_enchanting',
    imageUrl: 'https://minecraft.wiki/images/Bottle_o%27_Enchanting_JE2_BE2.png'
  },
  {
    id: 'stick',
    name: 'Stick',
    category: 'tools',
    maxStack: 64,
    rarity: 'common',
    lore: ['Essential crafting component for tools and torches'],
    iconType: 'stick',
    imageUrl: 'https://minecraft.wiki/images/Stick_JE3_BE2.png'
  },

  // ===================== 1.20 TRAILS & TALES UPDATE =====================
  // ARCHAEOLOGY TOOLS & BLOCKS
  {
    id: 'brush',
    name: 'Brush',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    lore: [
      'Archaeology tool introduced in 1.20',
      'Brushes Suspicious Sand & Suspicious Gravel to uncover ancient artifacts and sherds'
    ],
    iconType: 'brush',
    imageUrl: 'https://minecraft.wiki/images/Brush_JE2_BE1.png'
  },
  {
    id: 'suspicious_sand',
    name: 'Suspicious Sand',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Fragile archaeological sand found in Desert Pyramids and Warm Ocean Ruins',
      'Brush with a Brush to reveal hidden treasures'
    ],
    iconType: 'suspicious_sand',
    imageUrl: 'https://minecraft.wiki/images/Suspicious_Sand_JE1_BE1.png'
  },
  {
    id: 'suspicious_gravel',
    name: 'Suspicious Gravel',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Fragile archaeological gravel found in Trail Ruins and Cold Ocean Ruins',
      'Brush with a Brush to reveal Pottery Sherds and Smithing Templates'
    ],
    iconType: 'suspicious_gravel',
    imageUrl: 'https://minecraft.wiki/images/Suspicious_Gravel_JE1_BE1.png'
  },
  {
    id: 'decorated_pot',
    name: 'Decorated Pot',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Ancient ornamental amphora crafted from 4 Pottery Sherds or Bricks',
      'Can store a single stack of items inside'
    ],
    iconType: 'decorated_pot',
    imageUrl: 'https://minecraft.wiki/images/Decorated_Pot_%28item%29_JE3_BE2.png'
  },

  // 20 POTTERY SHERDS (1.20 ARCHAEOLOGY)
  {
    id: 'angler_pottery_sherd',
    name: 'Angler Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Warm Ocean Ruins', 'Depicts a fishing rod and fish hook'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Angler_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'archer_pottery_sherd',
    name: 'Archer Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts an archer with a drawn bow'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Archer_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'arms_up_pottery_sherd',
    name: 'Arms Up Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts an ancient figure raising hands'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Arms_Up_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'blade_pottery_sherd',
    name: 'Blade Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Cold Ocean Ruins', 'Depicts an ancient sword blade'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Blade_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'brewer_pottery_sherd',
    name: 'Brewer Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts an alchemical brewing stand'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Brewer_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'burn_pottery_sherd',
    name: 'Burn Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts roaring flames'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Burn_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'danger_pottery_sherd',
    name: 'Danger Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts a creeping explosive Creeper face'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Danger_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'explorer_pottery_sherd',
    name: 'Explorer Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Cold Ocean Ruins', 'Depicts ancient adventurer maps'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Explorer_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'friend_pottery_sherd',
    name: 'Friend Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts companion figures in unity'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Friend_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'heart_pottery_sherd',
    name: 'Heart Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts a heart of life'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Heart_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'heartbreak_pottery_sherd',
    name: 'Heartbreak Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts a cracked heartbroken emblem'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Heartbreak_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'howl_pottery_sherd',
    name: 'Howl Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts a wild wolf howling at the moon'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Howl_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'miner_pottery_sherd',
    name: 'Miner Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts a trusty pickaxe striking stone'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Miner_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'mourner_pottery_sherd',
    name: 'Mourner Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Cold Ocean Ruins', 'Depicts sorrowful tears of loss'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Mourner_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'plenty_pottery_sherd',
    name: 'Plenty Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Cold Ocean Ruins', 'Depicts an overflowing treasure goblet'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Plenty_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'prize_pottery_sherd',
    name: 'Prize Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts a grand championship cup'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Prize_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'sheaf_pottery_sherd',
    name: 'Sheaf Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Trail Ruins', 'Depicts sheaves of harvested golden wheat'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Sheaf_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'shelter_pottery_sherd',
    name: 'Shelter Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Warm Ocean Ruins', 'Depicts a snug haven house under tree'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Shelter_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'skull_pottery_sherd',
    name: 'Skull Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Desert Pyramids', 'Depicts an ancient skeletal skull'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Skull_Pottery_Sherd_JE2_BE1.png'
  },
  {
    id: 'snort_pottery_sherd',
    name: 'Snort Pottery Sherd',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: ['Excavated from Warm Ocean Ruins', 'Depicts the gentle snout of a Sniffer'],
    iconType: 'pottery_sherd',
    imageUrl: 'https://minecraft.wiki/images/Snort_Pottery_Sherd_JE2_BE1.png'
  },

  // SNIFFER & ANCIENT FLORA
  {
    id: 'sniffer_egg',
    name: 'Sniffer Egg',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Archaeological egg unearthed from Warm Ocean Ruins',
      'Hatches into a Snifflet in 20 minutes (10 mins on Moss Block)'
    ],
    iconType: 'sniffer_egg',
    imageUrl: 'https://minecraft.wiki/images/Sniffer_Egg_JE1_BE1.png'
  },
  {
    id: 'torchflower_seeds',
    name: 'Torchflower Seeds',
    category: 'food',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Ancient seeds sniffed out by a Sniffer mob',
      'Breed and tempt Sniffers, plant on farmland to grow Torchflowers'
    ],
    iconType: 'torchflower_seeds',
    imageUrl: 'https://minecraft.wiki/images/Torchflower_Seeds_JE1_BE1.png'
  },
  {
    id: 'torchflower',
    name: 'Torchflower',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Brilliant flame-like ancient bloom',
      'Crafts into Orange Dye or brews Suspicious Stew with Night Vision'
    ],
    iconType: 'torchflower',
    imageUrl: 'https://minecraft.wiki/images/Torchflower_JE2_BE1.png'
  },
  {
    id: 'pitcher_pod',
    name: 'Pitcher Pod',
    category: 'food',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Ancient bulb pod sniffed up from soil by a Sniffer',
      'Plant on farmland through 5 growth stages to yield a 2-block tall Pitcher Plant'
    ],
    iconType: 'pitcher_pod',
    imageUrl: 'https://minecraft.wiki/images/Pitcher_Pod_JE1_BE1.png'
  },
  {
    id: 'pitcher_plant',
    name: 'Pitcher Plant',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      '2-block tall prehistoric aquatic flower',
      'Crafts into Cyan Dye'
    ],
    iconType: 'pitcher_plant',
    imageUrl: 'https://minecraft.wiki/images/Pitcher_Plant_JE1_BE1.png'
  },

  // CHERRY BLOSSOM GROVE WOODSET (1.20)
  {
    id: 'cherry_sapling',
    name: 'Cherry Sapling',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Plant on dirt to grow a majestic Cherry Blossom tree'],
    iconType: 'cherry_sapling',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Sapling_JE1_BE1.png'
  },
  {
    id: 'cherry_leaves',
    name: 'Cherry Leaves',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Lush pink flowering foliage that gently sheds floating flower petals'],
    iconType: 'cherry_leaves',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Leaves_JE1_BE1.png'
  },
  {
    id: 'cherry_log',
    name: 'Cherry Log',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Dark purplish-brown outer bark with vibrant pink inner heartwood',
      'Crafts into 4 Cherry Planks'
    ],
    iconType: 'cherry_log',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Log_JE1_BE1.png'
  },
  {
    id: 'cherry_wood',
    name: 'Cherry Wood',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['All-sided cherry bark wood block'],
    iconType: 'cherry_log',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Wood_JE1_BE1.png'
  },
  {
    id: 'stripped_cherry_log',
    name: 'Stripped Cherry Log',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Bark stripped off using an Axe to expose bright pastel pink wood'],
    iconType: 'cherry_log',
    imageUrl: 'https://minecraft.wiki/images/Stripped_Cherry_Log_JE1_BE1.png'
  },
  {
    id: 'pink_petals',
    name: 'Pink Petals',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Ground carpet of delicate fallen cherry blossom petals',
      'Can be stacked up to 4 petals per block or crafted into Pink Dye'
    ],
    iconType: 'pink_petals',
    imageUrl: 'https://minecraft.wiki/images/Pink_Petals_JE2_BE1.png'
  },
  {
    id: 'cherry_door',
    name: 'Cherry Door',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Pink timber door with elegant square cutouts'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Door_JE1_BE1.png'
  },
  {
    id: 'cherry_trapdoor',
    name: 'Cherry Trapdoor',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Compact pink cherry wood trapdoor'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Trapdoor_JE1_BE1.png'
  },
  {
    id: 'cherry_hanging_sign',
    name: 'Cherry Hanging Sign',
    category: 'building',
    maxStack: 16,
    rarity: 'common',
    lore: ['Suspended pink wooden signage with dark chains'],
    iconType: 'hanging_sign',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Hanging_Sign_JE1_BE1.png'
  },
  {
    id: 'cherry_boat',
    name: 'Cherry Boat',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Vibrant pink cherry timber watercraft'],
    iconType: 'boat',
    imageUrl: 'https://minecraft.wiki/images/Cherry_Boat_JE1_BE1.png'
  },

  // BAMBOO WOODSET (1.20)
  {
    id: 'bamboo_block',
    name: 'Block of Bamboo',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Compact bundle crafted from 9 Bamboo stalks', 'Functions as bamboo wood log'],
    iconType: 'bamboo_block',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Bamboo_JE1_BE1.png'
  },
  {
    id: 'stripped_bamboo_block',
    name: 'Block of Stripped Bamboo',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Stripped bundle of smooth golden-green bamboo'],
    iconType: 'bamboo_block',
    imageUrl: 'https://minecraft.wiki/images/Block_of_Stripped_Bamboo_JE1_BE1.png'
  },
  {
    id: 'bamboo_planks',
    name: 'Bamboo Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Bright warm yellowish-green timber crafted from Bamboo blocks'],
    iconType: 'oak_planks',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Planks_JE1_BE1.png'
  },
  {
    id: 'bamboo_mosaic',
    name: 'Bamboo Mosaic',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Ornate cross-patterned parquet flooring unique to bamboo wood'],
    iconType: 'oak_planks',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Mosaic_JE1_BE1.png'
  },
  {
    id: 'bamboo_door',
    name: 'Bamboo Door',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Slatted bamboo entryway door'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Door_JE1_BE1.png'
  },
  {
    id: 'bamboo_trapdoor',
    name: 'Bamboo Trapdoor',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Fine woven bamboo hatch'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Trapdoor_JE1_BE1.png'
  },
  {
    id: 'bamboo_hanging_sign',
    name: 'Bamboo Hanging Sign',
    category: 'building',
    maxStack: 16,
    rarity: 'common',
    lore: ['Suspended woven bamboo plank sign'],
    iconType: 'hanging_sign',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Hanging_Sign_JE1_BE1.png'
  },
  {
    id: 'bamboo_raft',
    name: 'Bamboo Raft',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Traditional flat lashed-bamboo raft with dual steering paddles'],
    iconType: 'bamboo_raft',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Raft_JE2_BE1.png'
  },
  {
    id: 'bamboo_chest_raft',
    name: 'Bamboo Raft with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Mobile water vehicle with 27 cargo inventory slots'],
    iconType: 'bamboo_raft',
    imageUrl: 'https://minecraft.wiki/images/Bamboo_Raft_with_Chest_JE2_BE1.png'
  },

  // FUNCTIONAL & REDSTONE BLOCKS (1.20)
  {
    id: 'chiseled_bookshelf',
    name: 'Chiseled Bookshelf',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Interactive library bookshelf that holds up to 6 Books or Enchanted Books',
      'Outputs Redstone Comparator signal (1-6) based on last accessed slot'
    ],
    iconType: 'chiseled_bookshelf',
    imageUrl: 'https://minecraft.wiki/images/Chiseled_Bookshelf_JE1_BE1.png'
  },
  {
    id: 'calibrated_sculk_sensor',
    name: 'Calibrated Sculk Sensor',
    category: 'redstone',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Crafted with 1 Sculk Sensor + 3 Amethyst Shards',
      'Filters acoustic frequencies based on incoming Redstone signal strength on amethyst side'
    ],
    iconType: 'calibrated_sculk_sensor',
    imageUrl: 'https://minecraft.wiki/images/Calibrated_Sculk_Sensor_JE1_BE1.png'
  },
  {
    id: 'oak_hanging_sign',
    name: 'Oak Hanging Sign',
    category: 'building',
    maxStack: 16,
    rarity: 'common',
    lore: ['Custom suspended ceiling sign hanging from iron chains'],
    iconType: 'hanging_sign',
    imageUrl: 'https://minecraft.wiki/images/Oak_Hanging_Sign_JE1_BE1.png'
  },

  // 17 ARMOR TRIM SMITHING TEMPLATES (1.20)
  {
    id: 'netherite_upgrade_smithing_template',
    name: 'Netherite Upgrade Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Smithing Template',
      'Applies to: Diamond Gear',
      'Ingredients: Netherite Ingot',
      'Found exclusively in Bastion Remnant chests. Duplicated with 7 Diamonds + Netherrack'
    ],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Netherite_Upgrade_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'silence_armor_trim_smithing_template',
    name: 'Silence Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: [
      'Smithing Template (Ultra Rare 1.2% in Ancient City)',
      'Intricate acoustic trim pattern covering the entire armor plate'
    ],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Silence_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'ward_armor_trim_smithing_template',
    name: 'Ward Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Ancient City', 'Depicts Warden ribs and chest crest'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Ward_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'eye_armor_trim_smithing_template',
    name: 'Eye Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Stronghold Library', 'Depicts all-seeing Ender eyes'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Eye_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'vex_armor_trim_smithing_template',
    name: 'Vex Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Woodland Mansion', 'Depicts soaring Vex angel wings'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Vex_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'spire_armor_trim_smithing_template',
    name: 'Spire Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: End City', 'Depicts towering Purpur pinnacles'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Spire_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'rib_armor_trim_smithing_template',
    name: 'Rib Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Nether Fortress', 'Depicts Wither Skeleton ribcage bands'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Rib_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'snout_armor_trim_smithing_template',
    name: 'Snout Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Bastion Remnant', 'Depicts Piglin snout nose crest'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Snout_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'coast_armor_trim_smithing_template',
    name: 'Coast Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Sunken Shipwrecks', 'Depicts flowing ocean waves'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Coast_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'dune_armor_trim_smithing_template',
    name: 'Dune Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Desert Pyramid', 'Depicts undulating sand dunes'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Dune_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'sentry_armor_trim_smithing_template',
    name: 'Sentry Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Pillager Outpost', 'Depicts vigilant watchtower chevrons'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Sentry_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'wild_armor_trim_smithing_template',
    name: 'Wild Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Jungle Temple', 'Depicts wild vines and braided leaves'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Wild_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'tide_armor_trim_smithing_template',
    name: 'Tide Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Elder Guardian drop', 'Depicts tidal currents'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Tide_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'wayfinder_armor_trim_smithing_template',
    name: 'Wayfinder Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Trail Ruins (Archaeology)', 'Depicts ancient guiding compass lines'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Wayfinder_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'raiser_armor_trim_smithing_template',
    name: 'Raiser Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Trail Ruins (Archaeology)', 'Depicts uplifting angular motifs'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Raiser_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'shaper_armor_trim_smithing_template',
    name: 'Shaper Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Trail Ruins (Archaeology)', 'Depicts geometric masonry bands'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Shaper_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },
  {
    id: 'host_armor_trim_smithing_template',
    name: 'Host Armor Trim Smithing Template',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: ['Smithing Template', 'Source: Trail Ruins (Archaeology)', 'Depicts solemn protective crests'],
    iconType: 'smithing_template',
    imageUrl: 'https://minecraft.wiki/images/Host_Armor_Trim_Smithing_Template_JE1_BE1.png'
  },

  // 1.20 MUSIC & MOB HEADS
  {
    id: 'music_disc_relic',
    name: 'Music Disc (Aaron Cherof - Relic)',
    category: 'valuable',
    maxStack: 1,
    rarity: 'rare',
    lore: [
      'Archaeological vinyl disc unearthed from Trail Ruins',
      'Plays a vibrant retro-synth chiptune melody composed by Aaron Cherof'
    ],
    iconType: 'music_disc_relic',
    imageUrl: 'https://minecraft.wiki/images/Music_Disc_Relic_JE1_BE1.png'
  },
  {
    id: 'piglin_head',
    name: 'Piglin Head',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Dropped when a Piglin is blown up by a Charged Creeper',
      'Flaps its ears rhythmically when powered by Redstone or worn while walking'
    ],
    iconType: 'piglin_head',
    imageUrl: 'https://minecraft.wiki/images/Piglin_Head_%28item%29_JE1_BE1.png'
  },

  // ===================== 1.19 THE WILD UPDATE =====================
  // DEEP DARK, WARDEN & SCULK
  {
    id: 'echo_shard',
    name: 'Echo Shard',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Found exclusively in Ancient City loot chests',
      'Resonates with acoustic vibrations. 8 Echo Shards craft a Recovery Compass around a Compass'
    ],
    iconType: 'amethyst_shard',
    imageUrl: 'https://minecraft.wiki/images/Echo_Shard_JE1_BE1.png'
  },
  {
    id: 'disc_fragment_5',
    name: 'Disc Fragment (5)',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Fragment of Music Disc 5 unearthed from Ancient Cities',
      'Combine 9 fragments in a Crafting Table to restore the full disc'
    ],
    iconType: 'disc_fragment_5',
    imageUrl: 'https://minecraft.wiki/images/Disc_Fragment_5_JE1_BE1.png'
  },
  {
    id: 'music_disc_5',
    name: 'Music Disc (Samuel Åberg - 5)',
    category: 'valuable',
    maxStack: 1,
    rarity: 'rare',
    lore: [
      'Restored from 9 Disc Fragments',
      'Haunting Deep Dark ambient audio log recording footsteps and the Warden awakening'
    ],
    iconType: 'music_disc_5',
    imageUrl: 'https://minecraft.wiki/images/Music_Disc_5_JE1_BE1.png'
  },
  {
    id: 'sculk_sensor',
    name: 'Sculk Sensor',
    category: 'redstone',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Detects acoustic vibrations and footsteps up to 8 blocks away',
      'Emits a Redstone signal with strength proportional to vibration frequency'
    ],
    iconType: 'sculk_sensor',
    imageUrl: 'https://minecraft.wiki/images/Sculk_Sensor_JE1.png'
  },
  {
    id: 'sculk_shrieker',
    name: 'Sculk Shrieker',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Deep Dark hazard with bone tendrils',
      'Releases sonic shriek rings, inflicts Darkness effect, and summons the Warden on 4th activation'
    ],
    iconType: 'sculk_shrieker',
    imageUrl: 'https://minecraft.wiki/images/Sculk_Shrieker_JE2.png'
  },
  {
    id: 'sculk_vein',
    name: 'Sculk Vein',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Thin creeping fungal membrane spread across block surfaces',
      'Harvested cleanly using Silk Touch Hoe'
    ],
    iconType: 'sculk_vein',
    imageUrl: 'https://minecraft.wiki/images/Sculk_Vein_JE1_BE1.png'
  },
  {
    id: 'swift_sneak_book',
    name: 'Enchanted Book (Swift Sneak III)',
    category: 'tools',
    maxStack: 1,
    rarity: 'rare',
    enchanted: true,
    lore: [
      'Ancient City exclusive treasure enchantment',
      'Swift Sneak III',
      'Increases crouching movement speed to 100% normal walking speed',
      'Applies to Leggings'
    ],
    iconType: 'enchanted_book',
    imageUrl: 'https://minecraft.wiki/images/Enchanted_Book.gif'
  },

  // MANGROVE SWAMP WOODSET (1.19)
  {
    id: 'mangrove_propagule',
    name: 'Mangrove Propagule',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Hanging mangrove sapling fruit',
      'Can be planted on dirt/mud or completely submerged underwater to grow Mangrove trees'
    ],
    iconType: 'mangrove_propagule',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Propagule_JE1_BE1.png'
  },
  {
    id: 'mangrove_leaves',
    name: 'Mangrove Leaves',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Lush canopy foliage of the Mangrove Swamp',
      'Use Bone Meal on them to grow hanging propagules'
    ],
    iconType: 'mangrove_leaves',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Leaves_JE1_BE1.png'
  },
  {
    id: 'mangrove_log',
    name: 'Mangrove Log',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Dense swamp timber with rough dark bark and deep red heartwood',
      'Crafts into 4 Mangrove Planks'
    ],
    iconType: 'mangrove_log',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Log_JE1_BE1.png'
  },
  {
    id: 'mangrove_wood',
    name: 'Mangrove Wood',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['6-sided barked mangrove timber block'],
    iconType: 'mangrove_log',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Wood_JE1_BE1.png'
  },
  {
    id: 'stripped_mangrove_log',
    name: 'Stripped Mangrove Log',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Stripped with an Axe to display deep crimson wood grain'],
    iconType: 'stripped_mangrove_log',
    imageUrl: 'https://minecraft.wiki/images/Stripped_Mangrove_Log_JE1_BE1.png'
  },
  {
    id: 'mangrove_planks',
    name: 'Mangrove Planks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Warm deep crimson-red planks crafted from Mangrove Logs'],
    iconType: 'mangrove_planks',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Planks_JE1_BE1.png'
  },
  {
    id: 'mangrove_roots',
    name: 'Mangrove Roots',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Tangled stilt roots supporting swamp mangrove trees',
      'Waterloggable and permeable'
    ],
    iconType: 'mangrove_roots',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Roots_JE1_BE1.png'
  },
  {
    id: 'muddy_mangrove_roots',
    name: 'Muddy Mangrove Roots',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Roots submerged and caked in dense swamp mud',
      'Crafted with 1 Mangrove Roots + 1 Mud block'
    ],
    iconType: 'muddy_mangrove_roots',
    imageUrl: 'https://minecraft.wiki/images/Muddy_Mangrove_Roots_JE1_BE1.png'
  },
  {
    id: 'mangrove_door',
    name: 'Mangrove Door',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Crimson wooden door with square lookout lattice'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Door_JE1_BE1.png'
  },
  {
    id: 'mangrove_trapdoor',
    name: 'Mangrove Trapdoor',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: ['Sturdy crimson swamp wood hatch'],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Trapdoor_JE1_BE1.png'
  },
  {
    id: 'mangrove_sign',
    name: 'Mangrove Sign',
    category: 'building',
    maxStack: 16,
    rarity: 'common',
    lore: ['Standing dark crimson wood sign'],
    iconType: 'hanging_sign',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Sign_JE1_BE1.png'
  },
  {
    id: 'mangrove_boat',
    name: 'Mangrove Boat',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Fast water craft constructed of deep red mangrove timber'],
    iconType: 'mangrove_boat',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Boat_JE1_BE1.png'
  },
  {
    id: 'mangrove_chest_boat',
    name: 'Mangrove Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: ['Water vessel with 27-slot chest storage on the stern'],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Boat_with_Chest_JE1_BE1.png'
  },

  // MUD BLOCKS & BRICKS (1.19)
  {
    id: 'mud',
    name: 'Mud',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Moist earth formed when splashing a Water Bottle onto Dirt',
      'Entities sink slightly into mud. Placed over Dripstone to dry into Clay'
    ],
    iconType: 'mud',
    imageUrl: 'https://minecraft.wiki/images/Mud_JE1_BE1.png'
  },
  {
    id: 'packed_mud',
    name: 'Packed Mud',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Crafted with 1 Mud + 1 Wheat',
      'Compacted adobe building block, crafts into Mud Bricks'
    ],
    iconType: 'packed_mud',
    imageUrl: 'https://minecraft.wiki/images/Packed_Mud_JE1_BE1.png'
  },
  {
    id: 'mud_bricks',
    name: 'Mud Bricks',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Crafted from 4 Packed Mud in a 2x2 grid',
      'Warm earthy brick masonry with high blast resistance'
    ],
    iconType: 'mud_bricks',
    imageUrl: 'https://minecraft.wiki/images/Mud_Bricks_JE1_BE1.png'
  },

  // FROGS, TADPOLES & FROGLIGHTS (1.19)
  {
    id: 'ochre_froglight',
    name: 'Ochre Froglight',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Warm golden-yellow bioluminescent block (Light Level 15)',
      'Dropped when an orange Warm Frog eats a small Magma Cube'
    ],
    iconType: 'ochre_froglight',
    imageUrl: 'https://minecraft.wiki/images/Ochre_Froglight_JE1_BE1.png'
  },
  {
    id: 'verdant_froglight',
    name: 'Verdant Froglight',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Emerald-green bioluminescent block (Light Level 15)',
      'Dropped when a green Cold Frog eats a small Magma Cube'
    ],
    iconType: 'verdant_froglight',
    imageUrl: 'https://minecraft.wiki/images/Verdant_Froglight_JE1_BE1.png'
  },
  {
    id: 'pearlescent_froglight',
    name: 'Pearlescent Froglight',
    category: 'building',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Pastel lilac-pink bioluminescent block (Light Level 15)',
      'Dropped when a grey Temperate Frog eats a small Magma Cube'
    ],
    iconType: 'pearlescent_froglight',
    imageUrl: 'https://minecraft.wiki/images/Pearlescent_Froglight_JE1_BE1.png'
  },
  {
    id: 'frogspawn',
    name: 'Frogspawn',
    category: 'building',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Eggs laid on water after breeding Frogs with Slimeballs',
      'Hatches into Tadpoles in 2-10 minutes'
    ],
    iconType: 'frogspawn',
    imageUrl: 'https://minecraft.wiki/images/Frogspawn_JE2_BE2.png'
  },
  {
    id: 'tadpole_bucket',
    name: 'Bucket of Tadpole',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    lore: [
      'Captures a baby Tadpole in a water bucket',
      'Color of adult frog depends on temperature of biome where it grows up'
    ],
    iconType: 'tadpole_bucket',
    imageUrl: 'https://minecraft.wiki/images/Bucket_of_Tadpole_JE1_BE1.png'
  },

  // GOAT HORNS & CHEST BOATS (1.19)
  {
    id: 'goat_horn',
    name: 'Goat Horn',
    category: 'tools',
    maxStack: 1,
    rarity: 'uncommon',
    lore: [
      'Horn dropped when a Goat rams solid stone, logs, or ores',
      'Instruments: Ponder, Sing, Seek, Feel, Admire, Call, Yearn, Dream',
      'Blasts a resonating call audible up to 256 blocks away'
    ],
    iconType: 'goat_horn',
    imageUrl: 'https://minecraft.wiki/images/Goat_Horn_JE1_BE1.png'
  },
  {
    id: 'oak_chest_boat',
    name: 'Oak Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Oak Boat + 1 Chest',
      'Mobile watercraft with 27 cargo inventory slots'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Oak_Boat_with_Chest_JE1_BE1.png'
  },

  // 1.19 THE WILD UPDATE - COMPLETE ADDITIONAL ITEMS & BLOCKS
  {
    id: 'stripped_mangrove_wood',
    name: 'Stripped Mangrove Wood',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Barkless 6-sided mangrove wood timber block',
      'Displays crimson rich wood grain on all faces'
    ],
    iconType: 'stripped_mangrove_log',
    imageUrl: 'https://minecraft.wiki/images/Stripped_Mangrove_Wood_%28UD%29_JE1_BE1.png'
  },
  {
    id: 'mangrove_stairs',
    name: 'Mangrove Stairs',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Stair steps chiseled from crimson Mangrove Planks',
      'Crafted from 6 Mangrove Planks'
    ],
    iconType: 'stairs',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Stairs_JE1_BE1.png'
  },
  {
    id: 'mangrove_slab',
    name: 'Mangrove Slab',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Half-height mangrove plank block',
      'Can be waterlogged or stacked into a full block'
    ],
    iconType: 'slab',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Slab_JE1_BE1.png'
  },
  {
    id: 'mangrove_fence',
    name: 'Mangrove Fence',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      '1.5 block high perimeter barrier made from Mangrove Planks and Sticks'
    ],
    iconType: 'fence',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Fence_%28EW%29_JE1.png'
  },
  {
    id: 'mangrove_fence_gate',
    name: 'Mangrove Fence Gate',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Swinging gate access for mangrove fencing and boundaries'
    ],
    iconType: 'door',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Fence_Gate_JE1_BE1.png'
  },
  {
    id: 'mangrove_pressure_plate',
    name: 'Mangrove Pressure Plate',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Sensory floor tile crafted from 2 Mangrove Planks',
      'Emits redstone signal when stepped on by players or mobs'
    ],
    iconType: 'pressure_plate',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Pressure_Plate_JE1_BE1.png'
  },
  {
    id: 'mangrove_button',
    name: 'Mangrove Button',
    category: 'redstone',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Wooden wall or floor trigger crafted from 1 Mangrove Plank',
      'Produces a 15-game-tick redstone pulse'
    ],
    iconType: 'button',
    imageUrl: 'https://minecraft.wiki/images/Mangrove_Button_JE1_BE1.png'
  },
  {
    id: 'mud_brick_stairs',
    name: 'Mud Brick Stairs',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Steps crafted from dense kiln-dried Mud Bricks',
      'Blast-resistant rustic building component'
    ],
    iconType: 'stairs',
    imageUrl: 'https://minecraft.wiki/images/Mud_Brick_Stairs_JE1_BE1.png'
  },
  {
    id: 'mud_brick_slab',
    name: 'Mud Brick Slab',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Half-height mud brick masonry slab',
      'Provides architectural detailing for adobe structures'
    ],
    iconType: 'slab',
    imageUrl: 'https://minecraft.wiki/images/Mud_Brick_Slab_JE1_BE1.png'
  },
  {
    id: 'mud_brick_wall',
    name: 'Mud Brick Wall',
    category: 'building',
    maxStack: 64,
    rarity: 'common',
    lore: [
      'Sturdy protective enclosure wall built from Mud Bricks',
      'Connects seamlessly with adjacent blocks and gates'
    ],
    iconType: 'wall',
    imageUrl: 'https://minecraft.wiki/images/Mud_Brick_Wall_%28ewU%29_JE1.png'
  },
  {
    id: 'spruce_chest_boat',
    name: 'Spruce Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Spruce Boat + 1 Chest',
      'Taiga vessel equipped with 27-slot onboard cargo hold'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Spruce_Boat_with_Chest_JE2_BE1.png'
  },
  {
    id: 'birch_chest_boat',
    name: 'Birch Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Birch Boat + 1 Chest',
      'Pale wood boat with 27-slot cargo chest at the stern'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Birch_Boat_with_Chest_JE2_BE1.png'
  },
  {
    id: 'jungle_chest_boat',
    name: 'Jungle Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Jungle Boat + 1 Chest',
      'Tropical rainforest vessel carrying 27-slot cargo chest'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Jungle_Boat_with_Chest_JE2_BE1.png'
  },
  {
    id: 'acacia_chest_boat',
    name: 'Acacia Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Acacia Boat + 1 Chest',
      'Savanna timber boat equipped with 27 inventory slots'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Acacia_Boat_with_Chest_JE2_BE1.png'
  },
  {
    id: 'dark_oak_chest_boat',
    name: 'Dark Oak Boat with Chest',
    category: 'tools',
    maxStack: 1,
    rarity: 'common',
    lore: [
      'Crafted from 1 Dark Oak Boat + 1 Chest',
      'Heavy dark wood vessel with integrated storage chest'
    ],
    iconType: 'chest_boat',
    imageUrl: 'https://minecraft.wiki/images/Dark_Oak_Boat_with_Chest_JE2_BE1.png'
  },
  {
    id: 'warden_spawn_egg',
    name: 'Warden Spawn Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'epic',
    lore: [
      'Summons the terrifying Warden boss in the Deep Dark',
      'Blind apex predator: 500 HP, tracks vibrations & smells players',
      'Inflicts Darkness and fires a ranged sonic boom that pierces blocks'
    ],
    iconType: 'spawn_egg',
    imageUrl: 'https://minecraft.wiki/images/Warden_Spawn_Egg_JE1_BE1.png'
  },
  {
    id: 'allay_spawn_egg',
    name: 'Allay Spawn Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'rare',
    lore: [
      'Spawns the Allay fairy companion',
      'Give it an item and it will fly to find and collect dropped matching items',
      'Loves music and drops collected items around playing Noteblocks'
    ],
    iconType: 'spawn_egg',
    imageUrl: 'https://minecraft.wiki/images/Allay_Spawn_Egg_JE1_BE1.png'
  },
  {
    id: 'frog_spawn_egg',
    name: 'Frog Spawn Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Spawns a swamp Frog (Temperate, Warm, or Cold)',
      'Eats small Slimes to drop Slimeballs',
      'Eats small Magma Cubes to produce radiant Froglights'
    ],
    iconType: 'spawn_egg',
    imageUrl: 'https://minecraft.wiki/images/Frog_Spawn_Egg_JE1_BE1.png'
  },
  {
    id: 'tadpole_spawn_egg',
    name: 'Tadpole Spawn Egg',
    category: 'valuable',
    maxStack: 64,
    rarity: 'uncommon',
    lore: [
      'Spawns a tiny baby swimming Tadpole',
      'Can be scooped up with a Water Bucket into a Bucket of Tadpole',
      'Grows into different colored Frogs depending on the biome temperature'
    ],
    iconType: 'spawn_egg',
    imageUrl: 'https://minecraft.wiki/images/Tadpole_Spawn_Egg_JE1_BE1.png'
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

export interface SmeltingRecipe {
  inputItemId: string;
  outputItemId: string;
  name: string;
}

export const SMELTING_RECIPES: SmeltingRecipe[] = [
  { inputItemId: 'gold_ore', outputItemId: 'raw_gold', name: 'Quặng vàng -> Vàng thô (Gold Ore -> Raw Gold)' },
  { inputItemId: 'deepslate_gold_ore', outputItemId: 'raw_gold', name: 'Deepslate Gold Ore -> Raw Gold' },
  { inputItemId: 'raw_gold', outputItemId: 'gold_ingot', name: 'Vàng thô -> Thỏi vàng (Raw Gold -> Gold Ingot)' },
  { inputItemId: 'iron_ore', outputItemId: 'raw_iron', name: 'Quặng sắt -> Sắt thô (Iron Ore -> Raw Iron)' },
  { inputItemId: 'deepslate_iron_ore', outputItemId: 'raw_iron', name: 'Deepslate Iron Ore -> Raw Iron' },
  { inputItemId: 'raw_iron', outputItemId: 'iron_ingot', name: 'Sắt thô -> Thỏi sắt (Raw Iron -> Iron Ingot)' },
  { inputItemId: 'copper_ore', outputItemId: 'raw_copper', name: 'Quặng đồng -> Đồng thô (Copper Ore -> Raw Copper)' },
  { inputItemId: 'raw_copper', outputItemId: 'copper_ingot', name: 'Đồng thô -> Thỏi đồng (Raw Copper -> Copper Ingot)' },
  { inputItemId: 'ancient_debris', outputItemId: 'netherite_scrap', name: 'Ancient Debris -> Mảnh Netherite (Netherite Scrap)' },
  { inputItemId: 'raw_beef', outputItemId: 'cooked_beef', name: 'Thịt bò sống -> Thịt bò nướng (Raw Beef -> Steak)' },
  { inputItemId: 'raw_porkchop', outputItemId: 'cooked_porkchop', name: 'Thịt lợn sống -> Thịt lợn nướng (Raw Porkchop -> Cooked Porkchop)' },
  { inputItemId: 'raw_salmon', outputItemId: 'cooked_salmon', name: 'Cá hồi sống -> Cá hồi nướng (Raw Salmon -> Cooked Salmon)' },
  { inputItemId: 'potato', outputItemId: 'baked_potato', name: 'Khoai tây sống -> Khoai nướng (Potato -> Baked Potato)' },
  { inputItemId: 'cobblestone', outputItemId: 'stone', name: 'Đá cuội -> Đá khối (Cobblestone -> Stone)' },
  { inputItemId: 'sand', outputItemId: 'glass', name: 'Cát -> Thủy tinh (Sand -> Glass)' },
  { inputItemId: 'wet_sponge', outputItemId: 'sponge', name: 'Bọt biển ướt -> Bọt biển khô (Wet Sponge -> Sponge)' },
];

export const FUEL_ITEMS: Record<string, number> = {
  coal: 800,           // 8 items
  blaze_rod: 1200,     // 12 items
  lava_bucket: 20000,  // 100 items
  oak_wood_log: 300,   // 3 items
  mangrove_log: 300,   // 3 items
  bamboo_block: 300,   // 3 items
  oak_planks: 150,     // 1.5 items
  birch_planks: 150,
  cherry_planks: 150,
  mangrove_planks: 150,
  bamboo_planks: 150,
  stick: 50            // 0.5 item
};

export interface CraftingRecipe {
  id: string;
  name: string;
  outputItemId: string;
  outputCount: number;
  description: string;
  ingredientsPreview: { itemId: string; count: number }[];
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'bread',
    name: 'Bánh mì (Bread)',
    outputItemId: 'bread',
    outputCount: 1,
    description: '3 Lúa mì (Wheat) đặt thành 1 hàng ngang',
    ingredientsPreview: [{ itemId: 'wheat', count: 3 }]
  },
  {
    id: 'crafting_table',
    name: 'Bàn chế tạo (Crafting Table)',
    outputItemId: 'crafting_table_item',
    outputCount: 1,
    description: '4 Ván gỗ sồi (Oak Planks) xếp dạng ô vuông 2x2',
    ingredientsPreview: [{ itemId: 'oak_planks', count: 4 }]
  },
  {
    id: 'stick',
    name: 'Gậy gỗ (Sticks)',
    outputItemId: 'stick',
    outputCount: 4,
    description: '2 Ván gỗ sồi (Oak Planks) xếp thành cột dọc',
    ingredientsPreview: [{ itemId: 'oak_planks', count: 2 }]
  },
  {
    id: 'torch',
    name: 'Đuốc (Torches)',
    outputItemId: 'torch',
    outputCount: 4,
    description: '1 Than đá (Coal) đặt phía trên 1 Gậy gỗ (Stick)',
    ingredientsPreview: [{ itemId: 'coal', count: 1 }, { itemId: 'stick', count: 1 }]
  },
  {
    id: 'golden_apple',
    name: 'Táo vàng (Golden Apple)',
    outputItemId: 'golden_apple',
    outputCount: 1,
    description: '1 Táo đỏ (Apple) ở giữa bao quanh bởi 8 Thỏi vàng (Gold Ingots)',
    ingredientsPreview: [{ itemId: 'apple', count: 1 }, { itemId: 'gold_ingot', count: 8 }]
  },
  {
    id: 'mace',
    name: 'Chùy Hủy Diệt 1.21 (Mace)',
    outputItemId: 'mace',
    outputCount: 1,
    description: '1 Heavy Core ở trên + 1 Breeze Rod ở dưới',
    ingredientsPreview: [{ itemId: 'heavy_core', count: 1 }, { itemId: 'breeze_rod', count: 1 }]
  },
  {
    id: 'eye_of_ender',
    name: 'Mắt Ender (Eye of Ender)',
    outputItemId: 'eye_of_ender',
    outputCount: 1,
    description: '1 Ngọc Ender (Ender Pearl) + 1 Bột lửa (Blaze Powder)',
    ingredientsPreview: [{ itemId: 'ender_pearl', count: 1 }, { itemId: 'blaze_powder', count: 1 }]
  },
  {
    id: 'netherite_ingot',
    name: 'Thỏi Netherite (Netherite Ingot)',
    outputItemId: 'netherite_ingot',
    outputCount: 1,
    description: '4 Mảnh Netherite (Netherite Scrap) + 4 Thỏi vàng (Gold Ingots)',
    ingredientsPreview: [{ itemId: 'netherite_scrap', count: 4 }, { itemId: 'gold_ingot', count: 4 }]
  },
  {
    id: 'golden_carrot',
    name: 'Cà rốt vàng (Golden Carrot)',
    outputItemId: 'golden_carrot',
    outputCount: 1,
    description: '1 Cà rốt (Carrot) ở giữa bao quanh bởi 8 Thỏi vàng',
    ingredientsPreview: [{ itemId: 'carrot', count: 1 }, { itemId: 'gold_ingot', count: 8 }]
  },
  {
    id: 'diamond_block',
    name: 'Khối kim cương (Block of Diamond)',
    outputItemId: 'diamond_block',
    outputCount: 1,
    description: '9 Kim cương (Diamond) phủ kín toàn bộ lưới 3x3',
    ingredientsPreview: [{ itemId: 'diamond', count: 9 }]
  },
  {
    id: 'crafter',
    name: 'Máy chế tạo tự động (Crafter 1.21)',
    outputItemId: 'crafter',
    outputCount: 1,
    description: '5 Thỏi sắt + 1 Bàn chế tạo + 2 Bột Redstone + 1 Dropper',
    ingredientsPreview: [{ itemId: 'iron_ingot', count: 5 }, { itemId: 'crafting_table_item', count: 1 }, { itemId: 'redstone_dust', count: 2 }]
  },
  {
    id: 'brush',
    name: 'Chổi khảo cổ (Brush 1.20)',
    outputItemId: 'brush',
    outputCount: 1,
    description: '1 Lông vũ/Ngọc + 1 Thỏi đồng (Copper Ingot) + 1 Gậy gỗ (Stick) xếp dọc',
    ingredientsPreview: [{ itemId: 'copper_ingot', count: 1 }, { itemId: 'stick', count: 1 }]
  },
  {
    id: 'decorated_pot',
    name: 'Bình gốm cổ đại (Decorated Pot 1.20)',
    outputItemId: 'decorated_pot',
    outputCount: 1,
    description: '4 Mảnh gốm (Pottery Sherds) hoặc gạch nung đặt 4 hướng',
    ingredientsPreview: [{ itemId: 'angler_pottery_sherd', count: 4 }]
  },
  {
    id: 'cherry_planks',
    name: 'Ván gỗ hoa anh đào (Cherry Planks 1.20)',
    outputItemId: 'cherry_planks',
    outputCount: 4,
    description: '1 Gỗ hoa anh đào (Cherry Log) chế tạo ra 4 Ván gỗ anh đào',
    ingredientsPreview: [{ itemId: 'cherry_log', count: 1 }]
  },
  {
    id: 'bamboo_planks',
    name: 'Ván gỗ tre (Bamboo Planks 1.20)',
    outputItemId: 'bamboo_planks',
    outputCount: 2,
    description: '1 Khối tre (Block of Bamboo) chế tạo ra 2 Ván gỗ tre',
    ingredientsPreview: [{ itemId: 'bamboo_block', count: 1 }]
  },
  {
    id: 'bamboo_raft',
    name: 'Bè tre (Bamboo Raft 1.20)',
    outputItemId: 'bamboo_raft',
    outputCount: 1,
    description: '5 Ván gỗ tre xếp hình thuyền chữ U',
    ingredientsPreview: [{ itemId: 'bamboo_planks', count: 5 }]
  },
  {
    id: 'calibrated_sculk_sensor',
    name: 'Cảm biến Sculk tinh chỉnh (Calibrated Sculk Sensor 1.20)',
    outputItemId: 'calibrated_sculk_sensor',
    outputCount: 1,
    description: '1 Sculk + 3 Mảnh thạch anh tím (Amethyst Shard)',
    ingredientsPreview: [{ itemId: 'sculk', count: 1 }, { itemId: 'amethyst_shard', count: 3 }]
  },
  // 1.19 THE WILD UPDATE RECIPES
  {
    id: 'mangrove_planks',
    name: 'Ván gỗ đước (Mangrove Planks 1.19)',
    outputItemId: 'mangrove_planks',
    outputCount: 4,
    description: '1 Gỗ đước (Mangrove Log) chế tạo ra 4 Ván gỗ đước đỏ',
    ingredientsPreview: [{ itemId: 'mangrove_log', count: 1 }]
  },
  {
    id: 'packed_mud',
    name: 'Bùn nén (Packed Mud 1.19)',
    outputItemId: 'packed_mud',
    outputCount: 1,
    description: '1 Khối bùn (Mud) + 1 Lúa mì (Wheat)',
    ingredientsPreview: [{ itemId: 'mud', count: 1 }, { itemId: 'wheat', count: 1 }]
  },
  {
    id: 'mud_bricks',
    name: 'Gạch bùn (Mud Bricks 1.19)',
    outputItemId: 'mud_bricks',
    outputCount: 4,
    description: '4 Khối bùn nén (Packed Mud) xếp ô vuông 2x2',
    ingredientsPreview: [{ itemId: 'packed_mud', count: 4 }]
  },
  {
    id: 'muddy_mangrove_roots',
    name: 'Rễ đước dính bùn (Muddy Mangrove Roots 1.19)',
    outputItemId: 'muddy_mangrove_roots',
    outputCount: 1,
    description: '1 Rễ đước (Mangrove Roots) + 1 Khối bùn (Mud)',
    ingredientsPreview: [{ itemId: 'mangrove_roots', count: 1 }, { itemId: 'mud', count: 1 }]
  },
  {
    id: 'recovery_compass',
    name: 'La bàn hồi sinh (Recovery Compass 1.19)',
    outputItemId: 'recovery_compass',
    outputCount: 1,
    description: '1 La bàn (Compass) ở giữa được bao quanh bởi 8 Mảnh tiếng vang (Echo Shards)',
    ingredientsPreview: [{ itemId: 'compass', count: 1 }, { itemId: 'echo_shard', count: 8 }]
  },
  {
    id: 'music_disc_5',
    name: 'Đĩa nhạc 5 (Music Disc 5 - 1.19)',
    outputItemId: 'music_disc_5',
    outputCount: 1,
    description: '9 Mảnh đĩa nhạc (Disc Fragments) phủ kín lưới chế tạo 3x3',
    ingredientsPreview: [{ itemId: 'disc_fragment_5', count: 9 }]
  },
  {
    id: 'mangrove_boat',
    name: 'Thuyền gỗ đước (Mangrove Boat 1.19)',
    outputItemId: 'mangrove_boat',
    outputCount: 1,
    description: '5 Ván gỗ đước xếp hình thuyền chữ U',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 5 }]
  },
  {
    id: 'oak_chest_boat',
    name: 'Thuyền gắn rương (Boat with Chest 1.19)',
    outputItemId: 'oak_chest_boat',
    outputCount: 1,
    description: '1 Thuyền gỗ (Oak/Mangrove Boat) + 1 Rương (Chest)',
    ingredientsPreview: [{ itemId: 'oak_boat', count: 1 }, { itemId: 'chest', count: 1 }]
  },
  {
    id: 'mangrove_stairs',
    name: 'Cầu thang gỗ đước (Mangrove Stairs 1.19)',
    outputItemId: 'mangrove_stairs',
    outputCount: 4,
    description: '6 Ván gỗ đước xếp bậc cầu thang',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 6 }]
  },
  {
    id: 'mangrove_slab',
    name: 'Phiến gỗ đước (Mangrove Slab 1.19)',
    outputItemId: 'mangrove_slab',
    outputCount: 6,
    description: '3 Ván gỗ đước xếp hàng ngang',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 3 }]
  },
  {
    id: 'mangrove_fence',
    name: 'Hàng rào gỗ đước (Mangrove Fence 1.19)',
    outputItemId: 'mangrove_fence',
    outputCount: 3,
    description: '4 Ván gỗ đước + 2 Que gỗ (Stick)',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 4 }, { itemId: 'stick', count: 2 }]
  },
  {
    id: 'mangrove_fence_gate',
    name: 'Cổng rào gỗ đước (Mangrove Fence Gate 1.19)',
    outputItemId: 'mangrove_fence_gate',
    outputCount: 1,
    description: '2 Ván gỗ đước + 4 Que gỗ (Stick)',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 2 }, { itemId: 'stick', count: 4 }]
  },
  {
    id: 'mangrove_pressure_plate',
    name: 'Bàn ép gỗ đước (Mangrove Pressure Plate 1.19)',
    outputItemId: 'mangrove_pressure_plate',
    outputCount: 1,
    description: '2 Ván gỗ đước xếp cạnh nhau',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 2 }]
  },
  {
    id: 'mangrove_button',
    name: 'Nút bấm gỗ đước (Mangrove Button 1.19)',
    outputItemId: 'mangrove_button',
    outputCount: 1,
    description: '1 Ván gỗ đước',
    ingredientsPreview: [{ itemId: 'mangrove_planks', count: 1 }]
  },
  {
    id: 'mud_brick_stairs',
    name: 'Cầu thang gạch bùn (Mud Brick Stairs 1.19)',
    outputItemId: 'mud_brick_stairs',
    outputCount: 4,
    description: '6 Gạch bùn xếp bậc cầu thang',
    ingredientsPreview: [{ itemId: 'mud_bricks', count: 6 }]
  },
  {
    id: 'mud_brick_slab',
    name: 'Phiến gạch bùn (Mud Brick Slab 1.19)',
    outputItemId: 'mud_brick_slab',
    outputCount: 6,
    description: '3 Gạch bùn xếp hàng ngang',
    ingredientsPreview: [{ itemId: 'mud_bricks', count: 3 }]
  },
  {
    id: 'mud_brick_wall',
    name: 'Tường gạch bùn (Mud Brick Wall 1.19)',
    outputItemId: 'mud_brick_wall',
    outputCount: 6,
    description: '6 Gạch bùn xếp 2 hàng ngang',
    ingredientsPreview: [{ itemId: 'mud_bricks', count: 6 }]
  }
];

export const PRESET_LOADOUTS: LoadoutPreset[] = [
  {
    id: 'the_wild_update_119',
    name: '🐸 1.19 The Wild Update - Deep Dark & Mangrove Swamp',
    description: 'Đầy đủ trọn bộ 1.19: Warden, Allay, Frog, Tadpole, Sculk (Shrieker, Sensor, Catalyst, Vein), Echo Shard, Recovery Compass, Đĩa 5, Swift Sneak, 3 Froglight, Trọn bộ gỗ Đước Mangrove & Bùn Mud Bricks',
    containerType: 'double_chest',
    containerItems: [
      { slot: 0, itemId: 'sculk_shrieker', count: 4 },
      { slot: 1, itemId: 'sculk_sensor', count: 8 },
      { slot: 2, itemId: 'sculk', count: 64 },
      { slot: 3, itemId: 'sculk_catalyst', count: 4 },
      { slot: 4, itemId: 'sculk_vein', count: 32 },
      { slot: 5, itemId: 'echo_shard', count: 16 },
      { slot: 6, itemId: 'recovery_compass', count: 1 },
      { slot: 7, itemId: 'disc_fragment_5', count: 18 },
      { slot: 8, itemId: 'music_disc_5', count: 1 },
      { slot: 9, itemId: 'swift_sneak_book', count: 1 },
      { slot: 10, itemId: 'ochre_froglight', count: 16 },
      { slot: 11, itemId: 'verdant_froglight', count: 16 },
      { slot: 12, itemId: 'pearlescent_froglight', count: 16 },
      { slot: 13, itemId: 'frogspawn', count: 8 },
      { slot: 14, itemId: 'tadpole_bucket', count: 2 },
      { slot: 15, itemId: 'goat_horn', count: 4 },
      { slot: 16, itemId: 'mangrove_propagule', count: 16 },
      { slot: 17, itemId: 'mangrove_leaves', count: 64 },
      { slot: 18, itemId: 'mangrove_log', count: 64 },
      { slot: 19, itemId: 'mangrove_wood', count: 32 },
      { slot: 20, itemId: 'stripped_mangrove_log', count: 32 },
      { slot: 21, itemId: 'mangrove_planks', count: 64 },
      { slot: 22, itemId: 'mangrove_roots', count: 32 },
      { slot: 23, itemId: 'muddy_mangrove_roots', count: 32 },
      { slot: 24, itemId: 'mangrove_door', count: 8 },
      { slot: 25, itemId: 'mangrove_trapdoor', count: 8 },
      { slot: 26, itemId: 'mangrove_sign', count: 16 },
      { slot: 27, itemId: 'mangrove_boat', count: 1 },
      { slot: 28, itemId: 'mangrove_chest_boat', count: 1 },
      { slot: 29, itemId: 'mud', count: 64 },
      { slot: 30, itemId: 'packed_mud', count: 64 },
      { slot: 31, itemId: 'mud_bricks', count: 64 },
      { slot: 32, itemId: 'oak_chest_boat', count: 1 },
      { slot: 33, itemId: 'amethyst_shard', count: 32 },
      { slot: 34, itemId: 'compass', count: 4 },
      { slot: 35, itemId: 'wheat', count: 32 },
      // Slots 36 to 53: Complete 1.19 additions
      { slot: 36, itemId: 'warden_spawn_egg', count: 16 },
      { slot: 37, itemId: 'allay_spawn_egg', count: 16 },
      { slot: 38, itemId: 'frog_spawn_egg', count: 16 },
      { slot: 39, itemId: 'tadpole_spawn_egg', count: 16 },
      { slot: 40, itemId: 'reinforced_deepslate', count: 64 },
      { slot: 41, itemId: 'stripped_mangrove_wood', count: 32 },
      { slot: 42, itemId: 'mangrove_stairs', count: 64 },
      { slot: 43, itemId: 'mangrove_slab', count: 64 },
      { slot: 44, itemId: 'mangrove_fence', count: 64 },
      { slot: 45, itemId: 'mangrove_fence_gate', count: 16 },
      { slot: 46, itemId: 'mangrove_pressure_plate', count: 16 },
      { slot: 47, itemId: 'mangrove_button', count: 16 },
      { slot: 48, itemId: 'mud_brick_stairs', count: 64 },
      { slot: 49, itemId: 'mud_brick_slab', count: 64 },
      { slot: 50, itemId: 'mud_brick_wall', count: 64 },
      { slot: 51, itemId: 'spruce_chest_boat', count: 1 },
      { slot: 52, itemId: 'birch_chest_boat', count: 1 },
      { slot: 53, itemId: 'dark_oak_chest_boat', count: 1 }
    ],
    playerItems: [
      { slot: 27, itemId: 'recovery_compass', count: 1 },
      { slot: 28, itemId: 'warden_spawn_egg', count: 4 },
      { slot: 29, itemId: 'allay_spawn_egg', count: 8 },
      { slot: 30, itemId: 'sculk_shrieker', count: 2 },
      { slot: 31, itemId: 'sculk_sensor', count: 4 },
      { slot: 32, itemId: 'ochre_froglight', count: 8 },
      { slot: 33, itemId: 'tadpole_bucket', count: 1 },
      { slot: 34, itemId: 'goat_horn', count: 1 },
      { slot: 35, itemId: 'music_disc_5', count: 1 }
    ]
  },
  {
    id: 'trails_and_tales_120',
    name: '🌸 1.20 Trails & Tales Archeology & Cherry Grove',
    description: 'Khảo cổ học: Chổi, Cát/Sỏi đáng ngờ, Bình gốm, 20 Mảnh gốm, Sniffer, Hoa anh đào & Bè tre',
    containerType: 'double_chest',
    containerItems: [
      { slot: 0, itemId: 'brush', count: 1 },
      { slot: 1, itemId: 'suspicious_sand', count: 32 },
      { slot: 2, itemId: 'suspicious_gravel', count: 32 },
      { slot: 3, itemId: 'decorated_pot', count: 4 },
      { slot: 4, itemId: 'angler_pottery_sherd', count: 16 },
      { slot: 5, itemId: 'blade_pottery_sherd', count: 16 },
      { slot: 6, itemId: 'howl_pottery_sherd', count: 16 },
      { slot: 7, itemId: 'mourner_pottery_sherd', count: 16 },
      { slot: 8, itemId: 'sniffer_egg', count: 4 },
      { slot: 9, itemId: 'torchflower_seeds', count: 32 },
      { slot: 10, itemId: 'torchflower', count: 32 },
      { slot: 11, itemId: 'pitcher_pod', count: 32 },
      { slot: 12, itemId: 'pitcher_plant', count: 16 },
      { slot: 13, itemId: 'cherry_sapling', count: 16 },
      { slot: 14, itemId: 'cherry_log', count: 64 },
      { slot: 15, itemId: 'cherry_planks', count: 64 },
      { slot: 16, itemId: 'pink_petals', count: 64 },
      { slot: 17, itemId: 'cherry_door', count: 8 },
      { slot: 18, itemId: 'cherry_hanging_sign', count: 16 },
      { slot: 19, itemId: 'cherry_boat', count: 1 },
      { slot: 20, itemId: 'bamboo_block', count: 64 },
      { slot: 21, itemId: 'bamboo_planks', count: 64 },
      { slot: 22, itemId: 'bamboo_mosaic', count: 64 },
      { slot: 23, itemId: 'bamboo_raft', count: 1 },
      { slot: 24, itemId: 'bamboo_hanging_sign', count: 16 },
      { slot: 25, itemId: 'chiseled_bookshelf', count: 8 },
      { slot: 26, itemId: 'calibrated_sculk_sensor', count: 4 },
      { slot: 27, itemId: 'netherite_upgrade_smithing_template', count: 4 },
      { slot: 28, itemId: 'silence_armor_trim_smithing_template', count: 2 },
      { slot: 29, itemId: 'ward_armor_trim_smithing_template', count: 2 },
      { slot: 30, itemId: 'eye_armor_trim_smithing_template', count: 2 },
      { slot: 31, itemId: 'vex_armor_trim_smithing_template', count: 2 },
      { slot: 32, itemId: 'spire_armor_trim_smithing_template', count: 2 },
      { slot: 33, itemId: 'wayfinder_armor_trim_smithing_template', count: 2 },
      { slot: 34, itemId: 'music_disc_relic', count: 1 },
      { slot: 35, itemId: 'piglin_head', count: 2 },
    ],
    playerItems: [
      { slot: 27, itemId: 'brush', count: 1 },
      { slot: 28, itemId: 'suspicious_sand', count: 16 },
      { slot: 29, itemId: 'cherry_boat', count: 1 },
      { slot: 30, itemId: 'bamboo_raft', count: 1 },
      { slot: 31, itemId: 'sniffer_egg', count: 1 },
      { slot: 32, itemId: 'torchflower', count: 16 },
      { slot: 33, itemId: 'silence_armor_trim_smithing_template', count: 1 },
      { slot: 34, itemId: 'netherite_upgrade_smithing_template', count: 1 },
      { slot: 35, itemId: 'music_disc_relic', count: 1 },
    ]
  },
  {
    id: 'furnace_smelter',
    name: '🔥 Furnace & Lò Nung Luyện Kim',
    description: 'Luyện Quặng vàng, Quặng sắt, Than đá, Bò sống, Thịt lợn, Cát & Đá cuội',
    containerType: 'furnace',
    containerItems: [],
    playerItems: [
      { slot: 27, itemId: 'gold_ore', count: 32 },
      { slot: 28, itemId: 'coal', count: 64 },
      { slot: 29, itemId: 'raw_beef', count: 32 },
      { slot: 30, itemId: 'iron_ore', count: 32 },
      { slot: 31, itemId: 'raw_gold', count: 16 },
      { slot: 32, itemId: 'raw_porkchop', count: 16 },
      { slot: 33, itemId: 'sand', count: 32 },
      { slot: 34, itemId: 'lava_bucket', count: 1 },
      { slot: 35, itemId: 'wet_sponge', count: 8 }
    ]
  },
  {
    id: 'crafting_workshop',
    name: '🛠️ Crafting Table & Xưởng Chế Tạo',
    description: 'Chế tạo Bánh mì, Đuốc, Chùy Mace 1.21, Mắt Ender, Táo vàng và Bàn chế tạo',
    containerType: 'crafting_table',
    containerItems: [],
    playerItems: [
      { slot: 27, itemId: 'wheat', count: 64 },
      { slot: 28, itemId: 'oak_planks', count: 64 },
      { slot: 29, itemId: 'coal', count: 64 },
      { slot: 30, itemId: 'stick', count: 32 },
      { slot: 31, itemId: 'heavy_core', count: 1 },
      { slot: 32, itemId: 'breeze_rod', count: 4 },
      { slot: 33, itemId: 'apple', count: 16 },
      { slot: 34, itemId: 'gold_ingot', count: 32 },
      { slot: 35, itemId: 'ender_pearl', count: 16 }
    ]
  },
  {
    id: 'mining_expedition',
    name: '⛏️ Mining Expedition & Deepslate Ores',
    description: 'Khoáng sản lòng đất: Kim cương, Sắt, Vàng, Đồng, Lapis, Amethyst, Đuốc & Xô nước',
    containerType: 'double_chest',
    containerItems: [
      { slot: 0, itemId: 'diamond_ore', count: 32 },
      { slot: 1, itemId: 'deepslate_diamond_ore', count: 16 },
      { slot: 2, itemId: 'diamond', count: 48 },
      { slot: 3, itemId: 'iron_ore', count: 64 },
      { slot: 4, itemId: 'raw_iron', count: 64 },
      { slot: 5, itemId: 'iron_ingot', count: 64 },
      { slot: 6, itemId: 'gold_ore', count: 32 },
      { slot: 7, itemId: 'raw_gold', count: 32 },
      { slot: 8, itemId: 'gold_ingot', count: 32 },
      { slot: 9, itemId: 'copper_ore', count: 64 },
      { slot: 10, itemId: 'raw_copper', count: 64 },
      { slot: 11, itemId: 'copper_ingot', count: 64 },
      { slot: 12, itemId: 'coal', count: 64 },
      { slot: 13, itemId: 'coal_ore', count: 64 },
      { slot: 14, itemId: 'lapis_lazuli', count: 64 },
      { slot: 15, itemId: 'amethyst_shard', count: 64 },
      { slot: 16, itemId: 'ancient_debris', count: 8 },
      { slot: 17, itemId: 'netherite_scrap', count: 8 },
      { slot: 18, itemId: 'torch', count: 64 },
      { slot: 19, itemId: 'cobblestone', count: 64 },
      { slot: 20, itemId: 'stone', count: 64 },
      { slot: 21, itemId: 'deepslate_bricks', count: 64 },
      { slot: 22, itemId: 'obsidian', count: 32 },
      { slot: 23, itemId: 'water_bucket', count: 1 },
      { slot: 24, itemId: 'diamond_pickaxe', count: 1 },
    ],
    playerItems: [
      { slot: 27, itemId: 'netherite_pickaxe', count: 1 },
      { slot: 28, itemId: 'torch', count: 64 },
      { slot: 29, itemId: 'water_bucket', count: 1 },
      { slot: 30, itemId: 'cooked_beef', count: 32 },
      { slot: 31, itemId: 'bread', count: 16 },
      { slot: 32, itemId: 'diamond_shovel', count: 1 },
    ]
  },
  {
    id: 'tricky_trials_121',
    name: '⚡ 1.21 Tricky Trials & Mace Vault',
    description: 'Vũ khí Chùy Mace, Gậy Breeze, Wind Charge, Chìa khóa Trial Key & Máy chế tạo Crafter',
    containerType: 'double_chest',
    containerItems: [
      { slot: 0, itemId: 'mace', count: 1 },
      { slot: 1, itemId: 'heavy_core', count: 2 },
      { slot: 2, itemId: 'breeze_rod', count: 16 },
      { slot: 3, itemId: 'wind_charge', count: 64 },
      { slot: 4, itemId: 'trial_key', count: 8 },
      { slot: 5, itemId: 'ominous_trial_key', count: 4 },
      { slot: 6, itemId: 'ominous_bottle', count: 3 },
      { slot: 7, itemId: 'crafter', count: 4 },
      { slot: 8, itemId: 'copper_block', count: 32 },
      { slot: 9, itemId: 'sculk', count: 64 },
      { slot: 10, itemId: 'sculk_catalyst', count: 2 },
      { slot: 11, itemId: 'bundle', count: 1 },
      { slot: 12, itemId: 'netherite_ingot', count: 4 },
      { slot: 13, itemId: 'diamond_block', count: 4 },
      { slot: 14, itemId: 'sponge', count: 8 },
    ],
    playerItems: [
      { slot: 27, itemId: 'mace', count: 1 },
      { slot: 28, itemId: 'wind_charge', count: 64 },
      { slot: 29, itemId: 'trial_key', count: 4 },
      { slot: 30, itemId: 'totem_of_undying', count: 1 },
      { slot: 31, itemId: 'golden_carrot', count: 64 },
      { slot: 32, itemId: 'ender_pearl', count: 16 },
    ]
  },
  {
    id: 'survival_starter',
    name: 'Survival Pantry & Builder Kit',
    description: 'Kho lương thực: Bánh mì, Than đá, Bò sống & bít tết, Quặng vàng, Vàng thô, Gỗ sồi & Sữa',
    containerType: 'chest',
    containerItems: [
      { slot: 0, itemId: 'apple', count: 32 },
      { slot: 1, itemId: 'cooked_beef', count: 64 },
      { slot: 2, itemId: 'bread', count: 32 },
      { slot: 3, itemId: 'raw_beef', count: 32 },
      { slot: 4, itemId: 'coal', count: 64 },
      { slot: 5, itemId: 'gold_ore', count: 32 },
      { slot: 6, itemId: 'raw_gold', count: 16 },
      { slot: 7, itemId: 'water_bottle', count: 1 },
      { slot: 8, itemId: 'milk_bucket', count: 1 },
      { slot: 9, itemId: 'oak_planks', count: 64 },
      { slot: 10, itemId: 'wheat', count: 64 },
      { slot: 11, itemId: 'stick', count: 32 },
      { slot: 12, itemId: 'torch', count: 32 },
      { slot: 18, itemId: 'oak_planks', count: 64 },
    ],
    playerItems: [
      { slot: 27, itemId: 'cooked_beef', count: 32 },
      { slot: 28, itemId: 'bread', count: 16 },
      { slot: 29, itemId: 'coal', count: 32 },
      { slot: 30, itemId: 'gold_ore', count: 16 },
      { slot: 31, itemId: 'raw_beef', count: 16 },
      { slot: 32, itemId: 'oak_planks', count: 64 },
    ]
  },
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
      { slot: 27, itemId: 'netherite_sword', count: 1 },
      { slot: 28, itemId: 'bow', count: 1 },
      { slot: 29, itemId: 'netherite_pickaxe', count: 1 },
      { slot: 30, itemId: 'golden_carrot', count: 64 },
      { slot: 31, itemId: 'ender_pearl', count: 16 },
      { slot: 32, itemId: 'water_bucket', count: 1 },
      { slot: 33, itemId: 'firework_rocket', count: 64 },
      { slot: 34, itemId: 'totem_of_undying', count: 1 },
      { slot: 35, itemId: 'arrow', count: 64 },
    ]
  },
  {
    id: 'redstone_master',
    name: 'Redstone Engineer Lab',
    description: 'Kho linh kiện tự động hóa: Piston, Observer, Hopper, Repeater, Crafter & TNT',
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
      { slot: 8, itemId: 'crafter', count: 8 },
      { slot: 9, itemId: 'dispenser_item', count: 64 },
      { slot: 10, itemId: 'slime_block', count: 64 },
      { slot: 11, itemId: 'honey_block', count: 64 },
      { slot: 12, itemId: 'tnt', count: 64 },
      { slot: 13, itemId: 'lantern', count: 64 },
    ],
    playerItems: [
      { slot: 27, itemId: 'redstone_dust', count: 64 },
      { slot: 28, itemId: 'redstone_repeater', count: 64 },
      { slot: 29, itemId: 'redstone_comparator', count: 64 },
      { slot: 30, itemId: 'sticky_piston', count: 64 },
      { slot: 31, itemId: 'observer', count: 64 },
      { slot: 32, itemId: 'crafter', count: 4 },
    ]
  },
  {
    id: 'dungeon_loot',
    name: 'Ancient City & Bastion Loot',
    description: 'Rương kho báu hiếm: Thỏi Netherite, Nether Star, Kim cương, Heavy Core & Trứng rồng',
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
