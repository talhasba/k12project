# Notes for AI agents (keep reading cheap)

- Start with `README.md` (short). Git and publishing: `push.md`. Status and risks: `summary.md`.
- **Do not read these whole** (they cost tens of thousands of tokens); search for the one id or field you need, or read only the lines you need:
  - `public/data/schools.json`, `public/data/schools.tr.json`, `internal/schools.internal.json`
  - anything under `schools/**/scraped/`, `schools/**/markdown/`, `queenethelburgas/`, `asbourne/`, `St. Clares IB/` (hundreds of scraped pages, not in git)
  - `docs/archive/*` (old history; only for archaeology)
- `schools/<school>/profile.md`: reviewed facts for one school. Open only when working on that school.
- Data field reference: `docs/data-model.md`. Importers `tools/add-<school>.mjs` update only that school's records.
- Code is in `src/` (map in README "Architecture"). Run `npm test` after logic changes.
- Never put school contact details in public data. Never commit `internal/`, `.env` or build output to the wrong repo (see `push.md`: two repos, the source one is private).
