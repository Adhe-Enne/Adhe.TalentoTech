import React from "react";
import { Navigate, useLocation, type Location } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  rolesPermitidos?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { children, rolesPermitidos } = props;
  const { user, loading } = useAuth();
  const location: Location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
