import type { TeamContextType } from "../../contexts/Team/TeamContext";

import TeamContext from "../../contexts/Team/TeamContext";
import { createSelectorHook } from "./factory";

const useTeam: () => TeamContextType = createSelectorHook(TeamContext, "Team");

export default useTeam;
