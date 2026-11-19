import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ages, annualFee, boardingLabel, countryLabel, headlineFee, money } from "../../lib/data.js";
import { useT } from "../../i18n.jsx";

/* ---------- data helpers (all take the UI dictionary `t` for labels) ---------- */
// Turkish puts the percent sign first (%40), English after (40%).
const pct = (n, t) => (t.locale === "tr-TR" ? `%${n}` : `${n}%`);

export const heroFacts = (s, t) => [
  [s.boarding.available ? t.school.facts.agesBoarding : t.school.facts.ages, ages(s)],
  [t.school.facts.boarding, boardingLabel(s, t)],
  [t.school.facts.students, s.students_total],
  [t.school.facts.intl, s.international_share_percent != null ? pct(s.international_share_percent, t) : ""],
].filter(([, v]) => v);

export const location = (s, t) => [s.city, s.region, countryLabel(s.country, t)].filter(Boolean).join(", ");

// headline = the single price in the fee box ("per term" for most schools, "per year" when term fees differ);
// sub = the small line under it.
export function feeNumbers(s, t) {
  const f = s.fees;
  const annual = annualFee(s);
  const h = headlineFee(s);
  const m = (n) => money(n, f.currency, t.locale);
  const incl = (f.includes || []).join(" + ").toLocaleLowerCase(t.locale);
  const sub = f.headline
    ? [h.label.charAt(0).toLocaleUpperCase(t.locale) + h.label.slice(1), h.alt].filter(Boolean).join(" · ")
    : annual ? t.school.fees.aboutYear(m(annual), incl) : "";
  return {
    headline: h.amount == null ? t.school.fees.quote : m(h.amount),
    unit: h.unit,
    unitWord: h.amount == null ? "" : t.units[h.unit],
    per: h.amount == null ? "" : t.perUnit(h.unit),
    headlineLabel: h.label,
    sub,
    annual: annual ? m(annual) : null,
    registration: f.registration_fee != null ? m(f.registration_fee) : null,
    year: f.academic_year,
    terms: f.terms_per_year,
    includes: (f.includes || []).join(", "),
  };
}

// Sections that exist for this school, in page order.
export function sectionList(s, t) {
  const a = s.admissions;
  const S = t.school.sections;
  return [
    { id: "about", label: S.about },
    // School districts (e.g. Delta): one page, with the member schools listed as a section instead of one page each.
    { id: "district-schools", label: S.schools, title: S.schoolsTitle, show: !!s.district_schools?.length },
    { id: "fees", label: S.fees, title: S.feesTitle },
    { id: "boarding", label: S.boarding, show: s.boarding.available },
    // Day schools: where students live + guardianship instead of a boarding section.
    { id: "accommodation", label: S.accommodation, title: S.accommodationTitle, show: !s.boarding.available && !!s.accommodation },
    { id: "academics", label: S.academics, title: S.academicsTitle },
    { id: "admissions", label: S.admissions, show: !!(a.intake || a.entry_routes.length || a.steps.length) },
    { id: "facilities", label: S.facilities, show: s.facilities.length > 0 },
    // Customers apply through K12 Onboard: no school contact details or links are shown.
    { id: "apply", label: S.apply, title: S.applyTitle },
  ].filter((x) => x.show !== false).map((x) => ({ ...x, title: x.title || x.label }));
}

// Photos with their own open licence (CC BY-SA etc.) carry `credit: { author, license, licenseUrl, sourceUrl }`;
// the licence requires showing it, so every such photo is listed in the "Apply" section.
export function licensedImages(s) {
  const out = [];
  const seen = new Set(); // the same photo can be hero, card and gallery image: list it once
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object" && v.credit && typeof v.credit === "object" && !seen.has(v.src)) { seen.add(v.src); out.push(v); }
  };
  Object.values(s.images || {}).forEach(walk);
  return out;
}

