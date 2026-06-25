import React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = (props) => {
  const { children } = props;
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (user) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
};

export default GuestRoute;
