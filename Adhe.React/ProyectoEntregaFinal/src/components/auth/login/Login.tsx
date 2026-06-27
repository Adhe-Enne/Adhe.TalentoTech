import React, { useCallback, useState } from "react";
import { useLocation, type Location } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import { useAuthForm } from "../../../hooks/useAuthForm";
import LoginView from "./LoginView";

const Login: React.FC = () => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  const { email, loading, password, error, setEmail, setPassword, navigate, executeAuth } = useAuthForm();
  const { login } = useAuth();
  const { setNotification } = useNotification();
  const location: Location = useLocation();

  const from: string = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
  const redirectMessage: string | null = from === "/" ? null : "Debés iniciar sesión para acceder a esta página";

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      executeAuth(async () => {
        await login(email, password);
        setNotification("Sesión iniciada correctamente", 3000, "success");
        navigate(from, { replace: true });
      }).catch(() => {
        setNotification("Error al iniciar sesión", 3000, "danger");
      });
    },
    [email, password, login, navigate, from, executeAuth, setNotification],
  );

  const handleDismiss: () => void = useCallback(() => setDismissed(true), []);

  return (
    <LoginView
      dismissed={dismissed}
      email={email}
      error={error}
      loading={loading}
      onDismiss={handleDismiss}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      password={password}
      redirectMessage={redirectMessage}
    />
  );
};

export default Login;
