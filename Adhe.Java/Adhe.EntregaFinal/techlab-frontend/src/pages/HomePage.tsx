import React, { type JSX } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">TechLab Frontend</h1>
        <p className="mb-4">Demo home. Use the login to access protected routes.</p>
        <div className="flex gap-2">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </Link>
          <Link to="/dashboard" className="px-4 py-2 bg-gray-200 rounded">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
