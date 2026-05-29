import React from "react";

import type { FormPayload } from "../Product.Types";

import ProductForm from "./ProductForm";

interface Props {
  loading?: boolean;
  onCreated?: (p: FormPayload) => void;
}

const NewProductContainer: React.FC<Props> = (props) => {
  const { onCreated, loading = false } = props;

  function handleFormSubmit(payload: FormPayload): void {
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
