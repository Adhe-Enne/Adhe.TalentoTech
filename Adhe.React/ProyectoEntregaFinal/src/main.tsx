import "./index.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import { CartProvider } from "./contexts/Cart/CartProvider.tsx";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </HelmetProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element not found");
}
