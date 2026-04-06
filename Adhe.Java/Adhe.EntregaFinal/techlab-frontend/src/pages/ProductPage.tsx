import React from 'react';
import ProductGrid from '../features/products/ProductGrid';

const ProductPage: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Productos</h2>
      <ProductGrid />
    </div>
  );
};

export default ProductPage;
