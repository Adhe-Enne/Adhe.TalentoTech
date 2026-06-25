import React from "react";

import type { Person } from "../../models";

import useTeam from "../../hooks/selectors/useTeam";
import TeamList from "./TeamList";

const TeamListContainer: React.FC = () => {
  const { error, loading, team } = useTeam();

  const limitedTeam: Person[] = team.slice(0, 6);

  return <TeamList error={error} loading={loading} team={limitedTeam} />;
};

export default TeamListContainer;
