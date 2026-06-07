import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import Profile from "./Profile";

const ProfileContainer: React.FC = () => {
  const { user, logout } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const handleLogout: () => Promise<void> = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      setNotification("Sesión cerrada", 3000, "info");
      navigate("/login");
    } catch {
      setNotification("Error al cerrar sesión", 3000, "danger");
    } finally {
      setLoggingOut(false);
      setShowConfirm(false);
    }
  }, [logout, navigate, setNotification]);

  return (
    <Profile
      loggingOut={loggingOut}
      onConfirmClose={() => setShowConfirm(false)}
      onConfirmOpen={() => setShowConfirm(true)}
      onLogout={handleLogout}
      onNavigateHome={() => navigate("/")}
      showConfirm={showConfirm}
      user={user}
    />
  );
};

export default ProfileContainer;
