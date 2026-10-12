#!/bin/bash
# render.sh <file.html> <width> <height> <out.png>  — headless Chrome @2x
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
F="$1"; W="$2"; H="$3"; OUT="$4"
[ -z "$OUT" ] && { echo "usage: render.sh file.html W H out.png"; exit 1; }
mkdir -p "$(dirname "$OUT")"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size="$W","$H" --screenshot="$OUT" "$F" 2>/dev/null
sips -g pixelWidth -g pixelHeight "$OUT" 2>/dev/null | grep pixel
