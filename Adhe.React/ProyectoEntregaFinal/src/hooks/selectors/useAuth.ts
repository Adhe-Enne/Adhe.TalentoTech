import { useContextSelector } from "use-context-selector";

import type { AuthContextType } from "../../contexts/Auth/AuthTypes";

import AuthContext from "../../contexts/Auth/AuthContext";

const useAuth: () => AuthContextType = (): AuthContextType => {
  const user: AuthContextType["user"] | undefined = useContextSelector(AuthContext, (c) => c?.user);
  const loading: AuthContextType["loading"] | undefined = useContextSelector(AuthContext, (c) => c?.loading);
  const login: AuthContextType["login"] | undefined = useContextSelector(AuthContext, (c) => c?.login);
  const signup: AuthContextType["signup"] | undefined = useContextSelector(AuthContext, (c) => c?.signup);
  const logout: AuthContextType["logout"] | undefined = useContextSelector(AuthContext, (c) => c?.logout);
  const isAdmin: AuthContextType["isAdmin"] | undefined = useContextSelector(AuthContext, (c) => c?.isAdmin);

  if (user === undefined || loading === undefined || login === undefined || signup === undefined || logout === undefined || isAdmin === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return { user, loading, login, signup, logout, isAdmin };
};

export default useAuth;
