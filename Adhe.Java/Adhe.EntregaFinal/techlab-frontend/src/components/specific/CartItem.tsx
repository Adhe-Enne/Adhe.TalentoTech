import React from 'react';
import type { CartItem as CartItemType } from '../../features/cart/cartSlice';
import { useAppDispatch } from '../../hooks/useAuth';
import { updateQuantity, removeFromCart } from '../../features/cart/cartSlice';

interface Props {
  item: CartItemType;
}

const CartItem: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleChange = (val: number) => {
    dispatch(updateQuantity({ productId: item.product.id, quantity: val }));
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ flex: 1 }}>{item.product.nombre}</div>
      <div style={{ width: 120 }}>${item.product.precio?.toFixed?.(2) ?? item.product.precio}</div>
      <div>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ width: 64 }}
        />
      </div>
      <div style={{ width: 120, textAlign: 'right' }}>${((item.product.precio ?? 0) * item.quantity).toFixed(2)}</div>
      <div>
        <button
          onClick={() => dispatch(removeFromCart({ productId: item.product.id }))}
          style={{ background: 'transparent', border: 'none', color: '#ef4444' }}
        >
          Quitar
        </button>
      </div>
    </div>
  );
};

export default CartItem;
