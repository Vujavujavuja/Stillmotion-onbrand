#!/bin/bash
# measure.sh <file.html> <css-selector> <width>  — prints natural offsetHeight of selector
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
F="$1"; SEL="$2"; W="${3:-1080}"
TMP="$(mktemp -t meas).html"
python3 - "$F" "$SEL" "$TMP" <<'PY'
import sys
f,sel,tmp=sys.argv[1:4]
s=open(f).read()
inj='<script>window.addEventListener("load",()=>{var e=document.querySelector("%s");document.title="H="+(e?e.offsetHeight:0);});</script>'%sel
open(tmp,"w").write(s.replace("</body>",inj+"</body>"))
PY
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size="$W",1400 \
  --virtual-time-budget=1500 --dump-dom "$TMP" 2>/dev/null | grep -o 'H=[0-9]*' | head -1
rm -f "$TMP"
