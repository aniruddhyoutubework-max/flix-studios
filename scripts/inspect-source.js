const fs = require('fs');
const cp = require('child_process');

try {
  const psCmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::OpenRead('C:\\Users\\Har Har Mahadev JI\\Downloads\\FlixCore-Source.zip').Entries | ForEach-Object { $_.FullName }"`;
  const result = cp.execSync(psCmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
  const lines = result.split(/\r?\n/).filter(Boolean);
  const configs = lines.filter(l => l.endsWith('.yml') || l.endsWith('.json') || l.endsWith('.properties') || l.toLowerCase().includes('plugin'));
  console.log('Configs/metadata found:');
  console.log(configs.slice(0, 40).join('\n'));
} catch (e) {
  console.error('Error:', e.message);
}
