import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitEnquiry, validate } from "../lib/enquiry.js";
import { useLang } from "../i18n.jsx";

const EMPTY = { name: "", email: "", phone: "", age: "", country: "", entry: "", message: "", website: "" };

/*
 * variant: "panel" (default, boxed), "bare" (no box; parent supplies the frame) or "dark" (2-column form for a dark band).
 * `school` is optional: when present the enquiry is tagged with it.
 */
export default function EnquiryForm({ school = null, schools = [], title, variant = "panel", hideHeading = false }) {
  const { lang, t } = useLang();
  const E = t.enquiry;
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: "idle", demo: false, error: "" });
  const set = (k) => (e) => setV((cur) => ({ ...cur, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    setState({ status: "sending", demo: false, error: "" });
    try {
      const res = await submitEnquiry({ ...v, school: school ? school.id : null, schoolIds: school ? [school.id] : schools.map(s => s.id), lang, sentAt: new Date().toISOString() });
      setState({ status: "done", demo: res.demo, error: "" });
      setV(EMPTY);
    } catch (err) {
      setState({ status: "error", demo: false, error: err.message });
    }
  }

  if (state.status === "done") {
    return (
      <div className={`eq-ok eq-${variant}`}>
        <p style={{ margin: "0 0 4px", fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={18} color="#16a34a" /> {E.thanks}</p>
        <p style={{ margin: 0 }}>{state.demo ? E.demo : E.sent}</p>
      </div>
    );
  }

  const field = (k, label, props = {}) => (
    <label className={props.wide ? "wide" : ""}>
      <span className="l">{label}</span>
      <input value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} wide={undefined} />
      {errors[k] ? <span className="err">{E.errors[errors[k]]}</span> : null}
    </label>
  );

  return (
    <form className={`eq eq-${variant}`} onSubmit={onSubmit} noValidate>
      {hideHeading ? null : (
        <div className="eq-head">
          <h2>{title || E.title}</h2>
          {school ? <p className="sub">{E.about(school.name)}</p> : null}
        </div>
      )}
      <div className="eq-fields">
        {field("name", E.name, { autoComplete: "name" })}
        {field("email", E.email, { type: "email", autoComplete: "email" })}
        {field("phone", E.phone, { type: "tel", autoComplete: "tel" })}
        {field("country", E.country, { autoComplete: "country-name" })}
        {field("age", E.age, { type: "number", min: 3, max: 19 })}
        {field("entry", E.entry, { placeholder: E.entryPlaceholder })}
        <label className="wide">
          <span className="l">{E.message}</span>
          <textarea value={v.message} onChange={set("message")} />
        </label>
      </div>
      {/* Honeypot: hidden from people, filled by simple bots. */}
      <input style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={v.website} onChange={set("website")} />
      {state.status === "error" ? <p className="err">{state.error}</p> : null}
      <div className="eq-actions">
        <button className="btn-primary" type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? E.sending : E.send} <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
