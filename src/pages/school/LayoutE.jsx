import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "../../router.jsx";
import EnquiryForm from "../../components/EnquiryForm.jsx";
import { useT } from "../../i18n.jsx";
import { SectionBody, ReviewFlags, feeNumbers, heroFacts, location, sectionList } from "./shared.jsx";

// Design E "Prospectus": a long-read. Title and standfirst, a full-width photo, a ruled dateline with the fee,
// one reading column with photos and fee tables breaking out wider, a slim bar that appears on scroll, and a sage enquiry panel.
export default function LayoutE({ school: s, review }) {
  const t = useT();
  const sections = sectionList(s, t);
  const fee = feeNumbers(s, t);
  const hero = s.images?.hero;
  const dateline = useRef(null);
  const sideRef = useRef(null);
  const bottomRef = useRef(null);
  const [past, setPast] = useState(false);

  // Show the slim fee bar once the dateline has scrolled above the viewport.
  useEffect(() => {
    const el = dateline.current;
    if (!el) return undefined;
    const check = () => setPast(el.getBoundingClientRect().bottom < 0); // setting the same value is a no-op re-render
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);

  // "Request information" buttons go to whichever form is on screen (the side one on wide screens, the bottom panel otherwise).
  const goEnquire = (e) => {
    if (!e.target.closest?.('a[href="#enquire"]')) return; // every "#enquire" link on the page, including the one in the Apply section
    const el =[sideRef.current, bottomRef.current].find((n) => n && n.offsetParent !== null);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const kicker = [location(s, t), s.school_type].filter(Boolean).join(" · ");
  const facts = [[t.school.fees.intlFee, <>{fee.headline}{fee.per ? <small>{fee.per}</small> : null}{fee.sub ? <small className="se-dateline-sub">{fee.sub}</small> : null}</>], ...heroFacts(s, t).filter(([, v]) => v !== "-")];
  const toc = sections.filter((x) => x.id !== "apply");

  return (
    <div className="se" onClick={goEnquire}>
      <div className={`se-bar${past ? " on" : ""}`} aria-hidden={!past}>
        <div className="se-wrap se-bar-in">
          <span className="se-bar-name">{s.name}</span>
          <span className="se-bar-fee">{fee.headline}{fee.per ? <small> {fee.per}</small> : null}</span>
          <a className="btn-primary" href="#enquire" tabIndex={past ? 0 : -1}>{t.school.request}</a>
        </div>
      </div>

      <header className="se-wrap se-head">
        <p className="se-crumb"><Link to="/schools"><span aria-hidden="true">← </span>{t.school.crumb}</Link></p>
        <p className="se-kicker">{kicker}{s.sample ? ` · ${t.card.sample}` : ""}</p>
        <h1>{s.name}</h1>
        <p className="se-standfirst">{s.tagline}</p>
        <div className="se-cta">
          <a className="btn-primary" href="#enquire">{t.school.request} <ArrowRight size={16} aria-hidden="true" /></a>
          <a className="e-textlink" href="#fees">{t.school.sections.fees}</a>
        </div>
      </header>

      {hero ? (
        <figure className="se-wrap se-hero">
          <img src={hero.src} alt={hero.alt} style={{ objectPosition: hero.position }} />
          <figcaption>{hero.alt}</figcaption>
        </figure>
      ) : null}

      <div className="se-wrap">
        <dl className="se-dateline" ref={dateline}>
          {facts.map(([k, v], i) => (<div key={k} className={i === 0 ? "se-dateline-fee" : ""}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
        <nav className="se-toc" aria-label={s.name}>
          {toc.map((x) => (<a key={x.id} href={`#${x.id}`}>{x.label}</a>))}
        </nav>
      </div>

      <div className="se-wrap se-body">
        <main className="se-main">
          {review ? <div style={{ marginTop: 32 }}><ReviewFlags school={s} /></div> : null}
          {sections.map((x) => (
            <section key={x.id} id={x.id} className="se-sec">
              <h2>{x.title}</h2>
              <div className="se-sec-body"><SectionBody id={x.id} school={s} /></div>
            </section>
          ))}
        </main>

        {/* Wide screens: the enquiry form stays in view on the right while the page scrolls. */}
        <aside id="enquire-side" ref={sideRef} className="se-side" aria-label={t.school.request}>
          <div className="se-side-in">
            <h2>{t.school.request}</h2>
            <p className="se-side-sub">{t.enquiry.about(s.name)}</p>
            <p className="se-side-fee">{t.school.fees.intlFee}: <b>{fee.headline}</b>{fee.per ? ` ${fee.per}` : ""}<br />{t.school.fees.confirmShort}</p>
            <EnquiryForm school={s} variant="bare" hideHeading />
          </div>
        </aside>
      </div>

      <section id="enquire" ref={bottomRef} className="se-enquire se-enquire-narrow">
        <div className="se-wrap se-enquire-in">
          <div className="se-enquire-l">
            <p className="e-kicker">{t.school.enquiry.charAt(0) + t.school.enquiry.slice(1).toLocaleLowerCase(t.locale)}</p>
            <h2>{t.school.request}</h2>
            <p>{t.enquiry.about(s.name)}</p>
            <p className="se-enquire-fee">{t.school.fees.intlFee}: <b>{fee.headline}</b>{fee.per ? ` ${fee.per}` : ""}{fee.year ? ` · ${fee.year}` : ""}<br />{t.school.fees.confirmShort}</p>
          </div>
          <div className="se-enquire-r"><EnquiryForm school={s} variant="bare" hideHeading /></div>
        </div>
      </section>
    </div>
  );
}
