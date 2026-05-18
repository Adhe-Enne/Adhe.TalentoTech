import React, { useRef, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import useFavorites from "../../hooks/useFavorites";
import "./Layout.css";
import Footer from "./body/Footer";
import NavLinks from "./body/NavLinks";
import SearchForm from "./body/SearchForm";

interface LayoutProps {
  cartCount?: number;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { cartCount, children } = props;
  const { count: favCount } = useFavorites();

  const headerRef: React.RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);
  const location: ReturnType<typeof useLocation> = useLocation();
  const urlQuery: string = new URLSearchParams(location.search).get("q") ?? "";

  const updateHeaderOffset: () => void = useCallback(() => {
    const h: number = headerRef.current?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--header-offset", `${h}px`);
  }, []);

  useEffect(() => {
    updateHeaderOffset();
    window.addEventListener("resize", updateHeaderOffset);
    return (): void => window.removeEventListener("resize", updateHeaderOffset);
  }, [updateHeaderOffset]);

  return (
    <div className="layout">
      <header className="header site-header" ref={headerRef}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Adhe.E-commerce
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
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
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
              </ul>

              <SearchForm baseSearch={location.search} initialQ={urlQuery} />
              <NavLinks cartCount={cartCount} favCount={favCount} />
            </div>
          </div>
        </nav>
      </header>
      <main className="main-content">
        <div className="container container-tight main-wrapper">{children ?? <Outlet />}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
