# CLAUDE.md — Stillmotion operating manual

This is a **reusable Claude Code project** for on-brand **Visual / HTML / Video** production.
One project, three tracks, a shared brand + Figma source of truth. New deliverables live in
dated subfolders under `work/`. Read this file fully before doing anything.

---

## 0. FIRST-RUN PROTOCOL (mandatory gates — do not skip)

Before building **anything**, both maps below MUST exist and be current:

1. `system/figma-map.md` — the Figma asset inventory. If missing/stale → run **`00-START-figma.md`**.
2. `system/brand-map.md` — the brand rules. If missing/stale → run **`00-START-brand.md`**.

If either is missing, STOP and run that starter first (it will ask you questions, then write the map).
**Never build a graphic or video before both maps exist.** They are the only sanctioned source of
colors, fonts, icons, logos, and rules.

3. `examples/` — "golden" reference examples to emulate (and anti-examples to avoid). On the **first
   turn** of a new project, if `examples/` is empty, run **`00-START-examples.md`** and ask the user for
   examples. **Strongly recommended** (few-shot/golden examples measurably improve consistency — show,
   don't tell) but **non-blocking**: if the user has none, proceed and note it.

---

## 1. HARD RULES (non-negotiable)

- **READ `docs/craft-rules.md` before building ANY visual or video.** It is the house quality bar
  (build-from-real-Figma, animate-real-layers-never-rebuild, clean-&-airy, font render,
  audio). A fresh session has no memory of these — the doc is the memory. Skipping it = off-brand output.
- **Visuals & animations are built from REAL Figma assets — never from scratch.** Export the actual
  component/layer and use it. For **animation**, animate the **exported layers** (real bars that scaleY,
  scan-lines that translate); do NOT recreate a chart/card in HTML, and do NOT slide a cover-box over a
  flat PNG. Full recipe in `docs/craft-rules.md` §1–§2.
- **Only real assets.** Every color, font, icon, and logo must come from `figma-map.md` / `brand-map.md`
  (which trace back to Figma + brand guidelines). **Never invent or approximate a brand asset.**
- **Search the Figma asset library FIRST — always, for every element.** `00-START-figma.md` inventories
  your brand's Figma file into **`system/figma-map.md`** (and, for large libraries, a searchable index
  under `system/figma-assets/`). Before drawing, generating, or sourcing ANY icon / logo / graphic / pill /
  pattern / gradient, grep that inventory. If it exists, use the REAL asset and export it by node ID via
  the Figma images REST API (`/v1/images/<file>?ids=<NODE_ID>&format=svg`, `X-Figma-Token` header). Only
  fall back to the Universal Icons MCP when the library has no match.
  The Figma token and file key are read from **`.env`** (`FIGMA_PAT`, `FIGMA_FILE_KEY`) — never hard-code
  or ask for them in chat; export with `scripts/figma-export.sh <NODE_ID>`.
- **If an asset is missing, STOP and flag it** in the deliverable's `NOTES.md` — do not fabricate a
  substitute silently. Offer the closest real token as a clearly-labelled, swappable stand-in.
- **Always verify before presenting:** render → **self-compare against the reference** (side by side,
  cropped to the detail) → list what still differs → only then show the user.
- **Anti-slop:** no emoji, **no gradients on elements** (gradients are background-only and subtle — never
  on fills/icons/text/lines/pills; only the sanctioned swatches in `brand-map.md`), no 3D, no stock photos, no clichés.
- **One variable, swap once:** anything uncertain (a stand-in color, an unconfirmed value) is a single
  CSS variable / config field so it can be corrected everywhere in one edit + re-render.
- **All session output stays in `work/` (gitignored).** Everything a job generates — deliverables,
  scratch, intermediate renders, one-off scripts — goes under `work/YYYY-MM-DD-campaign/`. **Never scatter
  generated files elsewhere in the repo.** The only changes that should ever be committed are *intentional*
  additions to `examples/`, `system/`, `docs/`, `templates/`, or `.claude/`. Goal: a clean `git status`
  after any production run (see `work/README.md`).

---

## 2. Tracks (see `docs/` for each)

| Track | Output | Doc |
|---|---|---|
| **Graphics** | Social/marketing PNG + stacked PDF carousels | `docs/workflow-graphics.md` |
| **Figma-Handoff** | Cleanly-layered, scoped HTML for batch import into Figma | `docs/workflow-figma-handoff.md` |
| **Video** | Remotion MP4, and AI/toolkit video + voiceover + music | `docs/workflow-video.md` |

