import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { injectWidget } from "./lib/widget";
import { initRum } from "./lib/rum";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

injectWidget(
  document,
  import.meta.env.VITE_SKILLFABER_WIDGET_SRC,
  import.meta.env.VITE_SKILLFABER_WIDGET_TOKEN
);

initRum();
