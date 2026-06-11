import React, { useCallback, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import HelmetMeta from "../ui/HelmetMeta";

interface LoginProps {
  email: string;
  error: string | null;
  loading: boolean;
  password: string;
  redirectMessage: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.SubmitEvent) => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const { email, error, loading, password, redirectMessage, onEmailChange, onPasswordChange, onSubmit } = props;
  const [dismissed, setDismissed] = useState<boolean>(false);

  const handleDismiss: () => void = useCallback(() => setDismissed(true), []);

  return (
    <>
      <HelmetMeta description="Inicia sesión en Talento Tech." title="Talento Tech | Iniciar Sesión" />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4">
          {redirectMessage && !dismissed && (
            <Alert variant="info" className="d-flex align-items-center justify-content-between py-2 small">
              <span>{redirectMessage}</span>
              <button aria-label="Cerrar" className="btn-close ms-2" onClick={handleDismiss} style={{ fontSize: "0.75rem" }} type="button" />
            </Alert>
          )}

          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <form noValidate onSubmit={onSubmit}>
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
                  onEmailChange(e.target.value);
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
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••"
                required
                type="password"
                value={password}
              />
            </div>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            <Button aria-label="Iniciar sesión" variant="primary" className="w-100" disabled={loading} type="submit">
              {loading && <Spinner animation="border" size="sm" className="me-2" />}
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
