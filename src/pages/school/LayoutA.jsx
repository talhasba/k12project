import { MapPin } from "lucide-react";
import { Link } from "../../router.jsx";
import EnquiryForm from "../../components/EnquiryForm.jsx";
import { countryLabel } from "../../lib/data.js";
import { useT } from "../../i18n.jsx";
import { SectionBody, ReviewFlags, feeNumbers, heroFacts, location, sectionList, useScrollSpy } from "./shared.jsx";

// Design A "Registry": navy hero, numbered sections, section index, fee card + form sidebar.
export default function LayoutA({ school: s, review }) {
  const t = useT();
  const sections = sectionList(s, t);
  const active = useScrollSpy(sections.map((x) => x.id));
  const fee = feeNumbers(s, t);
  const hero = s.images?.hero;

  return (
    <div className="sa">
      <div className="sa-crumb"><div className="sa-wrap"><Link to="/schools">{t.school.crumb}</Link> <span aria-hidden="true">/</span> <b>{s.name}</b></div></div>

      <section className={`sa-hero${hero ? " has-img" : ""}`} style={hero ? { "--hero-img": `url(${hero.src})`, backgroundPosition: hero.position || undefined } : undefined} role={hero ? "img" : undefined} aria-label={hero ? hero.alt : undefined}>
        <div className="sa-wrap">
          <p className="sa-kicker">{t.school.kicker(s.school_type)} · {countryLabel(s.country, t)}{s.sample ? ` · ${t.card.sample}` : ""}</p>
          <h1>{s.name}</h1>
          <p className="sa-loc"><MapPin size={16} /> {location(s, t)}</p>
          <p className="sa-lead">{s.tagline}</p>
          <div className="sa-stats">
            {heroFacts(s, t).map(([k, v]) => (<div key={k}><div className="sa-stat-l">{k}</div><div className="sa-stat-v">{v}</div></div>))}
          </div>
        </div>
      </section>

      <nav className="sa-index" aria-label={s.name}>
        <div className="sa-wrap">
          {sections.map((x) => (<a key={x.id} href={`#${x.id}`} aria-current={active === x.id ? "true" : undefined}>{x.label}</a>))}
        </div>
      </nav>

      <main className="sa-wrap sa-main">
        <div className="sa-content">
          {review ? <ReviewFlags school={s} /> : null}
          {sections.map((x, i) => (
            <section key={x.id} id={x.id} className="sa-sec">
              <div className="sa-sec-h"><span>{String(i + 1).padStart(2, "0")}</span><h2>{x.title}</h2></div>
              <SectionBody id={x.id} school={s} />
            </section>
          ))}
        </div>
        <aside className="sa-aside" id="enquire">
          <div className="sa-fee">
            <div className="sa-fee-l">{t.school.fees.intlFee}, {fee.per}</div>
            <div className="sa-fee-v">{fee.headline}</div>
            {fee.sub ? <div className="sa-fee-s">{fee.sub}</div> : null}
            <div className="sa-fee-f">{t.school.fees.confirm(fee.year)}</div>
          </div>
          <EnquiryForm school={s} />
        </aside>
      </main>
    </div>
  );
}
