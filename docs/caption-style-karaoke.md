# Caption style — karaoke captions, 1920×1080

A worked spec from one delivered 38-second clip. Treat the numbers as a starting point and the colours
as placeholders for your own tokens.

## Type
| | |
|---|---|
| Font | Inter Tight, **weight 600 / SemiBold** |
| Size | **96 px** (8.89% of frame height) |
| Tracking | +0.5 px |
| Word gap | 28.8 px (0.30 em) |
| Case | sentence case |

> A font file's name table may say "Regular" but `usWeightClass` is **600** — pick by weight, not
> by name. At 96 px: ascent 93, descent 24, cap 70, x-height 52.

## Colour
| | |
|---|---|
| Text (active + inactive) | `#FFFFFF` |
| Highlight box | your primary at the 700 step (e.g. `--primary-700`) |
| Shadow | black, alpha 120/255, 14 px blur |
| Outline | none |

Check contrast: white on a mid-tone primary is often ~2.5:1; go darker until it clears 4.5:1.

## Layout
| | |
|---|---|
| Lines on screen | **1**, centred |
| Words per line | max 4 |
| Max line width | 1460 px (x230–x1690) |
| Box bottom | y978 · text baseline y949 |
| Box height | 127 px · padding 18 x / 5 y · radius 8 px |

## Timing
| | |
|---|---|
| Highlight | advances word by word |
| Min highlight | 0.16 s (4 frames) — below this it strobes |
| Fast words | consecutive sub-0.16 s words share one box |
| Min line | 0.75 s · opening line ≥ 1.00 s |
| Lead-in | first line only, 0.30 s early; the rest butt-join on the word boundary |
| Closing line | holds to the last body frame |

Delivered: 28 lines / 37.9 s · line mean 1.35 s · highlight mean 0.48 s.
Word times = whisper word-level transcript aligned to the script, starts snapped to a 10 ms RMS onset.

## Vertical 9:16
Same box, radius, padding and timing. Only: text in `--text-strong` at **84 px**, active word
knocked out to white. See `docs/workflow-vertical-shorts.md`.
