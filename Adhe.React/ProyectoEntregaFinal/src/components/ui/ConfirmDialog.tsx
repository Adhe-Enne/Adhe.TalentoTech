import React, { useEffect, useRef, type RefObject } from "react";

interface ConfirmDialogProps {
  message: string;
  open: boolean;
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: string;
  loading?: boolean;
  loadingLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const { open, title, message, confirmLabel = "Eliminar", cancelLabel = "Cancelar", confirmVariant = "danger", onConfirm, onCancel, loading = false, loadingLabel = "Eliminando..." } = props;
  const dialogRef: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);
  const confirmRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);

  useEffect((): void => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
      confirmRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect((): (() => void) => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) {
      return (): void => undefined;
    }
    const handler: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
      if (e.key === "Enter" && !loading) {
        onConfirm();
      }
    };
    dialog.addEventListener("keydown", handler);
    return (): void => dialog.removeEventListener("keydown", handler);
  }, [loading, onConfirm]);

  useEffect((): (() => void) => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    return (): void => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const handleCancel: () => void = (): void => {
    if (!loading) {
      onCancel();
    }
  };

  return (
    <dialog
      aria-labelledby="confirm-dialog-title"
      onClose={handleCancel}
      ref={dialogRef}
      role="alertdialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="none">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="confirm-dialog-title">
              {title}
            </h5>
            <button aria-label="Cerrar" className="btn-close" disabled={loading} onClick={handleCancel} type="button" />
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" disabled={loading} onClick={handleCancel} type="button">
              {cancelLabel}
            </button>
            <button className={`btn btn-${confirmVariant}`} disabled={loading} onClick={onConfirm} ref={confirmRef} type="button">
              {loading ? loadingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
