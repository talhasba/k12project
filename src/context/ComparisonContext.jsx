import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useSchools } from "./SchoolsContext.jsx";
import { COMPARE_STORAGE_KEY, comparisonReducer, sanitizeCompareIds } from "../lib/comparison.js";

const ComparisonContext = createContext(null);
function initial() {
  try { return { ids: sanitizeCompareIds(JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY))), limitReached: false }; }
  catch { return { ids: [], limitReached: false }; }
}

export function ComparisonProvider({ children }) {
  const { schools } = useSchools();
  const [state, dispatch] = useReducer(comparisonReducer, undefined, initial);
  useEffect(() => {
    if (schools) dispatch({ type: "validate", validIds: schools.map(s => s.id) });
  }, [schools]);
  useEffect(() => {
    try { localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(state.ids)); } catch { /* optional persistence */ }
  }, [state.ids]);
  useEffect(() => {
    if (!state.limitReached) return;
    const timer = setTimeout(() => dispatch({ type: "dismiss" }), 4000);
    return () => clearTimeout(timer);
  }, [state.limitReached]);
  const selected = useMemo(() => state.ids.map(id => schools?.find(s => s.id === id)).filter(Boolean), [state.ids, schools]);
  const change = (type, id) => {
    if (!schools?.some(s => s.id === id)) return;
    dispatch({ type, id });
  };
  return <ComparisonContext.Provider value={{
    ids: state.ids, selected, limitReached: state.limitReached,
    toggle: id => change("toggle", id), add: id => change("add", id),
    remove: id => dispatch({ type: "remove", id }), clear: () => dispatch({ type: "clear" }),
  }}>{children}</ComparisonContext.Provider>;
}
export const useComparison = () => useContext(ComparisonContext);
