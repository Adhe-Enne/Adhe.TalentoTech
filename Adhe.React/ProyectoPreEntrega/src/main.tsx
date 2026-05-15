import "./index.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element not found");
}
