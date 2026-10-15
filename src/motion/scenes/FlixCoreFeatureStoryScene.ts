import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCoreFeatureStoryScene: MotionScene = {
  id: 'flixcore-features',
  name: 'FlixCore Plugin — Feature Storytelling Sequence',
  description: 'Choreographed visual walk-through of the 5 confirmed core subsystems.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Technical radar rings
    ctx.save();
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.05)';
    ctx.lineWidth = 1;
    [100, 200, 300, 420].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Rotating scanner vector
    const angle = (time * 1.2) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * 440, cy + Math.sin(angle) * 440);
    ctx.stroke();
    ctx.restore();

    // 5 Confirmed Feature Nodes arranged in a dynamic circuit
    const features = [
      { id: '01', title: 'Combat & Kits', sub: '10+ Duel Ladders & Trims', color: '#D7FF3F', angle: -0.6 },
      { id: '02', title: 'HT5 Matchmaking', sub: '5s Expanding Windows', color: '#8B5CFF', angle: 0.1 },
      { id: '03', title: 'Arena Bounding', sub: 'ArenaSafetyHelper 3D', color: '#D7FF3F', angle: 0.9 },
      { id: '04', title: 'Automated Brackets', sub: 'Sliding Doors & Rewinds', color: '#8B5CFF', angle: 1.7 },
      { id: '05', title: '20.0 TPS Engine', sub: 'Chunky 54+ Preload', color: '#FFFFFF', angle: 2.5 },
    ];

    // Determine currently highlighted feature based on progress (cycles across the 5)
    const activeIdx = Math.floor((progress * 5) % 5);

    features.forEach((feat, idx) => {
      const isCurrent = idx === activeIdx;
      const dist = 240 + (isCurrent ? 20 : 0);
      const fx = cx + Math.cos(feat.angle * Math.PI) * dist;
      const fy = cy + Math.sin(feat.angle * Math.PI) * (dist * 0.7);

      ctx.save();
      // Draw connection trace to center
      ctx.strokeStyle = isCurrent ? 'rgba(215, 255, 63, 0.4)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = isCurrent ? 2 : 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(fx, fy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Card box
      const boxW = 180;
      const boxH = 75;
      ctx.fillStyle = isCurrent ? 'rgba(20, 22, 28, 0.95)' : 'rgba(12, 13, 17, 0.8)';
      ctx.strokeStyle = isCurrent ? feat.color : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isCurrent ? 2 : 1;
      if (isCurrent) {
        ctx.shadowColor = feat.color;
        ctx.shadowBlur = 18;
      }
      ctx.beginPath();
      ctx.roundRect(fx - boxW / 2, fy - boxH / 2, boxW, boxH, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Text inside box
      ctx.fillStyle = feat.color;
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SUBSYSTEM ${feat.id}`, fx - boxW / 2 + 12, fy - boxH / 2 + 18);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.fillText(feat.title, fx - boxW / 2 + 12, fy - boxH / 2 + 38);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(feat.sub, fx - boxW / 2 + 12, fy - boxH / 2 + 56);

      ctx.restore();
    });

    // Central Core Hub
    ctx.save();
    ctx.fillStyle = '#0E0F14';
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(215, 255, 63, 0.3)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(cx, cy, 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FLIXCORE', cx, cy - 6);

    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillText('CORE BUS', cx, cy + 12);
    ctx.restore();

    // Top Header & Subtitle
    ctx.save();
    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('CONFIRMED ARCHITECTURAL STORYTELLING', cx, 60);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.fillText('Synchronous Event Orchestration & Asynchronous Storage Engine', cx, 84);
    ctx.restore();
  },
};
