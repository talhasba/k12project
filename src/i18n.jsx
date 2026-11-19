import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UI } from "./content/ui.js";

// Turkish is the default (as on SummerButWhere). The choice is stored in localStorage ("lang");
// ?lang=en|tr in the URL overrides it once and is remembered.
export const LANGS = ["tr", "en"];
const DEFAULT = "tr";

function initial() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(q)) { localStorage.setItem("lang", q); return q; }
    const saved = localStorage.getItem("lang");
    if (LANGS.includes(saved)) return saved;
  } catch { /* private mode: fall through */ }
  return DEFAULT;
}

// Fill gaps in a translation from English so a missing key never shows "undefined".
function withFallback(dict, base) {
  if (!base || typeof base !== "object" || Array.isArray(base)) return dict === undefined ? base : dict;
  const out = { ...base };
  for (const k of Object.keys(dict || {})) out[k] = withFallback(dict[k], base[k]);
  return out;
}

const LangContext = createContext({ lang: DEFAULT, setLang: () => {}, t: UI.en });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initial);
  const setLang = useCallback((l) => {
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
    setLangState(l);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const t = useMemo(() => (lang === "en" ? UI.en : withFallback(UI[lang], UI.en)), [lang]);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = () => useContext(LangContext).t;
