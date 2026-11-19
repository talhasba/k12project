import { Globe, GraduationCap } from "lucide-react";
import { Link, useRoute } from "../router.jsx";
import { THEMES, useTheme } from "../theme.jsx";
import { useLang } from "../i18n.jsx";
import { useComparison } from "../context/ComparisonContext.jsx";
import CompareDock from "../features/comparison/CompareDock.jsx";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="K12 Onboard">
      <span className="brand-mark"><GraduationCap size={20} /></span>
      <span className="brand-name">K12<i className="brand-bar" /> <b>Onboard</b></span>
    </Link>
  );
}

// The switcher shows unless VITE_SHOW_THEME_SWITCHER=false. All designs stay in the code either way;
// ?theme=a|e|f|g still works when the switcher is hidden.
const SHOW_SWITCHER = import.meta.env.VITE_SHOW_THEME_SWITCHER !== "false";

// Prototype control: lets you flip between the designs.
function ThemeSwitcher({ label }) {
  const { theme, setTheme } = useTheme();
  return (
    <details className="theme-switch">
      <summary>{label}: {THEMES.find(t => t.key === theme)?.name}</summary>
      <div>
        {THEMES.map((t) => (
          <button key={t.key} type="button" aria-pressed={theme === t.key} title={t.blurb} onClick={() => setTheme(t.key)}>
            {t.key.toUpperCase()} {t.name}
          </button>
        ))}
      </div>
    </details>
  );
}

function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <button type="button" className="lang-toggle" aria-label={t.switchTo.aria} onClick={() => setLang(lang === "tr" ? "en" : "tr")}>
      <Globe size={16} aria-hidden="true" /> {t.switchTo.code}
    </button>
  );
}

export default function Layout({ children }) {
  const route = useRoute();
  const { t } = useLang();
  const { selected } = useComparison();
  const path = route.split("?")[0];
  const onSchools = path.startsWith("/schools");
  const onAbout = path.startsWith("/about");
  return (
    <div className={selected.length && !["/compare", "/apply"].includes(path) ? "site-shell has-compare-dock" : "site-shell"} style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <header className="site-header">
        <div className="site-header-inner">
          <Brand />
          <div className="site-actions">
            <nav className="site-nav" aria-label={t.modern.menu}>
              <Link to="/schools" aria-current={onSchools ? "page" : undefined}>{t.nav.schools}</Link>
              <Link to="/about" aria-current={onAbout ? "page" : undefined}>{t.nav.about}</Link>
              <Link to="/compare" aria-current={path === "/compare" ? "page" : undefined}>{t.compare.title}{selected.length ? ` (${selected.length})` : ""}</Link>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <div style={{ flex: 1 }}>{children}</div>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <Brand />
          <p>{t.footer}</p>
        </div>
      </footer>
      {SHOW_SWITCHER ? <ThemeSwitcher label={t.design} /> : null}
      <CompareDock />
    </div>
  );
}
