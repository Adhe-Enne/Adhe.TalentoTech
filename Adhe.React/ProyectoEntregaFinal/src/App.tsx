import "./App.css";

import { type JSX } from "react";
import { BrowserRouter } from "react-router-dom";

import Inicio from "./components/AppRoutes";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Inicio />
    </BrowserRouter>
  );
}

export default App;
