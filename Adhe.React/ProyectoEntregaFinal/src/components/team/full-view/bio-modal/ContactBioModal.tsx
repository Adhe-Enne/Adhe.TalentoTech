import React, { useEffect, useRef, type RefObject } from "react";

import type { Person } from "../../../../models";

import modalStyles from "./ContactBioModal.module.css";

interface Props {
  person: Person | null;
  show: boolean;
  onClose: () => void;
}

const ContactBioModal: React.FC<Props> = (props) => {
  const { show, person, onClose } = props;
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

  useEffect((): (() => void) => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) {
      return (): void => undefined;
    }
    const onKey: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        onClose();
      }
    };
    dialog.addEventListener("keydown", onKey);
    return (): void => dialog.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!person) {
    return null;
  }

  return (
    <dialog aria-modal="true" className={modalStyles.modalOverlay} onClose={onClose} ref={dialogRef}>
      <div className={modalStyles.modalDialog}>
        <div className={modalStyles.modalHeader}>
          <h4 className={modalStyles.modalTitle}>{person.name}</h4>
          <button aria-label="Cerrar modal" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className={modalStyles.modalBody}>
          {person.position && <div className={modalStyles.modalMeta}>{person.position}</div>}
          {person.bio ? <p>{person.bio}</p> : <p className={modalStyles.smallMeta}>Sin biografía disponible.</p>}
          <div className={modalStyles.modalLinks}>
            {person.email && (
              <a aria-label={`Email de ${person.name}`} className="btn btn-ghost btn-sm" href={`mailto:${person.email}`}>
                Email
              </a>
            )}
            {person.linkedin && (
              <a aria-label={`LinkedIn de ${person.name}`} className="btn btn-outline-primary btn-sm" href={person.linkedin} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ContactBioModal;
