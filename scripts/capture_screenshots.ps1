$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Google\Chrome\Application\chrome.exe"
)

$browserPath = $null
foreach ($path in $edgePaths) {
    if (Test-Path $path) {
        $browserPath = $path
        break
    }
}

if ($browserPath) {
    Write-Host "Found browser: $browserPath"
    # Wait 2 seconds for opening animation to transition to hero
    Start-Sleep -Seconds 2
    
    $desktopOut = "$PSScriptRoot\..\screenshot_desktop.png"
    $mobileOut = "$PSScriptRoot\..\screenshot_mobile.png"

    # Capture Desktop
    & $browserPath --headless --disable-gpu --screenshot="$desktopOut" --window-size=1920,1080 "http://localhost:5173/"
    Write-Host "Desktop screenshot captured at $desktopOut"

    # Capture Mobile
    & $browserPath --headless --disable-gpu --screenshot="$mobileOut" --window-size=390,844 "http://localhost:5173/"
    Write-Host "Mobile screenshot captured at $mobileOut"
} else {
    Write-Host "No standard browser found."
}
