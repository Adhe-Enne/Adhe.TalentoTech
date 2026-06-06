import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  message: string;
  open: boolean;
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const { open, title, message, confirmLabel = "Eliminar", cancelLabel = "Cancelar", confirmVariant = "danger", onConfirm, onCancel, loading = false } = props;
  const confirmRef: React.RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return (): void => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  useEffect(() => {
    const handler: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
      if (!open) {
        return;
      }
      if (e.key === "Escape") {
        onCancel();
      }
      if (e.key === "Enter" && !loading) {
        onConfirm();
      }
    };
    document.addEventListener("keydown", handler);
    return (): void => {
      document.removeEventListener("keydown", handler);
    };
  }, [open, onCancel, onConfirm, loading]);

  if (!open) {
    return null;
  }

  return (
    <>
      <button aria-label="Cerrar" className="modal-backdrop fade show" onClick={loading ? undefined : onCancel} tabIndex={-1} type="button" />
      <dialog
        aria-labelledby="confirm-dialog-title"
        className="modal fade show"
        onClick={loading ? undefined : onCancel}
        onKeyDown={
          loading
            ? undefined
            : (e: React.KeyboardEvent<HTMLElement>): void => {
                if (e.key === "Escape") {
                  onCancel();
                }
              }
        }
        open
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="none">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title" id="confirm-dialog-title">
                {title}
              </h5>
              <button aria-label="Cerrar" className="btn-close" disabled={loading} onClick={onCancel} type="button" />
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" disabled={loading} onClick={onCancel} type="button">
                {cancelLabel}
              </button>
              <button className={`btn btn-${confirmVariant}`} disabled={loading} onClick={onConfirm} ref={confirmRef} type="button">
                {loading ? "Eliminando..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmDialog;
