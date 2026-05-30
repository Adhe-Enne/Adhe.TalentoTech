import React, { type JSX } from "react";

import { type Product } from "../../models";
import ProductsList from "../product/ProductsList";

interface HomeProps {
  products: Product[];
  emptyMessage?: string;
  loading?: boolean;
  onAddToCart: (product: Product, cantidad?: number) => void;
  onSelect: (product: Product) => void;
}

const Home: React.FC<HomeProps> = (props) => {
  const { loading, emptyMessage, products, onAddToCart, onSelect } = props;

  const renderProductList: () => JSX.Element = () => {
    return products.length === 0 ? (
      <div className="alert alert-info">{emptyMessage ?? "No hay productos disponibles."}</div>
    ) : (
      <ProductsList onAddToCart={(p: Product) => onAddToCart(p, 1)} onSelect={onSelect} products={products} />
    );
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
