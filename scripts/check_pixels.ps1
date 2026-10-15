Add-Type -AssemblyName System.Drawing
$imgPath = "$PSScriptRoot\..\chrome_mobile.png"
$b = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Host "Mobile image size: $($b.Width) x $($b.Height)"

$brightCount = 0
for ($y = 0; $y -lt 100; $y++) {
    for ($x = 200; $x -lt $b.Width; $x++) {
        $p = $b.GetPixel($x, $y)
        if ($p.R -gt 50 -or $p.G -gt 50 -or $p.B -gt 50) {
            Write-Host "Bright pixel at ($x, $y) -> R:$($p.R) G:$($p.G) B:$($p.B)"
            $brightCount++
            if ($brightCount -ge 5) { break }
        }
    }
    if ($brightCount -ge 5) { break }
}
if ($brightCount -eq 0) {
    Write-Host "Top-right region (x: 200-412, y: 0-100) is 100% black."
}
$b.Dispose()
