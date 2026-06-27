import React, { useCallback, useMemo } from "react";

import type { Person } from "../../models/Person";
import type { ProviderProps } from "../../types/ProviderProps";
import type { TeamContextType } from "./TeamContext";

import { useCollectionCrud } from "../../hooks/useCollectionCrud";
import { teamService } from "../../services/teamService";
import TeamContext from "./TeamContext";

export const TeamProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const fetchAll: () => Promise<Person[]> = useCallback(() => teamService.fetchTeam(), []);
  const { data: team, error, loading, reload } = useCollectionCrud(fetchAll);

  const value: TeamContextType = useMemo(() => ({ team, loading, error, reload }), [team, loading, error, reload]);

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export default TeamProvider;
