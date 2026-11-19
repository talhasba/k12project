import { ages, annualFee, boardingLabel, countryLabel, headlineFee, money } from "../../lib/data.js";

// One value representation drives both display and difference detection.
export function comparisonRows(t) {
  const unknown = t.compare.unknown;
  const list = items => items?.filter(v => v != null && v !== "") || [];
  const entry = (key, value) => ({ key, label: t.compare.rows[key], value });
  return [
    entry("location", s => [s.city, s.region, countryLabel(s.country, t)].filter(Boolean)),
    entry("type", s => list([s.school_type, s.gender])),
    entry("age", s => list([s.age_min != null ? `${t.card.ages}: ${ages(s)}` : null, s.year_groups])),
    entry("students", s => s.students_total != null ? [String(s.students_total)] : []),
    entry("fees", s => {
      const f = s.fees, h = headlineFee(s), annual = annualFee(s);
      return list([
        h.amount == null ? t.school.fees.quote : `${f.currency} ${money(h.amount, f.currency, t.locale)} / ${t.units[h.unit]}`,
        f.academic_year || unknown, h.label, h.alt,
        h.unit === "term" && annual != null ? `${t.compare.annual}: ${f.currency} ${money(annual, f.currency, t.locale)}` : null,
      ]);
    }),
    entry("includes", s => list([...(s.fees.includes || []), ...(s.fees.notes || [])])),
    entry("registration", s => list([s.fees.registration_fee != null ? `${t.school.fees.registration}: ${s.fees.currency} ${money(s.fees.registration_fee, s.fees.currency, t.locale)}` : null, s.fees.deposit, s.fees.payment])),
    entry("boarding", s => list([boardingLabel(s, t), ...(s.boarding.notes || []), s.accommodation?.summary, ...(s.accommodation?.notes || []), s.accommodation?.guardianship])),
    entry("programmes", s => list(s.qualifications)),
    entry("english", s => list(s.english_support)),
    entry("results", s => (s.results || []).map(r => `${r.value} — ${r.label} (${r.year})`)),
    entry("admissions", s => list([s.admissions.intake, ...(s.admissions.entry_routes || []).map(r => [r.programme, r.requirement, r.starts].filter(Boolean).join(" — ")), s.admissions.note])),
    entry("documents", s => list(s.admissions.documents)),
    entry("assessments", s => list(s.admissions.assessments)),
    entry("steps", s => list(s.admissions.steps)),
    entry("facilities", s => list(s.facilities)),
    entry("district", s => (s.district_schools || []).map(school => school.name)),
  ];
}
