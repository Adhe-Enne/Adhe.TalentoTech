import React, { type JSX } from "react";

import type { AppliedCoupon } from "../../contexts/Cart/CartContext";
import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";

interface OrderSummaryProps {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedTotal: number;
  rawTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = (props) => {
  const { appliedCoupon, cart, discountedTotal, rawTotal } = props;
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-3">Resumen del pedido</h5>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg mb-3">
          {cart.map(
            (item: CartItem): JSX.Element => (
              <div className="flex items-center gap-2 p-3" key={item.product.id}>
                <img alt={item.product.name} className="rounded-lg w-12 h-12 object-cover" src={item.product.image} />
                <div className="flex-1">
                  <strong className="text-sm">{item.product.name}</strong>
                  <div className="text-gray-500 text-sm">
                    {item.quantity} x {formatPrice(item.product.price, item.product.currency)}
                  </div>
                </div>
                <div className="text-sm">{formatPrice(item.product.price * item.quantity, item.product.currency)}</div>
              </div>
            ),
          )}
        </div>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(rawTotal, cart[0]?.product.currency)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-sm text-success">
            <span>Descuento ({appliedCoupon.code})</span>
            <span>-{formatPrice(rawTotal - discountedTotal, cart[0]?.product.currency)}</span>
          </div>
        )}
        <hr />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(discountedTotal, cart[0]?.product.currency)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
