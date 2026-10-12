# 00 · START — Figma asset map (GATE 1)

**Run this on the first turn of a new brand/project, or whenever `system/figma-map.md` is missing or
stale.** Output: a complete, trustworthy `system/figma-map.md` that every later build draws from.
**Do not build anything until this map exists.**

## How the agent must run this

### Step 1 — Confirm access (the local MCP reads the *active desktop Figma tab*)
- Ask the user: **“Which Figma file/page should I map? Please open it (and select the assets page) in
  your desktop Figma so the local Dev Mode MCP can read it.”**
- The canonical source is the brand's design-system / asset-library page (`FIGMA_FILE_KEY` in `.env`)
  for tokens/icons/logos. Reference files are mapped *per job* when a build must match them.
- If the remote Figma API refuses the account, use the **local** Dev Mode MCP or the REST API with the PAT.

### Step 2 — Read the assets
Pull, via the Figma MCP (`get_metadata`, `get_screenshot`, `get_design_context`) and the asset server
`localhost:3845`:
- **Color tokens** — exact hexes from the Brand Colors / Primitive Colors frames (variables are often
  unbound, so read the frames; screenshot + record hexes).
- **Type scale** — font families, weights, sizes, letter-spacing, line-height.
- **Icons** — inventory with **node IDs**; fetch real SVGs where reuse is intended.
- **Logos / lockups** — wordmark, logomark, product badges (with node IDs).
- **Components / spacing / radius / shadow** tokens.

### Step 3 — ASK the user these questions (do not assume)
1. **Which fonts** are in scope for this brand/series, and which is the default? (e.g. a display face vs Inter Tight)
2. **Which icon set** is canonical — brand icons from Figma, or may I fall back to the Universal Icons
   MCP when no brand icon exists?
3. **Which logos/lockups** are approved for marketing use (and any usage restrictions)?
4. **Any assets you expect but I can't find?** (so I can flag gaps instead of inventing them)
5. **Anything explicitly off-limits** (deprecated colors, old logos)?

### Step 4 — Write `system/figma-map.md` using this schema
```
# Figma asset map — <file name> (<fileKey>, page <node>)
_Last mapped: <date> · Source: local Dev Mode MCP_

## Colors (exact Figma hexes)
- <token.name> = #XXXXXX   (e.g. colors.primary 500 = #6366F1)
... full ramps ...

## Type
- Family / weights / sizes / tracking

## Icons (node IDs)
- <name> — node <id> — [SVG fetched? y/n]

## Logos & lockups (node IDs)
## Components / spacing / radius / shadow
## ⚠️ MISSING / NOT IN LIBRARY  (flag — never fabricate these)
- e.g. a failure-state red: NOT in the core palette (confirm the exact token)
## Notes / restrictions
```

### Step 5 — Confirm
Summarize what was mapped and what was flagged as missing, and tell the user the map is ready.
**Never proceed to a build with an unflagged gap.**
