import { useEffect } from "react";
import { ArrowRight, Filter, FileText, Send } from "lucide-react";
import { Link } from "../router.jsx";
import QuickFinder from "../components/QuickFinder.jsx";
import SchoolCard from "../components/SchoolCard.jsx";
import { Loading, ErrorNote, useSchools } from "../components/Async.jsx";
import { setTitle } from "../lib/data.js";
import { useT } from "../i18n.jsx";
import { isProspectus, useTheme } from "../theme.jsx";
import HomeE from "./HomeE.jsx";
import HomeG from "./HomeG.jsx";

const ICONS = [Filter, FileText, Send];

export default function HomePage() {
  const { schools, error } = useSchools();
  const t = useT();
  const { theme } = useTheme();
  const H = t.home;
  useEffect(() => setTitle("", t), [t]);
  if (error) return <ErrorNote message={error} t={t} />;
  if (!schools) return <Loading />;

  if (isProspectus(theme)) return <HomeE schools={schools} />;
  if (theme === "g") return <HomeG schools={schools} />;

  const real = schools.filter((s) => !s.sample);
  const countries = new Set(real.map((s) => s.country)).size;
  const lead = real.find((s) => s.images?.hero);

  return (
    <main>
      <section className="home-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow mb-4">{H.eyebrow}</p>
            <h1 className="mb-5">{H.title}</h1>
            <p className="lead">{H.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/schools" className="btn-primary">{H.browse} <ArrowRight size={16} /></Link>
              <Link to="/about" className="btn-ghost">{H.how}</Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-4">
              <div className="stat"><dt>{H.statSchools}</dt><dd>{real.length}</dd></div>
              <div className="stat"><dt>{H.statCountries}</dt><dd>{countries}</dd></div>
            </dl>
          </div>
          {lead ? (
            <Link to={`/schools/${lead.id}`} className="home-photo" aria-label={H.view(lead.name)}>
              <img src={lead.images.hero.src} alt={lead.images.hero.alt} />
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <QuickFinder schools={schools} />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 text-2xl">{H.howTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {H.steps.map(({ title, text }, i) => {
            const Icon = ICONS[i];
            return (
              <div key={title} className="card p-5">
                <span className="mb-3 grid h-10 w-10 place-items-center bg-brand-50 text-brand-600"><Icon size={20} /></span>
                <h3 className="text-lg"><span className="step-num">0{i + 1}</span> {title}</h3>
                <p className="mt-1 text-sm text-surface-600">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl">{H.featured}</h2>
            <Link to="/schools" className="text-sm font-semibold text-brand-600 hover:underline">{H.viewAll}</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {schools.slice(0, 3).map((s) => <SchoolCard key={s.id} school={s} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
