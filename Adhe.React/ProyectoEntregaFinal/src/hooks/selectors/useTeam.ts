import { useContextSelector } from "use-context-selector";

import type { TeamContextType } from "../../contexts/Team/TeamTypes";

import TeamContext from "../../contexts/Team/TeamContext";

const useTeam: () => TeamContextType = (): TeamContextType => {
  const team: TeamContextType["team"] | undefined = useContextSelector(TeamContext, (c) => c?.team);
  const loading: TeamContextType["loading"] | undefined = useContextSelector(TeamContext, (c) => c?.loading);
  const error: TeamContextType["error"] | undefined = useContextSelector(TeamContext, (c) => c?.error);
  const reload: TeamContextType["reload"] | undefined = useContextSelector(TeamContext, (c) => c?.reload);

  if (team === undefined || loading === undefined || error === undefined || reload === undefined) {
    throw new Error("useTeam must be used within TeamProvider");
  }

  return { team, loading, error, reload };
};

export default useTeam;
