import React from "react";

import { type Person } from "../../models";
import TarjetaContacto from "./contact-card/TarjetaContacto";
import styles from "./Directorio.module.css";

interface DirectorioProps {
  loading: boolean;
  people: Person[];
  error?: string | null;
}

const Directorio: React.FC<DirectorioProps> = (props) => {
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
          <TarjetaContacto key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
};

export default Directorio;
