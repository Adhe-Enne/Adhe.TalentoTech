import React from 'react';
import type { Product } from '../../api/productApi';
import { useAppDispatch } from '../../hooks/useAuth';
import { addToCart } from '../../features/cart/cartSlice';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{ height: 120, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {product.imagenUrl ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <img src={product.imagenUrl} alt={product.nombre} style={{ maxHeight: '100%', maxWidth: '100%' }} />
        ) : (
          <div style={{ color: '#94a3b8' }}>{product.nombre}</div>
        )}
      </div>
      <div style={{ fontWeight: 600 }}>{product.nombre}</div>
      <div style={{ color: '#475569' }}>
        {product.categoria && typeof product.categoria === 'object' ? product.categoria.nombre : product.categoria}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>${product.precio?.toFixed ? product.precio.toFixed(2) : product.precio}</div>
        <button
          onClick={handleAdd}
          style={{ background: '#0ea5a4', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}
        >
          Agregar
        </button>
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>Stock: {product.stock ?? '—'}</div>
    </div>
  );
};

export default ProductCard;
