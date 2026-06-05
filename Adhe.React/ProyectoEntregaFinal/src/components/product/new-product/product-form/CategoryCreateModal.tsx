import React, { useState } from "react";

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

  if (!show) {return null;}

  return (
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
        aria-busy={isCreating}
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
          {isCreating && (
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
              disabled={isCreating}
              id="new-category-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" htmlFor="new-category-slug">
              Slug (opcional)
            </label>
            <input className="form-control" disabled={isCreating} id="new-category-slug" onChange={(e) => setSlug(e.target.value)} value={slug} />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" disabled={isCreating} onClick={onClose} type="button">
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              disabled={isCreating}
              onClick={async () => {
                if (!name.trim()) {return;}
                await onCreate(name, slug);
                setName("");
                setSlug("");
              }}
              type="button"
            >
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
    </div>
  );
};

export default CategoryCreateModal;
