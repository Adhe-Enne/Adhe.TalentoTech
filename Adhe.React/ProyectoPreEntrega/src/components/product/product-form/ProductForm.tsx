import React, { useState } from "react";

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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="mb-3">
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

      <div className="mb-3">
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

      <div className="mb-3">
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

      <div className="mb-3">
        <label className="form-label" htmlFor="imagen">
          Imagen
        </label>
        <input
          accept="image/*"
          className="form-control"
          id="imagen"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          type="file"
        />
      </div>

      <button className="btn btn-primary" disabled={!!loading} type="submit">
        {loading ? "Subiendo..." : "Subir producto"}
      </button>
    </form>
  );
};

export default ProductForm;
