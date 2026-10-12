#!/bin/bash
# figma-export.sh <NODE_ID> [format] [scale] [out]  — export a Figma node via REST.
# Reads FIGMA_PAT / FIGMA_FILE_KEY from .env (never pass the token on the command line or in chat).
# Examples:
#   scripts/figma-export.sh 12:345                    -> 12_345.svg
#   scripts/figma-export.sh 12:678 png 2 badge.png    -> badge.png (2x raster)
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f .env ]; then set -a; . ./.env; set +a; fi
: "${FIGMA_PAT:?Set FIGMA_PAT in .env (copy .env.example to .env and fill it in)}"
KEY="${FIGMA_FILE_KEY:?Set FIGMA_FILE_KEY in .env (the key from your Figma file URL)}"

NODE="${1:?usage: figma-export.sh <NODE_ID> [format=svg] [scale=2] [out]}"
FMT="${2:-svg}"
SCALE="${3:-2}"
OUT="${4:-${NODE//:/_}.$FMT}"

url=$(curl -s -H "X-Figma-Token: $FIGMA_PAT" \
  "https://api.figma.com/v1/images/$KEY?ids=$NODE&format=$FMT&scale=$SCALE" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('images',{}).get('$NODE') or '')")

[ -z "$url" ] && { echo "No image returned for $NODE (empty node, or check FIGMA_PAT / node id)"; exit 1; }
curl -s "$url" -o "$OUT"
echo "saved $OUT"
