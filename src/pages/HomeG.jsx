import { ArrowRight, Search, Scale, Send } from "lucide-react";
import { Link } from "../router.jsx";
import { useT } from "../i18n.jsx";
import { countryLabel, unique } from "../lib/data.js";
import QuickFinder from "../components/QuickFinder.jsx";
import SchoolMedia from "../components/SchoolMedia.jsx";
import SchoolCard from "../components/SchoolCard.jsx";

export default function HomeG({ schools }) {
  const t = useT(), M = t.modern, H = t.home;
  const real=schools.filter(s=>!s.sample), countries=unique(real,s=>s.country), hero=real.find(s=>s.images?.hero);
  const featured=[real[0],real.find(s=>s.id==='st-clares-oxford-ib'),real.find(s=>s.id==='delta-school-district')].filter(Boolean);
  return <main className="g-home">
    <section className="g-hero"><div className="g-wrap"><div className="g-hero-grid"><div className="g-hero-copy"><p className="eyebrow">{H.eyebrow}</p><h1>{M.title}</h1><p className="g-lead">{M.lead}</p>
      <div className="g-actions"><Link to="/schools" className="btn-primary">{H.browse}<ArrowRight size={17} /></Link><Link to="/apply" className="btn-ghost">{t.school.request}</Link></div>
      <Link className="g-text-link" to="/about">{H.how} →</Link>
    </div>{hero&&<figure className="g-hero-photo"><Link to={`/schools/${hero.id}`}><SchoolMedia image={hero.images.hero} name={hero.name} eager /></Link><figcaption><strong>{hero.name}</strong><span>{hero.city}, {countryLabel(hero.country,t)}</span></figcaption></figure>}</div>
      <dl className="g-stats"><div><dt>{H.statSchools}</dt><dd>{real.length}</dd></div><div><dt>{H.statCountries}</dt><dd>{countries.length}</dd></div><div><dt>{M.guidance}</dt><dd>{M.approach}</dd></div></dl>
      <QuickFinder schools={schools} className="g-qf" />
    </div></section>
    <section className="g-wrap g-steps"><div className="g-section-heading"><div><p className="eyebrow">{M.guidance}</p><h2>{M.approach}</h2></div><Link className="g-text-link" to="/about">{H.how} →</Link></div><div className="g-step-grid">{[Search,Scale,Send].map((Icon,i)=><article key={i}><span className="g-step-icon"><Icon size={23}/></span><span className="g-step-number">0{i+1}</span><h3>{H.steps[i].title}</h3><p>{M.stepText[i]}</p></article>)}</div></section>
    <section className="g-wrap g-featured"><div className="g-section-heading"><h2>{H.featured}</h2><Link className="g-text-link" to="/schools">{H.viewAll} →</Link></div><div className="g-featured-grid">{featured.map(s=><SchoolCard key={s.id} school={s}/>)}</div></section>
    <section className="g-wrap"><div className="g-callout"><div><p className="eyebrow">{M.guidance}</p><h2>{t.school.request}</h2><p>{t.shortlist.lead}</p></div><Link className="btn-primary" to="/apply">{t.compare.apply}<ArrowRight size={16}/></Link></div></section>
  </main>;
}
