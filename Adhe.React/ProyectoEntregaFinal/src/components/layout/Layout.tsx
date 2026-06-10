import React, { useRef, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import "./Layout.css";
import Footer from "./Footer";
import SearchForm from "./SearchForm";
import UserToolbar from "./UserToolbar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children } = props;

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
          <Container>
            <NavLink className={(navData) => (navData.isActive ? "navbar-brand active" : "navbar-brand")} end to="/">
              Adhe.E-commerce
            </NavLink>
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
                  <NavLink className={(navData) => (navData.isActive ? "nav-link active" : "nav-link")} end to="/">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={(navData) => (navData.isActive ? "nav-link active" : "nav-link")} to="/productos">
                    Productos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={(navData) => (navData.isActive ? "nav-link active" : "nav-link")} to="/contacto">
                    Contacto
                  </NavLink>
                </li>
              </ul>

              <SearchForm baseSearch={location.search} initialQ={urlQuery} />
              <UserToolbar />
            </div>
          </Container>
        </nav>
      </header>
      <main className="main-content">
        <Container className="container-tight main-wrapper">{children ?? <Outlet />}</Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
