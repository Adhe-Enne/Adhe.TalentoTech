import React, { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAuth';
import { fetchProducts } from './productSlice';
import ProductCard from '../../components/specific/ProductCard';
import { useAppSelector } from '../../app/store';

const ProductGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = Array.isArray(items) ? items : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
