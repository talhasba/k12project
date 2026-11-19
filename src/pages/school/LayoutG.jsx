import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Link } from "../../router.jsx";
import { useT } from "../../i18n.jsx";
import SchoolMedia from "../../components/SchoolMedia.jsx";
import EnquiryForm from "../../components/EnquiryForm.jsx";
import { SectionBody, ReviewFlags, feeNumbers, heroFacts, location, sectionList, useScrollSpy } from "./shared.jsx";

export default function LayoutG({ school:s, review }) {
  const t=useT(), sections=sectionList(s,t), fee=feeNumbers(s,t);
  const active=useScrollSpy(sections.map(x=>x.id));
  return <main className="g-detail"><header className="g-detail-header"><div className="g-wrap"><Link className="g-text-link" to="/schools"><ArrowLeft size={15}/>{t.school.back}</Link><div className="g-detail-hero"><div><p className="eyebrow">{s.school_type}</p><h1>{s.name}</h1><p className="g-detail-place"><MapPin size={16}/>{location(s,t)}</p><p className="g-lead">{s.tagline}</p><div className="g-actions"><a className="btn-primary" href="#enquire">{t.school.applyCta}<ArrowRight size={16}/></a></div></div><SchoolMedia image={s.images?.hero} name={s.name} eager /></div><dl className="g-detail-facts">{heroFacts(s,t).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div></header>
    <nav className="g-section-nav" aria-label={s.name}><div className="g-wrap">{sections.map(x=><a key={x.id} href={`#${x.id}`} aria-current={active===x.id?'true':undefined}>{x.label}</a>)}</div></nav>
    <div className="g-wrap g-detail-body"><div className="g-detail-content">{review&&<ReviewFlags school={s}/>} {sections.map(x=><section className="g-detail-section" id={x.id} key={x.id}><h2>{x.title}</h2><SectionBody id={x.id} school={s}/></section>)}</div>
      <aside className="g-detail-aside"><div className="g-fee-panel"><p className="eyebrow">{t.school.fees.intlFee}</p><strong>{fee.headline}</strong><span>{fee.per}</span><p>{fee.sub}</p><small>{t.school.fees.confirm(fee.year)}</small></div><div id="enquire" className="g-enquire-panel"><EnquiryForm school={s}/></div></aside>
    </div>
  </main>;
}
