import type { UserInfo } from "../../types/auth";

import { createTypedContext } from "../../utils/context";

export interface AuthContextType  {
  isAdmin: boolean;
  loading: boolean;
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserInfo>;
};

export default createTypedContext<AuthContextType>();
