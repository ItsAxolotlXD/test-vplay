import React from 'react';

interface MinecraftItemIconProps {
  iconType: string;
  enchanted?: boolean;
  className?: string;
  size?: number;
}

export const MinecraftItemIcon: React.FC<MinecraftItemIconProps> = ({
  iconType,
  enchanted = false,
  className = '',
  size = 32
}) => {
  // SVG Pixel art representation of Minecraft items
  const renderItemSvg = () => {
    switch (iconType) {
      // SWORDS
      case 'sword_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%" className="shape-rendering-crispEdges">
            {/* Blade */}
            <path d="M14 1h1v1h-1z M13 2h1v1h-1z M12 3h1v1h-1z M11 4h1v1h-1z M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z" fill="#433F43" />
            <path d="M13 1h1v1h-1z M12 2h1v1h-1z M11 3h1v1h-1z M10 4h1v1h-1z M9 5h1v1h-1z M8 6h1v1h-1z M7 7h1v1h-1z M6 8h1v1h-1z" fill="#2B272B" />
            <path d="M14 2h1v1h-1z M13 3h1v1h-1z M12 4h1v1h-1z M11 5h1v1h-1z M10 6h1v1h-1z M9 7h1v1h-1z M8 8h1v1h-1z" fill="#5A535A" />
            {/* Crossguard */}
            <path d="M5 9h3v1h-3z M8 7v3h-1v-3z" fill="#6B626B" />
            <path d="M4 10h2v1h-2z M7 8h1v2h-1z" fill="#2B272B" />
            {/* Handle & Pommel */}
            <path d="M4 11h1v1h-1z M3 12h1v1h-1z" fill="#583C25" />
            <path d="M2 13h1v1h-1z M1 14h1v1h-1z M2 14h1v1h-1z" fill="#3D2919" />
          </svg>
        );

      case 'sword_diamond':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M14 1h1v1h-1z M13 2h1v1h-1z M12 3h1v1h-1z M11 4h1v1h-1z M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z" fill="#2CD8D8" />
            <path d="M13 1h1v1h-1z M12 2h1v1h-1z M11 3h1v1h-1z M10 4h1v1h-1z M9 5h1v1h-1z M8 6h1v1h-1z M7 7h1v1h-1z M6 8h1v1h-1z" fill="#1DA5A5" />
            <path d="M14 2h1v1h-1z M13 3h1v1h-1z M12 4h1v1h-1z M11 5h1v1h-1z M10 6h1v1h-1z M9 7h1v1h-1z M8 8h1v1h-1z" fill="#75F6F6" />
            <path d="M5 9h3v1h-3z M8 7v3h-1v-3z" fill="#187F7F" />
            <path d="M4 11h1v1h-1z M3 12h1v1h-1z" fill="#583C25" />
            <path d="M1 14h2v1h-2z M2 13h1v2h-1z" fill="#3D2919" />
          </svg>
        );

      // PICKAXES
      case 'pickaxe_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Pickaxe Head Arc */}
            <path d="M11 1h4v3h-1v-1h-1v-1h-2z M9 3h2v1h-2z M8 4h1v2h-1z M7 6h1v2h-1z M4 9h2v1h-2z M2 11h2v1h-2z M1 11h1v4h-1z" fill="#433F43" />
            <path d="M12 2h2v1h-2z M10 4h1v1h-1z M9 5h1v1h-1z" fill="#6B626B" />
            <path d="M11 2h1v1h-1z M1 13h1v1h-1z" fill="#2B272B" />
            {/* Wooden Handle Diagonal */}
            <path d="M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z M3 12h1v1h-1z M2 13h1v1h-1z" fill="#583C25" />
            <path d="M9 7h1v1h-1z M8 8h1v1h-1z M7 9h1v1h-1z M6 10h1v1h-1z M5 11h1v1h-1z M4 12h1v1h-1z M3 13h1v1h-1z" fill="#3D2919" />
          </svg>
        );

      case 'pickaxe_diamond':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M11 1h4v3h-1v-1h-1v-1h-2z M9 3h2v1h-2z M8 4h1v2h-1z M7 6h1v2h-1z M4 9h2v1h-2z M2 11h2v1h-2z M1 11h1v4h-1z" fill="#2CD8D8" />
            <path d="M12 2h2v1h-2z M10 4h1v1h-1z" fill="#75F6F6" />
            <path d="M11 2h1v1h-1z M1 13h1v1h-1z" fill="#1DA5A5" />
            <path d="M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z M3 12h1v1h-1z M2 13h1v1h-1z" fill="#583C25" />
          </svg>
        );

      // AXE
      case 'axe_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M9 1h5v4h-2v2h-2v1h-2v-3h1v-4z" fill="#433F43" />
            <path d="M11 2h2v2h-2z" fill="#6B626B" />
            <path d="M8 2h1v2h-1z M13 4h1v1h-1z" fill="#2B272B" />
            <path d="M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z M3 12h1v1h-1z M2 13h1v1h-1z" fill="#583C25" />
          </svg>
        );

      // SHOVEL
      case 'shovel_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M12 1h3v3h-1v1h-1v-1h-1v-1h-1v-1h1z" fill="#433F43" />
            <path d="M13 2h1v1h-1z" fill="#6B626B" />
            <path d="M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z M3 12h1v1h-1z M2 13h1v1h-1z" fill="#583C25" />
          </svg>
        );

      // HOE
      case 'hoe_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M9 1h6v2h-3v2h-2v-1h-1v-3z" fill="#433F43" />
            <path d="M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z M3 12h1v1h-1z M2 13h1v1h-1z" fill="#583C25" />
          </svg>
        );

      // BOW & ARROW
      case 'bow':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M14 2h1v1h-1z M13 1h1v1h-1z M12 2h1v1h-1z M11 3h1v1h-1z M9 5h2v1h-2z M8 6h1v2h-1z M5 9h1v2h-1z M3 11h1v1h-1z M2 12h1v1h-1z M1 13h1v1h-1z M2 14h1v1h-1z" fill="#8F5627" />
            <path d="M14 3h1v9h-1z M13 12h1v1h-1z M3 14v1h9v-1z" fill="#CCCCCC" />
          </svg>
        );

      case 'arrow':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M13 1h2v2h-1v1h-1v-1h-1v-1h1z" fill="#555555" />
            <path d="M12 3h1v1h-1z M11 4h1v1h-1z M10 5h1v1h-1z M9 6h1v1h-1z M8 7h1v1h-1z M7 8h1v1h-1z M6 9h1v1h-1z M5 10h1v1h-1z M4 11h1v1h-1z" fill="#8F5627" />
            <path d="M1 13h3v2h-2v-1h-1z M2 12h1v1h-1z" fill="#EEEEEE" />
          </svg>
        );

      // ARMOR
      case 'helmet_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 2h10v6h-2v2h-2v-2h-2v2h-2v-2h-2z" fill="#433F43" />
            <path d="M4 3h8v2h-8z" fill="#6B626B" />
            <path d="M5 8h6v1h-6z" fill="#2B272B" />
            <path d="M3 8h2v4h-1v1h-1z M11 8h2v4h-1v1h-1z" fill="#383438" />
          </svg>
        );

      case 'chestplate_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 2h4v3h6v-3h4v6h-2v7h-10v-7h-2z" fill="#433F43" />
            <path d="M2 3h2v3h1v6h6v-6h1v-3h2v4h-1v7h-8v-7h-1z" fill="#5A535A" />
            <path d="M6 5h4v3h-4z" fill="#2B272B" />
          </svg>
        );

      case 'leggings_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 2h12v5h-4v2h-4v-2h-4z" fill="#433F43" />
            <path d="M2 7h4v7h-4z M10 7h4v7h-4z" fill="#433F43" />
            <path d="M3 3h10v2h-10z M3 7h2v6h-2z M11 7h2v6h-2z" fill="#5A535A" />
          </svg>
        );

      case 'boots_netherite':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 4h4v5h-1v3h3v2h-6z M10 4h4v5h-1v3h3v2h-6z" fill="#433F43" />
            <path d="M3 5h2v3h-2z M11 5h2v3h-2z M2 12h5v1h-5z M10 12h5v1h-5z" fill="#5A535A" />
          </svg>
        );

      case 'elytra':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M4 2h8v2h-2v3h-1v4h-1v3h-1v-3h-1v-4h-1v-3h-1z" fill="#90909A" />
            <path d="M2 3h3v9h1v2h-2v-2h-1v-4h-1z M11 3h3v9h-1v2h-2v-2h1v-4h1z" fill="#5E5D6A" />
          </svg>
        );

      case 'totem':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Golden wings & head */}
            <path d="M5 2h6v5h-6z M2 4h3v3h-3z M11 4h3v3h-3z M6 7h4v7h-4z" fill="#F8C526" />
            <path d="M6 3h4v3h-4z M7 4h1v1h-1z M9 4h1v1h-1z" fill="#00D287" />
            <path d="M3 6h2v1h-2z M11 6h2v1h-2z M7 9h2v4h-2z" fill="#B38914" />
          </svg>
        );

      // GEMS & VALUABLES
      case 'diamond':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 3h6v2h2v3h-1v2h-1v2h-1v1h-1v1h-2v-1h-1v-1h-1v-2h-1v-2h-1v-3h2z" fill="#2CD8D8" />
            <path d="M6 4h4v2h2v2h-1v2h-1v1h-1v1h-2v-1h-1v-1h-1v-2h-1v-2h1z" fill="#75F6F6" />
            <path d="M7 5h2v2h-2z M6 6h1v1h-1z" fill="#FFFFFF" />
            <path d="M9 9h1v1h-1z M8 10h1v1h-1z" fill="#187F7F" />
          </svg>
        );

      case 'netherite_ingot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h9v6h-9z" fill="#3D3A3E" />
            <path d="M4 6h7v4h-7z" fill="#5A545A" />
            <path d="M5 7h4v2h-4z" fill="#736A73" />
            <path d="M3 10h8v1h-8z" fill="#222023" />
          </svg>
        );

      case 'emerald':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 2h6v2h2v8h-2v2h-6v-2h-2v-8h2z" fill="#17DD62" />
            <path d="M6 3h4v2h2v6h-2v2h-4v-2h-2v-6h2z" fill="#5CF293" />
            <path d="M7 4h2v2h-2z M8 5h1v1h-1z" fill="#B3FFCE" />
            <path d="M8 9h2v2h-2z" fill="#0C8E3C" />
          </svg>
        );

      case 'gold_ingot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h9v6h-9z" fill="#F8C526" />
            <path d="M4 6h7v4h-7z" fill="#FDE37E" />
            <path d="M3 10h8v1h-8z" fill="#B38914" />
          </svg>
        );

      case 'iron_ingot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h9v6h-9z" fill="#B2B2B2" />
            <path d="M4 6h7v4h-7z" fill="#D8D8D8" />
            <path d="M3 10h8v1h-8z" fill="#727272" />
          </svg>
        );

      case 'nether_star':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 1h2v14h-2z M1 7h14v2h-14z M4 4h8v8h-8z" fill="#EBFCFE" />
            <path d="M5 5h6v6h-6z" fill="#75F6F6" />
            <path d="M7 7h2v2h-2z" fill="#FFFFFF" />
          </svg>
        );

      case 'dragon_egg':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M6 1h4v2h2v3h1v5h-1v2h-2v2h-4v-2h-2v-2h-1v-5h1v-3h2z" fill="#130C19" />
            <path d="M7 3h2v2h-2z M9 6h2v3h-2z M5 8h2v2h-2z" fill="#7D2398" />
            <path d="M8 4h1v1h-1z M10 7h1v1h-1z" fill="#C259E3" />
          </svg>
        );

      // FOOD & APPLES
      case 'enchanted_golden_apple':
      case 'golden_apple':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Stem */}
            <path d="M8 1h1v2h-1z M9 2h1v1h-1z" fill="#604124" />
            {/* Apple shape */}
            <path d="M5 3h6v2h2v6h-1v2h-2v1h-4v-1h-2v-2h-1v-6h2z" fill={iconType === 'enchanted_golden_apple' ? '#F7B723' : '#F8C526'} />
            <path d="M6 5h4v5h2v-4h-1v-1h-4z" fill="#FDE37E" />
            <path d="M6 6h2v2h-2z" fill="#FFFFFF" />
            <path d="M5 10h4v2h-4z M11 8h1v2h-1z" fill="#B38914" />
          </svg>
        );

      case 'cooked_beef':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h10v6h-2v2h-6v-2h-2z" fill="#7A391A" />
            <path d="M5 6h6v4h-6z" fill="#994D25" />
            <path d="M7 7h3v2h-3z" fill="#D68051" />
            <path d="M4 10h6v1h-6z" fill="#47200D" />
          </svg>
        );

      case 'golden_carrot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Green top */}
            <path d="M11 1h2v2h-2z M13 2h2v2h-2z M10 3h2v2h-2z" fill="#388722" />
            {/* Carrot body */}
            <path d="M7 5h4v3h-1v2h-1v2h-1v2h-1v1h-2v-2h1v-2h1v-2h1v-2h-1z" fill="#F8C526" />
            <path d="M8 6h2v2h-2z" fill="#FDE37E" />
          </svg>
        );

      case 'ender_pearl':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 2h6v2h2v6h-2v2h-6v-2h-2v-6h2z" fill="#0B3E36" />
            <path d="M6 3h4v2h2v4h-2v2h-4v-2h-2v-4h2z" fill="#136357" />
            <path d="M7 4h2v2h-2z" fill="#3BE0C7" />
            <path d="M8 5h1v1h-1z" fill="#D8FFFA" />
            <path d="M7 8h2v2h-2z" fill="#072A24" />
          </svg>
        );

      case 'firework_rocket':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M10 2h3v3h-1v1h-1v-1h-1z" fill="#B32B2B" />
            <path d="M8 5h3v3h-1v1h-1v-1h-1z" fill="#E8D099" />
            <path d="M5 8h3v3h-1v1h-1v-1h-1z" fill="#999999" />
            <path d="M2 11h3v3h-1v1h-1v-1h-1z" fill="#D16E1D" />
          </svg>
        );

      // BLOCKS & REDSTONE
      case 'tnt':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 1h14v14h-14z" fill="#B22315" />
            <path d="M1 5h14v5h-14z" fill="#EFEFEF" />
            <path d="M3 6h2v3h-1v-2h-1z M6 6h1v3h1v-3h1v3h-1v-2h-1v2h-1z M10 6h3v1h-1v2h-1v-2h-1z" fill="#000000" />
          </svg>
        );

      case 'obsidian':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 1h14v14h-14z" fill="#120C1F" />
            <path d="M3 3h3v3h-3z M9 4h4v3h-4z M4 9h4v4h-4z M10 10h3v3h-3z" fill="#2E1B4E" />
            <path d="M4 4h1v1h-1z M11 5h1v1h-1z M6 11h1v1h-1z" fill="#583196" />
          </svg>
        );

      case 'bedrock':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 1h14v14h-14z" fill="#222222" />
            <path d="M2 2h3v3h-3z M8 3h4v3h-4z M3 8h5v4h-5z M10 9h4v4h-4z" fill="#555555" />
            <path d="M4 4h1v1h-1z M9 5h1v1h-1z M5 10h1v1h-1z M11 11h1v1h-1z" fill="#888888" />
            <path d="M1 5h2v3h-2z M7 1h3v2h-3z M12 6h3v3h-3z" fill="#111111" />
          </svg>
        );

      case 'redstone_dust':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M4 6h8v4h-8z M6 4h4v8h-4z" fill="#B70C0C" />
            <path d="M6 6h4v4h-4z" fill="#E81717" />
            <path d="M7 7h2v2h-2z" fill="#FF5C5C" />
          </svg>
        );

      case 'redstone_block':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 1h14v14h-14z" fill="#B70C0C" />
            <path d="M3 3h10v10h-10z" fill="#E81717" />
            <path d="M5 5h6v6h-6z" fill="#FF4444" />
          </svg>
        );

      case 'oak_planks':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M1 1h14v14h-14z" fill="#9C7844" />
            <path d="M1 5h14v1h-14z M1 10h14v1h-14z" fill="#694F2B" />
            <path d="M6 1v4h1v-4z M11 6v4h1v-4z M5 11v4h1v-4z" fill="#584122" />
          </svg>
        );

      case 'chest':
      case 'shulker_box':
      case 'ender_chest':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 3h12v10h-12z" fill={iconType === 'ender_chest' ? '#1A2928' : iconType === 'shulker_box' ? '#8A5AAB' : '#8D602A'} />
            <path d="M2 6h12v1h-12z" fill="#000000" />
            {/* Latch */}
            <path d="M7 5h2v3h-2z" fill="#D3D3D3" />
            <path d="M7 6h2v1h-2z" fill="#888888" />
          </svg>
        );

      // POTIONS
      case 'potion_red':
      case 'potion_purple':
      case 'splash_potion_cyan':
      case 'bottle_o_enchanting':
        const liquidColor = iconType === 'potion_red' ? '#F82423' :
                            iconType === 'potion_purple' ? '#A324F8' :
                            iconType === 'splash_potion_cyan' ? '#24E5F8' : '#72F824';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Cork */}
            <path d="M7 1h2v2h-2z" fill="#845A31" />
            {/* Neck */}
            <path d="M6 3h4v3h-4z" fill="#CCCCCC" />
            {/* Glass body */}
            <path d="M4 6h8v7h-1v1h-6v-1h-1z" fill="#B4CDCD" />
            {/* Liquid */}
            <path d="M5 8h6v5h-6z" fill={liquidColor} />
            <path d="M6 9h2v2h-2z" fill="#FFFFFF" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#777" rx="2" />
            <circle cx="8" cy="8" r="3" fill="#FFF" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
        {renderItemSvg()}
      </div>

      {/* Enchantment Glint / Animated Shimmer Overlay */}
      {enchanted && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80 rounded animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(170,0,255,0.4) 0%, rgba(255,0,255,0.6) 50%, rgba(0,229,255,0.4) 100%)',
            boxShadow: 'inset 0 0 6px rgba(186,85,211,0.8)'
          }}
        />
      )}
    </div>
  );
};
