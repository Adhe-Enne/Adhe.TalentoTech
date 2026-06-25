import React, { type JSX } from "react";
import { FaBox, FaCog, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/selectors/useAuth";
import useCart from "../../hooks/selectors/useCart";
import useFavorites from "../../hooks/selectors/useFavorites";

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
      <li className="nav-item">
        <Link aria-label="Favoritos" className="btn btn-ghost btn-sm position-relative me-2" to="/productos?filter=favorites">
          <FaHeart aria-hidden="true" className="nav-icon nav-fav-icon" />
          {showFavCount()}
        </Link>
      </li>
      <li className="nav-item">
        <Link aria-label="Carrito" className="btn btn-ghost btn-sm position-relative" to="/carrito">
          <FaShoppingCart aria-hidden="true" className="nav-icon nav-cart-icon" />
          {cartCount > 0 && <span className="cart-badge position-absolute top-0 start-100 translate-middle">{cartCount}</span>}
        </Link>
      </li>
      <li className="nav-item">
        <Link aria-label="Mis pedidos" className="btn btn-ghost btn-sm me-2" to="/mis-ordenes">
          <FaBox aria-hidden="true" className="nav-icon" />
        </Link>
      </li>
      <li className="nav-item">
        <Link aria-label={user ? "Perfil" : "Iniciar sesión"} className="btn btn-ghost btn-sm me-2" to={user ? "/perfil" : "/login"}>
          <FaUser aria-hidden="true" className="nav-icon" />
        </Link>
      </li>

      {isAdmin && (
        <li className="nav-item">
          <Link aria-label="Administración" className="btn btn-ghost btn-sm me-2" to="/admin">
            <FaCog aria-hidden="true" className="nav-icon" />
          </Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
