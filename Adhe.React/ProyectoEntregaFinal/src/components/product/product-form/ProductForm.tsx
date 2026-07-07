import React, { useCallback } from "react";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { Category, Tag } from "../../../models";
import type { FormMode, ProductFormPayload, Fields } from "./ProductFormTypes";

import { parseCurrency } from "../../../utils/currency";
import AdditionalImagesInput from "./AdditionalImagesInput";
import CategoryCreateModal from "./CategoryCreateModal";
import useCategoryCreate from "./hooks/useCategoryCreate";
import { useProductForm } from "./hooks/useProductForm";
import { useTagManager } from "./hooks/useTagManager";
import styles from "./Product.module.css";
import ProductImagePreview from "./ProductImagePreview";
import TagAutocomplete from "./TagAutocomplete";

interface ProductFormProps {
  categories: Category[];
  tags: Tag[];
  existingImageUrl?: string;
  initialData?: Partial<Fields>;
  loading?: boolean;
  mode?: FormMode;
  onCancel?: () => void;
  onCreateCategory: (name: string, slug?: string) => Promise<{ id: string } | undefined>;
  onCreateTag: (name: string, categoryId: string) => Promise<Tag | undefined>;
  onSubmit: (payload: ProductFormPayload) => void;
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { categories, loading, onSubmit, mode = "create", initialData, existingImageUrl, onCancel, onCreateCategory, onCreateTag, tags } = props;
  const { fields, setField, setFile, reset, previewUrl, handleSubmit, errors } = useProductForm(initialData);
  const navigate: NavigateFunction = useNavigate();
  const { isCreating: isCreatingCategory, show: showCategoryModal, handleClose: handleCloseCategory, handleOpen: handleOpenCategory, handleCreate: handleCreateCategory } = useCategoryCreate(onCreateCategory, setField);
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

  const isLoadingAndEdit: (loading: boolean | undefined) => string = (loading: boolean | undefined) => {
    if (loading) {
      return isEdit ? "Actualizando..." : "Subiendo...";
    }
    return isEdit ? "Actualizar producto" : "Subir producto";
  };

  const submitLabel: string = isLoadingAndEdit(loading);

  const { tagQuery, showSuggestions, suggestionsRef, setTagQuery, setShowSuggestions, onAddTagFromInput, onRemoveTag } = useTagManager(
    {
      allTags: tags,
      categoriaId: fields.categoriaId,
      tagIds: fields.tagIds,
      tags: fields.tags,
    },
    setField,
    onCreateTag,
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
          <div className="mb-2">{errors.file && <div className="invalid-feedback d-block" role="alert">{errors.file}</div>}</div>
          <ProductImagePreview name={fields.file?.name} onClear={() => setFile(null)} onFileChange={setFile} url={displayUrl} />
          {isEdit && existingImageUrl && !fields.file && (
            <div className="mt-1">
              <small className="text-muted">Seleccioná un archivo para reemplazar la imagen actual</small>
            </div>
          )}
        </div>
        <div className={styles.additionalArea}>
          <div className={styles.additionalHeader}>
            <h5 className="m-0">Imágenes adicionales</h5>
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
            onExistingChange={(urls) => setField("existingImageUrls", urls)}
          />
          {errors.images && <div className="invalid-feedback d-block">{errors.images}</div>}
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
            <button className="btn btn-outline-secondary" onClick={handleOpenCategory} type="button">
              <FaPlus className="me-1" />
              Nueva
            </button>
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.priceInput}>
            <label className="form-label" htmlFor="precio">
              Precio
            </label>
            <input className={`form-control${errors.precio ? " is-invalid" : ""}`} id="precio" min="0.01" onChange={(e) => setField("precio", e.target.value)} required step="0.01" type="number" value={fields.precio} />
            {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
          </div>
          <div className={styles.stockField}>
            <label className="form-label" htmlFor="stock">
              Stock
            </label>
            <input className={`form-control${errors.stock ? " is-invalid" : ""}`} id="stock" min="0" onChange={(e) => setField("stock", e.target.value)} step="1" type="number" value={fields.stock} />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
          <div className={styles.currencyField}>
            <label className="form-label" htmlFor="currency">
              Moneda
            </label>
            <select className="form-select" id="currency" onChange={(e) => setField("currency", parseCurrency(e.target.value))} value={fields.currency}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="EUR">EUR</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea className={`form-control${errors.descripcion ? " is-invalid" : ""}`} id="descripcion" onChange={(e) => setField("descripcion", e.target.value)} value={fields.descripcion} />
          {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
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
            <FaCloudUploadAlt />
            {submitLabel}
          </button>
        </div>
      </div>

      <CategoryCreateModal isCreating={isCreatingCategory} onClose={handleCloseCategory} onCreate={handleCreateCategory} show={showCategoryModal} />
    </form>
  );
};

export default ProductForm;
