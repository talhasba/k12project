import { useEffect, useState } from "react";
import { ArrowRight, Scale, X } from "lucide-react";
import { useSchools, Loading, ErrorNote } from "../components/Async.jsx";
import { useComparison } from "../context/ComparisonContext.jsx";
import { useT } from "../i18n.jsx";
import { Link } from "../router.jsx";
import { setTitle } from "../lib/data.js";
import { COMPARE_LIMIT, rowDiffers } from "../lib/comparison.js";
import { comparisonRows } from "../features/comparison/rows.js";
import SchoolMedia from "../components/SchoolMedia.jsx";

export default function ComparePage() {
  const { schools, error } = useSchools();
  const { selected, ids, add, remove, clear } = useComparison();
  const t = useT(), C = t.compare;
  const [highlight, setHighlight] = useState(true);
  const [only, setOnly] = useState(false);
  useEffect(() => setTitle(C.title, t), [C.title, t]);
  if (error) return <ErrorNote message={error} t={t} />;
  if (!schools) return <Loading />;
  const rows = comparisonRows(t).filter(row => row.key !== "district" || selected.some(s => s.district_schools?.length));
  const visible = rows.filter(row => !only || selected.length < 2 || rowDiffers(selected.map(row.value)));
  return <main className="comparison-page">
    <header className="comparison-heading"><div><p className="eyebrow">{C.eyebrow}</p><h1>{C.title}</h1><p>{C.subtitle}</p></div>
      {selected.length > 0 && <Link to="/apply" className="btn-primary">{C.apply}<ArrowRight size={16} /></Link>}
    </header>
    <div className="comparison-controls">
      {ids.length < COMPARE_LIMIT && <label><span>{C.addSchool}</span><select className="input" value="" onChange={e => e.target.value && add(e.target.value)}><option value="">{C.choose}</option>{schools.filter(s => !ids.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
      {selected.length >= 2 && <><label className="compare-check"><input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} />{C.highlight}</label><label className="compare-check"><input type="checkbox" checked={only} onChange={e => setOnly(e.target.checked)} />{C.only}</label></>}
      {selected.length > 0 && <button className="btn-ghost" type="button" onClick={clear}>{C.clear}</button>}
    </div>
    {!selected.length ? <section className="comparison-empty"><Scale size={32} aria-hidden="true" /><h2>{C.emptyTitle}</h2><p>{C.emptyText}</p><Link to="/schools" className="btn-primary">{C.browse}</Link></section> : <>
      {selected.length === 1 && <p className="comparison-tip">{C.oneNote}</p>}
      <p className="comparison-fee-note">{C.feeNote}</p>
      <p className="comparison-scroll-note" id="compare-scroll">{C.scroll}</p>
      <div className="comparison-scroll" role="region" aria-label={C.title} aria-describedby="compare-scroll" tabIndex={0}>
        <table className="comparison-table"><caption className="sr-only">{C.title}</caption><thead><tr><th scope="col">{C.eyebrow}</th>{selected.map(s => <th key={s.id} scope="col"><SchoolMedia image={s.images?.card || s.images?.hero} name={s.name} /><div className="comparison-school"><h2><Link to={`/schools/${s.id}`}>{s.name}</Link></h2><button type="button" onClick={() => remove(s.id)} aria-label={C.removeLabel(s.name)}><X size={17} /></button></div><Link className="comparison-view" to={`/schools/${s.id}`}>{C.view} →</Link></th>)}</tr></thead>
          <tbody>{visible.map(row => {
            const values = selected.map(row.value), different = rowDiffers(values);
            return <tr key={row.key} data-different={highlight && different || undefined}><th scope="row">{row.label}</th>{values.map((items, i) => <td key={selected[i].id}>{items.length ? <ul>{items.map((item,j) => <li key={j}>{item}</li>)}</ul> : <span className="comparison-unknown">{C.unknown}</span>}</td>)}</tr>;
          })}{!visible.length && <tr><td colSpan={selected.length+1}>{C.noDifferences}</td></tr>}</tbody>
        </table>
      </div>
    </>}
  </main>;
}
