import { useEffect, useMemo, useState } from "react";
import { Menu, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import Filters from "../components/Filters.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import SchoolCard from "../components/SchoolCard.jsx";
import { Loading, ErrorNote, useSchools } from "../components/Async.jsx";
import { FILTER_QUALS, annualFee, boardingValues, qualValues, setTitle, unique } from "../lib/data.js";
import { useLang } from "../i18n.jsx";
import { isProspectus, useTheme } from "../theme.jsx";
import { INITIAL_FILTERS as INITIAL, useCatalogue } from "../context/CatalogueContext.jsx";

export default function CataloguePage() {
  const { schools, error } = useSchools();
  const { t } = useLang();
  const { theme } = useTheme();
  const C = t.catalogue;
  const { state, setState } = useCatalogue();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setTitle(C.title, t), [C.title, t]);
  const set = (key, value) => setState((cur) => ({ ...cur, [key]: value }));

  // Filter values are language-neutral (country, qualification and boarding codes), so selections survive a language switch.
  const options = useMemo(() => schools ? ({
    countries: unique(schools, (s) => s.country),
    // Only GCSE, A Level, IB and AP are offered as programme filters (see FILTER_QUALS in lib/data.js).
    qualifications: FILTER_QUALS.filter((q) => schools.some((s) => qualValues(s).includes(q))),
    // "Weekly" boarding is not offered as a filter (schools that have it still show it on cards and pages).
    boarding: unique(schools, boardingValues).filter((b) => b !== "Weekly"),
  }) : null, [schools]);
  const counts = useMemo(() => schools ? ({
    countries: schools.reduce((acc, s) => ({ ...acc, [s.country]: (acc[s.country] || 0) + 1 }), {}),
  }) : null, [schools]);

  const results = useMemo(() => {
    if (!schools) return [];
    const q = state.q.trim().toLocaleLowerCase(t.locale);
    const has = (picked, values) => !picked.length || values.some((v) => picked.includes(v));
    const list = schools.filter((s) =>
      (!q || [s.name, s.city, s.country, t.countries[s.country] || "", s.tagline].join(" ").toLocaleLowerCase(t.locale).includes(q)) &&
      has(state.countries, [s.country]) &&
      has(state.qualifications, qualValues(s)) &&
      has(state.boarding, boardingValues(s)) &&
      (!state.english || s.english_support.length > 0));
    // Sort on the yearly cost so per-term and per-year schools compare fairly.
    const fee = (s) => annualFee(s) ?? Infinity;
    if (state.sort === "fee-asc") list.sort((a, b) => fee(a) - fee(b));
    else if (state.sort === "fee-desc") list.sort((a, b) => (annualFee(b) ?? -1) - (annualFee(a) ?? -1));
    else list.sort((a, b) => a.name.localeCompare(b.name, t.locale));
    return list;
  }, [schools, state, t]);

  if (error) return <ErrorNote message={error} t={t} />;
  if (!schools) return <Loading />;

  const active = state.countries.length + state.qualifications.length + state.boarding.length + (state.english ? 1 : 0) + (state.q ? 1 : 0);
  const panel = <Filters options={options} state={state} set={set} counts={counts} />;
  const pro = isProspectus(theme);
  const samples = schools.filter((s) => s.sample).length;

  return (
    <>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">{C.eyebrow}</p>
          <h1 className="text-2xl font-bold text-surface-800">{C.heading}</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-surface-400"><strong className="font-bold text-surface-800">{C.count(results.length)}</strong></p>
          <button className="btn-ghost lg:hidden" type="button" onClick={() => setDrawer(true)}><Menu size={16} /> {C.filters}</button>
        </div>
      </div>
      {samples ? <p className="mb-5 rounded-lg bg-accent-50 px-3 py-2 text-xs text-accent-600">{C.samples(samples)}</p> : null}

      <div className="flex gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="card sticky top-24 p-5">
            <div className="f-head mb-4 flex items-center justify-between">
              <h2 className="font-bold text-surface-800">{pro ? <><SlidersHorizontal size={20} aria-hidden="true" /> {C.customize}</> : C.filters}</h2>
              {active ? <button className="flex items-center gap-1 text-xs font-semibold text-brand-600" type="button" onClick={() => setState(INITIAL)}>{pro ? null : <RotateCcw size={13} />} {pro ? C.clear : C.clearAll}</button> : null}
            </div>
            {panel}
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {results.length ? (
            <div className="e-grid grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((s) => <SchoolCard key={s.id} school={s} />)}</div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-surface-600">{C.noResults}</p>
              <button className="btn-ghost mt-4" type="button" onClick={() => setState(INITIAL)}>{C.clearFilters}</button>
            </div>
          )}
        </section>

        {/* Design E / F, screens 1200px and wider: the enquiry form stays in view on the right. */}
        {pro ? (
          <aside className="c-side" aria-label={t.school.request}>
            <div className="c-side-in">
              <h2>{t.school.request}</h2>
              <p className="se-side-sub">{t.home.steps[t.home.steps.length - 1].text}</p>
              <EnquiryForm variant="bare" hideHeading />
            </div>
          </aside>
        ) : null}
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="fixed inset-0 bg-black/40" type="button" aria-label={C.close} onClick={() => setDrawer(false)} />
          <aside className="fixed inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-200 px-4 py-4">
              <h2 className="text-lg font-bold">{C.filters}</h2>
              <button className="rounded-lg p-2 hover:bg-surface-100" type="button" aria-label={C.close} onClick={() => setDrawer(false)}><X size={20} /></button>
            </div>
            <div className="p-4">{panel}</div>
            <div className="sticky bottom-0 flex gap-3 border-t border-surface-200 bg-white p-4">
              <button className="btn-ghost flex-1" type="button" onClick={() => setState(INITIAL)}>{C.clear}</button>
              <button className="btn-primary flex-1" type="button" onClick={() => setDrawer(false)}>{C.show(results.length)}</button>
            </div>
          </aside>
        </div>
      ) : null}
    </main>

    {/* Narrower screens: the same form as a panel at the end of the page. */}
    {pro ? (
      <section className="se-enquire c-bottom">
        <div className="se-wrap se-enquire-in">
          <div className="se-enquire-l">
            <p className="e-kicker">{t.school.enquiry.charAt(0) + t.school.enquiry.slice(1).toLocaleLowerCase(t.locale)}</p>
            <h2>{t.school.request}</h2>
            <p>{t.home.steps[t.home.steps.length - 1].text}</p>
          </div>
          <div className="se-enquire-r"><EnquiryForm variant="bare" hideHeading /></div>
        </div>
      </section>
    ) : null}
    </>
  );
}
