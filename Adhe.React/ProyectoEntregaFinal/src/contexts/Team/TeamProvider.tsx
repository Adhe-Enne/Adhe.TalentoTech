import React, { useCallback, useMemo } from "react";

import type { Person } from "../../models/Person";
import type { ProviderProps } from "../../models/ProviderProps";
import type { TeamContextType } from "./TeamTypes";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import { teamService } from "../../services/teamService";
import TeamContext from "./TeamContext";

const TeamProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const fetchAllTeam: () => Promise<Person[]> = useCallback(() => teamService.fetchTeam(), []);
  const { data: team, error, loading, reload } = useAsyncCollection(fetchAllTeam);

  const value: TeamContextType = useMemo(() => ({ team, loading, error, reload }), [team, loading, error, reload]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export default TeamProvider;
