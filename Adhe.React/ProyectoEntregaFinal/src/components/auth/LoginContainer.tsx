import React, { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate, type Location, type NavigateFunction } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import Login from "./Login";

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const from: string = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const redirectMessage: string | null = useMemo<string | null>(() => {
    if (from !== "/") {
      return "Debés iniciar sesión para acceder a esta página";
    }
    return null;
  }, [from]);

  const handleSubmit: (e: React.SubmitEvent) => Promise<void> = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        await login(email, password);
        setNotification("Sesión iniciada correctamente", 3000, "success");
        navigate(from, { replace: true });
      } catch (err: unknown) {
        const msg: string = err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(msg);
        setNotification(msg, 4000, "danger");
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate, setNotification, from],
  );

  return (
    <Login
      email={email}
      error={error}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      password={password}
      redirectMessage={redirectMessage}
    />
  );
};

export default LoginContainer;
