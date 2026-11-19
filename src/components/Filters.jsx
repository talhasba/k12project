import { Search } from "lucide-react";
import { useT } from "../i18n.jsx";
import { isProspectus, useTheme } from "../theme.jsx";

function Group({ title, options, selected, onToggle, label }) {
  if (!options.length) return null;
  return (
    <fieldset className="mb-5">
      <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-surface-400">{title}</legend>
      <div className="flex flex-col gap-1.5">
        {options.map((o) => (
          <label key={o} className="flex cursor-pointer items-center gap-2 text-sm text-surface-600">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={selected.includes(o)} onChange={() => onToggle(o)} />
            {label ? label(o) : o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// Design E / F: rounded pill options on a soft panel (country with school counts, two-column programme pills).
function FGroup({ title, options, selected, onToggle, label, count, grid = false }) {
  const t = useT();
  if (!options.length) return null;
  return (
    <fieldset className="f-group">
      <legend>{title}</legend>
      <div className={grid ? "f-grid" : "f-list"}>
        {options.map((o) => (
          <label key={o} className="f-pill">
            <input type="checkbox" checked={selected.includes(o)} onChange={() => onToggle(o)} />
            <span className="f-name">{label ? label(o) : o}</span>
            {count ? <span className="f-badge">{t.catalogue.count(count(o))}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// `options` = { countries, qualifications, boarding } (language-neutral values); `state` = selected values; `set` updates one key;
// `counts` = { countries: { [country]: number of schools } } (shown beside each country in design E / F).
export default function Filters({ options, state, set, counts }) {
  const t = useT();
  const { theme } = useTheme();
  const F = t.filters;
  const toggle = (key) => (value) =>
    set(key, state[key].includes(value) ? state[key].filter((v) => v !== value) : [...state[key], value]);
  const boardingText = (v) => (v === "day" ? t.boardingTypes.dayFilter : t.boardingTypes[v] || v);

  if (isProspectus(theme)) {
    return (
      <div className="f-body">
        <label className="f-search">
          <Search size={17} aria-hidden="true" />
          <input type="search" placeholder={F.search} aria-label={F.search} value={state.q} onChange={(e) => set("q", e.target.value)} />
        </label>
        <FGroup title={F.country} options={options.countries} selected={state.countries} onToggle={toggle("countries")} label={(c) => t.countries[c] || c} count={counts ? (c) => counts.countries[c] || 0 : null} />
        <FGroup title={F.qualification} options={options.qualifications} selected={state.qualifications} onToggle={toggle("qualifications")} grid />
        <FGroup title={F.boarding} options={options.boarding} selected={state.boarding} onToggle={toggle("boarding")} label={boardingText} />
        <fieldset className="f-group">
          <div className="f-list">
            <label className="f-pill">
              <input type="checkbox" checked={state.english} onChange={(e) => set("english", e.target.checked)} />
              <span className="f-name">{F.english}</span>
            </label>
          </div>
        </fieldset>
        <label className="f-group f-sort">
          <span className="f-legend">{F.sortBy}</span>
          <select value={state.sort} onChange={(e) => set("sort", e.target.value)}>
            <option value="name">{F.sortName}</option>
            <option value="fee-asc">{F.sortFeeAsc}</option>
            <option value="fee-desc">{F.sortFeeDesc}</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div>
      <label className="relative mb-5 block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input className="input pl-9" type="search" placeholder={F.search} value={state.q} onChange={(e) => set("q", e.target.value)} />
      </label>
      <Group title={F.country} options={options.countries} selected={state.countries} onToggle={toggle("countries")} label={(c) => t.countries[c] || c} />
      <Group title={F.qualification} options={options.qualifications} selected={state.qualifications} onToggle={toggle("qualifications")} />
      <Group title={F.boarding} options={options.boarding} selected={state.boarding} onToggle={toggle("boarding")} label={boardingText} />
      <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-surface-600">
        <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={state.english} onChange={(e) => set("english", e.target.checked)} />
        {F.english}
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-surface-400">{F.sortBy}</span>
        <select className="input" value={state.sort} onChange={(e) => set("sort", e.target.value)}>
          <option value="name">{F.sortName}</option>
          <option value="fee-asc">{F.sortFeeAsc}</option>
          <option value="fee-desc">{F.sortFeeDesc}</option>
        </select>
      </label>
    </div>
  );
}
