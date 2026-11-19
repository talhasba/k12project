import { useEffect } from "react";
import { Link, useRoute } from "../router.jsx";
import { Loading, ErrorNote, useSchools } from "../components/Async.jsx";
import { setTitle } from "../lib/data.js";
import { useTheme } from "../theme.jsx";
import { useT } from "../i18n.jsx";
import LayoutA from "./school/LayoutA.jsx";
import LayoutE from "./school/LayoutE.jsx";
import LayoutG from "./school/LayoutG.jsx";
import CompareButton from "../features/comparison/CompareButton.jsx";

const LAYOUTS = { a: LayoutA, e: LayoutE, f: LayoutE, g: LayoutG };

// The school detail page: same data, two layouts (A Registry, and E Prospectus which F reuses in other colours).
export default function SchoolPage({ id }) {
  const { schools, error } = useSchools();
  const { theme } = useTheme();
  const t = useT();
  const route = useRoute();
  const school = schools?.find((s) => s.id === id);
  useEffect(() => setTitle(school ? school.name : t.school.crumb, t), [school, t]);

  if (error) return <ErrorNote message={error} t={t} />;
  if (!schools) return <Loading />;
  if (!school) {
    return (
      <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div><p style={{ fontSize: 18, fontWeight: 600 }}>{t.school.notFound}</p><Link to="/schools" className="btn-primary">{t.school.back}</Link></div>
      </main>
    );
  }
  const Layout = LAYOUTS[theme] || LayoutA;
  const review = new URLSearchParams(route.split("?")[1] || "").has("review");
  return <><div className="school-compare-bar"><CompareButton school={school} /><Link className="compare-button" to="/compare">{t.compare.title} →</Link></div><Layout key={school.id} school={school} review={review} /></>;
}
