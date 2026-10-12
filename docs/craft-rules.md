# Craft rules — the house quality bar (READ BEFORE ANY VISUAL OR VIDEO)

Hard-won rules from real redlines. They are the difference between on-brand output and "looks bad."
A fresh session has **no memory** of them — so they live here, in the repo. Follow them exactly.

---

## 1. Every visual is built from REAL Figma assets — never from scratch
The look comes from the brand's **actual Figma components**, not your own shapes/CSS approximations.
Before drawing anything:
1. **Search the inventory:** `grep -i "<thing>" system/figma-map.md` (and `system/figma-assets/` if
   you built a full index) → get the node ID.
2. **Export it:** `scripts/figma-export.sh <NODE_ID> svg`  (or `png 2` for raster). Token is read from `.env`.
3. **Use that export.** Do NOT hand-redraw a logo / icon / chart / table you could have exported.
Only invent a sub-element when the brief needs a value the export can't show — match the Figma style
exactly and **flag it** in `NOTES.md`. If Figma access is missing, **STOP and say so** — do not silently
improvise a fake.

## 2. Animation = animate the REAL exported layers. NEVER rebuild. NEVER slide a box over a PNG.
When asked to animate clips/exports into an MP4:
- The finished Figma export is the **source of truth and must not change one bit**.
- **Extract the real layers** from Figma and animate *those* — bars that genuinely `scaleY` from the
  baseline, scan-lines that translate, a band that clips in. Build a clean backdrop "plate" by erasing
  the animated layers to the plot background (per-column fill-from-above under a gradient, so no visible box).
- Do **NOT** recreate the chart/card in HTML from scratch (your own layout/data/fonts). The Figma
  assets are done and not to be changed.
- Do **NOT** animate by sliding a bg-colored cover-box over a flat PNG — it reads as fake, nothing really
  moves.

Extraction recipe (REST, PAT from `.env`; `set -a; . ./.env; set +a`):
```
/v1/files/$FIGMA_FILE_KEY?depth=N              # find frames by name
/v1/files/$FIGMA_FILE_KEY/nodes?ids=…&depth=6  # layer tree + bboxes (coords absolute → subtract frame origin)
/v1/images/$FIGMA_FILE_KEY?ids=…&scale=2       # each node as a TRANSPARENT PNG
```
Composite the real layer PNGs deterministically → one warm headless Chrome @2× → ffmpeg.

## 3. Clean & airy — one idea per frame, never congested
Few elements, large margins, one clear focal idea. Overfilled/congested frames read off-brand and get
rejected. Benchmark against the goldens in `examples/` — match their whitespace.
Strip elements, widen margins, compare side-by-side before presenting.

## 4. Concept visuals read as UI / data mockups (not flat abstract cards)
Show the thing's own anatomy: an app-window card with a real table (header band, zebra rows, one
highlighted row), a code-editor panel with real syntax colouring, a schema of table-cards joined by real
connectors. Record the exact colours and component node IDs for each of these in `system/brand-map.md` —
this section is where a brand's own look rules belong.

## 5. No gradients on elements
Fills, icons, lines, bubbles, pills, text = **solid** brand colors. Gradients ONLY as a subtle full-frame
background, and only the sanctioned swatches listed in `system/brand-map.md`.

## 6. Diagram conventions are a brand decision — write them down once
Connector ends, join style, arrowheads and line weights get redlined more than anything else. Read them
off a finished reference frame, record them in `system/brand-map.md` (for example: "relationships end in
a hollow triangle seated on the child table's top edge, miter joins, never a solid arrowhead"), and apply
them identically in every diagram.

## 7. Rendering — the brand `@font-face` must be in an EXTERNAL linked `.css`
In the headless-Chrome @2× pipeline, put the brand font's `@font-face` (`file:///…/YourFont*.otf`) in an
external `<link rel="stylesheet">`, **never** an inline `<style>` — inline `file://` `@font-face`
silently falls back to a system font (titles render in Arial). After rendering type, crop and eyeball the
letterforms (or run `document.fonts.check`) to confirm the brand font actually loaded.

## 8. Video audio — music sits UNDER dialogue
Dialogue normalized UP to ~−16 LUFS; music a quiet bed ~−23 LUFS, **hard sidechain-ducked** by dialogue
(→ −30…−45 LUFS under speech); lift to ~−22 only on no-dialogue payoff frames; cold-open = no music.
**Do NOT loudnorm the final mix** (it re-amplifies music) — normalize the dialogue stem, add music at
fixed low gain, finish with a **limiter only**.
