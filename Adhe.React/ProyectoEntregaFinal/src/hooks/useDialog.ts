import { useEffect, useRef, type RefObject } from "react";

export function useDialog(show: boolean): RefObject<HTMLDialogElement | null> {
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

  return dialogRef;
}
