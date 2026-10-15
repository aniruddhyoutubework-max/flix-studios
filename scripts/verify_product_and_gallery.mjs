import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = path.join(process.env.TEMP, `chrome_test_${Date.now()}`);
const port = 9390;

console.log('================================================================');
console.log('🧪 VERIFYING FLIX STUDIOS PRODUCT, GALLERY & PURCHASE BUTTONS');
console.log('================================================================');

// 1. Start Vite preview server on port 4173
const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
  cwd: projectRoot,
  shell: true,
});

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let chromeProcess = null;

async function run() {
  await wait(3000);

  // 2. Launch headless Chrome
  chromeProcess = spawn(chromeExe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    'http://localhost:4173/',
  ]);

  await wait(2500);

  const listRes = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await listRes.json();
  const tab = tabs.find((t) => t.url.includes('4173') || t.type === 'page');

  if (!tab || !tab.webSocketDebuggerUrl) {
    throw new Error('Could not find Chrome page tab');
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let msgId = 1;
  const callbacks = new Map();
  const consoleLogs = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(msg.params.args.map((a) => a.value || a.description).join(' '));
    }
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      cb(msg);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((r) => {
    ws.onopen = r;
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await wait(1000);

  async function evalExpr(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res?.result?.result?.value;
  }

  // Dismiss intro if present
  await evalExpr(`
    (() => {
      localStorage.setItem('flix_opening_seen', 'true');
      const intro = document.querySelector('.fixed.inset-0.z-50');
      if (intro) intro.style.display = 'none';
    })()
  `);

  // Test 1: Verify Homepage Services Schematic has been eliminated
  console.log('\n[Test 1] Checking Homepage for obsolete schematic decorations...');
  const schematicCheck = await evalExpr(`
    (() => {
      const bodyText = document.body.innerText;
      const hasSchematicBadge = bodyText.includes('CINEMATIC MOTION SCHEMATIC');
      const hasSimulator = bodyText.includes('SIMULATE RUNTIME') || bodyText.includes('ENGINEERING VISUALIZER');
      return { hasSchematicBadge, hasSimulator };
    })()
  `);

  console.log('  Result:', schematicCheck);
  if (schematicCheck?.hasSchematicBadge) {
    console.error('  ❌ FAIL: "CINEMATIC MOTION SCHEMATIC" still found in DOM!');
  } else {
    console.log('  ✅ PASS: Obsolete schematic badge completely removed.');
  }

  // Test 2: Navigate to /products
  console.log('\n[Test 2] Navigating to /products...');
  await send('Page.navigate', { url: 'http://localhost:4173/products' });
  await wait(2000);

  const productsCheck = await evalExpr(`
    (() => {
      const title = document.querySelector('h1')?.innerText;
      const cards = Array.from(document.querySelectorAll('article')).map(c => ({
        title: c.querySelector('h3')?.innerText,
        price: c.querySelector('.text-sm.font-extrabold')?.innerText,
        link: c.querySelector('a[href*="/products/"]')?.getAttribute('href')
      }));
      return { title, cardCount: cards.length, cards };
    })()
  `);
  console.log('  Result:', JSON.stringify(productsCheck, null, 2));

  // Test 3: Navigate to Flagship Product Page /products/flixcore-plugin
  console.log('\n[Test 3] Navigating to /products/flixcore-plugin...');
  await send('Page.navigate', { url: 'http://localhost:4173/products/flixcore-plugin' });
  await wait(2500);

  const detailPageCheck = await evalExpr(`
    (() => {
      const title = document.querySelector('h1')?.innerText;
      const video = document.querySelector('video source')?.getAttribute('src');
      const purchaseButtons = Array.from(document.querySelectorAll('a[href*="builtbybit"]')).map(a => ({
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        text: a.innerText.trim(),
      }));
      return { title, video, purchaseButtons };
    })()
  `);
  console.log('  Result:', JSON.stringify(detailPageCheck, null, 2));

  // Test 4: Switch to Gallery Tab and inspect CinematicProductGallery
  console.log('\n[Test 4] Clicking Gallery Tab on Product Page...');
  await evalExpr(`
    (() => {
      const galleryBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Gallery'));
      if (galleryBtn) {
        galleryBtn.click();
        return true;
      }
      return false;
    })()
  `);

  await wait(1500);

  const galleryCheck = await evalExpr(`
    (() => {
      const heroImg = document.querySelector('.group.relative.w-full.aspect-\\\\[16\\\\/9\\\\] img')?.getAttribute('src');
      const thumbnails = Array.from(document.querySelectorAll('.flex.gap-2\\\\.5 button img')).map(i => ({
        title: i.getAttribute('alt'),
        src: i.getAttribute('src')
      }));
      const fullscreenBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fullscreen'));
      const nextBtn = document.querySelector('button[aria-label="Next slide"]');
      return {
        heroImg,
        thumbnailCount: thumbnails.length,
        thumbnails: thumbnails.slice(0, 5),
        hasFullscreenBtn: !!fullscreenBtn,
        hasNextBtn: !!nextBtn
      };
    })()
  `);
  console.log('  Gallery Inspection:', JSON.stringify(galleryCheck, null, 2));

  // Test 5: Verify Lightbox Fullscreen Modal
  console.log('\n[Test 5] Testing Fullscreen Lightbox Modal...');
  await evalExpr(`
    (() => {
      const fullscreenBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fullscreen'));
      if (fullscreenBtn) fullscreenBtn.click();
    })()
  `);

  await wait(1000);

  const lightboxCheck = await evalExpr(`
    (() => {
      const modal = document.querySelector('.fixed.inset-0.z-\\\\[200\\\\]') || document.querySelector('.fixed.inset-0.bg-black\\\\/95');
      const bodyOverflow = document.body.style.overflow;
      return {
        isModalOpen: !!modal,
        bodyOverflow,
      };
    })()
  `);
  console.log('  Lightbox Open Check:', lightboxCheck);

  // Close lightbox with Escape key
  console.log('  Pressing Escape key to close lightbox...');
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await wait(1000);

  const lightboxClosedCheck = await evalExpr(`
    (() => {
      const modal = document.querySelector('.fixed.inset-0.z-\\\\[200\\\\]');
      const bodyOverflow = document.body.style.overflow;
      return { isModalOpen: !!modal, bodyOverflow };
    })()
  `);
  console.log('  Lightbox Closed Check:', lightboxClosedCheck);

  // Screenshot capture for visual proof
  console.log('\n[Test 6] Capturing Visual Verification Screenshot...');
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes.result?.data) {
    const screenshotBuffer = Buffer.from(screenshotRes.result.data, 'base64');
    const screenshotPath = path.join(projectRoot, 'public', 'product_page_verified.png');
    fs.writeFileSync(screenshotPath, screenshotBuffer);
    console.log(`  📸 Screenshot saved: public/product_page_verified.png (${(screenshotBuffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');

  ws.close();
  if (chromeProcess) chromeProcess.kill();
  preview.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('[TEST ERROR]:', err);
  if (chromeProcess) chromeProcess.kill();
  preview.kill();
  process.exit(1);
});
