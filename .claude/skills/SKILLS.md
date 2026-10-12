# Packaged skills — Stillmotion

Project-scoped Agent Skills, vendored so they travel with the repo. When this folder is the
working directory in Claude Code they load automatically; invoke one with `/<skill-name>` or just
describe the task and the matching skill triggers.

**Scope:** visuals, video, presentations, and the design/Figma tooling behind them. **How skills work:** each folder = a `SKILL.md` (YAML frontmatter `name` + `description`, then instructions) plus optional `scripts/`, `references/`, `assets/`. Claude reads the `description` to decide when a skill applies, then loads its body on demand.

**Need something not here?** Use **`find-skills`** (`npx skills find <query>`, browse https://skills.sh) to discover & install more.

## Core creative (HTML / motion / video / discovery)

| Skill | What it's for |
|---|---|
| `huashu-design` | 花叔Design——用HTML做高保真原型、交互Demo、幻灯片、动画、设计变体探索+设计方向顾问+专家评审。根据任务embody对应专家（UX/动画师/幻灯片设计师/原型师），避免web design tropes。触发词：做原型、交互原型、HTML演示、动画Demo、设计变体、hi-fi设计、UI mockup、prototype、做… |
| `animate` | Animation patterns and best practices for Next.js/React applications. |
| `wiggle` | Create animated logo files (Lottie JSON, GIF, MP4) from static logo images. |
| `vercel-react-view-transitions` | Guide for implementing smooth, native-feeling animations using React's View Transition API (`<ViewTransition>` component, `addTransitionType`, and CSS view transition pse… |
| `slack-gif-creator` | Knowledge and utilities for creating animated GIFs optimized for Slack. |
| `find-skills` | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in e… |

## Video & motion

Vendored from upstream at the commits in `THIRD_PARTY.md`. **House rules still win:** these skills supply
technique; `CLAUDE.md` + `docs/craft-rules.md` decide what gets built (real Figma layers, no gradients on
elements, no stock imagery). In particular the `hyperframes` skill describes itself as the mandatory entry
point for every video request — in this repo it is **opt-in**, used only when a job picks HyperFrames as the
engine.

### Remotion (official, React video)

Source: `remotion-dev/skills` · Needs: Node >= 18. Remotion itself needs a company licence for teams of 4+.

| Skill | What it's for |
|---|---|
| `remotion-best-practices` | Router for all Remotion skills |
| `remotion-captions` | Transcribing, displaying and animating captions |
| `remotion-create` | Create a new Remotion video |
| `remotion-docs` | Search Remotion documentation |
| `remotion-interactivity` | Structure Remotion markup for interactivity |
| `remotion-maps` | Remotion Map animation knowledge |
| `remotion-markup` | Content, animation and effects best practices |
| `remotion-multimedia` | Interacting with Mediabunny |
| `remotion-render` | Export a Remotion video |
| `remotion-saas` | Build an app with Remotion |
| `remotion-studio` | Preview a Remotion video |
| `remotion-upgrade` | Upgrade Remotion, and related packages |

### HyperFrames (HeyGen — HTML/GSAP to MP4)

Source: `heygen-com/hyperframes` · Needs: Node >= 22 + ffmpeg; CLI via `npx hyperframes`. Opt-in engine — see the note below.

| Skill | What it's for |
|---|---|
| `embedded-captions` | Add captions or subtitles to an existing single-subject talking-head video without editing the footage. |
| `faceless-explainer` | Turn arbitrary text — an article, notes, a topic, a brief |
| `figma` | Import Figma content into a HyperFrames composition |
| `general-video` | Author or edit a custom HyperFrames composition when no specialized workflow fits, or when BRIEF.md sets flow: companion. |
| `hyperframes` | Mandatory entry point: read this first for any request to make, create, edit, animate, or render a video, animation, or motion graphic, including a promo, explainer, capt |
| `hyperframes-animation` | All animation knowledge for HyperFrames |
| `hyperframes-audio` | Use when audio already placed in a HyperFrames composition needs to be mixed: fade-in/fade-out, crossfade, track gain or volume, volume automation, ducking, a music bed t |
| `hyperframes-cli` | Use the HyperFrames CLI development loop: init, add, catalog, capture, lint, check, snapshot, compare, grade-compare, preview, play, present, beats, keyframes, single or |
| `hyperframes-core` | The HyperFrames composition contract — build one renderable project. |
| `hyperframes-creative` | Non-animation creative direction for HyperFrames videos. |
| `hyperframes-keyframes` | Use when a HyperFrames composition needs a punch-in, punch-out, zoom, reframe, Ken Burns treatment, camera move, visual match/whip handoff, or other seek-safe 2D/3D keyfr |
| `hyperframes-registry` | Search, install, and wire registry blocks and components into HyperFrames compositions. |
| `hyperframes-studio` | Use when working with a person on a HyperFrames project in Studio: first, whether their message asks for a change at all (questions, loose ideas and "don't change anythin |
| `media-use` | Agent Media OS for a HyperFrames project. |
| `motion-graphics` | A short, design-led motion graphic where motion is the message |
| `music-to-video` | Turn a music track (an audio file, a video to pull audio from, or a track generated from a mood brief) into a beat-synced video |
| `pr-to-video` | Turn a GitHub pull request (a PR URL, owner/repo#N, or 'this PR' in a checked-out repo) into a code-change explainer video |
| `product-launch-video` | Turn a product or marketing URL, pasted script, or brief into a product launch / promo video |
| `remotion-to-hyperframes` | Port an existing Remotion (React) composition''s source to HyperFrames HTML. |
| `slideshow` | Author a HyperFrames slideshow — a presentation, pitch deck, or interactive deck with discrete slides, fragment reveals, branching, hotspot navigation, and built-in prese |
| `talking-head-recut` | Package an existing talking-head / interview / podcast video with timed, designed GRAPHIC OVERLAY cards |

### GSAP (official)

Source: `greensock/gsap-skills` · Needs: No install; reference skills.

| Skill | What it's for |
|---|---|
| `gsap-core` | Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). |
| `gsap-frameworks` | Official GSAP skill for Vue, Svelte, and other non-React frameworks |
| `gsap-performance` | Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. |
| `gsap-plugins` | Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, |
| `gsap-react` | Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. |
| `gsap-scrolltrigger` | Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. |
| `gsap-timeline` | Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. |
| `gsap-utils` | Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. |

### ElevenLabs (official — VO, SFX, music, dubbing, cleanup)

Source: `elevenlabs/skills` · Needs: `ELEVENLABS_API_KEY` in `.env`.

| Skill | What it's for |
|---|---|
| `text-to-speech` | Convert text to speech using ElevenLabs voice AI. |
| `speech-to-text` | Transcribe audio to text using ElevenLabs Scribe v2. |
| `sound-effects` | Generate sound effects from text descriptions using ElevenLabs. |
| `music` | Generate music using ElevenLabs Music API. |
| `dubbing` | Dub audio and video into other languages using the ElevenLabs Dubbing API (dubbing_v2), preserving the original speakers' voices. |
| `voice-changer` | Transform the voice in an audio recording into a different target voice while preserving emotion, timing, and delivery using the ElevenLabs Voice Changer (speech-to-speec |
| `voice-isolator` | Remove background noise and isolate vocals/speech from audio using ElevenLabs Voice Isolator (audio isolation) API. |
| `setup-api-key` | Guides users through setting up an ElevenLabs API key for REST API and SDK workflows. |

### Higgsfield (official — AI image/video generation)

Source: `higgsfield-ai/skills` · Needs: Higgsfield CLI + account/credits.

| Skill | What it's for |
|---|---|
| `higgsfield-generate` | Generate images/videos/3D assets/audio via Higgsfield AI. |
| `higgsfield-video-explainer` | Build a complete non-photoreal narrated explainer or story video from ordered 10-second blocks: one narrator, one universal style key, one Seed Audio take and one Gemini |
| `higgsfield-youtube-thumbnail` | Create high-click-through YouTube thumbnails and vertical video covers through the Higgsfield CLI. |
| `higgsfield-product-photoshoot` | Generate brand-quality product images through Higgsfield product-photoshoot prompt enhancement on GPT Image 2 / gpt_image_2. |
| `higgsfield-soul-id` | Train a Soul Character — a personalized model on a person's face that Higgsfield uses for identity-faithful image and video generation. |

### Conversational editing of real footage

Source: `browser-use/video-use` · Needs: ffmpeg + Python (uv); transcription uses ElevenLabs Scribe.

| Skill | What it's for |
|---|---|
| `video-use` | Edit any video by conversation. Transcribe, cut, color grade, generate overlay animations, burn subtitles |

### Talking-head finishing (clips, zooms, b-roll)

Source: `louisedesadeleer/add-zooms, louisedesadeleer/b-roll-finder, louisedesadeleer/clipify` · Needs: ffmpeg + Python; macOS.

| Skill | What it's for |
|---|---|
| `clipify` | Find compelling moments in a video — funny dialogue OR repeated impact actions like axe chops, hits, throws, drumbeats |
| `add-zooms` | Add emphasis motion to a flat talking-head video file |
| `find-broll` | Source b-roll for a video edit — classify each moment, scope the search, return vetted candidates, place on the word. |

### Lottie

Source: `diffusionstudio/lottie` · Needs: Authoring guidance works standalone; the upstream repo has the Skottie preview player.

| Skill | What it's for |
|---|---|
| `text-to-lottie` | Create, edit, or fix Lottie/Bodymovin JSON animations for the local Skia Skottie player. |

### Manim (3Blue1Brown-style explainers)

Source: `adithya-s-k/manim_skill` · Needs: `uv tool install manim` + LaTeX (not installed by default).

| Skill | What it's for |
|---|---|
| `manimce-best-practices` | Trigger when: (1) User mentions "manim" or "Manim Community" or "ManimCE", (2) Code contains `from manim import *`, (3) User runs `manim` CLI commands, (4) Working with S |
| `manim-composer` | Trigger when: (1) User wants to create an educational/explainer video, (2) User has a vague concept they want visualized, (3) User mentions "3b1b style" or "explain like |

### Toolkit: ffmpeg, MoviePy, screen capture, RunPod models

Source: `digitalsamba/claude-code-video-toolkit` · Needs: Skills reference the upstream toolkit's `tools/*.py`; clone it when a job needs the RunPod models.

| Skill | What it's for |
|---|---|
| `ffmpeg` | Video and audio processing with FFmpeg. Use for format conversion, resizing, compression, audio extraction, and preparing assets for Remotion. |
| `moviepy` | Python video composition with moviepy 2.x |
| `playwright-recording` | Record browser interactions as video using Playwright. |
| `ltx2` | AI video generation with LTX-2.3 22B — text-to-video, image-to-video clips for video production. |
| `acestep` | AI music generation with ACE-Step 1.5 — background music, vocal tracks, covers, stem extraction, audio repainting, and continuation for video production. |
| `qwen-edit` | AI image editing prompting patterns for Qwen-Image-Edit. |
| `runpod` | Cloud GPU processing via RunPod serverless. |

### Commercial / launch films

Source: `echris6/motion-video-kit` · Needs: None; planning + critic-loop skill.

| Skill | What it's for |
|---|---|
| `business-motion-film` | Plan, build and quality-check a premium short commercial for a real business (roofing, property, ecommerce, B2B software) using AI-generated footage, code-built motion (H |

### Not vendored — install when a job needs it

| Source | Why you'd want it | Install |
|---|---|---|
| `heygen-com/skills` | HeyGen avatar / presenter video, video translation | `npx skills add heygen-com/skills --copy` |
| `fal-ai-community/skills` | fal.ai model routing + generation recipes (no licence file upstream) | `npx skills add fal-ai-community/skills --copy` |
| `google-gemini/gemini-skills` | `gemini-omni-flash-api` video edit / extend | `npx skills add google-gemini/gemini-skills -s gemini-omni-flash-api --copy` |
| `iart-ai/motion-skills` | 50 small motion packs (kinetic type, data-viz, WebGL) | see its README (packs install separately) |
| `adithya-s-k/manim_skill` | `manimgl-best-practices` (3b1b's own ManimGL fork) | `npx skills add adithya-s-k/manim_skill -s manimgl-best-practices --copy` |
| `calesthio/OpenMontage` | Full agentic production system (AGPL-3.0 — keep out of this repo) | clone separately |
| MCP: DaVinci Resolve / Premiere / After Effects | Drive a desktop NLE timeline | `samuelgursky/davinci-resolve-mcp`, `leancoderkavy/premiere-pro-mcp`, `Dakkshin/after-effects-mcp` |
| MCP: Playwright `--save-video` | Record browser sessions as footage | `claude mcp add playwright -- npx @playwright/mcp@latest --save-video=1920x1080` |

## Visual art (generative & static)

| Skill | What it's for |
|---|---|
| `canvas-design` | Create beautiful visual art in .png and .pdf documents using design philosophy. |
| `algorithmic-art` | Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. |

## Figma (read + write + code-connect)

| Skill | What it's for |
|---|---|
| `figma-use` | **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. |
| `figma-generate-design` | Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. |
| `figma-generate-library` | Build or update a professional-grade design system in Figma from a codebase. |
| `figma-generate-diagram` | MANDATORY prerequisite — load this skill BEFORE every `generate_diagram` tool call. |
| `figma-code-connect` | Creates and maintains Figma Code Connect template files that map Figma components to code snippets. |
| `figma-implement-motion` | Translates Figma motion and animations into production-ready application code. |
| `figma-use-figjam` | This skill helps agents use Figma's use_figma MCP tool in the FigJam context. |
| `figma-use-motion` | Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation styles, easing, and timeline duration. |
| `figma-use-slides` | This skill helps agents use Figma's use_figma MCP tool in the Slides context. |
| `figma-create-new-file` | **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `create_new_file` tool call. |

## Design craft & review

| Skill | What it's for |
|---|---|
| `design-critique` | Get structured design feedback on usability, hierarchy, and consistency. |
| `design-system` | Audit, document, or extend your design system. |
| `design-handoff` | Generate developer handoff specs from a design. |
| `accessibility-review` | Run a WCAG 2.1 AA accessibility audit on a design or page. |
| `frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. |
| `web-design-guidelines` | Review UI code for Web Interface Guidelines compliance. |
| `theme-factory` | Toolkit for styling artifacts with a theme. |
| `ux-copy` | Write or review UX copy — microcopy, error messages, empty states, CTAs. |
| `user-research` | Plan, conduct, and synthesize user research. |
| `research-synthesis` | Synthesize user research into themes, insights, and recommendations. |

## Deliverable output & meta

| Skill | What it's for |
|---|---|
| `web-artifacts-builder` | Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). |
| `webapp-testing` | Toolkit for interacting with and testing local web applications using Playwright. |
| `skill-creator` | Create new skills, modify and improve existing skills, and measure skill performance. |
| `consolidate-memory` | Reflective pass over your memory files — merge duplicates, fix stale facts, prune the index. |

**Not included (licence):** Anthropic's `docx`, `pdf`, `pptx`, `xlsx` skills are not redistributable. Install
them from https://github.com/anthropics/skills or the Claude plugin marketplace; the storyboard-deck track
uses `pptx`.

---
_101 skills packaged. Discover & install more with `find-skills`._
