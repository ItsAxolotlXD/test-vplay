import React, { useState, useEffect } from 'react';

interface MinecraftItemIconProps {
  iconType: string;
  imageUrl?: string;
  enchanted?: boolean;
  className?: string;
  size?: number;
}

export const MinecraftItemIcon: React.FC<MinecraftItemIconProps> = ({
  iconType,
  imageUrl,
  enchanted = false,
  className = '',
  size = 32
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

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
      case 'apple':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M8 1h1v2h-1z M9 2h1v1h-1z" fill="#604124" />
            <path d="M5 3h6v2h2v6h-1v2h-2v1h-4v-1h-2v-2h-1v-6h2z" fill="#E81717" />
            <path d="M6 5h4v5h2v-4h-1v-1h-4z" fill="#FF5555" />
            <path d="M6 6h2v2h-2z" fill="#FFFFFF" />
            <path d="M5 10h4v2h-4z M11 8h1v2h-1z" fill="#990E0E" />
          </svg>
        );

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

      case 'raw_beef':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h10v6h-2v2h-6v-2h-2z" fill="#9C2222" />
            <path d="M4 6h8v4h-8z" fill="#C93636" />
            <path d="M6 7h4v2h-4z" fill="#F05656" />
            <path d="M10 6h2v2h-2z" fill="#E8DDD5" />
            <path d="M4 10h6v1h-6z" fill="#6B1616" />
          </svg>
        );

      case 'bread':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 7h12v4h-1v1h-10v-1h-1z" fill="#8B4D1B" />
            <path d="M3 6h10v5h-10z" fill="#B8752B" />
            <path d="M4 5h8v2h-8z" fill="#D4943E" />
            <path d="M5 6h1v3h-1z M8 6h1v3h-1z M11 6h1v3h-1z" fill="#F0BC6D" />
          </svg>
        );

      case 'wheat':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 1h2v3h-2z M5 4h6v3h-6z M4 7h8v4h-8z M7 11h2v4h-2z" fill="#CC9F33" />
            <path d="M6 5h4v2h-4z M5 8h6v2h-6z" fill="#E8C358" />
            <path d="M7 11h1v4h-1z" fill="#5F7526" />
          </svg>
        );

      case 'coal':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 4h6v2h2v4h-2v2h-5v-1h-3v-4h2z" fill="#1C1C1E" />
            <path d="M6 5h4v2h1v3h-2v1h-3z" fill="#303036" />
            <path d="M7 6h2v2h-2z" fill="#484852" />
            <path d="M4 9h2v1h-2z" fill="#111114" />
          </svg>
        );

      case 'gold_ore':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#727272" />
            <path d="M2 3h3v2h-3z M9 4h3v2h-3z M4 9h4v3h-4z M11 10h3v3h-3z" fill="#F8C526" />
            <path d="M3 4h1v1h-1z M10 5h1v1h-1z M5 10h2v1h-2z M12 11h1v1h-1z" fill="#FDE37E" />
            <path d="M1 2h2v1h-2z M8 3h2v1h-2z M3 8h2v1h-2z M10 9h2v1h-2z" fill="#555555" />
          </svg>
        );

      case 'raw_gold':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 3h6v2h3v5h-2v3h-6v-2h-3v-5h2z" fill="#D49917" />
            <path d="M6 4h4v2h2v4h-2v2h-4z" fill="#F8C526" />
            <path d="M7 5h2v2h-2z M9 8h2v2h-2z" fill="#FDE37E" />
            <path d="M4 8h2v3h-2z" fill="#A8750C" />
          </svg>
        );

      case 'stick':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M12 2h2v2h-2z M10 4h2v2h-2z M8 6h2v2h-2z M6 8h2v2h-2z M4 10h2v2h-2z M2 12h2v2h-2z" fill="#6B4B27" />
            <path d="M11 3h2v1h-2z M9 5h2v1h-2z M7 7h2v1h-2z M5 9h2v1h-2z M3 11h2v1h-2z" fill="#8C6335" />
          </svg>
        );

      case 'torch':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 6h2v8h-2z" fill="#6B4B27" />
            <path d="M6 3h4v3h-4z" fill="#3D2919" />
            <path d="M7 2h2v3h-2z" fill="#FFC822" />
            <path d="M7 1h2v1h-2z" fill="#FF5500" />
            <path d="M8 3h1v1h-1z" fill="#FFFFFF" />
          </svg>
        );

      case 'crafting_table':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="1" y="1" width="14" height="14" fill="#845A31" />
            <rect x="2" y="2" width="12" height="4" fill="#A06E3B" />
            <rect x="3" y="7" width="4" height="6" fill="#54381C" />
            <rect x="9" y="7" width="4" height="6" fill="#54381C" />
            <path d="M2 2h12v1h-12z" fill="#C48E50" />
          </svg>
        );

      case 'furnace':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="1" y="1" width="14" height="14" fill="#5A5A5A" />
            <rect x="3" y="3" width="10" height="4" fill="#3A3A3A" />
            <rect x="4" y="8" width="8" height="6" fill="#222222" />
            <rect x="5" y="9" width="6" height="4" fill="#E65100" />
            <rect x="6" y="10" width="4" height="2" fill="#FFD54F" />
          </svg>
        );

      case 'milk_bucket':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M4 3h8v2h-1v8h-6v-8h-1z" fill="#8C8C8C" />
            <path d="M5 4h6v1h-6z" fill="#FFFFFF" />
            <path d="M5 5h6v7h-6z" fill="#F5F5F5" />
            <path d="M6 7h4v4h-4z" fill="#FFFFFF" />
            <path d="M4 4h1v1h-1z M11 4h1v1h-1z" fill="#5A5A5A" />
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
      case 'water_bottle':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 1h2v2h-2z" fill="#845A31" />
            <path d="M6 3h4v3h-4z" fill="#CCCCCC" />
            <path d="M4 6h8v7h-1v1h-6v-1h-1z" fill="#B4CDCD" />
            <path d="M5 8h6v5h-6z" fill="#385DC6" />
            <path d="M6 9h2v2h-2z" fill="#75A5FF" />
          </svg>
        );

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

      // TRICKY TRIALS 1.21 & MODERN GEAR
      case 'mace':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Heavy Mace Head */}
            <rect x="9" y="1" width="6" height="6" fill="#3D3B43" />
            <rect x="10" y="2" width="4" height="4" fill="#6A6572" />
            <rect x="11" y="3" width="2" height="2" fill="#A49FA9" />
            {/* Breeze Core / Swirl */}
            <path d="M12 2h1v1h-1z M10 4h1v1h-1z" fill="#00E5FF" />
            {/* Rod handle */}
            <path d="M9 7h2v2h-2z M7 9h2v2h-2z M5 11h2v2h-2z M3 13h2v2h-2z" fill="#C49A45" />
            <path d="M8 8h1v1h-1z M6 10h1v1h-1z M4 12h1v1h-1z M2 14h1v1h-1z" fill="#75561E" />
          </svg>
        );

      case 'breeze_rod':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M11 2h3v3h-1v1h-1v-1h-1z M8 5h3v3h-1v1h-1v-1h-1z M5 8h3v3h-1v1h-1v-1h-1z M2 11h3v3h-1v1h-1v-1h-1z" fill="#C5AEFF" />
            <path d="M12 3h1v1h-1z M9 6h1v1h-1z M6 9h1v1h-1z M3 12h1v1h-1z" fill="#FFFFFF" />
            <path d="M10 4h1v1h-1z M7 7h1v1h-1z M4 10h1v1h-1z M1 13h1v1h-1z" fill="#7B5BCF" />
          </svg>
        );

      case 'wind_charge':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="8" cy="8" r="6" fill="#B4E5FF" />
            <circle cx="8" cy="8" r="4" fill="#E1F5FE" />
            <path d="M6 7h4v2h-4z M7 5h2v6h-2z" fill="#FFFFFF" />
            <path d="M4 6h2v1h-2z M10 9h2v1h-2z" fill="#81D4FA" />
          </svg>
        );

      case 'trial_key':
      case 'ominous_trial_key':
        const keyAccent = iconType === 'ominous_trial_key' ? '#D50000' : '#FFD700';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Key Head */}
            <rect x="9" y="2" width="5" height="5" fill="#5D4037" />
            <rect x="10" y="3" width="3" height="3" fill={keyAccent} />
            <rect x="11" y="4" width="1" height="1" fill="#FFFFFF" />
            {/* Key shaft & teeth */}
            <path d="M8 7h2v2h-2z M6 9h2v2h-2z M4 11h2v2h-2z M2 13h2v2h-2z" fill="#8D6E63" />
            <path d="M7 11h2v1h-2z M5 13h2v1h-2z" fill={keyAccent} />
          </svg>
        );

      case 'heavy_core':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="1" y="1" width="14" height="14" fill="#2B2930" />
            <rect x="3" y="3" width="10" height="10" fill="#4B4752" />
            <rect x="5" y="5" width="6" height="6" fill="#716B7B" />
            <circle cx="8" cy="8" r="2" fill="#00E5FF" />
          </svg>
        );

      // ORES & RAW MATERIALS
      case 'diamond_ore':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#727272" />
            <path d="M2 3h3v2h-3z M9 3h4v3h-4z M3 9h4v3h-4z M10 10h4v3h-4z" fill="#2CD8D8" />
            <path d="M3 4h1v1h-1z M10 4h2v1h-2z M4 10h2v1h-2z M11 11h2v1h-2z" fill="#75F6F6" />
            <path d="M1 2h2v1h-2z M8 2h2v1h-2z M2 8h2v1h-2z M9 9h2v1h-2z" fill="#1DA5A5" />
          </svg>
        );

      case 'iron_ore':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#727272" />
            <path d="M2 3h3v2h-3z M9 4h3v3h-3z M4 9h4v2h-4z M11 10h3v3h-3z" fill="#D8AF93" />
            <path d="M3 4h1v1h-1z M10 5h1v1h-1z M5 10h1v1h-1z M12 11h1v1h-1z" fill="#F0CEB8" />
            <path d="M1 2h2v1h-2z M8 3h2v1h-2z M3 8h2v1h-2z M10 9h2v1h-2z" fill="#8A6E58" />
          </svg>
        );

      case 'raw_iron':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 3h6v2h3v5h-2v3h-6v-2h-3v-5h2z" fill="#A88265" />
            <path d="M6 4h4v2h2v4h-2v2h-4z" fill="#D8AF93" />
            <path d="M7 5h2v2h-2z M9 8h2v2h-2z" fill="#F0CEB8" />
            <path d="M4 8h2v3h-2z" fill="#6B5341" />
          </svg>
        );

      case 'copper_ore':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#727272" />
            <path d="M2 3h3v2h-3z M9 4h3v3h-3z M4 9h4v2h-4z M11 10h3v3h-3z" fill="#E0734D" />
            <path d="M3 4h1v1h-1z M10 5h1v1h-1z M5 10h1v1h-1z M12 11h1v1h-1z" fill="#3AA987" />
          </svg>
        );

      case 'raw_copper':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M5 3h6v2h3v5h-2v3h-6v-2h-3v-5h2z" fill="#A85232" />
            <path d="M6 4h4v2h2v4h-2v2h-4z" fill="#E0734D" />
            <path d="M7 5h2v2h-2z" fill="#3AA987" />
            <path d="M4 8h2v3h-2z" fill="#6E351F" />
          </svg>
        );

      case 'copper_ingot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h9v6h-9z" fill="#B35232" />
            <path d="M4 6h7v4h-7z" fill="#E0734D" />
            <path d="M3 10h8v1h-8z" fill="#6E351F" />
          </svg>
        );

      case 'lapis':
      case 'lapis_lazuli':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M4 4h8v8h-8z" fill="#1C45A3" />
            <path d="M5 5h6v6h-6z" fill="#2E62D9" />
            <path d="M6 6h3v3h-3z" fill="#648DF6" />
            <path d="M8 8h1v1h-1z" fill="#FFFFFF" />
          </svg>
        );

      case 'amethyst_shard':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 2h3v2h1v3h-1v3h-2v3h-2v-3h1v-3h1v-3h-1z" fill="#B38EF3" />
            <path d="M8 3h1v6h-1z" fill="#E0CEFD" />
            <path d="M6 7h1v4h-1z" fill="#7A4EC9" />
          </svg>
        );

      // ICONIC BLOCKS
      case 'grass_block':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Dirt base */}
            <rect x="0" y="5" width="16" height="11" fill="#79553A" />
            <path d="M2 8h2v2h-2z M8 9h2v2h-2z M5 12h2v2h-2z M12 11h2v2h-2z" fill="#583D28" />
            {/* Lush grass top */}
            <rect x="0" y="0" width="16" height="5" fill="#4B9E2B" />
            <path d="M1 5h2v2h-2z M4 5h1v1h-1z M7 5h2v3h-2z M11 5h1v2h-1z M14 5h2v1h-2z" fill="#3D8223" />
            <path d="M0 0h16v2h-16z" fill="#67C63D" />
          </svg>
        );

      case 'dirt':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#79553A" />
            <path d="M2 3h2v2h-2z M7 4h3v2h-3z M4 9h2v2h-2z M10 8h2v3h-2z M6 13h2v2h-2z" fill="#583D28" />
            <path d="M3 4h1v1h-1z M8 5h1v1h-1z M11 9h1v1h-1z" fill="#936846" />
          </svg>
        );

      case 'sand':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#DBCFA3" />
            <path d="M2 3h2v1h-2z M8 4h2v1h-2z M4 8h2v1h-2z M11 9h2v1h-2z M7 12h2v1h-2z" fill="#C2B280" />
            <path d="M3 4h1v1h-1z M9 5h1v1h-1z M5 9h1v1h-1z" fill="#EDE4C4" />
          </svg>
        );

      case 'gravel':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#7A7879" />
            <path d="M2 2h3v3h-3z M8 3h4v3h-4z M3 8h4v4h-4z M10 9h3v3h-3z" fill="#585657" />
            <path d="M3 3h1v1h-1z M9 4h1v1h-1z M4 9h1v1h-1z M11 10h1v1h-1z" fill="#9B999A" />
          </svg>
        );

      case 'stone':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#7D7D7D" />
            <path d="M2 3h2v1h-2z M7 5h3v1h-3z M4 10h2v1h-2z M10 11h2v1h-2z" fill="#5E5E5E" />
            <path d="M3 4h1v1h-1z M8 6h1v1h-1z M5 11h1v1h-1z" fill="#9C9C9C" />
          </svg>
        );

      case 'cobblestone':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#6A6A6A" />
            <path d="M1 1h6v6h-6z M9 2h6v5h-6z M2 9h5v6h-5z M8 8h7v7h-7z" fill="#505050" />
            <path d="M2 2h4v4h-4z M10 3h4v3h-4z M3 10h3v4h-3z M9 9h5v5h-5z" fill="#808080" />
            <path d="M3 3h2v2h-2z M10 4h2v1h-2z M10 10h3v2h-3z" fill="#A8A8A8" />
          </svg>
        );

      case 'oak_log':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#6B5030" />
            <path d="M0 2h16v2h-16z M0 7h16v2h-16z M0 12h16v2h-16z" fill="#4B3721" />
            <path d="M3 0v16h2v-16z M9 0v16h2v-16z" fill="#86653E" />
          </svg>
        );

      case 'glass':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#FFFFFF" fillOpacity="0.1" stroke="#A6C5DB" strokeWidth="1" />
            <path d="M3 3h2v1h-2z M4 4h1v2h-1z M10 3h1v1h-1z M3 10h1v2h-1z M10 11h2v1h-2z" fill="#EBF8FF" />
          </svg>
        );

      case 'sponge':
      case 'wet_sponge':
        const spongeColor = iconType === 'wet_sponge' ? '#6B8E23' : '#C8B237';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill={spongeColor} />
            <path d="M2 2h2v2h-2z M7 3h3v2h-3z M3 7h2v2h-2z M10 8h2v2h-2z M6 11h3v2h-3z" fill="#423912" />
            <path d="M3 3h1v1h-1z M8 4h1v1h-1z M11 9h1v1h-1z" fill="#FFF275" />
          </svg>
        );

      case 'sculk':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="0" y="0" width="16" height="16" fill="#03161C" />
            <path d="M3 3h3v3h-3z M10 4h3v2h-3z M4 9h3v3h-3z M11 10h3v3h-3z" fill="#043846" />
            <circle cx="5" cy="5" r="1.5" fill="#00FFC8" />
            <circle cx="11" cy="11" r="1" fill="#00FFC8" />
          </svg>
        );

      case 'crafter':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="1" y="1" width="14" height="14" fill="#3D3D48" />
            <rect x="3" y="3" width="10" height="10" fill="#755635" />
            <rect x="5" y="5" width="6" height="6" fill="#1C1C20" />
            <path d="M6 7h4v2h-4z" fill="#B32B2B" />
          </svg>
        );

      // MORE CROPS & FOOD
      case 'carrot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M11 1h2v2h-2z M13 2h2v2h-2z M10 3h2v2h-2z" fill="#388722" />
            <path d="M7 5h4v3h-1v2h-1v2h-1v2h-1v1h-2v-2h1v-2h1v-2h1v-2h-1z" fill="#E65100" />
            <path d="M8 6h2v2h-2z" fill="#FF9800" />
          </svg>
        );

      case 'potato':
      case 'baked_potato':
        const potatoColor = iconType === 'baked_potato' ? '#D47E2F' : '#C19853';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M4 4h8v8h-8z" rx="2" fill={potatoColor} />
            <path d="M5 5h6v6h-6z" fill={iconType === 'baked_potato' ? '#F59E0B' : '#DFB76C'} />
            <path d="M6 6h1v1h-1z M9 8h1v1h-1z M7 10h1v1h-1z" fill="#6B4B1B" />
          </svg>
        );

      case 'sweet_berries':
      case 'glow_berries':
        const berryColor = iconType === 'glow_berries' ? '#FFB300' : '#C62828';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="6" cy="8" r="3" fill={berryColor} />
            <circle cx="10" cy="9" r="3" fill={berryColor} />
            <circle cx="8" cy="5" r="3" fill={berryColor} />
            <path d="M8 2h1v3h-1z" fill="#2E7D32" />
          </svg>
        );

      case 'honey_bottle':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M7 1h2v2h-2z" fill="#845A31" />
            <path d="M6 3h4v3h-4z" fill="#CCCCCC" />
            <path d="M4 6h8v7h-1v1h-6v-1h-1z" fill="#B4CDCD" />
            <path d="M5 8h6v5h-6z" fill="#FFB300" />
            <path d="M6 9h2v2h-2z" fill="#FFE082" />
          </svg>
        );

      case 'cooked_porkchop':
      case 'raw_porkchop':
        const porkColor = iconType === 'cooked_porkchop' ? '#C27551' : '#F48FB1';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3 5h10v6h-2v2h-6v-2h-2z" fill={porkColor} />
            <path d="M5 6h6v4h-6z" fill={iconType === 'cooked_porkchop' ? '#E0926D' : '#F8BBD0'} />
            <circle cx="11" cy="7" r="1" fill="#FFFFFF" />
          </svg>
        );

      case 'lead':
      case 'name_tag':
      case 'saddle':
      case 'bundle':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="3" y="3" width="10" height="10" rx="2" fill="#8D6E63" />
            <rect x="5" y="5" width="6" height="6" fill="#D7CCC8" />
            <circle cx="8" cy="8" r="1.5" fill="#3E2723" />
          </svg>
        );

      // 1.20 TRAILS & TALES ITEMS
      case 'brush':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Handle */}
            <path d="M2 13l3-3 2 2-3 3z" fill="#795548" />
            {/* Copper Ferrule */}
            <path d="M5 9l2-2 2 2-2 2z" fill="#B87333" />
            {/* Bristles */}
            <path d="M7 7l5-5c1 1 2 2 2 2l-5 5z" fill="#ECEFF1" />
            <path d="M12 2l2 2-1 1-2-2z" fill="#CFD8DC" />
          </svg>
        );

      case 'pottery_sherd':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Terracotta Sherd */}
            <polygon points="3,13 13,13 11,3 5,3" fill="#B35936" />
            <polygon points="5,11 11,11 10,5 6,5" fill="#8F4324" />
            {/* Carving mark */}
            <rect x="7" y="6" width="2" height="4" fill="#E68A65" />
          </svg>
        );

      case 'decorated_pot':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Rim */}
            <rect x="4" y="2" width="8" height="2" fill="#9C4F32" />
            {/* Neck */}
            <rect x="5" y="4" width="6" height="1" fill="#7A3920" />
            {/* Body */}
            <rect x="3" y="5" width="10" height="8" fill="#B35936" />
            <rect x="4" y="6" width="8" height="6" fill="#9C4F32" />
            <rect x="6" y="8" width="4" height="2" fill="#7A3920" />
            {/* Base */}
            <rect x="4" y="13" width="8" height="1" fill="#7A3920" />
          </svg>
        );

      case 'sniffer_egg':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Sniffer Egg blocky shape */}
            <rect x="2" y="3" width="12" height="10" fill="#2E6B47" />
            <rect x="3" y="2" width="10" height="12" fill="#2E6B47" />
            <rect x="4" y="4" width="8" height="8" fill="#7A2222" />
            <rect x="5" y="5" width="6" height="6" fill="#A83232" />
            <rect x="6" y="6" width="2" height="2" fill="#52BF83" />
            <rect x="10" y="8" width="2" height="2" fill="#52BF83" />
          </svg>
        );

      case 'torchflower_seeds':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <polygon points="8,2 11,7 8,13 5,7" fill="#4A3B32" />
            <circle cx="8" cy="7" r="2" fill="#E65100" />
            <circle cx="8" cy="7" r="1" fill="#FFB74D" />
          </svg>
        );

      case 'torchflower':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="7" y="9" width="2" height="6" fill="#2E7D32" />
            {/* Torch Petals */}
            <path d="M5 4h6v5H5z" fill="#E65100" />
            <path d="M6 3h4v4H6z" fill="#F57C00" />
            <path d="M7 2h2v3H7z" fill="#FFEB3B" />
          </svg>
        );

      case 'pitcher_pod':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="5" y="4" width="6" height="8" fill="#006064" />
            <rect x="6" y="5" width="4" height="6" fill="#00838F" />
            <rect x="7" y="6" width="2" height="4" fill="#00E5FF" />
          </svg>
        );

      case 'pitcher_plant':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="7" y="8" width="2" height="7" fill="#1B5E20" />
            {/* Goblet Flower */}
            <rect x="4" y="2" width="8" height="6" fill="#006064" />
            <rect x="5" y="3" width="6" height="4" fill="#00BCD4" />
            <rect x="6" y="1" width="4" height="2" fill="#80DEEA" />
          </svg>
        );

      case 'cherry_sapling':
      case 'cherry_leaves':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#F48FB1" />
            <rect x="4" y="3" width="4" height="4" fill="#F8BBD0" />
            <rect x="9" y="7" width="4" height="4" fill="#EC407A" />
            <rect x="5" y="9" width="5" height="4" fill="#F06292" />
          </svg>
        );

      case 'cherry_log':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#2C1B20" />
            <rect x="4" y="4" width="8" height="8" fill="#F48FB1" />
            <rect x="6" y="6" width="4" height="4" fill="#F8BBD0" />
          </svg>
        );

      case 'pink_petals':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="5" cy="6" r="3" fill="#F48FB1" />
            <circle cx="11" cy="7" r="2.5" fill="#F06292" />
            <circle cx="8" cy="11" r="3" fill="#F8BBD0" />
          </svg>
        );

      case 'bamboo_block':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#557A2B" />
            <rect x="3" y="2" width="2" height="12" fill="#77A838" />
            <rect x="7" y="2" width="2" height="12" fill="#77A838" />
            <rect x="11" y="2" width="2" height="12" fill="#77A838" />
            <line x1="2" y1="7" x2="14" y2="7" stroke="#3E5A1D" strokeWidth="1" />
          </svg>
        );

      case 'bamboo_raft':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="7" width="12" height="5" fill="#84A836" />
            <rect x="4" y="6" width="8" height="2" fill="#608020" />
            <rect x="3" y="8" width="10" height="2" fill="#A4C639" />
          </svg>
        );

      case 'chiseled_bookshelf':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#795548" />
            {/* 6 compartments */}
            <rect x="3" y="3" width="4" height="4" fill="#422212" />
            <rect x="9" y="3" width="4" height="4" fill="#B71C1C" />
            <rect x="3" y="9" width="4" height="4" fill="#1565C0" />
            <rect x="9" y="9" width="4" height="4" fill="#2E7D32" />
          </svg>
        );

      case 'calibrated_sculk_sensor':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="7" width="12" height="7" fill="#002D33" />
            <rect x="4" y="8" width="8" height="4" fill="#005B66" />
            {/* Tendrils & Amethyst */}
            <path d="M4 7V4h2v3 M10 7V4h2v3" stroke="#00B4D8" strokeWidth="1.5" fill="none" />
            <rect x="7" y="3" width="2" height="4" fill="#9C27B0" />
            <rect x="7.5" y="2" width="1" height="2" fill="#E1BEE7" />
          </svg>
        );

      case 'smithing_template':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="3" y="2" width="10" height="12" rx="1" fill="#455A64" />
            <rect x="4" y="3" width="8" height="10" fill="#263238" />
            <path d="M6 5h4v2H6z M7 7h2v3H7z" fill="#00E5FF" />
          </svg>
        );

      case 'music_disc_relic':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="8" cy="8" r="6" fill="#263238" />
            <circle cx="8" cy="8" r="4" fill="#00838F" />
            <circle cx="8" cy="8" r="2" fill="#FFB300" />
            <circle cx="8" cy="8" r="0.75" fill="#263238" />
          </svg>
        );

      case 'piglin_head':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="3" y="4" width="10" height="8" fill="#E59B7E" />
            <rect x="5" y="8" width="6" height="3" fill="#D27D5E" />
            {/* Tusks & Eyes */}
            <rect x="4" y="9" width="1" height="2" fill="#FFFFFF" />
            <rect x="11" y="9" width="1" height="2" fill="#FFFFFF" />
            <rect x="4" y="6" width="2" height="1" fill="#FFFFFF" />
            <rect x="10" y="6" width="2" height="1" fill="#FFFFFF" />
          </svg>
        );

      case 'suspicious_sand':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#DBC688" />
            <path d="M4 5h3v1H4z M9 8h3v1H9z M6 11h4v1H6z" fill="#B0995B" />
          </svg>
        );

      case 'suspicious_gravel':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#757575" />
            <path d="M4 4h2v2H4z M10 6h2v2h-2z M5 10h3v2H5z" fill="#424242" />
          </svg>
        );

      case 'hanging_sign':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Chains */}
            <line x1="5" y1="1" x2="5" y2="4" stroke="#78909C" strokeWidth="1" />
            <line x1="11" y1="1" x2="11" y2="4" stroke="#78909C" strokeWidth="1" />
            {/* Board */}
            <rect x="3" y="4" width="10" height="8" fill="#B38054" />
            <rect x="4" y="5" width="8" height="6" fill="#8D5B2F" />
          </svg>
        );

      // ================= 1.19 THE WILD UPDATE ITEMS =================
      case 'sculk_shrieker':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Sculk Base */}
            <rect x="2" y="6" width="12" height="8" fill="#031A21" />
            <rect x="3" y="7" width="10" height="6" fill="#052E3B" />
            {/* Bone Horns/Canines */}
            <polygon points="3,6 4,1 6,6" fill="#EAE5D8" />
            <polygon points="10,6 12,1 13,6" fill="#EAE5D8" />
            {/* Inner shrieker mouth soul ring */}
            <circle cx="8" cy="10" r="2.5" fill="#00FFC8" opacity="0.9" />
            <circle cx="8" cy="10" r="1.2" fill="#031A21" />
          </svg>
        );

      case 'sculk_sensor':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="7" width="12" height="7" fill="#031A21" />
            <rect x="3" y="8" width="10" height="5" fill="#052E3B" />
            {/* Tendrils */}
            <path d="M4 7V3h2v4 M7 7V2h2v5 M10 7V3h2v4" stroke="#00FFC8" strokeWidth="1.2" fill="none" />
            <circle cx="5" cy="3" r="1" fill="#2AE2B8" />
            <circle cx="8" cy="2" r="1" fill="#2AE2B8" />
            <circle cx="11" cy="3" r="1" fill="#2AE2B8" />
          </svg>
        );

      case 'sculk_vein':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 3l4 3-2 4 6 2 4-4" stroke="#00E5FF" strokeWidth="1.5" fill="none" />
            <path d="M5 8l3 5 4-2" stroke="#006677" strokeWidth="1" fill="none" />
            <circle cx="6" cy="6" r="1.2" fill="#00FFC8" />
            <circle cx="10" cy="12" r="1.2" fill="#00FFC8" />
          </svg>
        );

      case 'disc_fragment':
      case 'disc_fragment_5':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <polygon points="4,12 12,12 10,4 6,4" fill="#031A21" />
            <polygon points="5,11 11,11 9,5 7,5" fill="#005B66" />
            <circle cx="8" cy="8" r="1.5" fill="#00FFC8" />
          </svg>
        );

      case 'music_disc_5':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="8" cy="8" r="6.5" fill="#031A21" />
            <circle cx="8" cy="8" r="4" fill="#005B66" />
            <circle cx="8" cy="8" r="2" fill="#00FFC8" />
            <circle cx="8" cy="8" r="0.75" fill="#031A21" />
          </svg>
        );

      case 'mangrove_propagule':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Stem */}
            <path d="M8 2v3" stroke="#4E342E" strokeWidth="1.5" />
            {/* Pod */}
            <path d="M6 5c0 4 2 8 2 8s2-4 2-8z" fill="#43A047" />
            <path d="M7 6c0 3 1 6 1 6s1-3 1-6z" fill="#7CB342" />
            <circle cx="8" cy="13" r="1" fill="#2E7D32" />
          </svg>
        );

      case 'mangrove_leaves':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#2E7D32" />
            <rect x="4" y="3" width="4" height="4" fill="#388E3C" />
            <rect x="9" y="7" width="4" height="4" fill="#1B5E20" />
            <rect x="5" y="9" width="5" height="4" fill="#4CAF50" />
          </svg>
        );

      case 'mangrove_log':
      case 'mangrove_wood':
      case 'stripped_mangrove_log':
        const mgColor = iconType === 'stripped_mangrove_log' ? '#9E2A2B' : '#541A0F';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill={mgColor} />
            <rect x="4" y="4" width="8" height="8" fill="#7A1D20" />
            <rect x="6" y="6" width="4" height="4" fill="#9E2A2B" />
          </svg>
        );

      case 'mangrove_planks':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#752220" />
            <rect x="3" y="3" width="10" height="2" fill="#8E2D2B" />
            <rect x="3" y="7" width="10" height="2" fill="#8E2D2B" />
            <rect x="3" y="11" width="10" height="2" fill="#8E2D2B" />
          </svg>
        );

      case 'mangrove_roots':
      case 'muddy_mangrove_roots':
        const rootBg = iconType === 'muddy_mangrove_roots' ? '#3B2F2F' : '#2D1B1B';
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill={rootBg} />
            <path d="M4 2v12 M8 2v12 M12 2v12" stroke="#541A0F" strokeWidth="1.5" />
            <path d="M2 6h12 M2 10h12" stroke="#4E342E" strokeWidth="1" />
          </svg>
        );

      case 'mangrove_boat':
      case 'chest_boat':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="7" width="12" height="5" fill="#752220" />
            <rect x="3" y="6" width="10" height="2" fill="#8E2D2B" />
            {iconType === 'chest_boat' && (
              <>
                <rect x="5" y="3" width="6" height="5" fill="#8D6E63" />
                <rect x="7" y="4" width="2" height="1" fill="#FFD54F" />
              </>
            )}
          </svg>
        );

      case 'mud':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#3C393E" />
            <rect x="4" y="4" width="4" height="3" fill="#2E2C30" />
            <rect x="9" y="8" width="4" height="4" fill="#2E2C30" />
            <rect x="5" y="10" width="3" height="2" fill="#4B474D" />
          </svg>
        );

      case 'packed_mud':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#8C6750" />
            <rect x="3" y="3" width="10" height="10" fill="#785540" />
            <path d="M4 5h2v2H4z M9 8h2v2H9z M6 11h2v2H6z" fill="#9C775D" />
          </svg>
        );

      case 'mud_bricks':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#8C6750" />
            <line x1="2" y1="6" x2="14" y2="6" stroke="#4E342E" strokeWidth="1" />
            <line x1="2" y1="10" x2="14" y2="10" stroke="#4E342E" strokeWidth="1" />
            <line x1="7" y1="2" x2="7" y2="6" stroke="#4E342E" strokeWidth="1" />
            <line x1="10" y1="6" x2="10" y2="10" stroke="#4E342E" strokeWidth="1" />
            <line x1="5" y1="10" x2="5" y2="14" stroke="#4E342E" strokeWidth="1" />
          </svg>
        );

      case 'ochre_froglight':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#FEE180" />
            <rect x="4" y="4" width="8" height="8" fill="#FFF3B0" />
            <rect x="6" y="6" width="4" height="4" fill="#FFFFFF" />
          </svg>
        );

      case 'verdant_froglight':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#82DE8A" />
            <rect x="4" y="4" width="8" height="8" fill="#B3F2B8" />
            <rect x="6" y="6" width="4" height="4" fill="#E8FCE9" />
          </svg>
        );

      case 'pearlescent_froglight':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#E0A7D4" />
            <rect x="4" y="4" width="8" height="8" fill="#F3CEEC" />
            <rect x="6" y="6" width="4" height="4" fill="#FCEDF9" />
          </svg>
        );

      case 'frogspawn':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <circle cx="5" cy="6" r="2.5" fill="#5D4037" />
            <circle cx="5" cy="6" r="1" fill="#D7CCC8" />
            <circle cx="10" cy="7" r="2.5" fill="#5D4037" />
            <circle cx="10" cy="7" r="1" fill="#D7CCC8" />
            <circle cx="7" cy="11" r="2.5" fill="#5D4037" />
            <circle cx="7" cy="11" r="1" fill="#D7CCC8" />
          </svg>
        );

      case 'tadpole_bucket':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Iron Bucket */}
            <path d="M4 3h8v2h-1v8h-6v-8h-1z" fill="#9E9E9E" />
            <rect x="5" y="5" width="6" height="7" fill="#0288D1" />
            {/* Tadpole swimming inside */}
            <circle cx="8" cy="8" r="1.5" fill="#5D4037" />
            <path d="M9 8c1 0 2 1 2 2" stroke="#4E342E" strokeWidth="1" fill="none" />
          </svg>
        );

      case 'goat_horn':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Curved goat horn */}
            <path d="M12 3c-4 0-8 3-8 7 0 3 2 4 4 4 3 0 5-2 5-5z" fill="#BCAAA4" />
            <path d="M11 4c-3 0-6 2-6 5 0 2 1 3 3 3 2 0 4-1 4-4z" fill="#D7CCC8" />
            <circle cx="12" cy="4" r="1" fill="#5D4037" />
            <path d="M7 9c1 1 2 2 3 2" stroke="#8D6E63" strokeWidth="1" fill="none" />
          </svg>
        );

      case 'spawn_egg':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Egg oval base */}
            <path d="M5 4h6v1h2v3h1v4h-1v2h-2v1H5v-1H3v-2H2V8h1V5h2V4z" fill="#3D5A50" />
            <path d="M6 5h4v1h2v3h-1v3h-1v1H6v-1H5V9H4V6h2V5z" fill="#527D6E" />
            {/* Spots / Speckles */}
            <rect x="5" y="7" width="2" height="2" fill="#8CE8C5" />
            <rect x="9" y="9" width="2" height="2" fill="#8CE8C5" />
            <rect x="7" y="11" width="2" height="1" fill="#8CE8C5" />
          </svg>
        );

      case 'stairs':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M2 14h12v-5h-6V4H2z" fill="#8E2D2B" />
            <path d="M3 13h10v-3h-5V5H3z" fill="#B33E3B" />
            <line x1="2" y1="9" x2="8" y2="9" stroke="#661C1A" strokeWidth="1" />
            <line x1="8" y1="9" x2="8" y2="14" stroke="#661C1A" strokeWidth="1" />
          </svg>
        );

      case 'slab':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="9" width="12" height="5" fill="#8E2D2B" />
            <rect x="3" y="10" width="10" height="3" fill="#B33E3B" />
            <rect x="2" y="9" width="12" height="1" fill="#C9514E" />
          </svg>
        );

      case 'fence':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Posts */}
            <rect x="3" y="3" width="2" height="10" fill="#752220" />
            <rect x="11" y="3" width="2" height="10" fill="#752220" />
            {/* Rails */}
            <rect x="3" y="5" width="10" height="2" fill="#8E2D2B" />
            <rect x="3" y="9" width="10" height="2" fill="#8E2D2B" />
          </svg>
        );

      case 'wall':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="3" y="4" width="10" height="9" fill="#8C6750" />
            <rect x="2" y="5" width="12" height="2" fill="#785540" />
            <rect x="2" y="9" width="12" height="2" fill="#785540" />
            <rect x="4" y="3" width="8" height="2" fill="#9C775D" />
          </svg>
        );

      case 'pressure_plate':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="3" y="12" width="10" height="2" fill="#8E2D2B" />
            <rect x="4" y="12" width="8" height="1" fill="#C9514E" />
          </svg>
        );

      case 'button':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="6" y="7" width="4" height="3" fill="#8E2D2B" rx="1" />
            <rect x="7" y="7" width="2" height="1" fill="#C9514E" />
          </svg>
        );

      case 'enchanted_book':
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            {/* Book Base */}
            <rect x="3" y="2" width="10" height="12" rx="1" fill="#8D2B0B" />
            <rect x="4" y="3" width="8" height="10" fill="#A83915" />
            {/* Binding & Pages */}
            <rect x="3" y="2" width="2" height="12" fill="#5C1A05" />
            {/* Magic Ribbon / Clasp */}
            <rect x="6" y="7" width="5" height="2" fill="#E65100" />
            <rect x="8" y="6" width="2" height="4" fill="#FFD54F" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 16 16" width="100%" height="100%">
            <rect x="2" y="2" width="12" height="12" fill="#777" rx="0" />
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
      <div className="w-full h-full filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] flex items-center justify-center">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={iconType}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{
              imageRendering: 'pixelated',
            }}
          />
        ) : (
          renderItemSvg()
        )}
      </div>

      {/* Enchantment Glint / Animated Shimmer Overlay */}
      {enchanted && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80 rounded-none animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(170,0,255,0.4) 0%, rgba(255,0,255,0.6) 50%, rgba(0,229,255,0.4) 100%)',
            boxShadow: 'inset 0 0 6px rgba(186,85,211,0.8)'
          }}
        />
      )}
    </div>
  );
};
