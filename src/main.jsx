import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./themes/blocks.css";
import "./themes/a.css";
import "./themes/e.css";
import "./themes/g.css";
import "./features/comparison/comparison.css";
import App from "./App.jsx";
import Providers from "./app/Providers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers><App /></Providers>
  </StrictMode>,
);
