import React, { useMemo } from "react";

import type { ProviderProps } from "../../models/ProviderProps";
import type { TeamContextType } from "./TeamTypes";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import { teamService } from "../../services/teamService";
import TeamContext from "./TeamContext";

const TeamProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const { data: team, error, loading, reload } = useAsyncCollection(() => teamService.fetchTeam());

  const value: TeamContextType = useMemo(() => ({ team, loading, error, reload }), [team, loading, error, reload]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export default TeamProvider;
