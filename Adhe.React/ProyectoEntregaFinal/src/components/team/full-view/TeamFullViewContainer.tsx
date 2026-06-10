import React from "react";

import useTeam from "../../../hooks/useTeam";
import HelmetMeta from "../../ui/HelmetMeta";
import TeamFullView from "./TeamFullView";

const TeamFullViewContainer: React.FC = () => {
  const { error, loading, team } = useTeam();

  return (
    <>
      <HelmetMeta description="Conoce a nuestro equipo en Talento Tech." title="Talento Tech | Equipo" />
      <TeamFullView error={error} loading={loading} team={team} />
    </>
  );
};

export default TeamFullViewContainer;
