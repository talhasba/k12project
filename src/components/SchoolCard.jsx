import { MapPin, Users, BedDouble } from "lucide-react";
import { Link } from "../router.jsx";
import { money, ages, boardingLabel, countryLabel, headlineFee } from "../lib/data.js";
import { useT } from "../i18n.jsx";
import { isProspectus, useTheme } from "../theme.jsx";
import SchoolCardE from "./SchoolCardE.jsx";
import SchoolCardG from "./SchoolCardG.jsx";
import CompareButton from "../features/comparison/CompareButton.jsx";

// Fallback "photo" for schools without images: a gradient block with initials.
const HUES = [222, 196, 262, 340, 160, 28];
const hue = (id) => HUES[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
export const initials = (name) => name.replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function SchoolCard({ school, lead = false }) {
  const { theme } = useTheme();
  if (theme === "g") return <SchoolCardG school={school} />;
  return <div className={`compare-card${lead ? " compare-card-lead" : ""}`}>
    {isProspectus(theme) ? <SchoolCardE school={school} lead={lead} /> : <RegistryCard school={school} />}
    <CompareButton school={school} />
  </div>;
}

function RegistryCard({ school }) {
  const t = useT();
  const h = hue(school.id);
  const pic = school.images?.card || school.images?.hero;
  const price = headlineFee(school);
  return (
    <Link to={`/schools/${school.id}`} className="card school-card">
      <div className="photo">
        {pic
          ? <img src={pic.src} alt={pic.alt} loading="lazy" style={{ objectPosition: pic.position }} />
          : <div className="ph" style={{ background: `linear-gradient(135deg, hsl(${h} 45% 32%), hsl(${h} 55% 48%))` }}>{initials(school.short_name)}</div>}
        {school.sample ? <span className="chip chip-accent" style={{ position: "absolute", right: 12, top: 12 }}>{t.card.sample}</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3>{school.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-surface-600"><MapPin size={14} /> {[school.city, countryLabel(school.country, t)].filter(Boolean).join(", ")}</p>
        </div>
        <p className="line-clamp-3 text-sm text-surface-600">{school.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {school.qualifications.slice(0, 3).map((q) => <span key={q} className="chip">{q}</span>)}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-surface-200 pt-3 text-xs text-surface-600">
          <span className="flex items-center gap-1"><Users size={14} /> {t.card.ages} {ages(school)}</span>
          <span className="flex items-center gap-1"><BedDouble size={14} /> {boardingLabel(school, t)}</span>
          <span className="col-span-2 text-sm font-bold text-surface-800">
            {price.amount == null ? t.school.fees.quote : money(price.amount, school.fees.currency, t.locale)} <span className="font-normal text-surface-400">{price.amount != null ? `/ ${t.units[price.unit]} ` : ""}({t.card.intl}{price.label ? `, ${price.label}` : ""})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
