$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempDir = Join-Path $env:TEMP "chrome_eval_prof"
if (-not (Test-Path $tempDir)) { New-Item -ItemType Directory -Force -Path $tempDir | Out-Null }

$args = @(
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--user-data-dir=$tempDir",
    "--window-size=412,915",
    "http://localhost:5173/"
)

$p = Start-Process -FilePath $chrome -ArgumentList $args -PassThru
Start-Sleep -Seconds 3

try {
    $pages = Invoke-RestMethod -Uri "http://localhost:9222/json"
    $page = $pages[0]
    Write-Host "Page title: $($page.title), url: $($page.url)"
} catch {
    Write-Host "CDP Error: $_"
}

if ($p -and -not $p.HasExited) {
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
