import { createContext, type Context } from "use-context-selector";

import type { TeamContextType } from "./TeamTypes";

const TeamContext: Context<TeamContextType | undefined> = createContext<TeamContextType | undefined>(undefined);

export default TeamContext;
