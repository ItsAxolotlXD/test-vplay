import React from 'react';

interface MinecraftPanoramaProps {
  disablePanorama?: boolean;
  lockPanoramaScroll?: boolean;
  panoramaScrollSpeed?: number;
}

export const BEDROCK_PANORAMA_IMAGES = [
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Beta_panorama_0.png/800px-Bedrock_Edition_Beta_panorama_0.png?e7ce5',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Beta_panorama_1.png/800px-Bedrock_Edition_Beta_panorama_1.png?e45c',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Beta_panorama_2.png/800px-Bedrock_Edition_Beta_panorama_2.png?9f477',
  'https://minecraft.wiki/images/thumb/Bedrock_Edition_Beta_panorama_3.png/800px-Bedrock_Edition_Beta_panorama_3.png?da416',
];

export const MinecraftPanorama: React.FC<MinecraftPanoramaProps> = ({
  disablePanorama = false,
  lockPanoramaScroll = false,
  panoramaScrollSpeed = 5,
}) => {
  if (disablePanorama) {
    return (
      <div className="fixed inset-0 -z-10 bg-[#16171a] pointer-events-none select-none" />
    );
  }

  // Calculate duration based on speed 1 (slow, 120s) to 10 (fast, 15s)
  const animDuration = `${Math.max(5, 120 - (panoramaScrollSpeed || 5) * 10)}s`;

  // Repeat sequence twice to enable continuous loop scrolling (-50% translation)
  const panoramaSequence = [...BEDROCK_PANORAMA_IMAGES, ...BEDROCK_PANORAMA_IMAGES];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#101113]">
      {/* Seamless Scrolling Track with 4 consecutive panoramas */}
      <div
        className="flex h-full w-max animate-panorama transform-gpu"
        style={{
          animationDuration: animDuration,
          animationPlayState: lockPanoramaScroll ? 'paused' : 'running',
        }}
      >
        {panoramaSequence.map((src, idx) => (
          <img
            key={`p-${idx}`}
            src={src}
            alt={`Bedrock Panorama ${ (idx % 4) + 1 }`}
            referrerPolicy="no-referrer"
            className="h-screen min-h-full w-auto object-cover flex-shrink-0 filter brightness-90 scale-105 transform-gpu block border-none outline-none"
          />
        ))}
      </div>

      {/* Classic Menu Dark Tint Overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};
