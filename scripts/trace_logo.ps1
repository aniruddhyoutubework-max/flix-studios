Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\public\flixcore-logo.png")
$w = $bmp.Width
$h = $bmp.Height

# Threshold black pixels (brightness < 0.5)
$grid = New-Object 'int[,]' $h, $w
for ($y = 0; $y - $h; $y++) {
    for ($x = 0; $x - $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # dark pixels have low R, G, B
        if ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) {
            $grid[$y, $x] = 1
        } else {
            $grid[$y, $x] = 0
        }
    }
}

# Print ascii map sampled every 3 pixels
$sb = [System.Text.StringBuilder]::new()
for ($y = 0; $y -lt $h; $y += 3) {
    for ($x = 0; $x -lt $w; $x += 3) {
        if ($grid[$y, $x] -eq 1) {
            [void]$sb.Append('#')
        } else {
            [void]$sb.Append(' ')
        }
    }
    [void]$sb.AppendLine()
}
[System.IO.File]::WriteAllText("$PSScriptRoot\logo_ascii.txt", $sb.ToString())
$bmp.Dispose()
Write-Host "Logo ASCII map written to logo_ascii.txt"
