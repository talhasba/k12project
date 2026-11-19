// Runtime data loader and helpers. Schools live in /public/data/schools.json (English) and
// /public/data/schools.tr.json (Turkish text merged over it by school id).
const cache = {};

function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }

// Objects merge key by key; arrays of objects merge item by item (same length); anything else is replaced.
export function deepMerge(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    if (base.length === over.length && base.every(isObj) && over.every(isObj)) return base.map((b, i) => deepMerge(b, over[i]));
    return over;
  }
  if (isObj(base) && isObj(over)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
    return out;
  }
  return over;
}

// Vite's base ("/" locally, "/k12project/" on GitHub Pages). Data files and image paths in the JSON are
// written from the site root ("/images/..."), so they are prefixed here.
const BASE_URL = import.meta.env.BASE_URL;
const withBase = (p) => (typeof p === "string" && p.startsWith("/") ? BASE_URL + p.slice(1) : p);

async function getJson(file) {
  const r = await fetch(withBase(file));
  if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
  return r.json();
}

// Prefix every image src in a school's `images` block with the base path.
function fixImagePaths(school) {
  const fix = (v) => (Array.isArray(v) ? v.map(fix) : isObj(v) ? (v.src ? { ...v, src: withBase(v.src) } : v) : v);
  let out = school;
  if (school.images) out = { ...out, images: Object.fromEntries(Object.entries(school.images).map(([k, v]) => [k, fix(v)])) };
  // School districts list their member schools with an optional photo each.
  if (school.district_schools) out = { ...out, district_schools: school.district_schools.map((d) => (d.image ? { ...d, image: fix(d.image) } : d)) };
  return out;
}

export function loadSchools(lang = "en") {
  if (!cache[lang]) {
    cache[lang] = (async () => {
      const base = await getJson("/data/schools.json");
      const over = lang === "en" ? {} : await getJson(`/data/schools.${lang}.json`).catch(() => ({}));
      return base.map((s) => fixImagePaths(deepMerge(s, over[s.id])));
    })().catch((e) => { delete cache[lang]; throw e; });
  }
  return cache[lang];
}

export function money(amount, currency, locale = "en-GB") {
  if (amount == null || amount === "") return "—";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

// Annual fee: an explicit full-year figure when the school publishes one (fees.annual, e.g. when term
// fees differ); otherwise calculated as per-term fee x terms and shown as "calculated".
export function annualFee(school) {
  const f = school.fees;
  if (!f) return null;
  if (f.annual) return f.annual;
  return f.per_term && f.terms_per_year ? f.per_term * f.terms_per_year : null;
}

// The one price shown on cards and in the fee box. Schools with unequal term fees set fees.headline
// ({ amount, unit: "year", label, alt }); everyone else uses the per-term fee.
export function headlineFee(school) {
  const f = school.fees;
  if (f.headline) return { amount: f.headline.amount, unit: f.headline.unit || "year", label: f.headline.label || "", alt: f.headline.alt || "" };
  return { amount: f.per_term, unit: "term", label: "", alt: "" };
}

// Language-neutral filter value for "takes day students"; its label comes from the UI dictionary.
export const DAY = "day";

// "Full-time / Weekly / Day", "Day only", ... in the current language.
export function boardingLabel(school, t) {
  const b = school.boarding;
  const L = t.boardingTypes;
  if (!b.available) return L.dayOnly;
  return [...b.types.map((x) => L[x] || x), ...(b.day_option ? [L.day] : [])].join(" / ");
}

// Filter values for the Boarding group: boarding types, plus DAY for day-only schools and schools that also take day students.
export const boardingValues = (school) => [
  ...(school.boarding.available ? school.boarding.types : []),
  ...(!school.boarding.available || school.boarding.day_option ? [DAY] : []),
];

// The programme filter only offers these four; a school matches one when any of its qualifications is that programme
// (IB covers "IB Diploma", "Pre-IB" and "International Baccalaureate (IB)"). Other qualifications still show on school pages.
export const FILTER_QUALS = ["GCSE", "A Level", "IB", "AP"];
export const qualValues = (school) => {
  const q = school.qualifications || [];
  const has = (re) => q.some((x) => re.test(x));
  return FILTER_QUALS.filter((k) => ({
    "GCSE": () => has(/GCSE/i),
    "A Level": () => has(/\bA[- ]?Level\b/i),
    "IB": () => has(/\bIB\b|International Baccalaureate/i),
    "AP": () => has(/Advanced Placement|\bAP\b/),
  })[k]());
};

export const countryLabel =(country, t) => t.countries[country] || country;

export const ages = (s) => (s.age_min != null ? `${s.age_min}-${s.age_max}` : "-");

export const unique = (schools, pick) =>
  [...new Set(schools.flatMap((s) => [].concat(pick(s) ?? [])).filter(Boolean))].sort((a, b) => a.localeCompare(b));

export function setTitle(title, t) {
  document.title = title ? `${title} | K12 Onboard` : t.siteTitle;
}