/* ---------- small pieces ---------- */
export function Gallery({ images, className = "" }) {
  if (!images || !images.length) return null;
  return (
    <div className={`gal s-gal ${className}`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${images.length > 2 ? 200 : 260}px), 1fr))` }}>
      {images.map((im) => (
        <figure key={im.src}><img src={im.src} alt={im.alt} loading="lazy" style={{ objectPosition: im.position }} /></figure>
      ))}
    </div>
  );
}

export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return undefined;
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
      const visible = [...seen.entries()].filter(([, top]) => top !== null).sort((x, y) => x[1] - y[1]);
      if (visible.length) setActive(visible[0][0]);
    }, { rootMargin: "-20% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

const Kv = ({ rows }) => (
  <dl className="s-kv">
    {rows.filter(([, v]) => v).map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
  </dl>
);

const List = ({ items, cls = "" }) => (items && items.length ? <ul className={`s-list ${cls}`}>{items.map((i) => <li key={i}>{i}</li>)}</ul> : null);

/* ---------- section bodies (the three layouts wrap these in their own frames) ---------- */
export function SectionBody({ id, school: s }) {
  const t = useT();
  const T = t.school;
  const img = s.images || {};
  const fee = feeNumbers(s, t);
  const a = s.admissions;
  const licensed = licensedImages(s);

  if (id === "about") {
    const rows = [[T.about.type, s.school_type], [T.about.gender, s.gender], [T.about.nationalities, s.nationalities], [T.about.founded, s.founded], [T.about.yearGroups, s.year_groups]].filter(([, v]) => v);
    return (
      <>
        <p className="s-lead">{s.summary}</p>
        <Gallery images={img.about} className="s-mt" />
        <dl className="s-kv-grid">
          {rows.map(([k, v]) => (<div key={k} className={v.length > 28 ? "wide" : ""}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
        <List items={s.highlights} cls="s-mt" />
      </>
    );
  }

  if (id === "district-schools") {
    const D = T.districtTable;
    const n = (v) => (typeof v === "number" ? v.toLocaleString(t.locale) : v);
    return (
      <>
        <div className="s-table-wrap">
          <table className="s-table">
            <thead><tr>{[D.school, D.community, D.students, D.intl, D.schedule].map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{s.district_schools.map((x) => (<tr key={x.name}><td>{x.name}</td><td>{x.community}</td><td>{n(x.students)}</td><td>{n(x.international)}</td><td>{x.schedule}</td></tr>))}</tbody>
          </table>
        </div>
        {s.district_schools.map((x) => (
          <div key={x.name} className="s-tier">
            <h3 className="s-h3">{x.name}</h3>
            {x.image ? <figure className="s-dfig"><img src={x.image.src} alt={x.image.alt} loading="lazy" style={{ objectPosition: x.image.position }} /></figure> : null}
            {x.programmes && x.programmes.length ? <div className="s-chips">{x.programmes.map((p) => <span key={p} className="s-chip">{p}</span>)}</div> : null}
            <p className="s-p">{x.summary}</p>
          </div>
        ))}
        {s.district_schools_note ? <p className="s-small s-mt">{s.district_schools_note}</p> : null}
      </>
    );
  }

  if (id === "fees") {
    return (
      <>
        <div className="s-feebig">
          <div>
            <span className="s-l">{fee.unit === "year" ? T.fees.perYear(fee.year, fee.headlineLabel) : T.fees.perTerm(fee.year)}</span>
            <span className="s-v s-hot">{fee.headline}</span>
          </div>
          {fee.unit === "term" && fee.annual ? <div><span className="s-l">{T.fees.perYearCalc(fee.terms)}</span><span className="s-v">{fee.annual}</span></div> : null}
          {fee.registration ? <div><span className="s-l">{T.fees.registration}</span><span className="s-v">{fee.registration}</span></div> : null}
        </div>
        {(s.fees.tiers || []).map((tier) => (
          <div key={tier.label} className="s-tier">
            <h3 className="s-h3">{tier.label}</h3>
            <div className="s-table-wrap">
              <table className="s-table">
                <thead><tr>{tier.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>{tier.rows.map((r, i) => (<tr key={i}>{r.map((cell, j) => <td key={j}>{typeof cell === "number" ? money(cell, s.fees.currency, t.locale) : cell}</td>)}</tr>))}</tbody>
              </table>
            </div>
            {tier.note ? <p className="s-small">{tier.note}</p> : null}
          </div>
        ))}
        <Kv rows={[[T.fees.includes, fee.includes], [T.fees.deposit, s.fees.deposit], [T.fees.payment, s.fees.payment]]} />
        <List items={s.fees.notes} cls="s-small s-mt" />
      </>
    );
  }

  if (id === "boarding") {
    const types = s.boarding.types.map((x) => t.boardingTypes[x] || x).join(T.listJoin);
    return (
      <>
        <p className="s-strong">{T.boardingLine(types, s.boarding.from_year)}</p>
        <List items={s.boarding.notes} />
        <Gallery images={img.boarding} className="s-mt" />
      </>
    );
  }

  if (id === "accommodation") {
    const ac = s.accommodation;
    return (
      <>
        <p className="s-strong">{ac.summary}</p>
        <List items={ac.notes} />
        {ac.guardianship ? <p className="s-p s-mt"><strong>{T.guardianship}</strong> {ac.guardianship}</p> : null}
      </>
    );
  }

  if (id === "academics") {
    return (
      <>
        <div className="s-chips">{s.qualifications.map((q) => <span key={q} className="s-chip">{q}</span>)}</div>
        {s.english_support.length ? <List items={s.english_support} cls="s-mt0" /> : <p className="s-small">{T.noEnglish}</p>}
        {s.results.length ? (
          <div className="s-results">
            {s.results.map((r) => (<div key={r.label}><b>{r.value}</b><span>{r.label} ({r.year})</span></div>))}
          </div>
        ) : null}
      </>
    );
  }

  if (id === "admissions") {
    return (
      <>
        {a.intake ? <p className="s-p"><strong>{T.intake}</strong> {a.intake}</p> : null}
        {a.note ? <p className="s-p">{a.note}</p> : null}
        {a.entry_routes.length ? (
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr>{[T.table.year, T.table.programme, T.table.requirement, T.table.starts].map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{a.entry_routes.map((r, i) => (<tr key={i}><td>{r.year}</td><td>{r.programme}</td><td>{r.requirement}</td><td>{r.starts}</td></tr>))}</tbody>
            </table>
          </div>
        ) : null}
        <div className="s-split">
          {a.steps.length ? (<div className="s-col-wide"><h3 className="s-h3">{T.howToApply}</h3><ol className="s-steps">{a.steps.map((x) => <li key={x}>{x}</li>)}</ol></div>) : null}
          <div className="s-col">
            {a.documents.length ? (<div><h3 className="s-h3">{T.documents}</h3><List items={a.documents} cls="s-mt0" /></div>) : null}
            {a.assessments.length ? (<div><h3 className="s-h3">{T.assessments}</h3><List items={a.assessments} cls="s-mt0" /></div>) : null}
          </div>
        </div>
      </>
    );
  }

  if (id === "facilities") {
    return (
      <>
        <List items={s.facilities} cls="s-cols s-mt0" />
        <Gallery images={img.facilities} className="s-mt" />
      </>
    );
  }

  // apply: replaces the old "contact and sources" block. Families apply through K12 Onboard.
  return (
    <>
      <p className="s-lead">{T.apply.lead(s.name)}</p>
      <ul className="s-apply">
        {T.apply.points.map((p) => <li key={p}><Check size={18} aria-hidden="true" /> <span>{p}</span></li>)}
      </ul>
      <a className="btn-primary s-mt" href="#enquire">{T.apply.cta} <ArrowRight size={16} /></a>
      {img.credit ? <p className="credit">{img.credit}</p> : null}
      {licensed.length ? (
        <p className="credit">
          {T.photoCredits}:{" "}
          {licensed.map((im, i) => (
            <span key={im.src}>{i ? "; " : " "}{im.credit.title ? `${im.credit.title}: ` : ""}{im.credit.author}, <a href={im.credit.licenseUrl} target="_blank" rel="noreferrer">{im.credit.license}</a> (<a href={im.credit.sourceUrl} target="_blank" rel="noreferrer">{T.photoSource}</a>, {T.photoNote})</span>
          ))}
        </p>
      ) : null}
    </>
  );
}

export function ReviewFlags({ school }) {
  const t = useT();
  if (!school.review_flags.length) return null;
  return (
    <div className="review-box">
      <strong>{t.school.reviewTitle}</strong>
      <ul>{school.review_flags.map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
  );
}
