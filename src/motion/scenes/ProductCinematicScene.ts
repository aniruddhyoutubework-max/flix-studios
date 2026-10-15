import { MotionScene, MotionRenderContext } from '../types';
import { interpolate, Easing } from '../core/Easing';

export const ProductCinematicScene: MotionScene = {
  id: 'product-cinematic',
  name: 'Flix Studios Flagship Product Presentation',
  description: 'Layered dimensional showcase of FlixCore Practice & Event Core with kinetic telemetry and lighting vectors.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Deep obsidian canvas
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Technical Perspective Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;

    const gridOffset = (time * 24) % 40;
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

    // 3. Ambient Dimensional Flares (Restrained lime & violet lighting)
    ctx.save();
    const flareX = cx + Math.sin(time * 0.8) * 120;
    const flareY = cy + Math.cos(time * 0.7) * 40;

    const radialViolet = ctx.createRadialGradient(flareX - 180, flareY - 50, 20, flareX - 180, flareY - 50, 480);
    radialViolet.addColorStop(0, 'rgba(139, 92, 255, 0.14)');
    radialViolet.addColorStop(1, 'transparent');
    ctx.fillStyle = radialViolet;
    ctx.fillRect(0, 0, width, height);

    const radialLime = ctx.createRadialGradient(flareX + 180, flareY + 30, 20, flareX + 180, flareY + 30, 440);
    radialLime.addColorStop(0, 'rgba(215, 255, 63, 0.12)');
    radialLime.addColorStop(1, 'transparent');
    ctx.fillStyle = radialLime;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 4. Layered Depth Planes (Parallax offsets)
    const cameraPan = Math.sin(progress * Math.PI * 2) * 20;

    // Left Secondary Depth Card: "10+ CUSTOM COMBAT KITS"
    ctx.save();
    const leftX = cx - 380 + cameraPan * 0.5;
    const leftY = cy + 20 + Math.sin(time * 1.2) * 8;
    ctx.fillStyle = 'rgba(17, 18, 24, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(leftX - 130, leftY - 140, 260, 280, 16);
    ctx.fill();
    ctx.stroke();

    // Left card badge & title
    ctx.fillStyle = '#8B5CFF';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('FEATURE MODULE 01', leftX - 110, leftY - 105);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText('10+ Custom Kits & Trims', leftX - 110, leftY - 75);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('UI-driven presets &', leftX - 110, leftY - 45);
    ctx.fillText('complete kit customization.', leftX - 110, leftY - 27);

    // Decorative simulated GUI slots
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const slotX = leftX - 105 + col * 55;
        const slotY = leftY + 10 + row * 34;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(slotX, slotY, 46, 26, 6);
        ctx.fill();
        ctx.stroke();

        if (row === 0 && col === 0) {
          ctx.fillStyle = '#D7FF3F';
          ctx.beginPath();
          ctx.arc(slotX + 23, slotY + 13, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();

    // Right Secondary Depth Card: "ASYNC ENGINE & 20.0 TPS"
    ctx.save();
    const rightX = cx + 380 - cameraPan * 0.5;
    const rightY = cy + 20 + Math.cos(time * 1.2) * 8;
    ctx.fillStyle = 'rgba(17, 18, 24, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rightX - 130, rightY - 140, 260, 280, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('PERFORMANCE CORE', rightX - 110, rightY - 105);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText('20.0 TPS Async Engine', rightX - 110, rightY - 75);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Chunky arena preloading &', rightX - 110, rightY - 45);
    ctx.fillText('HikariCP async database.', rightX - 110, rightY - 27);

    // Telemetry metric pills
    const metrics = [
      { label: 'ARENAS', val: '54 PRELOADED' },
      { label: 'TICK TIME', val: '0.24ms' },
      { label: 'ROLLBACK', val: 'SUB-SECOND' },
    ];
    metrics.forEach((m, i) => {
      const my = rightY + 15 + i * 36;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(rightX - 110, my, 220, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(m.label, rightX - 98, my + 18);

      ctx.fillStyle = '#D7FF3F';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(m.val, rightX + 98, my + 18);
      ctx.textAlign = 'left';
    });
    ctx.restore();

    // Central Hero Showcase Card (Dominant plane)
    ctx.save();
    const heroCardW = 560;
    const heroCardH = 340;
    const heroX = cx + cameraPan * 0.2;
    const heroY = cy + 10;

    // Glowing shadow
    ctx.shadowColor = 'rgba(215, 255, 63, 0.2)';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#0E0F15';
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(heroX - heroCardW / 2, heroY - heroCardH / 2, heroCardW, heroCardH, 20);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Inner top bezel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(heroX - heroCardW / 2, heroY - heroCardH / 2, heroCardW, 44);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(heroX - heroCardW / 2, heroY - heroCardH / 2, heroCardW, 44);

    // Bezel Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('FLIX STUDIOS // FLAGSHIP SPECIFICATION', heroX - heroCardW / 2 + 20, heroY - heroCardH / 2 + 27);

    // Status beacon
    ctx.fillStyle = '#D7FF3F';
    ctx.beginPath();
    ctx.arc(heroX + heroCardW / 2 - 24, heroY - heroCardH / 2 + 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // Main Product Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLIXCORE PLUGIN', heroX, heroY - 45);

    // Subtitle
    ctx.fillStyle = 'rgba(215, 255, 63, 0.95)';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('ENTERPRISE PRACTICE & EVENT CORE', heroX, heroY - 15);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('High-Performance 1v1 Practice & Automated Event Engine', heroX, heroY + 20);

    // 4 Badges in Hero Card
    const heroBadges = [
      'MINECRAFT 1.8 - 1.21.4',
      '26.40+ COMPATIBLE',
      'PAPER & VELOCITY',
      'BUILTBYBIT VERIFIED',
    ];

    heroBadges.forEach((b, idx) => {
      const bx = heroX - 220 + (idx % 2) * 230;
      const by = heroY + 58 + Math.floor(idx / 2) * 36;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(bx, by, 210, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b, bx + 105, by + 18);
    });
    ctx.restore();

    // 5. Header Overlay Banner
    ctx.save();
    ctx.fillStyle = 'rgba(215, 255, 63, 0.95)';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX STUDIOS // CINEMATIC PRODUCT PRESENTATION', cx, 55);

    // 6. Bottom Telemetry Status
    const footerY = height - 45;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(cx - 380, footerY - 16, 760, 32);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(cx - 380, footerY - 16, 760, 32);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `SYS.T: ${time.toFixed(2)}s  |  FR: ${Math.floor(progress * 180)}/180  |  STATUS: DETERMINISTIC RENDER ACTIVE`,
      cx,
      footerY + 4
    );
    ctx.restore();
  },
};
