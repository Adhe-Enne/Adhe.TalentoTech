import React from "react";

import { type Person } from "../../../models";
import styles from "./TarjetaContacto.module.css";

interface TarjetaContactoProps {
  person: Person;
}

const TarjetaContacto: React.FC<TarjetaContactoProps> = (props) => {
  const { person } = props;
  const { nombre, puesto, email, foto } = person;

  return (
    <div className={`card p-2 ${styles.card}`}>
      <div className="d-flex align-items-center">
        <img alt={nombre} className={`me-3 ${styles.photo}`} src={foto} />
        <div className={styles.info}>
          <h5 className={`mb-1 ${styles.name}`}>{nombre}</h5>
          <p className={`mb-1 ${styles.position}`}>{puesto}</p>
          <a className={styles.email} href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TarjetaContacto;
