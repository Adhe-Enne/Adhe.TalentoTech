import React from "react";
import { FaArrowRight, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Person } from "../../models";

import LoadingSpinner from "../ui/LoadingSpinner";
import styles from "./TeamList.module.css";

interface TeamListViewProps {
  error: string | null;
  loading: boolean;
  team: Person[];
}

const TeamListView: React.FC<TeamListViewProps> = (props) => {
  const { error, loading, team } = props;
  const limitedTeam: Person[] = team.slice(0, 6);

  if (loading) {
    return <LoadingSpinner message="Cargando equipo..." />;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className={styles.title}>Equipo</h3>
        <Link aria-label="Ver todo el equipo" className="btn btn-ghost btn-sm" to="/equipo">
          Ver todos
          <FaArrowRight aria-hidden="true" className="ms-1" />
        </Link>
      </div>
      <div className={styles.grid}>
        {limitedTeam.map((p) => {
          const { name: nombre, position: puesto, email, photo, linkedin } = p;
          return (
            <div className="card p-2" key={p.id}>
              <div className="d-flex align-items-center">
                <img alt={nombre} className="me-3" src={photo ?? "/images/avatar1.svg"} style={{ borderRadius: "50%", height: 64, objectFit: "cover", width: 64 }} />
                <div>
                  <h5 className="mb-1">{nombre}</h5>
                  <p className="mb-1 text-muted small">{puesto}</p>
                  {email && (
                    <a aria-label={`Email de ${nombre}`} className="small" href={`mailto:${email}`}>
                      <FaEnvelope aria-hidden="true" className="me-1" />
                      {email}
                    </a>
                  )}
                  {linkedin && (
                    <div>
                      <a aria-label={`LinkedIn de ${nombre}`} className="small" href={linkedin} rel="noopener noreferrer" target="_blank">
                        <FaLinkedin aria-hidden="true" className="me-1" />
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamListView;
