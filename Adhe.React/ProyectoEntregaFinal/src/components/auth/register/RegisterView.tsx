import React from "react";
import { Link } from "react-router-dom";

import SubmitButton from "../../ui/SubmitButton";
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-email">
            Correo electrónico
          </label>
          <input autoComplete="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent" id="reg-email" onChange={(e) => onEmailChange(e.target.value)} placeholder="tu@email.com" required type="email" value={email} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-password">
            Contraseña
          </label>
          <input
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-confirm">
            Confirmar contraseña
          </label>
          <input
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
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
          <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <SubmitButton loading={loading} loadingLabel="Creando cuenta...">
          Crear cuenta
        </SubmitButton>
      </form>
      <p className="text-center mt-3 mb-0 text-sm">
        ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterView;
