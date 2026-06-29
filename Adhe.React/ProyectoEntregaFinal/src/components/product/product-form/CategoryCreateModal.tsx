import React, { useState, type RefObject } from "react";

import useNotification from "../../../hooks/selectors/useNotification";
import { useDialog } from "../../../hooks/useDialog";
import { isValidSlug, maxLength } from "../../../utils/validators";
import modalStyles from "./CategoryCreateModal.module.css";

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
      if (!name.trim()) {
        setNotification("El nombre es obligatorio", 3000, "danger");
      }
      if (!slug) {
        setNotification("El slug es obligatorio", 3000, "danger");
      } else if (!isValidSlug(slug)) {
        setNotification("Slug inválido: solo mayúsculas, números y guión medio", 3000, "danger");
      }
      return;
    }
    await onCreate(name, slug);
    setName("");
    setSlug("");
    setNameError(null);
    setSlugError(null);
  };

  return (
    <dialog aria-busy={isCreating} aria-modal="true" className={modalStyles.dialog} onClose={handleClose} ref={dialogRef}>
      <div className={modalStyles.content}>
        <h5 className={modalStyles.title}>Crear categoría</h5>
        {isCreating && (
          <div className={modalStyles.loading}>
            <span aria-hidden="true" className="spinner-border spinner-border-sm" />
            <small>Creando categoría...</small>
          </div>
        )}
        <div className="mb-2">
          <label className="form-label" htmlFor="new-category-name">
            Nombre *
          </label>
          <input autoFocus className={`form-control${nameError ? " is-invalid" : ""}`} disabled={isCreating} id="new-category-name" onChange={(e) => handleNameChange(e.target.value)} value={name} />
          {nameError && <div className="invalid-feedback">{nameError}</div>}
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="new-category-slug">
            Slug *
          </label>
          <input className={`form-control${slugError ? " is-invalid" : ""}`} disabled={isCreating} id="new-category-slug" onChange={(e) => handleSlugChange(e.target.value)} value={slug} />
          {slugError && <div className="invalid-feedback">{slugError}</div>}
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button aria-label="Cancelar creación de categoría" className="btn btn-secondary" disabled={isCreating} onClick={handleClose} type="button">
            Cancelar
          </button>
          <button aria-label="Crear categoría" className="btn btn-primary" disabled={isCreating || !!nameError || !!slugError || !name.trim() || !slug} onClick={handleCreate} type="button">
            {isCreating ? (
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
  );
};

export default CategoryCreateModal;
