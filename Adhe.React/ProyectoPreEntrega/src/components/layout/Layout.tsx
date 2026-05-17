import React, { useRef, useEffect, useCallback, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import useFavorites from "../../hooks/useFavorites";
import "./Layout.css";

interface LayoutProps {
  cartCount?: number;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { cartCount, children } = props;
  const headerRef: React.RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);

  const { favorites } = useFavorites();
  const location: ReturnType<typeof useLocation> = useLocation();
  const urlQuery: string = new URLSearchParams(location.search).get("q") ?? "";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const favCount: number = Object.keys(favorites || {}).length;

  const updateHeaderOffset: () => void = useCallback(() => {
    try {
      const h: number = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-offset", `${h}px`);
    } catch {
      // ignore
    }
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
              <span className="navbar-toggler-icon"></span>
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

              <form
                className="d-none d-md-flex ms-3 me-auto search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form: HTMLFormElement = e.currentTarget;
                  const inputEl: HTMLInputElement | null = form.querySelector(
                    'input[name="q"]',
                  ) as HTMLInputElement | null;
                  const domVal: string = inputEl ? inputEl.value.trim() : "";
  
                  let valueToSubmit: string;
                  if (!domVal) {
                    valueToSubmit = "";
                  } else if (!isEditing && domVal === urlQuery) {
                    valueToSubmit = "";
                  } else if (isEditing && searchQuery && searchQuery.trim()) {
                    valueToSubmit = searchQuery.trim();
                  } else {
                    valueToSubmit = domVal;
                  }
                  const sp: URLSearchParams = new URLSearchParams(location.search);
                  if (valueToSubmit.length > 0) {
                    sp.set("q", valueToSubmit);
                  } else {
                    sp.delete("q");
                  }
                  const target: string = `/productos${sp.toString() ? `?${sp.toString()}` : ""}`;
                  // use full navigation to ensure query is applied reliably
                  window.location.href = target;
                }}
                role="search"
              >
                <input
                  aria-label="Buscar productos"
                  className="form-control form-control-sm search-input"
                  name="q"
                  onBlur={() => {
                    setIsEditing(false);
                    // trim edges on blur so value shown is normalized
                    setSearchQuery((s) => (s ? s.trim() : ""));
                  }}
                  onChange={(e) => {
                    const v: string = e.target.value;
                    // disallow whitespace-only values: treat them as empty
                    if (v.trim() === "") {
                      setSearchQuery("");
                    } else {
                      setSearchQuery(v);
                    }
                    setIsEditing(true);
                  }}
                  onFocus={() => {
                    setSearchQuery(urlQuery);
                    setIsEditing(true);
                  }}
                  placeholder="Buscar productos..."
                  value={isEditing ? searchQuery : urlQuery}
                />
                <button
                  aria-label="Buscar"
                  className="search-btn"
                  onClick={(ev) => {
                    // fallback navigation on click to avoid subtle submit race
                    try {
                      ev.preventDefault();
                      const formEl: HTMLFormElement | null = (ev.currentTarget as HTMLElement).closest(
                        "form",
                      ) as HTMLFormElement | null;
                      const inputEl: HTMLInputElement | null = formEl
                        ? (formEl.querySelector('input[name="q"]') as HTMLInputElement | null)
                        : null;
                      const domVal: string = inputEl ? inputEl.value.trim() : "";
                      const captured: string = (ev.currentTarget as HTMLElement).getAttribute("data-qvalue") || "";
                      // prefer captured (mousedown) value, then React state, then DOM; do NOT reuse previous URL param
                      let rawVal: string = "";
                      const cap: string = captured && captured.trim() ? captured.trim() : "";
                      if (!cap) {
                        if (!domVal) {
                          rawVal = "";
                        } else if (!isEditing && domVal === urlQuery) {
                          rawVal = "";
                        } else if (isEditing && searchQuery && searchQuery.trim()) {
                          rawVal = searchQuery.trim();
                        } else {
                          rawVal = domVal;
                        }
                      } else {
                        // captured present
                        if (!isEditing && cap === urlQuery) {
                          rawVal = "";
                        } else {
                          rawVal = cap;
                        }
                      }
                      const sp: URLSearchParams = new URLSearchParams(location.search);
                      if (rawVal.length > 0) {
                        sp.set("q", rawVal);
                      } else {
                        sp.delete("q");
                      }
                      const target: string = `/productos${sp.toString() ? `?${sp.toString()}` : ""}`;
                      // use full navigation to ensure query is applied reliably
                      window.location.href = target;
                    } catch {
                      // ignore
                    }
                  }}
                  onMouseDown={(ev) => {
                    try {
                      const formEl: HTMLFormElement | null = (ev.currentTarget as HTMLElement).closest(
                        "form",
                      ) as HTMLFormElement | null;
                      const inputEl: HTMLInputElement | null = formEl
                        ? (formEl.querySelector('input[name="q"]') as HTMLInputElement | null)
                        : null;
                      const captured: string = (inputEl && inputEl.value) || searchQuery || "";
                      (ev.currentTarget as HTMLElement).setAttribute("data-qvalue", captured);
                    } catch {
                      // ignore
                    }
                  }}
                  type="submit"
                >
                  <svg aria-hidden className="nav-icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                    <path d="M10 2a8 8 0 1 0 4.9 14.32l4.38 4.38 1.41-1.41-4.38-4.38A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                  </svg>
                </button>
              </form>

              <ul className="navbar-nav ms-auto align-items-center nav-tools">
                <li className="nav-item d-none d-lg-block">
                  <Link className="btn btn-sm btn-success ms-2" to="/new">
                    Nuevo producto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    aria-label="Favoritos"
                    className="btn btn-ghost btn-sm position-relative me-2"
                    to="/productos?filter=favorites"
                  >
                    <svg
                      aria-hidden
                      className="nav-icon nav-fav-icon"
                      fill="currentColor"
                      height="22"
                      viewBox="0 0 24 24"
                      width="22"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06A5.5 5.5 0 1 0 2.3 12.39L12 22l9.7-9.61a5.5 5.5 0 0 0-1.86-7.78z" />
                    </svg>
                    {favCount > 0 && (
                      <span className="cart-badge position-absolute top-0 start-100 translate-middle">{favCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link aria-label="Carrito" className="btn btn-ghost btn-sm position-relative" to="/carrito">
                    <svg
                      aria-hidden
                      className="nav-icon nav-cart-icon"
                      fill="none"
                      height="22"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.9}
                      viewBox="0 0 24 24"
                      width="22"
                    >
                      <circle cx="9" cy="19" r="1.6" />
                      <circle cx="17" cy="19" r="1.6" />
                      <path d="M3 3h2l2.68 10.39a2 2 0 001.96 1.35H19a2 2 0 001.94-1.44L23 6H6" />
                    </svg>
                    {typeof cartCount === "number" && cartCount > 0 && (
                      <span className="cart-badge position-absolute top-0 start-100 translate-middle">{cartCount}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>{" "}
          </div>
        </nav>
      </header>
      <main className="main-content">
        <div className="container container-tight main-wrapper">{children ?? <Outlet />}</div>
      </main>
      <footer className="site-footer">
        <div className="footer-top py-5">
          <div className="container container-tight">
            <div className="row gy-4">
              <div className="col-12 col-md-4">
                <Link className="footer-brand h5 d-inline-block mb-2" to="/">
                  E-commerce
                </Link>
                <p className="footer-desc text-muted mb-2">Tienda demo para proyecto educativo TalentoTech!.</p>
                <div aria-hidden className="social-icons d-flex gap-2">
                  <a aria-label="Twitter" className="btn btn-ghost btn-sm" href="/">
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M22 5.92c-.64.28-1.32.48-2.04.56.73-.44 1.28-1.16 1.54-2.02-.68.4-1.44.68-2.24.84C18.6 4.24 17.3 3.6 15.86 3.6c-2.44 0-4.42 1.98-4.42 4.42 0 .34.04.68.12 1C7.7 9.06 5.07 7.44 3.4 5c-.38.66-.6 1.44-.6 2.26 0 1.56.8 2.94 2.02 3.74-.6 0-1.16-.18-1.64-.46v.04c0 2.18 1.56 4 3.64 4.42-.34.1-.7.14-1.06.14-.26 0-.52-.02-.78-.07.52 1.62 2.06 2.8 3.9 2.84-1.44 1.12-3.26 1.8-5.24 1.8-.34 0-.68-.02-1.02-.06 1.86 1.18 4.06 1.86 6.44 1.86 7.72 0 11.94-6.4 11.94-11.94v-.54c.82-.62 1.52-1.38 2.08-2.24-.76.34-1.6.56-2.46.66z" />
                    </svg>
                  </a>
                  <a aria-label="Instagram" className="btn btn-ghost btn-sm" href="/">
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zM19.5 6.6a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="col-6 col-md-2">
                <h6 className="mb-2">Navegación</h6>
                <ul className="list-unstyled footer-links mb-0">
                  <li>
                    <Link to="/productos">Productos</Link>
                  </li>
                  <li>
                    <Link to="/contacto">Contacto</Link>
                  </li>
                  <li>
                    <Link to="/carrito">Carrito</Link>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-md-3">
                <h6 className="mb-2">Soporte</h6>
                <ul className="list-unstyled footer-links mb-0">
                  <li>
                    <a href="mailto:soporte@example.com">soporte@example.com</a>
                  </li>
                  <li>
                    <Link to="/new">Nuevo producto</Link>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-3">
                <h6 className="mb-2">Newsletter</h6>
                <form
                  className="d-flex footer-newsletter"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input aria-label="Email" className="form-control form-control-sm" placeholder="Tu email" />
                  <button className="btn btn-cta btn-sm ms-2" type="submit">
                    Suscribirse
                  </button>
                </form>
                <small className="text-muted d-block mt-2">Recibe novedades y ofertas exclusivas.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom py-3 border-top">
          <div className="container container-tight d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <small className="text-muted">
              © {new Date().getFullYear()} E-commerce. Todos los derechos reservados.
            </small>
            <div className="d-flex gap-3 align-items-center">
              <Link className="text-muted" to="/terminos">
                Términos
              </Link>
              <Link className="text-muted" to="/privacidad">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
