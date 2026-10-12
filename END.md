# END.md — how to finish & present every deliverable (mandatory)

Read and run this **before you show ANY work to the user**. CLAUDE.md gates on it. Presenting is the
**last** step, never the first — a deliverable is only presented after it has passed the loop below.
You (Claude Code) run this loop yourself; do not outsource the judgment to the user.

---

## The loop — verify → review → redo → present

**1. VERIFY** — prove it actually built, at the correct size/scale:
- Open every output file and look at it. Reject blank / broken / clipped / wrong-size renders.
- Confirm only mapped assets were used (`system/figma-map.md` / `system/brand-map.md`; search
  `system/figma-assets/` first). Any stand-in is flagged in the job's `NOTES.md`.
- Re-read the spec/reference and the relevant `examples/<track>/` goldens (and anti-examples = don'ts).

**2. REVIEW** — self-compare against the reference/spec, side by side, cropped to the detail:
- List every difference: color, type, spacing, alignment, copy, asset fidelity.
- Check the brand hard-don'ts: **no gradients on elements**, no emoji, no 3D, no stock photos, no
  fabricated brand colors/icons. (See `brand-map.md`.)
- Be your own harshest critic. **If you would not ship it, it is not done.**

**3. REDO if not satisfied** — fix the deviations and go back to step 1:
- Iterate until the output matches the bar. Never present "good enough", partial, or unverified work.
- One-variable-swap: correct any stand-in / uncertain value in one place, then re-render everything.

**4. PRESENT** — only once you are satisfied:
- Confirm final files are in the job's `out/` with a one-line manifest in `NOTES.md`.
- **A storyboard is not complete without its editable PPTX** (`docs/workflow-storyboard-deck.md`).
  Every storyboard ships the frames, the contact board, the review PDF **and** a deck in which every
  element is a native object. Verify it by converting it back to PDF in LibreOffice and diffing every
  slide against its still.
- **Open the folder containing the finished work** so the user sees it immediately:
  ```bash
  open work/YYYY-MM-DD-campaign-name/out/      # macOS Finder
  ```
- Then give a terse summary: what was made, and any flagged stand-in still open in `NOTES.md`.

---

## Hard rule
Never present unverified, unreviewed, or unsatisfactory work. The output folder is opened **only** after
the loop is green. If something is blocked (e.g. a missing brand asset), **STOP and flag it in `NOTES.md`**
— do not present a fabricated substitute.
