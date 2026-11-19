import { createContext, useContext, useEffect, useState } from "react";

/*
 * Minimal History-API router (same idea as summerbutwhere). Swap for react-router
 * by replacing this module and the <Link/> imports.
 *
 * The site can live under a sub-path (GitHub Pages: /k12project/). BASE comes from Vite's `base`;
 * routes inside the app are always written without it ("/schools"), and it is added/stripped here.
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" or "/k12project"

const current = () => {
  let p = window.location.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  return p + window.location.search;
};
const RouteContext = createContext("/");

export const useRoute = () => useContext(RouteContext);

export function navigate(to) {
  if (to === current()) return;
  window.history.pushState(null, "", BASE + to);
  window.dispatchEvent(new Event("app:navigate"));
}

export function Link({ to, children, ...props }) {
  return (
    <a
      href={BASE + to}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function Router({ children }) {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const update = () => setRoute(current());
    window.addEventListener("popstate", update);
    window.addEventListener("app:navigate", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("app:navigate", update);
    };
  }, []);
  return <RouteContext.Provider value={route}>{children}</RouteContext.Provider>;
}
