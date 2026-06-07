import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4">
          {redirectMessage && !dismissed && (
            <div className="alert alert-info d-flex align-items-center justify-content-between py-2 small" role="alert">
              <span>{redirectMessage}</span>
              <button aria-label="Cerrar" className="btn-close ms-2" onClick={handleDismiss} style={{ fontSize: "0.75rem" }} type="button" />
            </div>
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
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <button className="btn btn-primary w-100" disabled={loading} type="submit">
              {loading && <span className="spinner-border spinner-border-sm me-2" />}
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <p className="text-center mt-3 mb-0 small">
            ¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
