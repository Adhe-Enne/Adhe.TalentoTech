import React from "react";

import { type Person } from "../../../models";
import styles from "./CardContactFull.module.css";

interface CardContactFullProps {
  person: Person;
  onShowMore?: (p: Person) => void;
}

const CardContactFull: React.FC<CardContactFullProps> = (props) => {
  const { person, onShowMore } = props;
  const { name, position, email, linkedin, bio, photo } = person;

  return (
    <div className={styles.cardFull}>
      <div className={styles.photoWrap}>
        <img alt={name} className={styles.photoFull} src={photo ?? "/images/avatar1.svg"} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h4 className={styles.name}>{name}</h4>
            {position && <div className={styles.meta}>{position}</div>}
          </div>

          <div className={styles.links}>
            {email && (
              <a className="btn btn-ghost btn-sm" href={`mailto:${email}`}>
                Email
              </a>
            )}
            {linkedin && (
              <a className="btn btn-outline-primary btn-sm" href={linkedin} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {bio && (
          <>
            <div className={styles.bio}>{bio}</div>
            <div>
              <button aria-label={`Ver más bio de ${name}`} className="btn btn-ghost btn-sm" onClick={() => onShowMore?.(person)} type="button">
                Ver más
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardContactFull;
