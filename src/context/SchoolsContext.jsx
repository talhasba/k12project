import { createContext, useContext, useEffect, useState } from "react";
import { loadSchools } from "../lib/data.js";
import { useLang } from "../i18n.jsx";

const SchoolsContext = createContext(null);

// One language-aware data subscription shared by pages, filters and the shortlist.
export function SchoolsProvider({ children }) {
  const { lang } = useLang();
  const [state, setState] = useState({ schools: null, error: "", lang: null });
  useEffect(() => {
    let live = true;
    loadSchools(lang)
      .then(schools => live && setState({ schools, error: "", lang }))
      .catch(error => live && setState({ schools: null, error: error.message, lang }));
    return () => { live = false; };
  }, [lang]);
  const value = state.lang === lang ? state : { schools: null, error: "", lang };
  return <SchoolsContext.Provider value={value}>{children}</SchoolsContext.Provider>;
}

export function useSchools() {
  const value = useContext(SchoolsContext);
  if (!value) throw new Error("useSchools requires SchoolsProvider");
  return value;
}
