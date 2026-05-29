import React from "react";

import type { FormPayload } from "../Product.Types";

import CloudUpload from "../../icons/CloudUpload";
import { useProductForm } from "./hooks/useProductForm";
import styles from "./Product.module.css";
import ProductImagePreview from "./ProductImagePreview";

interface ProductFormProps {
  loading?: boolean;
  onSubmit: (payload: FormPayload) => void;
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { loading, onSubmit } = props;
  const { fields, setField, setFile, reset, previewUrl, handleSubmit } = useProductForm();

  function _onSubmit(e: React.SyntheticEvent): void {
    handleSubmit(onSubmit)(e);
  }

  return (
    <form className={styles.formCard} onSubmit={_onSubmit}>
      <div className={styles.preview}>
        <ProductImagePreview name={fields.file?.name} onClear={() => setFile(null)} onFileChange={setFile} url={previewUrl} />
      </div>

      <div className={styles.fields}>
        <div>
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input className="form-control" id="nombre" onChange={(e) => setField("nombre", e.target.value)} required value={fields.nombre} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.priceInput}>
            <label className="form-label" htmlFor="precio">
              Precio
            </label>
            <input className="form-control" id="precio" onChange={(e) => setField("precio", e.target.value)} required step="0.01" type="number" value={fields.precio} />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea className="form-control" id="descripcion" onChange={(e) => setField("descripcion", e.target.value)} value={fields.descripcion} />
        </div>

        <div className={styles.actions}>
          <button className={`btn btn-ghost ${styles.cancelBtn}`} onClick={reset} type="button">
            Cancelar
          </button>
          <button className="btn btn-cta btn-icon" disabled={!!loading} type="submit">
            <CloudUpload style={{ width: 18, height: 18 }} />
            {loading ? "Subiendo..." : "Subir producto"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
