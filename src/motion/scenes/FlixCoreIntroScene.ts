import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCoreIntroScene: MotionScene = {
  id: 'flixcore-intro',
  name: 'FlixCore Plugin — Cinematic Product Reveal',
  description: 'Dramatic product introduction with dimensional depth, controlled lighting, and kinetic typography.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Obsidian canvas base
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Technical Perspective Grid with gentle forward velocity
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;

    const gridOffset = (time * 28) % 40;
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

    // 3. Controlled Atmospheric Flares (Lime & Violet)
    ctx.save();
    const flareOffset = Math.sin(time * 0.8) * 90;

    const violetGlow = ctx.createRadialGradient(cx - 260 + flareOffset, cy - 60, 20, cx - 260, cy - 60, 460);
    violetGlow.addColorStop(0, 'rgba(139, 92, 255, 0.16)');
    violetGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = violetGlow;
    ctx.fillRect(0, 0, width, height);

    const limeGlow = ctx.createRadialGradient(cx + 260 - flareOffset, cy + 40, 20, cx + 260, cy + 40, 440);
    limeGlow.addColorStop(0, 'rgba(215, 255, 63, 0.13)');
    limeGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = limeGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 4. Parallax Camera Motion & Card Reveal
    const cameraPanX = Math.sin(progress * Math.PI * 2) * 16;
    const cardScale = interpolate(progress, [0, 0.15, 0.9, 1], [0.94, 1.0, 1.0, 0.97], Easing.easeOutQuad);

    // Left Secondary Card: "10+ Balanced Combat Kits"
    ctx.save();
    const leftX = cx - 390 + cameraPanX * 0.4;
    const leftY = cy + 10 + Math.sin(time * 1.3) * 6;
    ctx.fillStyle = 'rgba(14, 15, 20, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(leftX - 120, leftY - 130, 240, 260, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#8B5CFF';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText('FEATURE SPEC 01', leftX - 100, leftY - 95);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Space Grotesk", sans-serif';
    ctx.fillText('10+ Balanced Kits', leftX - 100, leftY - 68);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('UI kit presets, custom KB', leftX - 100, leftY - 40);
    ctx.fillText('& Armor Trim progression.', leftX - 100, leftY - 24);

    // Simulated GUI inventory slots
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const slotX = leftX - 98 + col * 50;
        const slotY = leftY + 12 + row * 34;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(slotX, slotY, 42, 26, 6);
        ctx.fill();
        ctx.stroke();

        if (row === 0 && col === 1) {
          ctx.fillStyle = '#D7FF3F';
          ctx.beginPath();
          ctx.arc(slotX + 21, slotY + 13, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();

    // Right Secondary Card: "20.0 TPS Async HikariCP"
    ctx.save();
    const rightX = cx + 390 - cameraPanX * 0.4;
    const rightY = cy + 10 + Math.cos(time * 1.3) * 6;
    ctx.fillStyle = 'rgba(14, 15, 20, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rightX - 120, rightY - 130, 240, 260, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText('PERFORMANCE CORE', rightX - 100, rightY - 95);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Space Grotesk", sans-serif';
    ctx.fillText('20.0 TPS Async Engine', rightX - 100, rightY - 68);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Chunky 54+ arenas preloaded', rightX - 100, rightY - 40);
    ctx.fillText('& sub-second FAWE resets.', rightX - 100, rightY - 24);

    const telemetry = [
      { label: 'ARENAS', val: '54 PRELOADED' },
      { label: 'TICK TIME', val: '0.22ms' },
      { label: 'FAILOVER', val: 'ASYNC SUB-SEC' },
    ];
    telemetry.forEach((t, i) => {
      const ty = rightY + 15 + i * 35;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(rightX - 100, ty, 200, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(t.label, rightX - 90, ty + 17);

      ctx.fillStyle = '#D7FF3F';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(t.val, rightX + 90, ty + 17);
    });
    ctx.restore();

    // Central Focal Flagship Showcase Card
    ctx.save();
    const heroW = 560 * cardScale;
    const heroH = 320 * cardScale;
    const heroX = cx + cameraPanX * 0.15;
    const heroY = cy + 10;

    // Glowing border shadow
    ctx.shadowColor = 'rgba(215, 255, 63, 0.22)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#0B0C10';
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(heroX - heroW / 2, heroY - heroH / 2, heroW, heroH, 20);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Top Bezel Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.fillRect(heroX - heroW / 2, heroY - heroH / 2, heroW, 42);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(heroX - heroW / 2, heroY - heroH / 2, heroW, 42);

    // Bezel Title & Status
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('FLIX STUDIOS // FLAGSHIP PRODUCTION CORE', heroX - heroW / 2 + 20, heroY - heroH / 2 + 26);

    ctx.fillStyle = '#D7FF3F';
    ctx.beginPath();
    ctx.arc(heroX + heroW / 2 - 24, heroY - heroH / 2 + 21, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Title & Kinetic Typography
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLIXCORE PLUGIN', heroX, heroY - 40);

    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('ENTERPRISE PRACTICE & EVENT ARCHITECTURE', heroX, heroY - 12);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('High-Performance PvP Practice & Automated Tournaments', heroX, heroY + 22);

    // 4 Badges
    const badges = [
      'MINECRAFT 1.8 - 1.21.4',
      'PAPER & VELOCITY',
      '54+ PRELOADED ARENAS',
      'BUILTBYBIT VERIFIED',
    ];
    badges.forEach((b, idx) => {
      const bx = heroX - 220 + (idx % 2) * 230;
      const by = heroY + 54 + Math.floor(idx / 2) * 34;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(bx, by, 210, 26, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b, bx + 105, by + 17);
    });
    ctx.restore();

    // 5. Header Overlay
    ctx.save();
    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX STUDIOS // CINEMATIC PRODUCT INTRO', cx, 55);

    // 6. Bottom Telemetry Bar
    const footerY = height - 45;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(cx - 360, footerY - 16, 720, 32);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(cx - 360, footerY - 16, 720, 32);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `SYS.T: ${time.toFixed(2)}s  |  FR: ${Math.floor(progress * 180)}/180  |  STATUS: 20.0 TPS LOCK`,
      cx,
      footerY + 4
    );
    ctx.restore();
  },
};
