import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import type { Person } from "../../../../models";

import modalStyles from "./ContactBioModal.module.css";

interface Props {
  person: Person | null;
  show: boolean;
  onClose: () => void;
}

const ContactBioModal: React.FC<Props> = (props) => {
  const { show, person, onClose } = props;

  useEffect(() => {
    if (!show) {
      return undefined;
    }

    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape" || e.key === "Enter") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKey);
    return (): void => document.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show || !person) {
    return null;
  }

  const modal: React.ReactNode = (
    <dialog aria-modal="true" className={modalStyles.modalOverlay} open>
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
              <a className="btn btn-ghost btn-sm" href={`mailto:${person.email}`}>
                Email
              </a>
            )}
            {person.linkedin && (
              <a className="btn btn-outline-primary btn-sm" href={person.linkedin} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );

  if (typeof document === "undefined") {
    return modal as React.ReactElement | null;
  }

  return createPortal(modal, document.body);
};

export default ContactBioModal;
