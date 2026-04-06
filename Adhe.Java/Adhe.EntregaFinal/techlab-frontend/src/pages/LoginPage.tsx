import React, { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAuth';
import { login } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const action = await dispatch(login({ email, password }));
      if (login.fulfilled.match(action)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  // Form only — layout is provided by AuthPage
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {authState.error && <p className="text-red-600 mb-4">{authState.error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-60"
        disabled={authState.loading}
      >
        {authState.loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
