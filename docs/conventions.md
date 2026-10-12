# Conventions

## Git hygiene — one gitignored output folder
**All session output stays under `work/` (gitignored).** Every job writes its files to
`work/YYYY-MM-DD-campaign-name/` — deliverables, scratch, intermediate renders, throwaway scripts. Nothing
generated lives elsewhere in the repo. The only changes ever committed are intentional edits to `examples/`,
`system/`, `docs/`, `templates/`, or `.claude/`. After any production run, `git status` should be clean
apart from those. (`work/README.md` explains it; the whole folder except its README is in `.gitignore`.)

## Deliverable folders
`work/YYYY-MM-DD-campaign-name/` containing:
```
out/      final PNG / PDF / MP4 / PPTX (the deliverables)
_src/     extracted references (docx images, screenshots, the spec)
*.html    the builds
NOTES.md  one-line manifest + any FLAGGED gaps / stand-ins / open questions
```

## Naming
- Panels/graphics: `1-<slug>.html`, `2-<slug>.html`, …  PNGs mirror the HTML name in `out/`.
- Combined Figma-import file: `<campaign>-ALL.html`. Carousel PDF: `<campaign>.pdf`.
- Storyboards: frames in `storyboard/NN-slug.png` + `storyboard/_storyboard-board.png`; review PDF
  `out/<slug>_scene-by-scene.pdf`; **editable deck `out/<slug>_scene-by-scene_EDITABLE.pptx`**
  (mandatory — see `docs/workflow-storyboard-deck.md`).

## Sizes (default canvases)
`1080×1350` (LinkedIn 4:5) · `1080×1080` (square) · `1080×1920` (9:16 reels) · `1920×1080` (YouTube).
Render scale: **2×** always.

## Where shared things live
`system/tokens.css` (design tokens) · `system/system.css` (base classes) · `system/figma-map.md` ·
`system/brand-map.md` · `system/fonts/` (font notes). Builds link `../../system/system.css`.

## Stand-ins
Any unconfirmed value is **one CSS variable** in `tokens.css` and is listed under FLAGGED in the job's
`NOTES.md`, so it can be corrected everywhere in one edit + re-render.
