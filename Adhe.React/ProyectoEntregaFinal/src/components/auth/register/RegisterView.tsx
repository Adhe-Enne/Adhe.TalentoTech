import React from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import AuthLayout from "../AuthLayout";

interface RegisterViewProps {
  confirmPassword: string;
  email: string;
  error: string | null;
  loading: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  password: string;
  onConfirmPasswordChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const RegisterView: React.FC<RegisterViewProps> = (props) => {
  const { confirmPassword, email, error, loading, password, onConfirmPasswordChange, onEmailChange, onPasswordChange, onSubmit } = props;

  return (
    <AuthLayout helmetDescription="Regístrate en Talento Tech." helmetTitle="Talento Tech | Registro" title="Crear cuenta">
      <form noValidate onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="reg-email">
            Correo electrónico
          </label>
          <input autoComplete="email" className="form-control" id="reg-email" onChange={(e) => onEmailChange(e.target.value)} placeholder="tu@email.com" required type="email" value={email} />
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
          {loading && <Spinner animation="border" className="me-2" size="sm" />}
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
      <p className="text-center mt-3 mb-0 small">
        ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterView;
