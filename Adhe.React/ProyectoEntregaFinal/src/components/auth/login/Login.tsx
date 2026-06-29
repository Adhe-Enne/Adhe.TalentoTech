import React, { useCallback, useState } from "react";
import { useLocation, type Location } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import { isValidEmail } from "../../../utils/validators";
import LoginView from "./LoginView";

const Login: React.FC = () => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  const { email, loading, password, error, setEmail, setPassword, navigate, executeAuth } = useAuthForm();
  const { login } = useAuth();
  const location: Location = useLocation();

  const from: string = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
  const redirectMessage: string | null = from === "/" ? null : "Debés iniciar sesión para acceder a esta página";

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      executeAuth(async () => {
        if (!email.trim()) {
          throw new Error("El correo electrónico es obligatorio");
        }
        if (!isValidEmail(email.trim())) {
          throw new Error("El formato del correo electrónico no es válido");
        }
        if (!password) {
          throw new Error("La contraseña es obligatoria");
        }
        await login(email, password);
        navigate(from, { replace: true });
      });
    },
    [email, password, login, navigate, from, executeAuth],
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
