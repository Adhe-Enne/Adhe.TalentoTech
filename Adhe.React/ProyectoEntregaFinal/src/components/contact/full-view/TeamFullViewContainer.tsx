import React from "react";

import useTeam from "../../../hooks/useTeam";
import TeamFullView from "./TeamFullView";

const TeamFullViewContainer: React.FC = () => {
  const { error, loading, team } = useTeam();

  return <TeamFullView error={error} loading={loading} team={team} />;
};

export default TeamFullViewContainer;
