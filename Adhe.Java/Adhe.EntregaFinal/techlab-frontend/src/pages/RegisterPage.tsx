import React, { useState, type JSX } from 'react';
import { registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage(): JSX.Element {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerApi({ nombre, email, password });
      // after register, redirect to login (or auto-login could be implemented)
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrar');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Crear cuenta</h2>
      </div>

      <div className="mb-4">
        <label htmlFor="nombre" className="block mb-2 text-sm font-medium">
          Nombre
        </label>
        <input
          id="nombre"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          className="w-full px-3 py-2 border rounded-md"
          type="email"
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
          className="w-full px-3 py-2 border rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrarme'}
      </button>
    </form>
  );
}
