import React, { useCallback, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate, type Location, type NavigateFunction } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import HelmetMeta from "../../ui/HelmetMeta";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const { login } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const from: string = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
  const redirectMessage: string | null = from === "/" ? null : "Debés iniciar sesión para acceder a esta página";

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

  const handleDismiss: () => void = useCallback(() => setDismissed(true), []);

  return (
    <>
      <HelmetMeta description="Inicia sesión en Talento Tech." title="Talento Tech | Iniciar Sesión" />
      <div className={`d-flex justify-content-center align-items-center ${styles.authPage}`}>
        <div className={`card shadow-sm ${styles.authCard}`}>
          <div className="card-body p-4">
            {redirectMessage && !dismissed && (
              <Alert className="d-flex align-items-center justify-content-between py-2 small" variant="info">
                <span>{redirectMessage}</span>
                <button aria-label="Cerrar" className={`btn-close ms-2 ${styles.closeBtn}`} onClick={handleDismiss} type="button" />
              </Alert>
            )}

            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-email">
                  Correo electrónico
                </label>
                <input
                  autoComplete="email"
                  autoFocus
                  className="form-control"
                  id="login-email"
                  onChange={(e) => {
                    setDismissed(true);
                    setEmail(e.target.value);
                  }}
                  placeholder="tu@email.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="login-password">
                  Contraseña
                </label>
                <input
                  autoComplete="current-password"
                  className="form-control"
                  id="login-password"
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  type="password"
                  value={password}
                />
              </div>
              {error && (
                <Alert className="py-2 small" variant="danger">
                  {error}
                </Alert>
              )}
              <Button aria-label="Iniciar sesión" className="w-100" disabled={loading} type="submit" variant="primary">
                {loading && <Spinner animation="border" className="me-2" size="sm" />}
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
            <p className="text-center mt-3 mb-0 small">
              ¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
