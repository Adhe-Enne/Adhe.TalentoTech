import React from "react";

import type { ImagePreviewProps } from "./ProductFormTypes";

import styles from "./Product.module.css";

const ProductImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { name, url, onFileChange, onClear } = props;
  return (
    <div>
      {url ? (
        <>
          <img alt="preview" className={styles.mainImage} src={url} />
          <button aria-label="Eliminar imagen principal" className={styles.imageRemove} onClick={onClear} type="button">
            ×
          </button>
        </>
      ) : (
        <div className={styles.placeholder}>Previsualización de imagen</div>
      )}
      <div className={styles.uploadGroup}>
        <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`}>
          <span>Seleccionar</span>
          <input accept="image/*" className={styles.hiddenInput} onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} type="file" />
        </label>
      </div>
      <div className={styles.previewMeta}>{name ?? "Sin imagen"}</div>
    </div>
  );
};

export default ProductImagePreview;
