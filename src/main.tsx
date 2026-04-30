import { createRoot } from "react-dom/client";
import "../style/globals.css";
import App from "./App.tsx";
import Providers from "./providers";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>,
);
