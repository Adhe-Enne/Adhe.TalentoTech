import type { UserInfo } from "../../types/auth";

export type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};
