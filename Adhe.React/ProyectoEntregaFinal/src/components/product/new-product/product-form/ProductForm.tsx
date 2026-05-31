import React, { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { ProductFormPayload } from "../NewProductTypes";

import useCategories from "../../../../hooks/useCategories";
import CloudUpload from "../../../icons/CloudUpload";
import { useProductForm } from "./hooks/useProductForm";
import styles from "./Product.module.css";
import ProductImagePreview from "./ProductImagePreview";

interface ProductFormProps {
  loading?: boolean;
  onSubmit: (payload: ProductFormPayload) => void;
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { loading, onSubmit } = props;
  const { fields, setField, setFile, reset, previewUrl, handleSubmit } = useProductForm();
  const navigate: NavigateFunction = useNavigate();

  const onCancel: () => void = (): void => {
    reset();
    navigate("/");
  };

  function _onSubmit(e: React.SyntheticEvent): void {
    handleSubmit(onSubmit)(e);
  }

  const { categories, createCategory } = useCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");

  function onAddTagFromInput(tag: string): void {
    const t: string = tag.trim();
    if (!t) {
      return;
    }
    if (fields.tags.includes(t)) {
      return;
    }
    setField("tags", [...fields.tags, t]);
  }

  function onRemoveTag(tag: string): void {
    setField(
      "tags",
      fields.tags.filter((x: string) => x !== tag),
    );
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

        <div>
          <label className="form-label" htmlFor="categoria">
            Categoría
          </label>
          <div className="d-flex gap-2">
            <select className="form-select" id="categoria" onChange={(e) => setField("categoriaId", e.target.value)} value={fields.categoriaId}>
              <option value="">-- Sin categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="btn btn-outline-secondary" onClick={() => setShowCategoryModal(true)} type="button">
              Nueva
            </button>
          </div>
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

        <div>
          <label className="form-label" htmlFor="tags-input">
            Tags
          </label>
          <div className="d-flex gap-2 align-items-center">
            <input
              className="form-control"
              id="tags-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val: string = (e.target as HTMLInputElement).value;
                  onAddTagFromInput(val);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
              placeholder="Agregar tag y presionar Enter"
            />
          </div>
          <div className="mt-2">
            {fields.tags.map((t: string) => (
              <span className="badge bg-secondary me-1" key={t}>
                {t}{" "}
                <button className="btn btn-sm btn-link text-white ms-1" onClick={() => onRemoveTag(t)} type="button">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`btn btn-ghost ${styles.cancelBtn}`} onClick={onCancel} type="button">
            Cancelar
          </button>
          <button className="btn btn-cta btn-icon" disabled={!!loading} type="submit">
            <CloudUpload style={{ width: 18, height: 18 }} />
            {loading ? "Subiendo..." : "Subir producto"}
          </button>
        </div>
      </div>

      {showCategoryModal && (
        <div className="modal-backdrop show" style={{ position: "fixed", inset: 0, zIndex: 1050 }}>
          <dialog aria-modal="true" className="modal-dialog" open>
            <div className="modal-content p-3">
              <h5>Crear categoría</h5>
              <div className="mb-2">
                <label className="form-label" htmlFor="new-category-name">
                  Nombre
                </label>
                <input className="form-control" id="new-category-name" onChange={(e) => setNewCategoryName(e.target.value)} value={newCategoryName} />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="new-category-slug">
                  Slug (opcional)
                </label>
                <input className="form-control" id="new-category-slug" onChange={(e) => setNewCategorySlug(e.target.value)} value={newCategorySlug} />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setShowCategoryModal(false)} type="button">
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    if (!newCategoryName.trim()) {
                      return;
                    }
                    const created: { id: string } | undefined = await createCategory(newCategoryName, newCategorySlug);
                    if (created) {
                      setField("categoriaId", created.id);
                      setShowCategoryModal(false);
                      setNewCategoryName("");
                      setNewCategorySlug("");
                    }
                  }}
                  type="button"
                >
                  Crear
                </button>
              </div>
            </div>
          </dialog>{" "}
        </div>
      )}
    </form>
  );
};

export default ProductForm;
