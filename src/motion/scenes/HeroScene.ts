import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const HeroScene: MotionScene = {
  id: 'hero-accelerator',
  name: 'Flix Studios Mark Acceleration',
  description: 'Dimensional geometric chevrons traversing coordinate space with lime & violet light vectors.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Deep obsidian base
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Technical perspective grid
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.04)';
    ctx.lineWidth = 1;

    const gridOffset = (progress * 80) % 40;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = gridOffset; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Ambient atmospheric glow
    const radialGlow = ctx.createRadialGradient(cx, cy, 50, cx, cy, 450);
    radialGlow.addColorStop(0, 'rgba(139, 92, 255, 0.12)');
    radialGlow.addColorStop(0.5, 'rgba(215, 255, 63, 0.05)');
    radialGlow.addColorStop(1, 'rgba(8, 9, 11, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 4. Directional light vectors (inspired by FlixCore logo chevron geometry)
    const chevronCount = 5;
    for (let i = 0; i < chevronCount; i++) {
      const stagger = i * 0.14;
      const localProg = (progress + stagger) % 1;
      const zDepth = interpolate(localProg, [0, 1], [0.3, 1.8], Easing.easeOutQuad);
      const alpha = interpolate(localProg, [0, 0.2, 0.8, 1], [0, 0.8, 0.9, 0]);
      const xPos = cx + Math.sin(time * 0.8 + i) * 30;
      const yPos = cy;
      const scale = zDepth * 120;

      ctx.save();
      ctx.translate(xPos, yPos);
      ctx.scale(scale / 100, scale / 100);

      // Draw stylized chevron
      ctx.beginPath();
      ctx.moveTo(-70, -50);
      ctx.lineTo(0, 0);
      ctx.lineTo(-70, 50);
      ctx.lineTo(-40, 50);
      ctx.lineTo(30, 0);
      ctx.lineTo(-40, -50);
      ctx.closePath();

      // Dual neon gradient border
      const strokeGrad = ctx.createLinearGradient(-70, -50, 30, 50);
      if (i % 2 === 0) {
        strokeGrad.addColorStop(0, `rgba(215, 255, 63, ${alpha})`);
        strokeGrad.addColorStop(1, `rgba(139, 92, 255, ${alpha * 0.7})`);
      } else {
        strokeGrad.addColorStop(0, `rgba(139, 92, 255, ${alpha})`);
        strokeGrad.addColorStop(1, `rgba(215, 255, 63, ${alpha * 0.8})`);
      }

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 3;
      ctx.shadowColor = i % 2 === 0 ? 'rgba(215, 255, 63, 0.6)' : 'rgba(139, 92, 255, 0.6)';
      ctx.shadowBlur = 15;
      ctx.stroke();

      ctx.restore();
    }

    // 5. Kinetic Typography Overlay
    const textAlpha = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    ctx.save();
    ctx.fillStyle = `rgba(244, 243, 238, ${textAlpha})`;
    ctx.font = '900 36px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX STUDIOS', cx, height - 90);

    ctx.fillStyle = `rgba(215, 255, 63, ${textAlpha * 0.9})`;
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText('MINECRAFT CORE ARCHITECTURE // 2026', cx, height - 60);

    // Technical telemetry coordinates
    ctx.fillStyle = 'rgba(244, 243, 238, 0.3)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SYS.T: ${time.toFixed(2)}s  |  FR: ${Math.floor(progress * 180)}/180  |  STATUS: OPERATIONAL`, 40, height - 30);
    ctx.restore();
  },
};
