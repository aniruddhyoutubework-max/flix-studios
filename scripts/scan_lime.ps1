Add-Type -AssemblyName System.Drawing
$imgPath = "$PSScriptRoot\..\chrome_mobile_fixed.png"
$b = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Host "Scanning full image ($($b.Width) x $($b.Height)) for lime #D7FF3F pixels..."

$limeHits = @()
for ($y = 0; $y -lt $b.Height; $y += 2) {
    for ($x = 0; $x -lt $b.Width; $x += 2) {
        $p = $b.GetPixel($x, $y)
        if ($p.G -gt 220 -and $p.R -gt 190 -and $p.B -lt 100) {
            $limeHits += [PSCustomObject]@{ X = $x; Y = $y; Color = "($($p.R),$($p.G),$($p.B))" }
        }
    }
}

Write-Host "Found $($limeHits.Count) lime pixels."
Write-Host "Sample Y-coordinates of lime pixels:"
$limeHits | Group-Object { [Math]::Floor($_.Y / 50) * 50 } | ForEach-Object {
    Write-Host "  Y range $($_.Name) - $($_.Name + 50): $($_.Count) pixels"
}

$b.Dispose()
