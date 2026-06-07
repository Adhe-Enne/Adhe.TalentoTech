import React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = (props) => {
  const { children } = props;
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

export default GuestRoute;
