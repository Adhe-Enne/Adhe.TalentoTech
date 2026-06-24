import React, { useEffect, useRef, useState, type RefObject } from "react";

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
  const dialogRef: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);

  useEffect((): void => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (show && !dialog.open) {
      dialog.showModal();
    } else if (!show && dialog.open) {
      dialog.close();
    }
  }, [show]);

  const handleCreate: () => Promise<void> = async (): Promise<void> => {
    if (!name.trim()) {
      return;
    }
    await onCreate(name, slug);
    setName("");
    setSlug("");
  };

  return (
    <dialog aria-busy={isCreating} aria-modal="true" className={modalStyles.dialog} onClose={onClose} ref={dialogRef}>
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
            Nombre
          </label>
          <input autoFocus className="form-control" disabled={isCreating} id="new-category-name" onChange={(e) => setName(e.target.value)} value={name} />
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="new-category-slug">
            Slug (opcional)
          </label>
          <input className="form-control" disabled={isCreating} id="new-category-slug" onChange={(e) => setSlug(e.target.value)} value={slug} />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button aria-label="Cancelar creación de categoría" className="btn btn-secondary" disabled={isCreating} onClick={onClose} type="button">
            Cancelar
          </button>
          <button aria-label="Crear categoría" className="btn btn-primary" disabled={isCreating} onClick={handleCreate} type="button">
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
