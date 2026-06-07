import React, { type JSX } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";
import useFavorites from "../../../hooks/useFavorites";
import PlusCircle from "../../icons/PlusCircle";

const NavLinks: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { favCount } = useFavorites();
  const { getCartQuantity } = useCart();
  const cartCount: number = getCartQuantity();

  const showFavCount: () => JSX.Element = () => {
    if (favCount && favCount > 0) {
      return <span className="cart-badge position-absolute top-0 start-100 translate-middle">{favCount}</span>;
    }
    return <></>;
  };

  return (
    <ul className="navbar-nav ms-auto align-items-center nav-tools">
      {isAdmin && (
        <li className="nav-item d-none d-lg-block">
          <Link aria-label="Nuevo producto" className="btn btn-sm btn-success ms-2 btn-new-product btn-icon" to="/admin/productos/nuevo">
            <PlusCircle className="nav-icon" />
            Nuevo producto
          </Link>
        </li>
      )}
      <li className="nav-item">
        <Link aria-label="Favoritos" className="btn btn-ghost btn-sm position-relative me-2" to="/productos?filter=favorites">
          <svg aria-hidden className="nav-icon nav-fav-icon" fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06A5.5 5.5 0 1 0 2.3 12.39L12 22l9.7-9.61a5.5 5.5 0 0 0-1.86-7.78z" />
          </svg>
          {showFavCount()}
        </Link>
      </li>

      <li className="nav-item">
        <Link
          aria-label={user ? "Perfil" : "Iniciar sesión"}
          className="btn btn-ghost btn-sm me-2"
          to={user ? "/perfil" : "/login"}
        >
          <svg aria-hidden className="nav-icon" fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.1 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.5-4.8-9.6-4.8z" />
          </svg>
        </Link>
      </li>

      {isAdmin && (
        <li className="nav-item">
          <Link aria-label="Administración" className="btn btn-ghost btn-sm me-2" to="/admin">
            <svg aria-hidden className="nav-icon" fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z" />
            </svg>
          </Link>
        </li>
      )}

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
          {cartCount > 0 && <span className="cart-badge position-absolute top-0 start-100 translate-middle">{cartCount}</span>}
        </Link>
      </li>
    </ul>
  );
};

export default NavLinks;
