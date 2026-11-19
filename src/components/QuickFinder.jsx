import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { navigate } from "../router.jsx";
import { useT } from "../i18n.jsx";
import { INITIAL_FILTERS, useCatalogue } from "../context/CatalogueContext.jsx";
import { DAY, FILTER_QUALS, boardingValues, countryLabel, qualValues, unique } from "../lib/data.js";

// Main-page quick search bar shared across all four themes (A, E, F, G).
// Selections apply directly to CatalogueContext and open /schools with matching results.
export default function QuickFinder({ schools, className = "" }) {
  const t = useT();
  const Q = t.quickFinder;
  const { setState } = useCatalogue();
  const [country, setCountry] = useState("");
  const [programme, setProgramme] = useState("");
  const [boarding, setBoarding] = useState("");
  const [english, setEnglish] = useState(false);

  const real = useMemo(() => schools.filter((s) => !s.sample), [schools]);
  const countries = useMemo(() => unique(real, (s) => s.country), [real]);
  const programmes = useMemo(
    () => FILTER_QUALS.filter((q) => real.some((s) => qualValues(s).includes(q))),
    [real]
  );
  const boardingOptions = useMemo(
    () => unique(real, boardingValues).filter((b) => b !== "Weekly"),
    [real]
  );

  const matches = useMemo(
    () =>
      real.filter(
        (s) =>
          (!country || s.country === country) &&
          (!programme || qualValues(s).includes(programme)) &&
          (!boarding || boardingValues(s).includes(boarding)) &&
          (!english || s.english_support.length > 0)
      ).length,
    [real, country, programme, boarding, english]
  );

  const boardingText = (b) => (b === DAY ? t.boardingTypes.dayFilter : t.boardingTypes[b] || b);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({
      ...INITIAL_FILTERS,
      countries: country ? [country] : [],
      qualifications: programme ? [programme] : [],
      boarding: boarding ? [boarding] : [],
      english,
    });
    navigate("/schools");
  };

  return (
    <form className={`qf ${className}`.trim()} onSubmit={handleSubmit} aria-label={Q.title}>
      <div className="qf-head">
        <h2>{Q.title}</h2>
        <p>{Q.subtitle}</p>
      </div>
      <div className="qf-row">
        <select
          className="input qf-select"
          aria-label={t.filters.country}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">{Q.country}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {countryLabel(c, t)}
            </option>
          ))}
        </select>

        <select
          className="input qf-select"
          aria-label={t.filters.qualification}
          value={programme}
          onChange={(e) => setProgramme(e.target.value)}
        >
          <option value="">{Q.programme}</option>
          {programmes.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>

        <select
          className="input qf-select"
          aria-label={t.filters.boarding}
          value={boarding}
          onChange={(e) => setBoarding(e.target.value)}
        >
          <option value="">{Q.boarding}</option>
          {boardingOptions.map((b) => (
            <option key={b} value={b}>
              {boardingText(b)}
            </option>
          ))}
        </select>

        <label className="qf-check">
          <input
            type="checkbox"
            checked={english}
            onChange={(e) => setEnglish(e.target.checked)}
          />
          <span>{Q.english}</span>
        </label>

        <button className="btn-primary qf-submit" type="submit">
          <Search size={16} aria-hidden="true" />
          <span>{Q.submit(matches)}</span>
        </button>
      </div>
    </form>
  );
}
