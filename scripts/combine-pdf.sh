#!/bin/bash
# combine-pdf.sh <out.pdf> <png1> <png2> ...  — stacks PNGs into a single-page PDF (no print scaling)
OUT="$1"; shift
[ -z "$1" ] && { echo "usage: combine-pdf.sh out.pdf png1 png2 ..."; exit 1; }
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMPD="$(mktemp -d)"; HTML="$TMPD/c.html"
{ echo '<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0}body{background:#fff}.s{display:flex;flex-direction:column;align-items:center;gap:24px;padding:40px 0;width:1360px}.s img{display:block;max-width:1280px}</style></head><body><div class="s">'
  for p in "$@"; do echo "<img src=\"file://$(cd "$(dirname "$p")"&&pwd)/$(basename "$p")\">"; done
  echo '</div></body></html>'; } > "$HTML"
# measure then full-height screenshot at scale 1, then sips->pdf
Hh=$(python3 -c "print(1)")
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1360,8000 --screenshot="$TMPD/full.png" "$HTML" 2>/dev/null
sips -s format pdf "$TMPD/full.png" --out "$OUT" >/dev/null 2>&1
echo "wrote $OUT"; rm -rf "$TMPD"
