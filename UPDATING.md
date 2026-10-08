# Updating tommyhasaresume.online

Reliable beats automatic. The site has one content source:

**`svelte-app/src/data.json`**: every sentence, list, date, and section title on the page.

Nothing parses a Word doc, PDF, or Google Doc. The old hourly Google Doc sync was removed on 2026-09-29. It had failed on every run, and its parser couldn't read a formatted CV.

## When there's a new CV

1. Hand Claude Code the newest CV (PDF or .docx).
2. Claude Code updates `data.json` to match and shows you a readable diff of every changed line.
3. You approve or edit.
4. Claude Code builds and commits:

   ```sh
   cd svelte-app
   npm ci          # first time only
   npm run build   # runs the content check first, then writes docs/build/
   ```

5. Commit `svelte-app/src/data.json` and `docs/build/` together. GitHub Pages serves `docs/`.

## The content check

`npm run build` runs `scripts/check-content.mjs` first and **refuses to build** if the content breaks a standing rule, for example "PhD candidate," anything but exactly ten teaching institutions, KYEM dated "Present," or "crisis communication." Each rule is listed in that file with its reason. Run it by itself with `npm run check`.

## Things that live outside data.json

| What | Where |
|---|---|
| Downloadable CV | Drop the PDF in `docs/cv/` and point `cvLink` in `data.json` at it |
| Audio introduction | Replace `docs/audio/accessibilityaudio.m4a` (same filename) |
| Song for Walking | `docs/audio/Song for Walking.mp3` |
| Photos | `docs/images/`, referenced by filename in `data.json` |
| Accessibility toolbar, analytics, page `<head>` | `docs/index.html` (hand-edited; the build never overwrites it) |

## Running streak

`data.json → streak` holds the start date (`2018-10-15`, which counts as day 1). The count is computed live in each visitor's own time zone, so it rolls over at their midnight. Tokens like `{streakYears}` and `{teachingCount}` in any section text are filled in from the data, so counts can't drift.
