import { MotionScene, MotionRenderContext } from '../types';
import { interpolate, Easing } from '../core/Easing';

interface PipelineStage {
  step: string;
  title: string;
  tech: string;
  subtext: string;
}

interface ServicePipeline {
  id: string;
  discipline: string;
  subtitle: string;
  color: string;
  badge: string;
  stages: PipelineStage[];
}

export const ServicesMotionScene: MotionScene = {
  id: 'services-orchestration',
  name: 'Flix Studios Disciplines Orchestration',
  description: 'Three genuine engineering pipelines: Plugin Development, Mod Development, and Server Infrastructure.',
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

    // 2. Blueprint Telemetry Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Define the Three Real Pipelines
    const pipelines: ServicePipeline[] = [
      {
        id: 'plugins',
        discipline: 'DISCIPLINE 01 // CUSTOM PLUGIN DEVELOPMENT',
        subtitle: 'Paper, Purpur & Spigot APIs · Modern Java 21 · Asynchronous Architecture',
        color: '#D7FF3F',
        badge: 'PAPER / PURPUR',
        stages: [
          {
            step: '01',
            title: 'REQUIREMENTS',
            tech: 'Input Scope',
            subtext: 'Game rules & GUI specs',
          },
          {
            step: '02',
            title: 'ARCHITECTURE',
            tech: 'Engine Core',
            subtext: 'HikariCP & async pools',
          },
          {
            step: '03',
            title: 'COMMANDS & EVENTS',
            tech: 'Interactions',
            subtext: 'Brigadier & event bus',
          },
          {
            step: '04',
            title: 'INTEGRATION',
            tech: 'Server Hooks',
            subtext: 'Vault, PAPI & Redis',
          },
          {
            step: '05',
            title: 'TESTED BUILD',
            tech: 'Verified JAR',
            subtext: '20.0 TPS & zero leaks',
          },
        ],
      },
      {
        id: 'mods',
        discipline: 'DISCIPLINE 02 // CUSTOM MINECRAFT MOD DEVELOPMENT',
        subtitle: 'Fabric, NeoForge & Forge · Bi-Directional Packet Sync · Entity Systems',
        color: '#8B5CFF',
        badge: 'FABRIC / FORGE',
        stages: [
          {
            step: '01',
            title: 'GAMEPLAY IDEA',
            tech: 'Mechanic Scope',
            subtext: 'Custom weapons & AI',
          },
          {
            step: '02',
            title: 'MOD LOGIC',
            tech: 'Item Registries',
            subtext: 'Entity capabilities',
          },
          {
            step: '03',
            title: 'LOADER MATRIX',
            tech: 'Compatibility',
            subtext: 'Fabric & NeoGradle',
          },
          {
            step: '04',
            title: 'TESTING & SYNC',
            tech: 'Network Packets',
            subtext: 'Client HUD & server tick',
          },
          {
            step: '05',
            title: 'DELIVERABLE MOD',
            tech: 'Universal Build',
            subtext: 'Production modpack JAR',
          },
        ],
      },
      {
        id: 'setup',
        discipline: 'DISCIPLINE 03 // MINECRAFT SERVER SETUP & CONFIGURATION',
        subtitle: 'Velocity Proxy Routing · LuckPerms Security · Aikar JVM Garbage Tuning',
        color: '#D7FF3F',
        badge: 'VELOCITY / PROXY',
        stages: [
          {
            step: '01',
            title: 'SERVER SPECS',
            tech: 'Topology',
            subtext: 'Gamemode & hardware',
          },
          {
            step: '02',
            title: 'ENGINE & CONFIG',
            tech: 'Purpur / Velocity',
            subtext: 'Aikar JVM tuning flags',
          },
          {
            step: '03',
            title: 'PLUGINS & PERMS',
            tech: 'Access Matrix',
            subtext: 'LuckPerms rank hierarchy',
          },
          {
            step: '04',
            title: 'AUDIT & BENCH',
            tech: 'Spark Profiler',
            subtext: 'Tick timings & safety',
          },
          {
            step: '05',
            title: 'TURNKEY CONFIG',
            tech: 'Deployable Pack',
            subtext: 'Ready server & backups',
          },
        ],
      },
    ];

    // Determine current active pipeline based on 6-second loop (2s per discipline)
    const pipelineDuration = 2.0; // 2 seconds each
    const cycleProgress = (time % 6.0) / 6.0;
    const activePipelineIdx = Math.min(2, Math.floor(cycleProgress * 3));
    const activePipeline = pipelines[activePipelineIdx];
    const subProgress = ((time % pipelineDuration) / pipelineDuration); // 0 to 1 within active pipeline

    // Active stage within the 5 stages
    const activeStageIdx = Math.min(4, Math.floor(subProgress * 5));

    // Top Radial Ambient Glow
    ctx.save();
    const glowGrad = ctx.createRadialGradient(cx, 160, 20, cx, 160, 420);
    glowGrad.addColorStop(0, activePipeline.color === '#D7FF3F' ? 'rgba(215, 255, 63, 0.08)' : 'rgba(139, 92, 255, 0.08)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 4. Header Section
    ctx.save();
    // Studio Tag
    ctx.fillStyle = activePipeline.color;
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('FLIX STUDIOS // SOFTWARE ARCHITECTURE PIPELINE', cx, 64);

    // Discipline Main Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.fillText(activePipeline.discipline, cx, 102);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(activePipeline.subtitle, cx, 130);
    ctx.restore();

    // Discipline Switcher Indicators (at top)
    const pillW = 200;
    const pillH = 28;
    const pillGap = 16;
    const totalPillsW = 3 * pillW + 2 * pillGap;
    const pillStartX = cx - totalPillsW / 2;

    pipelines.forEach((p, pIdx) => {
      const pX = pillStartX + pIdx * (pillW + pillGap);
      const isCurrentP = pIdx === activePipelineIdx;

      ctx.save();
      ctx.fillStyle = isCurrentP ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)';
      ctx.strokeStyle = isCurrentP ? p.color : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isCurrentP ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(pX, 156, pillW, pillH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isCurrentP ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = isCurrentP ? 'bold 11px "JetBrains Mono", monospace' : '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.badge, pX + pillW / 2, 174);
      ctx.restore();
    });

    // 5. Render the 5 Pipeline Stage Cards
    const cardW = 196;
    const cardH = 250;
    const cardGap = 28;
    const totalPipelineW = 5 * cardW + 4 * cardGap;
    const startX = cx - totalPipelineW / 2;
    const cardY = cy - 20;

    // Draw connecting conduit track behind cards
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, cardY + cardH / 2);
    ctx.lineTo(startX + totalPipelineW, cardY + cardH / 2);
    ctx.stroke();

    // Draw animated pulse travelling down conduit
    const pulseOffset = (subProgress * 1.5) % 1;
    const pulseX = startX + pulseOffset * totalPipelineW;
    ctx.strokeStyle = activePipeline.color;
    ctx.lineWidth = 4;
    ctx.shadowColor = activePipeline.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(Math.max(startX, pulseX - 60), cardY + cardH / 2);
    ctx.lineTo(Math.min(startX + totalPipelineW, pulseX + 60), cardY + cardH / 2);
    ctx.stroke();
    ctx.restore();

    // Render individual stage cards
    activePipeline.stages.forEach((stage, idx) => {
      const cardX = startX + idx * (cardW + cardGap);
      const isPast = idx < activeStageIdx;
      const isCurrent = idx === activeStageIdx;
      const isFuture = idx > activeStageIdx;

      ctx.save();

      // Card Background & Border
      let bgStyle = 'rgba(14, 15, 20, 0.85)';
      let borderStyle = 'rgba(255, 255, 255, 0.08)';
      let lineWidth = 1;

      if (isCurrent) {
        bgStyle = 'rgba(22, 24, 32, 0.95)';
        borderStyle = activePipeline.color;
        lineWidth = 2;
        ctx.shadowColor = activePipeline.color;
        ctx.shadowBlur = 18;
      } else if (isPast) {
        bgStyle = 'rgba(16, 18, 24, 0.9)';
        borderStyle = 'rgba(255, 255, 255, 0.2)';
      }

      ctx.fillStyle = bgStyle;
      ctx.strokeStyle = borderStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Stage Number & Badge Tag
      const headerY = cardY + 28;
      ctx.fillStyle = isCurrent ? activePipeline.color : 'rgba(255, 255, 255, 0.4)';
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`STAGE ${stage.step}`, cardX + 18, headerY);

      // Status indicator dot
      ctx.beginPath();
      ctx.arc(cardX + cardW - 24, headerY - 4, isCurrent ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? activePipeline.color : isPast ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)';
      ctx.fill();

      // Category Pill
      const tagY = headerY + 22;
      ctx.fillStyle = isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.roundRect(cardX + 18, tagY - 14, cardW - 36, 22, 6);
      ctx.fill();

      ctx.fillStyle = isCurrent ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(stage.tech.toUpperCase(), cardX + cardW / 2, tagY);

      // Stage Title
      const titleY = tagY + 48;
      ctx.fillStyle = isCurrent ? '#FFFFFF' : isPast ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)';
      ctx.font = '800 15px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stage.title, cardX + cardW / 2, titleY);

      // Subtext / Description
      const subY = titleY + 30;
      ctx.fillStyle = isCurrent ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stage.subtext, cardX + cardW / 2, subY);

      // Bottom Status Indicator
      const statusY = cardY + cardH - 24;
      ctx.fillStyle = isCurrent
        ? activePipeline.color
        : isPast
        ? 'rgba(255, 255, 255, 0.6)'
        : 'rgba(255, 255, 255, 0.2)';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isCurrent ? '⚡ IN EXECUTION' : isPast ? '✓ COMPLETE' : 'WAITING', cardX + cardW / 2, statusY);

      // Progress connector arrow between cards
      if (idx < 4) {
        const arrowX = cardX + cardW + cardGap / 2;
        const arrowY = cardY + cardH / 2;
        ctx.fillStyle = isPast ? activePipeline.color : 'rgba(255, 255, 255, 0.2)';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('→', arrowX, arrowY + 5);
      }

      ctx.restore();
    });

    // 6. Bottom Telemetry Bar
    ctx.save();
    const footerY = height - 52;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(cx - 500, footerY - 18, 1000, 36);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(cx - 500, footerY - 18, 1000, 36);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    const metricsText =
      activePipeline.id === 'plugins'
        ? 'TPS: 20.00  |  HEAP: 512MB POOL  |  TICK DELAY: 0ms  |  ASYNC SQL: HIKARICP  |  FLIX STUDIOS ENGINE'
        : activePipeline.id === 'mods'
        ? 'PACKET SYNC: BIDIRECTIONAL  |  RENDER: 60 FPS HUD  |  COMPAT: FABRIC & FORGE  |  FLIX STUDIOS ENGINE'
        : 'TOPOLOGY: VELOCITY PROXY  |  JVM: AIKAR GC FLAGS  |  SECURITY: LUCKPERMS 5-TIER  |  FLIX STUDIOS ENGINE';

    ctx.fillText(metricsText, cx, footerY + 5);
    ctx.restore();
  },
};
