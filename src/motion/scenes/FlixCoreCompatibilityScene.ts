import { MotionScene, MotionRenderContext } from '../types';
import { Easing, interpolate } from '../core/Easing';

export const FlixCoreCompatibilityScene: MotionScene = {
  id: 'flixcore-compat',
  name: 'FlixCore Plugin — Multi-Version Compatibility & Runtime Matrix',
  description: 'Deterministic protocol telemetry, multi-engine server matrix (Paper/Purpur/Folia), and 20.0 TPS sync pulse.',
  durationInFrames: 180, // 6 seconds at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  render: ({ ctx, width, height, progress, time }: MotionRenderContext) => {
    // 1. Obsidian Studio Canvas
    ctx.fillStyle = '#08090B';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 2. Atmospheric Ambient Lighting
    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy - 40, 50, cx, cy - 40, 550);
    grad.addColorStop(0, 'rgba(215, 255, 63, 0.08)');
    grad.addColorStop(0.5, 'rgba(139, 92, 255, 0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Technical Grid & Synchronized Waveforms
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dynamic 20.0 TPS Tick Waveform across bottom
    ctx.strokeStyle = '#D7FF3F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const waveY = height - 70;
    for (let x = 0; x < width; x += 6) {
      const freq = 0.035;
      const amp = Math.sin(x * freq + time * 5) * 12 + Math.cos(x * 0.015 - time * 3) * 6;
      if (x === 0) ctx.moveTo(x, waveY + amp);
      else ctx.lineTo(x, waveY + amp);
    }
    ctx.stroke();

    // Waveform metadata
    ctx.fillStyle = '#D7FF3F';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText('ENGINE TICKRATE: 20.00 TPS (0.0ms DELAY) // ZERO PACKET STALL', 50, height - 90);
    ctx.restore();

    // 4. Header Bar
    ctx.save();
    ctx.fillStyle = '#8B5CFF';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RUNTIME SPECIFICATIONS // ENTERPRISE MULTI-VERSION MATRIX', cx, 52);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('Universal Compatibility & High-Performance Architecture', cx, 80);
    ctx.restore();

    // 5. Four Primary Platform Architecture Cards
    const platforms = [
      {
        name: 'PaperMC / Purpur',
        version: '1.8.8 – 1.21.4',
        role: 'Native Async Processing',
        status: 'CERTIFIED 20.0 TPS',
        color: '#D7FF3F',
        specs: ['Async Chunk Loading', 'Strict Tick Pipeline', 'Zero Ghost Blocks']
      },
      {
        name: 'Folia Parallel Engine',
        version: '1.20.4 – 1.21.4+',
        role: 'Multi-Threaded Region Ticking',
        status: 'THREAD-SAFE CLUSTER',
        color: '#8B5CFF',
        specs: ['Region-Locked Arenas', 'Lock-Free Queues', 'Zero Deadlocks']
      },
      {
        name: 'Velocity & Bungee',
        version: 'v3.3.0+ Enterprise',
        role: 'Cross-Server Matchmaking Hub',
        status: 'SUB-5MS SYNC',
        color: '#38BDF8',
        specs: ['Redis Pub/Sub Sync', 'Instant Lobby Teleport', 'Global Match Queues']
      },
      {
        name: 'Java 17 / 21 LTS',
        version: '64-Bit ZGC / G1GC',
        role: 'Optimized Memory Allocation',
        status: 'LOW-LATENCY RUNTIME',
        color: '#F43F5E',
        specs: ['Vectorized Math Calls', 'Minimal GC Pauses', 'Memory Efficient']
      }
    ];

    const cardW = 260;
    const cardH = 260;
    const cardGap = 24;
    const totalW = 4 * cardW + 3 * cardGap;
    const startX = cx - totalW / 2;
    const startY = cy - 80;

    const pulse = Math.sin(time * 3) * 0.5 + 0.5;

    platforms.forEach((p, idx) => {
      const px = startX + idx * (cardW + cardGap);
      const isHighlighted = Math.floor((progress * 4) % 4) === idx;

      ctx.save();
      // Outer card box
      ctx.fillStyle = isHighlighted ? 'rgba(18, 20, 26, 0.95)' : 'rgba(12, 13, 17, 0.85)';
      ctx.strokeStyle = isHighlighted ? p.color : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isHighlighted ? 2 : 1;

      if (isHighlighted) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
      }

      ctx.beginPath();
      ctx.roundRect(px, startY, cardW, cardH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Status Pill
      ctx.fillStyle = isHighlighted ? p.color : 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(px + 16, startY + 18, 120, 22, 6);
      ctx.fill();

      ctx.fillStyle = isHighlighted ? '#08090B' : 'rgba(255, 255, 255, 0.7)';
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.status, px + 76, startY + 32);

      // Name & Version
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.fillText(p.name, px + 16, startY + 68);

      ctx.fillStyle = p.color;
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.fillText(p.version, px + 16, startY + 88);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(p.role, px + 16, startY + 108);

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 16, startY + 124);
      ctx.lineTo(px + cardW - 16, startY + 124);
      ctx.stroke();

      // Feature Checkmarks
      p.specs.forEach((spec, sIdx) => {
        const sy = startY + 148 + sIdx * 28;
        // Check dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px + 22, sy - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(spec, px + 34, sy);
      });

      // Bottom pulse accent if active
      if (isHighlighted) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(px + 16, startY + cardH - 6, cardW - 32, 2, 1);
        ctx.fill();
      }

      ctx.restore();
    });

    // 6. Center Protocol Handshake Badge
    ctx.save();
    const badgeW = 420;
    const badgeH = 46;
    const badgeX = cx - badgeW / 2;
    const badgeY = cy + 205;

    ctx.fillStyle = 'rgba(14, 15, 20, 0.9)';
    ctx.strokeStyle = 'rgba(215, 255, 63, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fill();
    ctx.stroke();

    // Pulse dot
    ctx.fillStyle = '#D7FF3F';
    ctx.shadowColor = '#D7FF3F';
    ctx.shadowBlur = 10 * pulse;
    ctx.beginPath();
    ctx.arc(badgeX + 24, badgeY + badgeH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DEPENDENCIES: Chunky 54+ (Optional), FastAsyncWorldEdit (FAWE)', badgeX + 42, badgeY + 22);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('AUTOMATIC PROTOCOL LIB FALLBACK // NATIVE PACKET DECODERS', badgeX + 42, badgeY + 36);

    ctx.restore();
  }
};
