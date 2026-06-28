import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

import type { UserInfo } from "../../../types/auth";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import { useAuthForm } from "../../../hooks/useAuthForm";
import RegisterView from "./RegisterView";

const Register: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { setNotification } = useNotification();

  const { email, loading, password, error, setEmail, setPassword, setError, navigate, executeAuth } = useAuthForm();
  const { signup } = useAuth();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
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

      const toastId: string | number = toast.loading("Creando cuenta...");
      executeAuth(async () => {
        const user: UserInfo = await signup(email, password);
        toast.update(toastId, { autoClose: 4000, isLoading: false, render: `¡Cuenta creada! Bienvenido, ${user.email}`, type: "success" });
        navigate("/");
      }).catch(() => {
        setNotification("Error al crear la cuenta", 3000, "danger");
      });
    },
    [email, password, confirmPassword, signup, navigate, executeAuth, setError, setNotification],
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
