@echo off
echo Capturing mobile with force-device-scale-factor=1...
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --no-sandbox --disable-gpu --force-device-scale-factor=1 --virtual-time-budget=3000 --screenshot="c:\Users\Har Har Mahadev JI\3D Objects\flix website\chrome_mobile_fixed.png" --window-size=390,844 http://localhost:5173/

echo Done.
