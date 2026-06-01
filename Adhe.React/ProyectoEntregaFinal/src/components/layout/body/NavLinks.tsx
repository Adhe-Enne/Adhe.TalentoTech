import React, { type JSX } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../../hooks/useCart";
import useFavorites from "../../../hooks/useFavorites";
import PlusCircle from "../../icons/PlusCircle";

const NavLinks: React.FC = () => {
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
      <li className="nav-item d-none d-lg-block">
        <Link aria-label="Nuevo producto" className="btn btn-sm btn-success ms-2 btn-new-product btn-icon" to="/new">
          <PlusCircle className="nav-icon" />
          Nuevo producto
        </Link>
      </li>
      <li className="nav-item">
        <Link aria-label="Favoritos" className="btn btn-ghost btn-sm position-relative me-2" to="/productos?filter=favorites">
          <svg aria-hidden className="nav-icon nav-fav-icon" fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06A5.5 5.5 0 1 0 2.3 12.39L12 22l9.7-9.61a5.5 5.5 0 0 0-1.86-7.78z" />
          </svg>
          {showFavCount()}
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
          {cartCount > 0 && <span className="cart-badge position-absolute top-0 start-100 translate-middle">{cartCount}</span>}
        </Link>
      </li>
    </ul>
  );
};

export default NavLinks;
