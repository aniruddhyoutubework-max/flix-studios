import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_qa_all_" + Date.now();
const port = 9325;

console.log('Launching headless Chrome on port', port);
const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${tempDir}`,
  "about:blank"
]);

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  await wait(1800);
  try {
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs[0];
    if (!tab || !tab.webSocketDebuggerUrl) {
      throw new Error('No debugger WebSocket found');
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
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

    await new Promise(r => { ws.onopen = r; });
    console.log('Connected to Chrome DevTools Protocol');

    await send("Page.enable");
    await send("Runtime.enable");

    // 1. Homepage Desktop
    console.log('Capturing: Homepage (Desktop)...');
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: "http://localhost:5173/" });
    await wait(3000); // Allow intro to dismiss or finish

    // Dismiss intro if present
    await send("Runtime.evaluate", {
      expression: `
        const btn = document.querySelector('button');
        const intro = document.querySelector('.fixed.inset-0.z-50');
        if (intro) intro.style.display = 'none';
      `
    });
    await wait(1000);

    let shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync('qa_homepage_desktop.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved qa_homepage_desktop.png');

    // Scroll to KineticBreak Marquee
    await send("Runtime.evaluate", {
      expression: `
        const marquee = document.querySelector('section[aria-hidden="true"]');
        if (marquee) marquee.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await wait(800);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync('qa_marquee_section.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved qa_marquee_section.png');

    // 2. Products Page
    console.log('Capturing: Products Page (/products)...');
    await send("Page.navigate", { url: "http://localhost:5173/products" });
    await wait(2000);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync('qa_products_page.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved qa_products_page.png');

    // 3. Product Detail Page
    console.log('Capturing: Product Detail Page (/products/flixcore-plugin)...');
    await send("Page.navigate", { url: "http://localhost:5173/products/flixcore-plugin" });
    await wait(2200);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync('qa_product_detail.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved qa_product_detail.png');

    // 4. Mobile Viewport
    console.log('Capturing: Homepage (Mobile 390x844)...');
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send("Page.navigate", { url: "http://localhost:5173/" });
    await wait(2500);
    await send("Runtime.evaluate", {
      expression: `
        const intro = document.querySelector('.fixed.inset-0.z-50');
        if (intro) intro.style.display = 'none';
        const marquee = document.querySelector('section[aria-hidden="true"]');
        if (marquee) marquee.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await wait(800);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync('qa_mobile_marquee.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved qa_mobile_marquee.png');

    console.log('ALL QA SCREENSHOTS CAPTURED SUCCESSFULLY!');
    ws.close();
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('QA capture error:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
