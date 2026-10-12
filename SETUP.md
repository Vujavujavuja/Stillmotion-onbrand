# Setup

## Prerequisites (macOS)
- **Claude Code + a Claude subscription** (Pro/Max or API) — this is a Claude Code project.
- **Figma account** + a **personal access token** (created in step 1).
- **Google Chrome** (headless render), **ffmpeg** (video), **Node ≥ 22** (Remotion, HyperFrames).
- Your **brand font** installed in `~/Library/Fonts`, and named in `--font-brand` in `system/tokens.css`.

## 1. Get your Figma token (PAT)
The token lets the export script pull real assets from Figma over the REST API (it's sent as the
`X-Figma-Token` header). To create one:
1. Sign in at **figma.com** → click your **account name/avatar (top-left)** → **Settings**.
2. Open the **Security** tab → **Personal access tokens** → **Generate new token**.
3. Name it (e.g. `stillmotion`), pick an expiry, and set the scope **File content → Read-only**
   (that's enough to read + export nodes).
4. **Copy it now** — it starts `figd_…` and is shown **only once** (lost it? just generate a new one).
5. `cp .env.example .env`, then set `FIGMA_PAT=figd_…` and `FIGMA_FILE_KEY` (the key in your Figma file's URL). **Never commit `.env`.**

## 2. Open the repo in Claude Code
1. Get the code: `git clone <repo-url> Stillmotion-onbrand` (or use your local copy).
2. `cd Stillmotion-onbrand`, then run **`claude`** (or open the folder in the Claude Code app).
3. It auto-loads `CLAUDE.md`, the skills, and `.mcp.json` — **approve** the skills + MCP prompts when asked.

## 3. Skills (nothing to install)
All skills are **vendored in `.claude/skills/`** and load automatically when you open the repo — you do
**not** install them. To confirm, type `/` in Claude Code (you'll see them) or say **"list your skills."**
Add more later by saying **"find a skill for <thing>"** (uses `find-skills`) or
`npx skills add <owner/repo> -s <name> --copy`.

**Not included:** Anthropic's `docx` / `pdf` / `pptx` / `xlsx` skills (their licence does not allow
redistribution). The storyboard-deck track uses `pptx`; install them from Anthropic's skills repo or the
Claude plugin marketplace.

## 4. Verify
Run `scripts/figma-export.sh <NODE_ID> svg` with any node ID from your file — it should save an SVG.
Then run `00-START-figma.md` + `00-START-brand.md` once to write the two maps (they do not exist yet).

## Optional
- **MCPs** — all optional; the harness works on REST + local tools without them:
  - `icons` — auto via `npx`, no account.
  - **Figma Dev Mode** (`localhost:3845`) — needs the **Figma desktop app** running (same Figma account).
  - **Higgsfield** (AI image/video/audio) — needs a **Higgsfield account + credits**; add per-user:
    `claude mcp add --transport http higgsfield <url>`, then authenticate (OAuth).
- **Whisper** (only for video transcription): install on demand — see `system/whisper-models/README.md`.

## Where things go
Every job writes to **`work/<YYYY-MM-DD-job>/`**, which is **gitignored** (nothing there is committed).
Keepers go in `examples/`; brand/system changes in `system/`; docs in `docs/`. Present per `END.md`.
