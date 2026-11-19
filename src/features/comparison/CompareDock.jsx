import { Scale, X } from "lucide-react";
import { useComparison } from "../../context/ComparisonContext.jsx";
import { useT } from "../../i18n.jsx";
import { Link, useRoute } from "../../router.jsx";

export default function CompareDock() {
  const { selected, remove, clear, limitReached } = useComparison();
  const t = useT();
  const path = useRoute().split("?")[0];
  return <>
    {limitReached && <div className="compare-notice" role="status">{t.compare.limit}</div>}
    {selected.length > 0 && !["/compare", "/apply"].includes(path) && <aside className="compare-dock" aria-label={t.compare.title}>
      <div className="compare-dock-label"><Scale size={19} aria-hidden="true" /><strong aria-live="polite">{t.compare.selected(selected.length)}</strong></div>
      <div className="compare-dock-schools">{selected.map(s => <span key={s.id}>{s.short_name || s.name}<button type="button" onClick={() => remove(s.id)} aria-label={t.compare.removeLabel(s.name)}><X size={14} /></button></span>)}</div>
      <div className="compare-dock-actions"><button type="button" className="compare-clear" onClick={clear}>{t.compare.clear}</button><Link className="btn-primary" to="/compare">{t.compare.title} ({selected.length})</Link></div>
    </aside>}
  </>;
}
