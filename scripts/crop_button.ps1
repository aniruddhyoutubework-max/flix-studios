Add-Type -AssemblyName System.Drawing
$srcPath = "$PSScriptRoot\..\chrome_mobile_fixed.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$rect = New-Object System.Drawing.Rectangle(320, 10, 65, 65)
$cropped = $src.Clone($rect, $src.PixelFormat)
$outPath = "$PSScriptRoot\..\cropped_button.png"
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$cropped.Dispose()
Write-Host "Cropped button saved to $outPath"
