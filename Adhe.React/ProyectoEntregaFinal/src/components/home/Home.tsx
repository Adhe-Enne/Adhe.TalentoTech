import React, { type JSX } from "react";

import type { Product } from "../../models";

import ProductGrid from "../product/ProductGrid";

interface HomeProps {
  products: Product[];
  emptyMessage?: string;
  loading?: boolean;
}

const Home: React.FC<HomeProps> = (props) => {
  const { products, emptyMessage, loading } = props;
  const renderProductList: () => JSX.Element = () => {
    return products.length === 0 ? <div className="alert alert-info">{emptyMessage ?? "No hay productos disponibles."}</div> : <ProductGrid products={products} />;
  };

  return (
    <div className="container py-4">
      {loading ? (
        <div aria-busy="true" className="d-flex justify-content-center py-5">
          <div aria-hidden="true" className="spinner-border" />
          <output aria-live="polite" className="visually-hidden">
            Cargando...
          </output>
        </div>
      ) : (
        renderProductList()
      )}
    </div>
  );
};

export default Home;
