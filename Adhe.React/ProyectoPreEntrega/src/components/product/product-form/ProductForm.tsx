import React, { useState, useMemo } from "react";

import styles from "./ProductForm.module.css";

type FormPayload = {
  nombre: string;
  precio: number;
  descripcion?: string;
  file?: File | null;
};

interface ProductFormProps {
  loading?: boolean;
  onSubmit: (payload: FormPayload) => void;
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { loading, onSubmit } = props;

  const [descripcion, setDescripcion] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");

  function handleSubmit(e: React.SyntheticEvent): void {
    e.preventDefault();
    onSubmit({ nombre: nombre.trim(), precio: Number.parseFloat(precio) || 0, descripcion: descripcion.trim(), file });
  }

  const previewUrl: string | undefined = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.preview}>
        {previewUrl ? (
          <img alt="preview" src={previewUrl} />
        ) : (
          <div className={styles.placeholder}>Previsualización de imagen</div>
        )}

        <div className={styles.uploadGroup}>
          <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`}>
            <span>Seleccionar</span>
            <input
              accept="image/*"
              className={styles.hiddenInput}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          {file && (
            <button
              className={`btn btn-sm clearBtn`}
              onClick={() => {
                setFile(null);
              }}
              type="button"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className={styles.previewMeta}>{file ? file.name : "Sin imagen"}</div>
      </div>

      <div className={styles.fields}>
        <div>
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input
            className="form-control"
            id="nombre"
            onChange={(e) => setNombre(e.target.value)}
            required
            value={nombre}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.priceInput}>
            <label className="form-label" htmlFor="precio">
              Precio
            </label>
            <input
              className="form-control"
              id="precio"
              onChange={(e) => setPrecio(e.target.value)}
              required
              step="0.01"
              type="number"
              value={precio}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
        </div>

        <div className={styles.actions}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setNombre("");
              setPrecio("");
              setDescripcion("");
              setFile(null);
            }}
            type="button"
          >
            Cancelar
          </button>
          <button className="btn btn-cta" disabled={!!loading} type="submit">
            {loading ? "Subiendo..." : "Subir producto"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
