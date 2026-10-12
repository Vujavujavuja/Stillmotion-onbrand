# Track 3 — Video

> **Before animating anything, read `docs/craft-rules.md` §1–§2.** Animations are built from the **real
> Figma exports** — extract the actual layers and animate *those* (bars that scaleY, scan-lines that
> translate). **Never** rebuild a chart/card from scratch in HTML, and **never** slide a cover-box over a
> flat PNG (reads fake). The finished Figma export must not change one bit. Also: clean & airy, one idea
> per frame (§3); music sits under dialogue (§8).

Two sub-paths; pick per job in intake.

## A) Remotion or HyperFrames (programmatic, local render) — preferred for branded explainers
- React compositions; render locally to MP4 (no cloud). See the `remotion` / `remotion-best-practices`
  skills. Note: Remotion needs a company licence for teams of 4+ people.
- **HyperFrames** (`hyperframes` + `motion-graphics` skills) is the HTML/GSAP alternative: same real
  exported layers, no React. Pick one engine per job.
- Bring assets from `figma-map.md`; voiceover from ElevenLabs; music from ACE-Step.

## B) AI / toolkit clips — for b-roll / motion you can't hand-build
- **LTX-2** (text/image-to-video) and **SadTalker** via the RunPod toolkit (your own GPU).
- **Qwen-edit / RealESRGAN / ProPainter** for image edits / upscale / cleanup.
- Assemble with **ffmpeg** or **moviepy** (text overlays, lower-thirds, compositing).

## Audio
- **Voiceover:** ElevenLabs (cloned brand voice if set in the brand profile).
- **Music:** ACE-Step.
- Cut clips on the PREVIOUS sentence (slides flip ~1s before narration ends).

## Steps
1. Script / storyboard in the job folder.
2. Generate/compose visuals (Remotion or toolkit) using mapped brand assets.
3. Generate VO + music.
4. Assemble (Remotion render, or ffmpeg/moviepy) → `out/<campaign>.mp4`.
5. Review (scene-review) → iterate.

## Editing real footage
For talking-head and interview material use `video-use` (transcribe, cut, grade, subtitle), `clipify`
(shorts), `add-zooms`, `find-broll`, `embedded-captions` and `talking-head-recut`. Catalogue:
`.claude/skills/SKILLS.md`.
