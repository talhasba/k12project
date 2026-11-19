export function matchRoute(route) {
  const path = route.split("?")[0].replace(/\/+$/, "") || "/";
  const detail = /^\/schools\/([^/]+)$/.exec(path);
  if (detail) {
    try { return { name: "school", id: decodeURIComponent(detail[1]) }; }
    catch { return { name: "school", id: detail[1] }; }
  }
  return { name: ({ "/schools": "catalogue", "/compare": "compare", "/apply": "apply", "/about": "about" })[path] || "home" };
}
