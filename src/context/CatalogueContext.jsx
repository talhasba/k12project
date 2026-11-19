import { createContext, useContext, useState } from "react";

export const INITIAL_FILTERS = { q: "", countries: [], qualifications: [], boarding: [], english: false, sort: "name" };
const CatalogueContext = createContext(null);

// Retain filters when visiting a school, comparing it, or changing theme/language.
export function CatalogueProvider({ children }) {
  const [state, setState] = useState(INITIAL_FILTERS);
  return <CatalogueContext.Provider value={{ state, setState }}>{children}</CatalogueContext.Provider>;
}
export const useCatalogue = () => useContext(CatalogueContext);
