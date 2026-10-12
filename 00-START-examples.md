# 00 · START — Examples (recommended, asked on first turn)

**Why:** few-shot / "golden" examples measurably improve consistency and quality — the agent should
**show, don't tell** by referencing real files you like, not just descriptions. Run this on the first
turn of a new project (or whenever `examples/` is empty). **Strongly recommended but non-blocking:** if
you have no examples yet, proceed and note it — examples can be added anytime by re-running this.

## How the agent must run this (first turn)

### Step 1 — ASK the user
> "Before I build, do you have **reference examples** I should emulate? Anything works: a past
> graphic/video you were happy with, a competitor or inspiration whose style you like, or a 'golden'
> deliverable. And any **anti-examples** — things to avoid? Drop the files or links here."

Ask specifically across the tracks: **Graphics**, **Figma-Handoff**, **Video**.

### Step 2 — File each example
- Save the asset (PNG/MP4/PDF/HTML) into the matching folder:
  `examples/graphics/`, `examples/figma-handoff/`, `examples/video/`, or `examples/anti/`.
- For links/references that can't be downloaded, save a small `*.md` stub with the URL + a screenshot.

### Step 3 — Log it in `examples/INDEX.md`
One row per example: file · track · source · **what to emulate** (or, for anti-examples, **what to avoid**).
Be concrete: "tight navy headings + lots of whitespace," not "looks clean."

### Step 4 — Use them
**Before every build, review the relevant `examples/<track>/` and its INDEX notes**, and mirror what's
called out. If a build deviates from an example on purpose, say why. Anti-examples are hard "don'ts."
