import React, { useCallback, useState } from "react";

import useAuth from "../../../hooks/selectors/useAuth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import { hasNumber, hasUpperCase, isValidEmail } from "../../../utils/validators";
import { withToast } from "../../../utils/withToast";
import RegisterView from "./RegisterView";

const Register: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { email, loading, password, error, setEmail, setPassword, setError, navigate, executeAuth } = useAuthForm();
  const { signup } = useAuth();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      setError(null);
      const trimmedEmail: string = email.trim();

      if (!trimmedEmail) {
        setError("El correo electrónico es obligatorio");
        return;
      }

      if (!isValidEmail(trimmedEmail)) {
        setError("El formato del correo electrónico no es válido");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (!hasUpperCase(password)) {
        setError("La contraseña debe contener al menos una mayúscula");
        return;
      }

      if (!hasNumber(password)) {
        setError("La contraseña debe contener al menos un número");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      withToast(
        () =>
          executeAuth(async () => {
            await signup(email, password);
            navigate("/");
          }),
        "Creando cuenta...",
        `¡Cuenta creada! Bienvenido, ${email}`,
        "Error al crear la cuenta",
      );
    },
    [email, password, confirmPassword, signup, navigate, executeAuth, setError],
  );

  return (
    <RegisterView
      confirmPassword={confirmPassword}
      email={email}
      error={error}
      loading={loading}
      onConfirmPasswordChange={setConfirmPassword}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      password={password}
    />
  );
};

export default Register;
