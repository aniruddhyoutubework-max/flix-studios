import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCoreGalleryMotionScene: MotionScene = {
  id: 'flixcore-gallery',
  name: 'FlixCore Plugin — Advertising Gallery & Spatial Showcase',
  description: 'Directional masked reveals, dimensional frame replacement, and spatial depth transitions for advertising media.',
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

    // 2. Subdued Kinetic Atmospheric Flares
    ctx.save();
    const flareX = cx + Math.sin(time * 0.7) * 120;
    const flareY = cy + Math.cos(time * 0.9) * 60;
    
    const glowViolet = ctx.createRadialGradient(flareX - 220, flareY - 50, 20, flareX - 220, flareY - 50, 480);
    glowViolet.addColorStop(0, 'rgba(139, 92, 255, 0.14)');
    glowViolet.addColorStop(1, 'transparent');
    ctx.fillStyle = glowViolet;
    ctx.fillRect(0, 0, width, height);

    const glowLime = ctx.createRadialGradient(flareX + 220, flareY + 50, 20, flareX + 220, flareY + 50, 440);
    glowLime.addColorStop(0, 'rgba(215, 255, 63, 0.12)');
    glowLime.addColorStop(1, 'transparent');
    ctx.fillStyle = glowLime;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Architectural Depth Grid & Perspective Guides
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Isometric Horizon Guides
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.12)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, cy + 180);
    ctx.lineTo(width, cy + 180);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Multi-Frame Interactive Showcase Cards
    // Simulate 3 layered advertising slides with animated transitions
    const slideDuration = 1 / 3;
    const currentSlide = Math.min(2, Math.floor(progress / slideDuration));
    const slideProgress = (progress % slideDuration) / slideDuration;

    const slides = [
      {
        tag: 'SLIDE 01 / 09',
        title: 'Tactical Duel Arenas & ArenaSafetyHelper',
        desc: '3D boundary isolation, auto-rollback chunks & instantaneous player reset',
        accent: '#D7FF3F',
        hudId: 'SYS_ISOLATION_01'
      },
      {
        tag: 'SLIDE 02 / 09',
        title: 'HT5 Matchmaking & Tier Ladder HUD',
        desc: 'Sub-5s Elo bracket resolution, multi-tier queue telemetry & stats overlay',
        accent: '#8B5CFF',
        hudId: 'SYS_MATCHMAKER_02'
      },
      {
        tag: 'SLIDE 03 / 09',
        title: 'Custom KB Profiles & Armor Trim Presets',
        desc: 'Real-time knockback tuning, custom GUI editor & tournament kit saves',
        accent: '#22D3EE',
        hudId: 'SYS_COMBAT_03'
      }
    ];

    const activeSlide = slides[currentSlide];

    // Dimensional depth parallax
    const slideShiftX = interpolate(slideProgress, [0, 0.2, 0.8, 1], [-20, 0, 0, 20], Easing.easeInOutQuad);
    const slideAlpha = interpolate(slideProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3], Easing.easeInOutQuad);

    // Main Dominant Media Stage Card
    ctx.save();
    const stageW = 760;
    const stageH = 430;
    const stageX = cx - stageW / 2 + slideShiftX;
    const stageY = cy - stageH / 2 - 20;

    // Drop shadow glow
    ctx.shadowColor = activeSlide.accent;
    ctx.shadowBlur = 24 * slideAlpha;

    // Stage Background
    ctx.fillStyle = '#0E1015';
    ctx.beginPath();
    ctx.roundRect(stageX, stageY, stageW, stageH, 16);
    ctx.fill();

    // Stage Border with glowing active gradient
    const borderGrad = ctx.createLinearGradient(stageX, stageY, stageX + stageW, stageY + stageH);
    borderGrad.addColorStop(0, activeSlide.accent);
    borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    borderGrad.addColorStop(1, 'rgba(139, 92, 255, 0.3)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 1.75;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner Cinematic Mockup Canvas
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(stageX + 12, stageY + 12, stageW - 24, stageH - 24, 12);
    ctx.clip();

    // Mockup Dark Surface
    ctx.fillStyle = '#14161E';
    ctx.fillRect(stageX + 12, stageY + 12, stageW - 24, stageH - 24);

    // Stylized Simulated Screenshot Preview
    const viewGrad = ctx.createRadialGradient(stageX + stageW / 2, stageY + stageH / 2, 40, stageX + stageW / 2, stageY + stageH / 2, 380);
    viewGrad.addColorStop(0, 'rgba(30, 34, 48, 0.9)');
    viewGrad.addColorStop(1, 'rgba(10, 11, 15, 0.95)');
    ctx.fillStyle = viewGrad;
    ctx.fillRect(stageX + 12, stageY + 12, stageW - 24, stageH - 24);

    // High-tech Arena / HUD Wireframe Graphic inside preview
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(stageX + stageW / 2, stageY + stageH / 2, 50 + i * 36, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Dynamic scanning line
    const scanY = stageY + 20 + ((time * 120) % (stageH - 40));
    const scanGrad = ctx.createLinearGradient(stageX + 12, scanY, stageX + stageW - 12, scanY);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, activeSlide.accent);
    scanGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = scanGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(stageX + 20, scanY);
    ctx.lineTo(stageX + stageW - 20, scanY);
    ctx.stroke();

    // Crosshair target in preview
    ctx.strokeStyle = activeSlide.accent;
    ctx.lineWidth = 1.5;
    const chX = stageX + stageW / 2;
    const chY = stageY + stageH / 2;
    ctx.beginPath();
    ctx.moveTo(chX - 16, chY);
    ctx.lineTo(chX + 16, chY);
    ctx.moveTo(chX, chY - 16);
    ctx.lineTo(chX, chY + 16);
    ctx.stroke();

    // Stage HUD metadata overlay
    ctx.fillStyle = activeSlide.accent;
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(`FLIXCORE MEDIA ENGINE // ${activeSlide.hudId}`, stageX + 32, stageY + 44);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.fillText(activeSlide.title, stageX + 32, stageY + stageH - 58);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(activeSlide.desc, stageX + 32, stageY + stageH - 34);

    ctx.restore(); // end clip

    // Stage Corner Brackets (Sci-Fi Precision HUD)
    const bLen = 14;
    ctx.strokeStyle = activeSlide.accent;
    ctx.lineWidth = 2;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(stageX - 4, stageY + bLen);
    ctx.lineTo(stageX - 4, stageY - 4);
    ctx.lineTo(stageX + bLen, stageY - 4);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(stageX + stageW + 4 - bLen, stageY - 4);
    ctx.lineTo(stageX + stageW + 4, stageY - 4);
    ctx.lineTo(stageX + stageW + 4, stageY + bLen);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(stageX - 4, stageY + stageH - bLen);
    ctx.lineTo(stageX - 4, stageY + stageH + 4);
    ctx.lineTo(stageX + bLen, stageY + stageH + 4);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(stageX + stageW + 4 - bLen, stageY + stageH + 4);
    ctx.lineTo(stageX + stageW + 4, stageY + stageH + 4);
    ctx.lineTo(stageX + stageW + 4, stageY + stageH - bLen);
    ctx.stroke();

    ctx.restore();

    // 5. Thumbnail Navigation Track & Active Indicator Bar
    ctx.save();
    const trackY = cy + 225;
    const thumbCount = 9;
    const thumbW = 54;
    const thumbH = 34;
    const thumbGap = 12;
    const totalTrackW = thumbCount * thumbW + (thumbCount - 1) * thumbGap;
    const startTrackX = cx - totalTrackW / 2;

    for (let i = 0; i < thumbCount; i++) {
      const tx = startTrackX + i * (thumbW + thumbGap);
      const isCurrentThumb = Math.floor(progress * 9) === i;

      ctx.fillStyle = isCurrentThumb ? 'rgba(215, 255, 63, 0.15)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = isCurrentThumb ? '#D7FF3F' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = isCurrentThumb ? 2 : 1;

      ctx.beginPath();
      ctx.roundRect(tx, trackY, thumbW, thumbH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isCurrentThumb ? '#D7FF3F' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`0${i + 1}`, tx + thumbW / 2, trackY + 21);
    }
    ctx.restore();

    // 6. Global Header Label
    ctx.save();
    ctx.fillStyle = '#8B5CFF';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FLIXCORE // HIGH RESOLUTION MEDIA TELEMETRY', cx, 44);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText('Verified In-Game Advertising Imagery', cx, 68);
    ctx.restore();
  }
};
