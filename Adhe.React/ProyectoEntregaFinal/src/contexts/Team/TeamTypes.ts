import type { Person } from "../../models";

export type TeamContextType = {
  team: Person[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};
