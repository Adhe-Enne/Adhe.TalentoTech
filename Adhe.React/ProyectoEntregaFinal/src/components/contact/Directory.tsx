import React from "react";

import { type Person } from "../../models";
import CardContact from "./contact-card/CardContact";
import styles from "./Directory.module.css";

interface DirectoryProps {
  loading: boolean;
  people: Person[];
  error?: string | null;
}

const Directory: React.FC<DirectoryProps> = (props) => {
  const { loading, error, people } = props;

  if (loading) {
    return <div className={styles.loading}>Cargando equipo...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Equipo</h3>
      <div className={styles.grid}>
        {people.map((p) => (
          <CardContact key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
};

export default Directory;
