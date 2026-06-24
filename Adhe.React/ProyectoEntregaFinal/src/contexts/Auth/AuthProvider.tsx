import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { UserInfo } from "../../types/auth";
import type { ProviderProps } from "../../types/ProviderProps";
import type { AuthContextType } from "./AuthTypes";

import { authService } from "../../services/authService";
import AuthContext from "./AuthContext";

export const AuthProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    const unsubscribe: () => void = authService.onAuthStateChanged((currentUser: UserInfo | null) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login: (email: string, password: string) => Promise<UserInfo> = useCallback(async (email: string, password: string): Promise<UserInfo> => {
    const userInfo: UserInfo = await authService.login(email, password);
    return userInfo;
  }, []);

  const signup: (email: string, password: string) => Promise<UserInfo> = useCallback(async (email: string, password: string): Promise<UserInfo> => {
    const userInfo: UserInfo = await authService.signup(email, password);
    return userInfo;
  }, []);

  const logout: () => Promise<void> = useCallback(async () => {
    await authService.logout();
  }, []);

  const isAdmin: boolean = user?.rol === "admin";

  const value: AuthContextType = useMemo(() => ({ user, loading, login, signup, logout, isAdmin }), [user, loading, login, signup, logout, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
