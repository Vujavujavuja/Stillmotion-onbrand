# Workflow — the editable storyboard deck (mandatory on every storyboard)

Every storyboard ships **four** things, not three:

```
storyboard/NN-slug.png            the frames, 1920×1080 @2×
storyboard/_storyboard-board.png  the labelled contact sheet
out/<slug>_scene-by-scene.pdf     the review PDF
out/<slug>_scene-by-scene_EDITABLE.pptx   ← this doc
```

## What "editable" means here

**Every element on every frame is its own native PowerPoint object.** Not a picture of a slide. Not a
flat artwork plate with the copy laid on top. If it is a card, it is a shape you can drag, recolour and
resize. If it is a line of copy, it is a text box you can retype. If it is Figma artwork, it is a vector
you can convert to editable paths.

| On the frame | In the deck |
|---|---|
| the page background | one rectangle with the real multi-stop linear gradient |
| cards, pills, bars, rules, dots, dividers | rounded rectangles and freeforms: solid fill, real stroke, dashes still dashed, real soft shadows |
| a dashed "environment" boundary | a rounded rectangle with a real dashed outline |
| real Figma artwork | an **SVG picture** with a PNG fallback. In PowerPoint: *Graphics Format → Convert to Shape* gives the editable vector paths |
| every line of copy | a text box at the measured position, size, colour and weight, with the browser's line breaks baked in so PowerPoint cannot re-wrap a headline into a different shape |

## The engine

Two files, cloned into the job's `build/deck/` next to the frame HTMLs (`NN-slug.html`, one per scene)
and a `scenes.py` (copy `templates/storyboard-deck/scenes.example.py`):

- **`templates/storyboard-deck/shapes.mjs`** — loads each `NN-*.html` in headless Chrome and reads out a
  full scene graph to `_shapes/<name>.json`: every box with its rect, fill, border (width, colour, dash),
  per-corner radius, shadow and opacity; every top-level `<svg>` written out to `_shapes/<name>-NN.svg`
  with its `<text>` removed (so the copy stays editable text instead of being baked into the artwork);
  every line of copy measured **character by character**, so explicit `<br>`, block children and browser
  wrapping all come back as separate, exactly positioned lines.
- **`templates/storyboard-deck/deck.py`** — rebuilds that scene graph as native objects with python-pptx.

```
cd build && node shapes.mjs && python3 deck.py
```

`deck.py` reads `scenes.py` for the slide order and puts the scene label and beat in the speaker notes.
Needs `pip install python-pptx lxml` and `rsvg-convert` (`brew install librsvg`) for the PNG fallbacks.

## What the engine has to do, and why

1. **Strip `<p:style>` from every shape.** python-pptx attaches a theme reference to each autoshape. An
   empty `<a:effectLst/>` is supposed to override its `<a:effectRef>`, and PowerPoint honours that, but
   **LibreOffice draws the theme drop shadow anyway** — every plain bar comes out with a shadow the frame
   does not have. With no `<p:style>` at all, every renderer has to use `spPr`.
2. **Flatten translucent fills.** PowerPoint honours `a:alpha` on a solid fill; LibreOffice does not
   (measured: 42% white over `#E9F3FB` renders as `(222,227,231)` instead of `(242,248,253)`). Composite
   each wash against the background gradient at build time and ship a solid colour.
3. **Middle-anchor the text, do not top-anchor it.** Every engine hangs the first line off the top of a
   text box using its own ascent, and they disagree. Centring each block inside a box that is exactly the
   measured text block cancels the difference instead of guessing at one engine's half-leading. On one
   measured board this moved the mean deviation from 5.02 to 4.34.
4. **Per-corner radii need freeforms.** A `roundRect` has one radius. Corner bars and clipped table header
   rows have different radii per corner (they come from a rounded `overflow:hidden` parent, which
   `shapes.mjs` resolves). Where all four match, use a real rounded rectangle so the corner handle stays
   live; where they differ, emit a freeform with the exact geometry.
5. **Group text into lines by vertical overlap, and carry the font per run.** An inline
   `<span class="mono">` inside a brand-font line shares the baseline but has a different ascent, so its
   character rects sit a few px higher. Keyed on an exact top, that run was thrown onto a *second*
   line and drawn on top of the first. Lines are grouped by
   overlap of the vertical spans, and `mono` travels on each run so the span keeps its mono face.

6. **Test borders per side, not off the top side.** A card with only a `border-left` accent has
   `borderTopStyle: none`; keying "does this box have a border" on the top side alone silently dropped
   the accent bar out of the deck. Each side is tested on its own width *and* its own style.

7. **The ellipse test needs the box to be square.** A radius of half the short side is an ellipse
   only on a square box; on a 27x14 dash it is a *stadium* with straight sides. Testing the radius
   alone turned a whole grid of pill-shaped dashes into ovals. Test squareness too.

8. **Keep DOM order.** PowerPoint z-order is insertion order, so emit in document order: a container's
   box lands before the text and the dots inside it.

9. **Fade the border and the shadow, not just the fill.** An element carrying a CSS `opacity` had only
   its *fill* composited against the background; its border kept the full-strength colour and its
   shadow the full-strength alpha. A row of ghosted cards therefore came through as a row of empty
   outlined boxes. `opacity` now multiplies the stroke colour (through `flatten`) and the shadow alpha
   as well.

10. **Multi-line copy needs EXACT leading, not a ratio.** `line_spacing` as a multiple is resolved
   against each engine's own idea of the font's line height (often ~1.2em), so a browser pitch of
   1.25 came out around 1.5em in LibreOffice and PowerPoint: the block grew and the last line walked
   off the bottom of its card. The pitch is now pinned
   in points (`spcPts`). Single-line blocks are unaffected.

11. **Figma's `mask-type:alpha` does not survive.** Many Figma exports mask their
   glyph with a `#D9D9D9` rect carrying `style="mask-type:alpha"`. Chrome reads that CSS property and
   masks on **alpha** — the rect is opaque, so nothing dims. Renderers that ignore it fall back to
   SVG's default **luminance** mask and draw the artwork at ~85%: measured, a `#797C7F` glyph came out
   of LibreOffice at `#8C8F91`. `shapes.mjs` now forces every fill inside a `<mask>` to white, which is
   fully opaque under both readings. Worth knowing this is **not** rsvg — the PNG fallback was correct
   either way; it is the *embedded* SVG that LibreOffice (and possibly PowerPoint) reads.

## Two things that are per-job, not per-template

- **`BG_STOPS`** — the frame's own background stops.
- **`gradient_bg`'s `a:lin ang`** — the template ships `5400000` (top to bottom). A stage built on a **135° CSS** gradient and needs **`2700000`**. Change both or neither: with the stops
  swapped and the angle left alone the deck looks nearly right and the numeric diff stays low
  (measured 2.05, inside the healthy band), because only the corners move. **Sample the four corners
  against the still** — that is what catches it.

## Verify before presenting (END.md gates on this)

```
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir _verify <deck>.pptx
pdftoppm -png -r 96 _verify/*.pdf _verify/s
```
Then diff every slide against its still and read them all back at full size. A healthy deck lands in a
**3 to 8 mean-abs band** with no outliers; that residual is font rasterisation. Look specifically for
re-wrapped lines, missing shapes, clipped text, lost dashes and misplaced artwork.

**The brand font must be installed** for the deck to render on brand. On a machine without it PowerPoint
substitutes and the copy goes off brand; the artwork stays correct. Say so in the job's `NOTES.md`.
