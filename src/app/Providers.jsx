import { LanguageProvider } from "../i18n.jsx";
import { ThemeProvider } from "../theme.jsx";
import { SchoolsProvider } from "../context/SchoolsContext.jsx";
import { CatalogueProvider } from "../context/CatalogueContext.jsx";
import { ComparisonProvider } from "../context/ComparisonContext.jsx";

export default function Providers({ children }) {
  return <LanguageProvider><ThemeProvider><SchoolsProvider><CatalogueProvider><ComparisonProvider>
    {children}
  </ComparisonProvider></CatalogueProvider></SchoolsProvider></ThemeProvider></LanguageProvider>;
}
