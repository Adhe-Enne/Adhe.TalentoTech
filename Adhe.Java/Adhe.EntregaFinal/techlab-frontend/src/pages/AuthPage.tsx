import React, { useState, type JSX } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function AuthPage(): JSX.Element {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full flex justify-center">
        <div className="inline-flex rounded-md bg-transparent p-1 shadow-sm">
          <button
            onClick={() => setMode('login')}
            className={
              'px-4 py-2 rounded-md font-medium transition-colors ' +
              (mode === 'login' ? 'bg-white text-blue-600 shadow' : 'bg-gray-200 text-gray-700')
            }
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={
              'px-4 py-2 rounded-md font-medium transition-colors ' +
              (mode === 'register' ? 'bg-white text-green-600 shadow' : 'bg-gray-200 text-gray-700')
            }
          >
            Registrarse
          </button>
        </div>
      </div>

      <div className="mt-8 w-full flex items-center justify-center px-4">
        <div className="w-full max-w-lg">{mode === 'login' ? <LoginPage /> : <RegisterPage />}</div>
      </div>
    </div>
  );
}
