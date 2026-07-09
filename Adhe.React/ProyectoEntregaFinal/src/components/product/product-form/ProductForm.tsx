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
    <form className="max-w-[960px] mx-auto grid gap-5 items-start grid-cols-1 md:grid-cols-[420px_1fr] md:auto-rows-min" noValidate onSubmit={(e) => handleSubmit(onSubmit)(e)}>
      <div className="md:col-[1] md:row-[1] flex flex-col gap-3 items-stretch">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 min-h-[360px] flex flex-col items-stretch justify-start relative">
          {isEdit && existingImageUrl && !fields.file && (
            <div className="mb-2">
              <small className="text-gray-500">Imagen actual:</small>
            </div>
          )}
          <div className="mb-2">{errors.file && <div className="text-danger text-xs mt-1 block" role="alert">{errors.file}</div>}</div>
          <ProductImagePreview name={fields.file?.name} onClear={() => setFile(null)} onFileChange={setFile} url={displayUrl} />
          {isEdit && existingImageUrl && !fields.file && (
            <div className="mt-1">
              <small className="text-gray-500">Seleccioná un archivo para reemplazar la imagen actual</small>
            </div>
          )}
        </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 h-[180px] min-h-[180px] max-h-[180px] overflow-hidden flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h5 className="m-0">Imágenes adicionales</h5>
            <label className="bg-accent/5 border border-accent/15 text-accent px-3 py-1.5 rounded-xl shadow-sm hover:bg-accent/10 text-sm cursor-pointer inline-flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5" htmlFor={addInputId}>
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
          {errors.images && <div className="text-danger text-xs mt-1 block">{errors.images}</div>}
        </div>
      </div>

      <div className="md:col-[2] md:row-[1] bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="nombre">
            Nombre
          </label>
          <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${errors.nombre ? " border-red-500" : ""}`} id="nombre" onChange={(e) => setField("nombre", e.target.value)} required value={fields.nombre} />
          {errors.nombre && <div className="text-danger text-xs mt-1">{errors.nombre}</div>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="categoria">
            Categoría
          </label>
          <div className="flex gap-2">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition" id="categoria" onChange={(e) => handleCategoryChange(e.target.value)} value={fields.categoriaId}>
              <option value="">-- Sin categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition inline-flex items-center gap-1.5" onClick={handleOpenCategory} type="button">
              <FaPlus />
              Nueva
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div className="max-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="precio">
              Precio
            </label>
            <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${errors.precio ? " border-red-500" : ""}`} id="precio" min="0.01" onChange={(e) => setField("precio", e.target.value)} required step="0.01" type="number" value={fields.precio} />
            {errors.precio && <div className="text-danger text-xs mt-1">{errors.precio}</div>}
          </div>
          <div className="min-w-[100px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="stock">
              Stock
            </label>
            <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${errors.stock ? " border-red-500" : ""}`} id="stock" min="0" onChange={(e) => setField("stock", e.target.value)} step="1" type="number" value={fields.stock} />
            {errors.stock && <div className="text-danger text-xs mt-1">{errors.stock}</div>}
          </div>
          <div className="min-w-[120px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="currency">
              Moneda
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition" id="currency" onChange={(e) => setField("currency", parseCurrency(e.target.value))} value={fields.currency}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="EUR">EUR</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="descripcion">
            Descripción
          </label>
          <textarea className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${errors.descripcion ? " border-red-500" : ""}`} id="descripcion" onChange={(e) => setField("descripcion", e.target.value)} value={fields.descripcion} />
          {errors.descripcion && <div className="text-danger text-xs mt-1">{errors.descripcion}</div>}
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

      <div className="col-span-full md:col-[2] md:row-[2] flex justify-end gap-3 mt-2">
        <div className="flex gap-3 mt-2 justify-end">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition" onClick={handleCancel} type="button">
            {isEdit ? "Cancelar edición" : "Cancelar"}
          </button>
          <button className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition" disabled={!!loading} type="submit">
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
