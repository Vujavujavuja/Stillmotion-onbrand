# Pipeline reference — exact commands

No Playwright / ImageMagick needed. Uses headless Chrome + macOS `sips`.

## Render HTML → PNG @2×
```
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=<W>,<H> --screenshot=out.png file.html
```
`scripts/render.sh file.html <W> <H> out.png` wraps this.

## Measure real content height (fit the artboard)
Inject a tiny script that writes `element.offsetHeight` into `document.title`, dump the DOM, read it:
```
--virtual-time-budget=1500 --dump-dom   # then grep the title for the height
```
`scripts/measure.sh file.html '.selector' <W>` wraps this. Then set `body height` and re-render.

## Stacked PNGs → single-page PDF (no print scaling)
Screenshot a `combine.html` (images stacked in a flex column) at scale 1, then:
```
sips -s format pdf combined.png --out carousel.pdf
```
`scripts/combine-pdf.sh` wraps this. (Avoids Chrome print-to-pdf clipping.)

## Other sips helpers
- Downscale for review: `sips -s format jpeg -Z 1000 big.png --out small.jpg`
- Crop a detail: `sips -c <h> <w> --cropOffset <y> <x> in.png --out crop.png`
- Rasterize a PDF page: `sips -s format png file.pdf --out page.png`

## Fonts
Brand fonts must be installed in `~/Library/Fonts` and named in `--font-brand` (`system/tokens.css`).
If a font is missing, install the TTF before rendering — never silently fall back.
