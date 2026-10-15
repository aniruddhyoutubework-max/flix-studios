import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_audit_profile_" + Date.now();

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--remote-debugging-port=9230",
  `--user-data-dir=${tempDir}`,
  "--window-size=1920,1080",
  "http://localhost:5173/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9230/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);

      const send = (method, params = {}) => {
        return new Promise((resolve) => {
          const id = Math.floor(Math.random() * 1000000);
          const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.id === id) {
              ws.removeEventListener('message', handler);
              resolve(data.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id, method, params }));
        });
      };

      ws.onopen = async () => {
        console.log('Connected to Chrome DevTools Protocol');
        
        // Wait 3.5s for opening sequence to complete and Three.js canvas to render
        await new Promise(r => setTimeout(r, 3500));

        // 1. Capture Hero
        const heroShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('audit_minecraft_hero.png', Buffer.from(heroShot.data, 'base64'));
        console.log('Saved audit_minecraft_hero.png');

        // 2. Scroll to Products
        await send('Runtime.evaluate', { expression: "document.getElementById('products')?.scrollIntoView();" });
        await new Promise(r => setTimeout(r, 1200));
        const prodShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('audit_minecraft_product.png', Buffer.from(prodShot.data, 'base64'));
        console.log('Saved audit_minecraft_product.png');

        // 3. Scroll to Process
        await send('Runtime.evaluate', { expression: "document.getElementById('process')?.scrollIntoView();" });
        await new Promise(r => setTimeout(r, 1200));
        const procShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('audit_minecraft_process.png', Buffer.from(procShot.data, 'base64'));
        console.log('Saved audit_minecraft_process.png');

        // 4. Mobile Device Metrics
        await send('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true
        });
        await send('Runtime.evaluate', { expression: "window.scrollTo(0, 0);" });
        await new Promise(r => setTimeout(r, 1500));
        const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('audit_minecraft_mobile.png', Buffer.from(mobileShot.data, 'base64'));
        console.log('Saved audit_minecraft_mobile.png');

        ws.close();
        chrome.kill();
        process.exit(0);
      };
    }
  } catch (err) {
    console.error('Audit capture failed:', err);
    chrome.kill();
    process.exit(1);
  }
}, 3000);
