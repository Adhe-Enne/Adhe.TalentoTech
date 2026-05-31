import React from "react";

import type { ProductFormPayload } from "./NewProductTypes";

import ProductForm from "./product-form/ProductForm";

interface Props {
  loading?: boolean;
  onCreated?: (p: ProductFormPayload) => void;
}

const NewProductContainer: React.FC<Props> = (props) => {
  const { onCreated, loading = false } = props;

  function handleFormSubmit(payload: ProductFormPayload): void {
    onCreated?.(payload);
  }

  return (
    <div className="container py-4">
      <h2>Nuevo producto</h2>
      <ProductForm loading={loading} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default NewProductContainer;
