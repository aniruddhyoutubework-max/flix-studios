import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const ProcessRadarScene: MotionScene = {
  id: 'process-radar',
  name: 'Engineering Lifecycle Radar',
  description: 'Circular radar visualizing the 6 stages of custom plugin development from Discovery to Maintenance.',
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
    const maxRadius = 260;

    // 2. Concentric radar range rings
    ctx.save();
    ctx.lineWidth = 1;
    [0.35, 0.65, 1.0].forEach((ratio) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.1)';
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius - 30, cy);
    ctx.lineTo(cx + maxRadius + 30, cy);
    ctx.moveTo(cx, cy - maxRadius - 30);
    ctx.lineTo(cx, cy + maxRadius + 30);
    ctx.stroke();
    ctx.restore();

    // 3. Sweeping radar beam
    const sweepAngle = progress * Math.PI * 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, sweepAngle - 0.45, sweepAngle);
    ctx.closePath();

    const sweepGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxRadius);
    sweepGrad.addColorStop(0, 'rgba(215, 255, 63, 0.25)');
    sweepGrad.addColorStop(1, 'rgba(215, 255, 63, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Sweeping line
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * maxRadius, cy + Math.sin(sweepAngle) * maxRadius);
    ctx.stroke();
    ctx.restore();

    // 4. The 6 Engineering Process Stages
    const stages = [
      { id: '01', title: 'REQUIREMENTS', desc: 'Requirements & Edge Cases' },
      { id: '02', title: 'ARCHITECTURE', desc: 'Storage, NMS & Threading' },
      { id: '03', title: 'DEVELOPMENT', desc: 'Clean Java & Packet Logic' },
      { id: '04', title: 'TESTING', desc: 'Stress Tests & Anti-Exploit' },
      { id: '05', title: 'DELIVERY', desc: 'Build & Config Documentation' },
      { id: '06', title: 'UPDATES', desc: 'SLA Fixes & MC Updates' },
    ];

    const currentStageIdx = Math.floor(progress * stages.length);

    stages.forEach((stage, idx) => {
      const angle = (idx / stages.length) * Math.PI * 2 - Math.PI / 2;
      const nodeX = cx + Math.cos(angle) * (maxRadius * 0.85);
      const nodeY = cy + Math.sin(angle) * (maxRadius * 0.85);
      const isActive = idx === currentStageIdx;

      // Connecting line to center
      ctx.save();
      ctx.strokeStyle = isActive ? 'rgba(215, 255, 63, 0.4)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nodeX, nodeY);
      ctx.stroke();

      // Node point
      ctx.fillStyle = isActive ? '#D7FF3F' : '#8B5CFF';
      if (isActive) {
        ctx.shadowColor = '#D7FF3F';
        ctx.shadowBlur = 15;
      }
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, isActive ? 9 : 5, 0, Math.PI * 2);
      ctx.fill();

      // Label text
      ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(244, 243, 238, 0.7)';
      ctx.font = isActive ? '700 13px "Space Grotesk", sans-serif' : '500 11px "Space Grotesk", sans-serif';
      ctx.textAlign = nodeX > cx ? 'left' : nodeX < cx ? 'right' : 'center';
      const labelX = nodeX + (nodeX > cx ? 16 : nodeX < cx ? -16 : 0);
      const labelY = nodeY + (nodeY > cy ? 16 : nodeY < cy ? -16 : 4);
      ctx.fillText(`${stage.id} ${stage.title}`, labelX, labelY);

      if (isActive) {
        ctx.fillStyle = '#D7FF3F';
        ctx.font = '10px monospace';
        ctx.fillText(stage.desc, labelX, labelY + 14);
      }

      ctx.restore();
    });

    // Central Studio Core Beacon
    ctx.save();
    ctx.fillStyle = '#111216';
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F4F3EE';
    ctx.font = '800 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX', cx, cy - 2);
    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 8px monospace';
    ctx.fillText('ENGINEERING', cx, cy + 9);
    ctx.restore();
  },
};
