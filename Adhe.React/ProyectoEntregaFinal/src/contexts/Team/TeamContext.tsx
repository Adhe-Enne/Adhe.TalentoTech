import type { Person } from "../../models";

import { createTypedContext } from "../../utils/context";

export interface TeamContextType  {
  error: string | null;
  loading: boolean;
  team: Person[];
  reload: () => void;
};

export default createTypedContext<TeamContextType>();
