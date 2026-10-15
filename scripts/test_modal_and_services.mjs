import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = path.join(process.env.TEMP, `chrome_test_${Date.now()}`);
const port = 9388;

console.log('Testing Services Section & Hire Us Modal...');

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
  await wait(2500);

  // 2. Launch headless Chrome
  chromeProcess = spawn(chromeExe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    'http://localhost:4173/',
  ]);

  await wait(2000);

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

  await wait(1500);

  // Dismiss intro if present
  await send('Runtime.evaluate', {
    expression: `
      const intro = document.querySelector('.fixed.inset-0.z-50');
      if (intro) intro.style.display = 'none';
    `,
  });

  await wait(1000);

  // 1. Inspect Services Section
  console.log('Inspecting Services section in DOM...');
  const servicesCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const section = document.getElementById('services');
        if (!section) return { error: 'No #services element found' };
        
        const heading = section.querySelector('h2')?.innerText;
        const disciplineButtons = Array.from(section.querySelectorAll('button')).filter(b => 
          b.innerText.includes('Custom') || b.innerText.includes('Server Setup')
        ).map(b => b.innerText.split('\\n')[0]);

        const stages = Array.from(section.querySelectorAll('button')).filter(b => 
          b.innerText.includes('STAGE')
        ).map(b => b.innerText.split('\\n')[0]);

        const hireButtons = Array.from(section.querySelectorAll('button')).filter(b => 
          b.innerText.toLowerCase().includes('hire us') || b.innerText.toLowerCase().includes('commission')
        ).map(b => b.innerText.trim());

        return {
          heading,
          disciplineButtons,
          stageCount: stages.length,
          stages,
          hireButtonsCount: hireButtons.length,
          hireButtons: hireButtons.slice(0, 3)
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Services Section Check Result:', JSON.stringify(servicesCheck.result.value, null, 2));

  // 2. Test Hire Us Modal Trigger from Service 02 (Mod Dev)
  console.log('Testing opening Hire Us modal with Mod Dev discipline...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hireModBtn = Array.from(document.querySelectorAll('button')).find(b => 
          b.innerText.includes('Hire Us for CLIENT') || b.innerText.includes('Hire Us for Custom Minecraft Mod') || b.innerText.includes('Hire Us for CLIENT & SERVER')
        );
        if (hireModBtn) hireModBtn.click();
        else {
          // Click direct action in card
          const cards = document.querySelectorAll('#services .rounded-3xl');
          if (cards[1]) {
            const btn = cards[1].querySelector('button');
            if (btn) btn.click();
          }
        }
      })()
    `,
  });

  await wait(1200);

  // Check Modal State
  const modalCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modal = document.querySelector('[role="dialog"]');
        if (!modal) return { open: false };

        const title = modal.querySelector('h2')?.innerText;
        const brandBadge = modal.querySelector('span')?.innerText;
        const categoryCards = Array.from(modal.querySelectorAll('button')).filter(b =>
          b.innerText.includes('Plugin Dev') || b.innerText.includes('Mod Dev') || b.innerText.includes('Server Setup')
        ).map(b => b.innerText.split('\\n')[0]);

        const inputs = Array.from(modal.querySelectorAll('input, textarea')).map(i => ({
          placeholder: i.placeholder,
          value: i.value,
          required: i.required
        }));

        const submitBtn = Array.from(modal.querySelectorAll('button')).find(b =>
          b.innerText.includes('Brief') || b.innerText.includes('Dispatch') || b.innerText.includes('Continue')
        )?.innerText;

        return {
          open: true,
          title,
          brandBadge,
          categoryCards,
          inputsCount: inputs.length,
          inputsEmptyInitially: inputs.filter(i => i.placeholder !== 'HIRE US').every(i => i.value === ''),
          inputsSample: inputs.slice(0, 4),
          submitBtn
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Hire Us Modal Check Result:', JSON.stringify(modalCheck.result.value, null, 2));

  // Close modal via Escape
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await wait(600);

  const closedCheck = await send('Runtime.evaluate', {
    expression: `!document.querySelector('[role="dialog"]')`,
    returnByValue: true,
  });
  console.log('Modal closes on Escape:', closedCheck.result.value);

  // Clean up
  ws.close();
  if (chromeProcess) chromeProcess.kill();
  if (preview) preview.kill();
  console.log('Verification finished successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  if (chromeProcess) chromeProcess.kill();
  if (preview) preview.kill();
  process.exit(1);
});
