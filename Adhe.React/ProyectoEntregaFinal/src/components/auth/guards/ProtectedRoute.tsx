import React from "react";
import { Navigate, useLocation, type Location } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "user")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { allowedRoles, children } = props;
  const { user, loading } = useAuth();
  const location: Location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
