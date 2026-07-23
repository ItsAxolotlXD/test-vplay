import React, { useEffect, useRef } from "react";

export const PanoramaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Handle canvas resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Load Minecraft panorama image texture - Updated custom panorama URL
    const panoramaImg = new Image();
    panoramaImg.crossOrigin = "anonymous";
    panoramaImg.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXzs1Va5TxwXVnniOcGwp7ij9pBT4RkKVXnek-w5AuQ&s=10";

    let imgLoaded = false;
    panoramaImg.onload = () => {
      imgLoaded = true;
    };

    // Procedural Minecraft Voxels & Lush Green Nature Generator
    const renderProceduralMinecraftPanorama = (
      width: number,
      height: number,
      angle: number
    ) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Clear Blue Nature Sky & Sunlight Atmosphere Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      skyGradient.addColorStop(0, "#1e5799");
      skyGradient.addColorStop(0.4, "#207cca");
      skyGradient.addColorStop(0.7, "#7db9e8");
      skyGradient.addColorStop(1, "#a0d8ef");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Pitch angle (gentle sinusoidal bob up/down like Minecraft menu)
      const pitch = Math.sin(angle * 0.015) * 15;
      const horizon = height * 0.52 + pitch;

      // 2. Bright Warm Sun
      const sunX = ((angle * 12 + width) % (width * 1.5)) - width * 0.2;
      const sunY = horizon - 140 + Math.cos(angle * 0.01) * 20;
      ctx.fillStyle = "#fffdf0";
      ctx.fillRect(sunX - 25, sunY - 25, 50, 50);
      ctx.fillStyle = "rgba(255, 253, 240, 0.35)";
      ctx.fillRect(sunX - 35, sunY - 35, 70, 70);

      // 3. Pixelated White Clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      const cloudSpeed = angle * 8;
      for (let i = 0; i < 12; i++) {
        const cx = ((i * 320 + cloudSpeed) % (width + 600)) - 300;
        const cy = horizon - 180 + (i % 3) * 35;
        const cw = 180 + (i % 4) * 40;
        const ch = 28 + (i % 2) * 8;
        ctx.fillRect(cx, cy, cw, ch);
        ctx.fillStyle = "rgba(220, 240, 230, 0.85)";
        ctx.fillRect(cx + 8, cy + ch - 6, cw - 16, 6);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      }

      // 4. Distant Green Forest Mountain Layers (Lush Green Parallax Hills)
      const mountainLayers = [
        { speed: 1.5, color: "#143622", baseHeight: 220, blockScale: 32 },
        { speed: 3.0, color: "#1c4d2d", baseHeight: 160, blockScale: 24 },
        { speed: 5.0, color: "#276e3c", baseHeight: 100, blockScale: 16 },
      ];

      mountainLayers.forEach((layer) => {
        ctx.fillStyle = layer.color;
        const shift = (angle * layer.speed * 10) % width;
        for (let x = -layer.blockScale; x < width + layer.blockScale; x += layer.blockScale) {
          const worldX = x + shift;
          const noise = Math.sin(worldX * 0.005) * 60 + Math.cos(worldX * 0.015) * 40;
          const mHeight = layer.baseHeight + Math.max(0, noise);
          ctx.fillRect(x, horizon - mHeight, layer.blockScale + 1, mHeight + (height - horizon));
        }
      });

      // 5. Crystal Blue River at Horizon
      const waterGrad = ctx.createLinearGradient(0, horizon, 0, height);
      waterGrad.addColorStop(0, "#1f7a8c");
      waterGrad.addColorStop(0.3, "#185a66");
      waterGrad.addColorStop(1, "#0d3b42");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizon, width, height - horizon);

      // 6. Foreground Lush Green Terrain & Oak Trees (Dense Grass & Trees)
      const fgBlockSize = 40;
      const fgShift = (angle * 12) % fgBlockSize;
      const groundY = horizon + 40;

      for (let x = -fgBlockSize; x < width + fgBlockSize; x += fgBlockSize) {
        const blockX = x - fgShift;
        const terrainHeight = Math.sin((blockX + angle * 12) * 0.004) * 30;
        const topY = groundY - terrainHeight;

        // Rich Soil
        ctx.fillStyle = "#4a3525";
        ctx.fillRect(blockX, topY, fgBlockSize, height - topY);

        // Bright Emerald Grass Top
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(blockX, topY, fgBlockSize, 12);
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(blockX + 4, topY + 12, fgBlockSize - 8, 6);

        // Frequent Oak & Spruce Trees & Plants
        const treeSeed = Math.floor((blockX + angle * 12) / 240);
        if (treeSeed % 2 === 0 && Math.abs(blockX % 240) < fgBlockSize) {
          // Tree trunk
          ctx.fillStyle = "#3d2817";
          ctx.fillRect(blockX + 12, topY - 80, 16, 80);

          // Lush Green Tree leaves
          ctx.fillStyle = "#1e824c";
          ctx.fillRect(blockX - 24, topY - 140, 64, 40);
          ctx.fillRect(blockX - 16, topY - 164, 48, 28);
          ctx.fillStyle = "#145a32";
          ctx.fillRect(blockX - 20, topY - 110, 56, 12);
        }
      }

      // Vignette & Soft Blur Overlay for Readable UI
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, "rgba(0,0,0,0.1)");
      vignette.addColorStop(0.7, "rgba(0,0,0,0.35)");
      vignette.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    // Main Animation Loop (60 FPS 360 Spin)
    const animate = () => {
      rotation += 0.15; // Smooth 360-degree rotation speed

      if (imgLoaded && panoramaImg.complete) {
        const w = canvas.width;
        const h = canvas.height;

        const imgAspect = panoramaImg.width / panoramaImg.height;
        const renderHeight = h * 1.25;
        const renderWidth = renderHeight * imgAspect;

        const xPos = -((rotation * 2.5) % renderWidth);

        ctx.clearRect(0, 0, w, h);

        const pitch = Math.sin(rotation * 0.02) * 15;

        // Loop panoramic texture continuously
        ctx.drawImage(panoramaImg, xPos, -20 + pitch, renderWidth, renderHeight);
        ctx.drawImage(panoramaImg, xPos + renderWidth, -20 + pitch, renderWidth, renderHeight);
        ctx.drawImage(panoramaImg, xPos + renderWidth * 2, -20 + pitch, renderWidth, renderHeight);

        // Dark overlay vignette for legibility
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, w, h);
      } else {
        renderProceduralMinecraftPanorama(canvas.width, canvas.height, rotation);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
};
