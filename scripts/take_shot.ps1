$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "chrome_test_prof")
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
}

$chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$desktopOut = "c:\Users\Har Har Mahadev JI\3D Objects\flix website\verified_desktop.png"
$mobileOut = "c:\Users\Har Har Mahadev JI\3D Objects\flix website\verified_mobile.png"

Write-Host "Running Chrome headless with profile $tempDir"

# Desktop
$argsDesktop = @(
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--user-data-dir=$tempDir",
    "--screenshot=$desktopOut",
    "--window-size=1920,1080",
    "http://localhost:5173/"
)
$p1 = Start-Process -FilePath $chromeExe -ArgumentList $argsDesktop -PassThru -Wait
Write-Host "Chrome desktop exit code: $($p1.ExitCode)"

# Mobile
$argsMobile = @(
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--user-data-dir=$tempDir",
    "--screenshot=$mobileOut",
    "--window-size=390,844",
    "http://localhost:5173/"
)
$p2 = Start-Process -FilePath $chromeExe -ArgumentList $argsMobile -PassThru -Wait
Write-Host "Chrome mobile exit code: $($p2.ExitCode)"

Start-Sleep -Seconds 2

if (Test-Path $desktopOut) {
    Write-Host "SUCCESS: Desktop screenshot saved at $desktopOut (Size: $((Get-Item $desktopOut).Length) bytes)"
}
if (Test-Path $mobileOut) {
    Write-Host "SUCCESS: Mobile screenshot saved at $mobileOut (Size: $((Get-Item $mobileOut).Length) bytes)"
}
