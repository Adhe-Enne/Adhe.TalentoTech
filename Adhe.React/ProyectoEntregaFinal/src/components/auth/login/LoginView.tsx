import React from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import AuthLayout from "../AuthLayout";
import styles from "./Login.module.css";

interface LoginViewProps {
  dismissed: boolean;
  email: string;
  error: string | null;
  loading: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  password: string;
  redirectMessage: string | null;
  onDismiss: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const LoginView: React.FC<LoginViewProps> = (props) => {
  const { dismissed, email, error, loading, password, redirectMessage, onDismiss, onEmailChange, onPasswordChange, onSubmit } = props;

  return (
    <AuthLayout helmetDescription="Inicia sesión en Talento Tech." helmetTitle="Talento Tech | Iniciar Sesión" title="Iniciar Sesión">
      {redirectMessage && !dismissed && (
        <Alert className="d-flex align-items-center justify-content-between py-2 small" variant="info">
          <span>{redirectMessage}</span>
          <button aria-label="Cerrar" className={`btn-close ms-2 ${styles.closeBtn}`} onClick={onDismiss} type="button" />
        </Alert>
      )}

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
              onDismiss();
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
          <input autoComplete="current-password" className="form-control" id="login-password" onChange={(e) => onPasswordChange(e.target.value)} placeholder="••••••" required type="password" value={password} />
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
    </AuthLayout>
  );
};

export default LoginView;
