import React from "react";
import { FaTrash } from "react-icons/fa";

import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";
import QuantityStepper from "../ui/QuantityStepper";

interface CartItemRowProps {
  item: CartItem;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = (props) => {
  const { item, onDecrement, onIncrement, onRemove } = props;

  return (
    <div className="flex items-center gap-3 p-3">
      <img alt={item.product.name} className="rounded-lg w-24 h-24 object-cover" src={item.product.image} />
      <div className="flex-1">
        <strong>{item.product.name}</strong>
        <div className="text-gray-500">{formatPrice(item.product.price, item.product.currency)}</div>
      </div>
      <QuantityStepper max={item.product.stock} min={1} onDecrement={onDecrement} onIncrement={onIncrement} size="sm" value={item.quantity} />
      <div className="w-[140px] text-right">{formatPrice(item.product.price * item.quantity, item.product.currency)}</div>
      <div>
        <button aria-label={`Eliminar ${item.product.name}`} className="bg-danger text-white px-3 py-1.5 rounded-lg hover:opacity-90 text-sm" onClick={onRemove}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
