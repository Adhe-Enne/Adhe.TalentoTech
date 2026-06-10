import React from "react";

import type { FormMode, Fields, ProductFormPayload } from "./ProductFormTypes";

import ProductForm from "./ProductForm";

interface Props {
  existingImageUrl?: string;
  initialData?: Partial<Fields>;
  loading?: boolean;
  mode?: FormMode;
  onCancel?: () => void;
  onCreated?: (p: ProductFormPayload) => void;
}

const ProductFormWrapper: React.FC<Props> = (props) => {
  const { onCreated, loading = false, mode = "create", initialData, existingImageUrl, onCancel } = props;

  function handleFormSubmit(payload: ProductFormPayload): void {
    onCreated?.(payload);
  }

  return (
    <div className="container py-4">
      <h2>{mode === "edit" ? "Editar producto" : "Nuevo producto"}</h2>
      <ProductForm existingImageUrl={existingImageUrl} initialData={initialData} loading={loading} mode={mode} onCancel={onCancel} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ProductFormWrapper;
