# 00 · START — Brand map (GATE 2)

**Run this on the first turn of a new brand/project, or whenever `system/brand-map.md` is missing or
stale.** Output: a complete `system/brand-map.md` of rules every build obeys. **Do not build anything
until this map exists.**

## How the agent must run this

### Step 1 — Gather the brand sources
- The **Figma brand page** (Brand Colors / Foundations) — exact palette + type.
- The user's **memory files**, if any describe the brand.
- **Ask** the user: *“Is there a brand book (PDF), a brand page on the site, or a Notion I should also
  read?”* If a URL/file is given, read it.

### Step 2 — ASK the user these questions (do not assume)
1. **Which brand/product** is this for? (the company, a product, a sub-brand?)
2. **Primary + secondary fonts**, and when each is used?
3. **Accent rules** — e.g. “crimson = failure states only,” “green = pass only,” “blue for
   primary,” and any colors that must NOT be used (e.g. “never pure black as body text”).
4. **Logo usage** — which lockups, clear-space, min size, do/don'ts.
5. **Voice & tone** — for any on-image copy / captions (terse? technical? no hype?).
6. **Per-campaign overrides** — any one-off accent or font for this specific series.
7. **Hard don'ts** — anything that's an instant reject.

### Step 3 — Write `system/brand-map.md` using this schema
```
# Brand map — <brand/product>
_Last updated: <date>_

## Palette (with exact hexes + intended use)
- Primary: ...   Accent: ...   Neutral/text ramp: ...
- Pass/fail semantics: green = pass, crimson = fail (exact tokens)
- BANNED: <colors/usages that must never appear>

## Type
- Headings: <font / weight / color>   Body: <font / weight / color>   When-to-use

## Logos & lockups
- Approved marks · clear-space · min size · do/don'ts

## Voice & tone (on-image copy)
## Accent & state rules (the “only-X-for-Y” rules)
## Campaign overrides (this series)
## Hard don'ts
```

### Step 4 — Confirm
Summarize the rules, especially the “only-X-for-Y” accent rules and the banned list, and tell the user
the map is ready. From here on, **every build cites this map**; deviations require an explicit override.
