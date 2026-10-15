import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCoreArchitectureScene: MotionScene = {
  id: 'flixcore-architecture',
  name: 'Flix Studios Engine Stack Schematic',
  description: 'Procedural layer stack showing Velocity Limbo, Redis Sync, Event Engine, and Multi-Version AnvilGUI.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Dark obsidian background
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Technical schematic grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Architecture Layers
    const layers = [
      { name: 'VELOCITY PROXY & LIMBO HANDOFF', tag: 'NETWORKING', color: '#8B5CFF' },
      { name: 'REDIS PUB/SUB SYNC ENGINE', tag: 'CROSS-SERVER', color: '#D7FF3F' },
      { name: 'FLIX STUDIOS EVENT & DUELS CORE', tag: 'GAMEPLAY TICK', color: '#F4F3EE' },
      { name: 'ANVILGUI 1.8-1.21 ABSTRACTION', tag: 'COMPATIBILITY', color: '#8B5CFF' },
      { name: 'ASYNC MYSQL / H2 PERSISTENCE', tag: 'STORAGE IO', color: '#D7FF3F' },
      { name: 'EMBEDDED REST MONITORING API', tag: 'TELEMETRY', color: '#F4F3EE' },
    ];

    const layerWidth = 720;
    const layerHeight = 58;
    const spacing = 78;
    const startY = cy - ((layers.length - 1) * spacing) / 2;

    // Draw central connecting backbone bus
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, startY - 20);
    ctx.lineTo(cx, startY + (layers.length - 1) * spacing + 20);
    ctx.stroke();

    // Traveling packet pulse along the bus
    const packetY = startY + ((time * 120) % ((layers.length - 1) * spacing + 40)) - 20;
    ctx.fillStyle = '#D7FF3F';
    ctx.shadowColor = '#D7FF3F';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, packetY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Render individual layer cards
    layers.forEach((layer, idx) => {
      const y = startY + idx * spacing;
      const stagger = idx * 0.12;
      const layerProgress = interpolate(progress, [stagger, stagger + 0.2], [0, 1], Easing.easeOutExpo);
      const isFocused = Math.floor(time * 1.5) % layers.length === idx;

      ctx.save();
      ctx.translate(cx, y);

      const cardAlpha = interpolate(layerProgress, [0, 1], [0, 1]);
      const cardOffset = interpolate(layerProgress, [0, 1], [-40, 0]);

      ctx.translate(0, cardOffset);

      // Card background
      ctx.fillStyle = isFocused ? 'rgba(215, 255, 63, 0.08)' : 'rgba(17, 18, 22, 0.85)';
      ctx.strokeStyle = isFocused ? layer.color : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = isFocused ? 2 : 1;
      if (isFocused) {
        ctx.shadowColor = layer.color;
        ctx.shadowBlur = 18;
      }

      ctx.beginPath();
      ctx.roundRect(-layerWidth / 2, -layerHeight / 2, layerWidth, layerHeight, 8);
      ctx.fill();
      ctx.stroke();

      // Index and category badge
      ctx.fillStyle = layer.color;
      ctx.font = '700 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`0${idx + 1} // ${layer.tag}`, -layerWidth / 2 + 24, 4);

      // Title
      ctx.fillStyle = isFocused ? '#FFFFFF' : '#E0E0DE';
      ctx.font = '700 15px "Space Grotesk", sans-serif';
      ctx.fillText(layer.name, -layerWidth / 2 + 180, 5);

      // Live status ping
      ctx.fillStyle = isFocused ? '#D7FF3F' : 'rgba(215, 255, 63, 0.4)';
      ctx.beginPath();
      ctx.arc(layerWidth / 2 - 30, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(244, 243, 238, 0.5)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(isFocused ? 'ACTIVE' : 'READY', layerWidth / 2 - 44, 4);

      ctx.restore();
    });

    // Top Header Banner
    ctx.save();
    ctx.fillStyle = 'rgba(215, 255, 63, 0.9)';
    ctx.font = '700 12px monospace';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX STUDIOS PLUGIN ARCHITECTURE SPECIFICATION', cx, 48);
    ctx.restore();
  },
};
