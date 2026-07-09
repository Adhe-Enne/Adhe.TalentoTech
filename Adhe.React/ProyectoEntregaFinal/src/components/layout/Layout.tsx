import React, { useRef, useEffect, useCallback, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import ExchangeRatesBanner from "../common/ExchangeRatesBanner";
import Footer from "./Footer";
import NavLinks from "./NavLinks";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children } = props;

  const headerRef: React.RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);
  const location: ReturnType<typeof useLocation> = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const updateHeaderOffset: () => void = useCallback(() => {
    const h: number = headerRef.current?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--header-offset", `${h}px`);
  }, []);

  useEffect(() => {
    updateHeaderOffset();
    window.addEventListener("resize", updateHeaderOffset);
    return (): void => window.removeEventListener("resize", updateHeaderOffset);
  }, [updateHeaderOffset]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const linkInactive: string = "no-underline inline-flex items-center min-h-[40px] px-4 py-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200";
  const linkActive: string = "no-underline inline-flex items-center min-h-[40px] px-4 py-1.5 rounded-lg bg-white/20 text-white font-semibold transition-all duration-200";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="header" ref={headerRef}>
        <nav className="bg-brand flex items-center justify-between px-4 py-3 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between w-full">
            {/* Left: Logo + Desktop links */}
            <div className="flex items-center gap-8">
              <NavLink className="text-white/90 font-bold text-lg tracking-wide no-underline min-h-[40px] inline-flex items-center hover:text-white transition-colors" end to="/">
                Adhe.E-commerce
              </NavLink>

              <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
                <li>
                  <NavLink className={({ isActive }: { isActive: boolean }) => (isActive ? linkActive : linkInactive)} end to="/">
                    Inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink className={({ isActive }: { isActive: boolean }) => (isActive ? linkActive : linkInactive)} to="/productos">
                    Productos
                  </NavLink>
                </li>
                <li>
                  <NavLink className={({ isActive }: { isActive: boolean }) => (isActive ? linkActive : linkInactive)} to="/contacto">
                    Contacto
                  </NavLink>
                </li>
              </ul>
            </div>

            <button
              aria-controls="navbarNav"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="md:hidden inline-flex items-center justify-center p-2.5 text-white/85 hover:bg-white/15 hover:scale-110 rounded-lg transition-all duration-200 min-w-[44px] min-h-[40px]"
              onClick={() => setMobileOpen((prev) => !prev)}
              type="button"
            >
              {mobileOpen ? <FaTimes aria-hidden="true" size={20} /> : <FaBars aria-hidden="true" size={20} />}
            </button>

            <div className="hidden md:flex items-center">
              <NavLinks />
            </div>

            {mobileOpen && (
              <div
                aria-label="Menú de navegación"
                aria-modal="true"
                className="fixed inset-0 z-40 bg-brand/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 md:hidden"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setMobileOpen(false);
                  }
                }}
                role="dialog"
              >
                <button
                  aria-label="Cerrar menú"
                  className="absolute top-4 right-4 inline-flex items-center justify-center p-2.5 text-white/85 hover:bg-white/15 hover:scale-110 rounded-lg transition-all duration-200 min-w-[44px] min-h-[40px]"
                  onClick={() => setMobileOpen(false)}
                  type="button"
                >
                  <FaTimes aria-hidden="true" size={22} />
                </button>

                <ul className="flex flex-col list-none m-0 p-0 gap-4 items-center">
                  <li>
                    <NavLink
                      className={({ isActive }: { isActive: boolean }) =>
                        isActive
                          ? "bg-white/20 text-white font-semibold text-lg no-underline px-6 py-3 rounded-lg transition-all duration-200"
                          : "text-white/85 text-lg px-4 py-3 rounded-lg no-underline transition-all duration-200 hover:bg-white/10 hover:text-white"
                      }
                      end
                      to="/"
                    >
                      Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }: { isActive: boolean }) =>
                        isActive
                          ? "bg-white/20 text-white font-semibold text-lg no-underline px-6 py-3 rounded-lg transition-all duration-200"
                          : "text-white/85 text-lg px-4 py-3 rounded-lg no-underline transition-all duration-200 hover:bg-white/10 hover:text-white"
                      }
                      to="/productos"
                    >
                      Productos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }: { isActive: boolean }) =>
                        isActive
                          ? "bg-white/20 text-white font-semibold text-lg no-underline px-6 py-3 rounded-lg transition-all duration-200"
                          : "text-white/85 text-lg px-4 py-3 rounded-lg no-underline transition-all duration-200 hover:bg-white/10 hover:text-white"
                      }
                      to="/contacto"
                    >
                      Contacto
                    </NavLink>
                  </li>
                </ul>

                <NavLinks />
              </div>
            )}
          </div>
        </nav>
        <ExchangeRatesBanner />
      </header>
      <main className="main-content flex-1">
        <div className="max-w-[1100px] mx-auto py-10 px-4">{children ?? <Outlet />}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
