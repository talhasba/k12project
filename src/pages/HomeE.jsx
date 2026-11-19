import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "../router.jsx";
import QuickFinder from "../components/QuickFinder.jsx";
import SchoolCard from "../components/SchoolCard.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import { countryLabel, setTitle } from "../lib/data.js";
import { useT } from "../i18n.jsx";

// Design E "Prospectus": a magazine cover, a ruled three-step strip, one lead story and two supporting ones.
export default function HomeE({ schools }) {
  const t = useT();
  const H = t.home;
  useEffect(() => setTitle("", t), [t]);

  const real = schools.filter((s) => !s.sample);
  const countries = new Set(real.map((s) => s.country)).size;
  const cover = real.find((s) => s.images?.hero);
  const featured = schools.slice(0, 3);
  const coverPlace = cover ? [cover.city, countryLabel(cover.country, t)].filter(Boolean).join(", ") : "";

  return (
    <main className="e-home">
      <section className="e-wrap e-cover">
        <div className="e-cover-text">
          <p className="e-kicker">{H.eyebrow}</p>
          <h1>{H.title}</h1>
          <p className="e-standfirst">{H.lead}</p>
          <div className="e-cover-actions">
            <Link to="/schools" className="btn-primary">{H.browse} <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to="/about" className="e-textlink">{H.how}</Link>
          </div>
          <dl className="e-figures">
            <div><dt>{H.statSchools}</dt><dd>{real.length}</dd></div>
            <div><dt>{H.statCountries}</dt><dd>{countries}</dd></div>
          </dl>
        </div>
        {cover ? (
          <figure className="e-cover-photo">
            <Link to={`/schools/${cover.id}`} aria-label={H.view(cover.name)}>
              <img src={cover.images.hero.src} alt={cover.images.hero.alt} style={{ objectPosition: cover.images.hero.position }} />
            </Link>
            <figcaption><b>{cover.name}</b>{coverPlace ? `, ${coverPlace}` : ""}</figcaption>
          </figure>
        ) : null}
      </section>

      <section className="e-wrap e-qf-section">
        <QuickFinder schools={schools} />
      </section>

      <section className="e-wrap e-how" aria-labelledby="e-how-h">
        <h2 id="e-how-h">{H.howTitle}</h2>
        <ol>
          {H.steps.map(({ title, text }) => (
            <li key={title}><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="e-wrap e-featured" aria-labelledby="e-feat-h">
        <div className="e-section-head">
          <h2 id="e-feat-h">{H.featured}</h2>
          <Link to="/schools" className="e-textlink">{H.viewAll} <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="e-featured-grid">
          {featured.map((s, i) => <SchoolCard key={s.id} school={s} lead={i === 0} />)}
        </div>
      </section>

      <section id="enquire" className="se-enquire">
        <div className="se-wrap se-enquire-in">
          <div className="se-enquire-l">
            <p className="e-kicker">{t.school.enquiry.charAt(0) + t.school.enquiry.slice(1).toLocaleLowerCase(t.locale)}</p>
            <h2>{t.school.request}</h2>
            <p>{H.steps[H.steps.length - 1].text}</p>
          </div>
          <div className="se-enquire-r"><EnquiryForm variant="bare" hideHeading /></div>
        </div>
      </section>
    </main>
  );
}
