import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_qa_marquee_" + Date.now();
const port = 9330;

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${tempDir}`,
  "http://localhost:5173/"
]);

async function getTabs(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      if (res.ok) return await res.json();
    } catch {
      await new Promise(r => setTimeout(r, 600));
    }
  }
  throw new Error('Could not connect to Chrome debugging port');
}

(async () => {
  try {
    const tabs = await getTabs();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: "Emulation.setDeviceMetricsOverride",
          params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: "Runtime.evaluate",
              params: {
                expression: `
                  const intro = document.querySelector('.fixed.inset-0.z-50');
                  if (intro) intro.style.display = 'none';
                  const sec = document.querySelector('section[aria-hidden="true"]');
                  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
                `
              }
            }));
          }, 2500);
        } else if (msg.id === 2) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: "Page.captureScreenshot",
              params: { format: "png" }
            }));
          }, 1200);
        } else if (msg.id === 3) {
          const buffer = Buffer.from(msg.result.data, 'base64');
          fs.writeFileSync('qa_hero_marquee.png', buffer);
          console.log('Saved qa_hero_marquee.png successfully!');
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    }
  } catch (err) {
    console.error('Error during marquee capture:', err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
