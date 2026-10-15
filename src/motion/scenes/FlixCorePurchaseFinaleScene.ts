import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCorePurchaseFinaleScene: MotionScene = {
  id: 'flixcore-purchase',
  name: 'FlixCore Plugin — Purchase & Conversion Finale',
  description: 'High-impact conversion composition with luminous obsidian materials, live BuiltByBit integration telemetry, and dynamic light flares.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Deep Obsidian Studio Canvas
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Dynamic Ambient Flare & Energy Pulsing
    ctx.save();
    const pulse = Math.sin(time * 2.5) * 0.5 + 0.5;
    const flareRadius = 450 + pulse * 40;

    const radialLime = ctx.createRadialGradient(cx, cy - 30, 40, cx, cy - 30, flareRadius);
    radialLime.addColorStop(0, 'rgba(215, 255, 63, 0.16)');
    radialLime.addColorStop(0.4, 'rgba(139, 92, 255, 0.08)');
    radialLime.addColorStop(1, 'transparent');
    ctx.fillStyle = radialLime;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Floating Kinetic Sparkles / Particles
    ctx.save();
    for (let i = 0; i < 36; i++) {
      const pSeed = (i * 127.1) % 1;
      const speed = 0.3 + ((i * 311.7) % 1) * 0.7;
      const px = (cx - 400 + ((i * 193.3) % 800) + Math.sin(time * speed + i) * 30);
      const py = (cy - 260 + ((i * 389.1) % 520) - (time * 25 * speed) % 520 + 520) % 520 + (cy - 260);

      const pSize = 1.2 + ((i * 59.3) % 2.5);
      const pAlpha = 0.15 + Math.sin(time * 3 + i) * 0.2 + 0.2;

      ctx.fillStyle = i % 2 === 0 ? `rgba(215, 255, 63, ${pAlpha})` : `rgba(139, 92, 255, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Central Dominant Purchase Card
    ctx.save();
    const cardW = 680;
    const cardH = 430;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    const cardEntrance = interpolate(progress, [0, 0.15], [0.95, 1], Easing.easeOutQuad);
    ctx.translate(cx, cy);
    ctx.scale(cardEntrance, cardEntrance);
    ctx.translate(-cx, -cy);

    // Glowing border & shadow
    ctx.shadowColor = 'rgba(215, 255, 63, 0.35)';
    ctx.shadowBlur = 32;

    // Card background
    ctx.fillStyle = '#0E1015';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Gradient outline
    const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    borderGrad.addColorStop(0, '#D7FF3F');
    borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    borderGrad.addColorStop(1, '#8B5CFF');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Card Header Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(cardX + 2, cardY + 2, cardW - 4, 60, [18, 18, 0, 0]);
    ctx.fill();

    // Brand tag
    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('FLIX STUDIOS OFFICIAL RELEASE // BUILTBYBIT VERIFIED', cardX + 32, cardY + 36);

    // Instant Delivery Pill
    ctx.fillStyle = 'rgba(139, 92, 255, 0.2)';
    ctx.strokeStyle = '#8B5CFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cardX + cardW - 170, cardY + 20, 138, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#C4B5FD';
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('INSTANT LICENSE', cardX + cardW - 101, cardY + 36);

    // Product Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Space Grotesk", sans-serif';
    ctx.fillText('FlixCore Plugin', cardX + 32, cardY + 115);

    // Subtitle pitch
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Complete Enterprise Practice & Competitive Duel Engine for Minecraft.', cardX + 32, cardY + 144);

    // Pricing Row
    ctx.fillStyle = '#D7FF3F';
    ctx.font = 'bold 44px "Space Grotesk", sans-serif';
    ctx.fillText('$49.99', cardX + 32, cardY + 215);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillText('USD // ONE-TIME PURCHASE', cardX + 200, cardY + 195);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Includes lifetime updates, support & verified updates', cardX + 200, cardY + 215);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 32, cardY + 245);
    ctx.lineTo(cardX + cardW - 32, cardY + 245);
    ctx.stroke();

    // 3 Guarantee Pillars
    const pillars = [
      { label: 'BuiltByBit Verified', sub: 'Instant Download & Key', icon: '✦' },
      { label: 'Paper & Purpur Ready', sub: '1.8.8 – 1.21.4 (26.40+)', icon: '⚡' },
      { label: 'Discord VIP Lounge', sub: 'Direct Developer Support', icon: '💬' }
    ];

    pillars.forEach((pil, pIdx) => {
      const px = cardX + 32 + pIdx * 206;
      const py = cardY + 280;

      ctx.fillStyle = '#D7FF3F';
      ctx.font = '14px sans-serif';
      ctx.fillText(pil.icon, px, py);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.fillText(pil.label, px + 22, py);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(pil.sub, px + 22, py + 18);
    });

    // Simulated Prominent CTA Button
    const btnW = cardW - 64;
    const btnH = 54;
    const btnX = cardX + 32;
    const btnY = cardY + 342;

    ctx.shadowColor = '#D7FF3F';
    ctx.shadowBlur = 20 * pulse;

    ctx.fillStyle = '#D7FF3F';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 12);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#08090B';
    ctx.font = 'bold 15px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PURCHASE ON BUILTBYBIT — $49.99 USD ↗', btnX + btnW / 2, btnY + 33);

    ctx.restore();

    // 5. Bottom Security Ribbon
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('256-BIT ENCRYPTED CHECKOUT VIA BUILTBYBIT ESCROW • 100% SATISFACTION GUARANTEED', cx, height - 38);
    ctx.restore();
  }
};
