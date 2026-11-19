import { Check, Plus } from "lucide-react";
import { useComparison } from "../../context/ComparisonContext.jsx";
import { useT } from "../../i18n.jsx";

export default function CompareButton({ school, className = "" }) {
  const { ids, toggle } = useComparison();
  const t = useT();
  const selected = ids.includes(school.id);
  return <button type="button" className={`compare-button ${className}`} aria-pressed={selected}
    aria-label={selected ? t.compare.removeLabel(school.name) : t.compare.addLabel(school.name)} onClick={() => toggle(school.id)}>
    {selected ? <Check size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
    {selected ? t.compare.added : t.compare.add}
  </button>;
}
