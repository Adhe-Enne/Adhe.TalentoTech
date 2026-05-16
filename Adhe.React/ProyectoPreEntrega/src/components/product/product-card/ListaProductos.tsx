import React from "react";

import { type Product } from "../../../models";
import TarjetaProducto from "./TarjetaProducto";

interface ListaProductosProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onSelect?: (product: Product) => void;
}

const ListaProductos: React.FC<ListaProductosProps> = (props) => {
  const { products, onAddToCart, onSelect } = props;

  return (
    <div className="container">
      <div className="row g-3 product-grid-row">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <TarjetaProducto onAddToCart={onAddToCart} onClick={onSelect} product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaProductos;
