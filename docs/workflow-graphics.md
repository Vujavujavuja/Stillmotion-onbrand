# Track 1 — Graphics (HTML → PNG / PDF)

For LinkedIn / marketing graphics: single images and stacked PDF carousels.

## Engine
Hand-authored **HTML/CSS** → headless **Chrome @2×** → PNG. Stacked PDFs via **sips** (image→PDF).
Shared styling from `system/system.css` + `system/tokens.css`. Icons from `figma-map.md` first,
Universal Icons MCP only when no brand icon exists.

## The artboard pattern (deterministic sizing)
Set the `body` to the **exact canvas size** (e.g. `1080×1350`) so the render window == the artboard.
No clipping, no guessing. Measure real content height with `scripts/measure.sh` and fit the artboard.

## Steps
1. New job folder `work/<date>-<campaign>/` with `out/`, `_src/`, `NOTES.md`.
2. If matching a reference, extract it into `_src/` (docx images via unzip, or a screenshot).
3. Build `1-<name>.html` linking `../../system/system.css`. Use only mapped tokens/icons.
4. Render: `scripts/render.sh 1-<name>.html 1080 1350 out/1-<name>.png`.
5. **Self-compare** to the reference (crop with sips, view side by side); list deviations in `NOTES.md`.
6. Fix → re-render. Repeat until it matches.
7. Carousel: build each panel, then `scripts/combine-pdf.sh out/*.png out/<campaign>.pdf`.

## Defaults
- Sizes: `1080×1350` (LinkedIn 4:5), `1080×1080`, `1080×1920` (reels), `1920×1080` (YouTube).
- Fonts: per `brand-map.md` (`--font-brand` in `system/tokens.css`).
- Title strip → diagram (~70%) → one-line caption, unless the spec says otherwise.

## Carousels
Multi-step explainers ship as a **4-panel `1080×1080` carousel**. Use the shared engine
`system/carousel.css` and the skeleton `templates/carousel-panel.html`; put a golden carousel in
`examples/graphics/` once you have one. One panel per step; consistent eyebrow + `num` masthead, `.dots`
indicator, real wordmark (`system/wordmark.svg`, exported from your Figma file). **Deliver a folder of
per-slide PNGs (one per slide, numbered)**; add a combined PDF with `scripts/combine-pdf.sh` when the
channel needs one.
