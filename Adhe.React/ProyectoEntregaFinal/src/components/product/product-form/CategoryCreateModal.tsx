import React, { useState, type RefObject } from "react";

import useNotification from "../../../hooks/selectors/useNotification";
import { useDialog } from "../../../hooks/useDialog";
import { isValidSlug, maxLength } from "../../../utils/validators";

interface CategoryCreateModalProps {
  isCreating: boolean;
  show: boolean;
  onClose: () => void;
  onCreate: (name: string, slug?: string) => Promise<void>;
}

const CategoryCreateModal: React.FC<CategoryCreateModalProps> = (props) => {
  const { isCreating, onClose, onCreate, show } = props;
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const dialogRef: RefObject<HTMLDialogElement | null> = useDialog(show);
  const { setNotification } = useNotification();

  const handleClose: () => void = (): void => {
    setName("");
    setSlug("");
    setNameError(null);
    setSlugError(null);
    onClose();
  };

  const handleNameChange: (value: string) => void = (value: string): void => {
    setName(value);
    if (!value.trim()) {
      setNameError("El nombre es obligatorio");
    } else if (maxLength(value.trim(), 50)) {
      setNameError(null);
    } else {
      setNameError("El nombre no debe exceder los 50 caracteres");
    }
  };

  const handleSlugChange: (value: string) => void = (value: string): void => {
    const sanitized: string = value.toUpperCase().replace(/\s+/g, "");
    setSlug(sanitized);
    if (!sanitized) {
      setSlugError("El slug es obligatorio");
    } else if (isValidSlug(sanitized)) {
      setSlugError(null);
    } else {
      setSlugError("Solo letras, números y guión medio, sin espacios");
    }
  };

  const validateAll: () => boolean = (): boolean => {
    let valid: boolean = true;
    if (!name.trim()) {
      setNameError("El nombre es obligatorio");
      valid = false;
    } else if (maxLength(name.trim(), 50)) {
      setNameError(null);
    } else {
      setNameError("El nombre no debe exceder los 50 caracteres");
      valid = false;
    }
    if (!slug) {
      setSlugError("El slug es obligatorio");
      valid = false;
    } else if (isValidSlug(slug)) {
      setSlugError(null);
    } else {
      setSlugError("Solo letras, números y guión medio, sin espacios");
      valid = false;
    }
    return valid;
  };

  const handleCreate: () => Promise<void> = async (): Promise<void> => {
    if (!validateAll()) {
      setNotification("Corregí los errores en el formulario", 3000, "danger");
      return;
    }
    await onCreate(name, slug);
    setName("");
    setSlug("");
    setNameError(null);
    setSlugError(null);
  };

  return (
    <dialog aria-busy={isCreating} aria-modal="true" className="fixed inset-0 m-auto w-fit h-fit max-w-[90vw] max-h-[90vh] p-0 bg-transparent open:backdrop:bg-black/50 animate-zoom-in" onClose={handleClose} ref={dialogRef}>
      <div className="bg-white rounded-xl shadow-xl w-[min(400px,90vw)] p-5 space-y-4">
        <h5 className="text-lg font-semibold text-gray-900">Crear categoría</h5>
        {isCreating && (
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-accent rounded-full inline-block" />
            <small className="text-sm text-gray-600">Creando categoría...</small>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="new-category-name">
            Nombre *
          </label>
          <input autoFocus className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${nameError ? " border-danger" : ""}`} disabled={isCreating} id="new-category-name" onChange={(e) => handleNameChange(e.target.value)} value={name} />
          {nameError && <div className="text-danger text-xs mt-1">{nameError}</div>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="new-category-slug">
            Slug *
          </label>
          <input className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition${slugError ? " border-danger" : ""}`} disabled={isCreating} id="new-category-slug" onChange={(e) => handleSlugChange(e.target.value)} value={slug} />
          {slugError && <div className="text-danger text-xs mt-1">{slugError}</div>}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button aria-label="Cancelar creación de categoría" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50" disabled={isCreating} onClick={handleClose} type="button">
            Cancelar
          </button>
          <button aria-label="Crear categoría" className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2" disabled={isCreating || !!nameError || !!slugError || !name.trim() || !slug} onClick={handleCreate} type="button">
            {isCreating ? (
              <>
                <span aria-hidden="true" className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-accent rounded-full inline-block" />
                <span>Creando...</span>
              </>
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CategoryCreateModal;
