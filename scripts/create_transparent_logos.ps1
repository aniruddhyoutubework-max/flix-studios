Add-Type -AssemblyName System.Drawing

$sourcePath = "$PSScriptRoot\..\public\flixcore-logo-original.png"
$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$w = $bmp.Width
$h = $bmp.Height

# Create transparent black version and transparent white version
$bmpDark = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpWhite = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        $brightness = ($pixel.R * 0.299 + $pixel.G * 0.587 + $pixel.B * 0.114)
        
        # Calculate alpha based on inverted brightness
        # White background (brightness ~ 240-255) -> Alpha 0
        # Dark stroke (brightness ~ 20-50) -> Alpha 255
        $alpha = 0
        if ($brightness -lt 230) {
            $ratio = (230 - $brightness) / 180.0
            if ($ratio -gt 1.0) { $ratio = 1.0 }
            if ($ratio -lt 0.0) { $ratio = 0.0 }
            $alpha = [int]($ratio * 255)
        }
        
        if ($alpha -gt 0) {
            $bmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 17, 18, 22))
            $bmpWhite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 244, 243, 238))
        } else {
            $bmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $bmpWhite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$bmpDark.Save("$PSScriptRoot\..\public\flixcore-logo-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpWhite.Save("$PSScriptRoot\..\public\flixcore-logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$bmpDark.Dispose()
$bmpWhite.Dispose()

Write-Host "Generated flixcore-logo-dark.png and flixcore-logo-white.png successfully."
