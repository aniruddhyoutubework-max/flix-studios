import { spawn } from 'child_process';
import fs from 'fs';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_scroll_audit";

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--remote-debugging-port=9230",
  `--user-data-dir=${tempDir}`,
  "http://localhost:5173/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9230/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      let step = 0;

      const send = (method, params = {}) => {
        step++;
        ws.send(JSON.stringify({ id: step, method, params }));
      };

      ws.onopen = () => {
        // Desktop window size first
        send("Emulation.setDeviceMetricsOverride", {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          mobile: false
        });
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        
        if (msg.id === 1) {
          // Scroll to work section and capture
          setTimeout(() => {
            send("Runtime.evaluate", {
              expression: "document.getElementById('work').scrollIntoView({ behavior: 'instant' });"
            });
          }, 1500);
        } else if (msg.id === 2) {
          setTimeout(() => {
            send("Page.captureScreenshot", { format: "png" });
          }, 500);
        } else if (msg.id === 3) {
          fs.writeFileSync('audit_desktop_work.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved audit_desktop_work.png');
          
          // Scroll to capabilities & studio
          send("Runtime.evaluate", {
            expression: "document.getElementById('capabilities').scrollIntoView({ behavior: 'instant' });"
          });
        } else if (msg.id === 4) {
          setTimeout(() => {
            send("Page.captureScreenshot", { format: "png" });
          }, 500);
        } else if (msg.id === 5) {
          fs.writeFileSync('audit_desktop_capabilities.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved audit_desktop_capabilities.png');

          // Scroll to contact finale & footer
          send("Runtime.evaluate", {
            expression: "document.getElementById('contact').scrollIntoView({ behavior: 'instant' });"
          });
        } else if (msg.id === 6) {
          setTimeout(() => {
            send("Page.captureScreenshot", { format: "png" });
          }, 500);
        } else if (msg.id === 7) {
          fs.writeFileSync('audit_desktop_contact.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved audit_desktop_contact.png');
          ws.close();
          chrome.kill();
        }
      };
    }
  } catch (err) {
    console.error('Audit Error:', err);
    chrome.kill();
  }
}, 3000);
