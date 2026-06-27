import React from "react";
import { Navigate, useLocation, type Location } from "react-router-dom";

import type { UserRole } from "../../../types/shared";

import useAuth from "../../../hooks/selectors/useAuth";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  mode: "guest" | "protected";
  allowedRoles?: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { allowedRoles, children, mode } = props;
  const { user, loading } = useAuth();
  const location: Location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (mode === "guest") {
    return user ? <Navigate replace to="/" /> : <>{children}</>;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
