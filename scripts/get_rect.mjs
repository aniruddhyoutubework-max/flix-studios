import { spawn } from 'child_process';

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_rect_test2";

const chrome = spawn(chromeExe, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--remote-debugging-port=9225",
  `--user-data-dir=${tempDir}`,
  "--window-size=390,844",
  "http://localhost:5173/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://localhost:9225/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5173')) || tabs[0];
    
    if (tab && tab.webSocketDebuggerUrl) {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: "Runtime.evaluate",
          params: {
            expression: `(() => {
              const btn = document.querySelector('button[aria-label="Open mobile menu"]');
              const header = document.querySelector('header');
              const logo = document.querySelector('header a');
              return JSON.stringify({
                windowWidth: window.innerWidth,
                headerWidth: header ? header.getBoundingClientRect().width : null,
                btnRect: btn ? btn.getBoundingClientRect() : null,
                btnComputedDisplay: btn ? getComputedStyle(btn).display : null,
                logoRect: logo ? logo.getBoundingClientRect() : null
              });
            })()`,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          console.log('RESULT:', msg.result.result.value);
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
