import React from 'react';
import { useAppSelector } from '../app/store';
import CartItem from '../components/specific/CartItem';
import { useAppDispatch } from '../hooks/useAuth';
import { clearCart } from '../features/cart/cartSlice';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  const total = items.reduce((acc, it) => acc + (it.product.precio ?? 0) * it.quantity, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>Carrito</h2>
      <div style={{ marginTop: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
        {items.length === 0 ? (
          <div style={{ padding: 16 }}>El carrito está vacío.</div>
        ) : (
          <div>
            {items.map((it) => (
              <CartItem key={String(it.product.id)} item={it} />
            ))}
            <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => dispatch(clearCart())}
                  style={{ padding: '8px 12px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none' }}
                >
                  Vaciar
                </button>
                <button
                  style={{ padding: '8px 12px', borderRadius: 6, background: '#0ea5a4', color: '#fff', border: 'none' }}
                >
                  Confirmar Compra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
