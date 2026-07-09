import React, { useEffect, useRef, type RefObject } from "react";

import { useDialog } from "../../hooks/useDialog";

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
  const {
    open,
    title,
    message,
    confirmLabel = "Eliminar",
    cancelLabel = "Cancelar",
    confirmVariant = "danger",
    onConfirm,
    onCancel,
    loading = false,
    loadingLabel = "Eliminando...",
  } = props;
  const dialogRef: RefObject<HTMLDialogElement | null> = useDialog(open);
  const confirmRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);

  useEffect((): void => {
    if (open && confirmRef.current) {
      confirmRef.current.focus();
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
  }, [loading, onConfirm, dialogRef]);

  useEffect((): (() => void) => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    return (): void => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, [dialogRef]);

  const handleCancel: () => void = (): void => {
    if (!loading) {
      onCancel();
    }
  };

  return (
    open && (
      <dialog
        aria-labelledby="confirm-dialog-title"
        className="fixed inset-0 m-0 w-full h-full max-w-none max-h-none bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[2147483647] outline-none place-items-center animate-fade-in"
        onClose={handleCancel}
        ref={dialogRef}
        role="alertdialog"
      >
        <div className="max-w-lg w-full animate-zoom-in" role="none">
          <div className="bg-white rounded-2xl shadow-2xl w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h5 className="text-lg font-semibold" id="confirm-dialog-title">
                {title}
              </h5>
              <button
                aria-label="Cerrar"
                className="bg-transparent border-0 cursor-pointer opacity-40 hover:opacity-100 text-xl leading-none p-0"
                disabled={loading}
                onClick={handleCancel}
                type="button"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <p className="mb-0">{message}</p>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
                disabled={loading}
                onClick={handleCancel}
                type="button"
              >
                {cancelLabel}
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 text-sm ${
                  confirmVariant === "danger" ? "bg-danger hover:opacity-90" : "bg-cta hover:opacity-90"
                }`}
                disabled={loading}
                onClick={onConfirm}
                ref={confirmRef}
                type="button"
              >
                {loading ? loadingLabel : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    )
  );
};

export default ConfirmDialog;
