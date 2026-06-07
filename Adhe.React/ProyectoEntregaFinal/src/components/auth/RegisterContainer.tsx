import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import Register from "./Register";

const RegisterContainer: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { signup } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit: (e: React.FormEvent) => void = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        setError("El correo electrónico es obligatorio");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      setLoading(true);

      try {
        const user = await signup(email, password);
        setNotification(`Cuenta creada! Bienvenido, ${user.email}`, 4000, "success");
        navigate("/");
      } catch (err: unknown) {
        const msg: string = err instanceof Error ? err.message : "Error al crear la cuenta";
        setError(msg);
        setNotification(msg, 4000, "danger");
      } finally {
        setLoading(false);
      }
    },
    [email, password, confirmPassword, signup, navigate, setNotification],
  );

  return (
    <Register
      confirmPassword={confirmPassword}
      email={email}
      error={error}
      loading={loading}
      password={password}
      onConfirmPasswordChange={setConfirmPassword}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterContainer;
