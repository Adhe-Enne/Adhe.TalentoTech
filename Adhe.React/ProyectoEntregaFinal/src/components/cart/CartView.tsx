import React from "react";
import { FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { AppliedCoupon } from "../../contexts/Cart/CartContext";
import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";
import EmptyState from "../ui/EmptyState";
import HelmetMeta from "../ui/HelmetMeta";
import CartItemRow from "./CartItemRow";
import CouponSection from "./CouponSection";

interface CartListViewProps {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedByCurrency: Record<string, number>;
  totalsByCurrency: Record<string, number>;
  onBack: () => void;
  onItemDecrement: (item: CartItem) => void;
  onItemIncrement: (item: CartItem) => void;
  onItemRemove: (item: CartItem) => void;
  onPurchase: () => void;
}

const CartView: React.FC<CartListViewProps> = (props) => {
  const { appliedCoupon, cart, discountedByCurrency, onBack, onItemDecrement, onItemIncrement, onItemRemove, onPurchase, totalsByCurrency } = props;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Revisa tu carrito de compras en Talento Tech." title="Talento Tech | Carrito" />
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <EmptyState
          action={
            <Link className="inline-block bg-cta text-white px-4 py-2 rounded-lg hover:opacity-90 no-underline" to="/productos">
              Ver Productos
            </Link>
          }
          message="Agregá productos para continuar la compra."
          title="Tu carrito está vacío"
        />
      ) : (
        <div className="cart-list">
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {cart.map((it) => (
              <CartItemRow item={it} key={it.product.id} onDecrement={() => onItemDecrement(it)} onIncrement={() => onItemIncrement(it)} onRemove={() => onItemRemove(it)} />
            ))}
          </div>

          <div className="flex justify-between items-start mt-3">
            <div>
              <strong>Subtotal:</strong>
            </div>
            <div className="text-right">
              {Object.entries(totalsByCurrency).map(([c, total]) => (
                <span className="block" key={c}>
                  {formatPrice(total, c)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && <CouponSection />}

      <div className="flex justify-between items-start mt-3 p-3 bg-gray-100 rounded-lg">
        <div>
          <strong>Total{appliedCoupon ? " final" : ""}:</strong>
        </div>
        <div className="text-right">
          {appliedCoupon &&
            Object.entries(totalsByCurrency).map(([c, total]) => (
              <small className="text-gray-500 line-through block" key={c}>
                {formatPrice(total, c)}
              </small>
            ))}
          {Object.entries(discountedByCurrency).map(([c, total]) => (
            <strong className="text-xl block" key={c}>
              {formatPrice(total, c)}
            </strong>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="mt-2">
          <button className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 inline-flex items-center gap-2 w-full" onClick={onPurchase}>
            <FaCreditCard />
            Proceder al pago
          </button>
        </div>
      )}

      <div className="mt-3">
        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm" onClick={onBack}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default CartView;
