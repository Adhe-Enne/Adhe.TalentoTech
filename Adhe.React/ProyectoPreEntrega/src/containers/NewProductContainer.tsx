import React from "react";

import ProductForm from "../components/product/product-form/ProductForm";

type FormPayload = {
  nombre: string;
  precio: number;
  descripcion?: string;
  file?: File | null;
};

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
