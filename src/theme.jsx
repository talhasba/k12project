import { createContext, useCallback, useContext, useEffect, useState } from "react";

// A Registry, E Prospectus, F Prospectus Navy, and G Modern Ed-Tech.
// (B Ledger, C Spec sheet and D Aurora were removed.) The active one is set on <html data-theme="..."> (see index.html for the pre-paint script).
export const THEMES = [
  { key: "a", name: "Registry", blurb: "Navy, serif, numbered sections" },
  { key: "e", name: "Prospectus", blurb: "Warm paper, green and clay, photo-led long reads" },
  { key: "f", name: "Prospectus Navy", blurb: "Prospectus in the Registry's navy and burgundy" },
  { key: "g", name: "Modern Ed-Tech", blurb: "Blue, slate and clear comparison-led discovery" },
];
// E and F share all markup and CSS; only the colour tokens differ.
export const isProspectus = (theme) => theme === "e" || theme === "f";

const ThemeContext = createContext({ theme: "e", setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const read = () => {
  const t = document.documentElement.dataset.theme;
  return THEMES.some((x) => x.key === t) ? t : "e";
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(read);
  const setTheme = useCallback((t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("k12-theme", t); } catch { /* private mode: ignore */ }
    setThemeState(t);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("k12-theme", theme); } catch { /* optional persistence */ }
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
