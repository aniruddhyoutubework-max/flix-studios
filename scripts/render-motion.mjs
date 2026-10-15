/**
 * FLIXCORE STUDIOS - MOTION-AS-CODE HEADLESS RENDER PIPELINE
 * 
 * Renders procedural motion scenes frame-by-frame via Headless Chrome & Canvas 2D
 * Encodes cinematic MP4 / WebM clips and poster stills using FFmpeg
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import esbuild from 'esbuild';
import ffmpegPkg from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'motion');
const tempDir = path.join(projectRoot, '.temp_render_frames');
const ffmpegPath = ffmpegPkg.path;

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
if (!fs.existsSync(chromeExe)) {
  console.error(`[ERROR] Chrome executable not found at: ${chromeExe}`);
  process.exit(1);
}

if (!fs.existsSync(ffmpegPath)) {
  console.error(`[ERROR] FFmpeg executable not found at: ${ffmpegPath}`);
  process.exit(1);
}

// Clean and create target directories
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

console.log('====================================================');
console.log('🎬 FLIX STUDIOS — MOTION-AS-CODE RENDER PIPELINE');
console.log('====================================================');
console.log(`[Output Directory]: ${outputDir}`);
console.log(`[FFmpeg Binary]:   ${ffmpegPath}`);
console.log(`[Chrome Binary]:   ${chromeExe}`);

// Define Motion-as-Code Scene specifications
const sceneConfigs = [
  {
    id: 'hero-accelerator',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'HeroScene.ts'),
    globalVar: 'HeroSceneBundle',
    exportName: 'HeroScene',
  },
  {
    id: 'flixcore-architecture',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCoreArchitectureScene.ts'),
    globalVar: 'ArchSceneBundle',
    exportName: 'FlixCoreArchitectureScene',
  },
  {
    id: 'process-radar',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'ProcessRadarScene.ts'),
    globalVar: 'RadarSceneBundle',
    exportName: 'ProcessRadarScene',
  },
  {
    id: 'services-orchestration',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'ServicesMotionScene.ts'),
    globalVar: 'ServicesSceneBundle',
    exportName: 'ServicesMotionScene',
  },
  {
    id: 'product-catalogue',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'ProductCatalogueScene.ts'),
    globalVar: 'CatalogueSceneBundle',
    exportName: 'ProductCatalogueScene',
  },
  {
    id: 'product-cinematic',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'ProductCinematicScene.ts'),
    globalVar: 'ProductCinematicBundle',
    exportName: 'ProductCinematicScene',
  },
  {
    id: 'flixcore-intro',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCoreIntroScene.ts'),
    globalVar: 'FlixCoreIntroBundle',
    exportName: 'FlixCoreIntroScene',
  },
  {
    id: 'flixcore-features',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCoreFeatureStoryScene.ts'),
    globalVar: 'FlixCoreFeaturesBundle',
    exportName: 'FlixCoreFeatureStoryScene',
  },
  {
    id: 'flixcore-gallery',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCoreGalleryMotionScene.ts'),
    globalVar: 'FlixCoreGalleryBundle',
    exportName: 'FlixCoreGalleryMotionScene',
  },
  {
    id: 'flixcore-compat',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCoreCompatibilityScene.ts'),
    globalVar: 'FlixCoreCompatBundle',
    exportName: 'FlixCoreCompatibilityScene',
  },
  {
    id: 'flixcore-purchase',
    entry: path.join(projectRoot, 'src', 'motion', 'scenes', 'FlixCorePurchaseFinaleScene.ts'),
    globalVar: 'FlixCorePurchaseBundle',
    exportName: 'FlixCorePurchaseFinaleScene',
  },
];

// Allow target scene filtering via --scene=<id> CLI flag
const sceneArg = process.argv.find((arg) => arg.startsWith('--scene='));
const targetSceneId = sceneArg ? sceneArg.split('=')[1] : null;
const activeConfigs = targetSceneId ? sceneConfigs.filter((c) => c.id === targetSceneId) : sceneConfigs;

if (activeConfigs.length === 0) {
  console.error(`[ERROR] No scenes matched filter: ${targetSceneId}`);
  process.exit(1);
}

// Step 1: Bundle scenes with esbuild
console.log(`\n[1/4] Compiling Motion-as-Code Scenes (${activeConfigs.length} scene(s))...`);
const bundledScripts = activeConfigs.map((cfg) => {
  console.log(`  ⚡ Compiling ${cfg.id}...`);
  const buildResult = esbuild.buildSync({
    entryPoints: [cfg.entry],
    bundle: true,
    format: 'iife',
    globalName: cfg.globalVar,
    write: false,
    target: 'es2022',
  });
  return {
    id: cfg.id,
    code: buildResult.outputFiles[0].text,
    accessor: `${cfg.globalVar}.${cfg.exportName}`,
  };
});

// Step 2: Create local HTTP harness server
console.log('\n[2/4] Initializing Frame Capture Server...');
const PORT = 9488;
const renderedResults = [];

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (req.method === 'GET' && reqUrl.pathname === '/') {
    // Generate render harness HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Motion-as-Code Render Harness</title>
  <style>
    body { background: #000; color: #fff; font-family: monospace; padding: 20px; }
    canvas { display: block; image-rendering: pixelated; }
  </style>
</head>
<body>
  <h2>Flix Studios Motion Render Harness Active</h2>
  <div id="status">Compiling frames...</div>
  <canvas id="c" width="1280" height="720"></canvas>

  ${bundledScripts.map((b) => `<script>${b.code}</script>`).join('\n')}

  <script>
    async function run() {
      const statusEl = document.getElementById('status');
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');

      const sceneList = [
        ${bundledScripts.map((b) => `{ id: '${b.id}', scene: ${b.accessor} }`).join(',\n')}
      ];

      for (const item of sceneList) {
        const { id, scene } = item;
        const total = scene.durationInFrames;
        statusEl.textContent = 'Rendering ' + id + ' (0/' + total + ')...';
        console.log('[Browser] Starting scene:', id, total, 'frames');

        for (let f = 0; f < total; f++) {
          scene.render({
            ctx,
            width: canvas.width,
            height: canvas.height,
            frame: f,
            totalFrames: total,
            time: f / scene.fps,
            progress: f / total,
            fps: scene.fps,
          });

          // Extract PNG blob
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          await fetch('/frame?scene=' + id + '&frame=' + f, {
            method: 'POST',
            body: blob,
          });

          if (f % 30 === 0 || f === total - 1) {
            statusEl.textContent = 'Rendering ' + id + ' (' + (f + 1) + '/' + total + ')...';
          }
        }

        await fetch('/scene-done?scene=' + id, { method: 'POST' });
      }

      statusEl.textContent = 'All scenes rendered!';
      await fetch('/all-done', { method: 'POST' });
    }

    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(run, 100);
    });
  </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/frame') {
    const sceneId = reqUrl.searchParams.get('scene');
    const frameIndex = parseInt(reqUrl.searchParams.get('frame') || '0', 10);
    const sceneDir = path.join(tempDir, sceneId);

    if (!fs.existsSync(sceneDir)) {
      fs.mkdirSync(sceneDir, { recursive: true });
    }

    const paddedIndex = String(frameIndex).padStart(4, '0');
    const framePath = path.join(sceneDir, `frame_${paddedIndex}.png`);
    const fileStream = fs.createWriteStream(framePath);

    req.pipe(fileStream);
    fileStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/scene-done') {
    const sceneId = reqUrl.searchParams.get('scene');
    console.log(`\n[3/4] 🎞️ Encoding Motion Assets for: ${sceneId}...`);

    const sceneDir = path.join(tempDir, sceneId);
    const mp4Out = path.join(outputDir, `${sceneId}.mp4`);
    const webmOut = path.join(outputDir, `${sceneId}.webm`);
    const posterOut = path.join(outputDir, `${sceneId}-poster.png`);

    try {
      // 1. Copy poster frame (frame 0000 or 0030)
      const posterSrc = fs.existsSync(path.join(sceneDir, 'frame_0030.png'))
        ? path.join(sceneDir, 'frame_0030.png')
        : path.join(sceneDir, 'frame_0000.png');

      fs.copyFileSync(posterSrc, posterOut);
      const posterSize = fs.statSync(posterOut).size;
      console.log(`  📸 Poster Stills: ${path.basename(posterOut)} (${(posterSize / 1024).toFixed(1)} KB)`);

      // 2. FFmpeg MP4 Encode (H.264 / YUV420P / faststart)
      const inputPattern = path.join(sceneDir, 'frame_%04d.png');
      const mp4Cmd = `"${ffmpegPath}" -y -framerate 30 -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -crf 18 -preset fast "${mp4Out}"`;
      execSync(mp4Cmd, { stdio: 'pipe' });
      const mp4Size = fs.statSync(mp4Out).size;
      console.log(`  🎥 MP4 Video:    ${path.basename(mp4Out)} (${(mp4Size / 1024).toFixed(1)} KB)`);

      // 3. FFmpeg WebM Encode (VP9)
      const webmCmd = `"${ffmpegPath}" -y -i "${mp4Out}" -c:v libvpx-vp9 -b:v 1.2M -crf 30 "${webmOut}"`;
      execSync(webmCmd, { stdio: 'pipe' });
      const webmSize = fs.statSync(webmOut).size;
      console.log(`  🌐 WebM Video:   ${path.basename(webmOut)} (${(webmSize / 1024).toFixed(1)} KB)`);

      renderedResults.push({
        id: sceneId,
        mp4: `/motion/${sceneId}.mp4`,
        webm: `/motion/${sceneId}.webm`,
        poster: `/motion/${sceneId}-poster.png`,
        mp4Size,
        webmSize,
        posterSize,
        frames: 180,
        fps: 30,
        duration: '6.0s',
      });
    } catch (encodeErr) {
      console.error(`[ERROR] FFmpeg encoding failed for ${sceneId}:`, encodeErr.message);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/all-done') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));

    // Write or merge final manifest
    const manifestPath = path.join(outputDir, 'motion-manifest.json');
    let existingScenes = [];
    if (fs.existsSync(manifestPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (Array.isArray(parsed.scenes)) {
          existingScenes = parsed.scenes;
        }
      } catch (_) {}
    }
    const mergedScenesMap = new Map();
    existingScenes.forEach((s) => mergedScenesMap.set(s.id, s));
    renderedResults.forEach((s) => mergedScenesMap.set(s.id, s));

    const manifest = {
      engine: 'Flix Studios Motion-as-Code Engine v1.0',
      renderedAt: new Date().toISOString(),
      scenes: Array.from(mergedScenesMap.values()),
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('\n[4/4] 📦 Motion Pipeline Complete!');
    console.log(`✅ Manifest saved: public/motion/motion-manifest.json`);

    // Clean up temp frames
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}

    server.close(() => {
      if (chromeProcess) {
        chromeProcess.kill();
      }
      console.log('🏁 Render pipeline finished successfully.\n');
      process.exit(0);
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

let chromeProcess = null;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`  🚀 Harness running at http://127.0.0.1:${PORT}/`);
  console.log('  🌐 Spawning Headless Chrome for frame-accurate rasterization...');

  chromeProcess = spawn(chromeExe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    `http://127.0.0.1:${PORT}/`,
  ]);

  chromeProcess.on('error', (err) => {
    console.error('[ERROR] Failed to start Chrome:', err);
    server.close();
    process.exit(1);
  });
});
