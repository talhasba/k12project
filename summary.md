# K12 Onboard: status summary

_Short on purpose. How the code works: README.md. Git and publishing: push.md. Older history: docs/archive/._

## State (19 November 2026)

- 13 schools in 4 countries (UK, Canada, Netherlands, Switzerland), all bilingual EN/TR, all `needs_review`.
- React 19 + Vite 6 with shared providers (`src/app/Providers.jsx`, `src/context/`). Designs: A Registry, E Prospectus (default), F Prospectus Navy, G Modern Ed-Tech. Compare (up to four schools), `/apply` shortlist enquiry and a home-page quick finder exist in all designs.
- Tests: `npm test` (4 unit tests) and an optional browser smoke test (`npm run test:browser`).
- The enquiry form is in **demo mode**: nothing is sent until `VITE_ENQUIRY_ENDPOINT` is set. No backend.
- The public site (GitHub Pages) is a separate repo, `k12project/`; the source is a private repo (see push.md).

## Known risks

- **Photo permission is unverified** for photos taken from the schools' own sites, and the site is public. Only the `open-*.jpg` photos are openly licensed.
- Records are `needs_review`: source pages contradict themselves in places (see each school's `review_flags`, visible with `?review`). Some PDFs were never downloaded, so payment terms, refund rules and guardianship details are missing for some schools.
- **Fee sorting** uses a yearly cost, which is not stored for non-GBP schools or MPW (they sort last); prices are never converted between currencies. MPW's headline is the campus per-term tuition excluding VAT, not a verified international rate.
- Turkish text is machine-written and not reviewed by a native editor, including the "Apply through K12 Onboard" promises.
- `internal/schools.internal.json` holds school contact details: keep the source repo private.
- The project sits in OneDrive; `node_modules` has been wiped by sync once.

## Next steps

1. Decide which design to ship and whether to hide the design switcher (`.env`).
2. Get photo permissions and compress images.
3. Connect the enquiry form to an endpoint (email or CRM) and add spam protection.
4. Download key PDFs (fee terms, admissions, guardian policies), close the `review_flags` and move records to `ready`.
5. Native-speaker review of the Turkish text.
6. Decide how day-only colleges are positioned (copy still says "boarding school abroad").
