import React from "react";

import useTeam from "../../hooks/selectors/useTeam";
import TeamListView from "./TeamListView";

const TeamList: React.FC = () => {
  const { error, loading, team } = useTeam();

  return <TeamListView error={error} loading={loading} team={team} />;
};

export default TeamList;
