import React, { useState } from "react";

import type { Person } from "../../../models";

import ContactBioModal from "./biomodal/ContactBioModal";
import CardContactFull from "./CardContactFull";
import styles from "./DirectoryFullView.module.css";

interface Props {
  loading: boolean;
  people: Person[];
  error?: string | null;
}

const DirectoryFullView: React.FC<Props> = (props) => {
  const { loading, error, people } = props;
  const [selected, setSelected] = useState<Person | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  function handleShowMore(p: Person): void {
    setSelected(p);
    setShowModal(true);
  }

  function handleClose(): void {
    setShowModal(false);
    setSelected(null);
  }

  if (loading) {
    return <div className={styles.loading}>Cargando equipo...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Equipo completo</h2>
      <div className={styles.list}>
        {people.map((p) => (
          <div className={styles.item} key={p.id}>
            <CardContactFull onShowMore={handleShowMore} person={p} />
          </div>
        ))}
      </div>

      <ContactBioModal onClose={handleClose} person={selected} show={showModal} />
    </div>
  );
};

export default DirectoryFullView;
