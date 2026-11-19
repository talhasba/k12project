import { Link } from "../router.jsx";
import { money, ages, boardingLabel, countryLabel, headlineFee } from "../lib/data.js";
import { useT } from "../i18n.jsx";

const initials = (name) => name.replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toLocaleUpperCase();

// Design E "Prospectus": photo first, then a printed-prospectus fee line with a dotted leader.
// `lead` makes the card a wide feature story (photo left, text right) on wide screens.
export default function SchoolCardE({ school, lead = false }) {
  const t = useT();
  const pic = school.images?.card || school.images?.hero;
  const price = headlineFee(school);
  const place = [school.city, countryLabel(school.country, t)].filter(Boolean).join(", ");
  const quals = school.qualifications.slice(0, 3).join(" · ");
  return (
    <Link to={`/schools/${school.id}`} className={`e-card${lead ? " e-card-lead" : ""}`}>
      <div className="e-card-photo">
        {pic
          ? <img src={pic.src} alt={pic.alt} loading="lazy" style={{ objectPosition: pic.position }} />
          : <div className="e-card-ph" aria-hidden="true">{initials(school.short_name || school.name)}</div>}
        {school.sample ? <span className="e-card-sample">{t.card.sample}</span> : null}
      </div>
      <div className="e-card-body">
        <p className="e-card-loc">{place}</p>
        <h3>{school.name}</h3>
        <p className="e-card-tag">{school.tagline}</p>
        <p className="e-card-meta">{[quals, school.age_min != null ? `${t.card.ages} ${ages(school)}` : "", boardingLabel(school, t)].filter(Boolean).join(" · ")}</p>
        <p className="e-card-fee">
          <span className="e-card-fee-l">{t.school.fees.intlFee}</span>
          <span className="e-card-fee-dots" aria-hidden="true" />
          <span className="e-card-fee-v">
            {price.amount == null ? t.school.fees.quote : money(price.amount, school.fees.currency, t.locale)}
            {price.amount != null ? <small> / {t.units[price.unit]}</small> : null}
          </span>
        </p>
        {/* What the figure covers (e.g. "excl. VAT"); an empty line keeps the fee rows level across a grid row. */}
        <p className="e-card-fee-note">{price.label ? price.label.charAt(0).toLocaleUpperCase(t.locale) + price.label.slice(1) : " "}</p>
      </div>
    </Link>
  );
}
