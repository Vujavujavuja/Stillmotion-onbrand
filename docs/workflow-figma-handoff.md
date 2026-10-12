# Track 2 — Figma-Handoff (layered HTML for import)

When a designer will take the work into Figma to integrate/polish.

## Goal
Produce **one self-contained HTML** that imports cleanly into Figma (via html.to.design or similar)
as editable, named layers — **not** a flat image.

## Rules
- **Inline everything** — all SVGs inline, design tokens inlined, no external file refs.
- **Scope each design** under a unique wrapper id (`#d1-wrap`…) so shared class names don't collide
  when several designs share one file. (See the combiner pattern in `templates/`.)
- **Name layers** with `data-layer="…"` on every meaningful element so they land labelled in Figma.
- **Flat / minimal grouping** when the designer asked to pull pieces apart; component frames when they
  want whole blocks. Confirm which in intake.
- Provide both the **individual** HTMLs and the **combined** file.

## Steps
1. Build the individual designs (Track 1 engine).
2. Generate the combined, scoped HTML (pattern in `templates/carousel-combine.md`): inline tokens once, scope each design's CSS, wrap each in a named `<section>`.
3. Render once to verify nothing collides; hand off the HTML (you do the Figma import).
