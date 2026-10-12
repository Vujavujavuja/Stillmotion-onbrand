# Quality rules & QA loop

> **First read `docs/craft-rules.md`** — the house craft bar (build-from-real-Figma,
> animate-real-layers-never-rebuild, clean-&-airy, font render, audio). This file is the
> QA *loop*; craft-rules is *what good looks like*.

## The HARD RULE
Only real, mapped assets. Never fabricate a brand asset. If something's missing, **STOP and flag it**
in `NOTES.md` and use a clearly-labelled, single-variable stand-in — never a silent guess.
**Animations: animate the real Figma exports (extract the layers) — never rebuild from scratch, never
slide a cover-box over a PNG.** (craft-rules §2)

## The QA loop (run every time before showing the user)
1. **Render** at the target size/scale.
2. **Self-compare to the reference** — crop the exact detail with sips, view side by side.
3. **List deviations** plainly (position, color, icon, spacing, copy).
4. **Fix → re-render.** Repeat until it matches. Only then present.
5. For carousels/video: verify the combined output (PDF page count / no clipping; MP4 timing).

## Anti-slop (bake into every build)
No emoji. No purple gradients. No 3D. No stock photos. No generic AI layouts. Real grids, real type
scale, real brand color. (The Huashu Design skill enforces much of this — use it.)

## Definition of done
Matches the reference/spec (verified) · uses only mapped assets (or flagged stand-ins) · correct
size/scale · final files in `out/` · one-line manifest + any flags in `NOTES.md`.
