import React from "react";

import type { Product } from "../../models";

import ProductCardContainer from "./product-card/ProductCardContainer";

interface ProductsListProps {
  products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = (props) => {
  const { products } = props;
  return (
    <div className="container">
      <div className="row g-3 product-grid-row">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCardContainer product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
