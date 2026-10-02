import React, { useEffect, useRef, useState } from 'react';

export const DEFAULT_MINECRAFT_SKIN =
  'https://s.namemc.com/3d/skin/body.png?id=25a6df5bb4f85eda&model=classic&width=308&height=308';

export const DEFAULT_MINECRAFT_FACE =
  'https://s.namemc.com/2d/skin/face.png?id=25a6df5bb4f85eda&scale=8';

interface MinecraftCharacterAvatarProps {
  skinUrl?: string;
  size?: number; // size in px (e.g. 28, 32, 48, 64, 120, 240, 300)
  mode?: 'head' | 'bust' | 'full';
  showCape?: boolean;
  className?: string;
  title?: string;
  animated?: boolean;
  nameTag?: string;
}

/**
 * Pixel-perfect Minecraft character renderer
 * Automatically detects 3D rendered models (like NameMC 3D skins) and 64x64 raw texture skins.
 * Supports:
 * - 'full': High-resolution 3D rendered Minecraft character model with optional floating name tag
 * - 'head': 2D/3D pixel face avatar with crisp pixel rendering
 * - 'bust': Torso and head zoomed view
 */
export const MinecraftCharacterAvatar: React.FC<MinecraftCharacterAvatarProps> = ({
  skinUrl = DEFAULT_MINECRAFT_SKIN,
  size = 48,
  mode = 'head',
  showCape = true,
  className = '',
  title = 'Minecraft Character Avatar',
  animated = false,
  nameTag,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCanvasError, setHasCanvasError] = useState(false);

  // Check if skinUrl is a pre-rendered 3D skin model (e.g., NameMC)
  const is3DRender =
    skinUrl.includes('3d/skin') ||
    skinUrl.includes('namemc') ||
    skinUrl.includes('body.png') ||
    skinUrl.includes('namemc-body');

  useEffect(() => {
    // Only use canvas UV mapping if it's a raw 64x64 texture skin
    if (is3DRender) return;

    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = skinUrl;

    img.onload = () => {
      if (isCancelled) return;
      setHasCanvasError(false);

      const renderW = canvas.width;
      const renderH = canvas.height;

      ctx.clearRect(0, 0, renderW, renderH);
      ctx.imageSmoothingEnabled = false;

      if (mode === 'head') {
        ctx.drawImage(img, 8, 8, 8, 8, 0, 0, renderW, renderH);
        ctx.drawImage(img, 40, 8, 8, 8, 0, 0, renderW, renderH);
      } else if (mode === 'bust') {
        const scale = renderW / 24;
        const offsetX = (renderW - 16 * scale) / 2;
        const offsetY = 2 * scale;

        ctx.drawImage(img, 20, 20, 8, 12, offsetX + 4 * scale, offsetY + 8 * scale, 8 * scale, 12 * scale);
        ctx.drawImage(img, 20, 36, 8, 12, offsetX + 4 * scale, offsetY + 8 * scale, 8 * scale, 12 * scale);
        ctx.drawImage(img, 44, 20, 4, 12, offsetX, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 36, 52, 4, 12, offsetX + 12 * scale, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 8, 8, 8, 8, offsetX + 4 * scale, offsetY, 8 * scale, 8 * scale);
        ctx.drawImage(img, 40, 8, 8, 8, offsetX + 4 * scale, offsetY, 8 * scale, 8 * scale);
      } else {
        const scale = Math.min(renderW / 18, renderH / 34);
        const offsetX = (renderW - 16 * scale) / 2;
        const offsetY = (renderH - 32 * scale) / 2;

        if (showCape) {
          ctx.fillStyle = '#065F46';
          ctx.fillRect(offsetX + 3 * scale, offsetY + 8 * scale, 10 * scale, 18 * scale);
          ctx.fillStyle = '#10B981';
          ctx.fillRect(offsetX + 4 * scale, offsetY + 12 * scale, 8 * scale, 12 * scale);
        }

        ctx.drawImage(img, 4, 20, 4, 12, offsetX + 4 * scale, offsetY + 20 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 4, 36, 4, 12, offsetX + 4 * scale, offsetY + 20 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 20, 52, 4, 12, offsetX + 8 * scale, offsetY + 20 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 4, 52, 4, 12, offsetX + 8 * scale, offsetY + 20 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 20, 20, 8, 12, offsetX + 4 * scale, offsetY + 8 * scale, 8 * scale, 12 * scale);
        ctx.drawImage(img, 20, 36, 8, 12, offsetX + 4 * scale, offsetY + 8 * scale, 8 * scale, 12 * scale);
        ctx.drawImage(img, 44, 20, 4, 12, offsetX, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 44, 36, 4, 12, offsetX, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 36, 52, 4, 12, offsetX + 12 * scale, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 52, 52, 4, 12, offsetX + 12 * scale, offsetY + 8 * scale, 4 * scale, 12 * scale);
        ctx.drawImage(img, 8, 8, 8, 8, offsetX + 4 * scale, offsetY, 8 * scale, 8 * scale);
        ctx.drawImage(img, 40, 8, 8, 8, offsetX + 4 * scale, offsetY, 8 * scale, 8 * scale);
      }
    };

    img.onerror = () => {
      if (img.src !== window.location.origin + '/skins/aurora-hoodie.png' && !img.src.endsWith('/skins/aurora-hoodie.png')) {
        img.src = '/skins/aurora-hoodie.png';
      } else if (!isCancelled) {
        setHasCanvasError(true);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [skinUrl, mode, size, showCape, is3DRender]);

  // Dimension scaling
  const containerWidth = mode === 'full' ? Math.round(size * 0.95) : size;
  const containerHeight = mode === 'full' ? Math.round(size * 1.35) : size;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-end select-none ${
        animated ? 'transition-transform duration-300 hover:scale-105' : ''
      } ${className}`}
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }}
      title={title}
    >
      {/* Floating Minecraft In-Game Name Tag (Rendered above head) */}
      {nameTag && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
          <div className="px-2.5 py-0.5 rounded bg-black/75 border border-white/20 shadow-[0_3px_10px_rgba(0,0,0,0.85)] backdrop-blur-xs flex items-center justify-center whitespace-nowrap">
            <span className="font-minecraft text-xs sm:text-sm text-white font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {nameTag}
            </span>
          </div>
        </div>
      )}

      {is3DRender ? (
        mode === 'full' ? (
          // 3D Full Character Body Model Render
          <img
            src={skinUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/skins/namemc-body.png';
            }}
            alt="Minecraft 3D Character Model"
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] select-none pt-4"
          />
        ) : mode === 'bust' ? (
          // 3D Bust / Upper Body Model View
          <img
            src={skinUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/skins/namemc-body.png';
            }}
            alt="Minecraft Character Bust"
            className="w-full h-[180%] object-cover object-top pointer-events-none select-none drop-shadow-md"
          />
        ) : (
          // Head / Face Avatar
          <img
            src={DEFAULT_MINECRAFT_FACE}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/skins/namemc-face.png';
            }}
            alt="Minecraft Face Avatar"
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{
              imageRendering: 'pixelated',
            }}
          />
        )
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={containerWidth * 2}
            height={containerHeight * 2}
            className="w-full h-full object-contain pointer-events-none"
            style={{
              imageRendering: 'pixelated',
            }}
          />

          {hasCanvasError && mode === 'head' && (
            <div
              className="w-full h-full relative"
              style={{
                backgroundImage: `url(${skinUrl})`,
                backgroundPosition: '14.28% 14.28%',
                backgroundSize: '800% 800%',
                imageRendering: 'pixelated',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${skinUrl})`,
                  backgroundPosition: '71.42% 14.28%',
                  backgroundSize: '800% 800%',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MinecraftCharacterAvatar;
