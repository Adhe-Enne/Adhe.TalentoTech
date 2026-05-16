import React from "react";
import { Link, Outlet } from "react-router-dom";

import Directorio from "../contact/DirectorioContainer";
import "./Layout.css";

interface LayoutProps {
  cartCount?: number;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { cartCount, children } = props;
  return (
    <div className="layout">
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              E-commerce
            </Link>
            <button
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-bs-target="#navbarNav"
              data-bs-toggle="collapse"
              type="button"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/productos">
                    Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contacto">
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/carrito">
                    Carrito {typeof cartCount === "number" ? `(${cartCount})` : ""}
                  </Link>
                </li>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to="/new">
                    Nuevo producto
                  </Link>
                </li>
              </ul>
            </div>
            <div className="d-none d-lg-block">
              <Link className="btn btn-sm btn-success ms-2" to="/new">
                Nuevo producto
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="main-content">{children ?? <Outlet />}</main>
      <footer className="footer bg-light text-center text-muted py-3">
        <div className="footer-directory container mb-2">
          <Directorio />
        </div>
        <p className="mb-0">© {new Date().getFullYear()} E-commerce</p>
      </footer>
    </div>
  );
};

export default Layout;
