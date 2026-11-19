// Enquiry submission. Set VITE_ENQUIRY_ENDPOINT (e.g. "/api/enquiry") once a backend exists;
// it should accept this JSON via POST and return 2xx. Until then the form runs in demo mode
// and nothing is sent anywhere.
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || "";

// Returns error codes (required | email | age); the form turns them into text in the current language.
export function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "email";
  const age = Number(v.age);
  if (!v.age || Number.isNaN(age) || age < 3 || age > 19) errors.age = "age";
  if (!v.country.trim()) errors.country = "required";
  return errors;
}

export async function submitEnquiry(payload) {
  if (payload.website) return { ok: true, demo: false }; // honeypot: pretend success, send nothing
  if (!ENDPOINT) {
    console.info("[demo] enquiry not sent:", payload);
    return { ok: true, demo: true };
  }
  const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Enquiry failed (HTTP ${res.status})`);
  return { ok: true, demo: false };
}
