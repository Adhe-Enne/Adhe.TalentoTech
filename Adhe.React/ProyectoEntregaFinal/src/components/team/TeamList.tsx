import React from "react";
import { Link } from "react-router-dom";

import { type Person } from "../../models";
import TeamMemberCard from "./team-card/TeamMemberCard";
import styles from "./TeamList.module.css";

interface TeamListProps {
  loading: boolean;
  team: Person[];
  error?: string | null;
}

const TeamList: React.FC<TeamListProps> = (props) => {
  const { loading, error, team } = props;

  if (loading) {
    return <div className={styles.loading}>Cargando equipo...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className={styles.title}>Equipo</h3>
        <Link className="btn btn-ghost btn-sm" to="/equipo">
          Ver todos
        </Link>
      </div>
      <div className={styles.grid}>
        {team.map((p) => (
          <TeamMemberCard key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
};

export default TeamList;
