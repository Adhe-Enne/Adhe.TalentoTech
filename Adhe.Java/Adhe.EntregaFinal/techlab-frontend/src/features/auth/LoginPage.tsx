import React, { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAuth';
import { login } from './authSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

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
      // if fulfilled, navigate to dashboard
      if (login.fulfilled.match(action)) {
        navigate('/dashboard');
      }
    } catch (err) {
      // handled in slice
      console.error('Login failed:', err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Iniciar sesión</h2>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {authState.error && <p className="text-red-600 mb-2">{authState.error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          disabled={authState.loading}
        >
          {authState.loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
