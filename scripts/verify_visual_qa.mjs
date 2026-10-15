import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_qa_" + Date.now();
const port = 9314;

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${tempDir}`,
  "http://localhost:5173/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: "Emulation.setDeviceMetricsOverride",
          params: { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          // Wait 2.5s for opening sequence to complete and elements to mount
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: "Runtime.evaluate",
              params: {
                expression: `
                  const el = document.getElementById('process');
                  if (el) {
                    el.scrollIntoView({ behavior: 'instant', block: 'start' });
                  }
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
          }, 1500);
        } else if (msg.id === 3) {
          const buffer = Buffer.from(msg.result.data, 'base64');
          fs.writeFileSync('qa_process_section.png', buffer);
          console.log('Saved qa_process_section.png successfully!');
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    }
  } catch (err) {
    console.error('Error during QA capture:', err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
