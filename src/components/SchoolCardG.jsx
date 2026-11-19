import { ArrowUpRight } from "lucide-react";
import { Link } from "../router.jsx";
import { useT } from "../i18n.jsx";
import { ages, boardingLabel, countryLabel, headlineFee, money } from "../lib/data.js";
import SchoolMedia from "./SchoolMedia.jsx";
import CompareButton from "../features/comparison/CompareButton.jsx";

export default function SchoolCardG({ school }) {
  const t = useT(), h = headlineFee(school);
  return <article className="g-school-card">
    <Link to={`/schools/${school.id}`} aria-label={school.name}><SchoolMedia image={school.images?.card || school.images?.hero} name={school.name} /></Link>
    <div className="g-school-card-body"><p className="g-location">{school.city}, {countryLabel(school.country,t)}{school.english_support.length ? " · EAL" : ""}</p>
      <h3><Link to={`/schools/${school.id}`}>{school.name}</Link></h3><p className="g-card-tag">{school.tagline}</p>
      <div className="g-card-meta"><p>{school.qualifications.slice(0,3).join(" · ")}</p><p>{school.age_min != null ? `${t.card.ages} ${ages(school)} · ` : ""}{boardingLabel(school,t)}</p></div>
      <div className="g-card-fee"><span>{t.school.fees.intlFee}</span><strong>{h.amount == null ? t.school.fees.quote : `${money(h.amount,school.fees.currency,t.locale)} / ${t.units[h.unit]}`}</strong><small>{h.label}</small></div>
      <div className="g-card-actions"><CompareButton school={school} /><Link to={`/schools/${school.id}`}>{t.modern.details}<ArrowUpRight size={15} /></Link></div>
    </div>
  </article>;
}
