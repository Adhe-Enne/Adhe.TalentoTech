import React from "react";
import { Link } from "react-router-dom";

import SubmitButton from "../../ui/SubmitButton";
import AuthLayout from "../AuthLayout";

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
        <div className="flex items-center justify-between py-2 px-3 bg-info/10 border border-info/20 text-info rounded-lg text-sm" role="alert">
          <span>{redirectMessage}</span>
          <button aria-label="Cerrar" className="ml-2 text-info hover:text-info/80 text-xs" onClick={onDismiss} type="button">
            ✕
          </button>
        </div>
      )}

      <form noValidate onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">
            Correo electrónico
          </label>
          <input
            autoComplete="email"
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
            Contraseña
          </label>
          <input autoComplete="current-password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent" id="login-password" onChange={(e) => onPasswordChange(e.target.value)} placeholder="••••••" required type="password" value={password} />
        </div>
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <SubmitButton loading={loading} loadingLabel="Ingresando...">
          Ingresar
        </SubmitButton>
      </form>
      <p className="text-center mt-3 mb-0 text-sm">
        ¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginView;
