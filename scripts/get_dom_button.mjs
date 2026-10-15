import { execSync } from 'child_process';
import http from 'http';

// Launch Chrome with remote debugging
const chromeExe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = process.env.TEMP + "\\chrome_pos_test";

const proc = execSync(
  `"${chromeExe}" --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9222 --user-data-dir="${tempDir}" --window-size=390,844 http://localhost:5173/`,
  { timeout: 4000, killSignal: 'SIGKILL' }
);
