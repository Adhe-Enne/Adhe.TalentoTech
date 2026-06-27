import type { Person } from "../../models";

import { createTypedContext } from "../../utils/context";

export type TeamContextType = {
  team: Person[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export default createTypedContext<TeamContextType>();
