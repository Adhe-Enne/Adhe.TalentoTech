import React from "react";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import HelmetMeta from "../ui/HelmetMeta";

interface RegisterProps {
  confirmPassword: string;
  email: string;
  error: string | null;
  loading: boolean;
  password: string;
  onConfirmPasswordChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.SubmitEvent) => void;
}

const Register: React.FC<RegisterProps> = (props) => {
  const { email, error, loading, password, confirmPassword, onEmailChange, onPasswordChange, onConfirmPasswordChange, onSubmit } = props;

  return (
    <>
      <HelmetMeta description="Regístrate en Talento Tech." title="Talento Tech | Registro" />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Crear cuenta</h2>
            <form noValidate onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="reg-email">
                  Correo electrónico
                </label>
                <input
                  autoComplete="email"
                  className="form-control"
                  id="reg-email"
                  onChange={(e) => onEmailChange(e.target.value)}
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
