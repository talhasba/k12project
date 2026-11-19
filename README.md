# K12 Onboard

Bilingual (Turkish default, English) catalogue of international high schools: families filter, compare up to four schools and apply through K12 Onboard's advisers. 13 entries in the UK, Canada, the Netherlands and Switzerland. React 19, Vite 6, Tailwind 4, plain JS/JSX, own History-API router, JSON loaded at runtime. No backend.

**AI agents: read [AGENTS.md](AGENTS.md) first** (what not to read, to save tokens).

```bash
npm install
npm run dev            # http://127.0.0.1:5173
npm run build          # static output in dist/ (base /)
npm test               # unit tests (comparison state, routes)
npm run test:browser   # browser smoke test (optional, needs a dev server)
```

## Repositories and publishing

- The project root is a **private** git repo (source). `k12project/` inside it is a **separate public** repo (`github.com/talhasba/k12project`) holding only the built site; the root repo ignores it.
- Publish: `npm run publish:pages` (builds with base `/k12project/`, copies into `k12project/`), then commit and push **from `k12project/`**. Never use `npm run build` for Pages. Live at https://talhasba.github.io/k12project/.
- Full procedure, git location, authentication and rules: **[push.md](push.md)**.

## Languages

Turkish is the default; the EN/TR button switches (`localStorage` `lang`, or `?lang=en|tr`).

- Interface text: `src/content/ui.js` (same shape per language; missing Turkish keys fall back to English) and `src/content/features.js` (compare/quick-finder copy). Hooks: `useLang()` / `useT()` in `src/i18n.jsx`.
- School content: English in `public/data/schools.json`, Turkish text only in `public/data/schools.tr.json`, merged over the English record by id (objects key by key, arrays of objects item by item, other arrays replaced).
- Do **not** translate `id`, `country`, `qualifications` or `boarding.types` (they are filter values; labels come from `ui.js`). UK year names and programme names stay in English. Money is formatted per language (`£23.330` / `£23,330`).

## Applications and private data

Schools' websites, emails, phones, addresses and source links are **not** in public data or on any page. They live in `internal/schools.internal.json` (never deployed). Every call to action points to the enquiry form ("Apply through K12 Onboard"). New schools: contact details and sources go in the internal file only.

## Designs

Four switchable designs; choice is remembered in `localStorage`. Use the **Design** control (bottom-left) or `?theme=a|e|f|g`. B, C, D were removed.

| Theme | Look | Files |
|---|---|---|
| A Registry | Navy, serif, numbered sections | `src/themes/a.css`, `src/pages/school/LayoutA.jsx` |
| E Prospectus (default) | Warm paper, green and clay, Fraunces + Instrument Sans, photo-led; school page is a long read with a sticky enquiry form on the right | `e.css`, `LayoutE.jsx`, `HomeE.jsx`, `SchoolCardE.jsx` |
| F Prospectus Navy | E recoloured (navy, burgundy, cool paper) | token block `html[data-theme="f"]` in `e.css` only |
| G Modern Ed-Tech | Blue/slate, white rounded cards, Plus Jakarta Sans + DM Sans, split hero | `g.css`, `HomeG.jsx`, `LayoutG.jsx`, `SchoolCardG.jsx` |

- Each theme defines colour/font/corner tokens as CSS variables on `<html data-theme>`; the school page has one layout per theme but all share the content blocks (`src/pages/school/shared.jsx`, `src/themes/blocks.css`).
- E and F share all code via `isProspectus()` in `theme.jsx` and `:is([data-theme="e"], [data-theme="f"])` in `e.css`. A new palette = a token block in `e.css` + entries in `THEMES`/`isProspectus()` (`theme.jsx`), `LAYOUTS` (`SchoolPage.jsx`), and the allow-lists in `index.html`.
- Catalogue filters offer only GCSE, A Level, IB and AP (`FILTER_QUALS` / `qualValues()` in `src/lib/data.js`) and no Weekly boarding option. E/F show a soft pill panel with counts (`Filters.jsx`, `.f-*` in `e.css`) and the enquiry form on the right from 1200px.
- `.env` (see `.env.example`): `VITE_DEFAULT_THEME=a|e|f|g` (E when unset), `VITE_SHOW_THEME_SWITCHER=false` hides the switcher, `VITE_ENQUIRY_ENDPOINT` makes the form live.

## Routes

| Route | Page |
|---|---|
| `/` | Home: hero, quick school finder, how it works, featured schools |
| `/schools` | Catalogue: search, filters (country, programme, boarding, English support), sort |
| `/schools/<id>` | School profile (layout per theme). `?review` shows review flags |
| `/about` | About + general enquiry form |
| `/compare` | Compare up to four schools, highlight differences |
| `/apply` | Enquiry form with the selected shortlist |

## Architecture (`src/`)

- `main.jsx`, `App.jsx`, `router.jsx`, `app/Providers.jsx` (language, theme, schools, catalogue filters, comparison), `app/routes.js` (route matching).
- `context/` (`SchoolsContext`, `CatalogueContext`, `ComparisonContext`), `pages/`, `components/`, `features/comparison/`, `content/`, `lib/` (`data.js` loading/merging/fee helpers, `enquiry.js`, `comparison.js`), `themes/`, `styles.css`.
- Quick finder (`components/QuickFinder.jsx`): country, programme, boarding, English support with a live count; writes to `CatalogueContext` and opens `/schools`.
- Comparison: up to four unique school ids in `localStorage` (`k12-compare-ids`; stale ids dropped); fees keep currency, year and scope, no conversion or ranking. `/apply` submits `schoolIds` to the existing enquiry function.
- Enquiry form: runs in **demo mode** (sends nothing) until `VITE_ENQUIRY_ENDPOINT` is set; client validation plus a honeypot; no server code.

## Data

- Catalogue: `public/data/schools.json` (English, one object per school), `schools.tr.json` (Turkish overlay), `internal/schools.internal.json` (private). Field reference: [docs/data-model.md](docs/data-model.md). **These JSON files are large; search them instead of reading them whole.**
- Importers: `tools/add-<school>.mjs` replace only that school's records (EN, TR, internal); `tools/scrape-*.mjs` are resumable scrapers. Per-school reviewed facts and decisions: `schools/<school>/profile.md`. Raw scrapes stay local (not in git).
- Rules: annual fee is derived (per term x terms), never stored, except where a school sets `fees.annual`; for per-year or mixed prices set `fees.headline` and `fees.tiers`. `fees.annual` is left empty for non-GBP schools so fee sorting does not compare currencies. `review_flags` lists source conflicts and unpublished fields. Day schools set `boarding.available: false` plus an `accommodation` block; day places at boarding schools set `boarding.day_option: true`.
- Images: `public/images/<school>/`; each image has `src`, `alt`, optional `position`. Photos come from the schools' own sites (credited "© school", **publication permission not verified**) or are openly licensed CC BY-SA (`open-*.jpg`, credited on the page). Get permission before wide publication.
- Per-school import history and older notes: [docs/archive/school-import-notes.md](docs/archive/school-import-notes.md), [docs/archive/project-history.md](docs/archive/project-history.md) (not needed for normal work).

## Not included (yet)

Pagination, an offer builder, an API route, image optimisation, a native-speaker review of the Turkish text.
