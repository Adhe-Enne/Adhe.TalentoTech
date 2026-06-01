import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Tag } from "../../../../models/Tag";
import type { ProductFormPayload } from "../NewProductTypes";

import useCategories from "../../../../hooks/useCategories";
import { useNotification } from "../../../../hooks/useNotification";
import useTags from "../../../../hooks/useTags";
import CloudUpload from "../../../icons/CloudUpload";
import AdditionalImagesInput from "./AdditionalImagesInput";
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
  const { tags: allTags, createTag } = useTags();
  const { setNotification } = useNotification();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const addInputId: string = React.useId();
  const [tagQuery, setTagQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionsRef: React.RefObject<HTMLUListElement | null> = useRef<HTMLUListElement | null>(null);

  useEffect((): (() => void) => {
    function onDocClick(e: MouseEvent): void {
      if (!suggestionsRef.current) {
        return;
      }
      if (!(e.target instanceof Node)) {
        return;
      }
      if (!suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return (): void => {
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  async function onAddTagFromInput(tag: string): Promise<void> {
    const t: string = tag.trim();
    if (!t) {
      return;
    }
    if (fields.tags.includes(t)) {
      return;
    }

    // try to find existing tag (case-insensitive)
    const existing: Tag | undefined = allTags.find((x) => x.name.toLowerCase() === t.toLowerCase());
    if (existing) {
      setField("tags", [...fields.tags, existing.name]);
      setField("tagIds", [...fields.tagIds, existing.id]);
      setTagQuery("");
      setShowSuggestions(false);
      return;
    }

    // create new tag immediately
    try {
      const created: Tag | undefined = await createTag(t, fields.categoriaId ?? "");
      if (created) {
        setField("tags", [...fields.tags, created.name]);
        setField("tagIds", [...fields.tagIds, created.id]);
      } else {
        setField("tags", [...fields.tags, t]);
      }
    } catch (err: unknown) {
      console.error(err);
      setField("tags", [...fields.tags, t]);
    }
    setTagQuery("");
    setShowSuggestions(false);
  }

  function onRemoveTag(tag: string): void {
    const idx: number = fields.tags.indexOf(tag);
    if (idx === -1) {
      return;
    }
    const newTags: string[] = fields.tags.filter((x: string) => x !== tag);
    const newTagIds: string[] = [...fields.tagIds];
    if (fields.tagIds.length > idx) {
      newTagIds.splice(idx, 1);
    }
    setField("tags", newTags);
    setField("tagIds", newTagIds);
  }

  const queryLower: string = tagQuery.trim().toLowerCase();
  const suggestions: Tag[] = useMemo((): Tag[] => {
    if (!queryLower) {
      return [];
    }
    return allTags.filter((t) => !fields.tags.includes(t.name) && (t.name.toLowerCase().startsWith(queryLower) || t.name.toLowerCase().includes(queryLower))).slice(0, 10);
  }, [allTags, fields.tags, queryLower]);

  return (
    <form className={styles.formCard} onSubmit={_onSubmit}>
      <div className={styles.leftColumn}>
        <div className={styles.preview}>
          <ProductImagePreview name={fields.file?.name} onClear={() => setFile(null)} onFileChange={setFile} url={previewUrl} />
        </div>

        <div className={styles.additionalArea}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0 }}>Imágenes adicionales</h5>
            <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`} htmlFor={addInputId}>
              Seleccionar imágenes
            </label>
          </div>
          <AdditionalImagesInput files={fields.images} hideUploadButton inputId={addInputId} onChange={(files) => setField("images", files)} />
        </div>
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
          <div style={{ minWidth: 120 }}>
            <label className="form-label" htmlFor="currency">
              Moneda
            </label>
            <select className="form-select" id="currency" onChange={(e) => setField("currency", e.target.value as "USD" | "ARS" | "BTC")} value={fields.currency}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea className="form-control" id="descripcion" onChange={(e) => setField("descripcion", e.target.value)} value={fields.descripcion} />
        </div>

        <div style={{ position: "relative" }}>
          <label className="form-label" htmlFor="tags-input">
            Tags
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-control"
              id="tags-input"
              onChange={(e) => {
                setTagQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  await onAddTagFromInput(tagQuery);
                }
              }}
              placeholder="Buscar o crear tag"
              value={tagQuery}
            />
            {showSuggestions && (suggestions.length > 0 || tagQuery.trim().length > 0) && (
              <ul className={styles.tagSuggestions} ref={suggestionsRef}>
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      className={styles.suggestionItem}
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        void onAddTagFromInput(s.name);
                      }}
                      type="button"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
                {suggestions.length === 0 && tagQuery.trim().length > 0 && (
                  <li>
                    <button
                      className={styles.suggestionItem}
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        void onAddTagFromInput(tagQuery);
                      }}
                      type="button"
                    >
                      Crear tag "{tagQuery.trim()}"
                    </button>
                  </li>
                )}
              </ul>
            )}
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
      </div>

      <div className={styles.formActions}>
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
        <div
          className="modal-backdrop show"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.48)",
            padding: 20,
            backdropFilter: "none",
            opacity: 1,
          }}
        >
          <dialog
            aria-busy={isCreatingCategory}
            aria-modal="true"
            className="modal-dialog"
            open
            style={{ width: "min(720px, 90%)", background: "transparent", border: "none", padding: 0, margin: 0 }}
          >
            <div
              className="modal-content p-3"
              style={{
                backgroundColor: "#ffffff",
                opacity: 1,
                borderRadius: 8,
                border: "none",
                boxShadow: "0 24px 48px rgba(0,0,0,0.28)",
                transform: "translateY(-4px)",
                zIndex: 2147483650,
              }}
            >
              <h5 style={{ marginTop: 0 }}>Crear categoría</h5>
              {isCreatingCategory && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span aria-hidden="true" className="spinner-border spinner-border-sm" />
                  <small>Creando categoría...</small>
                </div>
              )}
              <div className="mb-2">
                <label className="form-label" htmlFor="new-category-name">
                  Nombre
                </label>
                <input
                  autoFocus
                  className="form-control"
                  disabled={isCreatingCategory}
                  id="new-category-name"
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  value={newCategoryName}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="new-category-slug">
                  Slug (opcional)
                </label>
                <input className="form-control" disabled={isCreatingCategory} id="new-category-slug" onChange={(e) => setNewCategorySlug(e.target.value)} value={newCategorySlug} />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" disabled={isCreatingCategory} onClick={() => setShowCategoryModal(false)} type="button">
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isCreatingCategory}
                  onClick={async () => {
                    if (!newCategoryName.trim()) {
                      return;
                    }
                    try {
                      setIsCreatingCategory(true);
                      const created: { id: string } | undefined = await createCategory(newCategoryName, newCategorySlug);
                      if (created) {
                        setField("categoriaId", created.id);
                        setShowCategoryModal(false);
                        setNotification(`Categoría "${newCategoryName}" creada!`, 3000, "info");
                        setNewCategoryName("");
                        setNewCategorySlug("");
                      } else {
                        setNotification("No se pudo crear la categoría", 3000, "danger");
                      }
                    } catch (err: unknown) {
                      // eslint-disable-next-line no-console
                      console.error(err);
                      setNotification("Error al crear la categoría", 3000, "danger");
                    } finally {
                      setIsCreatingCategory(false);
                    }
                  }}
                  type="button"
                >
                  {isCreatingCategory ? (
                    <>
                      <span aria-hidden="true" className="spinner-border spinner-border-sm me-2"></span>
                      <span>Creando...</span>
                    </>
                  ) : (
                    "Crear"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </form>
  );
};

export default ProductForm;
