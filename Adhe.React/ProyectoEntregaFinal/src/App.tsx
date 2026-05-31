import "./App.css";

import { type JSX } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./components/AppRoutes";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
