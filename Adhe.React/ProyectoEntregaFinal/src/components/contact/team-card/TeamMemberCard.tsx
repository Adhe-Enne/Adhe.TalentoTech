import React from "react";

import { type Person } from "../../../models";
import styles from "./TeamMemberCard.module.css";

interface TeamMemberCardProps {
  person: Person;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = (props) => {
  const { person } = props;
  const { name: nombre, position: puesto, email, photo, linkedin } = person;

  return (
    <div className={`card p-2 ${styles.card}`}>
      <div className="d-flex align-items-center">
        <img alt={nombre} className={`me-3 ${styles.photo}`} src={photo ?? "/images/avatar1.svg"} />
        <div className={styles.info}>
          <h5 className={`mb-1 ${styles.name}`}>{nombre}</h5>
          <p className={`mb-1 ${styles.position}`}>{puesto}</p>
          {email && (
            <a className={styles.email} href={`mailto:${email}`}>
              {email}
            </a>
          )}
          {linkedin && (
            <div>
              <a className={styles.email} href={linkedin} rel="noopener noreferrer" target="_blank">
                Perfil LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