Graphics and Figma-Handoff share the same HTML engine (`system/system.css` + `system/tokens.css`).
Rendering commands: `docs/pipeline-reference.md`. Conventions: `docs/conventions.md`.
Quality bar + QA loop: `docs/quality-rules.md`. **House craft rules (read first): `docs/craft-rules.md`.**

---

## 3. Tools available (prefer real assets over generation)

- **Figma MCP (local Dev Mode)** — reads the file open in the desktop Figma tab + asset server
  `localhost:3845`. Source of truth for tokens/icons/logos. (Remote API 403s the personal account.)
- **Huashu Design** skill — HTML-native design quality, brand-asset protocol, anti-slop. Use for layout
  craft on Graphics/Figma-Handoff.
- **Universal Icons MCP** (`icons`) — 60k+ open-source icons (Lucide, Tabler, Material, Phosphor…).
  Prefer these over hand-drawing SVGs, but only when no brand icon exists in `figma-map.md`.
- **Video:** Remotion (local render), the RunPod toolkit (LTX-2, SadTalker, Qwen-edit, RealESRGAN),
  ElevenLabs (VO/SFX), ACE-Step (music), ffmpeg/moviepy (assembly). See `docs/workflow-video.md`.
- **Video transcription / understanding (Whisper)** — the speech-to-text model is **not** in the repo
  (gitignored, ~465MB). Only when a job needs a **transcript** or **understanding of spoken video/audio**,
  install it per `system/whisper-models/README.md` (`curl … ggml-small.en.bin`), then run whisper.cpp.
- Rendering uses **headless Chrome at 2×** + **sips** (no Playwright/ImageMagick needed).
- **Packaged skills** (`.claude/skills/`, catalogued in `.claude/skills/SKILLS.md`) — project Agent Skills
  scoped to **visuals / video / presentations**: core creative (**huashu-design**, animate,
  remotion-best-practices, wiggle), all **figma-*** skills, design craft (design-critique/system/handoff,
  accessibility, ux-copy), and output (web-artifacts-builder; Anthropic's docx / pdf / pptx / xlsx
  skills are not redistributable — install them from Anthropic, see `SKILLS.md`). **Video & motion
  pack:** the full **remotion-*** set, **HyperFrames** (HTML/GSAP → MP4), **gsap-***,
  ElevenLabs audio (text-to-speech, speech-to-text, sound-effects, music, dubbing, voice-isolator),
  **higgsfield-***, **video-use** / clipify / add-zooms / find-broll for real footage, text-to-lottie,
  manim, ffmpeg / moviepy / playwright-recording, and the RunPod model skills (ltx2, acestep, qwen-edit).
  These supply technique only — **the hard rules in §1 override any skill**; in particular `hyperframes`
  calls itself the mandatory entry point for all video, but here it is opt-in per job. Invoke with
  `/<skill-name>`. Need one that isn't here? Use **`find-skills`** (searches https://skills.sh via
  `npx skills find`) to discover & install more.

---

## 4. Every new job

1. `mkdir work/YYYY-MM-DD-campaign-name/` (see `docs/conventions.md`).
2. Confirm `figma-map.md` + `brand-map.md` are current (gates). On a new project, also ask for
   **examples** (`00-START-examples.md`) if `examples/` is empty.
3. **Intake**: classify the input (written spec? reference mockup? Figma frame? target size? brand?)
   and ask for whatever is missing before building.
4. **Review `examples/<track>/`** and its INDEX notes; mirror what's called out (anti-examples = don'ts).
5. Build → render → **verify → review → redo (run the `END.md` loop)** → present.
6. Final assets go in the job's `out/`; references/extractions in `_src/`. **`NOTES.md` records the
   manifest, the feedback given, and what worked / what didn't** — and when a lesson generalizes beyond
   the job (a rule, a corrected preference), **save it to memory** so the next session keeps it.

## 5. Definition of done

A deliverable is done when: it matches the reference/spec (verified by render-and-compare), uses only
mapped assets (or has flagged stand-ins in `NOTES.md`), renders at the correct size/scale, and the
final files are in the job's `out/` with a one-line manifest in `NOTES.md`.

**Every storyboard also ships an editable PPTX in which every element is a native PowerPoint object** —
not a picture of a slide, not a flat plate with text on top. Recipe and engine:
`docs/workflow-storyboard-deck.md`.

**MANDATORY before presenting ANY deliverable — read `END.md` and run its loop:** verify → review →
**redo if not satisfied** → only once satisfied, **present by opening the job's output folder**
(`open work/<job>/out/`). Presenting is the last step, never the first. Never show unverified,
unreviewed, or unsatisfactory work.
