import React, { type JSX } from "react";
import { FaBox, FaCog, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/selectors/useAuth";
import useCart from "../../hooks/selectors/useCart";
import useFavorites from "../../hooks/selectors/useFavorites";

const btnClass: string = "relative inline-flex items-center justify-center px-2.5 py-2.5 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-200 min-w-[44px] min-h-[40px]";

const NavLinks: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { favCount } = useFavorites();
  const { getCartQuantity } = useCart();
  const cartCount: number = getCartQuantity();

  const showFavCount: () => JSX.Element = () => {
    if (favCount && favCount > 0) {
      return <span className="bg-accent text-white font-semibold rounded-full px-[9px] py-1 text-[0.8rem] absolute -top-1.5 -right-1.5 shadow-md">{favCount}</span>;
    }
    return <></>;
  };

  const iconBase: string = "w-[22px] h-[22px] inline-block align-middle text-white/85";

  return (
    <ul className="flex items-center gap-2 list-none m-0 p-0">
      <li>
        <Link aria-label="Favoritos" className={btnClass} to="/productos?filter=favorites">
          <FaHeart aria-hidden="true" className={`w-[22px] h-[22px] inline-block align-middle text-accent`} />
          {showFavCount()}
        </Link>
      </li>
      <li>
        <Link aria-label="Carrito" className={btnClass} to="/carrito">
          <FaShoppingCart aria-hidden="true" className={iconBase} />
          {cartCount > 0 && <span className="bg-accent text-white font-semibold rounded-full px-[9px] py-1 text-[0.8rem] absolute -top-1.5 -right-1.5 shadow-md">{cartCount}</span>}
        </Link>
      </li>
      <li>
        <Link aria-label="Mis pedidos" className={btnClass} to="/mis-ordenes">
          <FaBox aria-hidden="true" className={iconBase} />
        </Link>
      </li>
      <li>
        <Link aria-label={user ? "Perfil" : "Iniciar sesión"} className={btnClass} to={user ? "/perfil" : "/login"}>
          <FaUser aria-hidden="true" className={iconBase} />
        </Link>
      </li>

      {isAdmin && (
        <li>
          <Link aria-label="Administración" className={btnClass} to="/admin">
            <FaCog aria-hidden="true" className={iconBase} />
          </Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
