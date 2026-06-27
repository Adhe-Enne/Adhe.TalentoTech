import React, { type RefObject } from "react";

import type { Person } from "../../../models";

import HelmetMeta from "../../ui/HelmetMeta";
import modalStyles from "./bio-modal/ContactBioModal.module.css";
import styles from "./TeamFullView.module.css";
import expandedStyles from "./TeamMemberCardExpanded.module.css";

interface TeamFullViewViewProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  error: string | null;
  loading: boolean;
  selected: Person | null;
  showModal: boolean;
  team: Person[];
  onClose: () => void;
  onShowMore: (p: Person) => void;
}

const TeamFullViewView: React.FC<TeamFullViewViewProps> = (props) => {
  const { dialogRef, error, loading, onClose, onShowMore, selected, showModal, team } = props;

  if (loading) {
    return (
      <div aria-live="polite" className={styles.loading} role="status">
        Cargando equipo...
      </div>
    );
  }
  if (error) {
    return (
      <div aria-live="assertive" className={styles.error} role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <HelmetMeta description="Conoce a nuestro equipo en Talento Tech." title="Talento Tech | Equipo" />
      <div className={styles.container}>
        <h2 className={styles.title}>Equipo completo</h2>
        <div className={styles.list}>
          {team.map((p) => {
            const { name, position, email, linkedin, bio, photo } = p;
            return (
              <div className={styles.item} key={p.id}>
                <div className={expandedStyles.cardFull}>
                  <div className={expandedStyles.photoWrap}>
                    <img alt={name} className={expandedStyles.photoFull} src={photo ?? "/images/avatar1.svg"} />
                  </div>
                  <div className={expandedStyles.content}>
                    <div className={expandedStyles.header}>
                      <div>
                        <h4 className={expandedStyles.name}>{name}</h4>
                        {position && <div className={expandedStyles.meta}>{position}</div>}
                      </div>
                      <div className={expandedStyles.links}>
                        {email && <a aria-label={`Email de ${name}`} className="btn btn-ghost btn-sm" href={`mailto:${email}`}>Email</a>}
                        {linkedin && <a aria-label={`LinkedIn de ${name}`} className="btn btn-outline-primary btn-sm" href={linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a>}
                      </div>
                    </div>
                    {bio && (
                      <>
                        <div className={expandedStyles.bio}>{bio}</div>
                        <div>
                          <button aria-label={`Ver más bio de ${name}`} className="btn btn-ghost btn-sm" onClick={() => onShowMore(p)} type="button">Ver más</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selected && showModal && (
          <dialog aria-modal="true" className={modalStyles.modalOverlay} onClose={onClose} ref={dialogRef}>
            <div className={modalStyles.modalDialog}>
              <div className={modalStyles.modalHeader}>
                <h4 className={modalStyles.modalTitle}>{selected.name}</h4>
                <button aria-label="Cerrar modal" className="btn btn-ghost btn-sm" onClick={onClose}>Cerrar</button>
              </div>
              <div className={modalStyles.modalBody}>
                {selected.position && <div className={modalStyles.modalMeta}>{selected.position}</div>}
                {selected.bio ? <p>{selected.bio}</p> : <p className={modalStyles.smallMeta}>Sin biografía disponible.</p>}
                <div className={modalStyles.modalLinks}>
                  {selected.email && <a aria-label={`Email de ${selected.name}`} className="btn btn-ghost btn-sm" href={`mailto:${selected.email}`}>Email</a>}
                  {selected.linkedin && <a aria-label={`LinkedIn de ${selected.name}`} className="btn btn-outline-primary btn-sm" href={selected.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a>}
                </div>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
};

export default TeamFullViewView;
