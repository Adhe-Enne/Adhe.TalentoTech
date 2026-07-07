import "./index.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

import App from "./App.tsx";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <App />
        <ToastContainer autoClose={3000} closeButton closeOnClick position="top-right" role="alert" />
      </HelmetProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element not found");
}
