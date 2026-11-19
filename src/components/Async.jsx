export { useSchools } from "../context/SchoolsContext.jsx";

export function Loading() {
  return <div className="grid h-[60vh] place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>;
}

export function ErrorNote({ message, t }) {
  return <div className="grid h-[60vh] place-items-center px-4 text-center text-accent-500">{t ? t.loadError : "Could not load school data:"} {message}</div>;
}
