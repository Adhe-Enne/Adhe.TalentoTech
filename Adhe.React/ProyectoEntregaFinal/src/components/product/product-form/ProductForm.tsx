import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Currency, FormMode, ProductFormPayload, Fields } from "./ProductFormTypes";

import useCategories from "../../../hooks/useCategories";
import useNotification from "../../../hooks/useNotification";
import useTags from "../../../hooks/useTags";
import CloudUpload from "../../icons/CloudUpload";
import AdditionalImagesInput from "./AdditionalImagesInput";
import CategoryCreateModal from "./CategoryCreateModal";
import { useProductForm } from "./hooks/useProductForm";
import { useTagManager } from "./hooks/useTagManager";
import styles from "./Product.module.css";
import ProductImagePreview from "./ProductImagePreview";
import TagAutocomplete from "./TagAutocomplete";

const VALID_CURRENCIES: readonly Currency[] = ["USD", "ARS", "BTC"] as const;

function parseCurrency(value: string): Currency {
  return VALID_CURRENCIES.includes(value as Currency) ? (value as Currency) : "USD";
}

interface ProductFormProps {
  existingImageUrl?: string;
  initialData?: Partial<Fields>;
  loading?: boolean;
  mode?: FormMode;
  onCancel?: () => void;
  onSubmit: (payload: ProductFormPayload) => void;
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { loading, onSubmit, mode = "create", initialData, existingImageUrl, onCancel } = props;
  const { fields, setField, setFile, reset, previewUrl, handleSubmit, errors } = useProductForm(initialData);
  const navigate: NavigateFunction = useNavigate();
  const { categories, createCategory } = useCategories();
  const { tags, createTag } = useTags();
  const { setNotification } = useNotification();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const addInputId: string = React.useId();
  const displayUrl: string | undefined = previewUrl ?? existingImageUrl;

  const isEdit: boolean = mode === "edit";

  const handleCancel: () => void = useCallback(() => {
    reset();
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  }, [reset, onCancel, navigate]);

  const handleCategoryChange: (newId: string) => void = useCallback(
    (newId: string) => {
      if (newId !== fields.categoriaId) {
        setField("tags", []);
        setField("tagIds", []);
      }
      setField("categoriaId", newId);
    },
    [fields.categoriaId, setField],
  );

  const submitLabel: string = loading ? (isEdit ? "Actualizando..." : "Subiendo...") : isEdit ? "Actualizar producto" : "Subir producto";

  const handleExistingImagesChange: (urls: string[]) => void = useCallback(
    (urls: string[]) => {
      setField("existingImageUrls", urls);
    },
    [setField],
  );

  const { tagQuery, showSuggestions, suggestionsRef, setTagQuery, setShowSuggestions, onAddTagFromInput, onRemoveTag } = useTagManager(
    {
      allTags: tags,
      categoriaId: fields.categoriaId,
      tagIds: fields.tagIds,
      tags: fields.tags,
    },
    setField,
    createTag,
  );

  return (
    <form className={styles.formCard} noValidate onSubmit={(e) => handleSubmit(onSubmit)(e)}>
      <div className={styles.leftColumn}>
        <div className={styles.preview}>
          {isEdit && existingImageUrl && !fields.file && (
            <div className="mb-2">
              <small className="text-muted">Imagen actual:</small>
            </div>
          )}
          <ProductImagePreview name={fields.file?.name} onClear={() => setFile(null)} onFileChange={setFile} url={displayUrl} />
          {isEdit && existingImageUrl && !fields.file && (
            <div className="mt-1">
              <small className="text-muted">Seleccioná un archivo para reemplazar la imagen actual</small>
            </div>
          )}
        </div>
        <div className={styles.additionalArea}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0 }}>Imágenes adicionales</h5>
            <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`} htmlFor={addInputId}>
              Seleccionar imágenes
            </label>
          </div>
          <AdditionalImagesInput
            existingUrls={fields.existingImageUrls}
            files={fields.images}
            hideUploadButton
            inputId={addInputId}
            onChange={(files: File[]) => setField("images", files)}
            onExistingChange={handleExistingImagesChange}
          />
        </div>
      </div>

      <div className={styles.fields}>
        <div>
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input className={`form-control${errors.nombre ? " is-invalid" : ""}`} id="nombre" onChange={(e) => setField("nombre", e.target.value)} required value={fields.nombre} />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div>
          <label className="form-label" htmlFor="categoria">
            Categoría
          </label>
          <div className="d-flex gap-2">
            <select className="form-select" id="categoria" onChange={(e) => handleCategoryChange(e.target.value)} value={fields.categoriaId}>
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
            <input
              className={`form-control${errors.precio ? " is-invalid" : ""}`}
              id="precio"
              min="0.01"
              onChange={(e) => setField("precio", e.target.value)}
              required
              step="0.01"
              type="number"
              value={fields.precio}
            />
            {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
          </div>
          <div style={{ minWidth: 100 }}>
            <label className="form-label" htmlFor="stock">
              Stock
            </label>
            <input className="form-control" id="stock" min="0" onChange={(e) => setField("stock", e.target.value)} step="1" type="number" value={fields.stock} />
          </div>
          <div style={{ minWidth: 120 }}>
            <label className="form-label" htmlFor="currency">
              Moneda
            </label>
            <select className="form-select" id="currency" onChange={(e) => setField("currency", parseCurrency(e.target.value))} value={fields.currency}>
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

        <TagAutocomplete
          allTags={tags}
          categoriaId={fields.categoriaId}
          onAdd={onAddTagFromInput}
          onQueryChange={setTagQuery}
          onRemove={onRemoveTag}
          onShowSuggestions={setShowSuggestions}
          selectedTags={fields.tagIds}
          showSuggestions={showSuggestions}
          suggestionsRef={suggestionsRef}
          tagQuery={tagQuery}
        />
      </div>

      <div className={styles.formActions}>
        <div className={styles.actions}>
          <button className={`btn btn-ghost ${styles.cancelBtn}`} onClick={handleCancel} type="button">
            {isEdit ? "Cancelar edición" : "Cancelar"}
          </button>
          <button className="btn btn-cta btn-icon" disabled={!!loading} type="submit">
            <CloudUpload style={{ width: 18, height: 18 }} />
            {submitLabel}
          </button>
        </div>
      </div>

      <CategoryCreateModal
        isCreating={isCreatingCategory}
        onClose={() => setShowCategoryModal(false)}
        onCreate={async (name, slug) => {
          setIsCreatingCategory(true);
          try {
            const created: { id: string } | undefined = await createCategory(name, slug);
            if (created) {
              setField("categoriaId", created.id);
              setShowCategoryModal(false);
              setNotification(`Categoría "${name}" creada!`, 3000, "info");
            } else {
              setNotification("No se pudo crear la categoría", 3000, "danger");
            }
          } catch {
            setNotification("Error al crear la categoría", 3000, "danger");
          } finally {
            setIsCreatingCategory(false);
          }
        }}
        show={showCategoryModal}
      />
    </form>
  );
};

export default ProductForm;
