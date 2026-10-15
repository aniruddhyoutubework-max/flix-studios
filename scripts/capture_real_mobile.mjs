import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_real_mobile";

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--remote-debugging-port=9228",
  `--user-data-dir=${tempDir}`,
  "http://localhost:5173/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9228/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        // Set Mobile Device Metrics
        ws.send(JSON.stringify({
          id: 1,
          method: "Emulation.setDeviceMetricsOverride",
          params: {
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            mobile: true
          }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          // Wait 2 seconds for layout
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: "Page.captureScreenshot",
              params: { format: "png" }
            }));
          }, 2000);
        } else if (msg.id === 2) {
          const buffer = Buffer.from(msg.result.data, 'base64');
          fs.writeFileSync('real_mobile_screenshot.png', buffer);
          console.log('Saved real_mobile_screenshot.png successfully!');
          ws.close();
          chrome.kill();
        }
      };
    }
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}, 3000);
