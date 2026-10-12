# work/ — session output area (gitignored)

**Everything a session generates goes here**, in a dated subfolder: `work/YYYY-MM-DD-campaign-name/`.

This entire folder is **gitignored** (except this README) so day-to-day production never registers as
repo changes — a clean `git status` means only the things you *intend* to keep changed.

Each job folder holds its own:
- `out/` — final assets (PNG/PDF/MP4/SVG)
- `_src/` — references / extractions
- `build/` — working files, scripts, intermediate renders
- `NOTES.md` — one-line manifest, open issues, **the feedback given, and what worked / what didn't**.
  Log it as you go; when a lesson generalizes beyond this job, tell Claude Code to **save it to memory**.

Nothing under `work/` is committed. If a deliverable is worth keeping as a reusable reference, copy it
into **`examples/`** (which *is* tracked). Brand/system changes belong in `system/`; docs in `docs/`.
