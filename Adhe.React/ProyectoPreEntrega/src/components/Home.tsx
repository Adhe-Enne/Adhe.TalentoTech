import React, { type JSX } from "react";

import { type Product } from "../models";
import ListaProductos from "./product/ListaProductos";

interface HomeProps {
  products: Product[];
  loading?: boolean;
  onAddToCart: (product: Product, cantidad?: number) => void;
  onSelect: (product: Product) => void;
}

const Home: React.FC<HomeProps> = (props) => {
  const { loading, products, onAddToCart, onSelect } = props;

  const renderProductList: () => JSX.Element = () => {
    return products.length === 0 ? (
      <div className="alert alert-info">No hay productos disponibles.</div>
    ) : (
      <ListaProductos onAddToCart={(p: Product) => onAddToCart(p, 1)} onSelect={onSelect} products={products} />
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
