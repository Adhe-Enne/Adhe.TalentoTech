import React, { useCallback, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

import type { UserInfo } from "../../../types/auth";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import HelmetMeta from "../../ui/HelmetMeta";
import styles from "./Register.module.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { signup } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit: (e: React.SubmitEvent) => Promise<void> = useCallback(
    async (e: React.SubmitEvent) => {
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
        const user: UserInfo = await signup(email, password);
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
    <>
      <HelmetMeta description="Regístrate en Talento Tech." title="Talento Tech | Registro" />
      <div className={`d-flex justify-content-center align-items-center ${styles.authPage}`}>
        <div className={`card shadow-sm ${styles.authCard}`}>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Crear cuenta</h2>
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="reg-email">
                  Correo electrónico
                </label>
                <input
                  autoComplete="email"
                  className="form-control"
                  id="reg-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="reg-password">
                  Contraseña
                </label>
                <input
                  autoComplete="new-password"
                  className="form-control"
                  id="reg-password"
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  type="password"
                  value={password}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirmar contraseña
                </label>
                <input
                  autoComplete="new-password"
                  className="form-control"
                  id="reg-confirm"
                  minLength={6}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí la contraseña"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </div>
              {error && (
                <Alert className="py-2 small" variant="danger">
                  {error}
                </Alert>
              )}
              <Button aria-label="Crear cuenta" className="w-100" disabled={loading} type="submit" variant="primary">
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
            <p className="text-center mt-3 mb-0 small">
              ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
