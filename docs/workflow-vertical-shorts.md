# Workflow — Horizontal video → fully vertical short (9:16)

Turning a finished 1920×1080 video into a **1080×1920 short**, rebuilding the graphics
from the **real Figma frames** and re-authoring the motion to match the horizontal beat-for-beat.

Derived from a real first job. **Read the "Redlines" section before building — every item there cost
a round trip the first time.**

---

## Intake (what a job needs)

1. The **horizontal MP4** (the finished cut, with its final audio).
2. The **Figma link** to the page/frames it was storyboarded from.
3. Nothing else is blocking. Defaults, unless told otherwise:
   - **Whole clip, one file, full length** — never a segment.
   - **Original audio muxed through untouched** (VO + music mix preserved, guarantees sync).
   - Talking-head spans → **split layout**: person cropped to a 1080×1080 top square, animated
     graphics in the 1080×840 bottom band.
   - Match source fps exactly (often **23.976**, not 24).

---

## Redlines (the corrections that were given — do these first-try)

1. **Deliver the whole video, not a preview segment.**
   A 9.6s intro segment of a 47s video, presented with "does this land?", was rejected outright.
   Build all segments, assemble, mux audio, QA, **then** present one file.

2. **Reflow the composition vertically — top-down rows.** "Same as the horizontal" means the same
   **sequence, choreography and asset style**, not the same *arrangement*. A horizontal intro typically becomes
   a 5-row stack: hero → connector → two pills side by side → line → punchline → caption.
   Do not band the horizontal layout across the middle of a portrait frame.

3. **One element that morphs — never 2–3 PNG states crossfading.**
   A table exported as three separate Figma states and crossfaded read as three elements coming and
   going, and was rejected.
   Consecutive Figma frames are usually **one object at successive times**. Read its real colors
   and geometry out of the export, then rebuild it as a single CSS element that changes:
   box → header changes colour + ring highlight → accent in → cells fill (staggered) →
   ring fades, settles → label rises.

4. **Use the real connector/line assets, don't approximate.** The first pass drew straight
   right-angle connectors; the real one was a rounded **"{" brace** with its own stroke style,
   plus a separate line asset. When a real
   asset genuinely can't be reused (rotating the brace onto side-by-side pills distorts it),
   redraw **in its exact style** — same caps, same stroke — and say so.

5. **Ask the layout question once, up front, with a rendered A/B** — not after presenting.
   The "faithful to horizontal" vs "reflowed vertical" ambiguity burned two full round trips.

6. Write **`NOTES.md`** as you go (manifest + feedback + what worked). The first job shipped without one.

---

## Pipeline (verified working)

Assets — real layers by node ID, PNG @scale=3, transparent:

```bash
set -a; . ./.env; set +a
curl -s -H "X-Figma-Token: $FIGMA_PAT" \
  "https://api.figma.com/v1/images/$FIGMA_FILE_KEY?ids=<NODE_IDS>&format=png&scale=3"
```

Find the *visible on-canvas* children first — these frames carry off-canvas leftovers, so walk
`/v1/files/<file>/nodes?ids=<frame>&depth=4` and filter by `absoluteBoundingBox` inside the frame.

Harness — a capture driver per canvas size, plus a linked `fonts.css` (brand font via a linked sheet,
never inline).

`capseq_v.mjs <html> <fps> <dur> <outdir>` drives headless Chrome over CDP, calling
`window.setT(t)` per frame → `f_%05d.png`. Two variants are needed:
`capseq_v.mjs` at **1080×1920** (full-frame clips) and `capseq_bottom.mjs` at **1080×840**
(transparent bottom band for talking-head spans).

Background plate: a vertical gradient sampled from a near-empty source frame — resample per video,
don't assume.

Talking-head composite (find the person-crop x-offset by testing a few values, e.g. 120/180/240):

```bash
ffmpeg -y -loop 1 -framerate 23.976 -i base_bg.png -i person_top.mp4 \
  -framerate 23.976 -i "frames/bottom/f_%05d.png" \
  -filter_complex "[0:v][1:v]overlay=0:0[a];[a][2:v]overlay=0:1080[o]" \
  -map "[o]" -t <dur> -r 23.976 -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -an clips/02-talkinghead.mp4
```

Assemble + mux the original audio:

```bash
ffmpeg -y -i clips/01-intro.mp4 -i clips/02-talkinghead.mp4 -i clips/04-outro.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0[v]" -map "[v]" -r 24000/1001 \
  -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p build/full_v.mp4
ffmpeg -y -i build/full_v.mp4 -i _src/<source>.mp4 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest \
  out/<Title>-VERTICAL.mp4
```

## Timing the beats

Sample the source densely (every 0.4s across the graphics spans) into a labelled contact sheet and
read the beat times off it, e.g. `0.2s` hero pops · `2.1s` shrinks/moves · `3.2s` connector draws ·
`3.5s` first pill · `3.9s` second pill · `5.2s` line + caption · `5.5s` punchline pops · hold to `9.5s`
→ dissolve. Transitions between spans are cross-dissolves, not
hard cuts — `select=gt(scene,0.15)` finds nothing, so read them off the sheet.

## Done

Full-length single MP4 in `out/`, 1080×1920, source fps, original audio in sync, QA contact sheet
checked across the whole timeline, `NOTES.md` written — then `open` the job's `out/`.

If a job also asks for matching vertical **frames in Figma**, do them after the video is approved.
