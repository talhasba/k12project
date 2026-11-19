import { useEffect } from "react";
import { X } from "lucide-react";
import { useComparison } from "../context/ComparisonContext.jsx";
import { useSchools, Loading, ErrorNote } from "../components/Async.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import { Link } from "../router.jsx";
import { useT } from "../i18n.jsx";
import { setTitle } from "../lib/data.js";

export default function ApplyPage() {
  const { selected, remove } = useComparison();
  const { schools, error } = useSchools();
  const t = useT();
  useEffect(() => setTitle(t.shortlist.title, t), [t]);
  if (error) return <ErrorNote message={error} t={t} />;
  if (!schools) return <Loading />;
  return <main className="shortlist-page"><section><p className="eyebrow">{t.compare.eyebrow}</p><h1>{t.shortlist.title}</h1><p>{t.shortlist.lead}</p><h2>{t.shortlist.selection}</h2>
    {selected.length ? <ul className="shortlist-schools">{selected.map(s => <li key={s.id}><Link to={`/schools/${s.id}`}>{s.name}</Link><button type="button" aria-label={t.compare.removeLabel(s.name)} onClick={() => remove(s.id)}><X size={18} /></button></li>)}</ul> : <p>{t.shortlist.empty}</p>}
    <Link className="btn-ghost" to="/compare">{t.shortlist.add}</Link>
    </section><EnquiryForm schools={selected} title={t.shortlist.form} /></main>;
}
