import React from "react";

import type { ImagePreviewProps } from "../NewProductTypes";

import styles from "./Product.module.css";

const ProductImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { name, url, onFileChange, onClear } = props;
  return (
    <div>
      {url ? <img alt="preview" src={url} /> : <div className={styles.placeholder}>Previsualización de imagen</div>}
      <div className={styles.uploadGroup}>
        <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`}>
          <span>Seleccionar</span>
          <input accept="image/*" className={styles.hiddenInput} onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} type="file" />
        </label>
        {name && (
          <button className={`btn btn-sm ${styles.clearBtn}`} onClick={onClear} type="button">
            Limpiar
          </button>
        )}
      </div>
      <div className={styles.previewMeta}>{name ?? "Sin imagen"}</div>
    </div>
  );
};

export default ProductImagePreview;
