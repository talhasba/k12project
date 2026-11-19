import { useEffect } from "react";
import EnquiryForm from "../components/EnquiryForm.jsx";
import { setTitle } from "../lib/data.js";
import { useT } from "../i18n.jsx";

export default function AboutPage() {
  const t = useT();
  const A = t.aboutPage;
  useEffect(() => setTitle(A.title, t), [A.title, t]);
  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem]">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-500">{A.eyebrow}</p>
        <h1 className="text-3xl font-extrabold text-surface-800">{A.heading}</h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-surface-600">
          {A.paragraphs.map((p) => <p key={p}>{p}</p>)}
          {/* TODO: add company details / parent-brand block. */}
        </div>
      </div>
      <EnquiryForm title={A.formTitle} />
    </main>
  );
}
