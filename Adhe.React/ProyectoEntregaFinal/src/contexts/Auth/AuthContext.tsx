import type { UserInfo } from "../../types/auth";

import { createTypedContext } from "../../utils/context";

export type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

export default createTypedContext<AuthContextType>();
