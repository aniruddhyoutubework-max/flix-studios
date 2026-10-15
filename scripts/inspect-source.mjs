import cp from 'child_process';

try {
  const psCmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('C:\\Users\\Har Har Mahadev JI\\Downloads\\FlixCore-Source.zip'); foreach ($e in $zip.Entries) { if ($e.Name -eq 'plugin.yml') { Write-Host '--- ' $e.FullName; $reader = New-Object System.IO.StreamReader($e.Open()); Write-Host ($reader.ReadToEnd()); $reader.Close() } }; $zip.Dispose()"`;
  const result = cp.execSync(psCmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
}
