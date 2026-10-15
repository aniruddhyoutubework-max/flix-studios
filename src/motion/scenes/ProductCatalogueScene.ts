import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const ProductCatalogueScene: MotionScene = {
  id: 'product-catalogue',
  name: 'Flix Studios Modular Catalogue Radar',
  description: 'Isometric Minecraft software modules assembling into scalable server infrastructure.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Deep obsidian space
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Perspective grid
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Central ambient flare
    const flare = ctx.createRadialGradient(cx, cy, 40, cx, cy, 380);
    flare.addColorStop(0, 'rgba(139, 92, 255, 0.16)');
    flare.addColorStop(0.5, 'rgba(215, 255, 63, 0.08)');
    flare.addColorStop(1, 'rgba(8, 9, 11, 0)');
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, width, height);

    // 4. Authentic Systems Pipeline Flow (No floating cubes)
    const pipelineNodes = [
      { step: '01', title: 'Limbo Handshake', sub: 'Velocity Queue Gate', color: '#8B5CFF', x: cx - 360, y: cy },
      { step: '02', title: 'Dynamic Matchmaker', sub: 'HT5 Expanding Queue', color: '#D7FF3F', x: cx - 180, y: cy },
      { step: '03', title: 'Arena Containment', sub: 'ArenaSafetyHelper 3D', color: '#FFFFFF', x: cx, y: cy },
      { step: '04', title: 'Async FAWE Engine', sub: 'Sub-Second Rollback', color: '#D7FF3F', x: cx + 180, y: cy },
      { step: '05', title: 'HikariCP Persistence', sub: 'Async Data Cluster', color: '#8B5CFF', x: cx + 360, y: cy },
    ];

    // Pipeline connecting bus
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 360, cy);
    ctx.lineTo(cx + 360, cy);
    ctx.stroke();

    // Moving packet pulses along the bus
    const packetProgress = (time * 0.8) % 1;
    const packetX = cx - 360 + packetProgress * 720;
    ctx.fillStyle = '#D7FF3F';
    ctx.shadowColor = '#D7FF3F';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(packetX, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Render pipeline nodes
    pipelineNodes.forEach((node, i) => {
      const pulse = Math.sin(time * 3 + i) * 2;
      const nodeW = 150;
      const nodeH = 90;

      ctx.save();
      ctx.translate(node.x, node.y);

      // Node background box
      ctx.fillStyle = 'rgba(17, 18, 24, 0.9)';
      ctx.strokeStyle = node.color === '#D7FF3F' ? 'rgba(215, 255, 63, 0.4)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-nodeW / 2, -nodeH / 2, nodeW, nodeH, 12);
      ctx.fill();
      ctx.stroke();

      // Step indicator
      ctx.fillStyle = node.color;
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`PHASE ${node.step}`, -nodeW / 2 + 12, -nodeH / 2 + 20);

      // Node Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.fillText(node.title, -nodeW / 2 + 12, -nodeH / 2 + 42);

      // Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(node.sub, -nodeW / 2 + 12, -nodeH / 2 + 62);

      // Node center port
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(0, nodeH / 2, 4 + pulse * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Header & Telemetry text
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLIXCORE HIGH-THROUGHPUT PIPELINE', cx, 80);

    ctx.fillStyle = '#D7FF3F';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('ASYNC EVENT BUS · 20.0 SUSTAINED TPS · HIKARICP POOL', cx, 110);
    ctx.restore();
  },
};
