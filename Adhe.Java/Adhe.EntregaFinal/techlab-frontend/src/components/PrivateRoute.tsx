import { type JSX } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../app/store';

export default function PrivateRoute({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const token = useSelector((s: RootState) => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
