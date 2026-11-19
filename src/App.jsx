import { useEffect, useMemo } from "react";
import { Router, useRoute } from "./router.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CataloguePage from "./pages/CataloguePage.jsx";
import SchoolPage from "./pages/SchoolPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ComparePage from "./pages/ComparePage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import { matchRoute } from "./app/routes.js";

// Routes: / , /schools , /schools/<id> , /about. Anything else shows the home page.

function Site() {
  const route = useRoute();
  const view = useMemo(() => matchRoute(route), [route]);
  useEffect(() => { window.scrollTo(0, 0); }, [view.name, view.id]);

  let page;
  if (view.name === "school") page = <SchoolPage id={view.id} />;
  else if (view.name === "catalogue") page = <CataloguePage />;
  else if (view.name === "about") page = <AboutPage />;
  else if (view.name === "compare") page = <ComparePage />;
  else if (view.name === "apply") page = <ApplyPage />;
  else page = <HomePage />;

  return <Layout>{page}</Layout>;
}

export default function App() {
  return (
    <Router>
      <Site />
    </Router>
  );
}
